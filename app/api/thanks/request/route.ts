import getCurrentUser from "@/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { destinationUser, amount } = body;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.thanksRequest.create({
    data: {
      userId: destinationUser.id,
      opponentUserId: currentUser.id,
      amount: amount,
      isUserRead: false,
      isOpponentRead: false,
      deletedAt: null,
      completedAt: null,
    },
  });

  return NextResponse.json({ message: "Request is sent" });
}
