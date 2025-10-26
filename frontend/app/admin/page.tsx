"use client";

import { motion } from "framer-motion";
import { useRole } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function AdminDashboardPage() {
  const role = useRole();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Overview of club activity, events, and system status.
        </p>
      </motion.header>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            label="Active Clubs"
            value="52"
            note="clubs currently approved"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard label="Upcoming Events" value="14" note="next 7 days" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard label="Pending Reports" value="3" note="need review" />
        </motion.div>
      </motion.div>

      {/* Role-specific entry points */}
      {role === "club-leader" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <motion.div variants={itemVariants}>
            <QuickCard
              title="Manage Club Profile"
              desc="Edit club description, cover image, contact info."
              href="/admin/my-club/profile"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <QuickCard
              title="Upcoming Activities"
              desc="Create new activities and track registrations."
              href="/admin/my-club/activities"
            />
          </motion.div>
        </motion.div>
      )}

      {role === "super-admin" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <motion.div variants={itemVariants}>
            <QuickCard
              title="All Clubs Overview"
              desc="Check each club, leader, and member count."
              href="/admin/system/clubs"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <QuickCard
              title="Club Leaders (CRUD)"
              desc="Create/edit club leader accounts."
              href="/admin/system/leaders"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <QuickCard
              title="Reports"
              desc="Review reported content / activities."
              href="/admin/system/reports"
            />
          </motion.div>
        </motion.div>
      )}

      {!role && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500 flex items-center gap-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
          Loading role...
        </motion.div>
      )}
    </section>
  );
}

function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all bg-white relative overflow-hidden group"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 opacity-5 rounded-full -mr-8 -mt-8 group-hover:opacity-10 transition-opacity" />

      <div className="relative space-y-2">
        <div className="text-sm text-gray-600">{label}</div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold text-gray-900"
        >
          {value}
        </motion.div>
        <div className="text-xs text-gray-500">{note}</div>
      </div>

      {/* Mini progress bar animation */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-3 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full"
      />
    </motion.div>
  );
}

function QuickCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="block border border-gray-200 rounded-lg p-4 hover:bg-gradient-to-br hover:from-gray-50 hover:to-white hover:border-blue-300 transition-all bg-white relative overflow-hidden group"
      >
        {/* Hover gradient effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
        />

        <div className="relative">
          <div className="text-sm font-semibold text-gray-900 mb-1">
            {title}
          </div>
          <div className="text-sm text-gray-600 mb-3">{desc}</div>
          <motion.div
            className="text-xs text-blue-600 font-medium flex items-center gap-1"
            whileHover={{ x: 4 }}
          >
            <span>Go</span>
            <ArrowRight className="w-3 h-3" />
          </motion.div>
        </div>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 rounded-full blur-2xl opacity-0 group-hover:opacity-5 transition-opacity -mr-8 -mt-8" />
      </motion.div>
    </Link>
  );
}
