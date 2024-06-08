"use client";
import { useAuth } from "@/app/context";
import { getSession, getSubscription } from "@/server/checkout/utils";
import { useEffect, useState } from "react";
import { updatePlan } from "@/server/utils";

export default function Return({ params }: { params: { slug: string } }) {
  const { user } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const getGivenSession = async () => {
        try {
          const sessionData = await getSession(params.slug);
          console.log("Session data", sessionData);
          setSession(sessionData);

          if (sessionData) {
            const subscription = await getSubscription(
              sessionData.subscription
            );
            console.log("SUBSCRIPTION", subscription);
          }
        } catch (error) {
          setError("Error fetching session details");
        } finally {
          setLoading(false);
        }
      };

      getGivenSession();
    }
  }, [params.slug, user]);

  if (loading) {
    return (
      <main className="md:pt-4 p-8 md:p-12">
        <div className="max-w-4xl px-12 mx-auto my-[200px] py-12 sm:px-6 lg:px-8 shadow-md border border-gray-200 rounded-lg">
          Loading...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="md:pt-4 p-8 md:p-12">
        <div className="max-w-4xl px-12 mx-auto my-[200px] py-12 sm:px-6 lg:px-8 shadow-md border border-gray-200 rounded-lg">
          {error}
        </div>
      </main>
    );
  }

  if (session) {
    return (
      <main id="return" className="md:pt-4 p-8 md:p-12">
        <div className="max-w-3xl px-12 mx-auto my-[200px] py-8 sm:px-6 lg:px-12 shadow-md border border-gray-200 rounded-lg">
          <h1 className="text-2xl font-bold">Subscription successful!</h1>
          <p>{session.customer_details.email}</p>
          <p>Status: {session.status}</p>
        </div>
      </main>
    );
  } else {
    return (
      <main id="return" className="md:pt-4 p-8 md:p-12">
        <div className="max-w-4xl px-12 mx-auto my-[200px] py-12 sm:px-6 lg:px-8 shadow-md border border-gray-200 rounded-lg">
          <p>You must be logged in to access this page</p>
        </div>
      </main>
    );
  }

  return null;
}
