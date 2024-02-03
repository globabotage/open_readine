import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const body = await request.json();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { accountId } = body;
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  try {
    let stripe;

    stripe = require("stripe")(process.env.STRIPE_SECRET_KEY as string);

    const account = await stripe.accounts.create({
      type: "express",
      country: "JP",
      business_type: "individual",
      //capabilitiesを以下のように設定しないと国と事業種別選択画面が表示されてしまう
      //capabilitiesについて https://stripe.com/docs/connect/account-capabilities#card-payments
      capabilities: {
        card_payments: {
          requested: false,
        },
        transfers: {
          requested: true,
        },
      },
      business_profile: {
        mcc: "5734", //https://stripe.com/docs/connect/setting-mcc
        url: "https://readine.jp",
        product_description: "writer",
      },
    });

    const user = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        stripeAccountId: account.id,
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "https://readine.jp/thanks",
      return_url: `https://readine.jp/thanks`,
      type: "account_onboarding",
    });
    //   return NextResponse.json(accountLink.url);
    return NextResponse.json({ url: accountLink.url });
  } catch (e: any) {
    return new NextResponse(e, { status: 500 });
  }
}
