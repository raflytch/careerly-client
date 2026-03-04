import axiosInstance from "@/config/axios";
import type { ApiResponse } from "@/@types";
import type { Resume, ResumeListResponse, ResumeQuota } from "@/@types/resume";

export const getResumes = async (
  page = 1,
  limit = 10,
): Promise<ApiResponse<ResumeListResponse>> => {
  const { data } = await axiosInstance.get("/resumes", {
    params: { page, limit },
  });
  return data;
};

export const getResumeById = async (
  id: string,
): Promise<ApiResponse<Resume>> => {
  const { data } = await axiosInstance.get(`/resumes/${id}`);
  return data;
};

export const getResumeQuota = async (): Promise<ApiResponse<ResumeQuota>> => {
  const { data } = await axiosInstance.get("/resumes/quota");
  return data;
};
