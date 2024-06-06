"use client";

import { useEffect } from "react";
import { db } from "@/server/db"; // Make sure the path to your supabase client is correct

const CheckAuth = () => {
  useEffect(() => {
    const { data } = db.auth.onAuthStateChange((event, session) => {
      console.log(event, session);

      if (event === "INITIAL_SESSION") {
        console.log("Initial session detected");
      } else if (event === "SIGNED_IN") {
        console.log("User signed in:", session);
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
      } else if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery event");
      } else if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed");
      } else if (event === "USER_UPDATED") {
        console.log("User updated");
      }
    });

    // Cleanup on component unmount
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return null; // This component does not render anything
};

export default CheckAuth;
