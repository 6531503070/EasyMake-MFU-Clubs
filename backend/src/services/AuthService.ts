import { UserModel } from "../models/User.model";
import { hashPassword, comparePassword } from "../utils/crypto";
import { HttpError } from "../utils/errors";
import { signJWT } from "../middleware/auth";
import { env } from "../configs/env";

/**
 * Public registration for normal users only.
 * role is always "user".
 */
async function registerUserNormal(data: {
  email: string;
  password: string;
  citizen_id?: string;
  full_name?: string;
  phone?: string;
}) {
  if (!data.email || !data.password) {
    throw new HttpError(400, "email and password required");
  }

  // you can decide if citizen_id is required for user
  if (!data.citizen_id) {
    throw new HttpError(400, "citizen_id required for user role");
  }

  const exists = await UserModel.findOne({ email: data.email });
  if (exists) throw new HttpError(409, "Email already in use");

  const pwHash = await hashPassword(data.password);

  const user = await UserModel.create({
    email: data.email,
    role: "user", // <- fixed
    google_id: null,
    password_hash: pwHash,
    citizen_id: data.citizen_id || "",
    full_name: data.full_name || "",
    phone: data.phone || "",
    is_active: true,
  });

  const token = signJWT({ id: user._id, role: user.role });
  return { user, token };
}

/**
 * One-time / protected creation of a super-admin.
 * This is NOT public. We'll protect it in controller/route.
 */
async function createSuperAdmin(data: {
  email: string;
  password: string;
  secret: string;
  full_name?: string;
  phone?: string;
}) {
  const expectedSecret = env.SUPERADMIN_SETUP_SECRET;

  if (!expectedSecret) {
    throw new HttpError(500, "SUPERADMIN_SETUP_SECRET not configured");
  }

  if (!data.secret || data.secret !== expectedSecret) {
    throw new HttpError(403, "Forbidden");
  }

  if (!data.email || !data.password) {
    throw new HttpError(400, "email and password required");
  }

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
  });

  const token = signJWT({ id: user._id, role: user.role });
  return { user, token };
}

/**
 * Login
 */
async function login(email: string, password: string) {
  const user = await UserModel.findOne({ email });
  if (!user) throw new HttpError(401, "Invalid credentials");
  if (!user.password_hash) throw new HttpError(401, "Use OAuth login");

  const ok = await comparePassword(password, user.password_hash);
  if (!ok) throw new HttpError(401, "Invalid credentials");

  if (!user.is_active) throw new HttpError(403, "Account disabled");

  const token = signJWT({ id: user._id, role: user.role });
  return { user, token };
}

/**
 * Google auth
 */
async function registerOrAttachGoogle(data: {
  email: string;
  google_id: string;
  full_name?: string;
}) {
  if (!data.email || !data.google_id) {
    throw new HttpError(400, "email and google_id required");
  }

  let user = await UserModel.findOne({ email: data.email });

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
    });
  }

  const token = signJWT({ id: user._id, role: user.role });
  return { user, token };
}

/**
 * super-admin can create club-leader
 */
async function createClubLeader(
  superAdminId: string,
  data: {
    email: string;
    citizen_id: string;
    full_name?: string;
    phone?: string;
  }
) {
  if (!data.email || !data.citizen_id) {
    throw new HttpError(400, "email and citizen_id required");
  }

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
