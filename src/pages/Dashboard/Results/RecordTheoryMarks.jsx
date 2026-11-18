import { useEffect, useState } from 'react';
import { listExams } from '../../../api/exam.api';
import { theorySheet, recordTheoryMarks } from '../../../api/result.api';
import { apiError } from '../../../api/axios';
import Button from '../../../components/common/Button';
import { useAuthStore } from '../../../store/useAuthStore';

// Teachers record the final score for each student who has submitted the theory exam.
export default function RecordTheoryMarks() {
  const [exams, setExams] = useState([]);
  const [examId, setExamId] = useState('');
  const [sheet, setSheet] = useState(null);
  const [drafts, setDrafts] = useState({});       // studentUid -> { score, remarks }
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [savingId, setSavingId] = useState(null);
  const scoreLimit = Number(
    sheet?.exam?.percentageMark ?? exams.find((exam) => exam.id === examId)?.percentageMark
  );
  const hasScoreLimit = Number.isFinite(scoreLimit);
 const { user } = useAuthStore();
  const currentRole = user?.role
    ? user.role.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Role unavailable';
 

  useEffect(() => {
    listExams({ type: 'THEORY' })
      .then(({ data }) => setExams(data.exams))
      .catch((err) => setMsg({ type: 'error', text: apiError(err, 'Could not load theory exams.') }));
  }, []);

  const loadSheet = async (id) => {
    setSheet(null); setMsg({ type: '', text: '' });
    if (!id) return;
    try {
      const { data } = await theorySheet(id);
      setSheet(data);
      setDrafts(Object.fromEntries(data.students.map((s) => [s.id, { score: s.score ?? '', remarks: s.remarks }])));
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err) });
    }
  };

  const setDraft = (id, patch) => setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  const save = async (student) => {
    const d = drafts[student.id];
    if (student?.status !== 'Done') {
      return setMsg({ type: 'error', text: `${student.name} must submit the exam before a score can be recorded.` });
    }
    if (d.score === '' || d.score === null) return setMsg({ type: 'error', text: `Enter a score for ${student.name}.` });
    const score = Number(d.score);
    if (!hasScoreLimit) return setMsg({ type: 'error', text: 'The theory exam percentage mark is unavailable.' });
    if (!Number.isFinite(score) || score < 0 || score > scoreLimit) {
      return setMsg({ type: 'error', text: `Enter a score from 0 to ${scoreLimit} for ${student.name}.` });
    }
    setSavingId(student.id);
   
    try {
      await recordTheoryMarks({ examId, studentId: student.id, score, remarks: d.remarks || '' });
      setMsg({ type: 'success', text: `Saved ${student.name}'s marks.` });
      setSheet((sh) => ({
        ...sh, students: sh.students.map((s) => (s.id === student.id ? { ...s, score, remarks: d.remarks || '' } : s)),
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
        <p className="text-sm text-gray-500 mt-1">Students write their answers in a booklet and submit the exam online. Mark the booklet, then enter each submitted student's final score up to the exam percentage mark.</p>
      </div>

      <select
        className="border rounded-md px-3 py-2 text-sm w-full max-w-md"
        value={examId}
        onChange={(e) => { setExamId(e.target.value); loadSheet(e.target.value); }}
      >
        <option value="">Select a theory exam…</option>
        {exams.map((e) => <option key={e.id} value={e.id}>{e.title} — {e.subject} ({e.class})</option>)}
      </select>

      {msg.text && (
        <div className={`text-sm rounded-lg px-4 py-2.5 border ${msg.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>{msg.text}</div>
      )}

      {sheet && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-5 py-3 border-b text-sm text-gray-600">
            {sheet.exam.title} · maximum score <b>{hasScoreLimit ? scoreLimit : 'unavailable'}</b>
          </div>
          <p className="px-5 py-3 text-xs text-gray-500 bg-gray-50 border-b">
            Mark each student's booklet outside the app, then record the final score here.
          </p>
          {sheet.students.length === 0 && <p className="p-5 text-sm text-gray-400">No students are registered for this exam.</p>}
          {sheet.students.map((s) => (
            <div key={s.id} className="border-b last:border-0">
              <div className="px-5 py-3 flex flex-col md:flex-row md:items-center gap-3">
                <div className="md:w-56">
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.studentId} · {s?.status === 'Done' ? 'Done' : 'Not done'}</p>
                </div>
                <input type="number" min="0" max={hasScoreLimit ? scoreLimit : undefined} step="any"
                  placeholder={hasScoreLimit ? `/ ${scoreLimit}` : 'Score'}
                  disabled={!(s?.status === 'Done') || !hasScoreLimit}
                  className="border rounded-md px-3 py-2 text-sm w-28 disabled:bg-gray-100 disabled:text-gray-400"
                  value={drafts[s.id]?.score ?? ''} onChange={(e) => setDraft(s.id, { score: e.target.value })} />
                <input placeholder="Remarks (optional)" disabled={!(s?.status === 'Done')}
                  className="border rounded-md px-3 py-2 text-sm flex-1 disabled:bg-gray-100 disabled:text-gray-400"
                  value={drafts[s.id]?.remarks ?? ''} onChange={(e) => setDraft(s.id, { remarks: e.target.value })} />
                <div className="flex gap-3 items-center">


<Button
  type="button"
  onClick={() => {
    if (s.score !== null && currentRole === 'Admin') {
      setMsg({type:'error', text: 'You are not allowed to do that '})
    } else {
     save(s);
    }
  }}
  disabled={savingId === s.id || !(s?.status === 'Done') || !hasScoreLimit}
>
  {savingId === s.id ? 'Saving…' : s.score !== null ? 'Update' : 'Save'}
</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
