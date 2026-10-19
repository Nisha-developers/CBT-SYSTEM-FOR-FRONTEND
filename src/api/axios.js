import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const baseURL = import.meta.env.VITE_API_BASE_URL;

// withCredentials lets the browser send the httpOnly refresh cookie to the API.
export const bareApi = axios.create({ baseURL, withCredentials: true });   // no interceptors: used for refresh/logout
const api = axios.create({ baseURL, withCredentials: true });

// ---- attach the in-memory access token ----
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- silent renewal ----
// One refresh at a time (shared by every request that fails together), and serialised across
// browser tabs with the Web Locks API so two tabs never rotate the same cookie at once.
let refreshing = null;

const withTabLock = (fn) => (navigator.locks ? navigator.locks.request('cbt-token-refresh', fn) : fn());

export function renewAccessToken() {
  if (!refreshing) {
    refreshing = withTabLock(async () => {
      const { data } = await bareApi.post('/auth/refresh');
      useAuthStore.getState().setSession(data.accessToken, data.user);
      return data.accessToken;
    }).finally(() => { refreshing = null; });
  }
  return refreshing;
}

const isAuthCall = (url = '') => /\/auth\/(admin\/login|admin\/signup|student\/login|refresh|logout)/.test(url);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || !original || original._retried || isAuthCall(original.url)) {
      return Promise.reject(error);
    }
    original._retried = true;

    // This request went out with a token that has since been replaced (another request already
    // refreshed): just replay it with the current token — no second refresh needed.
    const current = useAuthStore.getState().accessToken;
    if (current && original.headers.Authorization !== `Bearer ${current}`) {
      original.headers.Authorization = `Bearer ${current}`;
      return api(original);
    }

    try {
      const token = await renewAccessToken();
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);                      // replay the request that just failed
    } catch (refreshError) {
      useAuthStore.getState().clearSession();    // refresh token gone/expired → back to the login page
      return Promise.reject(error);
    }
  }
);

// Friendly message from any failed request.
export const apiError = (err, fallback = 'Something went wrong. Please try again.') =>
  err?.response?.data?.message
  || (err?.request && !err.response ? 'Cannot reach the server. Check your connection.' : fallback);

export default api;
