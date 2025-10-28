"use client";

type GlobalAlertProps = {
  type: "success" | "error" | null;
  message: string;
  onClose?: () => void;
};

export function GlobalAlert({ type, message, onClose }: GlobalAlertProps) {
  if (!type || !message) return null;

  const base =
    "text-sm rounded-md px-3 py-2 border flex items-start justify-between gap-4";

  const style =
    type === "error"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-green-50 text-green-700 border-green-200";

  return (
    <div className={`${base} ${style}`}>
      <div className="whitespace-pre-line">{message}</div>
      {onClose && (
        <button
          className="text-[11px] font-medium opacity-70 hover:opacity-100"
          onClick={onClose}
        >
          ✕
        </button>
      )}
    </div>
  );
}
