import { useState } from "react";
import { Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAtsChecks } from "@/services/queries/ats.query";
import { analyzeAts, deleteAtsCheck } from "@/services/mutations/ats.mutation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileSearch,
  Upload,
  Trash2,
  Eye,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

function getScoreBadge(score: number) {
  if (score >= 80)
    return { label: "Bagus", variant: "default" as const, icon: CheckCircle2 };
  if (score >= 60)
    return {
      label: "Cukup",
      variant: "secondary" as const,
      icon: AlertTriangle,
    };
  return {
    label: "Perlu Perbaikan",
    variant: "destructive" as const,
    icon: XCircle,
  };
}

export default function AtsChecksPage() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["ats-checks"],
    queryFn: () => getAtsChecks(1, 50),
  });

  const analyzeMutation = useMutation({
    mutationFn: analyzeAts,
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["ats-checks"] });
      queryClient.invalidateQueries({ queryKey: ["resume-quota"] });
    },
    onError: () => {
      toast.error("Gagal menganalisis CV");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAtsCheck,
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["ats-checks"] });
      queryClient.invalidateQueries({ queryKey: ["resume-quota"] });
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Gagal menghapus analisis");
    },
  });

  const handleFileUpload = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Format file tidak didukung. Gunakan PDF atau DOCX.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10MB");
      return;
    }
    analyzeMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    e.target.value = "";
  };

  const checks = data?.data?.ats_checks ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-40" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">ATS Review</h2>
        <p className="text-muted-foreground">
          Upload CV kamu untuk mendapatkan analisis ATS
        </p>
      </div>

      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
          {analyzeMutation.isPending ? (
            <>
              <Loader2 className="size-12 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium">Sedang menganalisis CV...</p>
                <p className="text-sm text-muted-foreground">
                  Proses ini membutuhkan waktu beberapa saat
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <Upload className="size-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-medium">Drag & drop CV kamu di sini</p>
                <p className="text-sm text-muted-foreground">
                  atau klik untuk memilih file (PDF, DOCX, maks 10MB)
                </p>
              </div>
              <label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={analyzeMutation.isPending}
                />
                <Button
                  variant="outline"
                  className="gap-2 cursor-pointer"
                  asChild
                >
                  <span>
                    <FileSearch className="size-4" />
                    Pilih File
                  </span>
                </Button>
              </label>
            </>
          )}
        </CardContent>
      </Card>

      {checks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <FileSearch className="size-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Belum ada analisis</h3>
              <p className="text-sm text-muted-foreground">
                Upload CV pertama kamu untuk mendapatkan review ATS
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Riwayat Analisis</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {checks.map((check) => {
              const scoreBadge = getScoreBadge(check.score);
              const ScoreIcon = scoreBadge.icon;
              return (
                <Card
                  key={check.id}
                  className="group transition-shadow hover:shadow-md"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-12 items-center justify-center rounded-xl bg-muted text-xl font-bold ${getScoreColor(check.score)}`}
                        >
                          {Math.round(check.score)}
                        </div>
                        <div>
                          <CardTitle className="text-base">Skor ATS</CardTitle>
                          <CardDescription>
                            {new Date(check.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={scoreBadge.variant} className="gap-1">
                        <ScoreIcon className="size-3" />
                        {scoreBadge.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={check.score} className="h-2" />
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {check.analysis.verdict}
                    </p>
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5"
                        asChild
                      >
                        <Link to={`/dashboard/ats-checks/${check.id}`}>
                          <Eye className="size-3.5" />
                          Detail
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-destructive hover:bg-destructive hover:text-white"
                        onClick={() => setDeleteId(check.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Analisis</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus hasil analisis ini?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
