// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-[#1e3a5f]">
        Welcome to EasyMake MFU Clubs 🎉
      </h1>
      <p className="text-gray-600 max-w-xl mb-8">
        Manage, explore, and join MFU clubs all in one place.  
        Choose your portal below to continue.
      </p>

      <div className="flex gap-6">
        <Link
          href="/user"
          className="px-6 py-3 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#2b4a7c] transition"
        >
          User Portal
        </Link>

        <Link
          href="/admin/login"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
        >
          Admin Dashboard
        </Link>
      </div>
    </main>
  );
}
