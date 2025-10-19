// src/contexts/auth-context.tsx - FINAL VERSION (Oct 19, 2025)
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    getCurrentUser: () => User | null; // 🔥 THÊM HELPER CHO DAL
}

export const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    loading: true,
    getCurrentUser: () => null 
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // 🔥 THÊM HELPER
  const getCurrentUser = () => user;

  const value = { user, loading, getCurrentUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
    return useContext(AuthContext);
};