import { TableCard } from "@/components/admin/TableCard";

export default function ActivityDetailPage() {
  return (
    <section className="space-y-6 max-w-4xl">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">
          Tech Innovation Night
        </h1>
        <p className="text-sm text-gray-500">
          C1 Auditorium · 28 Oct 2025 · 18:00-21:00
        </p>
        <p className="text-sm text-gray-500">
          Capacity: 100 / Registered: 87
        </p>
      </header>

      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
        <div className="text-sm text-gray-700">
          This event showcases cutting-edge student projects using AI,
          robotics, and creative tech at MFU.
        </div>
        <div className="text-xs text-gray-400">
          Status: Published
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-800">
          Registered Students
        </h2>

        <TableCard>
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200 bg-white">
                <td className="px-4 py-3 font-medium text-gray-900">
                  Jane Doe
                </td>
                <td className="px-4 py-3 text-gray-700">
                  jane123@mfu.ac.th
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-green-100 text-green-800 text-[11px] font-medium px-2 py-1">
                    registered
                  </span>
                </td>
              </tr>
              {/* ... */}
            </tbody>
          </table>
        </TableCard>
      </section>
    </section>
  );
}
