import axiosInstance from "@/config/axios";
import type { ApiResponse } from "@/@types";
import type {
  AtsCheck,
  AtsCheckListResponse,
  AtsCheckCreateResponse,
} from "@/@types/ats";

export const getAtsChecks = async (
  page = 1,
  limit = 10,
): Promise<ApiResponse<AtsCheckListResponse>> => {
  const { data } = await axiosInstance.get("/ats-checks", {
    params: { page, limit },
  });
  return data;
};

export const getAtsCheckById = async (
  id: string,
): Promise<ApiResponse<AtsCheck>> => {
  const { data } = await axiosInstance.get(`/ats-checks/${id}`);
  return data;
};
