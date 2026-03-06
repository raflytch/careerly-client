import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import axiosInstance from "@/config/axios";
import type { ApiResponse } from "@/@types";
import type {
  CreateInterviewPayload,
  CreateInterviewResponse,
  SubmitAnswersPayload,
  SubmitAnswersResponse,
} from "@/@types/interview";
import { interviewKeys } from "@/services/queries/interview.query";

const createInterview = async (
  payload: CreateInterviewPayload,
): Promise<ApiResponse<CreateInterviewResponse>> => {
  const { data } = await axiosInstance.post("/interviews", payload, {
    timeout: 120000,
  });
  return data;
};

const submitAnswers = async (
  id: string,
  payload: SubmitAnswersPayload,
): Promise<ApiResponse<SubmitAnswersResponse>> => {
  const { data } = await axiosInstance.post(
    `/interviews/${id}/submit`,
    payload,
    { timeout: 120000 },
  );
  return data;
};

const deleteInterview = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete(`/interviews/${id}`);
  return data;
};

export const useCreateInterview = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createInterview,
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: interviewKeys.all });
      navigate(`/dashboard/interviews/${response.data.interview.id}`);
    },
    onError: () => {
      toast.error("Gagal membuat interview");
    },
  });
};

export const useSubmitAnswers = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitAnswersPayload) => submitAnswers(id, payload),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: interviewKeys.all });
      queryClient.invalidateQueries({ queryKey: interviewKeys.detail(id) });
    },
    onError: () => {
      toast.error("Gagal mengirim jawaban");
    },
  });
};

export const useDeleteInterview = (onSettled?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInterview,
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: interviewKeys.all });
      onSettled?.();
    },
    onError: () => {
      toast.error("Gagal menghapus interview");
    },
  });
};
