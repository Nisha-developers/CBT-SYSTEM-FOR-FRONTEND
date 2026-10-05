import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Menu, Bell, ChevronDown } from 'lucide-react';

export default function Header({ openNav }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b  border-gray-200 px-4 py-3 lg:px-8 lg:py-5 flex items-center justify-between sticky top-0 z-30">
      
      {/* LEFT SIDE: Mobile Menu & Greeting */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button (Only visible on mobile/tablet) */}
        <button 
          onClick={() => openNav(true)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Greeting Text */}
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-gray-900 leading-tight">
            Good morning, {user?.fullName || 'Admin'}
          </h1>
          <p className="text-xs text-gray-500 hidden sm:block">
            Here's what's happening across your school today.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Notifications & Profile */}
      <div className="flex items-center gap-3 lg:gap-5">
        
        {/* Notification Bell */}
        <button 
          className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Subtle notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

        {/* Profile Dropdown Trigger */}
        <div className="relative group">
          <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/20">
            {/* Avatar Placeholder */}
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
              <span className="text-blue-700 text-xs font-bold">
                {(user?.fullName || 'A').charAt(0).toUpperCase()}
              </span>
            </div>
            
            {/* Name & Dropdown Indicator (Hidden on very small screens) */}
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-sm font-medium text-gray-700">
                {user?.fullName || 'Admin'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </button>

          {/* Dropdown Menu (Hover/Click) */}
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="px-4 py-2 border-b border-gray-100 mb-1">
              <p className="text-xs font-medium text-gray-900 truncate">{user?.fullName || 'Admin'}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email || 'admin@school.com'}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}