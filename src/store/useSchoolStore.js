import { create } from 'zustand';
import { getSchool } from '../api/school.api';

// School-setup wizard state (Steps 1-4) + the loaded school record.
export const useSchoolStore = create((set) => ({
  school: null,
  classes: [],
  arms: [],
  classArms: [],
  subjects: [],
  optionalSubjects: [],
  term: null,
  loaded: false,

  setSchool: (school) => set({ school }),

  // Load (or refresh) school data from the API — every page that needs
  // class / arm / subject lists calls this.
  loadSchool: async () => {
    const { data } = await getSchool();
    const d = data.data;
    set({
      school: d.school, classes: d.classes, arms: d.arms, classArms: d.classArms,
      subjects: d.subjects, optionalSubjects: d.optionalSubjects, term: d.term, loaded: true,
    });
    return d;
  },

  // Wizard drafts, cleared once setupSchool() succeeds.
  wizard: {
    info: {},
    arms: [], // [{ className, armNames: [] }]
    classes: [],
    subjects: [],
    optionalSubject: [],
  },
  setWizardStep: (key, value) =>
    set((state) => ({ wizard: { ...state.wizard, [key]: value } })),
  resetWizard: () => set({ wizard: { info: {}, arms: [], classes: [], subjects: [], optionalSubject: [] } }),
}));
