"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";
interface AuthContextType {
  user: any;
  session: any;
  isSignedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  

  useEffect(() => {
    const { data } = db.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session.user);
        setSession(session);
        console.log("User signed in:", session);
        setIsSignedIn(true);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setSession(null);
        console.log("User signed out");
      }
    });

    // Cleanup subscription on unmount
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
