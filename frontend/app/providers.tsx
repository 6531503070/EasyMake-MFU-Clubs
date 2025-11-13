"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/components/theme-provider";

export default function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  useEffect(() => {
    setMounted(true);
    if (!clientId) {
      console.error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID");
    }
  }, [clientId]);

  if (!mounted) return null;

  if (!clientId) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light">
        {children}
      </ThemeProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ThemeProvider attribute="class" defaultTheme="light">
        {children}
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
