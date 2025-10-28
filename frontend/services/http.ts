export const BASE_URL = "http://localhost:8081/api";

export async function authedFetch(
  path: string,
  options: RequestInit & { requireJson?: boolean } = {}
) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type":
        options.headers && (options.headers as any)["Content-Type"]
          ? (options.headers as any)["Content-Type"]
          : options.method === "POST" ||
            options.method === "PATCH" ||
            options.method === "PUT"
          ? "application/json"
          : undefined,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }

  if (options.requireJson === false) {
    return null;
  }

  return res.json();
}
