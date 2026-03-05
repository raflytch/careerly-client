import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import axiosInstance from "@/config/axios";
import { useAuthStore } from "@/stores/auth.store";
import type { OtpResponse } from "@/@types/auth";
import type { ApiResponse } from "@/@types";
import { authKeys } from "@/services/queries/auth.query";

const updateProfile = async (payload: FormData): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.put("/users/profile", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const requestDeleteOtp = async (): Promise<ApiResponse<OtpResponse>> => {
  const { data } = await axiosInstance.post("/users/delete/request-otp");
  return data;
};

const resendDeleteOtp = async (): Promise<ApiResponse<OtpResponse>> => {
  const { data } = await axiosInstance.post("/users/delete/resend-otp");
  return data;
};

const verifyDeleteOtp = async (otp: string): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.post("/users/delete/verify-otp", {
    otp,
  });
  return data;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: authKeys.profile });
    },
    onError: () => {
      toast.error("Gagal mengupdate profile");
    },
  });
};

export const useRequestDeleteOtp = (onSuccess?: () => void) =>
  useMutation({
    mutationFn: requestDeleteOtp,
    onSuccess: (response) => {
      toast.success(response.message);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Gagal mengirim OTP");
    },
  });

export const useResendDeleteOtp = () =>
  useMutation({
    mutationFn: resendDeleteOtp,
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: () => {
      toast.error("Gagal mengirim ulang OTP");
    },
  });

export const useVerifyDeleteOtp = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: verifyDeleteOtp,
    onSuccess: (response) => {
      toast.success(response.message);
      logoutStore();
      navigate("/login", { replace: true });
    },
    onError: () => {
      toast.error("OTP tidak valid");
    },
  });
};
