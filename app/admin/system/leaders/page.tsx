"use client";

import { motion, type Variants } from "framer-motion";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { ClubRegistrationForm } from "@/components/admin/leaders/ClubRegistrationForm";
import { ClubsTable } from "@/components/admin/leaders/ClubsTable";

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

export default function SystemLeadersPage() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen w-full flex flex-col items-center justify-start px-6 md:px-12 py-8 bg-gray-50 text-gray-900 space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="w-full max-w-5xl">
        <SectionHeader
          title="Register New Club"
          subtitle="Create a club, assign a leader, and add required members."
        />
      </motion.div>

      {/* Registration Form */}
      <motion.div
        variants={itemVariants}
        className="w-full flex justify-center"
      >
        <ClubRegistrationForm />
      </motion.div>

      {/* Table Section */}
      <motion.div variants={itemVariants} className="w-full max-w-5xl">
        <ClubsTable />
      </motion.div>
    </motion.section>
  );
}
