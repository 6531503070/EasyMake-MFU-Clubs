import { ActivityModel } from "../models/Activity.model";
import { ActivityRegistrationModel } from "../models/ActivityRegistration.model";
import { ClubModel } from "../models/Club.model";
import { ClubFollowerModel } from "../models/ClubFollower.model";
import { HttpError } from "../utils/errors";
import { NotificationService } from "./NotificationService";

async function createActivity(authorUserId: string, clubId: string, data: {
  title: string;
  subtitle?: string;
  description?: string;
  location?: string;
  start_time: Date;
  end_time?: Date;
  capacity: number;
  images?: string[];
  visibility?: "public" | "followers-only" | "private";
}) {
  if (!data.title || !data.start_time || !data.capacity) {
    throw new HttpError(400, "title, start_time, capacity required");
  }

  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");

  const staffRel = await ClubFollowerModel.findOne({
    club_id: clubId,
    user_id: authorUserId,
    role_at_club: { $in: ["co-leader", "staff"] },
  });
  const isLeader = club.leader_user_id === authorUserId;
  if (!isLeader && !staffRel) {
    throw new HttpError(403, "Not allowed to create activity");
  }

  const status =
    club.status === "suspended" ? "draft" : "published";

  const activity = await ActivityModel.create({
    club_id: clubId,
    title: data.title,
    subtitle: data.subtitle || "",
    description: data.description || "",
    location: data.location || "",
    start_time: data.start_time,
    end_time: data.end_time || null,
    capacity: data.capacity,
    images: data.images || [],
    status,
    visibility: data.visibility || "public",
  });

  if (status === "published") {
    await NotificationService.broadcastToFollowers(clubId, {
      type: "activity_update",
      title: `New activity: ${data.title}`,
      body: data.subtitle || data.description?.slice(0, 120),
      link_url: `/activities/${activity._id}`,
    });
  }

  return activity;
}

async function updateStatus(activityId: string, updaterUserId: string, newStatus: "draft" | "published" | "cancelled") {
  const activity = await ActivityModel.findById(activityId);
  if (!activity) throw new HttpError(404, "Activity not found");

  const club = await ClubModel.findById(activity.club_id);
  if (!club) throw new HttpError(404, "Club not found");

  const isLeader = club.leader_user_id === updaterUserId;
  const staffRel = await ClubFollowerModel.findOne({
    club_id: club._id,
    user_id: updaterUserId,
    role_at_club: { $in: ["co-leader", "staff"] },
  });

  const allowed = isLeader || !!staffRel;
  if (!allowed) throw new HttpError(403, "Not allowed to update status");

  activity.status = newStatus;
  await activity.save();

  if (newStatus === "cancelled") {
    await NotificationService.broadcastToFollowers(club._id, {
      type: "activity_update",
      title: `Activity cancelled: ${activity.title}`,
      body: `An activity from ${club.name} was cancelled.`,
      link_url: `/activities/${activity._id}`,
    });
  }

  return activity;
}

async function registerToActivity(userId: string, activityId: string) {
  const activity = await ActivityModel.findById(activityId);
  if (!activity) throw new HttpError(404, "Activity not found");
  if (activity.status !== "published") {
    throw new HttpError(400, "Activity not open for registration");
  }

  const activeCount = await ActivityRegistrationModel.countDocuments({
    activity_id: activityId,
    status: { $ne: "cancelled" },
  });
  if (activeCount >= activity.capacity) {
    throw new HttpError(400, "Activity full");
  }

  const reg = await ActivityRegistrationModel.create({
    activity_id: activityId,
    user_id: userId,
    status: "registered",
    checkin_at: null,
    cancelled_at: null,
  });

  const club = await ClubModel.findById(activity.club_id);
  if (club) {
    await NotificationService.sendToUser(club.leader_user_id, {
      type: "new_registration",
      title: `New registration: ${activity.title}`,
      body: `A user registered for your activity`,
      link_url: `/activities/${activityId}/registrations`,
    });
  }

  return reg;
}

async function checkIn(regId: string, staffUserId: string) {
  const reg = await ActivityRegistrationModel.findById(regId);
  if (!reg) throw new HttpError(404, "Registration not found");

  const activity = await ActivityModel.findById(reg.activity_id);
  if (!activity) throw new HttpError(404, "Activity not found");

  const club = await ClubModel.findById(activity.club_id);
  if (!club) throw new HttpError(404, "Club not found");

  const isLeader = club.leader_user_id === staffUserId;
  const staffRel = await ClubFollowerModel.findOne({
    club_id: club._id,
    user_id: staffUserId,
    role_at_club: { $in: ["co-leader", "staff"] },
  });
  if (!isLeader && !staffRel) {
    throw new HttpError(403, "Not allowed to check in");
  }

  reg.status = "checked-in";
  reg.checkin_at = new Date();
  await reg.save();

  return reg;
}

export const ActivityService = {
  createActivity,
  updateStatus,
  registerToActivity,
  checkIn,
};
