export type QuestionType = "essay" | "multiple_choice";

export type InterviewStatus = "in_progress" | "completed";

export type QuestionOption = {
  label: string;
  text: string;
};

export type InterviewQuestion = {
  id: number;
  type: QuestionType;
  question: string;
  options?: QuestionOption[];
  user_answer?: string;
  is_correct?: boolean;
  score?: number;
  feedback?: string;
};

export type Interview = {
  id: string;
  user_id: string;
  job_position: string;
  questions: InterviewQuestion[];
  status: InterviewStatus;
  overall_score?: number;
  created_at: string;
  completed_at?: string;
};

export type CreateInterviewPayload = {
  job_position: string;
  question_type: QuestionType;
  question_count: number;
};

export type SubmitAnswerItem = {
  question_id: number;
  answer: string;
};

export type SubmitAnswersPayload = {
  answers: SubmitAnswerItem[];
};

export type CreateInterviewResponse = {
  interview: Interview;
  ai_generation_status: string;
};

export type SubmitAnswersResponse = {
  interview: Interview;
  ai_evaluation_status: string;
};

export type InterviewListResponse = {
  interviews: Interview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};
