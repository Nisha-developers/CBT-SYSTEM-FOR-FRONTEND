import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import TheoryQuestionEditor from '../../../components/common/TheoryQuestionEditor';
import {
  importQuestions, confirmImportedQuestions, addQuestion, listQuestions, deleteQuestion,
  getExamAdmin, uploadQuestionImage, createPassage, updatePassage, deletePassage,
} from '../../../api/exam.api';
import { apiError } from '../../../api/axios';
import Button from '../../../components/common/Button';
import { ToggleLeft, ToggleRight } from 'lucide-react';

const emptyManual = { text: '', A: '', B: '', C: '', D: '', correctOption: '' };

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const plainToHtml = (text) => String(text || '').split(/\n{2,}/).map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`).join('');
const looksLikeHtml = (s) => /<\/?[a-z][\s\S]*>/i.test(s || '');
const toStoredHtml = (s) => (looksLikeHtml(s) ? s : plainToHtml(s));
const isEmptyHtml = (html) => {
  const safe = html || '';
  if (/<img\b/i.test(safe)) return false;
  return !safe.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

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
  const [passages, setPassages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [previewInfo, setPreviewInfo] = useState(null);
  const [manual, setManual] = useState(emptyManual);
  const [manualIsTF, setManualIsTF] = useState(false);
  const [activePassageUid, setActivePassageUid] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const theoryExam = examId?.startsWith('theory-');
  const passageOn = !!exam?.passage;
  const tfOn = !!exam?.trueOrFalse;
  const optionKeys = manualIsTF ? ['A', 'B'] : ['A', 'B', 'C', 'D'];

  const refresh = useCallback(async () => {
    if (!examId) return;
    try {
      const [{ data: q }, { data: e }] = await Promise.all([listQuestions(examId), getExamAdmin(examId)]);
      setQuestions(q.questions);
      setExam(e.exam);
      setPassages(e.exam?.passages || []);
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err, 'Could not load this exam.') });
    }
  }, [examId]);

  useEffect(() => {
    setPreview([]); setPreviewInfo(null); setMsg({ type: '', text: '' });
    refresh();
  }, [refresh]);

  useEffect(() => {
    setManualIsTF(tfOn);
  }, [tfOn]);

  if (!examId) {
    return <p className="text-sm text-gray-500">Pick an exam from the list and click "Set Examination" to manage its questions.</p>;
  }

  const total = theoryExam ? null : exam?.totalQuestions ?? 0;
  const hasQuestionCapacity = theoryExam || questions.length < total;
  const locked = !!exam?.hasAttempts;

  const done = async (text) => { setMsg({ type: 'success', text }); await refresh(); onChanged?.(); };

  const handleUpload = async () => {
    if (!file) return setMsg({ type: 'error', text: 'Choose a PDF or Word file first.' });
    setBusy(true); setMsg({ type: '', text: '' });
    try {
      const { data } = await importQuestions(examId, file);
      setPreview(data.preview);
      setPreviewInfo({ method: data.method, warning: data.warning });
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err) });
    } finally { setBusy(false); }
  };

  const updatePreviewItem = (idx, patch) =>
    setPreview((prev) => prev.map((q, i) => (i === idx ? { ...q, ...patch } : q)));

  const toStoredQuestion = (q) => {
    if (theoryExam) return { text: toStoredHtml(q.text) };
    return {
      text: toStoredHtml(q.text),
      passageUid: passageOn ? (q.passageUid || null) : null,
      isTrueFalse: tfOn ? !!q.isTrueFalse : false,
      options: Object.fromEntries(optionKeys.map((k) => [k, toStoredHtml(q.options?.[k] || '')])),
      correctOption: (q.correctOption || '').toUpperCase().slice(0, 1),
    };
  };

  const handleConfirm = async () => {
    const filtered = preview.filter((q) => q.text && !isEmptyHtml(q.text));
    if (filtered.length === 0) return setMsg({ type: 'error', text: 'Add at least one question with text before confirming.' });
    setBusy(true);
    try {
      await confirmImportedQuestions(examId, filtered.map(toStoredQuestion));
      setPreview([]); setPreviewInfo(null); setFile(null);
      await done(`${filtered.length} question${filtered.length === 1 ? '' : 's'} saved.`);
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err) });
    } finally { setBusy(false); }
  };

  const handleAddManual = async (e) => {
    e.preventDefault();
    if (isEmptyHtml(manual.text)) return setMsg({ type: 'error', text: 'Add some question text or an image before submitting.' });
    if (!theoryExam) {
      for (const k of optionKeys) if (isEmptyHtml(manual[k])) return setMsg({ type: 'error', text: `Option ${k} is required.` });
      if (!optionKeys.includes(manual.correctOption)) return setMsg({ type: 'error', text: `Correct option must be one of ${optionKeys.join(', ')}.` });
    }
    setBusy(true);
    try {
      const payload = theoryExam
        ? { text: manual.text }
        : {
            text: manual.text,
            passageUid: passageOn ? (activePassageUid || null) : null,
            isTrueFalse: tfOn ? manualIsTF : false,
            options: Object.fromEntries(optionKeys.map((k) => [k, manual[k]])),
            correctOption: manual.correctOption,
          };
      await addQuestion(examId, payload);
      setManual(emptyManual);
      await done('Question added.');
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err) });
    } finally { setBusy(false); }
  };

  const handleDelete = async (q) => {
    if (!window.confirm('Remove this question?')) return;
    try { await deleteQuestion(examId, q.id); await done('Question removed.'); }
    catch (err) { setMsg({ type: 'error', text: apiError(err) }); }
  };

  const handleImageUpload = async (file) => {
    const { data } = await uploadQuestionImage(examId, file);
    return data.url;
  };

  const handleAddPassage = async () => {
    try {
      const { data } = await createPassage(examId, { body: '<p>New passage</p>', isCompulsory: true });
      setPassages((p) => [...p, data.passage]);
      setActivePassageUid(data.passage.uid);
    } catch (err) { setMsg({ type: 'error', text: apiError(err) }); }
  };

  const handleToggleCompulsory = async (p) => {
    try {
      const next = !p.is_compulsory;
      await updatePassage(examId, p.uid, { isCompulsory: next });
      setPassages((prev) => prev.map((x) => (x.uid === p.uid ? { ...x, is_compulsory: next ? 1 : 0 } : x)));
    } catch (err) { setMsg({ type: 'error', text: apiError(err) }); }
  };

  const handleUpdatePassageBody = async (p, body) => {
    try { await updatePassage(examId, p.uid, { body }); }
    catch (err) { setMsg({ type: 'error', text: apiError(err) }); }
  };

  const handleUpdatePassageTitle = async (p, title) => {
    try { await updatePassage(examId, p.uid, { title: title || null }); }
    catch (err) { setMsg({ type: 'error', text: apiError(err) }); }
  };

  const handleDeletePassage = async (p) => {
    if (!window.confirm('Remove this passage? Its questions must be removed first.')) return;
    try {
      await deletePassage(examId, p.uid);
      setPassages((prev) => prev.filter((x) => x.uid !== p.uid));
      if (activePassageUid === p.uid) setActivePassageUid('');
    } catch (err) { setMsg({ type: 'error', text: apiError(err) }); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Manage Questions</h1>
        <p className="text-sm text-gray-500">
          {exam ? `${exam.title} · ${exam.subject} · ${exam.class}` : 'Loading…'}
          {exam && (theoryExam ? <> — <b>{questions.length}</b> questions added</> : <> — <b>{questions.length}</b> of <b>{total}</b> questions added</>)}
        </p>
        {locked && <p className="text-xs text-amber-600 mt-1">Students have started this exam, so its questions are locked.</p>}
      </div>

      {msg.text && (
        <div className={`text-sm rounded-lg px-4 py-2.5 border ${msg.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
          {msg.text}
        </div>
      )}

      {/* ---------- PASSAGE SECTION (only when config flag is ON) ---------- */}
      {!theoryExam && passageOn && (
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold">Passages</h2>
              <p className="text-xs text-gray-500">Group questions under a passage. Compulsory = shown to all students. Optional = shown to a random subset.</p>
            </div>
            <Button variant="outline" onClick={handleAddPassage} disabled={locked || busy}>+ Add Passage</Button>
          </div>
          {passages.length === 0 && <p className="text-sm text-gray-400">No passages yet. Click "Add Passage" to create one.</p>}
          <div className="space-y-4">
            {passages.map((p) => (
              <div key={p.uid} className={`border rounded-md p-3 ${activePassageUid === p.uid ? 'border-blue-400 bg-blue-50/30' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="activePassage" checked={activePassageUid === p.uid}
                      onChange={() => setActivePassageUid(p.uid)} />
                    <span className="text-xs font-medium text-gray-700">Passage {p.uid}</span>
                    <button type="button" onClick={() => handleToggleCompulsory(p)}
                      className={`text-xs px-2 py-1 rounded ${p.is_compulsory ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {p.is_compulsory ? 'Compulsory' : 'Optional'}
                    </button>
                  </div>
                  <button type="button" className="text-xs text-red-500" onClick={() => handleDeletePassage(p)}>Delete</button>
                </div>

                {/* Passage title */}
                <input
                  type="text"
                  className="w-full border rounded-md px-2 py-1 text-sm font-medium mb-2"
                  placeholder="Passage title, e.g. Passage 2: Environmental Sanitation"
                  value={p.title || ''}
                  onChange={(e) => setPassages((prev) => prev.map((x) => (x.uid === p.uid ? { ...x, title: e.target.value } : x)))}
                  onBlur={() => handleUpdatePassageTitle(p, p.title)}
                  disabled={locked || busy}
                />

                {/* Rich passage body */}
                <label className="block text-xs font-medium text-gray-600 mb-1">Passage body (rich text + images)</label>
                <TheoryQuestionEditor
                  value={p.body}
                  onChange={(html) => setPassages((prev) => prev.map((x) => (x.uid === p.uid ? { ...x, body: html } : x)))}
                  onImageUpload={handleImageUpload}
                  disabled={locked || busy}
                  placeholder="Passage text…"
                />

                <div className="flex items-center gap-2 mt-2">
                  <Button type="button" variant="outline" onClick={() => handleUpdatePassageBody(p, p.body)} disabled={locked || busy}>
                    Save passage
                  </Button>
                  <span className="text-xs text-gray-400">Saves the passage body (including images).</span>
                </div>

                {/* Preview */}
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Preview</p>
                  {p.title && <p className="text-sm font-semibold text-gray-900 mb-1">{p.title}</p>}
                  <HtmlBlock html={p.body} className="text-sm text-gray-800 leading-relaxed" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <label className="text-xs font-medium text-gray-600">Adding questions to:</label>
            <select className="ml-2 border rounded-md px-2 py-1 text-sm w-full" value={activePassageUid} onChange={(e) => setActivePassageUid(e.target.value)}>
              <option value="">Standalone question (no passage)</option>
              {passages.map((p) => <option className='break-words' key={p.uid} value={p.uid}>{p.title || `Passage ${p.uid.slice(0, 5)}`}</option>)}
            </select>
          </div>
        </section>
      )}

      {/* ---------- IMPORT PREVIEW ---------- */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold mb-1">Import from PDF/Word</h2>
        <p className="text-xs text-gray-500 mb-3">
          {theoryExam ? 'Number each question like "1. Question text".' : 'Number each question "1. …" with options "A. …" and an "Answer: B" line.'}
        </p>
        <div className="flex gap-3 items-center flex-wrap">
          <input type="file" accept=".pdf,.docx" disabled={locked || !hasQuestionCapacity} onChange={(e) => setFile(e.target.files[0])} />
          <Button variant="outline" onClick={handleUpload} disabled={busy || locked || !hasQuestionCapacity}>
            {busy && !preview.length ? 'Reading…' : 'Extract Questions'}
          </Button>
        </div>
        {preview.length > 0 && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-amber-600">Review before confirming — nothing is saved yet.</p>
            {preview.map((q, i) => (
              <div key={i} className="border rounded-md p-3 space-y-2">
                <div className="flex justify-between gap-2">
                  <span className="text-xs text-gray-400">Question {i + 1}</span>
                  <button type="button" className="text-xs text-red-500" onClick={() => setPreview((p) => p.filter((_, k) => k !== i))}>Remove</button>
                </div>
                <textarea className="w-full border rounded-md px-2 py-1 text-sm" placeholder="Question text" value={q.text} onChange={(e) => updatePreviewItem(i, { text: e.target.value })} />
                {!theoryExam && (
                  <>
                    {tfOn && (
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" checked={!!q.isTrueFalse} onChange={(e) => updatePreviewItem(i, { isTrueFalse: e.target.checked })} />
                        True/False question
                      </label>
                    )}
                    {passageOn && passages.length > 0 && (
                      <select className="border rounded-md px-2 py-1 text-sm" value={q.passageUid || ''} onChange={(e) => updatePreviewItem(i, { passageUid: e.target.value || null })}>
                        <option value="">Standalone (no passage)</option>
                        {passages.map((p) => <option key={p.uid} value={p.uid}>{p.title || `Passage ${p.uid}`}</option>)}
                      </select>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {(q.isTrueFalse ? ['A', 'B'] : ['A', 'B', 'C', 'D']).map((opt) => (
                        <textarea key={opt} rows={2} className="border rounded-md px-2 py-1 text-sm" placeholder={`Option ${opt}`}
                          value={q.options?.[opt] || ''} onChange={(e) => updatePreviewItem(i, { options: { ...q.options, [opt]: e.target.value } })} />
                      ))}
                    </div>
                    <input className="border rounded-md px-2 py-1 text-sm w-40" placeholder="Correct (A/B/C/D)" value={q.correctOption || ''}
                      onChange={(e) => updatePreviewItem(i, { correctOption: e.target.value.toUpperCase().slice(0, 1) })} />
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
            {!theoryExam && tfOn && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <span className="text-sm font-medium">This question is True/False</span>
                <button type="button" onClick={() => setManualIsTF((v) => !v)}>
                  {manualIsTF ? <ToggleRight className="w-8 h-8 text-blue-600" /> : <ToggleLeft className="w-8 h-8 text-gray-300" />}
                </button>
              </div>
            )}

            {!theoryExam && passageOn && passages.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Attach to passage</label>
                <select className="border rounded-md px-2 py-1 text-sm w-full" value={activePassageUid} onChange={(e) => setActivePassageUid(e.target.value)}>
                  <option value="">Standalone (no passage)</option>
                  {passages.map((p) => <option className='break-words' key={p.uid} value={p.uid}>{p.title || `Passage ${p.uid.slice(0, 5)}`}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Question</label>
              <TheoryQuestionEditor value={manual.text} onChange={(html) => setManual((prev) => ({ ...prev, text: html }))}
                onImageUpload={handleImageUpload} disabled={locked || busy} placeholder="Question text…" />
            </div>

            {!theoryExam && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {optionKeys.map((opt) => (
                    <div key={opt}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Option {opt}</label>
                      <TheoryQuestionEditor compact value={manual[opt]} onChange={(html) => setManual((prev) => ({ ...prev, [opt]: html }))}
                        onImageUpload={handleImageUpload} disabled={locked || busy} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Correct option ({optionKeys.join('/')})</label>
                  <input className="border rounded-md px-2 py-1 text-sm w-40" placeholder={optionKeys.join('/')}
                    value={manual.correctOption} onChange={(e) => setManual({ ...manual, correctOption: e.target.value.toUpperCase().slice(0, 1) })} />
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
          {questions.map((q, i) => {
            const passage = passageOn && q.passageUid ? passages.find((p) => p.uid === q.passageUid) : null;
            return (
              <div key={q.id} className="border rounded-md p-3 text-sm">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {passage && (
                      <div className="mb-2 pl-3 border-l-2 border-blue-200">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500 mb-1">
                          {passage.title || `Passage ${passage.uid}`}
                        </p>
                        <HtmlBlock html={passage.body} className="text-gray-700 text-sm leading-relaxed" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <span className="shrink-0 font-medium">{i + 1}.</span>
                      <HtmlBlock html={q.text} className="font-medium" />
                      {tfOn && q.isTrueFalse && <span className="text-[10px] font-semibold uppercase text-purple-600 shrink-0">T/F</span>}
                    </div>
                    {q.options && (
                      <ul className="mt-2 space-y-1">
                        {Object.entries(q.options).filter(([, v]) => v).map(([k, v]) => (
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
                    <button type="button" className="text-xs text-red-500 shrink-0 self-start" onClick={() => handleDelete(q)}>Delete</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}