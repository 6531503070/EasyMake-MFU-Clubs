"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type FilterMode = "all" | "following";

export function FeedFilterToggle({
  mode,
  onChange,
}: {
  mode: FilterMode;
  onChange: (m: FilterMode) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center pt-4"
    >
      <div className="inline-flex rounded-full border border-border bg-background/80 backdrop-blur px-1 py-1">
        <Button
          type="button"
          size="sm"
          variant={mode === "all" ? "default" : "ghost"}
          className="rounded-full px-4"
          onClick={() => onChange("all")}
        >
          All
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "following" ? "default" : "ghost"}
          className="rounded-full px-4"
          onClick={() => onChange("following")}
        >
          Following clubs
        </Button>
      </div>
    </motion.div>
  );
}
