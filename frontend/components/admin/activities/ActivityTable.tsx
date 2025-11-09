"use client";

import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { TableCard } from "@/components/admin/TableCard";
import { ClubActivityListItem } from "@/services/activitiesService";

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
  exit:  { opacity: 0, y: -6, transition: { duration: 0.18 } },
};

function formatRange(startIso?: string, endIso?: string) {
  if (!startIso) return "-";
  const fmt = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const start = fmt.format(new Date(startIso));
  const end = endIso ? fmt.format(new Date(endIso)) : "";
  return end ? `${start} - ${end}` : start;
}

export function ActivityTable({
  activities,
  loading,
  error,
}: {
  activities: ClubActivityListItem[];
  loading?: boolean;
  error?: string;
}) {
  return (
    <TableCard>
      <div className="p-4">
        <AnimatePresence initial={false} mode="wait">
          {loading && (
            <motion.div
              key="loading"
              className="text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Loading activities…
            </motion.div>
          )}

          {!loading && error && (
            <motion.div
              key="error"
              className="rounded-md border border-amber-300 bg-amber-50 text-amber-900 p-3 text-sm"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              {error.includes("404")
                ? "We couldn’t find your club or you don’t have permission. ตรวจสอบว่า clubId ถูกต้องหรือบัญชีนี้เป็นหัวหน้าชมรม/ผู้ช่วยหรือไม่"
                : `Oops! ${error}`}
            </motion.div>
          )}

          {!loading && !error && activities.length === 0 && (
            <motion.div
              key="empty"
              className="rounded-xl border border-dashed border-gray-300 p-8 text-center"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <div className="text-lg font-medium text-gray-800">No activities yet</div>
              <p className="mt-1 text-sm text-gray-500">
                Create your first activity and start collecting registrations.
              </p>
              <Link
                href="/admin/my-club/activities/new"
                className="inline-flex mt-4 rounded-md bg-gray-900 text-white text-sm px-3 py-2 hover:bg-gray-800"
              >
                + Create Activity
              </Link>
            </motion.div>
          )}

          {!loading && !error && activities.length > 0 && (
            <motion.div
              key="table"
              className="relative overflow-x-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50 text-gray-600 text-[11px] uppercase tracking-wide border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 font-medium">Activity</th>
                    <th className="px-4 py-2 font-medium">When</th>
                    <th className="px-4 py-2 font-medium">Location</th>
                    <th className="px-4 py-2 font-medium">Capacity</th>
                    <th className="px-4 py-2 font-medium">Registered</th>
                    <th className="px-4 py-2 font-medium text-right">Action</th>
                  </tr>
                </thead>

                <motion.tbody
                  className="divide-y divide-gray-200 bg-white"
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                >
                  {activities.map((act) => (
                    <motion.tr
                      key={String(act._id)}
                      variants={itemVariants}
                      whileHover={{ backgroundColor: "rgba(249,250,251,1)" }} // gray-50
                      whileTap={{ scale: 0.995 }}
                      className="bg-white align-top"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div className="flex flex-col">
                          <span>{act.title}</span>
                          <span className="text-[11px] text-gray-500 font-normal flex items-center gap-2">
                            <StatusPill status={act.status} />
                            {act.status === "cancelled" && (
                              <span className="text-red-600">Cancelled</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-gray-700">
                        {formatRange(act.start_time, act.end_time)}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-gray-700">
                        {act.location || "-"}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-gray-700">
                        {act.capacity}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-gray-700">
                        {act.registered}
                        <span className="text-gray-400">/{act.capacity}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                            <Link
                              href={`/admin/my-club/activities/${String(act._id)}`}
                              className="p-1 text-gray-500 hover:text-gray-800"
                              title="View / Manage"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .638C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </Link>
                          </motion.div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TableCard>
  );
}

function StatusPill({ status }: { status: "published" | "cancelled" }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center rounded-md bg-green-100 text-green-700 text-[10px] font-medium px-1.5 py-0.5">
        published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md bg-red-100 text-red-700 text-[10px] font-medium px-1.5 py-0.5">
      cancelled
    </span>
  );
}
