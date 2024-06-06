"use client";

import Link from "next/link";
import { useAuth } from "@/app/context";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between p-4 md:p-8">
      <Link href="/">
        <div className="text-xl font-bold">DUALITY</div>
      </Link>
      {user ? (
        <Link href="/account">
          <div>Account</div>
        </Link>
      ) : (
        <Link href="/signin">
          <div>Sign in</div>
        </Link>
      )}
    </header>
  );
};

export default Header;
