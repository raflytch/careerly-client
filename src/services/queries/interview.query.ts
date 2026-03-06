import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axios";
import type { ApiResponse } from "@/@types";
import type { Interview, InterviewListResponse } from "@/@types/interview";

export const interviewKeys = {
  all: ["interviews"] as const,
  detail: (id: string) => ["interview", id] as const,
};

const getInterviews = async (
  page = 1,
  limit = 10,
): Promise<ApiResponse<InterviewListResponse>> => {
  const { data } = await axiosInstance.get("/interviews", {
    params: { page, limit },
  });
  return data;
};

const getInterviewById = async (
  id: string,
): Promise<ApiResponse<Interview>> => {
  const { data } = await axiosInstance.get(`/interviews/${id}`);
  return data;
};

export const useInterviews = (page = 1, limit = 50) =>
  useQuery({
    queryKey: interviewKeys.all,
    queryFn: () => getInterviews(page, limit),
  });

export const useInterviewById = (id?: string) =>
  useQuery({
    queryKey: interviewKeys.detail(id!),
    queryFn: () => getInterviewById(id!),
    enabled: !!id,
  });
