import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-1">Welcome, {user?.fullName}</h1>
      <p className="text-gray-500 mb-6">What would you like to do?</p>
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <Link to="/student/exams" className="bg-white p-5 rounded-lg shadow hover:shadow-md text-center">
          Available Exams
        </Link>
        <Link to="/student/results" className="bg-white p-5 rounded-lg shadow hover:shadow-md text-center">
          My Results
        </Link>
      </div>
    </div>
  );
}
