import { create } from 'zustand';

export const useExamModeStore = create((set) => ({
  mode: null,
  loaded: false,

  // Temporary tokens for the current exam flow.
  examAccessToken: null,
  candidateAccessToken: null,

  setMode: (mode) => set({ mode, loaded: true }),

  // Called after the operator successfully opens an exam.
  setExamSession: (examAccessToken, mode) =>
    set({
      examAccessToken,
      candidateAccessToken: null,
      mode,
      loaded: true,
    }),

  // Called after the backend successfully starts a student's attempt.
  setCandidateAccessToken: (candidateAccessToken) =>
    set({ candidateAccessToken }),

  clearCandidateAccessToken: () =>
    set({ candidateAccessToken: null }),

  clear: () =>
    set({
      mode: null,
      loaded: false,
      examAccessToken: null,
      candidateAccessToken: null,
    }),
}));