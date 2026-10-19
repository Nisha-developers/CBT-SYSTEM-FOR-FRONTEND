import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchoolStore } from '../../../store/useSchoolStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { signOut } from '../../../utils/session';
import {
  updateSchool, renameClass, renameArm, renameSubject, renameOptionalSubject,
  deleteClass, deleteClassArm, deleteSubject, deleteOptionalSubject,
  deleteSchool, setAcademicTerm, getAcademicTerms,
} from '../../../api/school.api';
import { apiError } from '../../../api/axios';
import { 
  Building2, 
  Users, 
  Layers, 
  BookOpen, 
  AlertTriangle, 
  Save, 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  Download,
  X,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('basic');

  const navigate = useNavigate();
  const user = useAuthStore((st) => st.user);
  const store = useSchoolStore();
  const [notice, setNotice] = useState({ type: '', text: '' });
  const [schoolInfo, setSchoolInfo] = useState({ name: '', email: '', phone: '', address: '', motto: '', logo: null });
  const [termForm, setTermForm] = useState({ session: '', term: 'First Term' });

  const reload = useCallback(async () => {
    const d = await store.loadSchool();
    return d;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    reload()
      .then((d) => {
        setSchoolInfo({
          name: d.school.name, email: d.school.email, phone: d.school.phone,
          address: d.school.address, motto: d.school.motto, logo: d.school.logo,
        });
        setTermForm({ session: d.term.session, term: d.term.term });
      })
      .catch((err) => setNotice({ type: 'error', text: apiError(err, 'Could not load school settings.') }));
  }, [reload]);

  // derived lists the tabs render
  const classes = store.classes.map((c) => ({
    id: c.id, name: c.name, students: c.students,
    arms: store.classArms.filter((ca) => ca.classId === c.id).length,
  }));
  const arms = store.classArms.map((ca) => ({
    id: ca.id, armId: ca.armId, rawName: ca.armName, name: `Arm ${ca.armName}`, class: ca.className, students: ca.students,
  }));
  const classArmsLabel = (ids) => {
    const names = ids.map((id) => store.classArms.find((ca) => ca.id === id)?.fullName).filter(Boolean);
    return names.length ? names.join(', ') : '—';
  };
  const subjects = [
    ...store.subjects.map((s2) => ({ ...s2, kind: 'compulsory', type: 'Core' })),
    ...store.optionalSubjects.map((s2) => ({ ...s2, kind: 'optional', type: 'Optional' })),
  ].map((s2) => ({ ...s2, code: s2.name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase(), class: classArmsLabel(s2.classArmIds) }));

  // --- MODAL STATES ---
  const [classModal, setClassModal] = useState({ open: false, mode: 'create', data: null });
  const [armModal, setArmModal] = useState({ open: false, mode: 'create', data: null });
  const [subjectModal, setSubjectModal] = useState({ open: false, mode: 'create', data: null });
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null, title: '', message: '' });

  // --- SAVING STATES ---
  const [isSaving, setIsSaving] = useState(false);

  const closeConfirm = () => setConfirmModal({ open: false, action: null, title: '', message: '' });
  // Ask first, then run `fn`; any server refusal (e.g. "still in use") is shown as a notice.
  const askThen = (title, message, fn) =>
    setConfirmModal({
      open: true, title, message,
      action: async () => {
        closeConfirm();
        try { await fn(); await reload(); setNotice({ type: 'success', text: 'Done.' }); }
        catch (err) { setNotice({ type: 'error', text: apiError(err) }); }
      },
    });

  // =========================================================
  // TAB 1: BASIC INFORMATION
  // =========================================================
  const handleSchoolInfoSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSchool({ school: schoolInfo });
      await reload();
      setNotice({ type: 'success', text: 'School information updated successfully.' });
    } catch (err) {
      setNotice({ type: 'error', text: apiError(err) });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpe?g)$/.test(file.type)) return setNotice({ type: 'error', text: 'Logo must be a PNG or JPG image.' });
    if (file.size > 2 * 1024 * 1024) return setNotice({ type: 'error', text: 'Logo must be 2MB or smaller.' });
    const reader = new FileReader();
    reader.onload = () => setSchoolInfo((prev) => ({ ...prev, logo: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleTermSave = async () => {
    try {
      await setAcademicTerm(termForm);
      await reload();
      setNotice({ type: 'success', text: `Current term is now ${termForm.term}, ${termForm.session}.` });
    } catch (err) {
      setNotice({ type: 'error', text: apiError(err) });
    }
  };

  const renderTerm = () => (
    <div className="mb-6 p-5 bg-blue-50/50 border border-blue-100 rounded-xl flex flex-col md:flex-row md:items-end gap-4">
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-900">Current Academic Term</h4>
        <p className="text-xs text-gray-500 mt-0.5">New exams and results are recorded under this term.</p>
      </div>
      <input value={termForm.session} onChange={(e) => setTermForm({ ...termForm, session: e.target.value })}
        placeholder="2026/2027" className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2.5 w-36" />
      <select value={termForm.term} onChange={(e) => setTermForm({ ...termForm, term: e.target.value })}
        className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2.5">
        <option>First Term</option><option>Second Term</option><option>Third Term</option>
      </select>
      <button type="button" onClick={handleTermSave}
        className="text-sm font-medium text-white bg-blue-600 px-4 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm">Set Term</button>
    </div>
  );

  const renderBasicInfo = () => (
    <form onSubmit={handleSchoolInfoSave} className="space-y-6">
      
      {/* Logo Upload */}
      <div className="flex items-center gap-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
        <div className="w-20 h-20 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
          {schoolInfo.logo
            ? <img src={schoolInfo.logo} alt="School logo" className="w-full h-full object-contain rounded-xl" />
            : <Building2 className="w-8 h-8 text-gray-300" />}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">School Logo</h4>
          <p className="text-xs text-gray-500 mt-0.5">PNG or JPG. Max 2MB.</p>
          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-blue-600 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Upload Logo
            <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogoFile} />
          </label>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700">School Name</label>
          <input
            type="text"
            value={schoolInfo.name}
            onChange={(e) => setSchoolInfo({ ...schoolInfo, name: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            value={schoolInfo.email}
            onChange={(e) => setSchoolInfo({ ...schoolInfo, email: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={schoolInfo.phone}
            onChange={(e) => setSchoolInfo({ ...schoolInfo, phone: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700">Motto</label>
          <input
            type="text"
            value={schoolInfo.motto}
            onChange={(e) => setSchoolInfo({ ...schoolInfo, motto: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-medium text-gray-700">School Address</label>
          <textarea
            rows={3}
            value={schoolInfo.address}
            onChange={(e) => setSchoolInfo({ ...schoolInfo, address: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors resize-none"
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );

  // =========================================================
  // TAB 2: CLASSES
  // =========================================================
  const handleOpenClassModal = (mode, data = null) => {
    setClassModal({ open: true, mode, data });
  };

  const handleCloseClassModal = () => {
    setClassModal({ open: false, mode: 'create', data: null });
  };

  const handleSaveClass = async (formData) => {
    const name = formData.name.trim();
    if (classModal.mode === 'create') await updateSchool({ classes: [name] });
    else await renameClass(classModal.data.id, name);
    await reload();
    setNotice({ type: 'success', text: classModal.mode === 'create' ? 'Class added.' : 'Class renamed.' });
    handleCloseClassModal();
  };

  const handleDeleteClass = (id) =>
    askThen('Delete Class', 'Are you sure you want to delete this class? This action cannot be undone.', () => deleteClass(id));

  const renderClasses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Manage Classes</h3>
          <p className="text-xs text-gray-500 mt-0.5">Add, edit, or remove school classes.</p>
        </div>
        <button
          onClick={() => handleOpenClassModal('create')}
          className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </button>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class Name</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Arms</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Students</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {classes.map((cls) => (
              <tr key={cls.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{cls.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{cls.arms}</td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center">{cls.students}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleOpenClassModal('edit', cls)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // =========================================================
  // TAB 3: ARMS
  // =========================================================
  const handleOpenArmModal = (mode, data = null) => {
    setArmModal({ open: true, mode, data });
  };

  const handleCloseArmModal = () => {
    setArmModal({ open: false, mode: 'create', data: null });
  };

  const cleanArm = (v) => v.trim().replace(/^arm\s+/i, '');

  const handleSaveArm = async (formData) => {
    const armName = cleanArm(formData.name);
    if (armModal.mode === 'create') {
      await updateSchool({
        arms: [armName],
        classArms: [{ class_name: formData.class, arm_name: armName, full_class_name: `${formData.class} ${armName}` }],
      });
    } else {
      await renameArm(armModal.data.armId, armName);
    }
    await reload();
    setNotice({ type: 'success', text: armModal.mode === 'create' ? 'Arm added.' : 'Arm renamed everywhere it is used.' });
    handleCloseArmModal();
  };

  const handleDeleteArm = (id) =>
    askThen('Delete Arm', 'Are you sure you want to remove this class arm? This action cannot be undone.', () => deleteClassArm(id));

  const renderArms = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Manage Arms</h3>
          <p className="text-xs text-gray-500 mt-0.5">Add, edit, or remove class arms.</p>
        </div>
        <button
          onClick={() => handleOpenArmModal('create')}
          className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Arm
        </button>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Arm Name</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Students</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {arms.map((arm) => (
              <tr key={arm.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{arm.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{arm.class}</td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center">{arm.students}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleOpenArmModal('edit', arm)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteArm(arm.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // =========================================================
  // TAB 4: SUBJECTS
  // =========================================================
  const handleOpenSubjectModal = (mode, data = null) => {
    setSubjectModal({ open: true, mode, data });
  };

  const handleCloseSubjectModal = () => {
    setSubjectModal({ open: false, mode: 'create', data: null });
  };

  const handleSaveSubject = async (formData) => {
    const name = formData.name.trim();
    const kind = subjectModal.mode === 'create'
      ? (formData.type === 'Optional' ? 'optional' : 'compulsory')
      : subjectModal.data.kind;
    const classArmIds = formData.classArmIds || [];
    if (!classArmIds.length) throw new Error('Choose at least one class.');
    const class_arms = classArmIds.map((id) => store.classArms.find((ca) => ca.id === id)?.fullName).filter(Boolean);

    if (subjectModal.mode === 'edit' && subjectModal.data.name !== name) {
      if (kind === 'optional') await renameOptionalSubject(subjectModal.data.id, name);
      else await renameSubject(subjectModal.data.id, name);
    }
    await updateSchool(kind === 'optional'
      ? { optionalSubjects: [{ subject_name: name, class_arms }] }
      : { subjects: [{ subject_name: name, class_arms }] });
    await reload();
    setNotice({ type: 'success', text: subjectModal.mode === 'create' ? 'Subject added.' : 'Subject updated.' });
    handleCloseSubjectModal();
  };

  const handleDeleteSubject = (sub) =>
    askThen('Delete Subject', 'Are you sure you want to delete this subject? This action cannot be undone.',
      () => (sub.kind === 'optional' ? deleteOptionalSubject(sub.id) : deleteSubject(sub.id)));

  const renderSubjects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Manage Subjects</h3>
          <p className="text-xs text-gray-500 mt-0.5">Add, edit, or remove school subjects.</p>
        </div>
        <button
          onClick={() => handleOpenSubjectModal('create')}
          className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject Name</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subjects.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{sub.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600 font-mono">{sub.code}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{sub.class}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-50 text-gray-600 border border-gray-100">
                    {sub.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleOpenSubjectModal('edit', sub)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(sub)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // =========================================================
  // TAB 5: DANGER ZONE
  // =========================================================
  const handleDeleteSchool = () => {
    if (user?.role !== 'super_admin') return setNotice({ type: 'error', text: 'Only a super admin can delete the school.' });
    askThen(
      'Delete School',
      'WARNING: This will permanently delete the school, all classes, arms, subjects, students, exams and results. This action CANNOT be undone.',
      async () => {
        const typed = window.prompt('Type DELETE to confirm deleting the school and ALL its data.');
        if (typed !== 'DELETE') throw new Error('Deletion cancelled — you did not type DELETE.');
        await deleteSchool(typed);
        await signOut();
        navigate('/', { replace: true });
      }
    );
  };

  // Results are released per class + arm on the Results page.
  const handleReleaseResults = () => navigate('/dashboard/results');

  const renderDangerZone = () => (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-red-900">Danger Zone</h3>
          <p className="text-xs text-red-700 mt-0.5">
            Actions here are irreversible. Please proceed with caution.
          </p>
        </div>
      </div>

      {/* Release Results */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-gray-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 shrink-0">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Release Results</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Results are released (or withdrawn) per class and arm from the Results page.
            </p>
          </div>
        </div>
        <button
          onClick={handleReleaseResults}
          className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-blue-600 px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
          Release Results
        </button>
      </div>

      {/* Delete School */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-red-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-50 rounded-lg border border-red-100 shrink-0">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-red-900">Delete School</h4>
            <p className="text-xs text-red-700 mt-0.5">
              Permanently delete this school and all associated data. This cannot be undone.
            </p>
          </div>
        </div>
        <button
          onClick={handleDeleteSchool}
          className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-red-600 px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm shrink-0"
        >
          <Trash2 className="w-4 h-4" />
          Delete School
        </button>
      </div>
    </div>
  );

  // =========================================================
  // TAB CONFIGURATION
  // =========================================================
  const TABS = [
    { key: 'basic', label: 'Basic Information', icon: Building2 },
    { key: 'classes', label: 'Classes', icon: Users },
    { key: 'arms', label: 'Arms', icon: Layers },
    { key: 'subjects', label: 'Subjects', icon: BookOpen },
    { key: 'danger', label: 'Danger Zone', icon: AlertTriangle, danger: true },
  ];

  return (
    <div className="space-y-6">
      
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your school's basic information, classes, arms, subjects, and account status.
        </p>
      </div>

      {/* --- TABS --- */}
      <div className="bg-white rounded-xl border border-gray-200 p-1.5 shadow-sm inline-flex flex-wrap gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.key
                ? tab.danger
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-blue-600 text-white shadow-sm'
                : tab.danger
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- TAB CONTENT --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {notice.text && (
          <div className={`mb-4 text-sm rounded-lg px-4 py-2.5 border ${notice.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>{notice.text}</div>
        )}
        {activeTab === 'basic' && renderTerm()}
        {activeTab === 'basic' && renderBasicInfo()}
        {activeTab === 'classes' && renderClasses()}
        {activeTab === 'arms' && renderArms()}
        {activeTab === 'subjects' && renderSubjects()}
        {activeTab === 'danger' && renderDangerZone()}
      </div>

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}

      {/* Class Modal */}
      {classModal.open && (
        <SimpleFormModal
          title={classModal.mode === 'create' ? 'Add Class' : 'Edit Class'}
          fields={[
            { key: 'name', label: 'Class Name', type: 'text', placeholder: 'e.g. SS1' },
          ]}
          initialData={classModal.data || { name: '' }}
          onClose={handleCloseClassModal}
          onSave={handleSaveClass}
        />
      )}

      {/* Arm Modal */}
      {armModal.open && (
        <SimpleFormModal
          title={armModal.mode === 'create' ? 'Add Arm' : 'Edit Arm'}
          fields={[
            { key: 'name', label: 'Arm Name', type: 'text', placeholder: 'e.g. A' },
            ...(armModal.mode === 'create' ? [{ key: 'class', label: 'Class', type: 'select', options: classes.map(c => c.name) }] : []),
          ]}
          initialData={armModal.data ? { ...armModal.data, name: armModal.data.rawName } : { name: '', class: '' }}
          onClose={handleCloseArmModal}
          onSave={handleSaveArm}
        />
      )}

      {/* Subject Modal */}
      {subjectModal.open && (
        <SimpleFormModal
          title={subjectModal.mode === 'create' ? 'Add Subject' : 'Edit Subject'}
          fields={[
            { key: 'name', label: 'Subject Name', type: 'text', placeholder: 'e.g. Mathematics' },
            ...(subjectModal.mode === 'create' ? [{ key: 'type', label: 'Type', type: 'select', options: ['Core', 'Optional'] }] : []),
            { key: 'classArmIds', label: 'Offered in', type: 'multi', options: store.classArms.map((ca) => ({ value: ca.id, label: ca.fullName })) },
          ]}
          initialData={subjectModal.data || { name: '', type: 'Core', classArmIds: [] }}
          onClose={handleCloseSubjectModal}
          onSave={handleSaveSubject}
        />
      )}

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-lg border border-red-100 shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{confirmModal.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{confirmModal.message}</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmModal({ open: false, action: null, title: '', message: '' })}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.action}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// =========================================================
// SIMPLE FORM MODAL COMPONENT (Reusable)
// =========================================================
const SimpleFormModal = ({ title, fields, initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSave(formData);
    } catch (err) {
      setError(apiError(err, err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-700">{field.label}</label>
              {field.type === 'multi' ? (
                <div className="max-h-44 overflow-y-auto border border-gray-200 rounded-lg p-2 grid grid-cols-2 gap-1 bg-gray-50">
                  {field.options.map((opt) => {
                    const on = (formData[field.key] || []).includes(opt.value);
                    return (
                      <label key={opt.value} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                        <input type="checkbox" checked={on}
                          onChange={() => handleChange(field.key, on
                            ? formData[field.key].filter((v) => v !== opt.value)
                            : [...(formData[field.key] || []), opt.value])} />
                        {opt.label}
                      </label>
                    );
                  })}
                </div>
              ) : field.type === 'select' ? (
                <select
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors cursor-pointer"
                  required
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  required
                />
              )}
            </div>
          ))}

          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Settings;