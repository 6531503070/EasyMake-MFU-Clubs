"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

type CornerToastProps = {
  open: boolean;
  message: string;
  variant?: "success" | "error";
  onClose: () => void;
};

export function CornerToast({
  open,
  message,
  variant = "success",
  onClose,
}: CornerToastProps) {
  // auto close หลัง 3 วิ
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(onClose, 3000);
    return () => clearTimeout(id);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed bottom-4 right-4 z-[9999]"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div
            className={cn(
              "flex items-start gap-3 rounded-md shadow-lg px-4 py-3 text-sm bg-background border",
              variant === "success" &&
                "border-emerald-500 text-emerald-900",
              variant === "error" &&
                "border-destructive text-destructive"
            )}
          >
            <div className="font-medium">{message}</div>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
