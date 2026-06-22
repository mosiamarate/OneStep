"use client";

import { useInstallPrompt } from "../../components/pwa/InstallPromptProvider";

export default function InstallAppButton() {
  const { canInstall, installApp } = useInstallPrompt();

  if (!canInstall) {
    return null;
  }

  return (
    <div
      className="
        mt-8
        flex
        flex-col
        items-center
        justify-center
        bg-transparent
        px-6
        py-8
        text-center
      "
    >
      <h3 className="font-semibold text-white">
        Install OneStep
      </h3>

      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
        Add OneStep to your device so you can open it like a normal app.
      </p>

      <button
        type="button"
        onClick={installApp}
        className="
          mt-5
          rounded-xl
          bg-blue-500
          px-6
          py-3
          text-sm
          font-medium
          text-white
          transition
          hover:bg-blue-600
          active:scale-[0.98]
        "
      >
        Download App
      </button>
    </div>
  );
}