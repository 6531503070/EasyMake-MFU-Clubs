// services/ClubService.ts
import { ClubModel } from "../models/Club.model";
import { ClubFollowerModel } from "../models/ClubFollower.model";
import { UserModel } from "../models/User.model";
import { hashPassword } from "../utils/crypto";
import { HttpError } from "../utils/errors";
import { AuditLogService } from "./AuditLogService";
import { NotificationService } from "./NotificationService";

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
    founding_members: [], // self-create flow ยังไม่บังคับ 5 founding members
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
async function suspendClub(
  superAdminId: string,
  clubId: string,
  reason: string
) {
  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");

  club.status = "suspended";
  await club.save();

  await AuditLogService.log(superAdminId, "SUSPEND_CLUB", "club", clubId, {
    reason,
  });

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

  // enrich leader info for admin table/view
  // -> join User on leader_user_id so frontend can show in dialog view
  const leaderIds = [
    ...new Set(clubs.map((c) => c.leader_user_id).filter(Boolean)),
  ];
  const leaders = await UserModel.find(
    { _id: { $in: leaderIds } },
    "_id full_name email citizen_id"
  ).lean();

  const leaderMap = new Map<string, any>();
  for (const u of leaders) {
    leaderMap.set(u._id, u);
  }

  const hydrated = clubs.map((c) => {
    const leader = leaderMap.get(c.leader_user_id);
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
        role: "club-leader",
        password_hash: pwHash,
        citizen_id: m.citizenId,
        full_name: m.name,
        phone: "",
        is_active: true,
        is_founder_for_club_id: null,
      });
      memberJustCreated = true;
    } else {
      if (memberUser.role !== "club-leader") {
        memberUser.role = "club-leader";
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
    leader_user_id: leaderUser._id,
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
    user_id: leaderUser._id,
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
    leaderUser.is_founder_for_club_id = club._id;
    await leaderUser.save();
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
      _id: leaderUser._id,
      full_name: leaderUser.full_name,
      email: leaderUser.email,
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

  // -----------------------
  // 1. sync leader account
  // -----------------------
  const leaderUser = await UserModel.findById(club.leader_user_id);
  if (!leaderUser) {
    throw new HttpError(500, "leader user missing");
  }

  leaderUser.full_name = data.leaderName;
  leaderUser.email = data.leaderEmail;
  leaderUser.citizen_id = data.leaderCitizenId;
  // leaderUser.password_hash = await hashPassword(data.leaderCitizenId);
  if (leaderUser.role !== "club-leader") {
    leaderUser.role = "club-leader";
  }
  if (!leaderUser.is_founder_for_club_id) {
    leaderUser.is_founder_for_club_id = club._id;
  }
  await leaderUser.save();

  // -----------------------
  // 2. sync founding members
  // -----------------------
  const updatedFoundingSnapshots: {
    user_id?: string;
    full_name: string;
    email: string;
    citizen_id: string;
  }[] = [];

  for (let i = 0; i < data.members.length; i++) {
    const incoming = data.members[i];
    const oldSnap = (club.founding_members as any[])[i]; // old snapshot at same index

    let memberUser = null;

    if (oldSnap && oldSnap.user_id) {
      memberUser = await UserModel.findById(oldSnap.user_id);
    }
    if (!memberUser && incoming.email) {
      memberUser = await UserModel.findOne({ email: incoming.email });
    }

    if (!memberUser) {
      // new person -> create user with role club-leader
      const pwHash = await hashPassword(incoming.citizenId);

      memberUser = await UserModel.create({
        email: incoming.email,
        role: "club-leader",
        password_hash: pwHash,
        citizen_id: incoming.citizenId,
        full_name: incoming.name,
        phone: "",
        is_active: true,
        is_founder_for_club_id: club._id ?? null,
      });
    } else {
      // update existing user's info
      memberUser.full_name = incoming.name;
      memberUser.email = incoming.email;
      memberUser.citizen_id = incoming.citizenId;
      if (memberUser.role !== "club-leader") {
        memberUser.role = "club-leader";
      }
      if (!memberUser.is_founder_for_club_id) {
        memberUser.is_founder_for_club_id = club._id;
      }
      await memberUser.save();
    }

    // make sure they follow club as co-leader
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

  // -----------------------
  // 3. update club fields
  // -----------------------
  club.name = data.clubName;

  club.set(
    "founding_members",
    updatedFoundingSnapshots.map((snap) => ({
      user_id: snap.user_id,
      full_name: snap.full_name,
      email: snap.email,
      citizen_id: snap.citizen_id,
    }))
  );

  await club.save();

  // -----------------------
  // 4. audit
  // -----------------------
  await AuditLogService.log(superAdminId, "UPDATE_CLUB", "club", clubId, {
    member_count: data.members.length,
  });

  return { club };
}

export const ClubService = {
  createClub,
  getClubPublic,
  approveClub,
  suspendClub,
  deleteClub,
  listAllClubs,
  createClubWithLeader,
  activateClub,
  updateClubWithLeader,
};
