import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axios";
import type { UserProfile } from "@/@types/auth";
import type { ApiResponse } from "@/@types";

export const authKeys = {
  profile: ["user-profile"] as const,
};

export const getUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
  const { data } = await axiosInstance.get("/users/profile");
  return data;
};

export const useUserProfile = () =>
  useQuery({
    queryKey: authKeys.profile,
    queryFn: getUserProfile,
  });
