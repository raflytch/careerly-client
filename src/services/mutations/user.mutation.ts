import axiosInstance from "@/config/axios";
import type { OtpResponse } from "@/@types/auth";
import type { ApiResponse } from "@/@types";

export const updateProfile = async (
  payload: FormData,
): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.put("/users/profile", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const requestDeleteOtp = async (): Promise<ApiResponse<OtpResponse>> => {
  const { data } = await axiosInstance.post("/users/delete/request-otp");
  return data;
};

export const resendDeleteOtp = async (): Promise<ApiResponse<OtpResponse>> => {
  const { data } = await axiosInstance.post("/users/delete/resend-otp");
  return data;
};

export const verifyDeleteOtp = async (
  otp: string,
): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.post("/users/delete/verify-otp", {
    otp,
  });
  return data;
};
