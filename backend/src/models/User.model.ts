import { Schema, model } from "mongoose";
import { genId } from "../utils/uuid";

const UserSchema = new Schema(
  {
    _id: { type: String, default: genId },

    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["user", "club-leader", "super-admin"],
      required: true,
    },

    google_id: { type: String },
    password_hash: { type: String },
    citizen_id: { type: String },

    full_name: { type: String },
    phone: { type: String },

    is_active: { type: Boolean, default: true },
    is_founder_for_club_id: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const UserModel = model("User", UserSchema);
