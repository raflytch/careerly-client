import type { JwtPayload } from "@/@types/auth";
import { cookies } from "@/config/axios";

export function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenValid(): boolean {
  const token = cookies.get("token");
  if (!token) return false;

  const payload = parseJwtPayload(token);
  if (!payload?.exp) return false;

  return payload.exp > Math.floor(Date.now() / 1000);
}

export function clearAuth() {
  cookies.remove("token", { path: "/" });
}
