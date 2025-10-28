import { Schema, model } from "mongoose";
import { genId } from "../utils/uuid";

const ClubFollowerSchema = new Schema(
  {
    _id: { type: String, default: genId },

    club_id: { type: String, ref: "Club", required: true },
    user_id: { type: String, ref: "User", required: true },
    role_at_club: {
      type: String,
      enum: ["co-leader", "member", "follower", "admin"],
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

ClubFollowerSchema.index({ club_id: 1, user_id: 1 }, { unique: true });

export const ClubFollowerModel = model("ClubFollower", ClubFollowerSchema);
