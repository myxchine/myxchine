"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@/app/context";

export default function Purgatory() {
  const { user } = useAuth();

  if (user?.aud === "authenticated") {
    redirect("/app");
  }
}
