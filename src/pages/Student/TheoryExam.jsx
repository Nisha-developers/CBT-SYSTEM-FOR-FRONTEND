import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getExam, submitAttempt, resumeAttempt, pauseAttempt, sendHeartbeat, } from '../../api/exam.api';
import { useExamStore } from '../../store/useExamStore';
import { apiError } from '../../api/axios';
import { useExamModeStore } from '../../store/useExamModeStore';
import { loadExamMode } from '../../utils/examMode';
import Button from '../../components/common/Button';
import DOMPurify from 'dompurify';
import { Clock, User, Send, AlertTriangle, CheckCircle2, BookOpen, Loader2 } from 'lucide-react';

export default function TheoryExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeAttempt, setActiveAttempt } = useExamStore();
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const submittingRef = useRef(false);
  const heartbeatInFlightRef = useRef(false);
  const restoringAttemptRef = useRef(false);
const [connectionPaused, setConnectionPaused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exam, setExam] = useState(null);

  // --- TIMER STATE ---
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

 useEffect(() => {
  let cancelled = false;

  const loadExam = async () => {
    try {
      const examModeStore = useExamModeStore.getState();

      // If the candidate token disappeared after refresh,
      // restore the existing attempt first.
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

  if (!exam || !attemptId || submitted) return;

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
}, [activeAttempt?.id, exam, submitted]);

useEffect(() => {
  const attemptId = activeAttempt?.id;

  if (!exam || !attemptId || submitted) return;

  const handlePageHide = () => {
    pauseAttempt(attemptId).catch(() => {
      // The backend's 45-second heartbeat timeout is the fallback.
    });
  };

  window.addEventListener('pagehide', handlePageHide);

  return () => {
    window.removeEventListener('pagehide', handlePageHide);
  };
}, [activeAttempt?.id, exam, submitted]);
  const displayExam = exam || { questions: [] };
  const questions = displayExam.questions || [];

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (timeRemaining === null || submitted || connectionPaused) return;
    if (timeRemaining <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, submitted, connectionPaused]);

 

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
    if (submittingRef.current || !activeAttempt) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const { data } = await submitAttempt(activeAttempt.id);
      useExamModeStore.getState().setMode(data.examMode);
    } catch (err) {
      if (err?.response?.status !== 409) {
        submittingRef.current = false;
        setIsSubmitting(false);
        setSubmitError(apiError(err, 'Could not submit. Check your connection and try again.'));
        return;
      }
      await loadExamMode();
    }
    useExamModeStore.getState().clearCandidateAccessToken();
    setSubmitted(true);
    setShowSubmitModal(false);
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

  const studentName = activeAttempt?.studentName || '';
  const studentId = activeAttempt?.studentId || '';
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl border border-emerald-100 shadow-sm p-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Exam submitted</h1>
          <p className="text-sm text-gray-600">
            Your theory exam is complete. Write your answers in your booklet and submit it to your teacher for marking.
          </p>
          <Button type="button" onClick={() => navigate('/student/dashboard', { replace: true })}>
            Return to dashboard
          </Button>
        </div>
      </div>
    );
  }

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
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 py-6">
        <div className="space-y-6">
            
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
                    {displayExam.subject} · {displayExam.class}
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                {displayExam.type}
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                Write your answers in your booklet. This screen displays the questions only; answers are not entered or uploaded here.
              </p>
            </div>

            {questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((question, questionIndex) => (
              <article key={question.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 lg:p-8">
  <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
    Question {questionIndex + 1}
  </h2>
  <div
    className="text-sm text-gray-900 leading-relaxed break-words
               [&_p]:mb-2
               [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-2
               [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-2
               [&_strong]:font-semibold
               [&_em]:italic
               [&_u]:underline
               [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2
               [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1
               [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-700
               [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_img]:my-2 [&_img]:inline-block"
    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.text || '') }}
  />
</article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-sm text-gray-500">No questions are available for this exam.</p>
              </div>
            )}

            {submitError && (
              <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                {submitError}
              </p>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Exam
              </Button>
            </div>
        </div>
      </main>

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
                Confirm that you have completed writing your answers in your booklet before submitting.
              </p>

              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  No answers are entered or sent through this app. Submit your booklet to your teacher for marking. You cannot re-enter the exam after submission.
                </p>
              </div>

              {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => {
                    handleSubmit();
                  }}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {isSubmitting ? 'Submitting…' : 'Submit Now'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
