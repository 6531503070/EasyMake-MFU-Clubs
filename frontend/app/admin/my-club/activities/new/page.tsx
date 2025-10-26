"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.06,
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

type LocalImage = {
  file: File;
  previewUrl: string;
};

export default function CreateActivityPage() {
  const router = useRouter();

  // form state (mock)
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("2025-10-28");
  const [startTime, setStartTime] = useState("18:00");
  const [endDate, setEndDate] = useState("2025-10-28");
  const [endTime, setEndTime] = useState("21:00");
  const [capacity, setCapacity] = useState<number | "">("");
  const [images, setImages] = useState<LocalImage[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePickImages() {
    fileInputRef.current?.click();
  }

  function handleFilesSelected(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const next: LocalImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const previewUrl = URL.createObjectURL(file);
      next.push({ file, previewUrl });
    }
    // append to existing
    setImages((prev) => [...prev, ...next]);
  }

  function handleRemoveImage(idx: number) {
    setImages((prev) => {
      // revoke URL to avoid leaks
      URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  }

  function handleSubmit() {
    // mock submit
    const payload = {
      title,
      subtitle,
      location,
      startDate,
      startTime,
      endDate,
      endTime,
      capacity,
      imagesCount: images.length,
    };

    console.log("CREATE ACTIVITY MOCK PAYLOAD", payload);

    // ในของจริงคง call backend แล้ว redirect กลับ list
    // router.push("/admin/my-club/activities");
  }

  return (
    <motion.section
      className="space-y-8 max-w-4xl"
      variants={pageVariants}
      initial="hidden"
      animate="show"
    >
      {/* HEADER */}
      <motion.header
        className="space-y-4"
        variants={itemVariants}
      >
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Create Activity
            </h1>
            <p className="text-sm text-gray-500">
              Fill in details for a new club activity / event.
            </p>
          </div>
        </div>
      </motion.header>

      {/* FORM CARD */}
      <motion.div
        variants={itemVariants}
        className="bg-white border border-gray-200 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
      >
        <div className="p-4 md:p-6 space-y-8 text-[13px] text-gray-700">
          {/* Basic Info */}
          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Basic info
              </h2>
              <p className="text-[12px] text-gray-500">
                Title and short intro that students will see.
              </p>
            </div>

            <div className="grid gap-4">
              {/* Title */}
              <div className="grid gap-1.5">
                <label className="text-[12px] font-medium text-gray-800">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[13px] text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
                  placeholder="e.g. Tech Innovation Night"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p className="text-[11px] text-gray-500">
                  Use something catchy. Shown as the main heading.
                </p>
              </div>

              {/* Subtitle */}
              <div className="grid gap-1.5">
                <label className="text-[12px] font-medium text-gray-800">
                  Subtitle
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[13px] text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
                  placeholder="Short one-line teaser"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
                <p className="text-[11px] text-gray-500">
                  Optional. Shown under the title.
                </p>
              </div>

              {/* Location */}
              <div className="grid gap-1.5">
                <label className="text-[12px] font-medium text-gray-800">
                  Location
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[13px] text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
                  placeholder="e.g. C1 Auditorium"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Schedule */}
          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Schedule
              </h2>
              <p className="text-[12px] text-gray-500">
                When does this activity run?
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Start date / time */}
              <div className="space-y-3 rounded-lg border border-gray-200 p-3">
                <div className="text-[12px] font-medium text-gray-800">
                  Starts
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <label className="text-[11px] text-gray-600">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-[13px] text-gray-900 outline-none focus:border-gray-900"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-[11px] text-gray-600">
                      Time
                    </label>
                    <input
                      type="time"
                      className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-[13px] text-gray-900 outline-none focus:border-gray-900"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* End date / time */}
              <div className="space-y-3 rounded-lg border border-gray-200 p-3">
                <div className="text-[12px] font-medium text-gray-800">
                  Ends
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <label className="text-[11px] text-gray-600">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-[13px] text-gray-900 outline-none focus:border-gray-900"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-[11px] text-gray-600">
                      Time
                    </label>
                    <input
                      type="time"
                      className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-[13px] text-gray-900 outline-none focus:border-gray-900"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Capacity */}
          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Registration
              </h2>
              <p className="text-[12px] text-gray-500">
                Limit number of attendees.
              </p>
            </div>

            <div className="grid gap-1.5 max-w-xs">
              <label className="text-[12px] font-medium text-gray-800">
                Capacity
              </label>
              <input
                type="number"
                min={1}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[13px] text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
                placeholder="e.g. 100"
                value={capacity}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "") {
                    setCapacity("");
                  } else {
                    const num = Number(v);
                    if (!Number.isNaN(num)) {
                      setCapacity(num);
                    }
                  }
                }}
              />
              <p className="text-[11px] text-gray-500">
                People can’t register after this limit is reached.
              </p>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Images */}
          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Images
                </h2>
                <p className="text-[12px] text-gray-500">
                  Upload cover / gallery (students will see this).
                </p>
              </div>

              <button
                type="button"
                onClick={handlePickImages}
                className="rounded-md bg-gray-900 text-white text-xs px-2.5 py-1.5 hover:bg-gray-800 transition-colors"
              >
                + Add images
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFilesSelected}
              />
            </div>

            {images.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-[12px] text-gray-500">
                No images yet. Add some event photos / poster.
              </div>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <li
                    key={idx}
                    className="relative group rounded-lg border border-gray-200 bg-gray-50 overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.previewUrl}
                      alt={`preview-${idx}`}
                      className="h-32 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 rounded-md bg-red-600/90 hover:bg-red-500 text-white p-1 shadow text-[10px] flex items-center gap-1"
                      title="Remove image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Remove</span>
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[11px] px-2 py-1 flex items-center justify-between">
                      <span className="truncate max-w-[70%]">
                        {img.file.name}
                      </span>
                      <span className="opacity-80">
                        {(img.file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </motion.div>

      {/* Bottom sticky-ish actions (desktop spacing only, not fixed) */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap items-center justify-end gap-2 pb-10"
      >
        <button
          className="rounded-md text-sm text-gray-600 px-3 py-2 hover:text-gray-900 transition-colors"
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button
          className="rounded-md bg-gray-900 text-white text-sm px-3 py-2 hover:bg-gray-800 transition-colors"
          onClick={handleSubmit}
        >
          Create Activity
        </button>
      </motion.div>
    </motion.section>
  );
}
