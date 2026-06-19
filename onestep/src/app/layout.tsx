import type { Metadata, Viewport } from "next";
import "./globals.css";

import PWARegister from "../components/layout/PWARegister";
import { InstallPromptProvider } from "../components/pwa/InstallPromptProvider";

export const metadata: Metadata = {
  title: {
    default: "OneStep",
    template: "%s | OneStep",
  },
  description: "Slow down, relax, and focus on one task at a time.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "OneStep",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PWARegister />

        <InstallPromptProvider>
          {children}
        </InstallPromptProvider>
      </body>
    </html>
  );
}