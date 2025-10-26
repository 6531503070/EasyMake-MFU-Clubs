"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { TableCard } from "@/components/admin/TableCard";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { ActionDialog } from "@/components/admin/leaders/ActionDialog";

// mock data
type ReportRow = {
  issue: string;
  reporter: string;
  target: string;
  status: "reviewing" | "resolved";
};

const mockReports: ReportRow[] = [
  {
    issue: "Spam / inappropriate event promotion",
    reporter: "student#6421",
    target: "Activity: Tech Innovation Night",
    status: "reviewing",
  },
  {
    issue: "Harassment in comments",
    reporter: "student#2894",
    target: "Post: Esports Tryout Signup",
    status: "reviewing",
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

// single action icon (Approve)
function IconApprove() {
  return (
    <svg
      className="w-4 h-4 text-green-600 hover:text-green-700 transition-colors"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path
        d="M5 13l4 4L19 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SystemReportsPage() {
  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  // only one action now: "approve"
  const [selectedReport, setSelectedReport] = useState<ReportRow | null>(
    null
  );

  function openDialog(report: ReportRow) {
    setSelectedReport(report);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setSelectedReport(null);
  }

  // For now we don't need confirmDialog because
  // dialog is read-only info + Close button only.
  // But if you later want to "mark resolved" on confirm,
  // you can add that logic here and pass onConfirm.
  function confirmDialog() {
    closeDialog();
  }

  // dialog props (mode="view" hides confirm button in ActionDialog)
  const dialogMode: "view" = "view";
  const dialogTitle = "Approve & Mark As Resolved";
  const dialogDesc = selectedReport
    ? `This will be marked as handled for ${selectedReport.reporter}.`
    : "";
  const confirmLabel = "Close";
  const confirmTone: "default" = "default";

  function renderDialogBody() {
    if (!selectedReport) return null;

    return (
      <div className="text-[13px] leading-relaxed space-y-2">
        <div>
          <span className="font-semibold text-gray-800">Issue:</span>{" "}
          {selectedReport.issue}
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Reported By:
          </span>{" "}
          {selectedReport.reporter}
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Target Content:
          </span>{" "}
          {selectedReport.target}
        </div>

        <div className="text-[12px] text-gray-500 pt-2">
          After approval, the reporting student will be notified that
          moderation action was taken.
        </div>
      </div>
    );
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
            title="Reports & Moderation"
            subtitle="Review reported posts, clubs, and activities."
          />
        </motion.div>

        {/* Table */}
        <motion.div variants={sectionItemVariants}>
          <TableCard>
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600 text-[11px] uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-2">Issue</th>
                  <th className="px-4 py-2">Reported By</th>
                  <th className="px-4 py-2">Target</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockReports.map((report, idx) => (
                  <motion.tr
                    key={idx}
                    variants={rowVariants}
                    initial="hidden"
                    animate="show"
                    className="border-t border-gray-200 bg-white align-top"
                  >
                    {/* Issue */}
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {report.issue}
                    </td>

                    {/* Reporter */}
                    <td className="px-4 py-3 text-gray-700">
                      {report.reporter}
                    </td>

                    {/* Target */}
                    <td className="px-4 py-3 text-gray-700">
                      {report.target}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {report.status === "reviewing" ? (
                        <span className="inline-flex items-center rounded-md bg-yellow-100 text-yellow-800 text-[11px] font-medium px-2 py-1">
                          Reviewing
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-green-100 text-green-800 text-[11px] font-medium px-2 py-1">
                          Resolved
                        </span>
                      )}
                    </td>

                    {/* Action icons */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-3">
                        {/* Approve / Mark Resolved */}
                        <button
                          className="p-1"
                          title="Approve"
                          onClick={() => openDialog(report)}
                        >
                          <IconApprove />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </TableCard>
        </motion.div>

        {/* Footnote */}
        <motion.p
          variants={sectionItemVariants}
          className="text-[11px] text-gray-400 leading-relaxed max-w-xl"
        >
          When a case is approved, the reporting student should be
          notified automatically so they know action was taken.
        </motion.p>
      </motion.section>

      {/* Dialog */}
      <ActionDialog
        open={dialogOpen}
        mode={dialogMode}
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
