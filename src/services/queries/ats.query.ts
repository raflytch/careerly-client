import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axios";
import type { ApiResponse } from "@/@types";
import type { AtsCheck, AtsCheckListResponse } from "@/@types/ats";

export const atsKeys = {
  all: ["ats-checks"] as const,
  detail: (id: string) => ["ats-check", id] as const,
};

const getAtsChecks = async (
  page = 1,
  limit = 10,
): Promise<ApiResponse<AtsCheckListResponse>> => {
  const { data } = await axiosInstance.get("/ats-checks", {
    params: { page, limit },
  });
  return data;
};

const getAtsCheckById = async (id: string): Promise<ApiResponse<AtsCheck>> => {
  const { data } = await axiosInstance.get(`/ats-checks/${id}`);
  return data;
};

export const useAtsChecks = (page = 1, limit = 50) =>
  useQuery({
    queryKey: atsKeys.all,
    queryFn: () => getAtsChecks(page, limit),
  });

export const useAtsCheckById = (id?: string) =>
  useQuery({
    queryKey: atsKeys.detail(id!),
    queryFn: () => getAtsCheckById(id!),
    enabled: !!id,
  });
