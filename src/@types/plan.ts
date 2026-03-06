export type Plan = {
  id: string;
  name: string;
  display_name: string;
  price: string;
  duration_days: number;
  max_resumes: number;
  max_ats_checks: number;
  max_interviews: number;
  is_active: boolean;
  created_at: string;
};

export type PlanListResponse = {
  plans: Plan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};

export type Transaction = {
  id: string;
  user_id: string;
  plan_id: string;
  subscription_id?: string;
  order_id: string;
  transaction_id?: string;
  gross_amount: string;
  payment_type?: string;
  status: "pending" | "success" | "failed" | "expired";
  transaction_status?: string;
  fraud_status?: string;
  snap_token?: string;
  redirect_url?: string;
  midtrans_response?: Record<string, unknown>;
  paid_at?: string;
  expired_at?: string;
  created_at: string;
  updated_at: string;
};

export type CreateTransactionPayload = {
  plan_id: string;
};

export type CreateTransactionResponse = {
  transaction: Transaction & { plan: Plan };
  snap_token: string;
  redirect_url: string;
};

export type TransactionListResponse = {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};
