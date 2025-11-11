"use client";

import { useEffect, useRef, useState } from "react";

type CreatePayload = { title: string; content?: string; images?: File[] };

export function PostCreateForm({
  onSubmit,
  registerSubmit,
}: {
  onSubmit?: (data: CreatePayload) => void;                
  registerSubmit?: (fn: () => void) => void;              
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function pickImages() { fileInputRef.current?.click(); }
  function onSelectImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  }
  function removeAt(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  }

  const submitNow = () => onSubmit?.({ title, content, images });

  useEffect(() => { if (registerSubmit) registerSubmit(submitNow); }, [registerSubmit, title, content, images]);


  return (
    <div className="space-y-6 text-[13px]">
      <div className="space-y-1">
        <label className="block text-[11px] font-medium text-gray-700">Post Title</label>
        <input
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-[13px]"
          placeholder="Recruitment Week is Open!"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] font-medium text-gray-700">Content</label>
        <textarea
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-[13px]"
          placeholder="Short content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium text-gray-700">Images</div>
          <button type="button" onClick={pickImages} className="px-2.5 py-1.5 text-[12px] rounded-md bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.99]">
            + Add Image
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={onSelectImages} />
        </div>

        {previews.length > 0 ? (
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {previews.map((src, i) => (
              <li key={i} className="relative rounded-md overflow-hidden border">
                <img src={src} alt={`p-${i}`} className="w-full h-24 object-cover" />
                <button type="button" className="absolute top-1 right-1 bg-black/70 text-white text-[11px] rounded px-2 py-0.5" onClick={() => removeAt(i)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-[12px] text-gray-400 border border-dashed border-gray-300 rounded-md p-4 bg-gray-50/60 text-center">
            No images added yet.
          </div>
        )}
      </div>
    </div>
  );
}
