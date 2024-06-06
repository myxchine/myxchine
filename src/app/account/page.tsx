"use client";
import { useAuth } from "@/app/context";
import { useRouter } from "next/navigation";
import { db } from "@/server/db";
import { useState } from "react";

const SignOut = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    const { error } = await db.auth.signOut();
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center w-full h-full p-8 py-[10vh]">
      <div className="mx-auto w-full max-w-md bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold mb-4">Your Account</h1>
        {user && (
          <div className="mb-4">
            <p>
              <strong>Name:</strong> {user.user_metadata.name}
            </p>
            <p>
              <strong>Business:</strong> {user.user_metadata.businessName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <p>
              <strong>Current Plan:</strong> {user.user_metadata.currentPlan}
            </p>
          </div>
        )}
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </main>
  );
};

export default SignOut;
