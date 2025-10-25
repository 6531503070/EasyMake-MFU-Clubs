import { StatCard } from "@/components/admin/StatCard";

export default function MyClubOverviewPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">
          My Club Overview
        </h1>
        <p className="text-sm text-gray-500">
          Stats for your club, followers, and upcoming activities.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Followers"
          value="156"
          note="students following your club"
        />
        <StatCard
          label="Upcoming Activities"
          value="4"
          note="scheduled this week"
        />
        <StatCard
          label="Event Capacity Filled"
          value="87%"
          note="latest major event"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">
            Latest Posts
          </h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>🔥 Recruitment Week is open!</li>
            <li>[Announcement] Workshop schedule update</li>
            <li>[Reminder] Dance practice this Friday</li>
          </ul>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">
            Upcoming Activities
          </h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>Tech Innovation Night · 28 Oct</li>
            <li>Dance Showcase Night · 29 Oct</li>
            <li>Football Friendly Match · 30 Oct</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
