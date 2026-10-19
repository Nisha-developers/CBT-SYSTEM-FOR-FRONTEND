import { create } from 'zustand';

// Session state lives in MEMORY ONLY — nothing is written to localStorage / sessionStorage.
//   accessToken : short-lived token (lost on reload; renewed from the httpOnly refresh cookie)
//   user        : the logged-in profile  { id, role, fullName, ... }
//   status      : 'idle' (not checked yet) | 'checking' | 'authenticated' | 'anonymous'
export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,
  status: 'idle',

  setStatus: (status) => set({ status }),
  setSession: (accessToken, user) => set({ accessToken, user, status: 'authenticated' }),
  // keep the original name used by the login pages
  login: (accessToken, user) => set({ accessToken, user, status: 'authenticated' }),
  clearSession: () => set({ accessToken: null, user: null, status: 'anonymous' }),
}));
