"use client";

import { useEffect, useRef, useState } from "react";

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

const MAX_FILES = 10;
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

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

  const canvas = document.createElement("canvas");
  const scale = Math.min(1, maxW / img.width);
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

  function chooseFiles() {
    fileRef.current?.click();
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;

    const remain = Math.max(0, MAX_FILES - form.images.length);
    const slice = picked.slice(0, remain);

    const processed: File[] = [];
    for (const f of slice) {
      if (f.size > MAX_FILE_SIZE_BYTES) {
        const compressed = await compressImage(f, 1920, 0.85);
        processed.push(compressed);
      } else {
        processed.push(f);
      }
    }

    setForm((s) => ({ ...s, images: [...s.images, ...processed] }));
    setPreviews((prev) => [
      ...prev,
      ...processed.map((f) => URL.createObjectURL(f)),
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Start</label>
            <input
              type="datetime-local"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End</label>
            <input
              type="datetime-local"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Capacity</label>
          <input
            type="number"
            min={1}
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            rows={4}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Images</div>
            <div className="text-[12px] text-gray-500">
              Upload up to 10 images
            </div>
          </div>

          <button
            type="button"
            onClick={chooseFiles}
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
              <li
                key={idx}
                className="relative group rounded-lg border border-gray-200 bg-gray-50 overflow-hidden"
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
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-gray-900 text-white px-3 py-2 hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Activity"}
        </button>
      </div>
    </form>
  );
}
