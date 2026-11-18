import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { startAttempt, availableExams } from '../../api/exam.api';
import { useExamStore } from '../../store/useExamStore';
import { useExamModeStore } from '../../store/useExamModeStore';
import { apiError } from '../../api/axios';
import Button from '../../components/common/Button';

import { 
  AlertCircle, 
  BookOpen, 
  Loader2, 
  User, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw, 
  Lock, 
  Timer, 
  FileText,
  Award,
  Info
} from 'lucide-react';

export default function ExamInstructions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const setActiveAttempt = useExamStore((state) => state.setActiveAttempt);
  const [exam, setExam] = useState(null);
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    let active = true;
    availableExams()
      .then(({ data }) => {
        if (active) setExam(data.exams?.find((item) => String(item.id) === String(id)) || null);
      })
      .catch((err) => {
        if (active) setError(apiError(err, 'Could not load exam instructions.'));
      });
    return () => { active = false; };
  }, [id]);

  const handleStart = async (event) => {
    event.preventDefault();
    if (!studentId.trim()) {
      setError('Please enter your Student ID to continue.');
      return;
    }
    setError('');
    setIsBusy(true);
    try {
     const { data } = await startAttempt(id, {
  studentId: studentId.trim(),
});

if (!data.candidateAccessToken) {
  throw new Error('The server did not return a candidate access token.');
}

useExamModeStore.getState().setCandidateAccessToken(
  data.candidateAccessToken
);

setActiveAttempt(data.attempt);

if (data.examMode) {
  useExamModeStore.getState().setMode(data.examMode);
}

navigate(`/student/exams/${encodeURIComponent(id)}/take`);
    } catch (err) {
      setError(apiError(err, 'Could not start the exam.'));
    } finally {
      setIsBusy(false);
    }
  };

  // --- 5 CORE INSTRUCTIONS ---
  const instructions = [
    {
      icon: RefreshCw,
      title: 'Do Not Refresh or Close',
      text: 'Do not refresh, close, or leave this tab while taking the exam. Doing so may end your session.',
    },
    {
      icon: Timer,
      title: 'Timed Examination',
      text: 'Your exam is timed and will submit automatically when the countdown reaches zero.',
    },
    {
      icon: CheckCircle2,
      title: 'Answers Auto-Save',
      text: 'Your answers are saved as you go. You can navigate between questions without losing progress.',
    },
    {
      icon: Lock,
      title: 'Single Submission',
      text: 'Once you submit, you cannot re-enter this exam. Review your answers before submitting.',
    },
    {
      icon: FileText,
      title: 'Theory Submission',
      text: 'For Theory exams, your typed or uploaded answers are recorded for teacher review.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-6">
      
      <div className="w-full max-w-2xl space-y-6">
        
        {/* ========================================================= */}
        {/* MAIN CARD */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-blue-600/10 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* ========================================================= */}
            {/* HEADER */}
            {/* ========================================================= */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100 shrink-0">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                  Exam Instructions
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Read carefully before you begin your examination.
                </p>
              </div>
            </div>

            {/* ========================================================= */}
            {/* EXAM INFO CARD */}
            {/* ========================================================= */}
            {exam && (
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      {exam.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {exam.subject} · {exam.class} · {exam.typeLabel || exam.type}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider shrink-0">
                    {exam.typeLabel || exam.type}
                  </span>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-white rounded-lg p-2.5 border border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Duration</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{exam.duration || '—'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <FileText className="w-3 h-3 text-gray-400" />
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Questions</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{exam.questionsToDisplay || exam.totalQuestions || '—'}</span>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award className="w-3 h-3 text-gray-400" />
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Marks</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{exam.percentageMark ? `${exam.percentageMark}%` : '—'}</span>
                  </div>
                </div>

                {/* Custom Instructions (if any) */}
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {exam.instructions || 'Read each question carefully. The exam will be timed and submitted when you finish.'}
                </p>
              </div>
            )}

            {/* ========================================================= */}
            {/* 5 INSTRUCTIONS GRID */}
            {/* ========================================================= */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Important Instructions
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {instructions.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-3 p-3.5 bg-white border border-gray-200 rounded-lg hover:border-blue-200 transition-colors"
                  >
                    <div className="p-1.5 bg-blue-50 rounded-md border border-blue-100 shrink-0 mt-0.5">
                      <item.icon className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ========================================================= */}
            {/* WARNING CALLOUT */}
            {/* ========================================================= */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-900">
                  Before You Begin
                </p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  Make sure your device is charged and you have a stable internet connection. 
                  Any interruption may affect your exam session.
                </p>
              </div>
            </div>

            {/* ========================================================= */}
            {/* ERROR */}
            {/* ========================================================= */}
            {error && (
              <div 
                role="alert" 
                className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 leading-relaxed">{error}</p>
              </div>
            )}

            {/* ========================================================= */}
            {/* FORM */}
            {/* ========================================================= */}
            <form onSubmit={handleStart} className="space-y-4 pt-2 border-t border-gray-100">
              
              <label className="block space-y-1.5 pt-4">
                <span className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  Student ID <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  value={studentId}
                  onChange={(event) => {
                    setStudentId(event.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. SCH/JSS1/A/001"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter the Student ID provided by your school to begin the exam.
                </p>
              </label>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isBusy || !exam} 
                  className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 text-sm font-semibold"
                >
                  {isBusy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Starting…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Start Exam
                    </>
                  )}
                </Button>
              </div>
            </form>

          </div>

        </div>

        {/* ========================================================= */}
        {/* FOOTER NOTE */}
        {/* ========================================================= */}
        <p className="text-center text-xs text-gray-400">
          By starting this exam, you agree to follow the examination rules.
        </p>

      </div>
    </div>
  );
}