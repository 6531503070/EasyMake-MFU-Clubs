import { Schema, model } from "mongoose";
import { genId } from "../utils/uuid";

const ActivitySchema = new Schema(
  {
    _id: { type: String, default: genId },

    club_id: { type: String, ref: "Club", required: true },

    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    location: { type: String },

    start_time: { type: Date, required: true },
    end_time: { type: Date },

    capacity: { type: Number, required: true, min: 1 },
    images: { type: [String], default: [] },

    status: {
      type: String,
      enum: ["published", "cancelled"],
      default: "published",
    },

    reminder_before_sent_at: { type: Date },
    reminder_start_sent_at: { type: Date },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

ActivitySchema.index({ club_id: 1, start_time: 1 });
ActivitySchema.index({ status: 1, start_time: 1 });

export const ActivityModel = model("Activity", ActivitySchema);
