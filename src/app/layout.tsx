import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Staff App — The Catherine Wheel",
  description: "Staff portal for The Catherine Wheel pub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} style={{ height: "100%" }}>
      <body style={{ minHeight: "100%", margin: 0, background: "var(--bg)" }}>{children}</body>
    </html>
  );
}
