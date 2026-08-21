"use client";

import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { useAuth } from "../../../hooks/useAuth";
import { useUserProfile } from "../../../hooks/useUserProfile";
import { auth, db } from "../../../lib/firebase";

function formatDate(dateInput: unknown): string {
  if (!dateInput) return "N/A";

  let date: Date | null = null;

  if (typeof dateInput === "string" || typeof dateInput === "number") {
    date = new Date(dateInput);
  } else if (
    dateInput &&
    typeof dateInput === "object" &&
    "toDate" in dateInput &&
    typeof (dateInput as { toDate: () => Date }).toDate === "function"
  ) {
    date = (dateInput as { toDate: () => Date }).toDate();
  }

  if (!date || isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading, refetchProfile } = useUserProfile();

  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (profile?.displayName || profile?.fullName) {
      setDisplayName(profile.displayName || profile.fullName || "");
    } else if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [profile, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      setMessage({ type: "error", text: "Display name cannot be empty." });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      // 1. Update Firebase Auth user profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: trimmedName,
        });
      }

      // 2. Update Firestore user document
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email || profile?.email || "",
          displayName: trimmedName,
          fullName: trimmedName,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await refetchProfile();

      setMessage({
        type: "success",
        text: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const email = profile?.email || user?.email || "";
  const creationTime = user?.metadata?.creationTime || profile?.createdAt;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">User Profile</h2>
        <p className="text-sm text-slate-400">
          Manage your personal information and profile details.
        </p>
      </div>

      {profileLoading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-slate-400">
          Loading profile details...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile Overview Card */}
          <div className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 text-3xl font-bold text-blue-400 border border-blue-500/30">
              {(displayName || email || "U").charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-medium text-white">
                {displayName || "OneStep User"}
              </h3>
              <p className="text-sm text-slate-400">{email}</p>
              <div className="mt-2 flex flex-wrap gap-2 pt-1">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-xs font-medium text-blue-300">
                  Account Created: {formatDate(creationTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-4">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-slate-300"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-slate-800
                    bg-slate-900
                    px-4
                    py-3
                    text-white
                    placeholder-slate-500
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-1
                    focus:ring-blue-500
                  "
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  readOnly
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-slate-800/60
                    bg-slate-950/80
                    px-4
                    py-3
                    text-slate-400
                    cursor-not-allowed
                  "
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Email address cannot be modified directly from settings.
                </p>
              </div>

              <div>
                <label
                  htmlFor="uid"
                  className="block text-sm font-medium text-slate-300"
                >
                  Account ID (UID)
                </label>
                <input
                  id="uid"
                  type="text"
                  value={user?.uid || ""}
                  disabled
                  readOnly
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-slate-800/60
                    bg-slate-950/80
                    px-4
                    py-3
                    font-mono
                    text-xs
                    text-slate-400
                    cursor-not-allowed
                  "
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Your unique user identifier cannot be modified.
                </p>
              </div>
            </div>

            {message && (
              <div
                className={`rounded-xl border p-4 text-sm ${
                  message.type === "success"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    : "border-red-500/20 bg-red-500/10 text-red-400"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="
                  rounded-xl
                  bg-blue-500
                  px-6
                  py-3
                  font-medium
                  text-white
                  transition
                  hover:bg-blue-600
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
