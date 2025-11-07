export function StatusPill({ status }: { status: "published" | "cancelled" }) {
  const style =
    status === "published"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <span
      className={`inline-flex items-center rounded-md text-[10px] font-medium px-1.5 py-0.5 ${style}`}
    >
      {status}
    </span>
  );
}
