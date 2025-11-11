"use client";

import { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";

type FormState = {
  title: string;
  subtitle?: string;
  location?: string;
  start_time: string;
  end_time?: string;
  capacity: number;
  description?: string;
  images: File[];
};

const MAX_FILES = 5;
const CLIENT_MAX_BYTES = 5 * 1024 * 1024;

async function compressImage(
  file: File,
  maxW = 1920,
  quality = 0.85
): Promise<File> {
  const img = document.createElement("img");
  const url = URL.createObjectURL(file);
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error("load image failed"));
    img.src = url;
  });
  const scale = Math.min(1, maxW / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob>((res) =>
    canvas.toBlob((b) => res(b as Blob), "image/jpeg", quality)
  );
  URL.revokeObjectURL(url);
  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
  });
}

async function downToUnder(
  limitBytes: number,
  file: File
): Promise<File | null> {
  let current = file;
  let q = 0.82;
  let width = 1920;
  for (let i = 0; i < 3 && current.size > limitBytes; i++) {
    current = await compressImage(current, width, q);
    q -= 0.12;
    width = Math.max(1280, Math.round(width * 0.8));
  }
  return current.size <= limitBytes ? current : null;
}

const groupVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function ActivityForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (data: FormState) => void;
  submitting: boolean;
}) {
  const [form, setForm] = useState<FormState>({
    title: "",
    subtitle: "",
    location: "",
    start_time: "",
    end_time: "",
    capacity: 1,
    description: "",
    images: [],
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      previews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previews]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [name]: name === "capacity" ? Number(value) || 1 : value,
    }));
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    const remain = Math.max(0, MAX_FILES - form.images.length);
    const slice = picked.slice(0, remain);
    setForm((s) => ({ ...s, images: [...s.images, ...slice] }));
    setPreviews((prev) => [
      ...prev,
      ...slice.map((f) => URL.createObjectURL(f)),
    ]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(idx: number) {
    setForm((s) => {
      const next = [...s.images];
      next.splice(idx, 1);
      return { ...s, images: next };
    });
    setPreviews((prev) => {
      const url = prev[idx];
      URL.revokeObjectURL(url);
      const cp = [...prev];
      cp.splice(idx, 1);
      return cp;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial="hidden"
      animate="show"
    >
      <motion.div
        custom={0}
        variants={groupVariants}
        className="rounded-xl border bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
      >
        <div className="border-b p-4 md:p-5">
          <div className="text-sm font-medium text-gray-900">Basic Info</div>
          <div className="text-[12px] text-gray-500">
            Title, place, and schedule
          </div>
        </div>
        <div className="p-4 md:p-6 grid grid-cols-1 gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Subtitle</label>
              <input
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Capacity</label>
              <input
                type="number"
                min={1}
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Start</label>
              <input
                type="datetime-local"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">End</label>
              <input
                type="datetime-local"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              rows={4}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        custom={1}
        variants={groupVariants}
        className="rounded-xl border bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
      >
        <div className="border-b p-4 md:p-5">
          <div className="text-sm font-medium text-gray-900">Images</div>
          <div className="text-[12px] text-gray-500">
            Upload up to 5 images (≤ 1MB each)
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[12px] text-gray-500">
              {previews.length} / 5 selected
            </div>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 4a1 1 0 011 1v6h6a1 1 0 010 2h-6v6a1 1 0 01-2 0v-6H5a1 1 0 010-2h6V5a1 1 0 011-1z" />
              </svg>
              Add images
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFiles}
            />
          </div>

          {previews.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-[12px] text-gray-500">
              No images selected
            </div>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {previews.map((src, idx) => (
                <motion.li
                  key={idx}
                  className="relative group rounded-lg border border-gray-200 bg-gray-50 overflow-hidden"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={src}
                    alt={`preview-${idx}`}
                    className="h-32 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 rounded-md bg-black/70 text-white text-[11px] px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                    title="Remove"
                  >
                    Remove
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>

      <motion.div
        custom={2}
        variants={groupVariants}
        className="flex items-center justify-end gap-2"
      >
        <motion.button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-800 disabled:opacity-50"
          whileTap={{ scale: 0.98 }}
        >
          {submitting ? "Creating..." : "Create Activity"}
        </motion.button>
      </motion.div>
    </motion.form>
  );
}
