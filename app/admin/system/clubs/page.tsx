"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { TableCard } from "@/components/admin/TableCard";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { ActionDialog } from "@/components/admin/leaders/ActionDialog";
import { useRouter } from "next/navigation";

// mock data
type ClubRow = {
  clubName: string;
  clubTagline?: string;
  leaderName: string;
  members: number;
  status: "active" | "suspended";
};

const mockClubs: ClubRow[] = [
  {
    clubName: "Laced of ART",
    clubTagline: "Art & Creative Media Club",
    leaderName: "Thanakorn T.",
    members: 156,
    status: "active",
  },
  {
    clubName: "MFU Esports",
    clubTagline: "Competitive Gaming Club",
    leaderName: "Krit R.",
    members: 89,
    status: "active",
  },
];

// animations
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.08 },
  },
};

const sectionItemVariants: Variants = {
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

// MAIN PAGE
export default function SystemClubsPage() {
  const router = useRouter();

  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"view" | "suspend" | null>(
    null
  );
  const [selectedClub, setSelectedClub] = useState<ClubRow | null>(null);

  function goToRegisterNewClub() {
    router.push("/admin/system/leaders");
  }

  function openDialog(action: "view" | "suspend", club: ClubRow) {
    setSelectedClub(club);
    setDialogAction(action);
    setDialogOpen(true);
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

    if (dialogAction === "suspend") {
      console.log("SUSPEND CLUB:", selectedClub.clubName);
    }

    closeDialog();
  }

  // dialog text
  let dialogTitle = "";
  let dialogDesc = "";
  let confirmLabel = "OK";
  let confirmTone: "default" | "danger" = "default";

  if (dialogAction === "view") {
    dialogTitle = "Club Details";
    dialogDesc = selectedClub
      ? `${selectedClub.clubName} • ${selectedClub.leaderName}`
      : "";
    confirmLabel = "Close";
  } else if (dialogAction === "suspend") {
    dialogTitle = "Suspend Club";
    dialogDesc = `Are you sure you want to temporarily suspend “${selectedClub?.clubName}”? The club will lose access to admin tools.`;
    confirmLabel = "Suspend Club";
    confirmTone = "danger";
  }

  // body renderer
  function renderDialogBody() {
    if (!selectedClub || !dialogAction) return null;

    if (dialogAction === "view") {
      return (
        <div className="text-[13px] leading-relaxed space-y-2">
          <div>
            <span className="font-semibold text-gray-800">Club:</span>{" "}
            {selectedClub.clubName}
          </div>

          {selectedClub.clubTagline && (
            <div>
              <span className="font-semibold text-gray-800">About:</span>{" "}
              {selectedClub.clubTagline}
            </div>
          )}

          <div>
            <span className="font-semibold text-gray-800">Leader:</span>{" "}
            {selectedClub.leaderName}
          </div>

          <div>
            <span className="font-semibold text-gray-800">Members:</span>{" "}
            {selectedClub.members}
          </div>

          <div>
            <span className="font-semibold text-gray-800">Status:</span>{" "}
            {selectedClub.status === "active" ? "Active" : "Suspended"}
          </div>
        </div>
      );
    }

    if (dialogAction === "suspend") {
      return (
        <div className="text-[13px] leading-relaxed space-y-2 text-red-600">
          <div className="font-semibold">
            This club will be temporarily disabled.
          </div>
          <div className="text-gray-700">
            Club:{" "}
            <span className="font-semibold text-gray-900">
              {selectedClub.clubName}
            </span>
          </div>
          <div className="text-gray-700">
            Leader:{" "}
            <span className="font-semibold text-gray-900">
              {selectedClub.leaderName}
            </span>
          </div>
          <div className="text-gray-700">
            Current members:{" "}
            <span className="font-semibold text-gray-900">
              {selectedClub.members}
            </span>
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
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={sectionItemVariants}>
          <SectionHeader
            title="All Clubs"
            subtitle="Overview of every registered club, leader, and status."
            action={
              <button
                onClick={goToRegisterNewClub}
                className="px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800"
              >
                + Register New Club
              </button>
            }
          />
        </motion.div>

        {/* Table */}
        <motion.div variants={sectionItemVariants}>
          <TableCard>
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600 text-[11px] uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-2">Club Name</th>
                  <th className="px-4 py-2">Leader</th>
                  <th className="px-4 py-2">Members</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockClubs.map((club, i) => (
                  <motion.tr
                    key={i}
                    variants={rowVariants}
                    initial="hidden"
                    animate="show"
                    className="border-t border-gray-200 bg-white align-top"
                  >
                    {/* Club Name + tagline */}
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {club.clubName}
                      {club.clubTagline && (
                        <div className="text-[11px] text-gray-500 font-normal">
                          {club.clubTagline}
                        </div>
                      )}
                    </td>

                    {/* Leader */}
                    <td className="px-4 py-3 text-gray-700">
                      {club.leaderName}
                    </td>

                    {/* Members */}
                    <td className="px-4 py-3">{club.members}</td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {club.status === "active" ? (
                        <span className="inline-flex items-center rounded-md bg-green-100 text-green-800 text-[11px] font-medium px-2 py-1">
                          active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-yellow-100 text-yellow-800 text-[11px] font-medium px-2 py-1">
                          suspended
                        </span>
                      )}
                    </td>

                    {/* Action icons */}
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
                          title="Suspend"
                          onClick={() => openDialog("suspend", club)}
                        >
                          <IconSuspend />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </motion.div>
      </motion.section>

      {/* Dialog */}
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
