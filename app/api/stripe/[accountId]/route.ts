import { NextResponse } from "next/server";

interface IParams {
  accountId: string;
}

export async function POST(request: Request, { params }: { params: any }) {
  const { accountId } = params;

  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY as string);

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: "https://readine.jp/thanks",
    return_url: `https://readine.jp/thanks`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
