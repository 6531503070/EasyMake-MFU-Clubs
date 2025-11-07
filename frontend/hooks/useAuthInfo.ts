export function useAuthInfo() {
  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.split("; ").find(row => row.startsWith(name + "="));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
  }

  const role = getCookie("role");
  const email = getCookie("email");
  const clubIdFromCookie = getCookie("clubId");
  const clubId = clubIdFromCookie || localStorage.getItem("clubId");

  return {
    role,
    email,
    clubId,
    isSuperAdmin: role === "super-admin",
    isLeader: role === "club-leader",
    isCoLeader: role === "co-leader",
  };
}
