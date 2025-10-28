import { ActivityModel } from "../models/Activity.model";
import { ActivityRegistrationModel } from "../models/ActivityRegistration.model";
import { ClubModel } from "../models/Club.model";
import { ClubFollowerModel } from "../models/ClubFollower.model";
import { UserModel } from "../models/User.model";
import { HttpError } from "../utils/errors";
import { NotificationService } from "./NotificationService";

async function assertIsClubStaff(userId: string, clubId: string) {
  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");

  if (club.leader_user_id === userId) return club;

  const rel = await ClubFollowerModel.findOne({
    club_id: clubId,
    user_id: userId,
    role_at_club: { $in: ["co-leader"] },
  });
  if (!rel) {
    throw new HttpError(403, "Not allowed to manage this club");
  }

  return club;
}

async function assertIsClubStaffForActivity(userId: string, activity: any) {
  const club = await ClubModel.findById(activity.club_id);
  if (!club) throw new HttpError(404, "Club not found");

  if (club.leader_user_id === userId) return club;

  const rel = await ClubFollowerModel.findOne({
    club_id: activity.club_id,
    user_id: userId,
    role_at_club: { $in: ["co-leader"] },
  });
  if (!rel) {
    throw new HttpError(403, "Not allowed to manage this activity");
  }

  return club;
}

async function createActivity(
  authorUserId: string,
  clubId: string,
  data: {
    title: string;
    subtitle?: string;
    description?: string;
    location?: string;
    start_time: Date;
    end_time?: Date;
    capacity: number;
    images?: string[];
    visibility?: "public" | "followers-only" | "private";
  }
) {
  if (!data.title || !data.start_time || !data.capacity) {
    throw new HttpError(400, "title, start_time, capacity required");
  }

  const club = await assertIsClubStaff(authorUserId, clubId);

  const status = club.status === "suspended" ? "draft" : "published";

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

async function updateStatus(
  activityId: string,
  updaterUserId: string,
  newStatus: "draft" | "published" | "cancelled"
) {
  const activity = await ActivityModel.findById(activityId);
  if (!activity) throw new HttpError(404, "Activity not found");

  const club = await assertIsClubStaffForActivity(updaterUserId, activity);

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

  await assertIsClubStaffForActivity(staffUserId, activity);

  reg.status = "checked-in";
  reg.checkin_at = new Date();
  await reg.save();

  return reg;
}

async function listActivitiesForClub(staffUserId: string, clubId: string) {
  await assertIsClubStaff(staffUserId, clubId);

  const acts = await ActivityModel.find(
    { club_id: clubId },
    "_id title start_time end_time location capacity status"
  )
    .sort({ start_time: 1 })
    .lean();

  const ids = acts.map((a) => a._id);
  const regs = await ActivityRegistrationModel.aggregate([
    {
      $match: {
        activity_id: { $in: ids },
        status: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: "$activity_id",
        count: { $sum: 1 },
      },
    },
  ]);

  const regMap = new Map<string, number>();
  regs.forEach((r: any) => {
    regMap.set(String(r._id), r.count);
  });

  return acts.map((a) => ({
    _id: a._id,
    title: a.title,
    start_time: a.start_time,
    end_time: a.end_time,
    location: a.location,
    capacity: a.capacity,
    registered: regMap.get(String(a._id)) || 0,
    status: a.status,
  }));
}

async function getActivityManageView(staffUserId: string, activityId: string) {
  const activity = await ActivityModel.findById(activityId);
  if (!activity) throw new HttpError(404, "Activity not found");

  await assertIsClubStaffForActivity(staffUserId, activity);

  const regs = await ActivityRegistrationModel.find(
    { activity_id: activityId },
    "_id user_id status"
  ).lean();

  const userIds = regs.map((r) => r.user_id);
  const users = await UserModel.find(
    { _id: { $in: userIds } },
    "_id full_name email"
  ).lean();
  const userMap = new Map<string, any>();
  for (const u of users) {
    userMap.set(String(u._id), u);
  }

  const students = regs.map((r) => ({
    name: userMap.get(String(r.user_id))?.full_name || "",
    email: userMap.get(String(r.user_id))?.email || "",
    status: r.status,
  }));

  const registeredCount = regs.filter(
    (r) => r.status !== "cancelled"
  ).length;

  return {
    activity: {
      _id: activity._id,
      title: activity.title,
      description: activity.description || "",
      location: activity.location || "",
      start_time: activity.start_time,
      end_time: activity.end_time,
      capacity: activity.capacity,
      status: activity.status,
      images: activity.images || [],
    },
    registeredCount,
    students,
  };
}

export const ActivityService = {
  createActivity,
  updateStatus,
  registerToActivity,
  checkIn,
  listActivitiesForClub,
  getActivityManageView,
};
