// import { NavLink } from 'react-router-dom';

// const links = [
//   { to: '/dashboard', label: 'Overview', end: true },
//   { to: '/dashboard/students', label: 'Students' },
//   { to: '/dashboard/exams/obj', label: 'OBJ Exams' },
//   { to: '/dashboard/exams/theory', label: 'Theory Exams' },
//   { to: '/dashboard/results', label: 'Results' },
//   { to: '/dashboard/results/past', label: 'Past Results' },
//   { to: '/dashboard/settings/school', label: 'Settings' },
// ];
import React from 'react';
import {NavLink} from 'react-router-dom'
import { 
  LayoutDashboard, 
  GraduationCap,
  ClipboardCheck, 
FilePenLine,
 ChartNoAxesColumnIncreasing,
  Settings, 
  ShieldUser,
  X,
  History,
  Activity
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, to: '/dashboard',  end: true },
    { label: 'Students', icon: GraduationCap, to:'/dashboard/students' },
     { label: 'Activities', icon: Activity, to:'/dashboard/activity' }
  ];

  const Exam = [
    { label: 'Obj', icon: ClipboardCheck, to: '/dashboard/exams/obj'},
    { label: 'Theory', icon: FilePenLine, to: '/dashboard/exams/theory'},
  ];
  const Results = [
     { label: 'Current', icon: ChartNoAxesColumnIncreasing, to: '/dashboard/results', end: true},
    { label: 'Past', icon: History, to: '/dashboard/results/past'},

  ]

  const bottomItems = [
    { label: 'Settings', icon: Settings, to:'/dashboard/settings/school' },
    { label: 'Admin', icon: ShieldUser, to: '/dashboard/admin'},
  ];

  return (
    <>
      {/* Mobile Overlay (Backdrop) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed inset-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between font-sans lg:sticky
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0  lg:z-[1000000]
        `}
      >
        {/* Mobile Close Button */}
        <div className="absolute top-4 right-4 lg:hidden">
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Section: Brand & Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4">
          
          {/* Brand / Logo */}
          <div className="flex items-center gap-2 px-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg tracking-tight">CBT Admin</span>
          </div>
          {/* Main Navigation */}
          <nav className="space-y-1 mb-6">
            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to= {item.to}
                end={item.end}
                className={({isActive})=>`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                 isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                 {({ isActive }) => (
      <div className="flex items-center gap-3">
        <item.icon
          className={`w-4 h-4 ${
            isActive ? 'text-blue-600' : 'text-gray-400'
          }`}
        />

        {item.label}
      </div>
    )}
              </NavLink>
            ))}
          </nav>

          {/* Obj Navigation */}
          <nav className="space-y-1 mb-6">
            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Exams</p>
           
           {Exam.map((item) => (
  <NavLink
    key={item.label}
    to={item.to}
    end={item.end}
    className={({ isActive }) => `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {({ isActive }) => (
      <div className="flex items-center gap-3">
        <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
        {item.label}
      </div>
    )}
  </NavLink>
))}
          </nav>

            {/* Result Navigation */}
          <nav className="space-y-1">
            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Results</p>
           {Results.map((item) => (
  <NavLink
    key={item.label}
    to={item.to}
    end={item.end}
    className={({ isActive }) => `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {({ isActive }) => (
      <div className="flex items-center gap-3">
        <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
        {item.label}
      </div>
    )}
  </NavLink>
))}
          </nav>
        </div>
        

        {/* Bottom Section */}
        <div className="p-2 border-gray-700 bottom-0  z-1000000 bg-white">
          <div className="space-y-1">
           {bottomItems.map((item) => (
  <NavLink
    key={item.label}
    to={item.to}
    end={item.end}
    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {({ isActive }) => (
      <>
        <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
        {item.label}
      </>
    )}
  </NavLink>
))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;