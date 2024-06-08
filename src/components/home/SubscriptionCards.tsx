"use client";

import { useState } from "react";
import { useAuth } from "@/app/context";
import { useRouter } from "next/navigation";

const SubscriptionCards = () => {
  const [billingType, setBillingType] = useState("yearly");
  const { user } = useAuth();
  const router = useRouter();

  const getPrice = (monthlyPrice: number) => {
    if (billingType === "yearly") {
      return Math.floor(monthlyPrice * 0.9);
    }
    return monthlyPrice;
  };

  const getBillingPeriod = () => {
    return billingType === "yearly" ? "/month" : "/month";
  };

  const handleSubscribe = (data: any) => {
    const { value, name } = data;

    let cart;

    if (billingType === "yearly") {
      cart = {
        value: Math.floor(value * 0.9) * 12,
        interval: "year",
        name: name,
      };
    }

    if (billingType === "monthly") {
      cart = { value: Math.floor(value * 1), interval: "month", name: name };
    }

    console.log("Subscribing...", cart);
    if (user) {
      console.log("User is logged in, checking out...");
      const encodedCart = encodeURIComponent(JSON.stringify(cart));
      router.push(`/checkout/${encodedCart}`);
    } else {
      console.log("User is not logged in, redirecting to signin...");
      router.push("/signin");
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center p-4 pb-[100px]">
      <div className="mb-8 flex w-full justify-center md:max-w-xs">
        <button
          className={`mr-4 w-full rounded px-4 py-2 ${
            billingType === "monthly"
              ? "bg-black text-white"
              : "border border-black bg-white text-black"
          }`}
          onClick={() => setBillingType("monthly")}
        >
          Monthly Billing
        </button>
        <button
          className={`w-full rounded px-4 py-2 ${
            billingType === "yearly"
              ? "bg-black text-white"
              : "border border-black bg-white text-black"
          }`}
          onClick={() => setBillingType("yearly")}
        >
          Yearly Billing
        </button>
      </div>
      <div className="flex w-full flex-col gap-6 p-4 md:flex-row">
        <div className="align-center justify-left flex w-full items-center rounded-lg border border-gray-200 bg-white p-8 px-12 shadow-md">
          <div className="w-full space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">STARTER</h2>
              <p className="h-[50px]">
                This is a starter plan to get you started for less.
              </p>
            </div>
            <p className="text-5xl font-bold">
              €{getPrice(5)}
              <span className="text-xl">{getBillingPeriod()}</span>
            </p>
            <button
              onClick={() => handleSubscribe({ value: 5, name: "starter" })}
              className="w-full rounded border border-black bg-black p-2 text-white hover:bg-transparent hover:text-black"
            >
              Subscribe
            </button>
          </div>
        </div>
        <div className="align-center justify-left flex w-full items-center rounded-lg border border-gray-200 bg-white p-8  px-12  shadow-md">
          <div className="w-full space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">VALUE</h2>
              <p className="h-[50px]">
                This is a value plan for serious users looking for value.
              </p>
            </div>
            <p className="text-5xl font-bold">
              €{getPrice(15)}
              <span className="text-xl">{getBillingPeriod()}</span>
            </p>
            <button
              onClick={() => handleSubscribe({ value: 15, name: "value" })}
              className="w-full rounded border border-black bg-black p-2 text-white hover:bg-transparent hover:text-black"
            >
              Subscribe
            </button>
          </div>
        </div>
        <div className="align-center justify-left flex w-full items-center rounded-lg border border-gray-200 bg-white p-8 px-12  shadow-md">
          <div className="w-full space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold uppercase">professional</h2>
              <p className="h-[50px] w-full">
                This is a pro plan for advanced users looking for the best.
              </p>
            </div>
            <p className="text-5xl font-bold">
              €{getPrice(40)}
              <span className="text-xl">{getBillingPeriod()}</span>
            </p>
            <button
              onClick={() =>
                handleSubscribe({ value: 40, name: "professional" })
              }
              className="w-full rounded border border-black bg-black p-2 text-white hover:bg-transparent hover:text-black"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionCards;
