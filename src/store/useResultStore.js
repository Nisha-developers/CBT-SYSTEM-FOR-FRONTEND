import { create } from 'zustand';

export const useResultStore = create((set) => ({
  results: [],
  pastResults: [],
  setResults: (results) => set({ results }),
  setPastResults: (pastResults) => set({ pastResults }),
}));
