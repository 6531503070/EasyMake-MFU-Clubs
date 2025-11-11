import mongoose from "mongoose";

const ClubPostSchema = new mongoose.Schema(
  {
    club_id: { type: String, ref: "clubs", required: true },
    author_user_id: { type: String, ref: "users", required: true },

    title: { type: String, required: true },
    content: { type: String, default: "" },

    images: { type: [String], default: [] },

    published: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "club_posts",
  }
);

export const ClubPostModel = mongoose.model("club_posts", ClubPostSchema);
