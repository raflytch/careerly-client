import { useState } from "react";
import { Link } from "react-router";
import {
  useResumes,
  useResumeQuota,
  useDownloadResumePdf,
} from "@/services/queries/resume.query";
import { useDeleteResume } from "@/services/mutations/resume.mutation";
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
  Plus,
  FileText,
  Trash2,
  Eye,
  Pencil,
  Loader2,
  Briefcase,
  GraduationCap,
  Download,
} from "lucide-react";

export default function ResumesPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: resumesData, isLoading } = useResumes();
  const { data: quotaData } = useResumeQuota();
  const deleteMutation = useDeleteResume(() => setDeleteId(null));
  const downloadPdfMutation = useDownloadResumePdf();

  const resumes = resumesData?.data?.resumes ?? [];
  const quota = quotaData?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Resume</h2>
          <p className="text-muted-foreground">
            Kelola resume kamu untuk melamar pekerjaan
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/dashboard/resumes/create">
            <Plus className="size-4" />
            Buat Resume
          </Link>
        </Button>
      </div>

      {quota && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Kuota Resume</p>
                <p className="text-xs text-muted-foreground">
                  Plan {quota.plan_name}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              {quota.used_resumes} / {quota.max_resumes}
            </Badge>
          </CardContent>
        </Card>
      )}

      {resumes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <FileText className="size-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Belum ada resume</h3>
              <p className="text-sm text-muted-foreground">
                Buat resume pertama kamu untuk mulai melamar
              </p>
            </div>
            <Button asChild className="gap-2">
              <Link to="/dashboard/resumes/create">
                <Plus className="size-4" />
                Buat Resume
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Card
              key={resume.id}
              className="group transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1 text-base">
                      {resume.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                      {resume.content.personal_info.full_name}
                    </CardDescription>
                  </div>
                  <Badge variant={resume.is_active ? "default" : "secondary"}>
                    {resume.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {resume.content.experience.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Briefcase className="size-3" />
                      <span>{resume.content.experience.length} Pengalaman</span>
                    </div>
                  )}
                  {resume.content.education.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <GraduationCap className="size-3" />
                      <span>{resume.content.education.length} Pendidikan</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {resume.content.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {resume.content.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{resume.content.skills.length - 4}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Dibuat{" "}
                  {new Date(resume.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    asChild
                  >
                    <Link to={`/dashboard/resumes/${resume.id}`}>
                      <Eye className="size-3.5" />
                      Lihat
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    asChild
                  >
                    <Link to={`/dashboard/resumes/${resume.id}/edit`}>
                      <Pencil className="size-3.5" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    disabled={downloadPdfMutation.isPending}
                    onClick={() =>
                      downloadPdfMutation.mutate({
                        id: resume.id,
                        title: resume.title,
                      })
                    }
                  >
                    {downloadPdfMutation.isPending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Download className="size-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-destructive hover:bg-destructive hover:text-white"
                    onClick={() => setDeleteId(resume.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Resume</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus resume ini? Aksi ini tidak dapat
              dibatalkan.
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
