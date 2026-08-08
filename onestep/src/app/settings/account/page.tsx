"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { logoutUser } from "../../../lib/auth";

export default function AccountSecuritySettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const REQUIRED_PHRASE = "DELETE MY ACCOUNT";

  const handleDeleteAccount = async () => {
    if (!user) return;

    if (confirmPhrase.trim() !== REQUIRED_PHRASE) {
      setError(`Please type "${REQUIRED_PHRASE}" exactly to confirm.`);
      return;
    }

    try {
      setIsDeleting(true);
      setError("");

      const idToken = await user.getIdToken();

      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account.");
      }

      // Logout and redirect to login page
      await logoutUser();
      router.replace("/auth/login");
    } catch (err: unknown) {
      console.error("Account deletion failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete account. Please try again.";
      setError(errorMessage);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Account Security</h2>
        <p className="text-sm text-slate-400">
          Manage your account security and permanent account options.
        </p>
      </div>

      {/* Danger Zone Section */}
      <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-red-500/20 p-2.5 text-red-400">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
            <p className="text-xs text-slate-400">
              Irreversible and destructive actions for your account.
            </p>
          </div>
        </div>

        <div className="border-t border-red-500/20 pt-4">
          <h4 className="text-sm font-medium text-white">Delete My Account</h4>
          <p className="mt-1 text-sm text-slate-400 leading-relaxed">
            Permanently delete your account and all associated data including
            tasks, mood check-ins, and focus history. Once deleted, your data cannot be recovered.
          </p>

          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
              setConfirmPhrase("");
              setError("");
            }}
            className="
              mt-4
              rounded-xl
              border
              border-red-500/40
              bg-red-500/10
              px-5
              py-2.5
              text-sm
              font-medium
              text-red-400
              transition
              hover:bg-red-500/20
              hover:border-red-500/60
              active:scale-[0.98]
            "
          >
            Delete my account
          </button>
        </div>
      </section>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-red-500/20 p-2 text-red-400">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Confirm Account Deletion
                  </h3>
                  <p className="text-xs text-red-400 font-medium">
                    This action is permanent and cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isDeleting}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              All your tasks, mood check-in history, and focus session records will be permanently removed from OneStep.
            </p>

            <div className="space-y-2">
              <label
                htmlFor="confirmPhrase"
                className="block text-xs font-medium text-slate-300"
              >
                To confirm, type <span className="font-mono text-red-400 font-bold">{REQUIRED_PHRASE}</span> below:
              </label>

              <input
                id="confirmPhrase"
                type="text"
                value={confirmPhrase}
                onChange={(e) => setConfirmPhrase(e.target.value)}
                placeholder={REQUIRED_PHRASE}
                disabled={isDeleting}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-950
                  px-4
                  py-3
                  font-mono
                  text-sm
                  text-white
                  placeholder-slate-600
                  outline-none
                  transition
                  focus:border-red-500
                  focus:ring-1
                  focus:ring-red-500
                "
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isDeleting}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-700
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-300
                  transition
                  hover:border-slate-500
                  hover:text-white
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={confirmPhrase.trim() !== REQUIRED_PHRASE || isDeleting}
                className="
                  w-full
                  rounded-xl
                  bg-red-600
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-red-700
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {isDeleting ? "Deleting Account..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
