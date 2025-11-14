"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  listMyRegistrations,
  MyActivityRegistration,
} from "@/services/activitiesService";
import { getMyFollowingClubs, FollowingClub } from "@/services/clubsService";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/user/home/navigation/navigation";

export default function MyActivitiesAndClubsPage() {
  const [loading, setLoading] = useState(true);
  const [regs, setRegs] = useState<MyActivityRegistration[]>([]);
  const [clubs, setClubs] = useState<FollowingClub[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [r, c] = await Promise.all([
          listMyRegistrations(),
          getMyFollowingClubs(),
        ]);
        setRegs(r);
        setClubs(c);
      } catch (err: any) {
        setError(err?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
        
      <Navigation />

      <div className="pt-20 pb-16 container mx-auto px-4">
        {/* Back Button */}
        <motion.button
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </motion.button>

        {/* Center Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-10"
        >
          My Activities & My Clubs
        </motion.h1>

        {loading && (
          <p className="text-sm text-muted-foreground text-center">
            Loading...
          </p>
        )}
        {error && !loading && (
          <p className="text-sm text-red-500 text-center mb-4">{error}</p>
        )}

        <section className="mb-14 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">My Activities</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/user/activities">Browse activities</Link>
            </Button>
          </div>

          {regs.length === 0 && !loading ? (
            <p className="text-sm text-muted-foreground">
              You haven't registered for any activities yet.
            </p>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.08 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {regs.map((r) => {
                const a = r.activity;
                const c = r.club;
                if (!a) return null;

                const img = a.images?.[0] || "/placeholder.svg";

                return (
                  <motion.div key={r._id} variants={cardVariants}>
                    <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition bg-card group cursor-pointer">
                      {/* Image */}
                      <div className="relative w-full h-44 overflow-hidden">
                        <Image
                          src={img}
                          alt={a.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>

                      <CardContent className="p-5 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold line-clamp-2">
                            {a.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className="capitalize text-xs"
                          >
                            {r.status}
                          </Badge>
                        </div>

                        {c && (
                          <p className="text-xs text-muted-foreground">
                            {c.name}
                          </p>
                        )}

                        <p className="text-xs text-muted-foreground">
                          {new Date(a.start_time).toLocaleString()}
                          {a.location ? ` • ${a.location}` : ""}
                        </p>

                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="mt-3"
                        >
                          <Link href={`/user/activities`}>View details</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>

        <section className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">My Clubs</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/user/club">Browse clubs</Link>
            </Button>
          </div>

          {clubs.length === 0 && !loading ? (
            <p className="text-sm text-muted-foreground">
              You are not following any clubs yet.
            </p>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.08 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {clubs.map((club) => {
                const img = club.cover_image_url || "/placeholder.svg";

                return (
                  <motion.div key={club._id} variants={cardVariants}>
                    <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition bg-card group cursor-pointer">
                      {/* Image */}
                      <div className="relative w-full h-44 overflow-hidden">
                        <Image
                          src={img}
                          alt={club.name}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>

                      <CardContent className="p-5 flex flex-col gap-2">
                        <h3 className="font-semibold line-clamp-2">
                          {club.name}
                        </h3>

                        {club.tagline && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {club.tagline}
                          </p>
                        )}

                        <p className="text-xs text-muted-foreground">
                          Followers: {club.followerCount ?? "-"}
                        </p>

                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="mt-3"
                        >
                          <Link href={`/user/club/${club._id}`}>View club</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
