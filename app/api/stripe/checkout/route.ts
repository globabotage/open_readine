import getCurrentUser from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { destinationUser, amount, pathname } = body;

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY as string);

    const session = await stripe.checkout.sessions.create({
      //parameters:https://stripe.com/docs/api/checkout/sessions/create
      mode: "payment",
      line_items: [
        {
          // price: 100,
          //the abobe price parameter means the id of existing products
          price_data: {
            currency: "jpy",
            product_data: {
              name: `Thanksで${destinationUser.name}を応援する`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: amount * 0.2,
        transfer_data: {
          destination: destinationUser.stripeAccountId,
        },
      },
      success_url: `${process.env.NEXTAUTH_URL}/thanks/success?session_id={CHECKOUT_SESSION_ID}&user=${destinationUser.id}&pathname=${pathname}`,

      cancel_url: "https://readine.jp",

      //the following is optional parameters
      locale: "ja",
      customer_email: currentUser?.email,
      submit_type: "pay",
    });

    return NextResponse.json(session);
  } catch (e) {
    return NextResponse.json(e);
  }
}
