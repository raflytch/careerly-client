import axiosInstance from "@/config/axios";
import type { OtpResponse } from "@/@types/auth";
import type { ApiResponse } from "@/@types";

export const logout = async (): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
};

export const requestRestoreOtp = async (
  email: string,
): Promise<ApiResponse<OtpResponse>> => {
  const { data } = await axiosInstance.post("/auth/restore/request-otp", {
    email,
  });
  return data;
};

export const resendRestoreOtp = async (
  email: string,
): Promise<ApiResponse<OtpResponse>> => {
  const { data } = await axiosInstance.post("/auth/restore/resend-otp", {
    email,
  });
  return data;
};

export const verifyRestoreOtp = async (
  email: string,
  otp: string,
): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.post("/auth/restore/verify-otp", {
    email,
    otp,
  });
  return data;
};
