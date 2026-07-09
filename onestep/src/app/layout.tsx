import type { Metadata, Viewport } from "next";
import "./globals.css";

import PWARegister from "../components/layout/PWARegister";
import { InstallPromptProvider } from "../components/pwa/InstallPromptProvider";
import { Analytics } from "@vercel/analytics/next";

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
    icon: [
      {
        url: "/icons/icon-web-mid.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icons/icon-web-small.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/icons/icon-web-big.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        url: "/icons/icon-web-bigger.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        url: "/icons/icon-web-large.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    shortcut: "/icons/icon-web-large.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh overflow-x-hidden bg-slate-950 text-white">
        <PWARegister />
        <Analytics />

        <InstallPromptProvider>{children}</InstallPromptProvider>
      </body>
    </html>
  );
}