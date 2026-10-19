import { useEffect, useState } from 'react';
import { listExams } from '../../../api/exam.api';
import { theorySheet, theoryAnswers, recordTheoryMarks } from '../../../api/result.api';
import { apiError } from '../../../api/axios';
import Button from '../../../components/common/Button';

// Theory exams are marked by a teacher: pick the exam, read each student's answers,
// and record their score (out of the exam's total mark).
export default function RecordTheoryMarks() {
  const [exams, setExams] = useState([]);
  const [examId, setExamId] = useState('');
  const [sheet, setSheet] = useState(null);
  const [drafts, setDrafts] = useState({});       // studentUid -> { score, remarks }
  const [open, setOpen] = useState(null);         // studentUid whose answers are shown
  const [answers, setAnswers] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    listExams({ type: 'THEORY' })
      .then(({ data }) => setExams(data.exams))
      .catch((err) => setMsg({ type: 'error', text: apiError(err, 'Could not load theory exams.') }));
  }, []);

  const loadSheet = async (id) => {
    setSheet(null); setOpen(null); setMsg({ type: '', text: '' });
    if (!id) return;
    try {
      const { data } = await theorySheet(id);
      setSheet(data);
      setDrafts(Object.fromEntries(data.students.map((s) => [s.id, { score: s.score ?? '', remarks: s.remarks }])));
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err) });
    }
  };

  const toggleAnswers = async (student) => {
    if (open === student.id) return setOpen(null);
    setOpen(student.id);
    setAnswers([]);
    try {
      const { data } = await theoryAnswers(examId, student.id);
      setAnswers(data.answers);
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err) });
    }
  };

  const setDraft = (id, patch) => setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  const save = async (student) => {
    const d = drafts[student.id];
    if (d.score === '' || d.score === null) return setMsg({ type: 'error', text: `Enter a score for ${student.name}.` });
    setSavingId(student.id);
    try {
      await recordTheoryMarks({ examId, studentId: student.id, score: Number(d.score), remarks: d.remarks || '' });
      setMsg({ type: 'success', text: `Saved ${student.name}'s marks.` });
      setSheet((sh) => ({
        ...sh, students: sh.students.map((s) => (s.id === student.id ? { ...s, score: Number(d.score), remarks: d.remarks || '' } : s)),
      }));
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err) });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Record Theory Marks</h1>
        <p className="text-sm text-gray-500 mt-1">Theory answers are marked by a teacher. Choose an exam, then enter each student's score.</p>
      </div>

      <select
        className="border rounded-md px-3 py-2 text-sm w-full max-w-md"
        value={examId}
        onChange={(e) => { setExamId(e.target.value); loadSheet(e.target.value); }}
      >
        <option value="">Select a theory exam…</option>
        {exams.map((e) => <option key={e.id} value={e.id}>{e.title} — {e.subject} ({e.fullClassName})</option>)}
      </select>

      {msg.text && (
        <div className={`text-sm rounded-lg px-4 py-2.5 border ${msg.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>{msg.text}</div>
      )}

      {sheet && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-5 py-3 border-b text-sm text-gray-600">
            {sheet.exam.title} · marked out of <b>{sheet.maxScore}</b>
          </div>
          {sheet.students.length === 0 && <p className="p-5 text-sm text-gray-400">No students are registered for this exam.</p>}
          {sheet.students.map((s) => (
            <div key={s.id} className="border-b last:border-0">
              <div className="px-5 py-3 flex flex-col md:flex-row md:items-center gap-3">
                <div className="md:w-56">
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.studentId} · {s.submitted ? 'Submitted' : s.attempted ? 'In progress' : 'Not taken'}</p>
                </div>
                <input type="number" min="0" max={sheet.maxScore} step="0.5" placeholder={`/ ${sheet.maxScore}`}
                  className="border rounded-md px-3 py-2 text-sm w-28"
                  value={drafts[s.id]?.score ?? ''} onChange={(e) => setDraft(s.id, { score: e.target.value })} />
                <input placeholder="Remarks (optional)" className="border rounded-md px-3 py-2 text-sm flex-1"
                  value={drafts[s.id]?.remarks ?? ''} onChange={(e) => setDraft(s.id, { remarks: e.target.value })} />
                <div className="flex gap-3 items-center">
                  {s.attempted && (
                    <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => toggleAnswers(s)}>
                      {open === s.id ? 'Hide answers' : 'View answers'}
                    </button>
                  )}
                  <Button type="button" onClick={() => save(s)} disabled={savingId === s.id}>
                    {savingId === s.id ? 'Saving…' : s.score !== null ? 'Update' : 'Save'}
                  </Button>
                </div>
              </div>
              {open === s.id && (
                <div className="px-5 pb-4 space-y-3 bg-gray-50">
                  {answers.length === 0 && <p className="text-xs text-gray-400 pt-3">Loading…</p>}
                  {answers.map((a, i) => (
                    <div key={a.id} className="text-sm pt-3">
                      <p className="font-medium">{i + 1}. {a.question} <span className="text-xs text-gray-400">({a.marks} marks)</span></p>
                      <p className="mt-1 whitespace-pre-wrap text-gray-700">{a.answer || <i className="text-gray-400">No answer</i>}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
