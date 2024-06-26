"use client";

import { useRouter } from "next/navigation";

export default function Purgatory() {
  const router = useRouter();
  router.push("/app/home");
}

/*
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context";
import LoaderDark from "@/components/ui/LoaderDark";

export default function Purgatory() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (user.aud === "authenticated") {
        router.push("/app/home");
      } else {
        router.push("/signin");
      }
    };

    checkUserStatus();
  }, [user, router]);

  return (
    <div
      className="flex flex h-screen w-screen items-center justify-center "
      style={{ transform: "scale(1.5)" }}
    >
      <LoaderDark />
      <h2 className="text-l font-bold">Authenticating</h2>
    </div>
  );
}


*/
