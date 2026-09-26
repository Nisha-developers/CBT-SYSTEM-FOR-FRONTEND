import { create } from 'zustand';

// Currently-viewed student list + active class/arm filter,
// so "Students" section state survives navigating away and back.
export const useStudentStore = create((set) => ({
  students: [],
  filter: { classId: '', armId: '' },

  setStudents: (students) => set({ students }),
  setFilter: (filter) => set({ filter }),
}));
