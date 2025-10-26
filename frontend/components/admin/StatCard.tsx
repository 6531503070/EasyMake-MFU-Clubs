export function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note?: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-3xl font-semibold text-gray-900">{value}</div>
      {note && <div className="text-[11px] text-gray-400">{note}</div>}
    </div>
  );
}
