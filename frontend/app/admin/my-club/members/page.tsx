"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { TableCard } from "@/components/admin/TableCard";
import { getCookie } from "cookies-next";
import {
  getClubMembers,
  type ClubMemberRow,
} from "@/services/clubsService";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// แสดงเฉพาะ Email + JoinedAt
type MemberRow = {
  email: string;
  joinedAt: string;
};

export default function ClubMembersPage() {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const cid = getCookie("clubId");
    const clubId = typeof cid === "string" ? cid : null;
    if (!clubId) {
      setErr("Missing clubId cookie");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const raw = await getClubMembers(clubId);

        const mapped: MemberRow[] = raw.map((m) => ({
          email: m.email,
          joinedAt: m.joined_at
            ? new Date(m.joined_at).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : new Date().toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
        }));

        setMembers(mapped);
        setErr(null);
      } catch (e: any) {
        console.error(e);
        setErr(e?.message || "Failed to load members");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 👉 Export เป็น CSV ที่ Excel เปิดได้
  function handleExport() {
    if (!members.length) return;

    const header = ["Email", "Joined At"];
    const rows = members.map((m) => [m.email, m.joinedAt]);

    // escape " ด้วย "" ตามมาตรฐาน CSV
    const toCsvRow = (cols: string[]) =>
      cols
        .map((v) => `"${(v ?? "").replace(/"/g, '""')}"`)
        .join(",");

    const csvContent =
      [toCsvRow(header), ...rows.map(toCsvRow)].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `club-members-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const exportDisabled = loading || !!err || members.length === 0;

  return (
    <motion.section
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.header className="flex flex-col gap-2" variants={rowVariants}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              Followers / Members
            </h1>
            <p className="text-sm text-gray-500">
              Students who joined or follow your club.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={exportDisabled}
            className={[
              "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
              exportDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800",
            ].join(" ")}
          >
            Export list
          </button>
        </div>

        <div className="text-[13px] text-gray-500">
          {loading ? (
            "Loading members..."
          ) : err ? (
            <span className="text-red-500">{err}</span>
          ) : (
            <>
              Total members:{" "}
              <span className="font-medium text-gray-900">
                {members.length}
              </span>
            </>
          )}
        </div>
      </motion.header>

      {!err && !loading && (
        <motion.div variants={rowVariants}>
          <TableCard>
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 font-medium text-gray-600">
                      Email
                    </th>
                    <th className="px-4 py-2 font-medium text-gray-600">
                      Joined At
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {members.map((m, idx) => (
                    <motion.tr
                      key={m.email + idx}
                      variants={rowVariants}
                      className="bg-white"
                    >
                      <td className="px-4 py-3 text-gray-700">
                        {m.email}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-[13px]">
                        {m.joinedAt}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableCard>
        </motion.div>
      )}
    </motion.section>
  );
}
