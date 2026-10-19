import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 min-w-0 w-0 flex flex-col">
        <Header openNav={setIsSidebarOpen} />
        <main className="p-6 flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}