import { create } from 'zustand';
import { persist } from "zustand/middleware";

// School-setup wizard state (Steps 1-4) + the loaded school record
// once setup is complete.
export const useSchoolStore = create((set) => ({
  school: null,
  classes: [],
  arms: [],
  subjects: [],

  setSchool: (school) => set({ school }),

  // Wizard drafts, cleared once setupSchool() succeeds.
  wizard: {
    info: {},
    arms: [], // [{ className, armNames: [] }]
    classes: [],
    subjects: [],
  },
  setWizardStep: (key, value) =>
    set((state) => ({ wizard: { ...state.wizard, [key]: value } })),
  resetWizard: () => set({ wizard: { info: {}, arms: [], classes: [], subjects: [] } }),
}));
