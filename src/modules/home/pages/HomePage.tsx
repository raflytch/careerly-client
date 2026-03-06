import { useSearchParams, Navigate, Link } from "react-router";
import { useAuthStore } from "@/stores/auth.store";
import { isTokenValid } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  FileSearch,
  BrainCircuit,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Buat resume profesional dengan mudah dan cepat",
  },
  {
    icon: FileSearch,
    title: "ATS Review",
    description: "Analisis resume kamu agar lolos sistem ATS",
  },
  {
    icon: BrainCircuit,
    title: "Interview AI",
    description: "Latihan interview dengan AI untuk persiapan terbaik",
  },
];

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoggedIn = isAuthenticated && isTokenValid();

  if (token) {
    return <Navigate to={`/auth/callback?token=${token}`} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-xl font-bold">Careerly</span>
        <Button asChild variant="outline" size="sm">
          <Link to={isLoggedIn ? "/dashboard" : "/login"}>
            {isLoggedIn ? "Dashboard" : "Masuk"}
          </Link>
        </Button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20">
        <Badge variant="secondary" className="mb-6">
          <Sparkles className="mr-1 size-3" />
          Platform Karir Berbasis AI
        </Badge>

        <h1 className="max-w-2xl text-center text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          Persiapkan Karirmu dengan Lebih{" "}
          <span className="text-primary">Percaya Diri</span>
        </h1>

        <p className="mt-4 max-w-lg text-center text-muted-foreground">
          Buat resume profesional, cek skor ATS, dan latihan interview dengan
          AI. Semua dalam satu platform.
        </p>

        <div className="mt-8 flex gap-3">
          <Button asChild size="lg">
            <Link to={isLoggedIn ? "/dashboard" : "/login"}>
              {isLoggedIn ? "Ke Dashboard" : "Mulai Sekarang"}
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-20 grid w-full max-w-3xl gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="size-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border px-6 py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Careerly
      </footer>
    </div>
  );
}
