import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { getExam, saveAnswer, submitAttempt, sendHeartbeat, resumeAttempt, pauseAttempt } from '../../api/exam.api';
import { useExamStore } from '../../store/useExamStore';
import { apiError } from '../../api/axios';
import { useExamModeStore } from '../../store/useExamModeStore';
import { loadExamMode } from '../../utils/examMode';
import Button from '../../components/common/Button';
import {
  Clock, User, Send, AlertTriangle, CheckCircle2, Menu, X, BookOpen, ChevronLeft, ChevronRight,
} from 'lucide-react';

// Sanitized HTML renderer for question / passage / options
const HtmlBlock = ({ html, className = '' }) => (
  <div
    className={
      'break-words [&_p]:mb-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 ' +
      '[&_strong]:font-semibold [&_em]:italic [&_u]:underline ' +
      '[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_img]:my-2 [&_img]:inline-block ' +
      '[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:my-2 ' +
      '[&_h3]:text-base [&_h3]:font-semibold [&_h3]:my-2 ' +
      '[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:italic ' +
      className
    }
    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html || '') }}
  />
);

export default function ObjExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeAttempt, answers, setAnswer, setActiveAttempt } = useExamStore();
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const submittingRef = useRef(false);
  const heartbeatInFlightRef = useRef(false);
  const restoringAttemptRef = useRef(false);
const [connectionPaused, setConnectionPaused] = useState(false);
  const [exam, setExam] = useState(null);
  const [index, setIndex] = useState(0);

  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showPalette, setShowPalette] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
  let cancelled = false;

  const loadExam = async () => {
    try {
      const examModeStore = useExamModeStore.getState();

      // Restore the candidate session if the token disappeared.
            // After a refresh the exam tokens are gone: go back through the exam room
      // (operator opens the exam, student enters their ID). The time is already paused.
      if (!examModeStore.candidateAccessToken) {
        examModeStore.setMode(null);
        navigate('/exams/rooms', { replace: true });
        return;
      }

      // Load the exam using the candidate token.
      const { data } = await getExam(id);

      if (cancelled) return;

      setExam(data.exam);
      setActiveAttempt(data.attempt);
      setTimeRemaining(data.attempt.remainingSeconds);

    } catch (err) {
      if (!cancelled) {
        setLoadError(
          apiError(err, 'Could not restore or open this exam.')
        );
      }
    }
  };

  loadExam();

  return () => {
    cancelled = true;
  };

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [id]);

useEffect(() => {
  const attemptId = activeAttempt?.id;

  if (!exam || !attemptId) return;

  const heartbeat = async () => {
    if (heartbeatInFlightRef.current) return;

    heartbeatInFlightRef.current = true;

    try {
      const { data } = await sendHeartbeat(attemptId);

      if (data.active === false && !restoringAttemptRef.current) {
        restoringAttemptRef.current = true;
        setConnectionPaused(true);

                try {
          const { data: resumed } = await resumeAttempt(attemptId);

          if (resumed.resumed) {
            if (resumed.candidateAccessToken) {
              useExamModeStore.getState().setCandidateAccessToken(resumed.candidateAccessToken);
            }
            setTimeRemaining(resumed.remainingSeconds);
            setConnectionPaused(false);
          } else if (resumed.remainingSeconds === 0) {
            setTimeRemaining(0);          // time ran out while paused → auto-submit
            setConnectionPaused(false);
          }
        } catch (err) {
          // Stay paused; the next heartbeat retries.
        } finally {
          restoringAttemptRef.current = false;
        }
      }
    } catch (err) {
      // Connection errors are handled by the next heartbeat.
    } finally {
      heartbeatInFlightRef.current = false;
    }
  };

  heartbeat();

  const interval = setInterval(heartbeat, 15000);

  return () => clearInterval(interval);
}, [activeAttempt?.id, exam]);
useEffect(() => {
  const attemptId = activeAttempt?.id;

  if (!exam || !attemptId) return;

  const handlePageHide = () => {
    // Best-effort request to pause the exam before leaving.
    pauseAttempt(attemptId).catch(() => {
      // The backend's 45-second heartbeat timeout is the fallback.
    });
  };

  window.addEventListener('pagehide', handlePageHide);

  return () => {
    window.removeEventListener('pagehide', handlePageHide);
  };
}, [activeAttempt?.id, exam]);
  const displayExam = exam || { questions: [] };
  const questions = displayExam.questions || [];
  const question = questions[index];

  useEffect(() => {
    if (timeRemaining === null || connectionPaused) return;
    if (timeRemaining <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining,connectionPaused]);

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

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white border border-red-100 rounded-xl p-6 max-w-md text-center space-y-4">
          <p className="text-sm text-red-700">{loadError}</p>
          <button onClick={() => navigate('/student/exams')} className="text-sm text-blue-600 hover:underline">Back to exams</button>
        </div>
      </div>
    );
  }
  if (!exam) return <div className="p-6 text-sm text-gray-500">Loading exam...</div>;

  const selectAnswer = async (opt) => {
    setAnswer(question.id, opt);
    setSaveError('');
    try {
      if (activeAttempt) await saveAnswer(activeAttempt.id, question.id, opt);
    } catch (err) {
      setSaveError(apiError(err, 'Your answer could not be saved. Check your connection.'));
    }
  };

  const handleSubmit = async () => {
    if (submittingRef.current || !activeAttempt) return;
    submittingRef.current = true;
    try {
      const { data } = await submitAttempt(activeAttempt.id);
      useExamModeStore.getState().setMode(data.examMode);
    } catch (err) {
      if (err?.response?.status !== 409) {
        submittingRef.current = false;
        setSaveError(apiError(err, 'Could not submit. Check your connection and try again.'));
        return;
      }
      await loadExamMode();
    }
    useExamModeStore.getState().clearCandidateAccessToken();
    navigate('/student/dashboard', { replace: true });
  };

  const studentName = activeAttempt?.studentName || '';
  const studentId = activeAttempt?.studentId || '';

  const answeredCount = questions.filter((q) => answers[q.id]).length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <span className="text-blue-600 text-sm font-bold">{studentName.charAt(0)}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Welcome, {studentName}</p>
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
                  <span className="text-[10px] font-medium uppercase tracking-wider opacity-70 leading-none">Time Left</span>
                  <span className="text-sm font-bold font-mono tabular-nums leading-tight">{formatTime(timeRemaining)}</span>
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
          <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-gray-900">{displayExam.title}</h1>
                  <p className="text-xs text-gray-500">{displayExam.subject} · {displayExam.class}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                {displayExam.type}
              </span>
            </div>

            {question ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 lg:p-6 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Question {index + 1} of {questions.length}
                  </span>
                  <span className="text-xs text-gray-400">{answeredCount}/{questions.length} answered</span>
                </div>

                <div className="p-5 lg:p-8">
                  {question.passage && (
                    <div className="mb-5 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Passage</p>
                      <HtmlBlock html={question.passage} className="text-sm text-gray-800 leading-relaxed" />
                    </div>
                  )}

                  {/* Question stem — now rich HTML */}
                  <HtmlBlock
                    html={question.text}
                    className="text-base lg:text-lg font-medium text-gray-900 leading-relaxed mb-6"
                  />

                  <div className="space-y-3">
                    {Object.entries(question.options || {}).map(([key, text]) => {
                      const isSelected = answers[question.id] === key;
                      return (
                        <label
                          key={key}
                          className={`flex items-start gap-3 p-3.5 lg:p-4 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600/20'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${question.id}`}
                            className="sr-only"
                            checked={isSelected}
                            onChange={() => selectAnswer(key)}
                          />

                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold transition-colors ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}>
                            {key}
                          </div>

                          {/* Option — now rich HTML */}
                          <HtmlBlock
                            html={text}
                            className={`flex-1 text-sm leading-relaxed pt-1 ${
                              isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'
                            }`}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="p-5 lg:p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
                  <Button variant="outline" disabled={index === 0} onClick={() => setIndex(index - 1)} className="flex items-center gap-1.5 text-sm font-medium">
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {index < questions.length - 1 ? (
                    <Button onClick={() => setIndex(index + 1)} className="flex items-center gap-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button onClick={() => setShowSubmitModal(true)} className="flex items-center gap-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                      <Send className="w-4 h-4" />
                      Submit Exam
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-sm text-gray-500">No questions available for this exam.</p>
              </div>
            )}

            {saveError && (
              <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                {saveError}
              </p>
            )}
          </div>

          <aside className="hidden lg:block lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Question Navigator</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, i) => {
                    const isAnswered = !!answers[q.id];
                    const isCurrent = i === index;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setIndex(i)}
                        className={`w-full aspect-square rounded-md text-xs font-semibold transition-all ${
                          isCurrent
                            ? 'bg-blue-600 text-white ring-2 ring-blue-600/30 scale-105'
                            : isAnswered
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500"><span className="w-3 h-3 rounded bg-blue-600" />Current</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200" />Answered</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><span className="w-3 h-3 rounded bg-gray-50 border border-gray-200" />Not Answered</div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Submit Exam
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {showPalette && (
        <div className="lg:hidden fixed inset-0 z-40 bg-gray-900/50" onClick={() => setShowPalette(false)}>
          <div className="absolute top-16 right-4 left-4 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Question Navigator</h3>
              <button onClick={() => setShowPalette(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-6 gap-2">
                {questions.map((q, i) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = i === index;
                  return (
                    <button
                      key={q.id}
                      onClick={() => { setIndex(i); setShowPalette(false); }}
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

      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg border border-amber-100">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Submit Exam?</h3>
                <p className="text-xs text-gray-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                You have answered <strong className="text-gray-900">{answeredCount}</strong> of{' '}
                <strong className="text-gray-900">{questions.length}</strong> questions.
              </p>

              {answeredCount < questions.length && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    You have <strong>{questions.length - answeredCount}</strong> unanswered question(s).
                    These will be marked as incorrect.
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
                  onClick={() => { setShowSubmitModal(false); handleSubmit(); }}
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