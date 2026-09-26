import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { availableExams } from '../../api/exam.api';
import { useExamStore } from '../../store/useExamStore';

export default function AvailableExams() {
  const { exams, setExams } = useExamStore();

  useEffect(() => {
    availableExams().then(({ data }) => setExams(data.exams));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6">Available Exams</h1>
      <ul className="space-y-3 max-w-md">
        {exams.map((exam) => (
          <li key={exam.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{exam.title}</div>
              <div className="text-xs text-gray-500">{exam.type} · {exam.durationMinutes} min</div>
            </div>
            <Link to={`/student/exams/${exam.id}/instructions`} className="text-primary text-sm">
              Start
            </Link>
          </li>
        ))}
        {exams.length === 0 && <p className="text-gray-400 text-sm">No exams available right now.</p>}
      </ul>
    </div>
  );
}
