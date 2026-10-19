import { refreshSession, logoutRequest } from '../api/auth.api';
import { useAuthStore } from '../store/useAuthStore';
import { useExamStore } from '../store/useExamStore';

// After a page reload the access token is gone (memory only). The httpOnly refresh cookie,
// which JavaScript can't read, gets us a new one. Runs once, no matter how many callers ask.
let restoring = null;

export function restoreSession() {
  if (!restoring) {
    useAuthStore.getState().setStatus('checking');
    restoring = refreshSession()
      .then(({ data }) => useAuthStore.getState().setSession(data.accessToken, data.user))
      .catch(() => useAuthStore.getState().clearSession())
      .finally(() => { restoring = null; });
  }
  return restoring;
}

// Log out: revoke the session on the server (and clear the cookie), then wipe everything in memory.
export async function signOut() {
  try { await logoutRequest(); } catch { /* offline: the cookie will expire on its own */ }
  useExamStore.getState().clearAttempt();
  useAuthStore.getState().clearSession();
}
