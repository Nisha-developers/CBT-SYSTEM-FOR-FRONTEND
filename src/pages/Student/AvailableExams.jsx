import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { availableExams, OpenExam } from '../../api/exam.api';
import { apiError } from '../../api/axios';
import Button from '../../components/common/Button';
import { BookOpen, Loader2, Play, GraduationCap } from 'lucide-react';
import { useExamModeStore } from '../../store/useExamModeStore';

export default function AvailableExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    availableExams()
      .then(({ data }) => {
        if (active) setExams(Array.isArray(data.exams) ? data.exams : []);
      })
      .catch((err) => {
        if (active) setError(apiError(err, 'Could not load available exams.'));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  // --- CLASS OPTIONS ---
  const classes = useMemo(
    () => [...new Set(exams.map((exam) => exam.class).filter(Boolean))].sort(),
    [exams]
  );

  // --- SUBJECT OPTIONS (filtered by selected class) ---
  const subjects = useMemo(() => {
    const filtered = selectedClass
      ? exams.filter((exam) => exam.class === selectedClass)
      : exams;
    return [...new Set(filtered.map((exam) => exam.subject).filter(Boolean))].sort();
  }, [exams, selectedClass]);

  // --- TYPE OPTIONS (filtered by selected class + subject) ---
  const types = useMemo(() => {
    const filtered = exams.filter((exam) => {
      const matchClass = selectedClass ? exam.class === selectedClass : true;
      const matchSubject = selectedSubject ? exam.subject === selectedSubject : true;
      return matchClass && matchSubject;
    });
    return [...new Set(filtered.map((exam) => exam.typeLabel || exam.type).filter(Boolean))].sort();
  }, [exams, selectedClass, selectedSubject]);

  // --- RESET LOWER DROPDOWNS WHEN PARENT CHANGES ---
  const handleClassChange = (value) => {
    setSelectedClass(value);
    setSelectedSubject('');
    setSelectedType('');
    setError('');
  };

  const handleSubjectChange = (value) => {
    setSelectedSubject(value);
    setSelectedType('');
    setError('');
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    setError('');
  };

  // --- CONTINUE ---
const handleContinue = async () => {
  try {
    const exam = exams.find((item) =>
      item.class === selectedClass &&
      item.subject === selectedSubject &&
      (item.typeLabel || item.type) === selectedType
    );

    if (!exam) {
      setError('No available exam matches that class, subject, and type.');
      return;
    }

    if (exam.attemptStatus === 'submitted') {
      setError('You have already submitted this exam.');
      return;
    }

    if (exam.status === 'Scheduled') {
      setError(
        `This exam opens ${exam.date || 'later'}${exam.time ? ` at ${exam.time}` : ''}.`
      );
      return;
    }

    if (exam.status === 'Completed' && exam.attemptStatus !== 'in_progress') {
      setError('This exam has ended.');
      return;
    }

    const { data } = await OpenExam({ examId: exam.id });

    if (!data.examAccessToken) {
      throw new Error('The server did not return an exam session token.');
    }
    useExamModeStore.getState().setExamSession(
      data.examAccessToken,
      data.examMode
    );
    

    navigate(`/student/exams/${encodeURIComponent(exam.id)}/instructions`);
  } catch (err) {
    setError(apiError(err, 'Could not open the exam room.'));
    console.error('Open exam error:', err);
  }
};
useEffect(() => {
  const { mode } = useExamModeStore.getState();

  if (mode?.active && mode?.phase === 'in_exam') {
  navigate('/student/login')
  }
}, []);

  const isComplete = selectedClass && selectedSubject && selectedType;
  const location = useLocation();
const authorize = location.state?.authorize;
console.log(authorize);
if(!authorize){
  navigate('/admin/exams/Login')
}

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Available Exams</h1>
          <p className="text-sm text-gray-500 mt-1">
            Choose a class, subject, and exam type to begin.
          </p>
        </header>

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Exam Selection</h2>
              <p className="text-xs text-gray-500">Only exams available to your account are listed.</p>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">
              {error}
            </p>
          )}

          {isLoading ? (
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading exams…
            </p>
          ) : exams.length === 0 && !error ? (
            <p className="text-sm text-gray-500">There are no exams available right now.</p>
          ) : (
            <div className="grid sm:grid-cols-3 gap-4">

              {/* --- CLASS --- */}
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                  Class <span className="text-red-500">*</span>
                </span>
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </label>

              {/* --- SUBJECT --- */}
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-gray-700">
                  Subject <span className="text-red-500">*</span>
                </span>
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  disabled={!selectedClass}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {selectedClass ? 'Select Subject' : 'Select class first'}
                  </option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </label>

              {/* --- TYPE --- */}
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-gray-700">
                  Exam Type <span className="text-red-500">*</span>
                </span>
                <select
                  value={selectedType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  disabled={!selectedSubject}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {selectedSubject ? 'Select Type' : 'Select subject first'}
                  </option>
                  {types.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>

            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="button"
              disabled={isLoading || !isComplete}
              onClick={handleContinue}
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              Continue
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}