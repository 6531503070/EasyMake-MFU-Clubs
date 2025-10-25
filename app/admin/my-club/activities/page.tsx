import Link from "next/link";
import { TableCard } from "@/components/admin/TableCard";
import { SectionHeader } from "@/components/admin/SectionHeader";

export default function ClubActivitiesPage() {
  return (
    <section className="space-y-6">
      <SectionHeader
        title="Activities"
        subtitle="Create events and track registrations."
        action={
          <button className="px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800">
            + New Activity
          </button>
        }
      />

      <TableCard>
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-2">Activity</th>
              <th className="px-4 py-2">When</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Capacity</th>
              <th className="px-4 py-2">Registered</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200 bg-white">
              <td className="px-4 py-3 font-medium text-gray-900">
                Tech Innovation Night
              </td>
              <td className="px-4 py-3">
                28 Oct 2025, 18:00-21:00
              </td>
              <td className="px-4 py-3">C1 Auditorium</td>
              <td className="px-4 py-3">100</td>
              <td className="px-4 py-3">87</td>
              <td className="px-4 py-3 text-right space-x-2">
                <Link
                  href="/admin/my-club/activities/tech-innovation-night"
                  className="text-xs text-gray-500 hover:text-gray-800"
                >
                  View
                </Link>
                <button className="text-xs text-blue-600 hover:text-blue-700">
                  Edit
                </button>
                <button className="text-xs text-red-600 hover:text-red-700">
                  Cancel
                </button>
              </td>
            </tr>
            {/* ...more rows */}
          </tbody>
        </table>
      </TableCard>
    </section>
  );
}
