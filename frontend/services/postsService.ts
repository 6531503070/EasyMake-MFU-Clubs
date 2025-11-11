import { authedFetch } from "./http";

export type StaffPostRow = {
  _id: string;
  title: string;
  published: boolean;
  updated_at: string;
  images?: string[];
  content?: string;
};

export type PublicPostRow = {
  _id: string;
  title: string;
  content: string;
  images: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

export async function getStaffPosts(clubId: string): Promise<StaffPostRow[]> {
  const data = await authedFetch(`/posts/clubs/${clubId}/posts/manage`, {
    method: "GET",
  });
  return data.posts as StaffPostRow[];
}

export async function getPublicPosts(clubId: string): Promise<PublicPostRow[]> {
  const data = await authedFetch(`/posts/clubs/${clubId}/posts`, {
    method: "GET",
  });
  return data.posts as PublicPostRow[];
}

export async function createPost(
  clubId: string,
  payload: { title: string; content?: string; images?: string[] }
) {
  const data = await authedFetch(`/posts/clubs/${clubId}/posts`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.post;
}

export async function createPostMultipart(
  clubId: string,
  payload: { title: string; content?: string; images?: File[] }
) {
  const fd = new FormData();
  fd.append("title", payload.title);
  if (payload.content) fd.append("content", payload.content);
  (payload.images ?? []).forEach((f) => fd.append("images", f));

  const data = await authedFetch(`/posts/clubs/${clubId}/posts`, {
    method: "POST",
    body: fd,
  });
  return data.post;
}

export async function updatePost(
  postId: string,
  payload: {
    title?: string;
    content?: string;
    published?: boolean;
    images?: string[];
  }
) {
  const data = await authedFetch(`/posts/${postId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return data.post;
}

export async function updatePostMultipart(
  postId: string,
  payload: {
    title?: string;
    content?: string;
    published?: boolean;
    existingIds?: string[];
    newFiles?: File[];
  }
) {
  const fd = new FormData();
  if (payload.title != null) fd.append("title", payload.title);
  if (payload.content != null) fd.append("content", payload.content);
  if (payload.published != null)
    fd.append("published", String(payload.published));
  if (payload.existingIds)
    fd.append("existingIds", JSON.stringify(payload.existingIds));
  (payload.newFiles ?? []).forEach((f) => fd.append("newImages", f));

  const data = await authedFetch(`/posts/${postId}`, {
    method: "PATCH",
    body: fd,
    requireJson: true,
  });
  return data.post;
}


export async function deletePost(postId: string) {
  const data = await authedFetch(`/posts/${postId}`, { method: "DELETE" });
  return data.post;
}
