import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import getCurrentUser from "./getCurrentUser";

export default async function getStripeAccount() {
  // noStore();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.stripeAccountId) {
      return null;
    }

    const accountId = currentUser.stripeAccountId;

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY as string);

    const account = await stripe.accounts.retrieve(accountId);

    const data = {
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    };

    return data;
  } catch (e: any) {
    return null;
  }
}
