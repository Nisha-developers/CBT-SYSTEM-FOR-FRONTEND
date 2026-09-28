import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkSchoolExists } from '../api/school.api';
import Button from '../components/common/Button';

export default function Homepage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
    const schooDetail =JSON.parse(localStorage.getItem('setupSchoolpi'));
    console.log(schooDetail?.name);
    
    
    useEffect(()=>{
if(!schooDetail?.name){
  navigate('/school-setup/info')
  }
    }, [schooDetail?.name])

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
        <div className="wrapper-header flex items-center gap-3">
          <img src="" alt="School Logo" />
        <div className="font-bold text-primary text-lg ">{schooDetail?.name || 'Cbt System'} </div>
        </div>
        <nav className="flex gap-6 text-sm items-center">
          <a href="https://github.com/Nisha-developers/CBT-SYSTEM-FOR-FRONTEND/blob/main/README.md" className="hover:text-primary">How it works</a>
          <Button onClick={() => navigate('/login')}>Login</Button>
         
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4 max-w-2xl">
          {schooDetail?.HeadLine || "Manage your school's examinations in one place."}
        </h1>
        <p className="text-gray-600 max-w-xl mb-8" id="how-it-works">
         {schooDetail?.description || ' Set up your school, manage students, create OBJ and theory exams, record and release results, and keep years of past results organized.'}
        </p>
        
      </main>
    </div>
  );
}
