"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

interface InstallPromptContextValue {
  canInstall: boolean;
  isInstalled: boolean;
  installApp: () => Promise<void>;
}

const InstallPromptContext =
  createContext<InstallPromptContextValue | null>(null);

function isRunningStandalone() {
  if (typeof window === "undefined") return false;

  const isStandaloneDisplay = window.matchMedia(
    "(display-mode: standalone)"
  ).matches;

  const isIOSStandalone =
    "standalone" in window.navigator &&
    Boolean(
      (window.navigator as Navigator & { standalone?: boolean }).standalone
    );

  return isStandaloneDisplay || isIOSStandalone;
}

export function InstallPromptProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isInstalled, setIsInstalled] = useState(() =>
    isRunningStandalone()
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();

    const choice = await installPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setInstallPrompt(null);
      setIsInstalled(true);
    }
  };

  return (
    <InstallPromptContext.Provider
      value={{
        canInstall: !!installPrompt && !isInstalled,
        isInstalled,
        installApp,
      }}
    >
      {children}
    </InstallPromptContext.Provider>
  );
}

export function useInstallPrompt() {
  const context = useContext(InstallPromptContext);

  if (!context) {
    throw new Error(
      "useInstallPrompt must be used inside InstallPromptProvider"
    );
  }

  return context;
}