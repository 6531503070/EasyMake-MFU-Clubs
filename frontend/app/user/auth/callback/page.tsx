"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/authService";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Checking login...");

  useEffect(() => {
    (async () => {
      // ถ้า backend โพสต์ token เป็นคุกกี้แล้ว หน้านี้แค่ตรวจ /me แล้วพาไปหน้า user
      const me = await getMe();
      if (me) {
        setStatus("Logged in. Redirecting...");
        router.replace("/user");
      } else {
        setStatus("Login failed or no session.");
      }
    })();
  }, [router]);

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-sm text-gray-600">{status}</div>
    </div>
  );
}
