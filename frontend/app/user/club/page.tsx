"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Navigation } from "@/components/user/home/navigation/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ClubPublic, getPublicClubs } from "@/services/clubsService";
import ClubsGrid from "@/components/user/clubs/ClubGrid";
import { ErrorDialog } from "@/components/user/ErrorDialog";
import ClubsToolbar from "@/components/user/clubs/ClubToolbar";

export default function ClubPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(9);
  const [clubs, setClubs] = useState<ClubPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [errOpen, setErrOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getPublicClubs();
        setClubs(res.clubs);
      } catch (e: any) {
        setErrMsg(e?.message || "Failed to load clubs");
        setErrOpen(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => setDisplayCount(9), [searchQuery]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return clubs;
    const q = searchQuery.toLowerCase();
    return clubs.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.tagline || "").toLowerCase().includes(q)
    );
  }, [clubs, searchQuery]);

  const displayed = useMemo(() => filtered.slice(0, displayCount), [filtered, displayCount]);
  const hasMore = displayCount < filtered.length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="fixed inset-0 z-0">
        <Image src="/photography-camera-exhibition.jpg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 backdrop-blur-md bg-background/60" />
      </div>
      <div className="fixed inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background z-0" />

      <section className="relative h-[40vh] min-h-[320px] flex items-end justify-center overflow-hidden pt-16 z-10">
        <div className="container mx-auto px-4 pb-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="font-playfair text-5xl font-bold">
            MFU <span className="text-primary">Clubs</span>
          </motion.h1>
          <ClubsToolbar
            value={searchQuery}
            onChange={setSearchQuery}
            viewMode={viewMode}
            onToggleView={setViewMode}
          />
        </div>
      </section>

      <section className="relative py-12 z-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading...</div>
          ) : (
            <>
              <ClubsGrid clubs={displayed} viewMode={viewMode} />
              {hasMore && (
                <div className="text-center pt-12">
                  <Button variant="outline" size="lg" onClick={() => setDisplayCount((p) => p + 6)}>
                    Load More Clubs ({filtered.length - displayCount} remaining)
                  </Button>
                </div>
              )}
              {!hasMore && displayed.length > 0 && (
                <div className="text-center pt-12 text-muted-foreground">Showing all {filtered.length} clubs</div>
              )}
            </>
          )}
        </div>
      </section>

      <div className="relative z-10">
        <Footer />
      </div>

      <ErrorDialog open={errOpen} onOpenChange={setErrOpen} title="Load failed" message={errMsg} />
    </div>
  );
}
