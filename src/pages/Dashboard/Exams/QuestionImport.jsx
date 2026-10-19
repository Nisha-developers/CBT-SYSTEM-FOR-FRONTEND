import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  importQuestions, confirmImportedQuestions, addQuestion, listQuestions, deleteQuestion, getExamAdmin,
} from '../../../api/exam.api';
import { apiError } from '../../../api/axios';
import Button from '../../../components/common/Button';

const emptyManual = { text: '', passage: '', A: '', B: '', C: '', D: '', correctOption: '' };

// Upload PDF/Word -> extraction -> preview -> teacher edits/corrects -> confirm -> saved.
// Nothing is saved without this human review step. Questions can also be added by hand.
// Works from the exam list (exam prop) or from /exams/:type/:id/import (route param).
export default function QuestionImport({ exam: examProp, onChanged }) {
  const { id: routeId } = useParams();
  const [exam, setExam] = useState(examProp || null);
  const examId = examProp?.id || routeId;

  const [questions, setQuestions] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [previewInfo, setPreviewInfo] = useState(null);
  const [manual, setManual] = useState(emptyManual);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const theoryExam = examId?.startsWith('theory-');
  const trueOrFalse = !!exam?.trueOrFalse;
  const options = trueOrFalse ? ['A', 'B'] : ['A', 'B', 'C', 'D'];

  const refresh = useCallback(async () => {
    if (!examId) return;
    try {
      const [{ data: q }, { data: e }] = await Promise.all([listQuestions(examId), getExamAdmin(examId)]);
      setQuestions(q.questions);
      setExam(e.exam);
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err, 'Could not load this exam.') });
    }
  }, [examId]);

  useEffect(() => { setPreview([]); setPreviewInfo(null); setMsg({ type: '', text: '' }); refresh(); }, [refresh]);

  if (!examId) {
    return <p className="text-sm text-gray-500">Pick an exam from the list and click “Set Examination” to manage its questions.</p>;
  }

  const total = exam?.totalQuestions ?? 0;
  const room = Math.max(0, total - questions.length);
  const locked = !!exam?.hasAttempts;

  const done = async (text) => {
    setMsg({ type: 'success', text });
    await refresh();
    onChanged?.();
  };

  const handleUpload = async () => {
    if (!file) return setMsg({ type: 'error', text: 'Choose a PDF or Word file first.' });
    setBusy(true);
    setMsg({ type: '', text: '' });
    try {
      const { data } = await importQuestions(examId, file);
      setPreview(data.preview);
      setPreviewInfo({ method: data.method, warning: data.warning });
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err) });
    } finally {
      setBusy(false);
    }
  };

  const updatePreviewItem = (idx, patch) =>
    setPreview((prev) => prev.map((q, i) => (i === idx ? { ...q, ...patch } : q)));

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await confirmImportedQuestions(examId, preview);
      setPreview([]);
      setPreviewInfo(null);
      setFile(null);
      await done(`${preview.length} question${preview.length === 1 ? '' : 's'} saved.`);
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err) });
    } finally {
      setBusy(false);
    }
  };

  const handleAddManual = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await addQuestion(examId, theoryExam ? { text: manual.text } : {
        text: manual.text,
        passage: exam?.passage ? manual.passage : null,
        options: { A: manual.A, B: manual.B, C: manual.C, D: manual.D },
        correctOption: manual.correctOption,
      });
      setManual(emptyManual);
      await done('Question added.');
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err) });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (q) => {
    if (!window.confirm('Remove this question?')) return;
    try {
      await deleteQuestion(examId, q.id);
      await done('Question removed.');
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err) });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Manage Questions</h1>
        <p className="text-sm text-gray-500">
          {exam ? `${exam.title} · ${exam.subject} · ${exam.fullClassName}` : 'Loading…'}
          {exam && <> — <b>{questions.length}</b> of <b>{total}</b> questions added</>}
        </p>
        {locked && <p className="text-xs text-amber-600 mt-1">Students have started this exam, so its questions are locked.</p>}
      </div>

      {msg.text && (
        <div className={`text-sm rounded-lg px-4 py-2.5 border ${msg.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
          {msg.text}
        </div>
      )}

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold mb-1">Import from PDF/Word</h2>
        <p className="text-xs text-gray-500 mb-3">
          {theoryExam
            ? 'Number each question like “1. Question text”.'
            : 'Number each question “1. …” with options “A. …” and an “Answer: B” line (or an answer key at the end).'}
        </p>
        <div className="flex gap-3 items-center flex-wrap">
          <input type="file" accept=".pdf,.docx" disabled={locked || room === 0}
            onChange={(e) => setFile(e.target.files[0])} />
          <Button variant="outline" onClick={handleUpload} disabled={busy || locked || room === 0}>
            {busy && !preview.length ? 'Reading…' : 'Extract Questions'}
          </Button>
        </div>

        {preview.length > 0 && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-amber-600">
              Review and correct every question below before confirming — nothing is saved yet.
              {previewInfo?.method === 'ai' ? ' (Extracted with AI.)' : ''}
            </p>
            {previewInfo?.warning && <p className="text-sm text-red-600">{previewInfo.warning}</p>}
            {preview.map((q, i) => (
              <div key={i} className="border rounded-md p-3 space-y-2">
                <div className="flex justify-between gap-2">
                  <span className="text-xs text-gray-400">Question {i + 1}</span>
                  <button className="text-xs text-red-500" onClick={() => setPreview((p) => p.filter((_, k) => k !== i))}>Remove</button>
                </div>
                <textarea
                  className="w-full border rounded-md px-2 py-1 text-sm"
                  value={q.text}
                  onChange={(e) => updatePreviewItem(i, { text: e.target.value })}
                />
                {!theoryExam && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      {options.map((opt) => (
                        <input
                          key={opt}
                          className="border rounded-md px-2 py-1 text-sm"
                          placeholder={`Option ${opt}`}
                          value={q.options?.[opt] || ''}
                          onChange={(e) => updatePreviewItem(i, { options: { ...q.options, [opt]: e.target.value } })}
                        />
                      ))}
                    </div>
                    <input
                      className={`border rounded-md px-2 py-1 text-sm w-40 ${q.correctOption ? '' : 'border-red-300'}`}
                      placeholder={`Correct (${options.join('/')})`}
                      value={q.correctOption}
                      onChange={(e) => updatePreviewItem(i, { correctOption: e.target.value.toUpperCase().slice(0, 1) })}
                    />
                  </>
                )}
              </div>
            ))}
            <Button onClick={handleConfirm} disabled={busy}>Confirm & Save All</Button>
          </div>
        )}
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold mb-3">Add Question Manually</h2>
        {room === 0 && <p className="text-sm text-gray-500">All {total} questions have been added.</p>}
        {room > 0 && (
          <form onSubmit={handleAddManual} className="space-y-2">
            {!theoryExam && exam?.passage && (
              <textarea className="w-full border rounded-md px-2 py-1 text-sm" rows={3} placeholder="Passage (optional)"
                value={manual.passage} onChange={(e) => setManual({ ...manual, passage: e.target.value })} />
            )}
            <textarea className="w-full border rounded-md px-2 py-1 text-sm" required disabled={locked}
              rows={!theoryExam ? 2 : 5} placeholder="Question"
              value={manual.text} onChange={(e) => setManual({ ...manual, text: e.target.value })} />

            {!theoryExam && (
              <div className="grid grid-cols-2 gap-2">
                {options.map((opt) => (
                  <input key={opt} className="border rounded-md px-2 py-1 text-sm" placeholder={`Option ${opt}`} required
                    value={manual[opt]} onChange={(e) => setManual({ ...manual, [opt]: e.target.value })} />
                ))}
              </div>
            )}
            {!theoryExam && (
              <input className="border rounded-md px-2 py-1 text-sm w-40" placeholder={`Correct (${options.join('/')})`} required
                value={manual.correctOption}
                onChange={(e) => setManual({ ...manual, correctOption: e.target.value.toUpperCase().slice(0, 1) })} />
            )}

            <Button type="submit" disabled={busy || locked} className="block mx-auto mt-8">
              {theoryExam ? 'Submit Question' : 'Add Question'}
            </Button>
          </form>
        )}
      </section>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold mb-3">Saved Questions ({questions.length})</h2>
        {questions.length === 0 && <p className="text-sm text-gray-400">No questions yet.</p>}
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q.id} className="border rounded-md p-3 text-sm">
              <div className="flex justify-between gap-3">
                <p className="font-medium">{i + 1}. {q.text}</p>
                {!locked && <button className="text-xs text-red-500 shrink-0" onClick={() => handleDelete(q)}>Delete</button>}
              </div>
              {q.passage && <p className="text-xs text-gray-500 mt-1 italic">Passage: {q.passage}</p>}
              {q.options && (
                <ul className="mt-1 text-gray-600 grid grid-cols-2 gap-x-4">
                  {Object.entries(q.options).filter(([, v]) => v).map(([k, v]) => (
                    <li key={k} className={k === q.correctOption ? 'text-emerald-600 font-medium' : ''}>{k}. {v}</li>
                  ))}
                </ul>
              )}
              {q.marks !== undefined && <p className="text-xs text-gray-400 mt-1">{q.marks} marks</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
