import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { sessionId, userId } = body;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY as string);

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  //commision is 7% of the amount
  const amount = session.amount_total - Math.floor(session.amount_total * 0.07);
  const paymentId = session.payment_intent;

  const thanks = await prisma.thanks.create({
    data: {
      userId: userId,
      opponentUserId: currentUser.id,
      stripePaymentId: paymentId,
      amount: amount,
      isRead: false,
      content: "Thanksで応援してくれました！",
    },
  });

  await prisma.thanksRequest.updateMany({
    where: {
      AND: [
        { userId: userId },
        { opponentUserId: currentUser.id },
        { completedAt: null },
      ],
    },
    data: {
      completedAt: new Date(),
    },
  });

  return NextResponse.json(thanks);
}
