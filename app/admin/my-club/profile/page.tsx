export default function ClubProfilePage() {
  return (
    <section className="space-y-6 max-w-xl">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">
          Club Profile
        </h1>
        <p className="text-sm text-gray-500">
          Update your club’s public info.
        </p>
      </header>

      <form className="space-y-4 bg-white border border-gray-200 rounded-lg p-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Club Name
          </label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Laced of ART"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Description
          </label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Tell students what your club is about..."
            rows={4}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Contact (Line, IG, etc.)
          </label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="@mfu.laced.art"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Cover Image URL
          </label>
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="https://cdn.example.com/club-cover.jpg"
          />
        </div>

        <button
          type="submit"
          className="px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800"
        >
          Save changes
        </button>
      </form>
    </section>
  );
}
