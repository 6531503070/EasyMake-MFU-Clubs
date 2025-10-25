"use client";

import { useState, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { TableCard } from "@/components/admin/TableCard";
import { ActionDialog } from "@/components/admin/leaders/ActionDialog";

// ---------- mock data ----------
type PostRow = {
  title: string;
  published: boolean;
  updatedAt: string;
};

const mockPosts: PostRow[] = [
  {
    title: "Recruitment Week is Open!",
    published: true,
    updatedAt: "24 Oct 2025",
  },
  {
    title: "[Reminder] Dance practice this Friday",
    published: true,
    updatedAt: "22 Oct 2025",
  },
  {
    title: "Workshop schedule update",
    published: false,
    updatedAt: "20 Oct 2025",
  },
];

// ---------- animations ----------
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.08 },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

// ---------- small inline icons ----------
function IconEdit() {
  return (
    <svg
      className="w-4 h-4 text-blue-600 hover:text-blue-700 transition-colors"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path
        d="M16.862 3.487a2.1 2.1 0 0 1 2.97 2.97L7.5 18.79l-4 1 1-4 12.362-12.303Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14.5 5.5l4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDelete() {
  return (
    <svg
      className="w-4 h-4 text-red-600 hover:text-red-700 transition-colors"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path
        d="M4 7h16M10 11v6M14 11v6M9 7V4h6v3M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------- image preview chip for create dialog ----------
function ImagePreviewChip({
  src,
  name,
  onRemove,
}: {
  src: string;
  name: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2 border border-gray-200 rounded-md bg-white p-2 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        className="w-12 h-12 rounded object-cover border border-gray-200 bg-gray-100"
      />
      <div className="flex flex-col min-w-0">
        <div className="text-[12px] text-gray-800 font-medium truncate max-w-[140px]">
          {name}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-[11px] text-red-600 hover:text-red-700 text-left"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

// ---------- MAIN PAGE ----------
export default function ClubPostsPage() {
  // TABLE DATA
  const [posts] = useState<PostRow[]>(mockPosts);

  // DIALOG STATE
  // mode: "create" | "edit" | "delete" | null
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<
    "create" | "edit" | "delete" | null
  >(null);

  // which post is being edited or deleted
  const [selectedPost, setSelectedPost] = useState<PostRow | null>(null);

  // ---------- CREATE POST STATE ----------
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  // store all selected images and their blob previews
  const [newImages, setNewImages] = useState<
    { file: File; previewUrl: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function pickImages() {
    fileInputRef.current?.click();
  }

  function onSelectImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const mapped = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    // append to existing images
    setNewImages((prev) => [...prev, ...mapped]);

    // reset input value so user can pick same file again later if needed
    e.target.value = "";
  }

  function removeImageAt(idx: number) {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  }

  // ---------- EDIT POST STATE ----------
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editPublished, setEditPublished] = useState(false);

  // OPEN DIALOG HELPERS
  function openCreateDialog() {
    // reset create form state
    setNewTitle("");
    setNewSubtitle("");
    setNewImages([]);
    setSelectedPost(null);
    setDialogMode("create");
    setDialogOpen(true);
  }

  function openDialog(mode: "edit" | "delete", post: PostRow) {
    setSelectedPost(post);
    setDialogMode(mode);
    setDialogOpen(true);

    if (mode === "edit") {
      // preload edit form values
      setEditTitle(post.title);
      setEditContent(
        "Lorem ipsum content of the announcement...\n(Preview only in mock)"
      );
      setEditPublished(post.published);
    }
  }

  // CLOSE / CONFIRM
  function closeDialog() {
    setDialogOpen(false);
    setDialogMode(null);
    setSelectedPost(null);
  }

  function confirmDialog() {
    if (!dialogMode) {
      closeDialog();
      return;
    }

    if (dialogMode === "create") {
      console.log("CREATE POST:", {
        newTitle,
        newSubtitle,
        newImagesFiles: newImages.map((img) => img.file),
      });
    }

    if (dialogMode === "edit" && selectedPost) {
      console.log("SAVE EDIT POST:", {
        original: selectedPost,
        updated: {
          title: editTitle,
          content: editContent,
          published: editPublished,
        },
      });
    }

    if (dialogMode === "delete" && selectedPost) {
      console.log("DELETE POST:", selectedPost.title);
    }

    closeDialog();
  }

  // ---------- dialog header props mapping ----------
  let dialogTitle = "";
  let dialogDesc = "";
  let confirmLabel = "";
  let confirmTone: "default" | "danger" = "default";

  if (dialogMode === "create") {
    dialogTitle = "New Post";
    dialogDesc = "Publish an announcement or update for your followers.";
    confirmLabel = "Create Post";
    confirmTone = "default";
  } else if (dialogMode === "edit") {
    dialogTitle = "Edit Post";
    dialogDesc = selectedPost
      ? `Update content for “${selectedPost.title}”.`
      : "";
    confirmLabel = "Save Changes";
    confirmTone = "default";
  } else if (dialogMode === "delete") {
    dialogTitle = "Delete Post";
    dialogDesc = selectedPost
      ? `This will permanently delete “${selectedPost.title}”.`
      : "";
    confirmLabel = "Delete Post";
    confirmTone = "danger";
  }

  // ---------- dialog body renderer ----------
  function renderDialogBody() {
    // CREATE
    if (dialogMode === "create") {
      return (
        <div className="space-y-6 text-[13px]">
          {/* Title / Subtitle */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-gray-700">
                Post Title
              </label>
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-[13px]"
                placeholder="Recruitment Week is Open!"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-gray-700">
                Subtitle / Short Intro
              </label>
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-[13px]"
                placeholder="Come join us this semester..."
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
              />
            </div>
          </div>

          {/* Images Upload */}
          <div className="space-y-2">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="space-y-1">
                <div className="text-[11px] font-medium text-gray-700">
                  Images
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Add event posters, photos, etc. You can upload more
                  than one.
                </p>
              </div>

              <button
                type="button"
                onClick={pickImages}
                className="px-2.5 py-1.5 text-[12px] rounded-md bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.99]"
              >
                + Add Image
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onSelectImages}
              />
            </div>

            {newImages.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {newImages.map((img, idx) => (
                  <ImagePreviewChip
                    key={idx}
                    src={img.previewUrl}
                    name={img.file.name}
                    onRemove={() => removeImageAt(idx)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-[12px] text-gray-400 border border-dashed border-gray-300 rounded-md p-4 bg-gray-50/60 text-center">
                No images added yet.
              </div>
            )}

            <p className="text-[10px] text-gray-400 leading-relaxed">
              Recommended: clear poster / 16:9 / under ~2MB each.
            </p>
          </div>
        </div>
      );
    }

    // EDIT
    if (dialogMode === "edit" && selectedPost) {
      return (
        <div className="space-y-4 text-[13px]">
          {/* Title */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-gray-700">
              Post Title
            </label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-[13px]"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-gray-700">
              Content
            </label>
            <textarea
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-[13px]"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </div>

          {/* Published toggle */}
          <div className="flex items-center gap-2 text-[13px]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-gray-900"
              id="publishToggle"
              checked={editPublished}
              onChange={(e) => setEditPublished(e.target.checked)}
            />
            <label
              htmlFor="publishToggle"
              className="text-gray-700 leading-none"
            >
              Published
            </label>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Saving will immediately update what followers can see.
          </p>
        </div>
      );
    }

    // DELETE
    if (dialogMode === "delete" && selectedPost) {
      return (
        <div className="text-[13px] leading-relaxed space-y-2 text-red-600">
          <div className="font-semibold">
            This post will be permanently removed.
          </div>

          <div className="text-gray-700">
            Title:{" "}
            <span className="font-semibold text-gray-900">
              {selectedPost.title}
            </span>
          </div>

          <div className="text-[12px] text-gray-500">
            This cannot be undone.
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <>
      <motion.section
        variants={pageVariants}
        initial="hidden"
        animate="show"
        className="min-h-screen w-full flex flex-col justify-start space-y-6 px-6 md:px-12 py-8 bg-gray-50 text-gray-900"
      >
        {/* Header row */}
        <motion.header
          variants={headerVariants}
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
        >
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Posts / Announcements
            </h1>
            <p className="text-sm text-gray-500">
              Publish updates and news for your followers.
            </p>
          </div>

          <button
            onClick={openCreateDialog}
            className="self-start px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.99] transition-all shadow-sm"
          >
            + New Post
          </button>
        </motion.header>

        {/* Posts table - now full width of content area */}
        <motion.div variants={headerVariants} className="w-full">
          <TableCard>
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600 text-[11px] uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Published</th>
                  <th className="px-4 py-2">Last Update</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {posts.map((post, idx) => (
                  <motion.tr
                    key={idx}
                    variants={rowVariants}
                    initial="hidden"
                    animate="show"
                    className="border-t border-gray-200 bg-white align-top"
                  >
                    {/* Title */}
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {post.title}
                    </td>

                    {/* Published pill */}
                    <td className="px-4 py-3">
                      {post.published ? (
                        <span className="inline-flex items-center rounded-md bg-green-100 text-green-800 text-[11px] font-medium px-2 py-1">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-gray-200 text-gray-700 text-[11px] font-medium px-2 py-1">
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Last update */}
                    <td className="px-4 py-3 text-gray-600">
                      {post.updatedAt}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-3">
                        {/* Edit */}
                        <button
                          className="p-1"
                          title="Edit"
                          onClick={() => openDialog("edit", post)}
                        >
                          <IconEdit />
                        </button>

                        {/* Delete */}
                        <button
                          className="p-1"
                          title="Delete"
                          onClick={() => openDialog("delete", post)}
                        >
                          <IconDelete />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </TableCard>

          <p className="text-[11px] text-gray-400 leading-relaxed max-w-lg mt-3">
            Deleting a post immediately hides it from all followers and from
            your public club page.
          </p>
        </motion.div>
      </motion.section>

      {/* Dialog */}
      <ActionDialog
        open={dialogOpen}
        mode={dialogMode === "delete" ? "delete" : "edit"} // reuse edit mode style for create/edit
        title={dialogTitle}
        description={dialogDesc}
        confirmLabel={confirmLabel}
        confirmTone={confirmTone}
        onClose={closeDialog}
        onConfirm={confirmDialog}
      >
        {renderDialogBody()}
      </ActionDialog>
    </>
  );
}
