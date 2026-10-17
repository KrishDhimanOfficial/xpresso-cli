import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "xpresso-cli — Production-Ready Express Apps in Seconds",
  description:
    "A powerful, blazing-fast CLI tool to instantly scaffold production-ready Node.js + Express flat-MVC applications with native ESM, multi-database support, and automated service generation.",
  keywords: [
    "xpresso-cli",
    "express",
    "nodejs",
    "scaffold",
    "flat-mvc",
    "esm",
    "mongoose",
    "sequelize",
    "cli-generator",
  ],
  authors: [{ name: "Krish Dhiman", url: "https://github.com/KrishDhimanOfficial" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth antialiased">
      <body className="min-h-screen flex flex-col bg-[#07090e] text-zinc-100 selection:bg-emerald-500/25 selection:text-emerald-200 font-sans">
        {children}
      </body>
    </html>
  );
}
