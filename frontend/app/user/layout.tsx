"use client";

import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
    >
      <div className="min-h-screen bg-white text-gray-900">
        {children}
      </div>
    </ThemeProvider>
  );
}
