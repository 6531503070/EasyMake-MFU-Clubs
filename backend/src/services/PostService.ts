import { ClubPostModel } from "../models/ClubPost.model";
import { ClubModel } from "../models/Club.model";
import { ClubFollowerModel } from "../models/ClubFollower.model";
import { HttpError } from "../utils/errors";
import { NotificationService } from "./NotificationService";

async function createPost(authorUserId: string, clubId: string, data: {
  title: string;
  subtitle?: string;
  content?: string;
  images?: string[];
}) {
  if (!data.title) throw new HttpError(400, "title required");

  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");
  if (club.status === "suspended") {
    throw new HttpError(403, "Club is suspended");
  }

  const staffRel = await ClubFollowerModel.findOne({
    club_id: clubId,
    user_id: authorUserId,
    role_at_club: { $in: ["co-leader", "staff"] },
  });
  const isLeader = club.leader_user_id === authorUserId;
  if (!isLeader && !staffRel) {
    throw new HttpError(403, "Not allowed to post in this club");
  }

  const post = await ClubPostModel.create({
    club_id: clubId,
    author_user_id: authorUserId,
    title: data.title,
    subtitle: data.subtitle || "",
    content: data.content || "",
    images: data.images || [],
    published: true,
    is_deleted: false,
  });

  await NotificationService.broadcastToFollowers(clubId, {
    type: "new_post",
    title: data.title,
    body: data.subtitle || data.content?.slice(0, 120),
    link_url: `/clubs/${clubId}/posts/${post._id}`,
  });

  return post;
}

async function listPostsPublic(clubId: string) {
  const posts = await ClubPostModel.find({
    club_id: clubId,
    is_deleted: false,
    published: true,
  }).sort({ created_at: -1 });
  return posts;
}

async function softDeletePost(postId: string, actorUserId: string, isSuperAdmin: boolean) {
  const post = await ClubPostModel.findById(postId);
  if (!post) throw new HttpError(404, "Post not found");

  if (!isSuperAdmin && post.author_user_id !== actorUserId) {
    throw new HttpError(403, "Not allowed");
  }

  post.is_deleted = true;
  await post.save();
  return post;
}

export const PostService = {
  createPost,
  listPostsPublic,
  softDeletePost,
};
