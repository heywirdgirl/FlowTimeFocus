// src/contexts/auth-context.tsx 
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/lib/firebase";
import { UserProfile } from "@/lib/types"; // IMPORT UserProfile type
import { getUserProfile, createUserProfile } from "@/dal/user-dal"; // IMPORT DAL functions

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null; // ADD userProfile state
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    userProfile: null,
    loading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // ADD state for profile
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        try {
          // User is signed in, see if they have a profile
          let profile = await getUserProfile(user.uid);
          if (!profile) {
            // If not, create one
            console.log("Creating new user profile for UID:", user.uid);
            profile = await createUserProfile(user.uid, user.email, user.displayName);
          }
          setUserProfile(profile);
        } catch (error) {
            console.error("Error fetching or creating user profile:", error);
            setUserProfile(null); // Clear profile on error
        }
      } else {
        // User is signed out
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const value = { user, userProfile, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
    return useContext(AuthContext);
};