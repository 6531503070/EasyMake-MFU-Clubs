"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

const btnVariants: Variants = {
  initial: { y: 0, scale: 1 },
  hover: { y: -2, scale: 1.02, transition: { duration: 0.18 } },
  tap: { scale: 0.98 },
};

export default function HomePage() {
  const router = useRouter();
  const [pending, setPending] = useState<null | "user" | "admin">(null);

  useEffect(() => {
    router.prefetch("/user");
    router.prefetch("/admin/login");
  }, [router]);

  const go = (path: "/user" | "/admin/login", who: "user" | "admin") => {
    setPending(who);
    router.push(path);
  };

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center min-h-screen text-center p-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
        className="text-4xl font-bold mb-4 text-[#1e3a5f]"
      >
        Welcome to EasyMake MFU Clubs 🎉
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.35 }}
        className="text-gray-600 max-w-xl mb-8"
      >
        Manage, explore, and join MFU clubs all in one place.
        Choose your portal below to continue.
      </motion.p>

      <div className="flex gap-6">
        <motion.button
          variants={btnVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onMouseEnter={() => router.prefetch("/user")}
          onClick={() => go("/user", "user")}
          className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#2b4a7c] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e3a5f]"
        >
          {pending === "user" ? "Opening User Portal…" : "User Portal"}
        </motion.button>

        <motion.button
          variants={btnVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onMouseEnter={() => router.prefetch("/admin/login")}
          onClick={() => go("/admin/login", "admin")}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
          {pending === "admin" ? "Opening Admin…" : "Admin Dashboard"}
        </motion.button>
      </div>

      <div className="sr-only">
        <Link href="/user" prefetch />
        <Link href="/admin/login" prefetch />
      </div>
    </motion.main>
  );
}
