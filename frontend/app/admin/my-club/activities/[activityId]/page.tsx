"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { TableCard } from "@/components/admin/TableCard";

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

type RegisteredStudent = {
  name: string;
  email: string;
  status: "registered" | "checked-in" | "cancelled";
};

type ActivityDetail = {
  title: string;
  datetimeFull: string;
  location: string;
  capacity: number;
  registeredCount: number;
  description: string;
  status: "published" | "draft" | "cancelled";
  coverImageUrl?: string;
};

const mockDetail: ActivityDetail = {
  title: "Tech Innovation Night",
  datetimeFull: "28 Oct 2025 · 18:00-21:00",
  location: "C1 Auditorium",
  capacity: 100,
  registeredCount: 87,
  description:
    "This event showcases cutting-edge student projects using AI, robotics, and creative tech at MFU.",
  status: "published",
  coverImageUrl:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
};

const mockStudents: RegisteredStudent[] = [
  {
    name: "Jane Doe",
    email: "jane123@mfu.ac.th",
    status: "registered",
  },
  {
    name: "Thanawat Siri",
    email: "thanawat.siri@mfu.ac.th",
    status: "checked-in",
  },
  {
    name: "Pimchanok K.",
    email: "pimchanok.k@mfu.ac.th",
    status: "cancelled",
  },
];

export default function ActivityDetailPage() {
  const router = useRouter();
  const [activity] = useState<ActivityDetail>(mockDetail);
  const [students] = useState<RegisteredStudent[]>(mockStudents);

  return (
    <motion.section
      className="space-y-10 max-w-5xl"
      variants={pageVariants}
      initial="hidden"
      animate="show"
    >
      {/* === HEADER === */}
      <motion.header className="space-y-4" variants={itemVariants}>
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              {activity.title}
            </h1>
            <div className="text-sm text-gray-500 space-y-1">
              <p>
                {activity.location} · {activity.datetimeFull}
              </p>
              <p>
                Capacity: {activity.capacity} / Registered:{" "}
                {activity.registeredCount}
              </p>
              <div className="flex flex-wrap gap-2 text-[12px] text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">Status:</span>
                  <ActivityStatusPill status={activity.status} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-md bg-gray-900 text-white text-sm px-3 py-2 hover:bg-gray-800 transition-colors">
              Edit Activity
            </button>
            <button className="rounded-md text-red-600 text-sm px-3 py-2 hover:text-red-700 transition-colors">
              Cancel Event
            </button>
          </div>
        </div>

        {activity.coverImageUrl && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
            <div className="aspect-[16/5] w-full bg-gray-200">
              <img
                src={activity.coverImageUrl}
                alt="Activity cover"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </motion.header>

      {/* === DESCRIPTION === */}
      <motion.section className="w-full" variants={itemVariants}>
        <div className="bg-white border border-gray-200 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] p-4 md:p-6 space-y-4">
          <div className="text-sm text-gray-700 leading-relaxed">
            {activity.description}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[12px] text-gray-500">
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Status:</span>
              <ActivityStatusPill status={activity.status} />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Registered:</span>
              <span className="text-gray-700 font-medium">
                {activity.registeredCount}/{activity.capacity}
              </span>
            </div>
          </div>

          <div className="text-[12px] text-gray-400">
            Last updated: 26 Oct 2025 · Visibility: Public
          </div>
        </div>
      </motion.section>

      {/* === STUDENTS TABLE === */}
      <motion.section className="space-y-4" variants={itemVariants}>
        <div>
          <h2 className="text-sm font-semibold text-gray-800">
            Registered Students
          </h2>
          <p className="text-[12px] text-gray-500">
            List of all students who registered for this activity.
          </p>
        </div>

        <TableCard>
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-600 text-[11px] uppercase tracking-wide border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-600">Name</th>
                  <th className="px-4 py-2 font-medium text-gray-600">Email</th>
                  <th className="px-4 py-2 font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {students.map((stu, idx) => (
                  <motion.tr
                    key={stu.email + idx}
                    variants={itemVariants}
                    className="bg-white"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {stu.name}
                    </td>
                    <td className="px-4 py-3 text-gray-700 break-all text-[13px]">
                      {stu.email}
                    </td>
                    <td className="px-4 py-3">
                      <StudentStatusPill status={stu.status} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableCard>
      </motion.section>
    </motion.section>
  );
}

/* ===== Pills ===== */

function ActivityStatusPill({ status }: { status: ActivityDetail["status"] }) {
  if (status === "published")
    return (
      <span className="inline-flex items-center rounded-md bg-green-100 text-green-700 text-[11px] font-medium px-2 py-0.5">
        published
      </span>
    );
  if (status === "draft")
    return (
      <span className="inline-flex items-center rounded-md bg-yellow-100 text-yellow-700 text-[11px] font-medium px-2 py-0.5">
        draft
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-md bg-red-100 text-red-700 text-[11px] font-medium px-2 py-0.5">
      cancelled
    </span>
  );
}

function StudentStatusPill({
  status,
}: {
  status: RegisteredStudent["status"];
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
