import axiosInstance from "@/config/axios";
import type { UserProfile } from "@/@types/auth";
import type { ApiResponse } from "@/@types";

export const getUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
  const { data } = await axiosInstance.get("/users/profile");
  return data;
};
