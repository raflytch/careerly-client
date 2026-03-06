import { create } from "zustand";

type InterviewFormState = {
  answers: Record<number, string>;
  currentQuestion: number;
};

type InterviewFormActions = {
  setAnswer: (questionId: number, answer: string) => void;
  setCurrentQuestion: (index: number) => void;
  reset: () => void;
};

type InterviewFormStore = InterviewFormState & InterviewFormActions;

const initialState: InterviewFormState = {
  answers: {},
  currentQuestion: 0,
};

export const useInterviewFormStore = create<InterviewFormStore>()((set) => ({
  ...initialState,

  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),

  setCurrentQuestion: (index) => set({ currentQuestion: index }),

  reset: () => set(initialState),
}));
