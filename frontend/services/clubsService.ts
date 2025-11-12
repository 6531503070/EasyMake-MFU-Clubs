import { authedFetch, BASE_URL } from "./http";

export type ClubApiRow = {
  _id: string;
  name: string;
  tagline?: string;
  leader_user_id?: string;
  status: "active" | "suspended";
  leader_full_name?: string;
  leader_email?: string;
  leader_citizen_id?: string;
  members?: Array<{
    user_id?: string;
    full_name: string;
    email: string;
    citizen_id: string;
  }>;
};

export async function getAllClubs(): Promise<{ clubs: ClubApiRow[] }> {
  const data = await authedFetch("/clubs", { method: "GET" });
  return data as { clubs: ClubApiRow[] };
}

export async function getPublicClubs(): Promise<{ clubs: ClubApiRow[] }> {
  const res = await fetch(`${BASE_URL}/clubs/public`, { cache: "no-store" });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Failed to load clubs (${res.status})`);
  }
  return res.json();
}

export async function suspendClub(clubId: string) {
  return authedFetch(`/clubs/${clubId}/suspend`, {
    method: "PATCH",
    body: JSON.stringify({ reason: "Suspended by admin" }),
  });
}

export async function activateClub(clubId: string) {
  return authedFetch(`/clubs/${clubId}/activate`, {
    method: "PATCH",
    body: JSON.stringify({ reason: "Re-activated by admin" }),
  });
}

export async function deleteClub(clubId: string) {
  return authedFetch(`/clubs/${clubId}`, {
    method: "DELETE",
  });
}

export async function registerClubWithLeader(payload: {
  clubName: string;
  leaderName: string;
  leaderEmail: string;
  leaderCitizenId: string;
  members: { name: string; email: string; citizenId: string }[];
}) {
  return authedFetch("/clubs/admin/create-club-with-leader", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateClubWithLeader(
  clubId: string,
  payload: {
    clubName: string;
    leaderName: string;
    leaderEmail: string;
    leaderCitizenId: string;
    members: { name: string; email: string; citizenId: string }[];
  }
) {
  return authedFetch(`/clubs/${clubId}/update-with-leader`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
