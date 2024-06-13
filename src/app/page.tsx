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
      if (!user) {
        // If user data is not available yet, you might want to add a loading state
        return;
      }

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
