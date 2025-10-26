"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { ErrorAlert } from "./ErrorAlert";

export function AdminLoginCard() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const cookieRole = getCookie("role");
    if (cookieRole === "super-admin") {
      router.replace("/admin/");
    } else if (cookieRole === "club-leader") {
      router.replace("/admin/");
    }
  }, [router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // mock accounts
    const mockAccounts = [
      {
        email: "leader@mfu.ac.th",
        password: "1234567890123",
        role: "club-leader" as const,
      },
      {
        email: "admin@mfu.ac.th",
        password: "admin123",
        role: "super-admin" as const,
      },
    ];

    const found = mockAccounts.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (!found) {
      setError("❌ Invalid email or password");
      setSubmitting(false);
      return;
    }

    window.localStorage.setItem("role", found.role);
    window.localStorage.setItem("email", found.email);

    document.cookie = `role=${found.role}; path=/`;

    if (found.role === "super-admin") {
      router.push("/admin/");
    } else if (found.role === "club-leader") {
      router.push("/admin/");
    }
  }

  // motion variants
  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className="
        w-full 
        rounded-2xl 
        border border-white/60 
        bg-white/80 
        backdrop-blur-sm 
        shadow-[0_20px_80px_-10px_rgba(0,0,0,0.18)]
        p-6 md:p-8
        space-y-6
      "
      variants={cardVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div className="space-y-2 text-center" variants={itemVariants}>
        <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide font-medium">
          EasyMake • MFU Clubs
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Admin Sign In
        </h1>
        <p className="text-[13px] leading-relaxed text-gray-500 max-w-sm mx-auto">
          Club Leaders and University Staff only.
        </p>
      </motion.div>

      {/* Error (component แยก) */}
      <ErrorAlert message={error} />

      {/* Form */}
      <motion.form
        onSubmit={onSubmit}
        className="space-y-5"
        variants={itemVariants}
      >
        {/* Email */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600">
            Email
          </label>
          <input
            className="
              w-full rounded-lg border border-gray-300 
              px-3 py-2.5 text-sm text-gray-900 
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900
              bg-white
            "
            type="email"
            placeholder="you@mfu.ac.th"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            required
            autoComplete="email"
            disabled={submitting}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600">
            Password
          </label>
          <input
            className="
              w-full rounded-lg border border-gray-300 
              px-3 py-2.5 text-sm text-gray-900 
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900
              bg-white
            "
            type="password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            required
            autoComplete="current-password"
            disabled={submitting}
          />
        </div>

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={submitting}
          className="
            w-full rounded-lg 
            bg-gray-900 text-white text-sm font-medium 
            py-2.5
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-gray-800
            active:scale-[0.99]
          "
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </motion.button>

        {/* Footnote */}
        <motion.p
          className="text-[11px] text-center text-gray-400 leading-relaxed"
          variants={itemVariants}
        >
          By signing in you agree that you are authorized MFU staff/club
          personnel. Unauthorized access is prohibited.
        </motion.p>
      </motion.form>
    </motion.div>
  );
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}
