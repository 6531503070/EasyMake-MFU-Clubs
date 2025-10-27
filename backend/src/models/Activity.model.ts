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

    capacity: { type: Number, required: true },
    images: { type: [String], default: [] },

    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "published",
    },
    visibility: {
      type: String,
      enum: ["public", "followers-only", "private"],
      default: "public",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const ActivityModel = model("Activity", ActivitySchema);
