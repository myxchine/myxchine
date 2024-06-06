"use client";
import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import Header from "@/components/checkout/Header";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function App() {
  const getCart = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");

      const lineItems = storedCart.map((product: Product) => ({
        price_data: {
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: Math.round(product.price * 100),

          currency: "eur",
        },

        quantity: product.quantity,
      }));

      console.log(lineItems);

      return lineItems;
    }
    return [];
  };

  const fetchClientSecret = useCallback(async () => {
    const lineItems = getCart();
    console.log("Creating Stripe checkout session...", lineItems);

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
  }, []);

  const options = { fetchClientSecret };

  return (
    <main id="checkout" className="md:pt-4">
      <Header />
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </main>
  );
}
