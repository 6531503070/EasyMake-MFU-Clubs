import { ClubFollowerModel } from "../models/ClubFollower.model";
import { ClubModel } from "../models/Club.model";
import { UserModel } from "../models/User.model";
import { HttpError } from "../utils/errors";
import { NotificationService } from "./NotificationService";

async function assertIsClubStaff(userId: string, clubId: string) {
  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");

  const isLeader = club.leader_user_id === userId;
  if (isLeader) return club;

  const staffRel = await ClubFollowerModel.findOne({
    club_id: clubId,
    user_id: userId,
    role_at_club: { $in: ["co-leader", "staff"] },
  });

  if (!staffRel) {
    throw new HttpError(403, "Not allowed");
  }

  return club;
}

async function followClub(userId: string, clubId: string) {
  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");

  const rel = await ClubFollowerModel.findOne({
    user_id: userId,
    club_id: clubId,
  });
  if (rel) return rel;

  const created = await ClubFollowerModel.create({
    user_id: userId,
    club_id: clubId,
    role_at_club: "member",
  });

  await NotificationService.sendToUser(club.leader_user_id, {
    type: "new_follower",
    title: "You have a new follower",
    body: `A user followed ${club.name}`,
    link_url: `/clubs/${clubId}/followers`,
  });

  return created;
}

async function unfollowClub(userId: string, clubId: string) {
  const rel = await ClubFollowerModel.findOneAndDelete({
    user_id: userId,
    club_id: clubId,
    role_at_club: "member",
  });
  if (!rel) throw new HttpError(404, "Not following");
  return rel;
}

// NEW: list followers/members for dashboard
async function listClubFollowers(staffUserId: string, clubId: string) {
  await assertIsClubStaff(staffUserId, clubId);

  const followers = await ClubFollowerModel.find(
    { club_id: clubId },
    "_id user_id role_at_club created_at"
  ).lean();

  const userIds = followers.map((f) => f.user_id);
  const users = await UserModel.find(
    { _id: { $in: userIds } },
    "_id full_name email"
  ).lean();

  const userMap = new Map<string, any>();
  for (const u of users) {
    userMap.set(u._id, u);
  }

  return followers.map((f) => {
    const u = userMap.get(f.user_id);
    return {
      name: u?.full_name || "",
      email: u?.email || "",
      joinedAt: f.created_at,
      role_at_club: f.role_at_club,
    };
  });
}

export const FollowService = {
  followClub,
  unfollowClub,
  listClubFollowers,
};
