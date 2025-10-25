// lib/auth.ts
"use client";

import { useEffect, useState } from "react";

// type Role = "user" | "club-leader" | "super-admin" | null;

export function useRole(): "user" | "club-leader" | "super-admin" | null {
  const [role, setRole] = useState<"user" | "club-leader" | "super-admin" | null>(null);

  useEffect(() => {
    // TODO: เปลี่ยนเป็นอ่านจาก cookie/localStorage/jwt
    // ตัวอย่าง mock ชั่วคราว:
    const stored = window.localStorage.getItem("role");

    if (stored === "club-leader" || stored === "super-admin" || stored === "user") {
      setRole(stored as any);
    } else {
      setRole("club-leader"); 
      // เปลี่ยน default mock ตรงนี้เวลา dev:
      // - "club-leader" เพื่อเทสต์หน้าชมรม
      // - "super-admin" เพื่อเทสต์หน้าระบบรวม
    }
  }, []);

  return role;
}
