import { NextResponse, NextRequest } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const session = await req.json();

    console.log("SESSION", session);
    if (!session.return_url || typeof session.return_url !== "string") {
      throw new Error("Invalid return_url");
    }

    const client = await stripe.checkout.sessions.create({
      payment_method_types: session.payment_method_types,
      line_items: session.line_items,
      mode: session.mode,
      billing_address_collection: session.billing_address_collection,
      shipping_address_collection: session.shipping_address_collection,
      return_url: session.return_url,
      automatic_tax: session.automatic_tax,
      ui_mode: "embedded",
    });

    console.log("Stripe checkout session created:", client);

    return NextResponse.json(
      { clientSecret: client.client_secret },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);

    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  console.log(req);

  const searchParams = req.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details.email,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
