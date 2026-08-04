"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { setAuthCookie } from "../lib/authCookie";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setAuthCookie(false);
        setLoading(false);
        return;
      }

      let isEmailVerified = false;

      try {
        const profileSnap = await getDoc(doc(db, "users", currentUser.uid));
        isEmailVerified =
          profileSnap.exists() && profileSnap.data().emailOtpVerified === true;
      } catch (error) {
        console.error("Error loading email verification status:", error);
      }

      setAuthCookie(true, isEmailVerified);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
