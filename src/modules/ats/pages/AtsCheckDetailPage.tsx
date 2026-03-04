import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getAtsCheckById } from "@/services/queries/ats.query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Target,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-emerald-50 border-emerald-200";
  if (score >= 60) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

function getSectionScoreColor(score: number, maxScore: number) {
  const pct = (score / maxScore) * 100;
  if (pct >= 80) return "text-emerald-600";
  if (pct >= 50) return "text-amber-600";
  return "text-red-600";
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "critical":
      return { label: "Kritis", variant: "destructive" as const };
    case "high":
      return { label: "Tinggi", variant: "default" as const };
    case "medium":
      return { label: "Sedang", variant: "secondary" as const };
    default:
      return { label: "Rendah", variant: "outline" as const };
  }
}

export default function AtsCheckDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ats-check", id],
    queryFn: () => getAtsCheckById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (isError || !data?.data) {
    navigate("/dashboard/ats-checks", { replace: true });
    return null;
  }

  const check = data.data;
  const { analysis } = check;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate("/dashboard/ats-checks")}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Detail Analisis ATS</h2>
          <p className="text-sm text-muted-foreground">
            {new Date(check.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <Card className={`border ${getScoreBg(check.score)}`}>
        <CardContent className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-6">
            <div
              className={`flex size-24 items-center justify-center rounded-2xl border-2 bg-white text-4xl font-bold ${getScoreColor(check.score)}`}
            >
              {Math.round(check.score)}
            </div>
            <div>
              <h3 className="text-xl font-bold">Skor ATS</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                {analysis.verdict}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {check.score >= 80 ? (
              <Badge className="gap-1 bg-emerald-600">
                <CheckCircle2 className="size-3" />
                Bagus
              </Badge>
            ) : check.score >= 60 ? (
              <Badge className="gap-1 bg-amber-600">
                <AlertTriangle className="size-3" />
                Cukup
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="size-3" />
                Perlu Perbaikan
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="size-4" />
            Skor per Bagian
          </CardTitle>
          <CardDescription>
            Penilaian detail setiap bagian resume
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {analysis.sections.map((section, i) => {
            const pct = (section.score / section.max_score) * 100;
            return (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{section.name}</span>
                  <span
                    className={`text-sm font-semibold ${getSectionScoreColor(section.score, section.max_score)}`}
                  >
                    {section.score} / {section.max_score}
                  </span>
                </div>
                <Progress value={pct} className="h-2" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {section.feedback}
                </p>
                {i < analysis.sections.length - 1 && (
                  <Separator className="mt-3" />
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-emerald-600">
              <CheckCircle2 className="size-4" />
              Keyword Ditemukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.keyword_analysis.found.map((kw) => (
                <Badge
                  key={kw}
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  {kw}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-red-600">
              <XCircle className="size-4" />
              Keyword Hilang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.keyword_analysis.missing.map((kw) => (
                <Badge
                  key={kw}
                  variant="secondary"
                  className="bg-red-50 text-red-700 border-red-200"
                >
                  {kw}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {analysis.keyword_analysis.tip && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="flex gap-3 py-4">
            <Lightbulb className="size-5 shrink-0 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-900 leading-relaxed">
              {analysis.keyword_analysis.tip}
            </p>
          </CardContent>
        </Card>
      )}

      {analysis.improvements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4" />
              Saran Perbaikan
            </CardTitle>
            <CardDescription>
              Langkah-langkah untuk meningkatkan skor ATS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.improvements.map((imp, i) => {
              const priorityBadge = getPriorityBadge(imp.priority);
              return (
                <div key={i} className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={priorityBadge.variant}>
                      {priorityBadge.label}
                    </Badge>
                    <span className="text-sm font-medium">{imp.category}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-destructive">
                      {imp.issue}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {imp.suggestion}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {analysis.deal_breakers.length > 0 && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <ShieldAlert className="size-4" />
              Deal Breakers
            </CardTitle>
            <CardDescription>
              Masalah kritis yang harus segera diperbaiki
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.deal_breakers.map((db, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-md bg-destructive/5 px-3 py-2 text-sm"
                >
                  <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                  {db}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
