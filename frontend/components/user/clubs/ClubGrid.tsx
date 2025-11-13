"use client";

import ClubCard from "./ClubCard";

export default function ClubsGrid({
  clubs,
  viewMode,
}: {
  clubs: Array<{ _id: string; name: string; tagline?: string; cover_image_url?: string }>;
  viewMode: "grid" | "list";
}) {
  if (clubs.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl">🔍</div>
        <h3 className="text-2xl font-semibold mt-4">No clubs found</h3>
        <p className="text-muted-foreground mt-2">Try a different search.</p>
      </div>
    );
  }

  return (
    <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "max-w-4xl mx-auto space-y-6"}>
      {clubs.map((club, idx) => (
        <ClubCard key={club._id} club={club} viewMode={viewMode} index={idx} />
      ))}
    </div>
  );
}
