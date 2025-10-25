"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { TableCard } from "@/components/admin/TableCard";
import { ActionDialog } from "@/components/admin/leaders/ActionDialog";

type ClubRow = {
  clubName: string;
  ownerName: string;
  ownerEmail: string;
  leaderCitizenId: string;
  coOwners: { name: string; email: string }[];
  membersCore: number;
  membersTotal: number;
};

type MemberInput = {
  name: string;
  email: string;
  citizenId: string;
};

const mockClubs: ClubRow[] = [
  {
    clubName: "Laced of ART",
    ownerName: "Thanakorn T.",
    ownerEmail: "lead.art@mfu.ac.th",
    leaderCitizenId: "1234567890123",
    coOwners: [
      { name: "Ploy Ch.", email: "ploy.creative@mfu.ac.th" },
      { name: "Aom S.", email: "aom.art@mfu.ac.th" },
    ],
    membersCore: 5,
    membersTotal: 156,
  },
  {
    clubName: "MFU Esports",
    ownerName: "Krit R.",
    ownerEmail: "krit.play@mfu.ac.th",
    leaderCitizenId: "9876543210000",
    coOwners: [{ name: "Beam L.", email: "beam.esports@mfu.ac.th" }],
    membersCore: 5,
    membersTotal: 89,
  },
];

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ClubsTable() {
  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<
    "view" | "edit" | "delete" | null
  >(null);
  const [selectedClub, setSelectedClub] = useState<ClubRow | null>(null);

  // edit form state
  const [editClubName, setEditClubName] = useState("");
  const [editLeaderName, setEditLeaderName] = useState("");
  const [editLeaderEmail, setEditLeaderEmail] = useState("");
  const [editLeaderCitizenId, setEditLeaderCitizenId] = useState("");

  // edit members state (dynamic list)
  const [editMembers, setEditMembers] = useState<MemberInput[]>([]);

  function updateEditMember(
    idx: number,
    field: keyof MemberInput,
    value: string
  ) {
    setEditMembers((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  }

  function addEditMemberRow() {
    setEditMembers((prev) => [...prev, { name: "", email: "", citizenId: "" }]);
  }

  function removeEditMemberRow(idx: number) {
    setEditMembers((prev) => prev.filter((_, i) => i !== idx));
  }

  function openDialog(action: "view" | "edit" | "delete", club: ClubRow) {
    setSelectedClub(club);
    setDialogAction(action);
    setDialogOpen(true);

    if (action === "edit") {
      // preload info
      setEditClubName(club.clubName);
      setEditLeaderName(club.ownerName);
      setEditLeaderEmail(club.ownerEmail);
      setEditLeaderCitizenId(club.leaderCitizenId);

      // preload members list
      const seed: MemberInput[] = [
        {
          name: club.ownerName,
          email: club.ownerEmail,
          citizenId: club.leaderCitizenId,
        },
        ...club.coOwners.map((co) => ({
          name: co.name,
          email: co.email,
          citizenId: "",
        })),
      ];

      while (seed.length < 5) {
        seed.push({ name: "", email: "", citizenId: "" });
      }

      setEditMembers(seed);
    }
  }

  function closeDialog() {
    setDialogOpen(false);
    setDialogAction(null);
    setSelectedClub(null);
  }

  function confirmDialog() {
    if (!selectedClub || !dialogAction) {
      closeDialog();
      return;
    }

    if (dialogAction === "edit") {
      console.log("EDIT SUBMIT:", {
        clubInfo: {
          clubName: editClubName,
          leaderFullName: editLeaderName,
          leaderEmail: editLeaderEmail,
          leaderCitizenId: editLeaderCitizenId,
        },
        members: editMembers,
      });
    } else if (dialogAction === "delete") {
      console.log("DELETE CLUB:", selectedClub.clubName);
    }

    closeDialog();
  }

  // dialog header content
  let dialogTitle = "";
  let dialogDesc = "";
  let confirmLabel = "OK";
  let confirmTone: "default" | "danger" = "default";

  if (dialogAction === "view") {
    dialogTitle = `Club Details`;
    dialogDesc = selectedClub
      ? `${selectedClub.clubName} • ${selectedClub.ownerName}`
      : "";
    confirmLabel = "Close";
  } else if (dialogAction === "edit") {
    dialogTitle = `Edit Club`;
    dialogDesc = `Update club info, leader, and member list.`;
    confirmLabel = "Save Changes";
  } else if (dialogAction === "delete") {
    dialogTitle = "Delete Club";
    dialogDesc = `This will permanently remove “${selectedClub?.clubName}”. This cannot be undone.`;
    confirmLabel = "Delete Permanently";
    confirmTone = "danger";
  }

  // dialog body renderer
  function renderDialogBody() {
    if (!selectedClub || !dialogAction) return null;

    // VIEW MODE
    if (dialogAction === "view") {
      return (
        <div className="text-[13px] leading-relaxed space-y-2">
          <div>
            <span className="font-semibold text-gray-800">Club:</span>{" "}
            {selectedClub.clubName}
          </div>

          <div>
            <span className="font-semibold text-gray-800">Leader:</span>{" "}
            {selectedClub.ownerName} ({selectedClub.ownerEmail})
          </div>

          <div>
            <span className="font-semibold text-gray-800">
              Leader Citizen ID:
            </span>{" "}
            {selectedClub.leaderCitizenId}
          </div>

          <div>
            <span className="font-semibold text-gray-800">Co-Owners:</span>{" "}
            {selectedClub.coOwners
              .map((co) => `${co.name} (${co.email})`)
              .join(", ")}
          </div>

          <div>
            <span className="font-semibold text-gray-800">Members:</span>{" "}
            {selectedClub.membersTotal} total / {selectedClub.membersCore} core
          </div>
        </div>
      );
    }

    // EDIT MODE
    if (dialogAction === "edit") {
      return (
        <div className="space-y-6 text-[13px]">
          {/* Club Information */}
          <div className="space-y-4">
            <div className="text-[13px] font-semibold text-gray-800">
              Club Information
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              {/* Club Name */}
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Club Name
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={editClubName}
                  onChange={(e) => setEditClubName(e.target.value)}
                  required
                />
              </div>

              {/* Leader Full Name */}
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Leader Full Name
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={editLeaderName}
                  onChange={(e) => setEditLeaderName(e.target.value)}
                  required
                />
              </div>

              {/* Leader Email */}
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Leader Email (login)
                </label>
                <input
                  type="email"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={editLeaderEmail}
                  onChange={(e) => setEditLeaderEmail(e.target.value)}
                  required
                />
              </div>

              {/* Leader Citizen ID */}
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-1">
                  Leader Citizen ID
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={editLeaderCitizenId}
                  onChange={(e) => setEditLeaderCitizenId(e.target.value)}
                  required
                  placeholder="13-digit"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Used to generate the initial password hash.
                </p>
              </div>
            </div>
          </div>

          {/* Club Members Edit */}
          <div className="space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <div className="text-[13px] font-semibold text-gray-800">
                  Club Members
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Update founding members. Must keep at least 5 total.
                </p>
              </div>

              <button
                type="button"
                onClick={addEditMemberRow}
                className="px-2.5 py-1.5 text-[12px] rounded-md bg-gray-900 text-white hover:bg-gray-800"
              >
                + Add Member
              </button>
            </div>

            <div className="space-y-3">
              {editMembers.map((m, idx) => (
                <div
                  key={idx}
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-[1fr_minmax(160px,220px)_minmax(140px,180px)_auto]
                    gap-3
                    items-start
                    border border-gray-200 rounded-md p-3 bg-gray-50
                  "
                >
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Full Name
                    </label>
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="Full Name"
                      value={m.name}
                      onChange={(e) =>
                        updateEditMember(idx, "name", e.target.value)
                      }
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="student@mfu.ac.th"
                      value={m.email}
                      onChange={(e) =>
                        updateEditMember(idx, "email", e.target.value)
                      }
                    />
                  </div>

                  {/* Citizen ID */}
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Citizen ID
                    </label>
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="13-digit"
                      value={m.citizenId}
                      onChange={(e) =>
                        updateEditMember(idx, "citizenId", e.target.value)
                      }
                    />
                  </div>

                  {/* Remove */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      disabled={editMembers.length <= 5}
                      onClick={() => removeEditMemberRow(idx)}
                      className="
                        text-[12px] text-red-600 hover:text-red-700
                        disabled:text-gray-300 disabled:cursor-not-allowed
                      "
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // DELETE MODE
    if (dialogAction === "delete") {
      return (
        <div className="text-[13px] leading-relaxed space-y-2 text-red-600">
          <div className="font-semibold">This action is permanent.</div>

          <div className="text-gray-700">
            Club:{" "}
            <span className="font-semibold text-gray-900">
              {selectedClub.clubName}
            </span>
          </div>

          <div className="text-gray-700">
            Leader:{" "}
            <span className="font-semibold text-gray-900">
              {selectedClub.ownerName}
            </span>{" "}
            ({selectedClub.ownerEmail})
          </div>
        </div>
      );
    }

    return null;
  }

  // icons
  function IconView() {
    return (
      <svg
        className="w-4 h-4 text-blue-600 hover:text-blue-700 transition-colors"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

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

  return (
    <>
      <TableCard>
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 text-[11px] uppercase tracking-wide">
            <tr>
              <th className="px-4 py-2">Club</th>
              <th className="px-4 py-2">Owner / Leader</th>
              <th className="px-4 py-2">Co-Owners</th>
              <th className="px-4 py-2">Members</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {mockClubs.map((club, idx) => (
              <motion.tr
                key={idx}
                className="border-t border-gray-200 bg-white align-top"
                variants={rowVariants}
                initial="hidden"
                animate="show"
              >
                {/* Club */}
                <td className="px-4 py-3 font-medium text-gray-900">
                  {club.clubName}
                </td>

                {/* Owner / Leader */}
                <td className="px-4 py-3 text-gray-800">
                  <div className="text-sm font-medium">{club.ownerName}</div>
                  <div className="text-[11px] text-gray-500">
                    {club.ownerEmail}
                  </div>
                </td>

                {/* Co-Owners */}
                <td className="px-4 py-3 text-gray-800">
                  <div className="space-y-1 text-[13px] leading-snug">
                    {club.coOwners.map((co, i) => (
                      <div key={i}>
                        <span className="font-medium text-gray-800">
                          {co.name}
                        </span>{" "}
                        <span className="text-[11px] text-gray-500">
                          {co.email}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>

                {/* Members */}
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    {club.membersTotal}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {club.membersCore} core /{" "}
                    {club.membersTotal - club.membersCore} general
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      className="p-1"
                      title="View"
                      onClick={() => openDialog("view", club)}
                    >
                      <IconView />
                    </button>

                    <button
                      className="p-1"
                      title="Edit"
                      onClick={() => openDialog("edit", club)}
                    >
                      <IconEdit />
                    </button>

                    <button
                      className="p-1"
                      title="Delete"
                      onClick={() => openDialog("delete", club)}
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

      <ActionDialog
        open={dialogOpen}
        mode={dialogAction}
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
