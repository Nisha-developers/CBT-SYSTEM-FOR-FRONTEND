import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import TheoryQuestionEditor from '../../../components/common/TheoryQuestionEditor';
import {
  importQuestions, confirmImportedQuestions, addQuestion, listQuestions, deleteQuestion, getExamAdmin, uploadQuestionImage
} from '../../../api/exam.api';
import { apiError } from '../../../api/axios';
import Button from '../../../components/common/Button';

const emptyManual = {
  text: '', passage: '',
  A: '', B: '', C: '', D: '',
  correctOption: '',
};

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const plainToHtml = (text) =>
  String(text || '')
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
    .join('');

const looksLikeHtml = (s) => /<\/?[a-z][\s\S]*>/i.test(s || '');

const toStoredHtml = (s) => (looksLikeHtml(s) ? s : plainToHtml(s));

const isEmptyHtml = (html) => {
  const safe = html || '';
  if (/<img\b/i.test(safe)) return false;
  return !safe.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

// Rich preview render (sanitized) for saved OBJ questions
const HtmlBlock = ({ html, className = '' }) => (
  <div
    className={
      'break-words [&_p]:mb-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 ' +
      '[&_strong]:font-semibold [&_em]:italic [&_u]:underline ' +
      '[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_img]:my-2 [&_img]:inline-block ' +
      className
    }
    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html || '') }}
  />
);

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
  const optionKeys = trueOrFalse ? ['A', 'B'] : ['A', 'B', 'C', 'D'];

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

  useEffect(() => {
    setPreview([]);
    setPreviewInfo(null);
    setMsg({ type: '', text: '' });
    refresh();
  }, [refresh]);

  if (!examId) {
    return <p className="text-sm text-gray-500">Pick an exam from the list and click “Set Examination” to manage its questions.</p>;
  }

  const total = theoryExam ? null : exam?.totalQuestions ?? 0;
  const hasQuestionCapacity = theoryExam || questions.length < total;
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

  // Convert a single preview question to its stored form (rich → rich, plain → HTML)
  const toStoredQuestion = (q) => {
    if (theoryExam) return { text: toStoredHtml(q.text) };
    return {
      text: toStoredHtml(q.text),
      passage: exam?.passage ? toStoredHtml(q.passage || '') : null,
      options: Object.fromEntries(
        optionKeys.map((k) => [k, toStoredHtml(q.options?.[k] || '')])
      ),
      correctOption: (q.correctOption || '').toUpperCase().slice(0, 1),
    };
  };

  const handleConfirm = async () => {
    const filtered = preview.filter((q) => q.text && !isEmptyHtml(q.text));
    if (filtered.length === 0) {
      return setMsg({ type: 'error', text: 'Add at least one question with text before confirming.' });
    }
    const questionsToSave = filtered.map(toStoredQuestion);

    setBusy(true);
    try {
      await confirmImportedQuestions(examId, questionsToSave);
      setPreview([]);
      setPreviewInfo(null);
      setFile(null);
      await done(`${questionsToSave.length} question${questionsToSave.length === 1 ? '' : 's'} saved.`);
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err) });
    } finally {
      setBusy(false);
    }
  };

  const handleAddManual = async (e) => {
    e.preventDefault();

    if (isEmptyHtml(manual.text)) {
      return setMsg({ type: 'error', text: 'Add some question text or an image before submitting.' });
    }

    if (!theoryExam) {
      for (const k of optionKeys) {
        if (isEmptyHtml(manual[k])) {
          return setMsg({ type: 'error', text: `Option ${k} is required.` });
        }
      }
      if (!optionKeys.includes(manual.correctOption)) {
        return setMsg({ type: 'error', text: `Correct option must be one of ${optionKeys.join(', ')}.` });
      }
    }

    setBusy(true);
    try {
      const payload = theoryExam
        ? { text: manual.text }
        : {
            text: manual.text,
            passage: exam?.passage ? (manual.passage || '') : null,
            options: Object.fromEntries(optionKeys.map((k) => [k, manual[k]])),
            correctOption: manual.correctOption,
          };

      await addQuestion(examId, payload);
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

  const handleImageUpload = async (file) => {
    const { data } = await uploadQuestionImage(examId, file);
    return data.url;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Manage Questions</h1>
        <p className="text-sm text-gray-500">
          {exam ? `${exam.title} · ${exam.subject} · ${exam.class}` : 'Loading…'}
          {exam && (theoryExam
            ? <> — <b>{questions.length}</b> questions added</>
            : <> — <b>{questions.length}</b> of <b>{total}</b> questions added</>)}
        </p>
        {theoryExam && (
          <p className="text-xs text-gray-500 mt-1">
            Add at least one question before opening the exam. There is no configured question limit.
          </p>
        )}
        {locked && <p className="text-xs text-amber-600 mt-1">Students have started this exam, so its questions are locked.</p>}
      </div>

      {msg.text && (
        <div className={`text-sm rounded-lg px-4 py-2.5 border ${msg.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
          {msg.text}
        </div>
      )}

      {/* ---------- IMPORT PREVIEW ---------- */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold mb-1">Import from PDF/Word</h2>
        <p className="text-xs text-gray-500 mb-3">
          {theoryExam
            ? 'Number each question like “1. Question text”.'
            : 'Number each question “1. …” with options “A. …” and an “Answer: B” line (or an answer key at the end).'}
        </p>
        <div className="flex gap-3 items-center flex-wrap">
          <input type="file" accept=".pdf,.docx" disabled={locked || !hasQuestionCapacity}
            onChange={(e) => setFile(e.target.files[0])} />
          <Button variant="outline" onClick={handleUpload} disabled={busy || locked || !hasQuestionCapacity}>
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
                  <button type="button" className="text-xs text-red-500" onClick={() => setPreview((p) => p.filter((_, k) => k !== i))}>Remove</button>
                </div>
                <textarea
                  className="w-full border rounded-md px-2 py-1 text-sm"
                  placeholder="Question text"
                  value={q.text}
                  onChange={(e) => updatePreviewItem(i, { text: e.target.value })}
                />
                {!theoryExam && (
                  <>
                    {exam?.passage && (
                      <textarea
                        className="w-full border rounded-md px-2 py-1 text-sm"
                        rows={3}
                        placeholder="Passage (optional)"
                        value={q.passage || ''}
                        onChange={(e) => updatePreviewItem(i, { passage: e.target.value })}
                      />
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {optionKeys.map((opt) => (
                        <textarea
                          key={opt}
                          rows={2}
                          className="border rounded-md px-2 py-1 text-sm"
                          placeholder={`Option ${opt}`}
                          value={q.options?.[opt] || ''}
                          onChange={(e) => updatePreviewItem(i, { options: { ...q.options, [opt]: e.target.value } })}
                        />
                      ))}
                    </div>
                    <input
                      className={`border rounded-md px-2 py-1 text-sm w-40 ${q.correctOption ? '' : 'border-red-300'}`}
                      placeholder={`Correct (${optionKeys.join('/')})`}
                      value={q.correctOption || ''}
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

      {/* ---------- MANUAL ADD ---------- */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold mb-3">Add Question Manually</h2>
        {!hasQuestionCapacity && <p className="text-sm text-gray-500">All {total} questions have been added.</p>}
        {hasQuestionCapacity && (
          <form onSubmit={handleAddManual} className="space-y-3">
            {!theoryExam && exam?.passage && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Passage (optional)</label>
                <TheoryQuestionEditor
                  value={manual.passage}
                  onChange={(html) => setManual((prev) => ({ ...prev, passage: html }))}
                  onImageUpload={handleImageUpload}
                  disabled={locked || busy}
                  placeholder="Passage shown above the question…"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Question</label>
              <TheoryQuestionEditor
                value={manual.text}
                onChange={(html) => setManual((prev) => ({ ...prev, text: html }))}
                onImageUpload={handleImageUpload}
                disabled={locked || busy}
                placeholder="Question text…"
              />
            </div>

            {!theoryExam && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {optionKeys.map((opt) => (
                    <div key={opt}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Option {opt}</label>
                      <TheoryQuestionEditor
                        compact
                        value={manual[opt]}
                        onChange={(html) => setManual((prev) => ({ ...prev, [opt]: html }))}
                        onImageUpload={handleImageUpload}
                        disabled={locked || busy}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Correct option ({optionKeys.join('/')})
                  </label>
                  <input
                    className="border rounded-md px-2 py-1 text-sm w-40"
                    placeholder={`A/B/${optionKeys.slice(2).join('/') || '…'}`}
                    value={manual.correctOption}
                    onChange={(e) => setManual({ ...manual, correctOption: e.target.value.toUpperCase().slice(0, 1) })}
                  />
                </div>
              </>
            )}

            <Button type="submit" disabled={busy || locked} className="block mx-auto mt-8">
              {theoryExam ? 'Submit Question' : 'Add Question'}
            </Button>
          </form>
        )}
      </section>

      {/* ---------- SAVED QUESTIONS ---------- */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold mb-3">Saved Questions ({questions.length})</h2>
        {questions.length === 0 && <p className="text-sm text-gray-400">No questions yet.</p>}
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q.id} className="border rounded-md p-3 text-sm">
              <div className="flex justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex gap-2">
                    <span className="shrink-0 font-medium">{i + 1}.</span>
                    <HtmlBlock html={q.text} className="font-medium" />
                  </div>

                  {q.passage && (
                    <div className="mt-2 pl-4 border-l-2 border-gray-200">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Passage</p>
                      <HtmlBlock html={q.passage} className="text-gray-700 italic text-sm" />
                    </div>
                  )}

                  {q.options && (
                    <ul className="mt-2 space-y-1">
                      {Object.entries(q.options)
                        .filter(([, v]) => v)
                        .map(([k, v]) => (
                          <li key={k} className={k === q.correctOption ? 'text-emerald-700 font-medium' : 'text-gray-700'}>
                            <div className="flex gap-2">
                              <span className="shrink-0 font-semibold">{k}.</span>
                              <HtmlBlock html={v} className="min-w-0" />
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
                {!locked && (
                  <button type="button" className="text-xs text-red-500 shrink-0 self-start" onClick={() => handleDelete(q)}>
                    Delete
                  </button>
                )}
              </div>
              {!theoryExam && q.marks !== undefined && <p className="text-xs text-gray-400 mt-1">{q.marks} marks</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}