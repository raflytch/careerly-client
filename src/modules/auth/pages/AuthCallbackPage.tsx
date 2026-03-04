import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "@/stores/auth.store";
import { cookies } from "@/config/axios";
import { getUserProfile } from "@/services/queries/auth.query";
import { parseJwtPayload } from "@/lib/jwt";
import { COOKIE_OPTIONS } from "@/config/constants";
import { Loader2 } from "lucide-react";

type CallbackStatus = "processing" | "error";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const [status, setStatus] = useState<CallbackStatus>("processing");

  useEffect(() => {
    const processAuthCallback = async () => {
      const token = searchParams.get("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const payload = parseJwtPayload(token);
      if (!payload?.user_id) {
        navigate("/login", { replace: true });
        return;
      }

      cookies.set("token", token, COOKIE_OPTIONS);

      try {
        const response = await getUserProfile();
        setUser(response.data.user);
        navigate("/dashboard", { replace: true });
      } catch {
        cookies.remove("token", { path: "/" });
        setStatus("error");
      }
    };

    processAuthCallback();
  }, [searchParams, navigate, setUser]);

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-destructive font-medium">
            Gagal memproses login. Silakan coba lagi.
          </p>
          <button
            className="text-sm text-muted-foreground underline hover:text-foreground"
            onClick={() => navigate("/login", { replace: true })}
          >
            Kembali ke halaman login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Sedang memproses login...</p>
      </div>
    </div>
  );
}
