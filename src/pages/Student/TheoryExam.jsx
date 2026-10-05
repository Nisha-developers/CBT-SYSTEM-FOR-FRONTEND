import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getExam, saveAnswer, submitAttempt } from '../../api/exam.api';
import { useExamStore } from '../../store/useExamStore';
import Button from '../../components/common/Button';
import { 
  Clock, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Send,
  AlertTriangle,
  CheckCircle2,
  Menu,
  X,
  BookOpen,
  Save,
  Upload,
  FileText,
  Loader2
} from 'lucide-react';

// =========================================================
// MOCK THEORY EXAM DATA (For visual preview)
// =========================================================
const MOCK_THEORY_EXAM = {
  id: '2',
  title: 'Mathematics Theory Exam',
  type: 'Theory',
  subject: 'Mathematics',
  durationMinutes: 90,
  class: 'SS2',
  arm: 'A',
  allowFileUpload: false,
  questions: [
    {
      id: 't1',
      text: 'Explain the difference between a permutation and a combination. Provide one real-world example of each.',
      marks: 10,
    },
    {
      id: 't2',
      text: 'Solve the quadratic equation x² - 5x + 6 = 0. Show all your workings clearly.',
      marks: 15,
    },
    {
      id: 't3',
      text: 'Describe the Pythagorean theorem and explain how it is applied in solving right-angled triangles. Include a diagram description.',
      marks: 20,
    },
    {
      id: 't4',
      text: 'A car travels 240 km in 3 hours. Calculate its average speed. If the car then travels another 180 km at the same speed, how long does the total journey take?',
      marks: 15,
    },
    {
      id: 't5',
      text: 'Discuss the importance of statistics in everyday life. Give three practical applications.',
      marks: 10,
    },
  ],
};

export default function TheoryExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeAttempt, answers, setAnswer } = useExamStore();
  const [exam, setExam] = useState(null);
  const [index, setIndex] = useState(0);

  // --- TIMER STATE ---
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showPalette, setShowPalette] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // --- YOUR ORIGINAL FETCH LOGIC (UNTOUCHED) ---
  useEffect(() => {
    getExam(id).then(({ data }) => setExam(data.exam));
  }, [id]);

  const displayExam = exam || MOCK_THEORY_EXAM;
  const questions = displayExam.questions || [];
  const question = questions[index];



  // --- TIMER LOGIC ---
  useEffect(() => {
    if (!displayExam.durationMinutes) return;
    setTimeRemaining(displayExam.durationMinutes * 60);
  }, [displayExam.durationMinutes]);

  useEffect(() => {
    if (timeRemaining === null) return;
    if (timeRemaining <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining]);

 

  // Format time
  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining === null) return 'text-gray-700 border-gray-200 bg-gray-50';
    if (timeRemaining <= 60) return 'text-red-700 border-red-200 bg-red-50 animate-pulse';
    if (timeRemaining <= 300) return 'text-amber-700 border-amber-200 bg-amber-50';
    return 'text-blue-700 border-blue-200 bg-blue-50';
  };

  const handleSubmit = async () => {
    if (activeAttempt) await submitAttempt(activeAttempt.id);
    navigate('/student/dashboard');
  };

  if (!displayExam) return <div className="p-6 text-sm text-gray-500">Loading exam...</div>;

  const studentName = activeAttempt?.studentName || 'Eleanor Pena';
  const studentId = activeAttempt?.studentId || 'SCH/SS2/A/001';

  // Count answered questions (any non-empty answer)
  const answeredCount = questions.filter((q) => {
    const ans = answers[q.id];
    return ans && ans.trim().length > 0;
  }).length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* ========================================================= */}
      {/* TOP HEADER: Student Info + Timer */}
      {/* ========================================================= */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <span className="text-blue-600 text-sm font-bold">
                  {studentName.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  Welcome, {studentName}
                </p>
                <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                  <User className="w-3 h-3 shrink-0" />
                  {studentId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${getTimerColor()}`}>
                <Clock className="w-4 h-4 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-wider opacity-70 leading-none">
                    Time Left
                  </span>
                  <span className="text-sm font-bold font-mono tabular-nums leading-tight">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setShowPalette(!showPalette)}
                className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {showPalette ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-1 bg-gray-100">
          <div 
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* ========================================================= */}
          {/* LEFT: QUESTION AREA */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Exam Context Bar */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-gray-900">
                    {displayExam.title}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {displayExam.subject} · {displayExam.class} · Arm {displayExam.arm}
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                {displayExam.type}
              </span>
            </div>

            {/* Question Card */}
            {question ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                
                {/* Question Header */}
                <div className="p-5 lg:p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                       {questions.length} Questions 
                    </span>
                    {question.marks && (
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {question.marks} marks
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Body */}
                <div className="p-5 lg:p-8 space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-gray-700 flex items-center justify-between">
                      <span>Questions</span>
                     
                    </label>
                    <div
                     className="w-full cursor-default min-h-[40vh] bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors resize-none leading-relaxed"
                    ></div>
                  </div>

                  {/* Optional: File Upload */}
                  {displayExam.allowFileUpload && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <Upload className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-blue-900">
                          File Upload Enabled
                        </p>
                        <p className="text-xs text-blue-700 mt-0.5">
                          You may also upload handwritten answers or supporting documents.
                        </p>
                        <button className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-blue-600 bg-white border border-blue-200 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors">
                          <FileText className="w-3 h-3" />
                          Choose File
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Navigation Footer */}
                <div className="p-5 lg:p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
                  <Button
                      onClick={() => setShowSubmitModal(true)}
                      className="flex items-center gap-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                      Submit Exam
                    </Button>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-sm text-gray-500">No questions available for this exam.</p>
              </div>
            )}

          </div>

        

        </div>
      </main>

      {/* ========================================================= */}
      {/* MOBILE PALETTE DRAWER */}
      {/* ========================================================= */}
      {showPalette && (
        <div className="lg:hidden fixed inset-0 z-40 bg-gray-900/50" onClick={() => setShowPalette(false)}>
          <div 
            className="absolute top-16 right-4 left-4 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Question Navigator</h3>
              <button 
                onClick={() => setShowPalette(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-6 gap-2">
                {questions.map((q, i) => {
                  const ans = answers[q.id];
                  const isAnswered = ans && ans.trim().length > 0;
                  const isCurrent = i === index;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setIndex(i);
                        setShowPalette(false);
                      }}
                      className={`w-full aspect-square rounded-md text-xs font-semibold transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : isAnswered
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-50 text-gray-500 border border-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUBMIT CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md overflow-hidden">
            
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-100">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Submit Theory Exam?</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                You have answered <strong className="text-gray-900">{answeredCount}</strong> of{' '}
                <strong className="text-gray-900">{questions.length}</strong> questions.
              </p>

              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Once submitted, your answers will be sent to your teacher for manual marking. 
                  You cannot re-enter this exam.
                </p>
              </div>

              {answeredCount < questions.length && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    You have <strong>{questions.length - answeredCount}</strong> unanswered question(s). 
                    These will be marked as blank.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    handleSubmit();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Now
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
