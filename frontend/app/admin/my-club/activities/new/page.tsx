"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { createActivity } from "@/services/activitiesService";
import { ActivityForm } from "@/components/admin/activities/ActivityForm";
import { motion, Variants } from "framer-motion";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export default function NewActivityPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [clubId, setClubId] = useState<string | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const cid = getCookie("clubId");
    setClubId(typeof cid === "string" ? cid : null);
  }, []);

  async function handleSubmit(data: any) {
    if (!clubId) {
      setError("Club not found. Please login as a Club Leader.");
      return;
    }
    try {
      setSubmitting(true);
      await createActivity(clubId, data);
      router.push("/admin/my-club/activities");
    } catch (err: any) {
      setError(err.message || "Create failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (clubId === null) {
    return (
      <section className="space-y-6 max-w-3xl mx-auto px-4 md:px-0">
        <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
        <div className="h-[300px] rounded-xl border bg-white" />
      </section>
    );
  }

  if (!clubId) {
    return (
      <section className="space-y-4 max-w-3xl mx-auto px-4 md:px-0">
        <div className="text-2xl font-semibold">Create Activity</div>
        <div className="rounded-md border border-amber-300 bg-amber-50 text-amber-900 p-3 text-sm">
          {error ?? "No clubId cookie"}
        </div>
      </section>
    );
  }

  return (
    <motion.section
      className="space-y-6 max-w-3xl mx-auto px-4 md:px-0 py-4"
      variants={pageVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Create Activity</h1>
          <p className="text-sm text-gray-500">Set details and upload images for your event.</p>
        </div>
        <motion.a
          href="/admin/my-club/activities"
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          whileTap={{ scale: 0.98 }}
        >
          Back
        </motion.a>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {error}
        </div>
      )}

      <ActivityForm onSubmit={handleSubmit} submitting={submitting} />
    </motion.section>
  );
}
