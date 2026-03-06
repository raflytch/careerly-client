import { useState } from "react";
import { Link } from "react-router";
import { useInterviews } from "@/services/queries/interview.query";
import { useDeleteInterview } from "@/services/mutations/interview.mutation";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BrainCircuit,
  Plus,
  Trash2,
  Eye,
  Loader2,
  CheckCircle2,
  Clock,
  ListChecks,
  FileText,
} from "lucide-react";
import type { Interview } from "@/@types/interview";

function getStatusBadge(status: string) {
  if (status === "completed") {
    return {
      label: "Selesai",
      variant: "default" as const,
      icon: CheckCircle2,
    };
  }
  return { label: "Berlangsung", variant: "secondary" as const, icon: Clock };
}

function getTypeLabel(interview: Interview) {
  const type = interview.questions[0]?.type;
  if (type === "multiple_choice") return "Pilihan Ganda";
  return "Essay";
}

function getTypeIcon(interview: Interview) {
  const type = interview.questions[0]?.type;
  if (type === "multiple_choice") return ListChecks;
  return FileText;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InterviewsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useInterviews();
  const deleteMutation = useDeleteInterview(() => setDeleteId(null));

  const interviews = data?.data?.interviews ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Latihan Interview
          </h2>
          <p className="text-muted-foreground">
            Latihan interview dengan AI untuk persiapan karir
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/interviews/create">
            <Plus className="mr-2 size-4" />
            Mulai Latihan
          </Link>
        </Button>
      </div>

      {interviews.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <BrainCircuit className="mb-4 size-12 text-muted-foreground" />
          <CardTitle className="mb-2">Belum ada latihan</CardTitle>
          <CardDescription className="mb-4">
            Mulai latihan interview pertamamu sekarang
          </CardDescription>
          <Button asChild>
            <Link to="/dashboard/interviews/create">
              <Plus className="mr-2 size-4" />
              Mulai Latihan
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {interviews.map((interview) => {
            const statusBadge = getStatusBadge(interview.status);
            const TypeIcon = getTypeIcon(interview);

            return (
              <Card key={interview.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="size-4 text-muted-foreground" />
                      <Badge variant="outline">{getTypeLabel(interview)}</Badge>
                    </div>
                    <Badge variant={statusBadge.variant}>
                      <statusBadge.icon className="mr-1 size-3" />
                      {statusBadge.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">
                    {interview.job_position}
                  </CardTitle>
                  <CardDescription>
                    {interview.questions.length} pertanyaan
                    {interview.overall_score !== undefined &&
                      ` · Skor: ${interview.overall_score}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                  <p className="mb-4 text-xs text-muted-foreground">
                    {formatDate(interview.created_at)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link to={`/dashboard/interviews/${interview.id}`}>
                        <Eye className="mr-1 size-3" />
                        Lihat
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(interview.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Interview?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data interview akan dihapus
              secara permanen.
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
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
