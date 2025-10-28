import { Schema, model } from "mongoose";
import { genId } from "../utils/uuid";

const ClubPostSchema = new Schema(
  {
    _id: { type: String, default: genId },

    club_id: { type: String, ref: "Club", required: true },
    author_user_id: { type: String, ref: "User", required: true },

    title: { type: String, required: true },
    subtitle: { type: String },
    content: { type: String },

    images: { type: [String], default: [] },
    published: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const ClubPostModel = model("ClubPost", ClubPostSchema);
