"use client";

import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { getPublicClubs, type ClubPublic } from "@/services/clubsService";
import FeaturedClubsSection from "@/components/user/home/FeaturedClubsSection";
import FeaturesSection from "@/components/user/home/FeaturesSection";
import BackgroundDecor from "@/components/user/home/BackgroundDecor";
import HeroSection from "@/components/user/home/HeroSection";
import { Navigation } from "@/components/user/home/navigation/navigation";

export default function HomePage() {
  const [clubs, setClubs] = useState<ClubPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getPublicClubs();
        setClubs(res.clubs); 
      } catch (e: any) {
        setError(e?.message || "Failed to load clubs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <BackgroundDecor />
      <HeroSection />
      <FeaturesSection />
      <FeaturedClubsSection clubs={clubs} loading={loading} error={error} />
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
