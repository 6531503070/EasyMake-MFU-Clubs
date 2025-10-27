import { ClubFollowerModel } from "../models/ClubFollower.model";
import { ClubModel } from "../models/Club.model";
import { HttpError } from "../utils/errors";
import { NotificationService } from "./NotificationService";

async function followClub(userId: string, clubId: string) {
  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");

  const rel = await ClubFollowerModel.findOne({ user_id: userId, club_id: clubId });
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

export const FollowService = {
  followClub,
  unfollowClub,
};
