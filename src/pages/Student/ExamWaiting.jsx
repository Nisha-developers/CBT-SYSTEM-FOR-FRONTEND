import { useNavigate } from 'react-router-dom';
import { signOut } from '../../utils/session';
import { useExamModeStore } from '../../store/useExamModeStore';

export default function ExamWaiting() {
  const navigate = useNavigate();
  const mode = useExamModeStore((state) => state.mode);

  const handleLogout = async () => {
    await signOut();
    navigate('/student/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-md text-center space-y-4">
        <h1 className="text-xl font-semibold text-gray-900">Exam submitted</h1>
        <p className="text-sm text-gray-600">
          {mode?.examTitle ? `Your answers for "${mode.examTitle}" have been saved.` : 'Your answers have been saved.'}
          {' '}Please wait for your admin to release you.
        </p>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600">Log out</button>
      </div>
    </div>
  );
}
