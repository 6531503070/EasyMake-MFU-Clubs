import { TableCard } from "@/components/admin/TableCard";

export default function ClubMembersPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">
          Followers / Members
        </h1>
        <p className="text-sm text-gray-500">
          Students who joined or follow your club.
        </p>
      </header>

      <TableCard>
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-2">Student Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Joined At</th>
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
              <td className="px-4 py-3 text-gray-600">
                21 Oct 2025
              </td>
            </tr>
            {/* more rows */}
          </tbody>
        </table>
      </TableCard>
    </section>
  );
}
