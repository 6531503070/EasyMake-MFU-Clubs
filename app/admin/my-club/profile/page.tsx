"use client";

import { useState, useRef } from "react";
import { motion, Variants } from "framer-motion";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { when: "beforeChildren", staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

type ContactItem = {
  platform: string;
  handle: string;
};

export default function ClubProfilePage() {
  // basic profile fields
  const [clubName, setClubName] = useState("Laced of ART");
  const [description, setDescription] = useState(
    "Tell students what your club is about..."
  );

  // contacts: Line / IG / FB / etc.
  const [contacts, setContacts] = useState<ContactItem[]>([
    { platform: "Instagram", handle: "@mfu.laced.art" },
  ]);

  // cover image upload + preview
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>(""); // blob URL preview
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // contact list handlers
  function updateContact(
    idx: number,
    field: keyof ContactItem,
    value: string
  ) {
    setContacts((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  }

  function addContactRow() {
    setContacts((prev) => [...prev, { platform: "", handle: "" }]);
  }

  function removeContactRow(idx: number) {
    setContacts((prev) => prev.filter((_, i) => i !== idx));
  }

  // image upload handlers
  function onPickCoverClick() {
    fileInputRef.current?.click();
  }

  function onCoverFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);

    const blobUrl = URL.createObjectURL(file);
    setCoverPreview(blobUrl);
  }

  // submit
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log("SUBMIT CLUB PROFILE", {
      clubName,
      description,
      contacts,
      coverFile,
    });

    // prod idea:
    // 1. upload coverFile -> storage
    // 2. send {clubName, description, contacts, coverImageUrl} -> backend
  }

  return (
    <motion.section
      variants={pageVariants}
      initial="hidden"
      animate="show"
      className="
        min-h-screen w-full flex flex-col items-center
        bg-gray-50 text-gray-900
        px-6 md:px-12 py-8
        space-y-8
      "
    >
      {/* Page Header */}
      <motion.header
        variants={itemVariants}
        className="w-full max-w-2xl space-y-1"
      >
        <h1 className="text-2xl font-semibold text-gray-900">
          Club Profile
        </h1>
        <p className="text-sm text-gray-500">
          Update your club’s public info.
        </p>
      </motion.header>

      {/* Main Form Card */}
      <motion.form
        onSubmit={onSubmit}
        variants={itemVariants}
        className="
          w-full max-w-2xl
          space-y-6
          bg-white border border-gray-200 rounded-lg
          p-4 md:p-6
          shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]
        "
      >
        {/* CLUB NAME */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600">
            Club Name
          </label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            placeholder="Laced of ART"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600">
            Description
          </label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell students what your club is about..."
            rows={4}
            required
          />
          <p className="text-[11px] text-gray-400 leading-relaxed">
            This will appear on your public club profile.
          </p>
        </div>

        {/* CONTACT CHANNELS (dynamic list) */}
        <div className="space-y-3">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-600">
                Contact Channels
              </label>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Add Line, Instagram, Facebook, etc. These will be shown
                to students so they can reach you.
              </p>
            </div>

            <button
              type="button"
              onClick={addContactRow}
              className="
                px-2.5 py-1.5 text-[12px] rounded-md
                bg-gray-900 text-white hover:bg-gray-800
                active:scale-[0.99] transition-all
              "
            >
              + Add Contact
            </button>
          </div>

          <div className="space-y-3">
            {contacts.map((c, idx) => (
              <div
                key={idx}
                className="
                  grid grid-cols-1
                  sm:grid-cols-[140px_1fr_auto]
                  gap-3 items-start
                  border border-gray-200 rounded-md
                  p-3 bg-gray-50
                "
              >
                {/* Platform */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-gray-600">
                    Platform
                  </label>
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Instagram / Line / Facebook"
                    value={c.platform}
                    onChange={(e) =>
                      updateContact(idx, "platform", e.target.value)
                    }
                  />
                </div>

                {/* Handle / Link */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-gray-600">
                    Handle / Link
                  </label>
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="@mfu.laced.art / https://line.me/..."
                    value={c.handle}
                    onChange={(e) =>
                      updateContact(idx, "handle", e.target.value)
                    }
                  />
                </div>

                {/* Remove contact */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeContactRow(idx)}
                    className="
                      text-[12px] text-red-600 hover:text-red-700
                      px-2 py-1 rounded
                      disabled:text-gray-300 disabled:cursor-not-allowed
                    "
                    disabled={contacts.length <= 1}
                    title={
                      contacts.length <= 1
                        ? "At least one contact is recommended"
                        : "Remove contact"
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COVER IMAGE UPLOAD + PREVIEW */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-600">
            Club Cover Image
          </label>

          <div
            className="
              flex flex-col md:flex-row gap-4
              border border-gray-200 rounded-md bg-gray-50 p-3
            "
          >
            {/* Preview box */}
            <div className="w-full md:w-48 flex-shrink-0">
              <div
                className="
                  aspect-[16/9] w-full overflow-hidden
                  rounded-md border border-gray-300 bg-white
                  flex items-center justify-center
                  text-[11px] text-gray-400
                "
              >
                {coverPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverPreview}
                    alt="Cover Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>No image</span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-1 text-center">
                Preview
              </p>
            </div>

            {/* Upload controls */}
            <div className="flex-1 space-y-2 text-sm text-gray-600">
              <p className="text-[12px] text-gray-500 leading-relaxed">
                Upload your club banner / cover image. This will show at
                the top of your club page.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onPickCoverClick}
                  className="
                    px-3 py-2 text-[13px] rounded-md
                    bg-gray-900 text-white hover:bg-gray-800
                    active:scale-[0.99] transition-all
                  "
                >
                  Choose Image
                </button>

                {coverFile && (
                  <div className="text-[12px] text-gray-500 truncate max-w-[200px]">
                    {coverFile.name}
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onCoverFileChange}
              />
            </div>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Recommended ratio ~16:9, JPG/PNG, under ~2MB.
          </p>
        </div>

        {/* SUBMIT BUTTON */}
        <div>
          <button
            type="submit"
            className="
              px-3 py-2 text-sm rounded-md
              bg-gray-900 text-white hover:bg-gray-800
              active:scale-[0.99]
              transition-all
            "
          >
            Save changes
          </button>
        </div>
      </motion.form>
    </motion.section>
  );
}
