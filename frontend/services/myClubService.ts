import { BASE_URL } from "./http";

function getTokenFromCookies() {
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function fetchMyPosts(clubId: string) {
  const token = getTokenFromCookies();
  if (!token) throw new Error("Token missing");
  const res = await fetch(`${BASE_URL}/clubs/${clubId}/posts/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("failed to load posts");
  return res.json();
}

export async function createPostRequest(
  clubId: string,
  payload: {
    title: string;
    subtitle?: string;
    content?: string;
    images?: string[];
  }
) {
  const token = getTokenFromCookies();
  if (!token) throw new Error("Token missing");
  const res = await fetch(`${BASE_URL}/clubs/${clubId}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("failed to create post");
  return res.json();
}

export async function updatePostRequest(
  postId: string,
  payload: { title?: string; content?: string; published?: boolean }
) {
  const token = getTokenFromCookies();
  if (!token) throw new Error("Token missing");
  const res = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("failed to update post");
  return res.json();
}

export async function deletePostRequest(postId: string) {
  const token = getTokenFromCookies();
  if (!token) throw new Error("Token missing");
  const res = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("failed to delete post");
  return res.json();
}

export async function fetchClubFollowers(clubId: string) {
  const token = getTokenFromCookies();
  if (!token) throw new Error("Token missing");
  const res = await fetch(`${BASE_URL}/clubs/${clubId}/followers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("failed to load followers");
  return res.json();
}

export async function fetchMyActivities(clubId: string) {
  const token = getTokenFromCookies();
  if (!token) throw new Error("Token missing");
  const res = await fetch(`${BASE_URL}/clubs/${clubId}/activities/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("failed to load activities");
  return res.json();
}

export async function createActivityRequest(
  clubId: string,
  payload: {
    title: string;
    subtitle?: string;
    description?: string;
    location?: string;
    start_time: string;
    end_time?: string;
    capacity: number;
    images?: string[];
    visibility?: "public" | "followers-only" | "private";
  }
) {
  const token = getTokenFromCookies();
  if (!token) throw new Error("Token missing");
  const res = await fetch(`${BASE_URL}/clubs/${clubId}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("failed to create activity");
  return res.json();
}

export async function updateActivityStatusRequest(
  activityId: string,
  status: "draft" | "published" | "cancelled"
) {
  const token = getTokenFromCookies();
  if (!token) throw new Error("Token missing");
  const res = await fetch(`${BASE_URL}/activities/${activityId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("failed to update activity status");
  return res.json();
}

export async function fetchActivityManage(activityId: string) {
  const token = getTokenFromCookies();
  if (!token) throw new Error("Token missing");
  const res = await fetch(`${BASE_URL}/activities/${activityId}/manage`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("failed to load activity detail");
  return res.json();
}

export async function checkInRegistrationRequest(regId: string) {
  const token = getTokenFromCookies();
  if (!token) throw new Error("Token missing");
  const res = await fetch(`${BASE_URL}/activities/checkin/${regId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("failed to check in user");
  return res.json();
}

export async function fetchMe() {
  const token = getTokenFromCookies();
  if (!token) throw new Error("Token missing");
  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Cannot load current user");
  return res.json();
}

export async function fetchMyClubProfile(clubId: string) {
  const token = getTokenFromCookies();
  if (!token) throw new Error("Token missing");
  const res = await fetch(`${BASE_URL}/clubs/${clubId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("failed to load club profile");
  const data = await res.json();
  return data.club;
}

export async function updateMyClubProfile(
  clubId: string,
  payload: {
    name: string;
    description: string;
    contact_channels: { platform: string; handle: string }[];
    cover_image_url?: string;
  }
) {
  const token = getTokenFromCookies();
  if (!token) throw new Error("Token missing");
  const res = await fetch(`${BASE_URL}/clubs/${clubId}/profile-self`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("failed to update club profile");
  return res.json();
}

export async function uploadClubCover(
  clubId: string,
  file: File
): Promise<string> {
  const token = getTokenFromCookies();
  if (!token) throw new Error("Token missing");
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE_URL}/clubs/${clubId}/cover-image`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.cover_image_url ?? "";
}