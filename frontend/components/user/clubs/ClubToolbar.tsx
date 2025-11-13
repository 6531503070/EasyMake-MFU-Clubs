"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3x3, List } from "lucide-react";

export default function ClubsToolbar({
  value,
  onChange,
  viewMode,
  onToggleView,
}: {
  value: string;
  onChange: (v: string) => void;
  viewMode: "grid" | "list";
  onToggleView: (v: "grid" | "list") => void;
}) {
  const [q, setQ] = useState(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pt-4 space-y-4"
    >
      {/* ====== Search + Toggle on same row ====== */}
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onChange(q)}
            placeholder="Search clubs..."
            className="pl-10 h-12"
          />
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center">
          <div className="flex gap-1 rounded-lg p-1 border border-border bg-background">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onToggleView("grid")}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onToggleView("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
