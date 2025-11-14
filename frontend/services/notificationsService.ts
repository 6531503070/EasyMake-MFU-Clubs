import { authedFetch } from "./http";

export type NotificationApiItem = {
  _id: string;
  user_id: string;
  type: string;
  title: string;
  body?: string;
  link_url?: string;
  is_read: boolean;
  created_at: string;
};

export async function listMyNotifications(): Promise<NotificationApiItem[]> {
  const data = await authedFetch("/notifications", {
    method: "GET",
  });

  return (data.notifications || []) as NotificationApiItem[];
}

export async function markNotificationRead(
  id: string
): Promise<NotificationApiItem> {
  const data = await authedFetch(`/notifications/${id}/read`, {
    method: "PATCH",
  });

  return data.notification as NotificationApiItem;
}
