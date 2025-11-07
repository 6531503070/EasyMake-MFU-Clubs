import { Schema, model } from "mongoose";
import { genId } from "../utils/uuid";

const ActivityRegistrationSchema = new Schema(
  {
    _id: { type: String, default: genId },
    activity_id: { type: String, ref: "Activity", required: true },
    user_id: { type: String, ref: "User", required: true },

    status: {
      type: String,
      enum: ["registered", "checked-in", "cancelled"],
      default: "registered",
    },

    checkin_at: { type: Date },
    cancelled_at: { type: Date },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

ActivityRegistrationSchema.index({ activity_id: 1, user_id: 1 }, { unique: true });

export const ActivityRegistrationModel = model(
  "ActivityRegistration",
  ActivityRegistrationSchema
);
