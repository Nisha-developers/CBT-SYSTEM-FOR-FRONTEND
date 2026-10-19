import { create } from 'zustand';

// Admin exam-builder state + the student's in-progress attempt.
export const useExamStore = create((set) => ({
  exams: [],
  currentExam: null,
  setExams: (exams) => set({ exams }),
  setCurrentExam: (exam) => set({ currentExam: exam }),

  // Student taking an exam right now.
  activeAttempt: null,
  answers: {},
  setActiveAttempt: (attempt) => set({ activeAttempt: attempt, answers: attempt?.answers || {} }),
  setAnswer: (questionId, answer) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
  clearAttempt: () => set({ activeAttempt: null, answers: {} }),
}));
