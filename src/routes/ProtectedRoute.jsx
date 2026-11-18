import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useExamModeStore } from '../store/useExamModeStore';
import { restoreSession } from '../utils/session';
import { loadExamMode, lockedRedirect } from '../utils/examMode';

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Loading…</div>
);

// Wrap any route that needs a logged-in admin or student.
// allowedRoles e.g. ['admin', 'super_admin'] or ['student'].
export default function ProtectedRoute({ children, allowedRoles, StudentStrict}) {
  const navigate = useNavigate();
  const { user, status } = useAuthStore();
  const { mode, loaded } = useExamModeStore();
  const { pathname } = useLocation();
  const loginPath = allowedRoles?.includes('student') ? '/student/login' : `${allowedRoles.includes('exam')? 'Admin/exams/Login':'/login'}`;
  const isStudent = user?.role === 'student';
  const studentMode = localStorage.getItem('InExam');
  // First visit / page reload: try to restore the session from the refresh cookie.
  useEffect(() => {
    if (status === 'idle') restoreSession();
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated' && isStudent && !loaded) loadExamMode();
  }, [status, isStudent, loaded]);

  if (status === 'idle' || status === 'checking') return <Loading />;
  if (status !== 'authenticated' || !user) return <Navigate to={loginPath} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={loginPath} replace />;
  if(studentMode && StudentStrict){
   navigate('/Admin/exams/Login');
  localStorage.removeItem('InExam');
  return;
  }

  if (isStudent) {
    if (!loaded) return <Loading />;
    const target = lockedRedirect(mode, pathname);
    if (target) return <Navigate to={target} replace />;
  }
  return children;
}