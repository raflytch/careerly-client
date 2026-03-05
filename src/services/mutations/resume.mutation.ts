import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import axiosInstance from "@/config/axios";
import type { ApiResponse } from "@/@types";
import type { Resume, CreateResumePayload } from "@/@types/resume";
import { resumeKeys } from "@/services/queries/resume.query";

const createResume = async (
  payload: CreateResumePayload,
): Promise<ApiResponse<Resume>> => {
  const { data } = await axiosInstance.post("/resumes", payload);
  return data;
};

const updateResume = async (
  id: string,
  payload: CreateResumePayload,
): Promise<ApiResponse<Resume>> => {
  const { data } = await axiosInstance.put(`/resumes/${id}`, payload);
  return data;
};

const deleteResume = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete(`/resumes/${id}`);
  return data;
};

export const useCreateResume = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createResume,
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: resumeKeys.all });
      queryClient.invalidateQueries({ queryKey: resumeKeys.quota });
      navigate("/dashboard/resumes", { replace: true });
    },
    onError: () => {
      toast.error("Gagal membuat resume");
    },
  });
};

export const useUpdateResume = (id: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateResumePayload) => updateResume(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: resumeKeys.all });
      queryClient.invalidateQueries({ queryKey: resumeKeys.quota });
      navigate("/dashboard/resumes", { replace: true });
    },
    onError: () => {
      toast.error("Gagal mengupdate resume");
    },
  });
};

export const useDeleteResume = (onSettled?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResume,
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: resumeKeys.all });
      queryClient.invalidateQueries({ queryKey: resumeKeys.quota });
      onSettled?.();
    },
    onError: () => {
      toast.error("Gagal menghapus resume");
    },
  });
};
