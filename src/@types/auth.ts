export type User = {
  id: string;
  google_id: string;
  email: string;
  name: string;
  avatar_url: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string;
};

export type JwtPayload = {
  user_id: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
};

export type AuthResponse = {
  token: string;
  user: User;
};

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

export type Subscription = {
  id: string;
  user_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  plan: Plan;
};

export type Usage = {
  id: string;
  user_id: string;
  feature: string;
  period_month: string;
  count: number;
  created_at: string;
};

export type UserProfile = {
  user: User;
  subscription: Subscription;
  usage: Usage[];
};

export type OtpResponse = {
  message: string;
  expires_in: number;
};
