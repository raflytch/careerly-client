import { Outlet, Navigate } from "react-router";
import { useAuthStore } from "@/stores/auth.store";
import { isTokenValid } from "@/lib/jwt";

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated && isTokenValid()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
