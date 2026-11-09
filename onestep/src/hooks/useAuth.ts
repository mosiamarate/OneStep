"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import {
  setAuthCookie,
  clearAuthCookies,
} from "../lib/authCookie";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        clearAuthCookies();
        setLoading(false);
        return;
      }

      setAuthCookie(true, currentUser.emailVerified);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
