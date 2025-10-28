import { ClubPostModel } from "../models/ClubPost.model";
import { ClubModel } from "../models/Club.model";
import { ClubFollowerModel } from "../models/ClubFollower.model";
import { HttpError } from "../utils/errors";
import { NotificationService } from "./NotificationService";

async function assertClubStaffForPost(userId: string, postDoc: any) {
  const club = await ClubModel.findById(postDoc.club_id);
  if (!club) throw new HttpError(404, "Club not found");

  if (club.leader_user_id === userId) return club;

  const rel = await ClubFollowerModel.findOne({
    club_id: club._id,
    user_id: userId,
    role_at_club: { $in: ["co-leader"] },
  });
  if (!rel) {
    throw new HttpError(403, "Not allowed for this club/post");
  }
  return club;
}

async function assertClubStaffForClub(userId: string, clubId: string) {
  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");

  if (club.leader_user_id === userId) return club;

  const rel = await ClubFollowerModel.findOne({
    club_id: clubId,
    user_id: userId,
    role_at_club: { $in: ["co-leader"] },
  });
  if (!rel) {
    throw new HttpError(403, "Not allowed for this club/post");
  }
  return club;
}

async function createPost(
  authorUserId: string,
  clubId: string,
  data: {
    title: string;
    subtitle?: string;
    content?: string;
    images?: string[];
  }
) {
  if (!data.title) throw new HttpError(400, "title required");

  const club = await ClubModel.findById(clubId);
  if (!club) throw new HttpError(404, "Club not found");
  if (club.status === "suspended") {
    throw new HttpError(403, "Club is suspended");
  }

  await assertClubStaffForClub(authorUserId, clubId);

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

async function listPostsForClubStaff(staffUserId: string, clubId: string) {
  await assertClubStaffForClub(staffUserId, clubId);

  const posts = await ClubPostModel.find({
    club_id: clubId,
    is_deleted: false,
  })
    .sort({ updated_at: -1 })
    .lean();

  return posts.map((p) => ({
    _id: p._id,
    title: p.title,
    subtitle: p.subtitle,
    published: p.published,
    updated_at: p.updated_at,
  }));
}

async function updatePost(
  postId: string,
  actorUserId: string,
  data: {
    title?: string;
    content?: string;
    published?: boolean;
  }
) {
  const post = await ClubPostModel.findById(postId);
  if (!post) throw new HttpError(404, "Post not found");

  await assertClubStaffForPost(actorUserId, post);

  if (typeof data.title === "string") {
    post.title = data.title;
  }
  if (typeof data.content === "string") {
    post.content = data.content;
  }
  if (typeof data.published === "boolean") {
    post.published = data.published;
  }

  await post.save();
  return post;
}

async function softDeletePost(
  postId: string,
  actorUserId: string,
  isSuperAdmin: boolean
) {
  const post = await ClubPostModel.findById(postId);
  if (!post) throw new HttpError(404, "Post not found");

  if (!isSuperAdmin && post.author_user_id !== actorUserId) {
    await assertClubStaffForPost(actorUserId, post);
  }

  post.is_deleted = true;
  await post.save();
  return post;
}

export const PostService = {
  createPost,
  listPostsPublic,
  listPostsForClubStaff,
  updatePost,
  softDeletePost,
};
