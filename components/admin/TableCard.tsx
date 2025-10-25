export function TableCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {children}
    </div>
  );
}
