import { Schema, model } from "mongoose";
import { genId } from "../utils/uuid";

const AuditLogSchema = new Schema(
  {
    _id: { type: String, default: genId },

    actor_user_id: { type: String, ref: "User", required: true },
    action: { type: String, required: true }, // e.g. "SUSPEND_CLUB"
    target_type: {
      type: String,
      enum: ["club", "activity", "post", "report", "user"],
      required: true,
    },
    target_id: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export const AuditLogModel = model("AuditLog", AuditLogSchema);
