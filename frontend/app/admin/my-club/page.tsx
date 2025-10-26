"use client";

import { motion, Variants } from "framer-motion";
import { StatCard } from "@/components/admin/StatCard";
import { SectionHeader } from "@/components/admin/SectionHeader";

// animation settings
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.08 },
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

export default function MyClubOverviewPage() {
  const posts = [
    { title: "🔥 Recruitment Week is open!", date: "25 Oct" },
    { title: "[Announcement] Workshop schedule update", date: "24 Oct" },
    { title: "[Reminder] Dance practice this Friday", date: "23 Oct" },
  ];

  const activities = [
    { title: "Tech Innovation Night", date: "28 Oct", location: "MFU Hall A" },
    { title: "Dance Showcase Night", date: "29 Oct", location: "Auditorium" },
    { title: "Football Friendly Match", date: "30 Oct", location: "Stadium" },
  ];

  return (
    <motion.section
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <SectionHeader
          title="My Club Overview"
          subtitle="Stats for your club, followers, and upcoming activities."
        />
      </motion.div>

      {/* Stat cards row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatCard
          label="Followers"
          value="156"
          note="students following your club"
        />
        <StatCard
          label="Upcoming Activities"
          value="4"
          note="scheduled this week"
        />
        <StatCard
          label="Event Capacity Filled"
          value="87%"
          note="latest major event"
        />
      </motion.div>

      {/* Content Section */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Latest Posts */}
        <motion.div
          variants={itemVariants}
          className="border border-gray-200 rounded-xl p-5 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
        >
          <h2 className="text-base font-semibold text-gray-800 mb-3">
            Latest Posts
          </h2>

          <div className="grid gap-3">
            {posts.map((post, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="border border-gray-100 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <p className="text-sm font-medium text-gray-800">
                  {post.title}
                </p>
                <p className="text-[12px] text-gray-500 mt-1">
                  Posted on {post.date}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Activities */}
        <motion.div
          variants={itemVariants}
          className="border border-gray-200 rounded-xl p-5 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
        >
          <h2 className="text-base font-semibold text-gray-800 mb-3">
            Upcoming Activities
          </h2>

          <div className="grid gap-3">
            {activities.map((a, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="border border-gray-100 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <p className="text-sm font-medium text-gray-800">{a.title}</p>
                <p className="text-[12px] text-gray-500 mt-1">
                  📅 {a.date} · 📍 {a.location}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
