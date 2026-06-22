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
        url: "/icons/icon-web.webp",
        sizes: "1254x1254",
        type: "image/webp",
      },
      {
        url: "/icons/icon-web.png",
        sizes: "1254x1254",
        type: "image/png",
      }
    ],
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
        <Analytics />
        <InstallPromptProvider>
          {children}
        </InstallPromptProvider>
      </body>
    </html>
  );
}