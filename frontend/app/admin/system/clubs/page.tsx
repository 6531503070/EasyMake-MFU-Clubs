"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { useRouter } from "next/navigation";

import {
  getAllClubs,
  type ClubApiRow,
} from "@/services/clubsService";

import { ClubsTable } from "@/components/admin/leaders/ClubsTable";

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.08 },
  },
};

export default function SystemClubsPage() {
  const router = useRouter();

  // table data state (source of truth at page level)
  const [clubs, setClubs] = useState<ClubApiRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // global alert banner (success / error from row actions)
  const [banner, setBanner] = useState<{ tone: "success" | "error"; msg: string } | null>(null);

  // fetch clubs once
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getAllClubs(); // { clubs: [...] }
        setClubs(data.clubs || []);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to fetch clubs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // callbacks for ClubsTable
  function handleListChange(next: ClubApiRow[]) {
    setClubs(next);
  }

  function handleActionSuccess(msg: string) {
    setBanner({ tone: "success", msg });
    // auto-clear banner after a bit? optional
    // setTimeout(() => setBanner(null), 4000);
  }

  function handleActionError(msg: string) {
    setBanner({ tone: "error", msg });
    // setTimeout(() => setBanner(null), 4000);
  }

  return (
    <motion.section
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Page header */}
      <SectionHeader
        title="All Clubs"
        subtitle="Overview of every registered club."
        action={
          <button
            onClick={() => router.push("/admin/system/leaders")}
            className="px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800"
          >
            + Register New Club
          </button>
        }
      />

      {/* global banner (success / error from actions in the table dialog) */}
      {banner && (
        <div
          className={`text-sm rounded-md px-3 py-2 border ${
            banner.tone === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {banner.msg}
        </div>
      )}

      {/* error from initial fetch */}
      {errorMsg && !banner && (
        <div className="text-sm rounded-md px-3 py-2 bg-red-50 text-red-700 border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* the reusable ClubsTable from leaders page */}
      <ClubsTable
        clubs={clubs}
        loading={loading}
        errorMsg={errorMsg}
        onListChange={handleListChange}
        onActionSuccess={handleActionSuccess}
        onActionError={handleActionError}
      />
    </motion.section>
  );
}
