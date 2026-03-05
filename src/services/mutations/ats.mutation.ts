import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/config/axios";
import type { ApiResponse } from "@/@types";
import type { AtsCheckCreateResponse } from "@/@types/ats";
import { atsKeys } from "@/services/queries/ats.query";
import { resumeKeys } from "@/services/queries/resume.query";

const analyzeAts = async (
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

const deleteAtsCheck = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete(`/ats-checks/${id}`);
  return data;
};

export const useAnalyzeAts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: analyzeAts,
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: atsKeys.all });
      queryClient.invalidateQueries({ queryKey: resumeKeys.quota });
    },
    onError: () => {
      toast.error("Gagal menganalisis CV");
    },
  });
};

export const useDeleteAtsCheck = (onSettled?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAtsCheck,
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: atsKeys.all });
      queryClient.invalidateQueries({ queryKey: resumeKeys.quota });
      onSettled?.();
    },
    onError: () => {
      toast.error("Gagal menghapus analisis");
    },
  });
};
