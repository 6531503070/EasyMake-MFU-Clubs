"use client";

import { useEffect, useRef, useState } from "react";

const fileUrl = (id: string) => `/api/files/${id}`;

type EditInitial = {
  title: string;
  content: string;
  published: boolean;
  images?: string[];
};
type EditSubmit = {
  title?: string;
  content?: string;
  published?: boolean;
  existingIds?: string[];
  newFiles?: File[];
};

export function PostEditForm({
  initial,
  onSubmit,
  registerSubmit,
}: {
  initial: EditInitial;
  onSubmit?: (data: EditSubmit) => void;
  registerSubmit?: (fn: () => void) => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [content, setContent] = useState(initial.content);
  const [published, setPublished] = useState(initial.published);
  const [existingIds, setExistingIds] = useState<string[]>(
    initial.images ?? []
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const fileUrl = (id: string) => `/api/files/${id}`;
  const toSrc = (val: string) =>
    /^https?:\/\//i.test(val) ? val : fileUrl(val);
  function pickImages() {
    fileRef.current?.click();
  }
  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setNewFiles((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = "";
  }
  function removeExisting(i: number) {
    setExistingIds((prev) => prev.filter((_, idx) => idx !== i));
  }
  function removeNew(i: number) {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
    setNewPreviews((prev) => prev.filter((_, idx) => idx !== i));
  }

  const submitNow = () =>
    onSubmit?.({ title, content, published, existingIds, newFiles });

  useEffect(() => {
    if (registerSubmit) registerSubmit(submitNow);
  }, [registerSubmit, title, content, published, existingIds, newFiles]);

  return (
    <div className="space-y-4 text-[13px]">
      <div className="space-y-1">
        <label className="block text-[11px] font-medium text-gray-700">
          Post Title
        </label>
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-[13px]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] font-medium text-gray-700">
          Content
        </label>
        <textarea
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-[13px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium text-gray-700">Images</div>
          <button
            type="button"
            className="px-2.5 py-1.5 text-[12px] rounded-md bg-gray-900 text-white hover:bg-gray-800"
            onClick={pickImages}
          >
            + Add Image
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onSelect}
          />
        </div>

        {/* Old Image */}
        {existingIds.length > 0 && (
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {existingIds.map((id, i) => (
              <li
                key={id}
                className="relative rounded-md overflow-hidden border"
              >
                <img
                  src={toSrc(id)}
                  alt={`img-${i}`}
                  className="w-full h-24 object-cover"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-black/70 text-white text-[11px] rounded px-2 py-0.5"
                  onClick={() => removeExisting(i)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* New Image */}
        {newPreviews.length > 0 && (
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {newPreviews.map((src, i) => (
              <li
                key={i}
                className="relative rounded-md overflow-hidden border"
              >
                <img
                  src={src}
                  alt={`new-${i}`}
                  className="w-full h-24 object-cover"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-black/70 text-white text-[11px] rounded px-2 py-0.5"
                  onClick={() => removeNew(i)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-2 text-[13px] pt-1">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-gray-900"
            id="publishToggle"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <label htmlFor="publishToggle" className="text-gray-700 leading-none">
            Published
          </label>
        </div>
      </div>
    </div>
  );
}
