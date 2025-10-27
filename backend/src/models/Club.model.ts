import { Schema, model } from "mongoose";
import { genId } from "../utils/uuid";

const ContactChannelSchema = new Schema(
  {
    platform: String,
    handle: String,
  },
  { _id: false }
);

const ClubSchema = new Schema(
  {
    _id: { type: String, default: genId },

    name: { type: String, required: true, unique: true },
    tagline: { type: String },
    description: { type: String },
    contact_channels: { type: [ContactChannelSchema], default: [] },
    cover_image_url: { type: String },

    min_members: { type: Number, required: true, default: 5 },
    status: { type: String, enum: ["active", "suspended"], default: "active" },

    leader_user_id: { type: String, ref: "User", required: true },
    approved_by: { type: String, ref: "User" },
    approved_at: { type: Date },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const ClubModel = model("Club", ClubSchema);
