export type PersonalInfo = {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
};

export type Experience = {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
  location?: string;
};

export type Education = {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  gpa: string;
};

export type Volunteer = {
  organization: string;
  role: string;
  start_date: string;
  end_date: string;
  description: string;
};

export type Language = {
  name: string;
  proficiency: string;
};

export type Certification = {
  name: string;
  issuer: string;
  date: string;
  url?: string;
};

export type Project = {
  name: string;
  description: string;
  url?: string;
  start_date?: string;
  end_date?: string;
  technologies?: string[];
};

export type ResumeContent = {
  personal_info: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  achievements: string[];
  volunteer: Volunteer[];
  languages: Language[];
  certifications?: Certification[];
  projects?: Project[];
};

export type Resume = {
  id: string;
  user_id: string;
  title: string;
  content: ResumeContent;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateResumePayload = {
  title: string;
  personal_info: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  achievements: string[];
  volunteer: Volunteer[];
  languages: Language[];
  certifications?: Certification[];
  projects?: Project[];
};

export type ResumeListResponse = {
  resumes: Resume[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};

export type ResumeQuota = {
  plan_name: string;
  max_resumes: number;
  max_ats_checks: number;
  max_interviews: number;
  used_resumes: number;
  used_ats_checks: number;
  used_interviews: number;
};
