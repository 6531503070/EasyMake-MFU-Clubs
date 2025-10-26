"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { TableCard } from "@/components/admin/TableCard";

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

type MemberRow = {
  name: string;
  email: string;
  joinedAt: string;
};

const mockMembers: MemberRow[] = [
  {
    name: "Jane Doe",
    email: "jane123@mfu.ac.th",
    joinedAt: "21 Oct 2025",
  },
  {
    name: "Thanawat Siri",
    email: "thanawat.siri@mfu.ac.th",
    joinedAt: "20 Oct 2025",
  },
  {
    name: "Pimchanok K.",
    email: "pimchanok.k@mfu.ac.th",
    joinedAt: "18 Oct 2025",
  },
];

export default function ClubMembersPage() {
  const [members] = useState<MemberRow[]>(mockMembers);

  return (
    <motion.section
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Section header */}
      <motion.header
        className="flex flex-col gap-2"
        variants={rowVariants}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              Followers / Members
            </h1>
            <p className="text-sm text-gray-500">
              Students who joined or follow your club.
            </p>
          </div>

          {/* future action button (export / invite etc.) */}
          <button
            className="inline-flex items-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Export list
          </button>
        </div>

        {/* tiny meta row under header */}
        <div className="text-[13px] text-gray-500">
          Total members:{" "}
          <span className="font-medium text-gray-900">
            {members.length}
          </span>
        </div>
      </motion.header>

      {/* Table card */}
      <motion.div variants={rowVariants}>
        <TableCard>
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-600">
                    Student Name
                  </th>
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
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {m.name}
                    </td>
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
    </motion.section>
  );
}
