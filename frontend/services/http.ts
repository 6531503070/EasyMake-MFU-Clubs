export const BASE_URL = "http://localhost:8081/api";

export function getToken(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("token") || "";
}

export async function authedFetch(
  path: string,
  options: RequestInit & { requireJson?: boolean } = {}
) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type":
        options.headers && (options.headers as any)["Content-Type"]
          ? (options.headers as any)["Content-Type"]
          : options.method === "POST" || options.method === "PATCH" || options.method === "PUT"
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
    } catch {
      // ignore body parse fail
    }
    throw new Error(msg);
  }

  if (options.requireJson === false) {
    return null;
  }

  return res.json();
}
