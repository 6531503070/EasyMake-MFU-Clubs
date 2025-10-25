import { TableCard } from "@/components/admin/TableCard";

export default function ClubPostsPage() {
  return (
    <section className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Posts / Announcements
          </h1>
          <p className="text-sm text-gray-500">
            Publish updates and news for your followers.
          </p>
        </div>

        <button className="self-start px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800">
          + New Post
        </button>
      </header>

      <TableCard>
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Published</th>
              <th className="px-4 py-2">Last Update</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200 bg-white">
              <td className="px-4 py-3 font-medium text-gray-900">
                Recruitment Week is Open!
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-md bg-green-100 text-green-800 text-[11px] font-medium px-2 py-1">
                  Yes
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">24 Oct 2025</td>
              <td className="px-4 py-3 text-right space-x-2">
                <button className="text-xs text-blue-600 hover:text-blue-700">
                  Edit
                </button>
                <button className="text-xs text-red-600 hover:text-red-700">
                  Delete
                </button>
              </td>
            </tr>

            {/* more rows... */}
          </tbody>
        </table>
      </TableCard>
    </section>
  );
}
