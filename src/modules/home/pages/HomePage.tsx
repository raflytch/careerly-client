import { useSearchParams, Navigate, Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  if (token) {
    return <Navigate to={`/auth/callback?token=${token}`} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-4xl font-bold">Careerly</h1>
      <p className="text-muted-foreground text-center">
        Platform karir terbaik untuk kamu
      </p>
      <Button asChild>
        <Link to="/login">Login dengan Google</Link>
      </Button>
    </div>
  );
}
