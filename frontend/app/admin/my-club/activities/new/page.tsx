"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { createActivity } from "@/services/activitiesService";
import { ActivityForm } from "@/components/admin/activities/ActivityForm";

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
      alert(err.message || "Create failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (clubId === null) return <p>Loading…</p>;
  if (!clubId)
    return (
      <p className="text-red-600 text-sm">{error ?? "No clubId cookie"}</p>
    );

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Create Activity</h1>
      <ActivityForm onSubmit={handleSubmit} submitting={submitting} />
    </section>
  );
}
