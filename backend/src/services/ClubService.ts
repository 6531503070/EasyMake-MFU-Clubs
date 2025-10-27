import { ClubModel } from "../models/Club.model";
import { ClubFollowerModel } from "../models/ClubFollower.model";
import { HttpError } from "../utils/errors";
import { AuditLogService } from "./AuditLogService";
import { NotificationService } from "./NotificationService";

async function createClub(leaderUserId: string, data: {
  name: string;
  tagline?: string;
  description?: string;
  contact_channels?: { platform: string; handle: string }[];
  cover_image_url?: string;
  min_members?: number;
}) {
  if (!data.name) throw new HttpError(400, "name required");

  const club = await ClubModel.create({
    name: data.name,
    tagline: data.tagline || "",
    description: data.description || "",
    contact_channels: data.contact_channels || [],
    cover_image_url: data.cover_image_url || "",
    min_members: data.min_members ?? 5,
    status: "active",
    leader_user_id: leaderUserId,
    approved_by: null,
    approved_at: null,
  });

  await ClubFollowerModel.create({
    club_id: club._id,
    user_id: leaderUserId,
    role_at_club: "co-leader",
  });

  return club;
}

async function getClubPublic(clubId: string) {
  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");
  return club;
}

async function approveClub(superAdminId: string, clubId: string) {
  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");

  club.approved_by = superAdminId;
  club.approved_at = new Date();
  await club.save();

  await AuditLogService.log(
    superAdminId,
    "APPROVE_CLUB",
    "club",
    clubId,
    {}
  );

  return club;
}

async function suspendClub(superAdminId: string, clubId: string, reason: string) {
  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");

  club.status = "suspended";
  await club.save();

  await AuditLogService.log(
    superAdminId,
    "SUSPEND_CLUB",
    "club",
    clubId,
    { reason }
  );

  await NotificationService.broadcastToFollowers(clubId, {
    type: "club_suspended",
    title: `Club ${club.name} has been suspended`,
    body: reason,
    link_url: `/clubs/${clubId}`,
  });

  return club;
}

export const ClubService = {
  createClub,
  getClubPublic,
  approveClub,
  suspendClub,
};
