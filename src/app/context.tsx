"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/server/db";

interface AuthContextType {
  user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);

  // Function to fetch the current auth state
  const fetchAuthState = async () => {
    const user = await db.auth.getUser(); // Adjust this based on how you retrieve the current session
    console.log("Current user:", user);
    if (user) {
      setUser(user.data.user);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchAuthState();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
