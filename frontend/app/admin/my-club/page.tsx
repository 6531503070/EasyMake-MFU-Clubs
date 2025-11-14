"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { getCookie } from "cookies-next";

import { StatCard } from "@/components/admin/StatCard";
import { SectionHeader } from "@/components/admin/SectionHeader";

import { getClubMembers } from "@/services/clubsService";
import { getClubActivities, type ClubActivityListItem } from "@/services/activitiesService";
import { getStaffPosts, type StaffPostRow } from "@/services/postsService";

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

type OverviewPost = {
  title: string;
  dateLabel: string;
};

type OverviewActivity = {
  title: string;
  dateLabel: string;
  location?: string;
};

export default function MyClubOverviewPage() {
  const [followersCount, setFollowersCount] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  const [latestPosts, setLatestPosts] = useState<OverviewPost[]>([]);
  const [upcomingActivities, setUpcomingActivities] = useState<OverviewActivity[]>([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const cid = getCookie("clubId");
    const clubId = typeof cid === "string" ? cid : null;

    if (!clubId) {
      setErr("Missing clubId cookie");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const [members, activities, posts] = await Promise.all([
          getClubMembers(clubId),
          getClubActivities(clubId),
          getStaffPosts(clubId),
        ]);

        // Followers
        setFollowersCount(members.length);

        // Activities
        setTotalActivities(activities.length);

        const now = new Date();

        const upcoming = activities
          .filter((a) => {
            if (!a.start_time) return false;
            const start = new Date(a.start_time);
            return !isNaN(start.getTime()) && start >= now;
          })
          .sort(
            (a, b) =>
              new Date(a.start_time).getTime() -
              new Date(b.start_time).getTime()
          )
          .slice(0, 3)
          .map<OverviewActivity>((a) => ({
            title: a.title,
            dateLabel: new Date(a.start_time).toLocaleString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            location: a.location,
          }));

        setUpcomingActivities(upcoming);

        // Posts
        setTotalPosts(posts.length);

        const latest = [...posts]
          .sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          )
          .slice(0, 3)
          .map<OverviewPost>((p) => ({
            title: p.title,
            dateLabel: new Date(p.updated_at).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          }));

        setLatestPosts(latest);
      } catch (e: any) {
        console.error(e);
        setErr(e?.message || "Failed to load overview data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
          subtitle="Stats for your club, followers, posts, and upcoming activities."
        />
      </motion.div>

      {/* Error / Loading */}
      {loading && (
        <motion.p
          variants={itemVariants}
          className="text-sm text-gray-500"
        >
          Loading overview...
        </motion.p>
      )}
      {err && !loading && (
        <motion.p
          variants={itemVariants}
          className="text-sm text-red-500"
        >
          {err}
        </motion.p>
      )}

      {/* Stat cards row */}
      {!loading && !err && (
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <StatCard
            label="Followers"
            value={followersCount.toString()}
            note="students following your club"
          />
          <StatCard
            label="Upcoming Activities"
            value={upcomingActivities.length.toString()}
            note="events coming up"
          />
          <StatCard
            label="Total Posts"
            value={totalPosts.toString()}
            note="announcements & updates"
          />
        </motion.div>
      )}

      {/* Content Section */}
      {!loading && !err && (
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

            {latestPosts.length === 0 ? (
              <p className="text-sm text-gray-500">
                No posts yet. Create your first announcement in the Posts tab.
              </p>
            ) : (
              <div className="grid gap-3">
                {latestPosts.map((post, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="border border-gray-100 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {post.title}
                    </p>
                    <p className="text-[12px] text-gray-500 mt-1">
                      Posted on {post.dateLabel}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Upcoming Activities */}
          <motion.div
            variants={itemVariants}
            className="border border-gray-200 rounded-xl p-5 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
          >
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Upcoming Activities
            </h2>

            {upcomingActivities.length === 0 ? (
              <p className="text-sm text-gray-500">
                No upcoming activities. Plan a new activity in the Activities tab.
              </p>
            ) : (
              <div className="grid gap-3">
                {upcomingActivities.map((a, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="border border-gray-100 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {a.title}
                    </p>
                    <p className="text-[12px] text-gray-500 mt-1">
                      📅 {a.dateLabel}
                      {a.location ? ` · 📍 ${a.location}` : ""}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
}
