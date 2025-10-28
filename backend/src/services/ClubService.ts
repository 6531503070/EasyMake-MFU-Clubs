import { ClubModel } from "../models/Club.model";
import { ClubFollowerModel } from "../models/ClubFollower.model";
import { UserModel } from "../models/User.model";
import { ActivityModel } from "../models/Activity.model";
import { ActivityRegistrationModel } from "../models/ActivityRegistration.model";
import { ClubPostModel } from "../models/ClubPost.model";
import { hashPassword } from "../utils/crypto";
import { HttpError } from "../utils/errors";
import { AuditLogService } from "./AuditLogService";
import { NotificationService } from "./NotificationService";

// อนุญาตก็ต่อเมื่อ:
// - user เป็น leader ของ club (club.leader_user_id === userId)
// - หรือ user ถูกบันทึกใน ClubFollowerModel.role_at_club === "co-leader"
async function assertIsClubStaff(userId: string, clubId: string) {
  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");

  if (club.leader_user_id === userId) {
    return club;
  }

  const rel = await ClubFollowerModel.findOne({
    club_id: clubId,
    user_id: userId,
    role_at_club: { $in: ["co-leader"] },
  });

  if (!rel) {
    throw new HttpError(403, "Not allowed for this club");
  }

  return club;
}

// ============= BASIC CLUB CREATION / PUBLIC FETCH =============

async function createClub(
  leaderUserId: string,
  data: {
    name: string;
    tagline?: string;
    description?: string;
    contact_channels?: { platform: string; handle: string }[];
    cover_image_url?: string;
    min_members?: number;
  }
) {
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
    founding_members: [],
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

// ============= LEADER/CO-LEADER SELF-EDIT PROFILE =============

async function updateClubProfileByLeader(
  requesterUserId: string,
  clubId: string,
  data: {
    name: string;
    description: string;
    contact_channels: { platform: string; handle: string }[];
    cover_image_url?: string;
  }
) {
  const club = await assertIsClubStaff(requesterUserId, clubId);

  if (!data.name?.trim()) {
    throw new HttpError(400, "name required");
  }

  club.name = data.name;
  club.description = data.description || "";

  const safeChannels = Array.isArray(data.contact_channels)
    ? data.contact_channels.map((c) => ({
        platform: c.platform || "",
        handle: c.handle || "",
      }))
    : [];

  club.set("contact_channels", safeChannels as any);

  if (typeof data.cover_image_url === "string") {
    club.cover_image_url = data.cover_image_url;
  }

  await club.save();
  return club;
}

// ============= DASHBOARD VIEWS =============

async function listClubMembers(requesterUserId: string, clubId: string) {
  await assertIsClubStaff(requesterUserId, clubId);

  const followers = await ClubFollowerModel.find(
    { club_id: clubId },
    "user_id role_at_club created_at"
  ).lean();

  const uniqueIds = [...new Set(followers.map((f) => f.user_id))];

  const users = await UserModel.find(
    { _id: { $in: uniqueIds } },
    "_id full_name email role"
  ).lean();

  const userMap = new Map<string, any>();
  for (const u of users) {
    userMap.set(String(u._id), u);
  }

  return followers.map((f) => ({
    user_id: f.user_id,
    name: userMap.get(String(f.user_id))?.full_name || "",
    email: userMap.get(String(f.user_id))?.email || "",
    // role_at_system = role ใน UserModel เช่น club-leader / co-leader / user
    role_at_system: userMap.get(String(f.user_id))?.role || "",
    // role_at_club = co-leader (จาก ClubFollowerModel)
    role_at_club: f.role_at_club,
    joinedAt: f.created_at,
  }));
}

async function listClubActivities(requesterUserId: string, clubId: string) {
  await assertIsClubStaff(requesterUserId, clubId);

  const acts = await ActivityModel.find(
    { club_id: clubId },
    "_id title location start_time end_time capacity status"
  )
    .sort({ start_time: 1 })
    .lean();

  const actIds = acts.map((a) => a._id);

  const regsAgg = await ActivityRegistrationModel.aggregate([
    { $match: { activity_id: { $in: actIds } } },
    {
      $group: {
        _id: "$activity_id",
        count: { $sum: 1 },
      },
    },
  ]);

  const regMap = new Map<string, number>();
  for (const r of regsAgg) {
    regMap.set(String(r._id), r.count);
  }

  return acts.map((a) => ({
    id: a._id,
    title: a.title,
    location: a.location,
    status: a.status,
    capacity: a.capacity,
    start_time: a.start_time,
    end_time: a.end_time,
    registered: regMap.get(String(a._id)) || 0,
  }));
}

async function listPostsForClubStaff(requesterUserId: string, clubId: string) {
  await assertIsClubStaff(requesterUserId, clubId);

  const posts = await ClubPostModel.find(
    { club_id: clubId, is_deleted: false },
    "_id title subtitle published updated_at"
  )
    .sort({ updated_at: -1 })
    .lean();

  return posts.map((p) => ({
    id: p._id,
    title: p.title,
    subtitle: p.subtitle,
    published: p.published,
    updatedAt: p.updated_at,
  }));
}

// ============= SUPER ADMIN OPS =============

async function approveClub(superAdminId: string, clubId: string) {
  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");

  club.approved_by = superAdminId;
  club.approved_at = new Date();
  await club.save();

  await AuditLogService.log(superAdminId, "APPROVE_CLUB", "club", clubId, {});
  return club;
}

async function activateClub(superAdminId: string, clubId: string) {
  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");

  club.status = "active";
  await club.save();

  await AuditLogService.log(superAdminId, "ACTIVATE_CLUB", "club", clubId, {});
  await NotificationService.broadcastToFollowers(clubId, {
    type: "club_activated",
    title: `Club ${club.name} has been re-activated`,
    body: "This club has regained access.",
    link_url: `/clubs/${clubId}`,
  });

  return club;
}

async function suspendClub(superAdminId: string, clubId: string, reason: string) {
  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");

  club.status = "suspended";
  await club.save();

  await AuditLogService.log(superAdminId, "SUSPEND_CLUB", "club", clubId, { reason });

  await NotificationService.broadcastToFollowers(clubId, {
    type: "club_suspended",
    title: `Club ${club.name} has been suspended`,
    body: reason,
    link_url: `/clubs/${clubId}`,
  });

  return club;
}

async function deleteClub(superAdminId: string, clubId: string) {
  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");

  await AuditLogService.log(superAdminId, "DELETE_CLUB", "club", clubId, {});

  await ClubFollowerModel.deleteMany({ club_id: clubId });

  await UserModel.deleteMany({
    is_founder_for_club_id: clubId,
  });

  await NotificationService.broadcastToFollowers(clubId, {
    type: "club_deleted",
    title: `Club ${club.name} has been deleted`,
    body: "This club has been permanently removed by the administration.",
    link_url: `/clubs`,
  });

  await ClubModel.deleteOne({ _id: clubId });

  return club;
}

async function listAllClubs() {
  const clubs = await ClubModel.find(
    {},
    "_id name tagline status leader_user_id approved_by approved_at founding_members"
  )
    .sort({ created_at: -1 })
    .lean();

  const leaderIds = [...new Set(clubs.map((c) => c.leader_user_id).filter(Boolean))];

  const leaders = await UserModel.find(
    { _id: { $in: leaderIds } },
    "_id full_name email citizen_id"
  ).lean();

  const leaderMap = new Map<string, any>();
  for (const u of leaders) {
    leaderMap.set(String(u._id), u);
  }

  const hydrated = clubs.map((c) => {
    const leader = leaderMap.get(String(c.leader_user_id));
    return {
      ...c,
      leader_full_name: leader?.full_name || "",
      leader_email: leader?.email || "",
      leader_citizen_id: leader?.citizen_id || "",
      members: c.founding_members || [],
    };
  });

  return hydrated;
}

// super-admin creates club + leader + co-leaders
async function createClubWithLeader(
  superAdminId: string,
  data: {
    clubName: string;
    leaderName: string;
    leaderEmail: string;
    leaderCitizenId: string;
    members: Array<{
      name: string;
      email: string;
      citizenId: string;
    }>;
  }
) {
  if (!data.clubName) throw new HttpError(400, "clubName required");
  if (!data.leaderEmail || !data.leaderCitizenId)
    throw new HttpError(400, "leaderEmail and leaderCitizenId required");
  if (!Array.isArray(data.members) || data.members.length < 5)
    throw new HttpError(400, "at least 5 members required");

  let leaderUser = await UserModel.findOne({ email: data.leaderEmail });
  let leaderWasJustCreated = false;

  if (leaderUser) {
    if (leaderUser.role !== "club-leader") {
      throw new HttpError(409, "Email already in use and not a club-leader");
    }
    if (!leaderUser.is_active) {
      throw new HttpError(403, "Leader account is disabled");
    }
  } else {
    const pwHash = await hashPassword(data.leaderCitizenId);

    leaderUser = await UserModel.create({
      email: data.leaderEmail,
      role: "club-leader",
      password_hash: pwHash,
      citizen_id: data.leaderCitizenId,
      full_name: data.leaderName || "",
      phone: "",
      is_active: true,
      is_founder_for_club_id: null,
    });

    leaderWasJustCreated = true;
  }

  const foundingSnapshots: {
    user_id?: string;
    full_name: string;
    email: string;
    citizen_id: string;
    userWasJustCreated: boolean;
  }[] = [];

  for (const m of data.members) {
    if (!m.name?.trim() || !m.email?.trim() || !m.citizenId?.trim()) {
      throw new HttpError(400, "all founding members must be complete");
    }

    let memberUser = await UserModel.findOne({ email: m.email });
    let memberJustCreated = false;

    if (!memberUser) {
      const pwHash = await hashPassword(m.citizenId);
      memberUser = await UserModel.create({
        email: m.email,
        role: "co-leader",
        password_hash: pwHash,
        citizen_id: m.citizenId,
        full_name: m.name,
        phone: "",
        is_active: true,
        is_founder_for_club_id: null,
      });
      memberJustCreated = true;
    } else {
      if (memberUser.role !== "club-leader" && memberUser.role !== "co-leader") {
        memberUser.role = "co-leader";
        await memberUser.save();
      }
    }

    foundingSnapshots.push({
      user_id: memberUser._id,
      full_name: m.name,
      email: m.email,
      citizen_id: m.citizenId,
      userWasJustCreated: memberJustCreated,
    });
  }

  const club = await ClubModel.create({
    name: data.clubName,
    tagline: "",
    description: "",
    contact_channels: [],
    cover_image_url: "",
    min_members: 5,
    status: "active",
    leader_user_id: (leaderUser as any)._id,
    approved_by: superAdminId,
    approved_at: new Date(),
    founding_members: foundingSnapshots.map((snap) => ({
      user_id: snap.user_id,
      full_name: snap.full_name,
      email: snap.email,
      citizen_id: snap.citizen_id,
    })),
  });

  await ClubFollowerModel.create({
    club_id: club._id,
    user_id: (leaderUser as any)._id,
    role_at_club: "co-leader",
  });

  for (const snap of foundingSnapshots) {
    if (!snap.user_id) continue;
    await ClubFollowerModel.create({
      club_id: club._id,
      user_id: snap.user_id,
      role_at_club: "co-leader",
    });
  }

  if (leaderWasJustCreated) {
    (leaderUser as any).is_founder_for_club_id = club._id;
    await (leaderUser as any).save();
  }

  for (const snap of foundingSnapshots) {
    if (!snap.userWasJustCreated || !snap.user_id) continue;
    await UserModel.updateOne(
      { _id: snap.user_id },
      { $set: { is_founder_for_club_id: club._id } }
    );
  }

  await AuditLogService.log(
    superAdminId,
    "CREATE_CLUB_WITH_LEADER",
    "club",
    club._id,
    {
      leader_email: data.leaderEmail,
      member_count: data.members.length,
    }
  );

  return {
    club,
    leader: {
      _id: (leaderUser as any)._id,
      full_name: (leaderUser as any).full_name,
      email: (leaderUser as any).email,
    },
    members: foundingSnapshots.map((snap) => ({
      user_id: snap.user_id,
      full_name: snap.full_name,
      email: snap.email,
      citizen_id: snap.citizen_id,
    })),
  };
}

async function updateClubWithLeader(
  superAdminId: string,
  clubId: string,
  data: {
    clubName: string;
    leaderName: string;
    leaderEmail: string;
    leaderCitizenId: string;
    members: Array<{
      name: string;
      email: string;
      citizenId: string;
    }>;
  }
) {
  if (!data.clubName?.trim()) {
    throw new HttpError(400, "clubName required");
  }
  if (!data.leaderEmail?.trim() || !data.leaderCitizenId?.trim()) {
    throw new HttpError(400, "leaderEmail and leaderCitizenId required");
  }
  if (!Array.isArray(data.members) || data.members.length < 5) {
    throw new HttpError(400, "at least 5 members required");
  }
  for (const m of data.members) {
    if (!m.name?.trim() || !m.email?.trim() || !m.citizenId?.trim()) {
      throw new HttpError(400, "all founding members must be complete");
    }
  }

  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");

  const leaderUser = await UserModel.findById(club.leader_user_id);
  if (!leaderUser) {
    throw new HttpError(500, "leader user missing");
  }

  leaderUser.full_name = data.leaderName;
  leaderUser.email = data.leaderEmail;
  leaderUser.citizen_id = data.leaderCitizenId;
  if (leaderUser.role !== "club-leader") {
    leaderUser.role = "club-leader";
  }
  if (!leaderUser.is_founder_for_club_id) {
    (leaderUser as any).is_founder_for_club_id = club._id;
  }
  await leaderUser.save();

  const updatedFoundingSnapshots: {
    user_id?: string;
    full_name: string;
    email: string;
    citizen_id: string;
  }[] = [];

  for (let i = 0; i < data.members.length; i++) {
    const incoming = data.members[i];
    const oldSnap = (club.founding_members as any[])[i];

    let memberUser: any = null;

    if (oldSnap && oldSnap.user_id) {
      memberUser = await UserModel.findById(oldSnap.user_id);
    }

    if (!memberUser && incoming.email) {
      memberUser = await UserModel.findOne({ email: incoming.email });
    }

    if (!memberUser) {
      const pwHash = await hashPassword(incoming.citizenId);

      memberUser = await UserModel.create({
        email: incoming.email,
        role: "co-leader",
        password_hash: pwHash,
        citizen_id: incoming.citizenId,
        full_name: incoming.name,
        phone: "",
        is_active: true,
        is_founder_for_club_id: club._id ?? null,
      });
    } else {
      memberUser.full_name = incoming.name;
      memberUser.email = incoming.email;
      memberUser.citizen_id = incoming.citizenId;
      if (
        memberUser.role !== "club-leader" &&
        memberUser.role !== "co-leader"
      ) {
        memberUser.role = "co-leader";
      }
      if (!memberUser.is_founder_for_club_id) {
        memberUser.is_founder_for_club_id = club._id;
      }
      await memberUser.save();
    }

    const alreadyFollow = await ClubFollowerModel.findOne({
      club_id: club._id,
      user_id: memberUser._id,
    });
    if (!alreadyFollow) {
      await ClubFollowerModel.create({
        club_id: club._id,
        user_id: memberUser._id,
        role_at_club: "co-leader",
      });
    }

    updatedFoundingSnapshots.push({
      user_id: memberUser._id,
      full_name: incoming.name,
      email: incoming.email,
      citizen_id: incoming.citizenId,
    });
  }

  club.name = data.clubName;
  club.set(
    "founding_members",
    updatedFoundingSnapshots.map((snap) => ({
      user_id: snap.user_id,
      full_name: snap.full_name,
      email: snap.email,
      citizen_id: snap.citizen_id,
    })) as any
  );

  await club.save();

  await AuditLogService.log(superAdminId, "UPDATE_CLUB", "club", clubId, {
    member_count: data.members.length,
  });

  return { club };
}

export const ClubService = {
  createClub,
  getClubPublic,
  updateClubProfileByLeader,
  listClubMembers,
  listClubActivities,
  listPostsForClubStaff,
  approveClub,
  activateClub,
  suspendClub,
  deleteClub,
  listAllClubs,
  createClubWithLeader,
  updateClubWithLeader,
};
