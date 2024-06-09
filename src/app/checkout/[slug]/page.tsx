"use client";
import { useCallback } from "react";
import { CreateSession } from "@/server/checkout/utils";
import { useAuth } from "@/app/context";

import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

export default function Checkout({ params }: { params: { slug: string } }) {
  const { user } = useAuth();

  if (!user) {
    return <div>You must be logged in to checkout</div>;
  }

  if (user) {
    const userId = user.id;
    const stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );

    const fetchClientSecret = useCallback(async () => {
      try {
        const decodedCart = decodeURIComponent(params.slug);

        const statedCart = JSON.parse(decodedCart);

        const cart = { ...statedCart, client_reference_id: userId };

        console.log("cart", cart);

        const sessionId = await CreateSession(cart);

        return sessionId.clientSecret;
      } catch (error) {
        console.error("Error creating session", error);
      }
    }, [params.slug]);

    const options = { fetchClientSecret };

    return (
      <main id="checkout" className="md:pt-4">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </main>
    );
  }
}

/*

import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";





const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);




  return fetch("/api/checkout_sessions", {





      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Stripe-Version": "2020-08-27",
      },
      body: JSON.stringify({
        line_items: lineItems,
        mode: "payment",
        ui_mode: "embedded",
        payment_method_types: ["card"],
        billing_address_collection: "required",
        shipping_address_collection: {
          allowed_countries: ["PT"],
        },
        return_url:
          "https://duality-commerce.vercel.app/return?session_id={CHECKOUT_SESSION_ID}",
        automatic_tax: {
          enabled: true,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);



       <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
      */
