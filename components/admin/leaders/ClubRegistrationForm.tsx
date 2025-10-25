"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";

type MemberInput = {
  name: string;
  email: string;
  citizenId: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ClubRegistrationForm() {
  // state สมาชิกขั้นต่ำ 5
  const [members, setMembers] = useState<MemberInput[]>([
    { name: "", email: "", citizenId: "" },
    { name: "", email: "", citizenId: "" },
    { name: "", email: "", citizenId: "" },
    { name: "", email: "", citizenId: "" },
    { name: "", email: "", citizenId: "" },
  ]);

  function updateMember(
    idx: number,
    field: keyof MemberInput,
    value: string
  ) {
    setMembers((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  }

  function addMemberRow() {
    setMembers((prev) => [
      ...prev,
      { name: "", email: "", citizenId: "" },
    ]);
  }

  function removeMemberRow(idx: number) {
    setMembers((prev) => prev.filter((_, i) => i !== idx));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Submit new club + leader + members", { members });
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-5xl space-y-8 border border-gray-200 rounded-xl bg-white shadow-[0_10px_50px_-10px_rgba(0,0,0,0.08)] p-6 md:p-8"
    >
      {/* Club / Leader Info */}
      <motion.div variants={itemVariants} className="space-y-4 text-sm">
        <div className="text-sm font-semibold text-gray-800">
          Club Information
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {/* Club Name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Club Name
            </label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="e.g. Laced of ART"
              required
            />
          </div>

          {/* Leader Full Name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Leader Full Name
            </label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Thanakorn Th."
              required
            />
          </div>

          {/* Leader Email (login) */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Leader Email (login)
            </label>
            <input
              type="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="leader@mfu.ac.th"
              required
            />
          </div>

          {/* Leader Citizen ID */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Leader Citizen ID
            </label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="13-digit"
              required
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Used to generate the initial password hash.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Members List */}
      <motion.div variants={itemVariants} className="space-y-4 text-sm">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <div className="text-sm font-semibold text-gray-800">
              Club Members
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Add at least 5 founding members. These members will be
              used to validate the club.
            </p>
          </div>

          <button
            type="button"
            onClick={addMemberRow}
            className="px-2.5 py-1.5 text-[12px] rounded-md bg-gray-900 text-white hover:bg-gray-800"
          >
            + Add Member
          </button>
        </div>

        <motion.div layout className="space-y-3 transition-all duration-300">
          {members.map((m, idx) => (
            <motion.div
              key={idx}
              layout
              variants={itemVariants}
              className="
                grid
                grid-cols-1
                md:grid-cols-[1fr_minmax(160px,220px)_minmax(140px,180px)_auto]
                gap-3
                items-start
                border border-gray-200 rounded-md p-3 bg-gray-50
              "
            >
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Full Name"
                  value={m.name}
                  onChange={(e) =>
                    updateMember(idx, "name", e.target.value)
                  }
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="student@mfu.ac.th"
                  value={m.email}
                  onChange={(e) =>
                    updateMember(idx, "email", e.target.value)
                  }
                />
              </div>

              {/* Citizen ID */}
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  Citizen ID
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="13-digit"
                  value={m.citizenId}
                  onChange={(e) =>
                    updateMember(idx, "citizenId", e.target.value)
                  }
                />
              </div>

              {/* Remove Button */}
              <div className="flex items-end">
                <button
                  type="button"
                  disabled={members.length <= 5}
                  onClick={() => removeMemberRow(idx)}
                  className="
                    text-[12px] text-red-600 hover:text-red-700
                    disabled:text-gray-300 disabled:cursor-not-allowed
                  "
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Submit */}
      <motion.div variants={itemVariants}>
        <button
          type="submit"
          className="px-4 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.99] transition-all"
        >
          Create Club
        </button>
      </motion.div>
    </motion.form>
  );
}
