import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06070a",
};

export const metadata: Metadata = {
  title: "TREC KL - Roblox Nightlife & Social Hangout",
  description: "Official Community & Portal for TREC KL on Roblox by FEMME'S STUDIO. Nightlife club lounge, live DJ sessions, VIP sections, and social hangout.",
  icons: {
    icon: "/trec-kl/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-[#06070a] text-zinc-100 antialiased selection:bg-[#ff007f] selection:text-white">
        {children}
      </body>
    </html>
  );
}
