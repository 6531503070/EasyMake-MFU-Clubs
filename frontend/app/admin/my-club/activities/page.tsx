"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { TableCard } from "@/components/admin/TableCard";
import { SectionHeader } from "@/components/admin/SectionHeader";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
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

type ActivityRow = {
  id: string;
  title: string;
  datetime: string;
  location: string;
  capacity: number;
  registered: number;
  status: "published" | "draft" | "cancelled";
};

const mockActivities: ActivityRow[] = [
  {
    id: "tech-innovation-night",
    title: "Tech Innovation Night",
    datetime: "28 Oct 2025, 18:00-21:00",
    location: "C1 Auditorium",
    capacity: 100,
    registered: 87,
    status: "published",
  },
  {
    id: "robotics-lab-tour",
    title: "Robotics Lab Tour",
    datetime: "02 Nov 2025, 13:00-15:00",
    location: "E4 Robotics Lab",
    capacity: 20,
    registered: 20,
    status: "published",
  },
  {
    id: "ai-bootcamp",
    title: "AI Mini Bootcamp",
    datetime: "10 Nov 2025, 09:00-17:00",
    location: "Library Innovation Zone",
    capacity: 60,
    registered: 42,
    status: "draft",
  },
];

export default function ClubActivitiesPage() {
  const [activities] = useState<ActivityRow[]>(mockActivities);

  return (
    <motion.section
      className="space-y-6"
      variants={pageVariants}
      initial="hidden"
      animate="show"
    >
      {/* HEADER */}
      <motion.div variants={itemVariants}>
        <SectionHeader
          title="Activities"
          subtitle="Create events and track registrations."
          action={
            <Link
              href="/admin/my-club/activities/new"
              className="px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              + New Activity
            </Link>
          }
        />
      </motion.div>

      {/* TABLE LIST */}
      <motion.div variants={itemVariants}>
        <TableCard>
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-600 text-[11px] uppercase tracking-wide border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-600">
                    Activity
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-600">
                    When
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-600">
                    Location
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-600">
                    Capacity
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-600">
                    Registered
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-600 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {activities.map((act) => (
                  <motion.tr
                    key={act.id}
                    variants={itemVariants}
                    className="bg-white align-top"
                  >
                    {/* Activity / status */}
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

                    {/* When */}
                    <td className="px-4 py-3 text-gray-700 text-[13px]">
                      {act.datetime}
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3 text-gray-700 text-[13px]">
                      {act.location}
                    </td>

                    {/* Capacity */}
                    <td className="px-4 py-3 text-[13px] text-gray-700">
                      {act.capacity}
                    </td>

                    {/* Registered */}
                    <td className="px-4 py-3 text-[13px] text-gray-700">
                      {act.registered}
                      <span className="text-gray-400">
                        /{act.capacity}
                      </span>
                    </td>

                    {/* Row actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/my-club/activities/${act.id}`}
                          className="p-1 text-gray-500 hover:text-gray-800"
                          title="View / Manage"
                        >
                          {/* eye icon */}
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

                        <button
                          className="p-1 text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          {/* pencil icon */}
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
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M18 2.25l3.75 3.75"
                            />
                          </svg>
                        </button>

                        <button
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Cancel / Delete"
                        >
                          {/* trash icon */}
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
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableCard>
      </motion.div>
    </motion.section>
  );
}

// Small pill to show status
function StatusPill({ status }: { status: ActivityRow["status"] }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center rounded-md bg-green-100 text-green-700 text-[10px] font-medium px-1.5 py-0.5">
        published
      </span>
    );
  }
  if (status === "draft") {
    return (
      <span className="inline-flex items-center rounded-md bg-yellow-100 text-yellow-700 text-[10px] font-medium px-1.5 py-0.5">
        draft
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md bg-red-100 text-red-700 text-[10px] font-medium px-1.5 py-0.5">
      cancelled
    </span>
  );
}
