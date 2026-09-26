import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/students', label: 'Students' },
  { to: '/dashboard/exams/obj', label: 'OBJ Exams' },
  { to: '/dashboard/exams/theory', label: 'Theory Exams' },
  { to: '/dashboard/results', label: 'Results' },
  { to: '/dashboard/results/past', label: 'Past Results' },
  { to: '/dashboard/settings/school', label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-primary-dark text-white min-h-screen p-4">
      <div className="text-lg font-bold mb-8 px-2">CBT SYSTEM</div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-blue-100 hover:bg-primary/60'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
