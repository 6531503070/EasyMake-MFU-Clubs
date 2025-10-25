"use client";

import { motion } from "framer-motion";

export function ErrorAlert({ message }: { message: string }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="
        text-sm text-red-600 font-medium
        bg-red-50 border border-red-200
        rounded-md py-2 px-3 text-center
      "
      role="alert"
    >
      {message}
    </motion.div>
  );
}
