"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { ClubRegistrationForm } from "@/components/admin/leaders/ClubRegistrationForm";
import { ClubsTable } from "@/components/admin/leaders/ClubsTable";
import {
  getAllClubs,
  type ClubApiRow,
} from "@/services/clubsService";

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
  // -------- lift state ขึ้นมาอยู่ตรงนี้ --------
  const [clubs, setClubs] = useState<ClubApiRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // ดึงข้อมูล clubs จาก backend
  const refreshClubs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllClubs();
      setClubs(data.clubs || []);
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load clubs");
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    refreshClubs();
  }, [refreshClubs]);

  // callback ให้ฟอร์มเรียกหลังสร้างเสร็จ
  async function handleClubCreated() {
    // วิธีง่ายสุด: refresh ทั้ง list จาก backend ใหม่
    await refreshClubs();
  }

  // callback จาก table เวลา suspend/delete เสร็จ
  function handleClubListChange(nextClubs: ClubApiRow[]) {
    setClubs(nextClubs);
  }

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
        <ClubRegistrationForm onCreated={handleClubCreated} />
      </motion.div>

      {/* Table Section */}
      <motion.div variants={itemVariants} className="w-full max-w-5xl">
        <ClubsTable
          clubs={clubs}
          loading={loading}
          errorMsg={errorMsg}
          onListChange={handleClubListChange}
        />
      </motion.div>
    </motion.section>
  );
}
