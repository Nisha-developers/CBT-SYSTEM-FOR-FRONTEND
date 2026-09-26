import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <header className="flex items-center justify-between bg-white border-b px-6 py-3">
      <div className="text-sm text-gray-500">Welcome, {user?.fullName || 'Admin'}</div>
      <button
        onClick={() => {
          logout();
          navigate('/login');
        }}
        className="text-sm text-red-600 hover:underline"
      >
        Logout
      </button>
    </header>
  );
}
