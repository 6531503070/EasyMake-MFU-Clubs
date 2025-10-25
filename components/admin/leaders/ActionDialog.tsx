"use client";

import { motion, AnimatePresence } from "framer-motion";

type ActionDialogProps = {
  open: boolean;
  mode: "view" | "edit" | "suspend" | "delete" | null;
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmTone?: "default" | "danger";
  onClose: () => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
};

export function ActionDialog({
  open,
  mode,
  title,
  description,
  confirmLabel = "Confirm",
  confirmTone = "default",
  onClose,
  onConfirm,
  children,
}: ActionDialogProps) {
  const isViewOnly = mode === "view";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Wrapper (centers modal on desktop, bottom-sheet-ish on mobile) */}
          <motion.div
            className="
              fixed inset-0 z-50
              flex items-center justify-center
              p-4
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Panel */}
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`
                flex flex-col
                w-full
                max-h-[90vh]
                rounded-xl bg-white
                shadow-[0_24px_80px_-10px_rgba(0,0,0,0.4)]
                border border-gray-200
                text-gray-900
                /* responsive width */
                max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl
              `}
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-200">
                <div className="text-base font-semibold text-gray-900">
                  {title}
                </div>
                {description && (
                  <div className="text-[13px] text-gray-500 leading-relaxed mt-1">
                    {description}
                  </div>
                )}
              </div>

              {/* Body scroll area */}
              <div
                className="
                  flex-1
                  min-h-0
                  overflow-y-auto
                  px-5 py-4
                  text-[13px]
                  leading-relaxed
                  text-gray-700
                  space-y-4
                "
              >
                {children}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-2 bg-white">
                <button
                  onClick={onClose}
                  className="
                    px-3 py-1.5
                    text-[13px] rounded-md
                    border border-gray-300
                    text-gray-700 bg-white
                    hover:bg-gray-50
                    w-full sm:w-auto
                  "
                >
                  {isViewOnly ? "Close" : "Cancel"}
                </button>

                {!isViewOnly && (
                  <button
                    onClick={onConfirm}
                    className={`
                      px-3 py-1.5 text-[13px] rounded-md font-medium
                      w-full sm:w-auto
                      ${
                        confirmTone === "danger"
                          ? "bg-red-600 text-white hover:bg-red-500"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }
                    `}
                  >
                    {confirmLabel}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
