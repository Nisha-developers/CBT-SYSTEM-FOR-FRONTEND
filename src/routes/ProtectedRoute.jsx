import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// Wrap any route that needs a logged-in admin/teacher or student.
// allowedRoles e.g. ['admin', 'teacher'] or ['student'].
export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
