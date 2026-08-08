"use client";

import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

export default function DataPrivacySettingsPage() {
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleExportData = async () => {
    if (!user) return;

    try {
      setExporting(true);
      setError("");
      setSuccessMessage("");

      const idToken = await user.getIdToken();

      const response = await fetch("/api/account/export", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to export data.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from header if present or default
      const disposition = response.headers.get("content-disposition");
      let filename = `onestep-data-export-${user.uid}.json`;
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) filename = match[1];
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccessMessage("Your data export has been downloaded successfully.");
    } catch (err: unknown) {
      console.error("Data export failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to export data. Please try again.";
      setError(errorMessage);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Data & Privacy</h2>
        <p className="text-sm text-slate-400">
          Manage your privacy preferences and download your personal data.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-col sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-medium text-white">Export My Data</h3>
            <p className="mt-1 text-sm text-slate-400 max-w-xl leading-relaxed">
              Download a full copy of all your data stored in OneStep in JSON format.
              This includes your profile details, task records, mood history, and focus session logs.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportData}
            disabled={exporting || !user}
            className="
              shrink-0
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
            {exporting ? "Preparing Export..." : "Export My Data"}
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            {successMessage}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 space-y-3">
        <h3 className="text-md font-medium text-white">GDPR & Data Ownership</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          At OneStep, we respect your right to privacy and control over your personal information.
          You can request a download of your data at any time or request account deletion from the Account Security tab.
        </p>
      </div>
    </div>
  );
}
