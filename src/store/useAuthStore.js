import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Holds the logged-in user (admin, teacher, or student) and JWT.
// Persisted to localStorage so a refresh doesn't log the user out.
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null, // { id, fullName, role } — role is 'admin' | 'teacher' | 'student'

      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'cbt-auth' }
  )
);
