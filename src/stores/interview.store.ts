import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type InterviewFormState = {
  interviewId: string | null;
  answers: Record<number, string>;
  currentQuestion: number;
};

type InterviewFormActions = {
  init: (interviewId: string) => void;
  setAnswer: (questionId: number, answer: string) => void;
  setCurrentQuestion: (index: number) => void;
  reset: () => void;
};

type InterviewFormStore = InterviewFormState & InterviewFormActions;

const initialState: InterviewFormState = {
  interviewId: null,
  answers: {},
  currentQuestion: 0,
};

export const useInterviewFormStore = create<InterviewFormStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      init: (interviewId) => {
        if (get().interviewId !== interviewId) {
          set({ ...initialState, interviewId });
        }
      },

      setAnswer: (questionId, answer) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer },
        })),

      setCurrentQuestion: (index) => set({ currentQuestion: index }),

      reset: () => set(initialState),
    }),
    {
      name: "interview-form",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
