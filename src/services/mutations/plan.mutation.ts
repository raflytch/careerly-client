import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/config/axios";
import type { ApiResponse } from "@/@types";
import type {
  CreateTransactionPayload,
  CreateTransactionResponse,
} from "@/@types/plan";

const createTransaction = async (
  payload: CreateTransactionPayload,
): Promise<ApiResponse<CreateTransactionResponse>> => {
  const { data } = await axiosInstance.post("/transactions", payload);
  return data;
};

export const useCreateTransaction = () => {
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: (response) => {
      const { redirect_url, transaction } = response.data;
      if (redirect_url) {
        localStorage.setItem("pending_transaction_id", transaction.id);
        window.location.href = redirect_url;
      }
    },
    onError: () => {
      toast.error("Gagal membuat transaksi");
    },
  });
};
