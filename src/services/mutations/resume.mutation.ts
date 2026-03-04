import axiosInstance from "@/config/axios";
import type { ApiResponse } from "@/@types";
import type { Resume, CreateResumePayload } from "@/@types/resume";

export const createResume = async (
  payload: CreateResumePayload,
): Promise<ApiResponse<Resume>> => {
  const { data } = await axiosInstance.post("/resumes", payload);
  return data;
};

export const updateResume = async (
  id: string,
  payload: CreateResumePayload,
): Promise<ApiResponse<Resume>> => {
  const { data } = await axiosInstance.put(`/resumes/${id}`, payload);
  return data;
};

export const deleteResume = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete(`/resumes/${id}`);
  return data;
};
