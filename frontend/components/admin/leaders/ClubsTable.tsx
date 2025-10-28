"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { TableCard } from "@/components/admin/TableCard";
import { ClubActionDialog } from "@/components/admin/leaders/ClubActionDialog";
import { type ClubApiRow } from "@/services/clubsService";
import { MemberInput } from "./ClubEditFormSection";

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

type Props = {
  clubs: ClubApiRow[];
  loading: boolean;
  errorMsg: string;
  onListChange: (next: ClubApiRow[]) => void;
  onActionSuccess?: (msg: string) => void;
  onActionError?: (msg: string) => void;
};

export function ClubsTable({
  clubs,
  loading,
  errorMsg,
  onListChange,
  onActionSuccess,
  onActionError,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<
    "view" | "edit" | "suspend" | "activate" | "delete" | null
  >(null);
  const [selectedClub, setSelectedClub] = useState<ClubApiRow | null>(null);

  const [editClubName, setEditClubName] = useState("");
  const [editLeaderName, setEditLeaderName] = useState("");
  const [editLeaderEmail, setEditLeaderEmail] = useState("");
  const [editLeaderCitizenId, setEditLeaderCitizenId] = useState("");
  const [editMembers, setEditMembers] = useState<MemberInput[]>([]);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  function hydrateEditFormFromClub(club: ClubApiRow) {
    const leaderFullName = (club as any).leader_full_name || "";
    const leaderEmail = (club as any).leader_email || "";
    const leaderCitizenId = (club as any).leader_citizen_id || "";

    const seedMembers: MemberInput[] = (club as any).members || [
      {
        name: leaderFullName,
        email: leaderEmail,
        citizen_id: leaderCitizenId,
      },
      { full_name: "", email: "", citizen_id: "" },
      { full_name: "", email: "", citizen_id: "" },
      { full_name: "", email: "", citizen_id: "" },
      { full_name: "", email: "", citizen_id: "" },
    ];

    while (seedMembers.length < 5) {
      seedMembers.push({ full_name: "", email: "", citizen_id: "" });
    }

    setEditClubName(club.name || "");
    setEditLeaderName(leaderFullName);
    setEditLeaderEmail(leaderEmail);
    setEditLeaderCitizenId(leaderCitizenId);
    setEditMembers(seedMembers);
  }

  function openDialog(
    action: "view" | "edit" | "suspend" | "activate" | "delete",
    club: ClubApiRow
  ) {
    setSelectedClub(club);
    setDialogAction(action);
    setDialogOpen(true);

    if (action === "edit") {
      hydrateEditFormFromClub(club);
      setEditError("");
    }
  }

  function closeDialog() {
    setDialogOpen(false);
    setDialogAction(null);
    setSelectedClub(null);
    setEditSubmitting(false);
    setEditError("");
  }

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

  function IconSuspend() {
    return (
      <svg
        className="w-4 h-4 text-amber-600 hover:text-amber-700 transition-colors"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 9l-6 6M9 9l6 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  function IconActivate() {
    return (
      <svg
        className="w-4 h-4 text-green-600 hover:text-green-700 transition-colors"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        <circle
          cx="12"
          cy="12"
          r="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
        {errorMsg && (
          <div className="text-sm rounded-md px-3 py-2 mb-3 bg-red-50 text-red-700 border border-red-200">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500 italic">
            Loading clubs...
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 text-[11px] uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2">Club Name</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {clubs.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-sm text-gray-500 italic"
                  >
                    No clubs found
                  </td>
                </tr>
              ) : (
                clubs.map((club) => (
                  <motion.tr
                    key={club._id}
                    className="border-t border-gray-200 bg-white align-top"
                    variants={rowVariants}
                    initial="hidden"
                    animate="show"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {club.name}
                      {club.tagline && (
                        <div className="text-[11px] text-gray-500 font-normal">
                          {club.tagline}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {club.status === "active" ? (
                        <span className="inline-flex rounded-md bg-green-100 text-green-800 text-[11px] font-medium px-2 py-1">
                          active
                        </span>
                      ) : (
                        <span className="inline-flex rounded-md bg-yellow-100 text-yellow-800 text-[11px] font-medium px-2 py-1">
                          suspended
                        </span>
                      )}
                    </td>

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

                        {club.status === "active" ? (
                          <button
                            className="p-1"
                            title="Suspend"
                            onClick={() => openDialog("suspend", club)}
                          >
                            <IconSuspend />
                          </button>
                        ) : (
                          <button
                            className="p-1"
                            title="Activate"
                            onClick={() => openDialog("activate", club as any)}
                          >
                            <IconActivate />
                          </button>
                        )}

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
                ))
              )}
            </tbody>
          </table>
        )}
      </TableCard>

      <ClubActionDialog
        open={dialogOpen}
        mode={dialogAction}
        selectedClub={selectedClub}
        editClubName={editClubName}
        setEditClubName={setEditClubName}
        editLeaderName={editLeaderName}
        setEditLeaderName={setEditLeaderName}
        editLeaderEmail={editLeaderEmail}
        setEditLeaderEmail={setEditLeaderEmail}
        editLeaderCitizenId={editLeaderCitizenId}
        setEditLeaderCitizenId={setEditLeaderCitizenId}
        editMembers={editMembers}
        setEditMembers={setEditMembers}
        editSubmitting={editSubmitting}
        setEditSubmitting={setEditSubmitting}
        editError={editError}
        setEditError={setEditError}
        clubs={clubs}
        onListChange={onListChange}
        onClose={closeDialog}
        onActionSuccess={onActionSuccess}
        onActionError={onActionError}
      />
    </>
  );
}
