export type AtsSection = {
  name: string;
  score: number;
  max_score: number;
  feedback: string;
};

export type KeywordAnalysis = {
  found: string[];
  missing: string[];
  tip: string;
};

export type Improvement = {
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  issue: string;
  suggestion: string;
};

export type AtsAnalysis = {
  overall_score: number;
  verdict: string;
  sections: AtsSection[];
  keyword_analysis: KeywordAnalysis;
  improvements: Improvement[];
  deal_breakers: string[];
};

export type AtsCheck = {
  id: string;
  user_id: string;
  score: number;
  analysis: AtsAnalysis;
  created_at: string;
};

export type AtsCheckCreateResponse = {
  ats_check: AtsCheck;
  ai_analysis_status: string;
};

export type AtsCheckListResponse = {
  ats_checks: AtsCheck[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};
