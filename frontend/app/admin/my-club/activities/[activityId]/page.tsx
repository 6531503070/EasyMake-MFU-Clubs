"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { getActivityManageView, type ActivityManageView } from "@/services/activitiesService";
import { TableCard } from "@/components/admin/TableCard";
import { motion, Variants } from "framer-motion";
import { ActivityHeader } from "@/components/admin/activities/ActivityHeader";
import { RegisteredStudentsTable } from "@/components/admin/activities/RegisteredStudentsTable";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export default function ActivityDetailPage() {
  const params = useParams<{ id?: string | string[] }>();
  const pathname = usePathname();
  const router = useRouter();

  const activityId = useMemo(() => {
    const p = params?.id;
    if (typeof p === "string" && p) return p;
    if (Array.isArray(p) && p[0]) return p[0];
    const seg = pathname?.split("/").filter(Boolean).pop();
    if (seg && seg !== "new") return seg;
    return "";
  }, [params?.id, pathname]);

  const [hydrated, setHydrated] = useState(false);
  const [data, setData] = useState<ActivityManageView | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    if (!activityId) {
      setLoading(false);
      setErr("No activity id in URL");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const resp = await getActivityManageView(activityId);
        if (cancelled) return;
        setData(resp);
        setErr("");
      } catch (e: any) {
        if (cancelled) return;
        setErr(e?.message || "Load failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, activityId]);

  const whenText = useMemo(() => {
    if (!data?.activity?.start_time) return "-";
    const fmt = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: false,
    });
    const start = fmt.format(new Date(data.activity.start_time));
    const end = data.activity.end_time ? fmt.format(new Date(data.activity.end_time)) : "";
    return end ? `${start} · ${end}` : start;
  }, [data?.activity?.start_time, data?.activity?.end_time]);

  if (!hydrated || loading) {
    return (
      <section className="max-w-4xl mx-auto px-4 space-y-4">
        <div className="h-6 w-40 rounded bg-gray-200 animate-pulse" />
        <TableCard>
          <div className="p-4 text-sm text-gray-500">Loading activity…</div>
        </TableCard>
      </section>
    );
  }

  if (err) {
    return (
      <section className="max-w-4xl mx-auto px-4 space-y-4">
        <div className="text-xl font-semibold">Activity</div>
        <TableCard>
          <div className="p-4 text-sm text-red-600">Error: {err}</div>
        </TableCard>
        <button
          onClick={() => router.back()}
          className="inline-flex rounded-md border px-3 py-2 text-sm"
        >
          Back
        </button>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="max-w-4xl mx-auto px-4 space-y-4">
        <div className="text-xl font-semibold">Activity</div>
        <TableCard>
          <div className="p-4 text-sm text-gray-500">No data.</div>
        </TableCard>
      </section>
    );
  }

  return (
    <motion.section
      className="space-y-8 max-w-4xl mx-auto px-4"
      variants={pageVariants}
      initial="hidden"
      animate="show"
    >
      <ActivityHeader
        title={data.activity.title}
        location={data.activity.location || "-"}
        whenText={whenText}
        capacity={data.activity.capacity}
        registeredCount={data.registeredCount ?? 0}
        status={data.activity.status}
        images={data.activity.images || []}
        onBack={() => router.back()}
        onEdit={() => {}}
        onCancel={() => {}}
      />

      <TableCard>
        <div className="p-4 md:p-6 space-y-3">
          <div className="text-sm text-gray-700 leading-relaxed">
            {data.activity.description || "—"}
          </div>
          <div className="text-[12px] text-gray-400">Visibility: Public</div>
        </div>
      </TableCard>

      <RegisteredStudentsTable students={data.students} />
    </motion.section>
  );
}
