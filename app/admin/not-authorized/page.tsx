export default function NotAuthorizedPage() {
  return (
    <section className="max-w-md mx-auto text-center space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">
        Access Denied
      </h1>
      <p className="text-sm text-gray-500">
        You don't have permission to view this admin area.
      </p>
      <p className="text-xs text-gray-400">
        Please contact Student Affairs / System Admin if you believe this is a mistake.
      </p>
    </section>
  );
}
