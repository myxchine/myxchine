"use server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function CreateSession(session: any) {
  try {
    console.log("SESSION", session);

    const client = await stripe.checkout.sessions.create({
      line_items: [
        {
          quantity: 1,
          price_data: {
            product_data: {
              name: session.name,
            },
            recurring: {
              interval: session.interval,
              interval_count: 1,
            },
            unit_amount: Math.round(session.value * 100),
            currency: "eur",
          },
        },
      ],
      ui_mode: "embedded",
      mode: "subscription",
      billing_address_collection: "required",

      return_url:
        "https://duality-subscriptions.vercel.app/return/{CHECKOUT_SESSION_ID}",
      automatic_tax: {
        enabled: true,
      },
      payment_method_types: ["card"],
    });

    console.log("Stripe checkout session created:", client);

    return { clientSecret: client.client_secret };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return session;
  } catch (err) {
    console.log(err);
    return null;
  }
}


export async function getSubscription(sessionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(sessionId);

    return subscription;
  } catch (err) {
    console.log(err);
    return null;
  }
}