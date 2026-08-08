"use client";

import { useCallback, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";

export interface UserProfile {
  uid: string;
  fullName?: string;
  displayName?: string;
  email: string;
  photoURL?: string;
  provider?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export function useUserProfile() {
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
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
        const data = profileSnap.data();
        setProfile({
          ...data,
          uid: user.uid,
          email: user.email || data.email || "",
          displayName: data.displayName || data.fullName || user.displayName || "",
          fullName: data.fullName || data.displayName || user.displayName || "",
          photoURL: data.photoURL || user.photoURL || "",
        } as UserProfile);
      } else {
        setProfile({
          uid: user.uid,
          displayName: user.displayName || "",
          fullName: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
        });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);

      setProfile({
        uid: user.uid,
        displayName: user.displayName || "",
        fullName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
      });
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    refetchProfile: loadProfile,
    setProfile,
  };
}