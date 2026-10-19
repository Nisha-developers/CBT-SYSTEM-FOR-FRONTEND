import { Navigate } from 'react-router-dom';

// Subjects are managed inside School Settings → Subjects.
export default function SubjectSettings() {
  return <Navigate to="/dashboard/settings/school" replace />;
}
