# CBT Frontend

React + Vite + Tailwind + Zustand. Talks to the CBT backend API.

1. `npm install`
2. Copy `.env.example` → `.env` (`VITE_API_BASE_URL`, e.g. `http://localhost:5000/api`)
3. `npm run dev`

The backend's `CLIENT_ORIGIN` must include this app's URL (default `http://localhost:5173`).

## Sessions
- **Nothing about the user is stored in the browser** — no localStorage, no sessionStorage. The user profile and the short-lived access token live in memory (`store/useAuthStore.js`).
- The refresh token is an httpOnly cookie that JavaScript can't read. When the access token expires, `api/axios.js` calls `POST /auth/refresh` once (shared by all failing requests and serialised across tabs), then replays the failed request — the user never notices.
- After a page reload, `ProtectedRoute` restores the session from the cookie (`utils/session.js`). If that fails, the user is sent to the login page.
- `signOut()` revokes the session on the server, clears the cookie and wipes the in-memory state.

First run: **Get Started** → school setup wizard → create the admin account → dashboard.
Students log in at `/student/login` with their Student ID (first password = last name).
