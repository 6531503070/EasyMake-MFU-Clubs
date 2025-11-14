"use client";

import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationMenu, {
  type NotificationUIItem,
} from "../home/navigation/NotificationMenu";

export function NotificationBellContainer() {
  const router = useRouter();
  const { items, unreadCount, handleItemClick, markAllAsRead } =
    useNotifications();

  return (
    <NotificationMenu
      items={items as NotificationUIItem[]}
      unreadCount={unreadCount}
      onMarkAllRead={markAllAsRead}
      onItemClick={async (item) => {
        await handleItemClick(item);

        if (item.link_url) {
          router.push(item.link_url);
        }
      }}
    />
  );
}
