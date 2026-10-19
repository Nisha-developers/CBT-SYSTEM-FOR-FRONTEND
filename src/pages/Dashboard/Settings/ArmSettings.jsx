import { Navigate } from 'react-router-dom';

// Arms are managed inside School Settings → Arms.
export default function ArmSettings() {
  return <Navigate to="/dashboard/settings/school" replace />;
}
