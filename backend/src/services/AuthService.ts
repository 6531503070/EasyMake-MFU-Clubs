import { UserModel, UserDoc } from "../models/User.model";
import { hashPassword, comparePassword } from "../utils/crypto";
import { HttpError } from "../utils/errors";
import { signJWT } from "../middleware/auth";
import { env } from "../configs/env";
import { ClubModel } from "../models/Club.model";

async function registerUserNormal(data: {
  email: string;
  password: string;
  citizen_id?: string;
  full_name?: string;
  phone?: string;
}) {
  if (!data.email || !data.password) throw new HttpError(400, "email and password required");
  if (!data.citizen_id) throw new HttpError(400, "citizen_id required for user role");
  const exists = await UserModel.findOne({ email: data.email });
  if (exists) throw new HttpError(409, "Email already in use");
  const pwHash = await hashPassword(data.password);
  const user = await UserModel.create({
    email: data.email,
    role: "user",
    google_id: null,
    password_hash: pwHash,
    citizen_id: data.citizen_id || "",
    full_name: data.full_name || "",
    phone: data.phone || "",
    is_active: true,
    clubId: null,
  });
  const token = signJWT({ id: user._id, role: user.role });
  return { user, token, clubId: null as string | null };
}

async function createSuperAdmin(data: {
  email: string;
  password: string;
  secret: string;
  full_name?: string;
  phone?: string;
}) {
  const expectedSecret = env.SUPERADMIN_SETUP_SECRET;
  if (!expectedSecret) throw new HttpError(500, "SUPERADMIN_SETUP_SECRET not configured");
  if (!data.secret || data.secret !== expectedSecret) throw new HttpError(403, "Forbidden");
  if (!data.email || !data.password) throw new HttpError(400, "email and password required");
  const exists = await UserModel.findOne({ email: data.email });
  if (exists) throw new HttpError(409, "Email already in use");
  const pwHash = await hashPassword(data.password);
  const user = await UserModel.create({
    email: data.email,
    role: "super-admin",
    google_id: null,
    password_hash: pwHash,
    citizen_id: "",
    full_name: data.full_name || "",
    phone: data.phone || "",
    is_active: true,
    clubId: null,
  });
  const token = signJWT({ id: user._id, role: user.role });
  return { user, token, clubId: null as string | null };
}

async function login(email: string, password: string) {
  const user = (await UserModel.findOne({ email })) as UserDoc | null;
  if (!user) throw new HttpError(401, "Invalid credentials");
  if (!user.password_hash) throw new HttpError(401, "Use OAuth login");
  const ok = await comparePassword(password, user.password_hash);
  if (!ok) throw new HttpError(401, "Invalid credentials");
  if (!user.is_active) throw new HttpError(403, "Account disabled");

  let clubId: string | null = null;
  if (user.role === "club-leader" || user.role === "co-leader") {
    clubId = user.clubId || null;
    if (!clubId) {
      const club = await ClubModel.findOne(
        { $or: [{ leaderUserId: user._id }, { coLeaderUserIds: user._id }] },
        { _id: 1 }
      ).lean();
      if (club) {
        clubId = String(club._id);
        if (!user.clubId) {
          user.clubId = clubId;
          await user.save();
        }
      }
    }
  }

  const token = signJWT({ id: user._id, role: user.role });
  return { user, token, clubId };
}

async function registerOrAttachGoogle(data: { email: string; google_id: string; full_name?: string }) {
  if (!data.email || !data.google_id) throw new HttpError(400, "email and google_id required");
  let user = (await UserModel.findOne({ email: data.email })) as UserDoc | null;
  if (user) {
    if (!user.google_id) {
      user.google_id = data.google_id;
      await user.save();
    }
  } else {
    user = await UserModel.create({
      email: data.email,
      role: "user",
      google_id: data.google_id,
      password_hash: null,
      citizen_id: "",
      full_name: data.full_name || "",
      is_active: true,
      clubId: null,
    });
  }
  const token = signJWT({ id: user._id, role: user.role });
  return { user, token, clubId: user.clubId || null };
}

async function createClubLeader(
  superAdminId: string,
  data: { email: string; citizen_id: string; full_name?: string; phone?: string }
) {
  if (!data.email || !data.citizen_id) throw new HttpError(400, "email and citizen_id required");
  const exists = await UserModel.findOne({ email: data.email });
  if (exists) throw new HttpError(409, "Email already in use");
  const pwHash = await hashPassword(data.citizen_id);
  const leader = await UserModel.create({
    email: data.email,
    role: "club-leader",
    password_hash: pwHash,
    citizen_id: data.citizen_id,
    full_name: data.full_name || "",
    phone: data.phone || "",
    is_active: true,
    clubId: null,
  });
  return leader;
}

async function deactivateUser(superAdminId: string, targetUserId: string) {
  const target = await UserModel.findById(targetUserId);
  if (!target) throw new HttpError(404, "User not found");
  target.is_active = false;
  await target.save();
  return target;
}

export const AuthService = {
  registerUserNormal,
  createSuperAdmin,
  login,
  registerOrAttachGoogle,
  createClubLeader,
  deactivateUser,
};
