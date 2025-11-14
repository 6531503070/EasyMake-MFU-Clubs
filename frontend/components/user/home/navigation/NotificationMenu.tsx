"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type NotificationUIItem = {
  id: string;
  title: string;
  body?: string;
  time?: string;
  is_read?: boolean;
  link_url?: string;
};

type Props = {
  items?: NotificationUIItem[];
  unreadCount?: number;
  onItemClick?: (item: NotificationUIItem) => void;
  onMarkAllRead?: () => void;
};

export default function NotificationMenu({
  items = [],
  unreadCount = 0,
  onItemClick,
  onMarkAllRead,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const visibleItems =
    filter === "all" ? items : items.filter((n) => !n.is_read);

  return (
    <div className="relative" ref={ref}>
      <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)}>
        <div className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center px-0.5">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-background shadow-lg z-50"
          >
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div className="font-semibold text-sm">Notifications</div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className={
                      filter === "all"
                        ? "font-semibold text-foreground"
                        : "hover:text-foreground/80"
                    }
                  >
                    All
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setFilter("unread")}
                    className={
                      filter === "unread"
                        ? "font-semibold text-foreground"
                        : "hover:text-foreground/80"
                    }
                  >
                    Unread
                  </button>
                </div>

                {unreadCount > 0 && onMarkAllRead && (
                  <button
                    className="text-[11px] text-primary hover:underline"
                    onClick={() => onMarkAllRead()}
                  >
                    Mark all
                  </button>
                )}
              </div>
            </div>

            {visibleItems.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                {filter === "unread"
                  ? "No unread notifications."
                  : "Nothing to notify right now."}
              </div>
            ) : (
              <ul className="max-h-80 overflow-auto">
                {visibleItems.map((n) => (
                  <li
                    key={n.id}
                    className={`px-4 py-3 text-sm cursor-pointer transition-colors ${
                      !n.is_read
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => onItemClick?.(n)}
                  >
                    {n.link_url ? (
                      <Link href={n.link_url} className="block">
                        <NotificationItemContent n={n} />
                      </Link>
                    ) : (
                      <div className="block">
                        <NotificationItemContent n={n} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationItemContent({ n }: { n: NotificationUIItem }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="font-medium line-clamp-1">{n.title}</div>
      {n.body && (
        <div className="text-xs text-muted-foreground line-clamp-2">
          {n.body}
        </div>
      )}
      {n.time && (
        <div className="text-[11px] text-muted-foreground/80">{n.time}</div>
      )}
    </div>
  );
}
