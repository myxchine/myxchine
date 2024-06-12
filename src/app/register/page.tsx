"use client";

import Link from "next/link";
import { SubmitButton } from "@/components/ui/submit-button";
import { db } from "@/server/db";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!name || !email || !password) {
        setError("All fields are required");
        return;
      }

      const { data, error } = await db.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        console.log("User signed up:", data);

        router.push("/");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex w-full items-center justify-center p-8 pb-[100px] md:pb-[200px] md:pt-[100px] min-h-screen">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border shadow-md">
        <div className="flex flex-col items-center justify-center space-y-3 px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign Up</h3>
          <p className="text-sm text-gray-500">
            Create a new account by providing your email and password.
          </p>
        </div>
        <form onSubmit={handleSignUp} className="px-8 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs uppercase text-gray-600"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase text-gray-600"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="user@example.com"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase text-gray-600"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <SubmitButton>Sign Up</SubmitButton>
        </form>
        <p className="text-center text-sm text-gray-600 p-8">
          {"Already have an account? "}
          <Link href="/signin" className="font-semibold text-gray-800">
            Sign in
          </Link>
          {" instead."}
        </p>
      </div>
    </div>
  );
};

export default SignUp;
