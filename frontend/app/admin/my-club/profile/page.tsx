"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClubProfileForm } from "@/components/admin/profile/ClubProfileForm";
import { BASE_URL } from "@/services/http";

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

export default function ManageClubPage() {
  const [clubId, setClubId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClubProfile>({
    name: "",
    description: "",
    contact_channels: [{ platform: "", handle: "" }],
    cover_image_url: "",
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // โหลดข้อมูล Club
  useEffect(() => {
    let cancelled = false;

    async function loadClub() {
      try {
        setLoadingInitial(true);
        const res = await fetch(`${BASE_URL}/me`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Cannot load current user");
        const { me } = await res.json();
        if (!me?.clubId) throw new Error("No club assigned");
        if (cancelled) return;
        setClubId(me.clubId);

        const clubRes = await fetch(`${BASE_URL}/clubs/${me.clubId}`, {
          credentials: "include",
        });
        if (!clubRes.ok) throw new Error("Failed to load club profile");

        const { club } = await clubRes.json();
        if (!cancelled)
          setFormData({
            name: club.name || "",
            description: club.description || "",
            contact_channels: club.contact_channels?.length
              ? club.contact_channels
              : [{ platform: "", handle: "" }],
            cover_image_url: club.cover_image_url || "",
          });
      } catch (err: any) {
        if (!cancelled) setErrorMsg(err.message);
      } finally {
        if (!cancelled) setLoadingInitial(false);
      }
    }

    loadClub();
    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ ฟังก์ชันอัปโหลดภาพไป /api/clubs/:clubId/cover-image
  async function uploadCoverIfNeeded(currentClubId: string): Promise<string> {
    if (!coverFile) return formData.cover_image_url || "";

    const form = new FormData();
    form.append("file", coverFile);

    const res = await fetch(`${BASE_URL}/clubs/${currentClubId}/cover-image`, {
      method: "POST", // ✅ ใช้ POST
      body: form,
      credentials: "include", // ✅ ต้องใส่เพื่อส่ง cookie JWT ไปด้วย
    });

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.cover_image_url ?? "";
  }

  // ✅ บันทึกข้อมูลโปรไฟล์ชมรม
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving || !clubId) return;

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const coverUrl = await uploadCoverIfNeeded(clubId);
      const payload = { ...formData, cover_image_url: coverUrl };

      const res = await fetch(`${BASE_URL}/clubs/${clubId}/profile-self`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ ให้ cookie ไปกับ request
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const { club } = await res.json();
      setFormData(club);
      setSuccessMsg("Saved successfully!");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 text-gray-900 px-6 md:px-12"
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1">Club Profile</h1>
        <p className="text-sm text-gray-500">
          Update your club’s public information
        </p>

        <div className="h-5 mb-3 text-sm">
          {loadingInitial && (
            <span className="text-[12px] text-gray-400">Loading...</span>
          )}
          {saving && (
            <span className="text-[12px] text-gray-500">Saving...</span>
          )}
          {successMsg && (
            <span className="text-[12px] text-green-600">{successMsg}</span>
          )}
          {errorMsg && (
            <span className="text-[12px] text-red-600">{errorMsg}</span>
          )}
        </div>

        <ClubProfileForm
          data={formData}
          disabled={saving || loadingInitial}
          onChange={setFormData}
          onSubmit={handleSubmit}
          coverFile={coverFile}
          setCoverFile={setCoverFile}
        />
      </div>
    </motion.div>
  );
}
