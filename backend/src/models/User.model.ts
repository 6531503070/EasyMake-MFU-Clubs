import { Schema, model, HydratedDocument } from "mongoose";
import { genId } from "../utils/uuid";

export type UserRole = "super-admin" | "club-leader" | "co-leader" | "user";

export interface IUser {
  _id: string;
  email: string;
  role: UserRole;
  google_id?: string | null;
  password_hash?: string | null;
  citizen_id?: string;
  full_name?: string;
  phone?: string;
  is_active: boolean;
  clubId?: string | null;
  created_at?: Date;
  updated_at?: Date;
   is_founder_for_club_id?: string | null;
}

export type UserDoc = HydratedDocument<IUser>;

const UserSchema = new Schema<IUser>(
  {
    _id: { type: String, default: genId },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["super-admin", "club-leader", "co-leader", "user"], required: true },
    google_id: { type: String, default: null },
    password_hash: { type: String, default: null },
    citizen_id: { type: String, default: "" },
    full_name: { type: String, default: "" },
    phone: { type: String, default: "" },
    is_active: { type: Boolean, default: true },
    clubId: { type: String, ref: "Club", default: null },
    is_founder_for_club_id: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const UserModel = model<IUser>("User", UserSchema);
