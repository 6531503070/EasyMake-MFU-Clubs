import { authedFetch, BASE_URL } from "./http";

export type ActivityApi = {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time?: string;
  capacity: number;
  images: string[];
  status: "published" | "cancelled";
  club_id: string;
};

export type ClubActivityListItem = {
  _id: string;
  title: string;
  start_time: string;
  end_time?: string;
  location?: string;
  capacity: number;
  registered: number;
  status: "published" | "cancelled";
  images: string[];
};

export type ActivityManageView = {
  activity: ActivityApi;
  registeredCount: number;
  students: {
    name: string;
    email: string;
    status: "registered" | "checked-in" | "cancelled";
  }[];
};

export type ActivityFeedItem = ActivityApi & {
  club_name?: string;
  club_cover_image_url?: string;
  registered?: number;
};

export async function getClubActivities(clubId: string): Promise<ClubActivityListItem[]> {
  const data = await authedFetch(`/clubs/${clubId}/activities/mine`, { method: "GET" });
  const list = (data.activities || []) as any[];
  return list.map((a, i) => ({
    _id: a._id ?? a.id ?? `tmp-${i}-${a.title ?? "no-title"}-${a.start_time ?? "no-time"}`,
    title: a.title ?? "",
    start_time: a.start_time ?? "",
    end_time: a.end_time,
    location: a.location,
    capacity: Number(a.capacity ?? 0),
    registered: Number(a.registered ?? 0),
    status: a.status ?? "published",
    images: Array.isArray(a.images) ? a.images : [],
  })) as ClubActivityListItem[];
}

export async function getPublicActivitiesByClub(clubId: string): Promise<ActivityApi[]> {
  const res = await fetch(`${BASE_URL}/activities/public/by-club/${clubId}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load activities (${res.status})`);
  const data = await res.json();
  return (data.activities || []) as ActivityApi[];
}

export async function createActivity(
  clubId: string,
  payload: {
    title: string;
    subtitle?: string;
    location?: string;
    start_time: string;
    end_time?: string;
    capacity: number;
    description?: string;
    images?: File[];
  }
) {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      if (k === "images" && Array.isArray(v)) {
        v.forEach((f) => fd.append("images", f));
      } else {
        fd.append(k, String(v));
      }
    }
  });
  return authedFetch(`/clubs/${clubId}/activities`, {
    method: "POST",
    body: fd,
  });
}

export async function updateActivityDetailsWithImages(
  activityId: string,
  patch: Partial<{
    title: string;
    subtitle: string;
    location: string;
    start_time: string;
    end_time?: string;
    capacity: number;
    description: string;
  }>,
  images: File[] = []
) {
  const fd = new FormData();
  Object.entries(patch).forEach(([k, v]) => {
    if (typeof v !== "undefined" && v !== null) fd.append(k, String(v));
  });
  images.forEach((f) => fd.append("images", f));

  return authedFetch(`/activities/${activityId}/details`, {
    method: "PATCH",
    body: fd,
  });
}

export async function updateActivityStatus(
  activityId: string,
  status: "published" | "cancelled"
) {
  return authedFetch(`/activities/${activityId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getActivityManageView(
  activityId: string
): Promise<ActivityManageView> {
  const data = await authedFetch(`/activities/${activityId}/manage`, {
    method: "GET",
  });
  return data as ActivityManageView;
}

export async function registerToActivity(activityId: string) {
  return authedFetch(`/activities/${activityId}/register`, { method: "POST" });
}

export async function unregisterFromActivity(activityId: string) {
  return authedFetch(`/activities/${activityId}/unregister`, {
    method: "POST",
  });
}

export async function listMyRegistrations() {
  return authedFetch(`/activities/my/registrations`, { method: "GET" });
}

export async function getPublicActivitiesFeed(): Promise<ActivityFeedItem[]> {
  const res = await fetch(`${BASE_URL}/activities/public/feed`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to load activities feed (${res.status})`);
  const data = await res.json();
  return (data.activities || []) as ActivityFeedItem[];
}