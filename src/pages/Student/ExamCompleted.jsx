// src/pages/student/ExamCompleted.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  ShieldCheck,
  BookOpen,
  CalendarClock,
  ArrowRight,
  LogOut,
} from 'lucide-react';

/**
 * Shown immediately after a student submits an exam.
 *
 * Props (all optional — falls back to sensible defaults / mock values):
 *  - examTitle:   string   e.g. "Mathematics — First Term CBT"
 *  - subject:     string   e.g. "Mathematics"
 *  - submittedAt: Date|string
 *  - resultsReleaseText: string  e.g. "Results will be released by your teacher."
 *  - onReturn:    () => void  custom handler for "Return to Dashboard"
 */
export default function ExamCompleted({
  examTitle = 'Examination',
  subject = 'Your subject',
  submittedAt,
  resultsReleaseText = 'Your results will be released by the administrator. Please check the Results page later.',
  onReturn,
}) {
  const navigate = useNavigate();
  const { id: examId } = useParams();
  const [now, setNow] = useState(() => new Date());

  // Live clock so "submitted X minutes ago" stays accurate if the page sits open.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const submitted = useMemo(
    () => (submittedAt ? new Date(submittedAt) : new Date()),
    [submittedAt]
  );

  const submittedLabel = useMemo(() => {
    const diffMs = now - submitted;
    const diffMin = Math.floor(diffMs / 60_000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
    return submitted.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }, [now, submitted]);

  const handleReturn = () => {
    if (typeof onReturn === 'function') return onReturn();
    navigate('/student/dashboard');
  };
  useEffect(() => {
  // Prevent returning to the previous exam page.
  window.history.pushState(null, '', window.location.href);

  const handlePopState = () => {
    navigate('/admin/exams/Login', { replace: true });
  };

  window.addEventListener('popstate', handlePopState);

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}, [navigate]);

  return (
    <div className="mx-auto w-full flex items-center h-[100vh] max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      {/* ── Main success card ─────────────────────────────────────────── */}
      <section
        className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-10"
        aria-labelledby="exam-completed-title"
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EFF6FF] ring-8 ring-[#EFF6FF]/60">
              <CheckCircle2
                className="h-11 w-11 text-[#2563EB]"
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-[#2563EB]">
              <ShieldCheck className="h-3 w-3 text-white" strokeWidth={3} />
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <h1
            id="exam-completed-title"
            className="text-2xl font-semibold tracking-tight text-[#111827] sm:text-3xl"
          >
            Congratulations!
          </h1>
          <p className="mt-3 text-sm text-[#6B7280] sm:text-base">
            You have successfully completed your examination. You may leave the
            hall now and wait for your results to be released.
          </p>
        </div>

      

        {/* Results release notice */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
            <CalendarClock className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
           
            <p className="mt-1 text-sm text-[#6B7280]">{resultsReleaseText}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
