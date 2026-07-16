"use client";

import { useEffect, useState } from "react";
import { APP_VERSION } from "../../constants/appVersion";

export default function UpdateAvailablePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [latestVersion, setLatestVersion] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function checkForUpdate() {
      try {
        const response = await fetch(`/api/app-version?time=${Date.now()}`, {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = (await response.json()) as {
          version?: string;
        };

        const serverVersion = data.version;

        if (!serverVersion) return;

        if (!cancelled && serverVersion !== APP_VERSION) {
          setLatestVersion(serverVersion);
          setShowPrompt(true);
        }
      } catch (error) {
        console.error("Error checking for app update:", error);
      }
    }

    checkForUpdate();

    const interval = window.setInterval(checkForUpdate, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-950/70
        px-4
        py-6
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-slate-800
          bg-slate-900
          p-6
          text-white
          shadow-2xl
        "
      >
        <div className="mb-5 flex items-start gap-4">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-blue-500/10
              text-xl
            "
          >
            ✨
          </div>

          <div>
            <p className="text-sm font-semibold text-blue-300">
              New update available
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
              OneStep has been updated.
            </h2>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-slate-400">
          A new version with recent changes is available. Refresh to get the
          latest features and improvements.
        </p>

        {latestVersion && (
          <p className="mt-3 text-xs text-slate-500">
            Version {latestVersion}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleDismiss}
            className="
              inline-flex
              w-full
              items-center
              justify-center
              rounded-xl
              border
              border-slate-700
              px-5
              py-3
              text-sm
              font-medium
              text-slate-300
              transition
              hover:border-slate-600
              hover:text-white
              active:scale-[0.98]
              sm:w-auto
            "
          >
            Later
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            className="
              inline-flex
              w-full
              items-center
              justify-center
              rounded-xl
              bg-blue-500
              px-5
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-600
              active:scale-[0.98]
              sm:w-auto
            "
          >
            Refresh Now
          </button>
        </div>
      </div>
    </div>
  );
}