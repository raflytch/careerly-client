import axiosInstance from "@/config/axios";
import type { ApiResponse } from "@/@types";
import type { AtsCheckCreateResponse } from "@/@types/ats";

export const analyzeAts = async (
  file: File,
): Promise<ApiResponse<AtsCheckCreateResponse>> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post("/ats-checks/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000,
  });
  return data;
};

export const deleteAtsCheck = async (
  id: string,
): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete(`/ats-checks/${id}`);
  return data;
};
