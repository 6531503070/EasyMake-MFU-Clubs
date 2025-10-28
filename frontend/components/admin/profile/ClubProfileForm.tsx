"use client";

import { motion } from "framer-motion";

type ContactItem = {
  platform: string;
  handle: string;
};

type ClubProfile = {
  name: string;
  description: string;
  contact_channels: ContactItem[];
  cover_image_url?: string;
};

type Props = {
  data: ClubProfile;
  disabled?: boolean;
  onChange: (next: ClubProfile) => void;
  onSubmit: (e: React.FormEvent) => void;
  coverFile: File | null;
  setCoverFile: (file: File | null) => void;
};

export function ClubProfileForm({
  data,
  disabled,
  onChange,
  onSubmit,
  coverFile,
  setCoverFile,
}: Props) {
  const handleContactChange = (
    idx: number,
    field: keyof ContactItem,
    value: string
  ) => {
    const updated = [...data.contact_channels];
    updated[idx][field] = value;
    onChange({ ...data, contact_channels: updated });
  };

  const addContact = () =>
    onChange({
      ...data,
      contact_channels: [...data.contact_channels, { platform: "", handle: "" }],
    });

  const removeContact = (idx: number) =>
    onChange({
      ...data,
      contact_channels: data.contact_channels.filter((_, i) => i !== idx),
    });

  let previewSrc: string | null = null;
  if (coverFile) {
    previewSrc = URL.createObjectURL(coverFile);
  } else if (data.cover_image_url) {
    // ตอนนี้ cover_image_url จะเป็น full URL จาก backend แล้ว เช่น
    // http://localhost:8081/api/clubs/xxx/cover-image
    previewSrc = data.cover_image_url;
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm space-y-6"
    >
      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-600">
          Club Name
        </label>
        <input
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
          disabled={disabled}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-600">
          Description
        </label>
        <textarea
          value={data.description}
          onChange={(e) =>
            onChange({ ...data, description: e.target.value })
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
          rows={4}
          disabled={disabled}
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Contact Channels
            </label>
            <p className="text-[11px] text-gray-400">
              Add Line, Instagram, Facebook, etc.
            </p>
          </div>
          <button
            type="button"
            onClick={addContact}
            className="px-2 py-1 text-xs bg-gray-900 text-white rounded-md hover:bg-gray-800"
            disabled={disabled}
          >
            + Add Contact
          </button>
        </div>

        {data.contact_channels.map((c, idx) => (
          <div
            key={idx}
            className="grid sm:grid-cols-[140px_1fr_auto] gap-3 border p-3 rounded-md bg-gray-50"
          >
            <input
              placeholder="Platform"
              value={c.platform}
              onChange={(e) => handleContactChange(idx, "platform", e.target.value)}
              className="border px-2 py-1 rounded text-sm"
              disabled={disabled}
            />
            <input
              placeholder="Handle / Link"
              value={c.handle}
              onChange={(e) => handleContactChange(idx, "handle", e.target.value)}
              className="border px-2 py-1 rounded text-sm"
              disabled={disabled}
            />
            <button
              type="button"
              onClick={() => removeContact(idx)}
              disabled={disabled || data.contact_channels.length <= 1}
              className="text-red-600 text-[12px]"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-600">
          Club Cover Image
        </label>
        <div className="flex flex-col md:flex-row gap-4 border border-gray-200 rounded-md bg-gray-50 p-3">
          <div className="w-full md:w-48">
            {previewSrc ? (
              <img
                src={previewSrc}
                alt="Cover"
                className="rounded-md border object-cover w-full h-28"
              />
            ) : (
              <div className="border rounded-md w-full h-28 flex items-center justify-center text-gray-400 text-sm">
                No image
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="coverFile"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setCoverFile(file);
              }}
            />
            <button
              type="button"
              onClick={() => document.getElementById("coverFile")?.click()}
              className="px-3 py-2 text-[13px] rounded-md bg-gray-900 text-white hover:bg-gray-800"
              disabled={disabled}
            >
              Choose Image
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800"
      >
        Save changes
      </button>
    </motion.form>
  );
}
