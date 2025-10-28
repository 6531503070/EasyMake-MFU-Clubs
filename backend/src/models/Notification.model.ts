import { Schema, model } from "mongoose";
import { genId } from "../utils/uuid";

const NotificationSchema = new Schema(
  {
    _id: { type: String, default: genId },

    user_id: { type: String, ref: "User", required: true },
    type: { type: String, required: true }, // new_post, activity_update, report_resolved, club_suspended, ...
    title: { type: String, required: true },
    body: { type: String },
    link_url: { type: String },
    is_read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const NotificationModel = model("Notification", NotificationSchema);
