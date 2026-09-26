import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkSchoolExists } from '../api/school.api';
import Button from '../components/common/Button';

export default function Homepage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  // "Get Started" decides Login vs School Setup based on the backend,
  // never the frontend alone (Section 3 of the architecture).
  const handleGetStarted = async () => {
    setChecking(true);
    try {
      const { data } = await checkSchoolExists();
      navigate(data.exists ? '/login' : '/school-setup/info');
    } catch {
      navigate('/school-setup/info');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 py-4 border-b">
        <div className="font-bold text-primary text-lg ">CBT SYSTEM</div>
        <nav className="flex gap-6 text-sm">
          <a href="#how-it-works" className="hover:text-primary">How it works</a>
          <button onClick={() => navigate('/login')} className="hover:text-primary">Login</button>
          <button onClick={handleGetStarted} className="text-primary font-medium">Sign Up</button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4 max-w-2xl">
          Manage your school's examinations in one place.
        </h1>
        <p className="text-gray-600 max-w-xl mb-8" id="how-it-works">
          Set up your school, manage students, create OBJ and theory exams, record
          and release results, and keep years of past results organized.
        </p>
        <Button onClick={handleGetStarted} disabled={checking}>
          {checking ? 'Checking...' : 'Get Started'}
        </Button>
      </main>
    </div>
  );
}
