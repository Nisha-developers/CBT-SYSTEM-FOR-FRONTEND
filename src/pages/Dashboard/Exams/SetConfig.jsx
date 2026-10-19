import React, { useEffect, useMemo, useState } from 'react';
import { useSchoolStore } from '../../../store/useSchoolStore';
import { createExam } from '../../../api/exam.api';
import { apiError } from '../../../api/axios';
import { 
  FileText, 
  Users, 
  Clock, 
  Calendar, 
  Award, 
  Target, 
  BookOpen, 
  Layers,
  ToggleLeft,
  ToggleRight,
  Save,
  ArrowLeft,
  Info
} from 'lucide-react';

const SetConfig = ({ type = 'obj', saveConfig, onClose }) => {
  const isObj = type === 'obj';
  const { classes, classArms, subjects, optionalSubjects, loadSchool } = useSchoolStore();
  useEffect(() => { loadSchool().catch(() => {}); }, [loadSchool]);

  // --- FORM STATE ---
  const [form, setForm] = useState({
    title: '',
    durationMinutes: '',
    totalQuestions: '',
    questionsToDisplay: '',
    markPerQuestion: '',
    class: '',
    arm: '',
    subject: '',        // "compulsory:<uid>" or "optional:<uid>"
    passage: false,
    trueOrFalse: false,
    date: '',
    time: '',
    openExam: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const armsForClass = useMemo(
    () => classArms.filter((ca) => ca.className === form.class).map((ca) => ca.armName),
    [classArms, form.class]
  );
  const selectedClassArm = classArms.find((ca) => ca.className === form.class && ca.armName === form.arm);
  const subjectOptions = useMemo(() => {
    if (!selectedClassArm) return [];
    const mine = (list, kind) => list
      .filter((s) => s.classArmIds.includes(selectedClassArm.id))
      .map((s) => ({ value: `${kind}:${s.id}`, label: kind === 'optional' ? `${s.name} (optional)` : s.name }));
    return [...mine(subjects, 'compulsory'), ...mine(optionalSubjects, 'optional')];
  }, [selectedClassArm, subjects, optionalSubjects]);

  // --- HANDLERS ---
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!selectedClassArm) return setError('Please choose a class and arm.');
    const [subjectKind, subjectId] = form.subject.split(':');
    if (!subjectId) return setError('Please choose a subject.');

    setIsSaving(true);
    try {
      const { data } = await createExam({
        type: isObj ? 'OBJ' : 'THEORY',
        title: form.title,
        classArmId: selectedClassArm.id,
        subjectId,
        subjectKind,
        totalQuestions: Number(form.totalQuestions),
        questionsToDisplay: isObj ? Number(form.questionsToDisplay) : undefined,
        markPerQuestion: Number(form.markPerQuestion),
        passage: isObj ? form.passage : false,
        trueOrFalse: isObj ? form.trueOrFalse : false,
        openExam: form.openExam,
        durationMinutes: Number(form.durationMinutes),
        date: form.date,
        time: form.time,
      });
      saveConfig?.(data.exam);
      onClose?.();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    // Changed from max-w-4xl mx-auto h-[80vh] to a full-height flex column
    <div className="w-full  flex flex-col max-w-4xl mx-auto space-y-6 h-[80vh]">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Set {type.toUpperCase()} Exam Configuration
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Define the rules, structure, and schedule for this examination.
            </p>
          </div>
        </div>
      </div>

      {/* --- FORM CARD (Now the scrollable container) --- */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden"
      >
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          
          {/* SECTION 1: EXAM STRUCTURE */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <Layers className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Exam Structure</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  Exam Title
                </label>
                <input type="text" placeholder="e.g. First Term Mathematics" value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  Duration (minutes)
                </label>
                <input type="number" min="1" placeholder="e.g. 60" value={form.durationMinutes}
                  onChange={(e) => handleChange('durationMinutes', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Questions */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  Total Questions
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 50"
                  value={form.totalQuestions}
                  onChange={(e) => handleChange('totalQuestions', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  required
                />
              </div>

              {isObj && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-gray-400" />
                  Questions to Display
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 40"
                  value={form.questionsToDisplay}
                  onChange={(e) => handleChange('questionsToDisplay', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  required
                />
              </div>

              )}
              {/* Mark Per Question */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-gray-400" />
                  Mark Per Question
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  placeholder="e.g. 2"
                  value={form.markPerQuestion}
                  onChange={(e) => handleChange('markPerQuestion', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: TARGET AUDIENCE */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/30">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Target Audience</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Class */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  Class
                </label>
                <select
                  value={form.class}
                  onChange={(e) => setForm((p) => ({ ...p, class: e.target.value, arm: '', subject: '' }))}
                  className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors cursor-pointer"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              {/* Arm */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  Arm
                </label>
                <select
                  value={form.arm}
                  onChange={(e) => setForm((p) => ({ ...p, arm: e.target.value, subject: '' }))}
                  className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors cursor-pointer"
                  required
                >
                  <option value="">Select Arm</option>
                  {armsForClass.map((a) => <option key={a} value={a}>Arm {a}</option>)}
                </select>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                  Subject
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors cursor-pointer"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjectOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {isObj && (
          <>
          {/* SECTION 3: EXAM OPTIONS */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Exam Options</h2>
            </div>

            <div className="space-y-4">
              {/* Passage Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <span className="text-sm font-medium text-gray-900">Include Passage</span>
                  <p className="text-xs text-gray-500 mt-0.5">Enable reading passages before questions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('passage')}
                  className="focus:outline-none"
                >
                  {form.passage ? (
                    <ToggleRight className="w-8 h-8 text-blue-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-300" />
                  )}
                </button>
              </div>

              {/* True or False Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <span className="text-sm font-medium text-gray-900">True or False Questions</span>
                  <p className="text-xs text-gray-500 mt-0.5">Allow true/false answer format.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('trueOrFalse')}
                  className="focus:outline-none"
                >
                  {form.trueOrFalse ? (
                    <ToggleRight className="w-8 h-8 text-blue-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>

          </>
          )}

          {/* SECTION 4: SCHEDULE */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/30">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Schedule</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Exam Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  required
                />
              </div>

              {/* Time */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  Exam Time
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: EXAM STATUS */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <ToggleRight className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Exam Status</h2>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <div>
                <span className="text-sm font-medium text-gray-900">Open Exam</span>
                <p className="text-xs text-gray-500 mt-0.5">Make this exam available to students immediately.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('openExam')}
                className="focus:outline-none"
              >
                {form.openExam ? (
                  <ToggleRight className="w-8 h-8 text-blue-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-300" />
                )}
              </button>
            </div>
          </div>

        </div>

        {/* --- FORM FOOTER (Now outside the scroll area, pinned to bottom) --- */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
          {error && <p className="text-xs text-red-600 mr-auto">{error}</p>}
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Configuration
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SetConfig;