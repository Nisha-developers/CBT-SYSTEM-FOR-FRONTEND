import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { restoreSession } from '../utils/session';

// Wrap any route that needs a logged-in admin or student.
// allowedRoles e.g. ['admin', 'super_admin'] or ['student'].
export default function ProtectedRoute({ children, allowedRoles, studentAdmin = false}) {
  const { user, status } = useAuthStore();
  const loginPath = allowedRoles?.includes('student') ? '/student/login' : '/login';

  // First visit / page reload: try to restore the session from the refresh cookie.
  useEffect(() => {
    if (status === 'idle') restoreSession();
  }, [status]);

  if (status === 'idle' || status === 'checking') {
    return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Loading…</div>;
  }
  if (status !== 'authenticated' || !user) return <Navigate to={loginPath} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)  && studentAdmin) return <Navigate to={loginPath} replace />;
 
  return children;
}
