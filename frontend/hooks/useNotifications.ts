"use client";

import { useEffect, useMemo, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { getCookie } from "cookies-next";
import {
  listMyNotifications,
  markNotificationRead,
  type NotificationApiItem,
} from "@/services/notificationsService";
import type { NotificationUIItem } from "@/components/user/home/navigation/NotificationMenu";
import { BASE_URL } from "@/services/http";

export function useNotifications() {
  const [items, setItems] = useState<NotificationUIItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 1) โหลด notifications ชุดแรกจาก API
  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const apiItems: NotificationApiItem[] = await listMyNotifications();
        if (!active) return;

        const mapped: NotificationUIItem[] = apiItems.map((n) => ({
          id: n._id,
          title: n.title,
          body: n.body,
          link_url: n.link_url,
          is_read: n.is_read,
          time: new Date(n.created_at).toLocaleString(),
        }));

        setItems(mapped);
      } catch (err) {
        console.error("[NOTIF] load error", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  // 2) ต่อ socket.io สำหรับ real-time "notification:new"
  useEffect(() => {
    const token = getCookie("token") as string | undefined;
    if (!token) {
      return;
    }

    let socket: Socket | null = null;

    try {
      const url = new URL(BASE_URL);
      const socketUrl = url.origin; // ex: http://localhost:8081

      socket = io(socketUrl, {
        transports: ["websocket"],
        auth: { token },
      });

      socket.on("connect", () => {
        console.log("[SOCKET] notifications connected", socket?.id);
      });

      socket.on("notification:new", (payload: any) => {
        console.log("[SOCKET] notification:new", payload);
        setItems((prev) => [
          {
            id: payload.id,
            title: payload.title,
            body: payload.body,
            link_url: payload.link_url,
            is_read: false,
            time: new Date(
              payload.created_at ?? payload.createdAt ?? Date.now()
            ).toLocaleString(),
          },
          ...prev,
        ]);
      });

      socket.on("disconnect", () => {
        console.log("[SOCKET] notifications disconnected");
      });
    } catch (err) {
      console.error("[SOCKET] notification init error", err);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.is_read).length,
    [items]
  );

  // 3) กดทีละ item = mark read
  const handleItemClick = async (item: NotificationUIItem) => {
    if (item.is_read) return;

    try {
      await markNotificationRead(item.id);
      setItems((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("[NOTIF] mark read error", err);
    }
  };

  // 4) mark all read
  const markAllAsRead = async () => {
    const unread = items.filter((n) => !n.is_read);
    if (!unread.length) return;

    try {
      await Promise.all(unread.map((n) => markNotificationRead(n.id)));
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("[NOTIF] mark all error", err);
    }
  };

  return {
    items,
    unreadCount,
    loading,
    handleItemClick,
    markAllAsRead,
  };
}
