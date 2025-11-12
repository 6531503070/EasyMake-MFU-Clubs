"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BackgroundDecor() {
  return (
    <>
      <div className="fixed inset-0 z-0">
        <Image
          src="/sports-day-university-field.jpg"
          alt="University Background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 backdrop-blur-md bg-background/60" />
      </div>
      <div className="fixed inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background z-0" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"
        />
      </div>
    </>
  );
}
