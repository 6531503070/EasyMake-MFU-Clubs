// components/admin/activities/RegisteredStudentsTable.tsx
"use client";

import { useMemo, useState } from "react";
import { motion, Variants } from "framer-motion";
import { TableCard } from "@/components/admin/TableCard";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export type RegisteredStudentRow = {
  /** ถ้ามี regId ใส่มาด้วย จะได้ใช้เป็น key/action ที่เสถียรกว่า */
  id?: string;
  name: string;
  email: string;
  status: "registered" | "checked-in" | "cancelled";
};

type Props = {
  students: RegisteredStudentRow[];
  loading?: boolean;
  error?: string;
  /** ให้เพจโยน callback นี้มา ถ้าอยากใส่ปุ่ม refresh ในตาราง */
  onRefresh?: () => void;
};

export function RegisteredStudentsTable({
  students,
  loading,
  error,
  onRefresh,
}: Props) {
  const [q, setQ] = useState("");
  const [status, setStatus] =
    useState<"all" | "registered" | "checked-in" | "cancelled">("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return students
      .filter((s) =>
        status === "all" ? true : s.status === status
      )
      .filter((s) =>
        needle
          ? (s.name || "").toLowerCase().includes(needle) ||
            (s.email || "").toLowerCase().includes(needle)
          : true
      );
  }, [students, q, status]);

  const counts = useMemo(() => {
    const c = { all: students.length, registered: 0, "checked-in": 0, cancelled: 0 } as Record<
      "all" | "registered" | "checked-in" | "cancelled",
      number
    >;
    for (const s of students) c[s.status]++;
    return c;
  }, [students]);

  return (
    <section className="space-y-3">
      {/* Header + Controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Registered Students</h2>
          <p className="text-[12px] text-gray-500">
            {counts.all} total · {counts.registered} registered · {counts["checked-in"]} checked-in · {counts.cancelled} cancelled
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email…"
            className="w-56 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="registered">Registered</option>
            <option value="checked-in">Checked-in</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      <TableCard>
        {/* Loading */}
        {loading && (
          <div className="p-4 text-sm text-gray-500">Loading registrations…</div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="p-4 text-sm text-red-600">Error: {error}</div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-600 text-[11px] uppercase tracking-wide border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-600">#</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Name</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Email</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filtered.map((stu, idx) => (
                  <motion.tr
                    key={stu.id || stu.email || `${stu.name}-${idx}`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    className="bg-white"
                  >
                    <td className="px-4 py-3 text-[12px] text-gray-500">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {stu.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700 break-all text-[13px]">
                      {stu.email || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StudentStatusPill status={stu.status} />
                    </td>
                  </motion.tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
                      {q || status !== "all"
                        ? "No results match your filters"
                        : "No registrations yet"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </TableCard>
    </section>
  );
}

/* ===== Local pill component (ไม่ชนกับ StatusPill ของ activity) ===== */
function StudentStatusPill({
  status,
}: {
  status: "registered" | "checked-in" | "cancelled";
}) {
  if (status === "registered")
    return (
      <span className="inline-flex items-center rounded-md bg-gray-900 text-white text-[11px] font-medium px-2 py-0.5">
        registered
      </span>
    );
  if (status === "checked-in")
    return (
      <span className="inline-flex items-center rounded-md bg-green-100 text-green-700 text-[11px] font-medium px-2 py-0.5">
        checked-in
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-md bg-red-100 text-red-700 text-[11px] font-medium px-2 py-0.5">
      cancelled
    </span>
  );
}