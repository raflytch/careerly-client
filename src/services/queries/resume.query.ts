import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/config/axios";
import type { ApiResponse } from "@/@types";
import type { Resume, ResumeListResponse, ResumeQuota } from "@/@types/resume";

export const resumeKeys = {
  all: ["resumes"] as const,
  detail: (id: string) => ["resume", id] as const,
  quota: ["resume-quota"] as const,
};

const getResumes = async (
  page = 1,
  limit = 10,
): Promise<ApiResponse<ResumeListResponse>> => {
  const { data } = await axiosInstance.get("/resumes", {
    params: { page, limit },
  });
  return data;
};

const getResumeById = async (id: string): Promise<ApiResponse<Resume>> => {
  const { data } = await axiosInstance.get(`/resumes/${id}`);
  return data;
};

const getResumeQuota = async (): Promise<ApiResponse<ResumeQuota>> => {
  const { data } = await axiosInstance.get("/resumes/quota");
  return data;
};

const downloadResumePdf = async (id: string): Promise<Blob> => {
  const { data } = await axiosInstance.get(`/resumes/${id}/pdf`, {
    responseType: "blob",
  });
  return data;
};

export const useResumes = (page = 1, limit = 50) =>
  useQuery({
    queryKey: resumeKeys.all,
    queryFn: () => getResumes(page, limit),
  });

export const useResumeById = (id?: string) =>
  useQuery({
    queryKey: resumeKeys.detail(id!),
    queryFn: () => getResumeById(id!),
    enabled: !!id,
  });

export const useResumeQuota = () =>
  useQuery({
    queryKey: resumeKeys.quota,
    queryFn: getResumeQuota,
  });

export const useDownloadResumePdf = () =>
  useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      downloadResumePdf(id).then((blob) => ({ blob, title })),
    onSuccess: ({ blob, title }) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },
    onError: () => {
      toast.error("Gagal mengunduh resume PDF");
    },
  });
