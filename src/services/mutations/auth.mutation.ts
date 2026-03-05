import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/config/axios";
import type { OtpResponse } from "@/@types/auth";
import type { ApiResponse } from "@/@types";

const logout = async (): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
};

const requestRestoreOtp = async (
  email: string,
): Promise<ApiResponse<OtpResponse>> => {
  const { data } = await axiosInstance.post("/auth/restore/request-otp", {
    email,
  });
  return data;
};

const resendRestoreOtp = async (
  email: string,
): Promise<ApiResponse<OtpResponse>> => {
  const { data } = await axiosInstance.post("/auth/restore/resend-otp", {
    email,
  });
  return data;
};

const verifyRestoreOtp = async (
  email: string,
  otp: string,
): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.post("/auth/restore/verify-otp", {
    email,
    otp,
  });
  return data;
};

export const useLogout = () =>
  useMutation({
    mutationFn: logout,
  });

export const useRequestRestoreOtp = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: requestRestoreOtp,
    onSuccess: (response) => {
      toast.success(response.message);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Gagal mengirim OTP");
    },
  });

export const useResendRestoreOtp = () =>
  useMutation({
    mutationFn: resendRestoreOtp,
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: () => {
      toast.error("Gagal mengirim ulang OTP");
    },
  });

export const useVerifyRestoreOtp = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyRestoreOtp(email, otp),
    onSuccess: (response) => {
      toast.success(response.message);
      onSuccess?.();
    },
    onError: () => {
      toast.error("OTP tidak valid");
    },
  });
