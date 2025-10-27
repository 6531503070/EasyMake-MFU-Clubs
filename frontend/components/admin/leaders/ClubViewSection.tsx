"use client";

import { ClubApiRow } from "@/services/clubsService";

type ClubViewSectionProps = {
  club: ClubApiRow;
};

export function ClubViewSection({ club }: ClubViewSectionProps) {
  const leaderFullName = (club as any).leader_full_name || "—";
  const leaderEmail = (club as any).leader_email || "—";
  const leaderCitizenId = (club as any).leader_citizen_id || "—";

  const members: Array<{
    name: string;
    email: string;
    citizenId: string;
  }> = Array.isArray((club as any).members)
    ? (club as any).members
    : [];

  return (
    <div className="text-[13px] leading-relaxed space-y-4">
      <div className="space-y-1">
        <div className="text-gray-800 font-semibold text-sm">
          Club Information
        </div>
        <div>
          <span className="font-medium text-gray-700">Club:</span>{" "}
          {club.name}
        </div>
        {club.tagline && (
          <div>
            <span className="font-medium text-gray-700">Tagline:</span>{" "}
            {club.tagline}
          </div>
        )}
        <div>
          <span className="font-medium text-gray-700">Status:</span>{" "}
          {club.status === "active" ? "Active" : "Suspended"}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-gray-800 font-semibold text-sm">
          Leader
        </div>
        <div className="text-[13px] text-gray-800">
          {leaderFullName} ({leaderEmail})
        </div>
        <div className="text-[12px] text-gray-500">
          Citizen ID: {leaderCitizenId}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-gray-800 font-semibold text-sm">
          Founding Members
        </div>

        {members.length === 0 ? (
          <div className="italic text-gray-400 text-[12px]">
            (no members data)
          </div>
        ) : (
          <ul className="list-disc pl-5 space-y-1 text-[12px] leading-relaxed text-gray-600">
            {members.map((m, idx) => (
              <li key={idx}>
                <span className="text-gray-800 font-medium">
                  {m.name || "—"}
                </span>{" "}
                <span className="text-gray-500">
                  ({m.email || "—"})
                </span>{" "}
                <span className="text-gray-400">
                  #{m.citizenId || "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}