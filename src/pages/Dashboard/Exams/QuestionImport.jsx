import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { importQuestions, confirmImportedQuestions, addQuestion } from '../../../api/exam.api';
import Button from '../../../components/common/Button';

// Section 13: Upload PDF/Word -> AI extraction -> preview -> teacher
// edits/corrects -> confirm -> saved to question bank. Nothing is
// published without this human review step.
export default function QuestionImport({examType = 'obj'}) {
  const { id: examId } = useParams();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [manual, setManual] = useState({ text: '', A: '', B: '', C: '', D: '', correctOption: '' });
  const theoryExam = examType === 'theory';

  const handleUpload = async () => {
    if (!file) return;
    const { data } = await importQuestions(examId, file);
    setPreview(data.preview);
  };

  const updatePreviewItem = (idx, patch) => {
    setPreview((prev) => prev.map((q, i) => (i === idx ? { ...q, ...patch } : q)));
  };

  const handleConfirm = async () => {
    await confirmImportedQuestions(examId, preview);
    setPreview([]);
    setFile(null);
  };

  const handleAddManual = async (e) => {
    e.preventDefault();
    await addQuestion(examId, {
      text: manual.text,
      options: { A: manual.A, B: manual.B, C: manual.C, D: manual.D },
      correctOption: manual.correctOption,
    });
    setManual({ text: '', A: '', B: '', C: '', D: '', correctOption: '' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Manage Questions</h1>
        <p className="text-sm text-gray-500">Exam #{examId}</p>
      </div>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold mb-3">Import from PDF/Word</h2>
        <div className="flex gap-3 items-center">
          <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0])} />
          <Button variant="outline" onClick={handleUpload}>Extract Questions</Button>
        </div>

        {preview.length > 0 && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-amber-600">
              Review and correct every question below before confirming — nothing is saved yet.
            </p>
            {preview.map((q, i) => (
              <div key={i} className="border rounded-md p-3 space-y-2">
                <textarea
                  className="w-full border rounded-md px-2 py-1 text-sm"
                  value={q.text}
                  onChange={(e) => updatePreviewItem(i, { text: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <input
                      key={opt}
                      className="border rounded-md px-2 py-1 text-sm"
                      placeholder={`Option ${opt}`}
                      value={q.options?.[opt] || ''}
                      onChange={(e) =>
                        updatePreviewItem(i, { options: { ...q.options, [opt]: e.target.value } })
                      }
                    />
                  ))}
                </div>
                <input
                  className="border rounded-md px-2 py-1 text-sm w-32"
                  placeholder="Correct (A-D)"
                  value={q.correctOption}
                  onChange={(e) => updatePreviewItem(i, { correctOption: e.target.value })}
                />
              </div>
            ))}
            <Button onClick={handleConfirm}>Confirm & Save All</Button>
          </div>
        )}
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold mb-3">Add Question Manually</h2>
        <form onSubmit={handleAddManual} className="space-y-2">
          <textarea className="w-full border rounded-md px-2 py-1 text-sm"
     rows={!theoryExam ? 2 : 5} placeholder="Question"
            value={manual.text} onChange={(e) => setManual({ ...manual, text: e.target.value })} />
          
          {!theoryExam && <div className="grid grid-cols-2 gap-2">
            {['A', 'B', 'C', 'D'].map((opt) => (
              <input key={opt} className="border rounded-md px-2 py-1 text-sm" placeholder={`Option ${opt}`}
                value={manual[opt]} onChange={(e) => setManual({ ...manual, [opt]: e.target.value })} />
            ))}
          </div>}
          {!theoryExam && <input className="border rounded-md px-2 py-1 text-sm w-32" placeholder="Correct (A-D)"
            value={manual.correctOption} onChange={(e) => setManual({ ...manual, correctOption: e.target.value })} />}
          
          <Button type="submit" className='block mx-auto mt-8'>{theoryExam ? 'Submit Question' : 'Add Question'}</Button>
        </form>
      </section>
    </div>
  );
}
