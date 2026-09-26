import { useNavigate, useParams } from 'react-router-dom';
import { startAttempt } from '../../api/exam.api';
import { useExamStore } from '../../store/useExamStore';
import Button from '../../components/common/Button';

export default function ExamInstructions() {
  const navigate = useNavigate();
  const { id } = useParams();
  const setActiveAttempt = useExamStore((s) => s.setActiveAttempt);

  const handleStart = async () => {
    const { data } = await startAttempt(id);
    setActiveAttempt(data.attempt);
    navigate(`/student/exams/${id}/take`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow max-w-md">
        <h1 className="text-xl font-semibold mb-4">Exam Instructions</h1>
        <ul className="text-sm text-gray-600 space-y-2 mb-6 list-disc list-inside">
          <li>Do not refresh or close this tab during the exam.</li>
          <li>Your answers are saved automatically as you go.</li>
          <li>The exam auto-submits when the timer runs out.</li>
          <li>Once submitted, you cannot re-enter this exam.</li>
        </ul>
        <Button className="w-full" onClick={handleStart}>Start Exam</Button>
      </div>
    </div>
  );
}
