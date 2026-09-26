import { useState } from 'react';
import { recordTheoryMarks } from '../../../api/result.api';
import Button from '../../../components/common/Button';

// Theory marks are entered per student, per exam, since there's no
// automatic marking for theory (Section 16).
export default function RecordTheoryMarks() {
  const [form, setForm] = useState({
    examId: '', studentId: '', score: '', maxScore: '', remarks: '', session: '', term: 'first',
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await recordTheoryMarks(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">Record Theory Marks</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-3">
        {saved && <p className="text-sm text-green-600">Saved.</p>}
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded-md px-3 py-2 text-sm" placeholder="Exam ID"
            value={form.examId} onChange={(e) => setForm({ ...form, examId: e.target.value })} />
          <input className="border rounded-md px-3 py-2 text-sm" placeholder="Student ID"
            value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
          <input className="border rounded-md px-3 py-2 text-sm" placeholder="Score"
            value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} />
          <input className="border rounded-md px-3 py-2 text-sm" placeholder="Max Score"
            value={form.maxScore} onChange={(e) => setForm({ ...form, maxScore: e.target.value })} />
          <input className="border rounded-md px-3 py-2 text-sm" placeholder="Session (2025/2026)"
            value={form.session} onChange={(e) => setForm({ ...form, session: e.target.value })} />
          <select className="border rounded-md px-3 py-2 text-sm" value={form.term}
            onChange={(e) => setForm({ ...form, term: e.target.value })}>
            <option value="first">First Term</option>
            <option value="second">Second Term</option>
            <option value="third">Third Term</option>
          </select>
        </div>
        <textarea className="w-full border rounded-md px-3 py-2 text-sm" placeholder="Teacher remarks"
          value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
        <Button type="submit" className="w-full">Save Marks</Button>
      </form>
    </div>
  );
}
