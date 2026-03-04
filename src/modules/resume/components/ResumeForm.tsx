import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createResume,
  updateResume,
} from "@/services/mutations/resume.mutation";
import type {
  CreateResumePayload,
  Resume,
  Experience,
  Education,
  Volunteer,
  Language,
  Certification,
  Project,
} from "@/@types/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Plus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Heart,
  Globe,
  ShieldCheck,
  FolderKanban,
  X,
  ArrowLeft,
} from "lucide-react";

type ResumeFormProps = {
  resume?: Resume;
};

const EMPTY_EXPERIENCE: Experience = {
  company: "",
  position: "",
  start_date: "",
  end_date: "",
  description: "",
  location: "",
};

const EMPTY_EDUCATION: Education = {
  institution: "",
  degree: "",
  field: "",
  start_date: "",
  end_date: "",
  gpa: "",
};

const EMPTY_VOLUNTEER: Volunteer = {
  organization: "",
  role: "",
  start_date: "",
  end_date: "",
  description: "",
};

const EMPTY_LANGUAGE: Language = {
  name: "",
  proficiency: "",
};

const EMPTY_CERTIFICATION: Certification = {
  name: "",
  issuer: "",
  date: "",
  url: "",
};

const EMPTY_PROJECT: Project = {
  name: "",
  description: "",
  url: "",
  start_date: "",
  end_date: "",
  technologies: [],
};

export default function ResumeForm({ resume }: ResumeFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!resume;

  const [title, setTitle] = useState(resume?.title ?? "");
  const [fullName, setFullName] = useState(
    resume?.content.personal_info.full_name ?? "",
  );
  const [email, setEmail] = useState(resume?.content.personal_info.email ?? "");
  const [phone, setPhone] = useState(resume?.content.personal_info.phone ?? "");
  const [location, setLocation] = useState(
    resume?.content.personal_info.location ?? "",
  );
  const [linkedin, setLinkedin] = useState(
    resume?.content.personal_info.linkedin ?? "",
  );
  const [portfolio, setPortfolio] = useState(
    resume?.content.personal_info.portfolio ?? "",
  );
  const [summary, setSummary] = useState(resume?.content.summary ?? "");
  const [experiences, setExperiences] = useState<Experience[]>(
    resume?.content.experience ?? [{ ...EMPTY_EXPERIENCE }],
  );
  const [educations, setEducations] = useState<Education[]>(
    resume?.content.education ?? [{ ...EMPTY_EDUCATION }],
  );
  const [skills, setSkills] = useState<string[]>(resume?.content.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [achievements, setAchievements] = useState<string[]>(
    resume?.content.achievements ?? [],
  );
  const [achievementInput, setAchievementInput] = useState("");
  const [volunteers, setVolunteers] = useState<Volunteer[]>(
    resume?.content.volunteer ?? [],
  );
  const [languages, setLanguages] = useState<Language[]>(
    resume?.content.languages ?? [{ ...EMPTY_LANGUAGE }],
  );
  const [certifications, setCertifications] = useState<Certification[]>(
    resume?.content.certifications ?? [],
  );
  const [projects, setProjects] = useState<Project[]>(
    resume?.content.projects ?? [],
  );
  const [projectTechInput, setProjectTechInput] = useState<
    Record<number, string>
  >({});

  const mutation = useMutation({
    mutationFn: (payload: CreateResumePayload) =>
      isEdit ? updateResume(resume.id, payload) : createResume(payload),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["resume-quota"] });
      navigate("/dashboard/resumes", { replace: true });
    },
    onError: () => {
      toast.error(isEdit ? "Gagal mengupdate resume" : "Gagal membuat resume");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateResumePayload = {
      title,
      personal_info: {
        full_name: fullName,
        email,
        phone,
        location,
        linkedin,
        portfolio,
      },
      summary,
      experience: experiences.filter((ex) => ex.company && ex.position),
      education: educations.filter((ed) => ed.institution && ed.degree),
      skills,
      achievements,
      volunteer: volunteers.filter((v) => v.organization && v.role),
      languages: languages.filter((l) => l.name && l.proficiency),
      certifications:
        certifications.filter((c) => c.name && c.issuer).length > 0
          ? certifications.filter((c) => c.name && c.issuer)
          : undefined,
      projects:
        projects.filter((p) => p.name && p.description).length > 0
          ? projects.filter((p) => p.name && p.description)
          : undefined,
    };
    mutation.mutate(payload);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const addAchievement = () => {
    const trimmed = achievementInput.trim();
    if (trimmed) {
      setAchievements([...achievements, trimmed]);
      setAchievementInput("");
    }
  };

  const addProjectTech = (index: number) => {
    const trimmed = (projectTechInput[index] ?? "").trim();
    if (!trimmed) return;
    const updated = [...projects];
    const techs = updated[index].technologies ?? [];
    if (!techs.includes(trimmed)) {
      updated[index] = { ...updated[index], technologies: [...techs, trimmed] };
      setProjects(updated);
    }
    setProjectTechInput({ ...projectTechInput, [index]: "" });
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string,
  ) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string,
  ) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };

  const updateVolunteer = (
    index: number,
    field: keyof Volunteer,
    value: string,
  ) => {
    const updated = [...volunteers];
    updated[index] = { ...updated[index], [field]: value };
    setVolunteers(updated);
  };

  const updateLanguage = (
    index: number,
    field: keyof Language,
    value: string,
  ) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    setLanguages(updated);
  };

  const updateCertification = (
    index: number,
    field: keyof Certification,
    value: string,
  ) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string,
  ) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate("/dashboard/resumes")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">
              {isEdit ? "Edit Resume" : "Buat Resume"}
            </h2>
            <p className="text-muted-foreground">
              {isEdit
                ? "Perbarui informasi resume kamu"
                : "Isi informasi untuk membuat resume baru"}
            </p>
          </div>
        </div>
        <Button type="submit" disabled={mutation.isPending} className="gap-2">
          {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? "Simpan Perubahan" : "Buat Resume"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Briefcase className="size-4" />
            Judul Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Contoh: Software Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="size-4" />
            Informasi Pribadi
          </CardTitle>
          <CardDescription>Data kontak dan profil kamu</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Nama Lengkap</Label>
            <Input
              placeholder="Rafly Aziz Abdillah"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Telepon</Label>
            <Input
              placeholder="+62812345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Lokasi</Label>
            <Input
              placeholder="Jakarta, Indonesia"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn</Label>
            <Input
              placeholder="linkedin.com/in/username"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Portfolio</Label>
            <Input
              placeholder="portfolio.dev"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ringkasan Profesional</CardTitle>
          <CardDescription>
            Tuliskan ringkasan singkat tentang diri kamu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ceritakan pengalaman dan keahlian kamu..."
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="size-4" />
                Pengalaman Kerja
              </CardTitle>
              <CardDescription>Riwayat pekerjaan kamu</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() =>
                setExperiences([...experiences, { ...EMPTY_EXPERIENCE }])
              }
            >
              <Plus className="size-3.5" />
              Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {experiences.map((exp, i) => (
            <div key={i} className="space-y-4">
              {i > 0 && <Separator />}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Pengalaman #{i + 1}
                </span>
                {experiences.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() =>
                      setExperiences(experiences.filter((_, idx) => idx !== i))
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Perusahaan</Label>
                  <Input
                    placeholder="PT Tech Indonesia"
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(i, "company", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Posisi</Label>
                  <Input
                    placeholder="Backend Developer"
                    value={exp.position}
                    onChange={(e) =>
                      updateExperience(i, "position", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lokasi</Label>
                  <Input
                    placeholder="Jakarta"
                    value={exp.location ?? ""}
                    onChange={(e) =>
                      updateExperience(i, "location", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Mulai</Label>
                    <Input
                      placeholder="2022-01"
                      value={exp.start_date}
                      onChange={(e) =>
                        updateExperience(i, "start_date", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Selesai</Label>
                    <Input
                      placeholder="Present"
                      value={exp.end_date}
                      onChange={(e) =>
                        updateExperience(i, "end_date", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Deskripsi</Label>
                  <Textarea
                    placeholder="Jelaskan tugas dan pencapaian kamu..."
                    rows={3}
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(i, "description", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="size-4" />
                Pendidikan
              </CardTitle>
              <CardDescription>Riwayat pendidikan kamu</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() =>
                setEducations([...educations, { ...EMPTY_EDUCATION }])
              }
            >
              <Plus className="size-3.5" />
              Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {educations.map((edu, i) => (
            <div key={i} className="space-y-4">
              {i > 0 && <Separator />}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Pendidikan #{i + 1}
                </span>
                {educations.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() =>
                      setEducations(educations.filter((_, idx) => idx !== i))
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Institusi</Label>
                  <Input
                    placeholder="Universitas Indonesia"
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(i, "institution", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gelar</Label>
                  <Input
                    placeholder="S1"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(i, "degree", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jurusan</Label>
                  <Input
                    placeholder="Teknik Informatika"
                    value={edu.field}
                    onChange={(e) =>
                      updateEducation(i, "field", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>IPK</Label>
                  <Input
                    placeholder="3.75"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(i, "gpa", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Mulai</Label>
                    <Input
                      placeholder="2018"
                      value={edu.start_date}
                      onChange={(e) =>
                        updateEducation(i, "start_date", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Selesai</Label>
                    <Input
                      placeholder="2022"
                      value={edu.end_date}
                      onChange={(e) =>
                        updateEducation(i, "end_date", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skills</CardTitle>
          <CardDescription>Keahlian teknis dan non-teknis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Tambah skill (Contoh: Golang)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addSkill}>
              <Plus className="size-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="cursor-pointer gap-1 pr-1.5"
                onClick={() => setSkills(skills.filter((s) => s !== skill))}
              >
                {skill}
                <X className="size-3" />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="size-4" />
            Pencapaian
          </CardTitle>
          <CardDescription>Penghargaan dan prestasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Tambah pencapaian"
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAchievement();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addAchievement}>
              <Plus className="size-4" />
            </Button>
          </div>
          <ul className="space-y-2">
            {achievements.map((ach, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <span>{ach}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive"
                  onClick={() =>
                    setAchievements(achievements.filter((_, idx) => idx !== i))
                  }
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="size-4" />
                Volunteer
              </CardTitle>
              <CardDescription>Pengalaman sukarela</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() =>
                setVolunteers([...volunteers, { ...EMPTY_VOLUNTEER }])
              }
            >
              <Plus className="size-3.5" />
              Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {volunteers.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Belum ada volunteer. Klik tambah untuk menambahkan.
            </p>
          )}
          {volunteers.map((vol, i) => (
            <div key={i} className="space-y-4">
              {i > 0 && <Separator />}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Volunteer #{i + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive"
                  onClick={() =>
                    setVolunteers(volunteers.filter((_, idx) => idx !== i))
                  }
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Organisasi</Label>
                  <Input
                    placeholder="Komunitas IT Jakarta"
                    value={vol.organization}
                    onChange={(e) =>
                      updateVolunteer(i, "organization", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Peran</Label>
                  <Input
                    placeholder="Mentor"
                    value={vol.role}
                    onChange={(e) => updateVolunteer(i, "role", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Mulai</Label>
                    <Input
                      placeholder="2023-01"
                      value={vol.start_date}
                      onChange={(e) =>
                        updateVolunteer(i, "start_date", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Selesai</Label>
                    <Input
                      placeholder="Present"
                      value={vol.end_date}
                      onChange={(e) =>
                        updateVolunteer(i, "end_date", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Deskripsi</Label>
                  <Textarea
                    placeholder="Jelaskan kontribusi kamu..."
                    rows={2}
                    value={vol.description}
                    onChange={(e) =>
                      updateVolunteer(i, "description", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="size-4" />
                Bahasa
              </CardTitle>
              <CardDescription>Kemampuan bahasa kamu</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() =>
                setLanguages([...languages, { ...EMPTY_LANGUAGE }])
              }
            >
              <Plus className="size-3.5" />
              Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {languages.map((lang, i) => (
            <div key={i} className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <Label>Bahasa</Label>
                <Input
                  placeholder="Indonesian"
                  value={lang.name}
                  onChange={(e) => updateLanguage(i, "name", e.target.value)}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Tingkat</Label>
                <Input
                  placeholder="Native / Professional"
                  value={lang.proficiency}
                  onChange={(e) =>
                    updateLanguage(i, "proficiency", e.target.value)
                  }
                />
              </div>
              {languages.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="mb-0.5 text-destructive"
                  onClick={() =>
                    setLanguages(languages.filter((_, idx) => idx !== i))
                  }
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4" />
                Sertifikasi
              </CardTitle>
              <CardDescription>
                Sertifikat dan lisensi profesional
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() =>
                setCertifications([
                  ...certifications,
                  { ...EMPTY_CERTIFICATION },
                ])
              }
            >
              <Plus className="size-3.5" />
              Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {certifications.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Belum ada sertifikasi. Klik tambah untuk menambahkan.
            </p>
          )}
          {certifications.map((cert, i) => (
            <div key={i} className="space-y-4">
              {i > 0 && <Separator />}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Sertifikasi #{i + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive"
                  onClick={() =>
                    setCertifications(
                      certifications.filter((_, idx) => idx !== i),
                    )
                  }
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nama Sertifikat</Label>
                  <Input
                    placeholder="AWS Certified Solutions Architect"
                    value={cert.name}
                    onChange={(e) =>
                      updateCertification(i, "name", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Penerbit</Label>
                  <Input
                    placeholder="Amazon Web Services"
                    value={cert.issuer}
                    onChange={(e) =>
                      updateCertification(i, "issuer", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal</Label>
                  <Input
                    placeholder="2024-01"
                    value={cert.date}
                    onChange={(e) =>
                      updateCertification(i, "date", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL (opsional)</Label>
                  <Input
                    placeholder="https://credential.url"
                    value={cert.url ?? ""}
                    onChange={(e) =>
                      updateCertification(i, "url", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <FolderKanban className="size-4" />
                Project
              </CardTitle>
              <CardDescription>
                Proyek yang pernah kamu kerjakan
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setProjects([...projects, { ...EMPTY_PROJECT }])}
            >
              <Plus className="size-3.5" />
              Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {projects.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Belum ada project. Klik tambah untuk menambahkan.
            </p>
          )}
          {projects.map((proj, i) => (
            <div key={i} className="space-y-4">
              {i > 0 && <Separator />}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Project #{i + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive"
                  onClick={() =>
                    setProjects(projects.filter((_, idx) => idx !== i))
                  }
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nama Project</Label>
                  <Input
                    placeholder="Sistem E-Commerce"
                    value={proj.name}
                    onChange={(e) => updateProject(i, "name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL (opsional)</Label>
                  <Input
                    placeholder="https://github.com/user/project"
                    value={proj.url ?? ""}
                    onChange={(e) => updateProject(i, "url", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Mulai</Label>
                    <Input
                      placeholder="2023-01"
                      value={proj.start_date ?? ""}
                      onChange={(e) =>
                        updateProject(i, "start_date", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Selesai</Label>
                    <Input
                      placeholder="2023-06"
                      value={proj.end_date ?? ""}
                      onChange={(e) =>
                        updateProject(i, "end_date", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Deskripsi</Label>
                  <Textarea
                    placeholder="Jelaskan proyek yang kamu kerjakan..."
                    rows={2}
                    value={proj.description}
                    onChange={(e) =>
                      updateProject(i, "description", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Teknologi</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tambah teknologi"
                      value={projectTechInput[i] ?? ""}
                      onChange={(e) =>
                        setProjectTechInput({
                          ...projectTechInput,
                          [i]: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addProjectTech(i);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addProjectTech(i)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(proj.technologies ?? []).map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="cursor-pointer gap-1 pr-1.5"
                        onClick={() => {
                          const updated = [...projects];
                          updated[i] = {
                            ...updated[i],
                            technologies: updated[i].technologies?.filter(
                              (t) => t !== tech,
                            ),
                          };
                          setProjects(updated);
                        }}
                      >
                        {tech}
                        <X className="size-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pb-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/dashboard/resumes")}
        >
          Batal
        </Button>
        <Button type="submit" disabled={mutation.isPending} className="gap-2">
          {mutation.isPending && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? "Simpan Perubahan" : "Buat Resume"}
        </Button>
      </div>
    </form>
  );
}
