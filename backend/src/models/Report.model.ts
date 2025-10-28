import { Schema, model } from "mongoose";
import { genId } from "../utils/uuid";

const ReportSchema = new Schema(
  {
    _id: { type: String, default: genId },

    reporter_user_id: { type: String, ref: "User", required: true },
    target_type: {
      type: String,
      enum: ["club", "activity", "post", "other"],
      required: true,
    },

    club_id: { type: String, ref: "Club" },
    activity_id: { type: String, ref: "Activity" },
    post_id: { type: String, ref: "ClubPost" },

    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "reviewing", "resolved", "rejected"],
      default: "pending",
    },

    reviewed_by: { type: String, ref: "User" }, // super-admin
    admin_note: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const ReportModel = model("Report", ReportSchema);
