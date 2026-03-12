import { useParams, useNavigate, Link } from "react-router";
import {
  useResumeById,
  useDownloadResumePdf,
} from "@/services/queries/resume.query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Pencil,
  Download,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Heart,
  ShieldCheck,
  FolderKanban,
} from "lucide-react";

export default function ResumeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useResumeById(id);
  const downloadPdfMutation = useDownloadResumePdf();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (isError || !data?.data) {
    navigate("/dashboard/resumes", { replace: true });
    return null;
  }

  const resume = data.data;
  const { content } = resume;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate("/dashboard/resumes")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{resume.title}</h2>
            <p className="text-sm text-muted-foreground">
              Dibuat{" "}
              {new Date(resume.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            disabled={downloadPdfMutation.isPending}
            onClick={() =>
              downloadPdfMutation.mutate({
                id: resume.id,
                title: resume.title,
              })
            }
          >
            {downloadPdfMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Download PDF
          </Button>
          <Button asChild className="gap-2">
            <Link to={`/dashboard/resumes/${resume.id}/edit`}>
              <Pencil className="size-4" />
              Edit Resume
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {content.personal_info.full_name}
          </CardTitle>
          <CardDescription>{resume.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Mail className="size-3.5" />
              {content.personal_info.email}
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="size-3.5" />
              {content.personal_info.phone}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {content.personal_info.location}
            </div>
            {content.personal_info.linkedin && (
              <div className="flex items-center gap-1.5">
                <Linkedin className="size-3.5" />
                {content.personal_info.linkedin}
              </div>
            )}
            {content.personal_info.portfolio && (
              <div className="flex items-center gap-1.5">
                <Globe className="size-3.5" />
                {content.personal_info.portfolio}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {content.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ringkasan Profesional</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {content.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {(content.experience?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="size-4" />
              Pengalaman Kerja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {content.experience.map((exp, i) => (
              <div key={i}>
                {i > 0 && <Separator className="mb-6" />}
                <div className="space-y-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-semibold">{exp.position}</h4>
                    <span className="text-xs text-muted-foreground">
                      {exp.start_date} — {exp.end_date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {(content.education?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="size-4" />
              Pendidikan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {content.education.map((edu, i) => (
              <div key={i}>
                {i > 0 && <Separator className="mb-6" />}
                <div className="space-y-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-semibold">{edu.institution}</h4>
                    <span className="text-xs text-muted-foreground">
                      {edu.start_date} — {edu.end_date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {edu.degree} — {edu.field}
                    {edu.gpa ? ` · IPK: ${edu.gpa}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {(content.skills?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {content.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(content.achievements?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="size-4" />
              Pencapaian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {content.achievements.map((ach, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {ach}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {(content.volunteer?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="size-4" />
              Volunteer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {content.volunteer.map((vol, i) => (
              <div key={i}>
                {i > 0 && <Separator className="mb-6" />}
                <div className="space-y-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-semibold">{vol.role}</h4>
                    <span className="text-xs text-muted-foreground">
                      {vol.start_date} — {vol.end_date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {vol.organization}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">
                    {vol.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {(content.languages?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="size-4" />
              Bahasa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {content.languages.map((lang) => (
                <div
                  key={lang.name}
                  className="flex items-center gap-2 rounded-md border px-3 py-2"
                >
                  <span className="text-sm font-medium">{lang.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {lang.proficiency}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {content.certifications && content.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="size-4" />
              Sertifikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.certifications.map((cert, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{cert.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {cert.issuer} · {cert.date}
                  </p>
                </div>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Lihat
                  </a>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {content.projects && content.projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FolderKanban className="size-4" />
              Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {content.projects.map((proj, i) => (
              <div key={i}>
                {i > 0 && <Separator className="mb-6" />}
                <div className="space-y-2">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="font-semibold">{proj.name}</h4>
                    {proj.start_date && (
                      <span className="text-xs text-muted-foreground">
                        {proj.start_date}
                        {proj.end_date ? ` — ${proj.end_date}` : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {proj.description}
                  </p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {proj.url && (
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs text-primary hover:underline"
                    >
                      {proj.url}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
