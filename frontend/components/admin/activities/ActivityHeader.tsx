"use client";

import { motion, Variants } from "framer-motion";
import { StatusPill } from "./StatusPill";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

export function ActivityHeader(props: {
  title: string;
  location: string;
  whenText: string;
  capacity: number;
  registeredCount: number;
  status: "published" | "cancelled";
  images: string[];
  onBack: () => void;
  onEdit: () => void;
  onCancel: () => void;
}) {
  const cover = props.images?.[0];

  return (
    <motion.header className="space-y-4" variants={itemVariants} initial="hidden" animate="show">
      <button
        onClick={props.onBack}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">{props.title}</h1>
          <div className="text-sm text-gray-500 space-y-1">
            <p>{props.location} · {props.whenText}</p>
            <p>Capacity: {props.capacity} / Registered: {props.registeredCount}</p>
            <div className="flex items-center gap-2 text-[12px]">
              <span className="text-gray-400">Status:</span>
              <StatusPill status={props.status} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={props.onEdit} className="rounded-md bg-gray-900 text-white text-sm px-3 py-2 hover:bg-gray-800 transition-colors">
            Edit Activity
          </button>
          <button onClick={props.onCancel} className="rounded-md text-red-600 text-sm px-3 py-2 hover:text-red-700 transition-colors">
            Cancel Event
          </button>
        </div>
      </div>

      {cover && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
          <div className="aspect-[16/5] w-full bg-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="Activity cover" className="h-full w-full object-cover" />
          </div>
        </div>
      )}
    </motion.header>
  );
}
