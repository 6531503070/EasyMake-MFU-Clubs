"use client";

import { useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";
import { motion, Variants } from "framer-motion";
import { ActionDialog } from "@/components/admin/leaders/ActionDialog";
import { PostsTable } from "@/components/admin/posts/PostsTable";
import { PostCreateForm } from "@/components/admin/posts/PostCreateForm";
import { PostEditForm } from "@/components/admin/posts/PostEditForm";

import {
  createPostMultipart,
  deletePost,
  getStaffPosts,
  updatePostMultipart,
  type StaffPostRow,
} from "@/services/postsService";
import { GlobalAlert } from "@/components/admin/GlobalAlert";

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

export default function ClubPostsPage() {
  const [clubId, setClubId] = useState<string | null>(null);
  const [posts, setPosts] = useState<StaffPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // สำหรับคุมปุ่ม Create ให้กดได้เฉพาะตอนฟอร์ม valid
  const [canSubmitCreate, setCanSubmitCreate] = useState(false);

  // 🔔 Global Alert state
  const [alert, setAlert] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // กำลังยิง API อยู่ไหม (create / edit / delete)
  const [confirming, setConfirming] = useState(false);

  // ใช้เก็บ callback submit ของฟอร์ม (ให้ dialog เรียกตอนกด Confirm)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<StaffPostRow | null>(null);
  const submitRef = useRef<(() => void) | null>(null);

  const showAlert = (
    type: "success" | "error",
    message: string,
    ms = 3000
  ) => {
    setAlert({ type, message });
    if (ms > 0) {
      window.clearTimeout((showAlert as any)._t);
      (showAlert as any)._t = window.setTimeout(() => {
        setAlert({ type: null, message: "" });
      }, ms);
    }
  };

  useEffect(() => {
    const cid = getCookie("clubId");
    setClubId(typeof cid === "string" ? cid : null);
  }, []);

  async function reload(cid: string) {
    try {
      setLoading(true);
      const data = await getStaffPosts(cid);
      setPosts(data);
      setErr("");
    } catch (e: any) {
      setErr(e?.message || "Load failed");
      showAlert("error", e?.message || "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!clubId) return;
    reload(clubId);
  }, [clubId]);

  function openCreate() {
    setSelected(null);
    setMode("create");
    setDialogOpen(true);
    setCanSubmitCreate(false); // reset state form valid
  }

  function openEdit(p: StaffPostRow) {
    setSelected(p);
    setMode("edit");
    setDialogOpen(true);
  }

  function openDelete(p: StaffPostRow) {
    setSelected(p);
    setMode("delete");
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setMode(null);
    setSelected(null);
    submitRef.current = null;
    setConfirming(false);
    setCanSubmitCreate(false);
  }

  // ---------- handlers ----------

  // CREATE (ใช้ createPostMultipart เดิม เพื่อให้ส่งเมลเหมือนเดิม แต่ optimisitc update)
  async function handleCreate(data: {
    title: string;
    content?: string;
    images?: File[];
  }) {
    if (!clubId) return;
    try {
      setConfirming(true);

      const created = await createPostMultipart(clubId, {
        title: data.title,
        content: data.content,
        images: data.images,
      });

      // optimistic: แทรกโพสต์ใหม่ไว้บนสุด
      setPosts((prev) => [created as StaffPostRow, ...prev]);

      showAlert("success", "✅ Post created successfully!");
      closeDialog();
    } catch (e: any) {
      console.error(e);
      showAlert("error", e?.message || "Failed to create post.");
      setConfirming(false);
    }
  }

  // EDIT
  async function handleEdit(data: {
    title?: string;
    content?: string;
    published?: boolean;
    existingIds?: string[];
    newFiles?: File[];
  }) {
    if (!clubId || !selected) return;
    try {
      setConfirming(true);

      const updated = await updatePostMultipart(String(selected._id), data);

      setPosts((prev) =>
        prev.map((p) =>
          String(p._id) === String(updated._id)
            ? { ...p, ...updated }
            : p
        )
      );

      showAlert("success", "✅ Post updated successfully!");
      closeDialog();
    } catch (e: any) {
      console.error(e);
      showAlert("error", e?.message || "Failed to update post.");
      setConfirming(false);
    }
  }

  // DELETE
  async function handleDelete() {
    if (!clubId || !selected) return;
    try {
      setConfirming(true);

      await deletePost(String(selected._id));

      setPosts((prev) =>
        prev.filter((p) => String(p._id) !== String(selected._id))
      );

      showAlert("success", "🗑️ Post deleted successfully!");
      closeDialog();
    } catch (e: any) {
      console.error(e);
      showAlert("error", e?.message || "Failed to delete post.");
      setConfirming(false);
    }
  }

  // ตอนกดปุ่ม Confirm บน Dialog
  const handleConfirm =
    mode === "delete"
      ? () => {
        if (!confirming) handleDelete();
      }
      : () => {
        if (!confirming) submitRef.current?.();
      };

  // ✅ เงื่อนไข disabled ของปุ่ม Confirm
  const isConfirmDisabled =
    confirming || (mode === "create" && !canSubmitCreate);

  return (
    <>
      <motion.section
        variants={pageVariants}
        initial="hidden"
        animate="show"
        className="min-h-screen w-full flex flex-col gap-6 px-6 md:px-12 py-8 bg-gray-50 text-gray-900"
      >
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
            onClick={openCreate}
            className="self-start px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.99] transition-all shadow-sm"
          >
            + New Post
          </button>
        </motion.header>

        {/* 🔔 Global Alert */}
        {alert.type && alert.message && (
          <GlobalAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: null, message: "" })}
          />
        )}

        {err && (
          <div className="rounded-md border border-amber-300 bg-amber-50 text-amber-900 p-3 text-sm">
            {err}
          </div>
        )}

        {!err && (
          <PostsTable
            posts={posts}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}
      </motion.section>

      <ActionDialog
        open={dialogOpen}
        mode={mode === "delete" ? "delete" : "edit"}
        title={
          mode === "create"
            ? "New Post"
            : mode === "edit"
            ? "Edit Post"
            : "Delete Post"
        }
        description={
          mode === "create"
            ? "Publish an announcement or update for your followers."
            : mode === "edit"
            ? selected
              ? `Update content for “${selected.title}”.`
              : ""
            : selected
            ? `This will permanently delete “${selected.title}”.`
            : ""
        }
        confirmLabel={
          confirming
            ? "Processing..."
            : mode === "delete"
            ? "Delete Post"
            : mode === "edit"
            ? "Save Changes"
            : "Create Post"
        }
        confirmTone={mode === "delete" ? "danger" : "default"}
        onClose={confirming ? () => {} : closeDialog}
        onConfirm={handleConfirm}
        confirmDisabled={isConfirmDisabled} // ✅ ตรงนี้สำคัญ
      >
        {mode === "create" && (
          <PostCreateForm
            registerSubmit={(fn) => (submitRef.current = fn)}
            onSubmit={handleCreate}
            disabled={confirming}
            onValidChange={setCanSubmitCreate}
          />
        )}

        {mode === "edit" && selected && (
          <PostEditForm
            registerSubmit={(fn) => (submitRef.current = fn)}
            initial={{
              title: selected.title,
              content: selected.content ?? "",
              published: selected.published,
              images: selected.images ?? [],
            }}
            onSubmit={handleEdit}
            disabled={confirming}
          />
        )}

        {mode === "delete" && selected && (
          <div className="text-[13px] leading-relaxed space-y-2 text-red-600">
            <div className="font-semibold">
              This post will be permanently removed.
            </div>
            <div className="text-gray-700">
              Title:{" "}
              <span className="font-semibold text-gray-900">
                {selected.title}
              </span>
            </div>
            <div className="text-[12px] text-gray-500">
              This cannot be undone.
            </div>
          </div>
        )}
      </ActionDialog>
    </>
  );
}
