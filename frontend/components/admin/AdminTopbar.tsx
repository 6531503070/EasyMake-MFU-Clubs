"use client";

import { useRole } from "@/lib/auth";

export function AdminTopbar() {
  const role = useRole();

  return (
    <header className="h-14 border-b border-gray-200 bg-white px-4 flex items-center justify-between">
      <div className="text-sm text-gray-600">
        {role === "super-admin"
          ? "Internal Oversight"
          : "Club Management Console"}
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <div className="text-right leading-tight">
          <div className="font-semibold text-gray-800">
            Admin User
          </div>
          <div className="text-[10px] uppercase tracking-wide text-gray-500">
            {role ?? "guest"}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-200" />
      </div>
    </header>
  );
}
