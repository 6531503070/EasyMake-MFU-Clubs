"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { ActivityTable } from "@/components/admin/activities/ActivityTable";
import { getClubActivities, ClubActivityListItem } from "@/services/activitiesService";

export default function ActivitiesPage() {
  const [clubId, setClubId] = useState<string | null>(null);
  const [activities, setActivities] = useState<ClubActivityListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const cid = getCookie("clubId");
    setClubId(typeof cid === "string" ? cid : null);
  }, []);

  useEffect(() => {
    async function run() {
      if (clubId === null) return; // ยังโหลด cookie อยู่
      if (!clubId) {
        setLoading(false);
        setError("No clubId cookie. โปรดล็อกอินบัญชีหัวหน้าชมรม/ผู้ช่วย");
        return;
      }
      try {
        setLoading(true);
        const rows = await getClubActivities(clubId); // ✅ เรียก /clubs/:clubId/activities/mine
        console.log("[activities]", rows);
        setActivities(rows);
        setError("");
      } catch (e: any) {
        console.error("load activities failed:", e);
        setError(e.message || "Load failed");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [clubId]);

  return (
    <section className="space-y-2">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Activities</h1>
          <p className="text-sm text-gray-500">Create events and track registrations.</p>
        </div>
        <a
          href="/admin/my-club/activities/new"
          className="rounded-lg bg-gray-900 text-white px-3 py-2 text-sm hover:bg-gray-800"
        >
          + New Activity
        </a>
      </header>

      <ActivityTable activities={activities} loading={loading} error={error} />
    </section>
  );
}
