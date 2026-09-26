import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExam, publishExam } from '../../../api/exam.api';
import Button from '../../../components/common/Button';

// Section 14: unlike OBJ, theory exams are recorded/graded by a
// teacher after the fact — there's no question-bank step here.
export default function CreateTheoryExam() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', classId: '', armId: '', subjectId: '', durationMinutes: 60, instructions: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await createExam({ ...form, type: 'THEORY' });
    await publishExam(data.exam.id);
    navigate('/dashboard/exams/theory');
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">Create Theory Exam</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <input className="w-full border rounded-md px-3 py-2 text-sm" placeholder="Exam Title"
          value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <div className="grid grid-cols-3 gap-3">
          <input className="border rounded-md px-3 py-2 text-sm" placeholder="Class ID"
            value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} />
          <input className="border rounded-md px-3 py-2 text-sm" placeholder="Arm ID"
            value={form.armId} onChange={(e) => setForm({ ...form, armId: e.target.value })} />
          <input className="border rounded-md px-3 py-2 text-sm" placeholder="Subject ID"
            value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} />
        </div>
        <input type="number" className="w-full border rounded-md px-3 py-2 text-sm" placeholder="Duration (minutes)"
          value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} />
        <textarea className="w-full border rounded-md px-3 py-2 text-sm" placeholder="Instructions"
          value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
        <Button type="submit" className="w-full">Create & Publish</Button>
      </form>
    </div>
  );
}
