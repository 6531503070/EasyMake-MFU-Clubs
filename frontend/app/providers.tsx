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
      // ถ้า env หาย ให้เห็นชัดในคอนโซล
      console.error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID");
    }
    // debug: ช่วยไล่ 403 origin ได้
    try {
      console.log("[GSI] clientId:", clientId, "origin:", window.location.origin);
    } catch {}
  }, [clientId]);

  // ป้องกัน render ก่อน hydrate (เลี่ยง flash/เตือน)
  if (!mounted) return null;

  // ถ้าไม่มี clientId ก็ยังให้ธีมทำงาน แต่อย่างน้อยไม่ครอบ GoogleOAuthProvider
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
