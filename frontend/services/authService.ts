import { BASE_URL } from "./http";


export type LoginSuccessResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    role: "super-admin" | "club-leader" | "user";
    full_name?: string;
    is_active: boolean;
  };
};

export async function loginRequest(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let message = "Login failed";
    try {
      const data = await res.json();
      if (data && data.message) {
        message = data.message;
      }
    } catch {
      // ignore parse fail
    }
    throw new Error(message);
  }

  const data: LoginSuccessResponse = await res.json();
  return data;
}
