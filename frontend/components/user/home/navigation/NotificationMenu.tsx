"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

type Notification = { id: string; title: string; time?: string };

export default function NotificationMenu({
  items = [],
}: {
  items?: Notification[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)}>
        <Bell className="w-5 h-5" />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-background shadow-lg"
          >
            <div className="p-3 border-b border-border">
              <div className="font-semibold text-sm">Notifications</div>
            </div>

            {items.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                Nothing to notify right now.
              </div>
            ) : (
              <ul className="max-h-72 overflow-auto">
                {items.map((n) => (
                  <li
                    key={n.id}
                    className="px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium">{n.title}</div>
                    {n.time && (
                      <div className="text-xs text-muted-foreground">
                        {n.time}
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
