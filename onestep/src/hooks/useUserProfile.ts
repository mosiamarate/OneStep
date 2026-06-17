"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";

interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  photoURL?: string;
  provider?: string;
}

export function useUserProfile() {
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (authLoading) return;

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const profileRef = doc(db, "users", user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data() as UserProfile);
        } else {
          setProfile({
            uid: user.uid,
            fullName: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);

        setProfile({
          uid: user.uid,
          fullName: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, authLoading]);

  return {
    profile,
    loading,
  };
}