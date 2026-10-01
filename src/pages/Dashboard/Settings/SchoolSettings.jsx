import React, { useState } from 'react';
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

// --- MOCK DATA ---
const INITIAL_SCHOOL_INFO = {
  name: 'Springfield High School',
  email: 'admin@springfield.edu',
  phone: '+234 801 234 5678',
  address: '12 Education Way, Lagos, Nigeria',
  motto: 'Knowledge, Integrity, Service',
  logo: null,
};

const INITIAL_CLASSES = [
  { id: '1', name: 'JSS1', level: 'Junior Secondary', students: 45 },
  { id: '2', name: 'JSS2', level: 'Junior Secondary', students: 42 },
  { id: '3', name: 'JSS3', level: 'Junior Secondary', students: 40 },
  { id: '4', name: 'SS1', level: 'Senior Secondary', students: 38 },
  { id: '5', name: 'SS2', level: 'Senior Secondary', students: 45 },
  { id: '6', name: 'SS3', level: 'Senior Secondary', students: 42 },
];

const INITIAL_ARMS = [
  { id: '1', name: 'Arm A', class: 'SS2', students: 22 },
  { id: '2', name: 'Arm B', class: 'SS2', students: 23 },
  { id: '3', name: 'Arm A', class: 'SS1', students: 19 },
  { id: '4', name: 'Arm B', class: 'SS1', students: 19 },
  { id: '5', name: 'Arm A', class: 'JSS3', students: 20 },
  { id: '6', name: 'Arm B', class: 'JSS3', students: 20 },
];

const INITIAL_SUBJECTS = [
  { id: '1', name: 'Mathematics', code: 'MTH', class: 'All', type: 'Core' },
  { id: '2', name: 'English Language', code: 'ENG', class: 'All', type: 'Core' },
  { id: '3', name: 'Physics', code: 'PHY', class: 'SS1-SS3', type: 'Science' },
  { id: '4', name: 'Chemistry', code: 'CHM', class: 'SS1-SS3', type: 'Science' },
  { id: '5', name: 'Biology', code: 'BIO', class: 'SS1-SS3', type: 'Science' },
  { id: '6', name: 'Economics', code: 'ECO', class: 'SS1-SS3', type: 'Commercial' },
  { id: '7', name: 'Government', code: 'GOV', class: 'SS1-SS3', type: 'Commercial' },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('basic');

  // --- FORM STATES ---
  const [schoolInfo, setSchoolInfo] = useState(INITIAL_SCHOOL_INFO);
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [arms, setArms] = useState(INITIAL_ARMS);
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);

  // --- MODAL STATES ---
  const [classModal, setClassModal] = useState({ open: false, mode: 'create', data: null });
  const [armModal, setArmModal] = useState({ open: false, mode: 'create', data: null });
  const [subjectModal, setSubjectModal] = useState({ open: false, mode: 'create', data: null });
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null, title: '', message: '' });

  // --- SAVING STATES ---
  const [isSaving, setIsSaving] = useState(false);

  // =========================================================
  // TAB 1: BASIC INFORMATION
  // =========================================================
  const handleSchoolInfoSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('School information updated successfully!');
    }, 1000);
  };

  const renderBasicInfo = () => (
    <form onSubmit={handleSchoolInfoSave} className="space-y-6">
      
      {/* Logo Upload */}
      <div className="flex items-center gap-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
        <div className="w-20 h-20 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
          <Building2 className="w-8 h-8 text-gray-300" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">School Logo</h4>
          <p className="text-xs text-gray-500 mt-0.5">PNG or JPG. Max 2MB.</p>
          <button 
            type="button"
            className="mt-3 flex items-center gap-2 text-sm font-medium text-blue-600 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Logo
          </button>
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

  const handleSaveClass = (formData) => {
    if (classModal.mode === 'create') {
      setClasses([...classes, { ...formData, id: Date.now().toString(), students: 0 }]);
    } else {
      setClasses(classes.map(c => c.id === formData.id ? { ...formData } : c));
    }
    handleCloseClassModal();
  };

  const handleDeleteClass = (id) => {
    setConfirmModal({
      open: true,
      action: () => {
        setClasses(classes.filter(c => c.id !== id));
        setConfirmModal({ open: false, action: null, title: '', message: '' });
      },
      title: 'Delete Class',
      message: 'Are you sure you want to delete this class? This action cannot be undone.',
    });
  };

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
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Students</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {classes.map((cls) => (
              <tr key={cls.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{cls.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{cls.level}</td>
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

  const handleSaveArm = (formData) => {
    if (armModal.mode === 'create') {
      setArms([...arms, { ...formData, id: Date.now().toString(), students: 0 }]);
    } else {
      setArms(arms.map(a => a.id === formData.id ? { ...formData } : a));
    }
    handleCloseArmModal();
  };

  const handleDeleteArm = (id) => {
    setConfirmModal({
      open: true,
      action: () => {
        setArms(arms.filter(a => a.id !== id));
        setConfirmModal({ open: false, action: null, title: '', message: '' });
      },
      title: 'Delete Arm',
      message: 'Are you sure you want to delete this arm? This action cannot be undone.',
    });
  };

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

  const handleSaveSubject = (formData) => {
    if (subjectModal.mode === 'create') {
      setSubjects([...subjects, { ...formData, id: Date.now().toString() }]);
    } else {
      setSubjects(subjects.map(s => s.id === formData.id ? { ...formData } : s));
    }
    handleCloseSubjectModal();
  };

  const handleDeleteSubject = (id) => {
    setConfirmModal({
      open: true,
      action: () => {
        setSubjects(subjects.filter(s => s.id !== id));
        setConfirmModal({ open: false, action: null, title: '', message: '' });
      },
      title: 'Delete Subject',
      message: 'Are you sure you want to delete this subject? This action cannot be undone.',
    });
  };

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
                      onClick={() => handleDeleteSubject(sub.id)}
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
    setConfirmModal({
      open: true,
      action: () => {
        alert('School deleted! (This is a simulation)');
        setConfirmModal({ open: false, action: null, title: '', message: '' });
      },
      title: 'Delete School',
      message: 'WARNING: This will permanently delete the school, all classes, arms, subjects, students, and results. This action CANNOT be undone.',
    });
  };

  const handleReleaseResults = () => {
    setConfirmModal({
      open: true,
      action: () => {
        alert('Results released! (This is a simulation)');
        setConfirmModal({ open: false, action: null, title: '', message: '' });
      },
      title: 'Release Results',
      message: 'Are you sure you want to release all results? This will make them visible to students and parents. This action cannot be undone.',
    });
  };

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
              Make all pending results visible to students and parents. This cannot be undone.
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
            { key: 'level', label: 'Level', type: 'select', options: ['Junior Secondary', 'Senior Secondary'] },
          ]}
          initialData={classModal.data || { name: '', level: 'Junior Secondary' }}
          onClose={handleCloseClassModal}
          onSave={handleSaveClass}
        />
      )}

      {/* Arm Modal */}
      {armModal.open && (
        <SimpleFormModal
          title={armModal.mode === 'create' ? 'Add Arm' : 'Edit Arm'}
          fields={[
            { key: 'name', label: 'Arm Name', type: 'text', placeholder: 'e.g. Arm A' },
            { key: 'class', label: 'Class', type: 'select', options: classes.map(c => c.name) },
          ]}
          initialData={armModal.data || { name: '', class: '' }}
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
            { key: 'code', label: 'Subject Code', type: 'text', placeholder: 'e.g. MTH' },
            { key: 'class', label: 'Applicable Class', type: 'text', placeholder: 'e.g. All or SS1-SS3' },
            { key: 'type', label: 'Type', type: 'select', options: ['Core', 'Science', 'Commercial', 'Arts', 'Elective'] },
          ]}
          initialData={subjectModal.data || { name: '', code: '', class: '', type: 'Core' }}
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

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
              {field.type === 'select' ? (
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
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Save
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Settings;