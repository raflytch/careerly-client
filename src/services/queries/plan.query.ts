import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axios";
import type { ApiResponse } from "@/@types";
import type {
  PlanListResponse,
  Transaction,
  TransactionListResponse,
} from "@/@types/plan";

export const planKeys = {
  all: ["plans"] as const,
};

export const transactionKeys = {
  all: ["transactions"] as const,
  detail: (id: string) => ["transaction", id] as const,
  status: (id: string) => ["transaction-status", id] as const,
};

const getPlans = async (): Promise<ApiResponse<PlanListResponse>> => {
  const { data } = await axiosInstance.get("/plans");
  return data;
};

const getTransactions = async (
  page = 1,
  limit = 10,
): Promise<ApiResponse<TransactionListResponse>> => {
  const { data } = await axiosInstance.get("/transactions", {
    params: { page, limit },
  });
  return data;
};

const getTransactionById = async (
  id: string,
): Promise<ApiResponse<Transaction>> => {
  const { data } = await axiosInstance.get(`/transactions/${id}`);
  return data;
};

const getTransactionStatus = async (
  id: string,
): Promise<ApiResponse<Transaction>> => {
  const { data } = await axiosInstance.get(`/transactions/${id}/status`);
  return data;
};

export const usePlans = () =>
  useQuery({
    queryKey: planKeys.all,
    queryFn: getPlans,
  });

export const useTransactions = (page = 1, limit = 50) =>
  useQuery({
    queryKey: transactionKeys.all,
    queryFn: () => getTransactions(page, limit),
  });

export const useTransactionById = (id?: string) =>
  useQuery({
    queryKey: transactionKeys.detail(id!),
    queryFn: () => getTransactionById(id!),
    enabled: !!id,
  });

export const useTransactionStatus = (id?: string) =>
  useQuery({
    queryKey: transactionKeys.status(id!),
    queryFn: () => getTransactionStatus(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      if (status === "success" || status === "failed" || status === "expired") {
        return false;
      }
      return 5000;
    },
  });
