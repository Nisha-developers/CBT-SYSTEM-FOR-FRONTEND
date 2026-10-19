import { useCallback, useEffect, useMemo, useState } from 'react';
import { listStudents, addStudent, updateStudent, deleteStudent, resetStudentPassword } from '../../api/student.api';
import {getPublicSchool} from '../../api/school.api';
import { apiError } from '../../api/axios';
import { useSchoolStore } from '../../store/useSchoolStore';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { Search, Trash2, Edit2, ChevronLeft, ChevronRight, Plus, KeyRound } from 'lucide-react';

const columns = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'uniqueId', label: 'Student ID' },
  { key: 'class', label: 'Class' },
  { key: 'arm', label: 'Arm' },
];


const PAGE_SIZE = 10;
const inputCls =
  'w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors';
const emptyForm = { firstName: '', lastName: '', studentId: '', className: '', armName: '', gender: '', optionalSubjectIds: [] };

export default function Students() {
  const { classes, classArms, optionalSubjects, loadSchool } = useSchoolStore();

  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filterClass, setFilterClass] = useState('');
  const [filterArm, setFilterArm] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ type: '', text: '' });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // student being edited (or null = adding)
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [retunId, setReturnId] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => {loadSchool().catch(() => {});
   }, [loadSchool]);

  // class arm lookups for the dropdowns
  const armsForClass = useCallback(
    (className) => classArms.filter((ca) => ca.className === className).map((ca) => ca.armName),
    [classArms]
  );
  const filterArmOptions = useMemo(
    () => (filterClass ? armsForClass(filterClass) : [...new Set(classArms.map((c) => c.armName))]),
    [filterClass, armsForClass, classArms]
  );
  const selectedClassArm = classArms.find((ca) => ca.className === form.className && ca.armName === form.armName);
  const offeredOptional = optionalSubjects.filter((o) => selectedClassArm && o.classArmIds.includes(selectedClassArm.id));

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PAGE_SIZE };
      if (filterClass) params.class = filterClass;
      if (filterArm) params.arm = filterArm;
      if (search.trim()) params.search = search.trim();
      // exact class names: class/arm filters are substring matches on the API, so use ids when both chosen
      if (filterClass && filterArm) {
        const ca = classArms.find((c) => c.className === filterClass && c.armName === filterArm);
        if (ca) { params.classArmId = ca.id; delete params.class; delete params.arm; }
      }
      const { data } = await listStudents(params);
      setStudents(data.students);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      setNotice({ type: 'error', text: apiError(err, 'Could not load students.') });
    } finally {
      setLoading(false);
    }
  }, [page, filterClass, filterArm, search, classArms]);
useEffect(() => {
  if (!form.className || !form.armName) {
    setReturnId('');
    return;
  }

  let cancelled = false;

  async function generateStudentId() {
    try {
      const classArmss = classArms;
      console.log(classArmss);

      const selectedArmDetails = classArmss.find((value) => {
        return (
          value.className === form.className &&
          value.armName === form.armName
        );
      });

      if (!selectedArmDetails) {
        setReturnId('');
        return;
      }

      const count = Number(selectedArmDetails.students ?? 0) + 1;
      const schoolDetails = await getPublicSchool();

      const schoolName =
        schoolDetails?.data?.school?.name ?? 'Nisha';

      const studentId = `${schoolName
        .slice(0, 3)
        .toUpperCase()}/${form.className}/${form.armName}/${String(count).padStart(3, '0')}`;

      if (!cancelled) {
        setReturnId(studentId);

        setForm((prev) => ({
          ...prev,
          studentId,
        }));
      }
    } catch (error) {
      console.error('Failed to generate student ID:', error);

      if (!cancelled) {
        setReturnId('');
      }
    }
  }

  generateStudentId();

  return () => {
    cancelled = true;
  };
}, [form.className, form.armName, classArms]);

  // debounce typing in search; filters/page refetch immediately
  useEffect(() => {
    const t = setTimeout(fetchStudents, 250);
    return () => clearTimeout(t);
  }, [fetchStudents]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, className: filterClass, armName: filterClass && filterArm ? filterArm : '' });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      firstName: s.firstName, lastName: s.lastName, studentId: s.studentId, className: s.class, armName: s.arm,
      gender: s.gender || '', optionalSubjectIds: s.optionalSubjects.map((o) => o.id),
    });
    setFormError('');
    setModalOpen(true);
  };

  const setField = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const toggleOptional = (id) =>
    setForm((f) => ({
      ...f,
      optionalSubjectIds: f.optionalSubjectIds.includes(id)
        ? f.optionalSubjectIds.filter((x) => x !== id)
        : [...f.optionalSubjectIds, id],
    }));

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!selectedClassArm) return setFormError('Please choose a class and an arm.');
    const body = {
      firstName: form.firstName, lastName: form.lastName, studentId: form.studentId,
      classArmId: selectedClassArm.id, gender: form.gender || null, optionalSubjectIds: form.optionalSubjectIds,
    };
    setSaving(true);
    try {
      if (editing) {
        await updateStudent(editing.id, body);
        setNotice({ type: 'success', text: 'Student updated.' });
        setModalOpen(false);
      } else {
        await addStudent(body);
        setNotice({ type: 'success', text: 'Student added successfully.' });
        // keep the form open (class/arm kept) so many students can be entered quickly
        setForm({ ...emptyForm, className: form.className, armName: form.armName, gender: form.gender });
      }
      await fetchStudents();
      loadSchool().catch(() => {});   // refresh per-class counts
    } catch (err) {
      setFormError(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Remove ${s.firstName} ${s.lastName}? Their exam attempts and results will be deleted too.`)) return;
    try {
      await deleteStudent(s.id);
      setNotice({ type: 'success', text: 'Student removed.' });
      if (students.length === 1 && page > 1) setPage(page - 1); else fetchStudents();
      loadSchool().catch(() => {});
    } catch (err) {
      setNotice({ type: 'error', text: apiError(err) });
    }
  };

  const handleReset = async (s) => {
    if (!window.confirm(`Reset ${s.firstName}'s password back to their last name?`)) return;
    try {
      await resetStudentPassword(s.id);
      setNotice({ type: 'success', text: `${s.firstName}'s password was reset to their last name.` });
    } catch (err) {
      setNotice({ type: 'error', text: apiError(err) });
    }
  };

  // page buttons: 1 … (p-1) p (p+1) … last
  const pageButtons = useMemo(() => {
    const set = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages));
    const sorted = [...set].sort((a, b) => a - b);
    const out = [];
    sorted.forEach((n, i) => {
      if (i > 0 && n - sorted[i - 1] > 1) out.push('gap' + n);
      out.push(n);
    });
    return out;
  }, [page, pages]);

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Students List</h1>
        <Button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Students
        </Button>
      </div>

      {notice.text && (
        <div className={`text-sm rounded-lg px-4 py-2.5 border ${notice.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
          {notice.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Students Information</h2>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search name or ID"
                className="w-48 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
              />
            </div>
            <select
              value={filterClass}
              onChange={(e) => { setFilterClass(e.target.value); setFilterArm(''); setPage(1); }}
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="">All classes</option>
              {classes.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <select
              value={filterArm}
              onChange={(e) => { setFilterArm(e.target.value); setPage(1); }}
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="">All arms</option>
              {filterArmOptions.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div className="">
          <Table
            columns={columns}
            rows={loading && students.length === 0 ? [] : students}
            actions={(row) => (
              <div className="flex items-center gap-3">
                <button title="Delete" onClick={() => handleDelete(row)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button title="Edit" onClick={() => openEdit(row)} className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button title="Reset password" onClick={() => handleReset(row)} className="text-gray-400 hover:text-amber-600 transition-colors">
                  <KeyRound className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        </div>

        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-50 transition-colors disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {pageButtons.map((n) =>
              typeof n === 'string' ? (
                <span key={n} className="text-gray-400 text-xs px-1">...</span>
              ) : (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-8 h-8 text-xs font-medium rounded-md flex items-center justify-center transition-colors ${n === page ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {n}
                </button>
              )
            )}
            <button disabled={page >= pages} onClick={() => setPage(page + 1)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-50 transition-colors disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-gray-500">{total === 0 ? 'No students' : `${from}–${to} of ${total} students`}</span>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={handleSave} className="space-y-4 pt-2 max-h-[75vh] overflow-y-auto">
          {formError && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{formError}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5 text-xs font-medium text-gray-700">
              First Name
              <input className={inputCls} value={form.firstName} onChange={setField('firstName')} required />
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-medium text-gray-700">
              Last Name
              <input className={inputCls} value={form.lastName} onChange={setField('lastName')} required />
            </label>
           
            <label className="flex flex-col gap-1.5 text-xs font-medium text-gray-700">
              Class
              <select className={inputCls} value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value, armName: '', optionalSubjectIds: [] })} required>
                <option value="">Select class</option>
                {classes.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-medium text-gray-700">
              Arm
              <select className={inputCls} value={form.armName}
                onChange={(e) => setForm({ ...form, armName: e.target.value, optionalSubjectIds: [] })} required disabled={!form.className}>
                <option value="">Select arm</option>
                {armsForClass(form.className).map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>

             <label className="flex flex-col gap-1.5 text-xs font-medium text-gray-700 sm:col-span-2">
              Student ID (Authomatic generated)
              <input className={inputCls} value={form.className &&form.armName ? `${retunId}` : 'generating...'} onChange={setField('studentId')} required readOnly/>
            </label>
            <label className="flex flex-col gap-1.5 text-xs font-medium text-gray-700 sm:col-span-2">
              Gender
              <select className={inputCls} value={form.gender} onChange={setField('gender')}>
                <option value="">Not specified</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
          </div>

          {offeredOptional.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">Optional subjects offered</p>
              <div className="flex flex-wrap gap-2">
                {offeredOptional.map((o) => (
                  <label key={o.id} className={`text-xs px-3 py-1.5 rounded-full border cursor-pointer select-none ${form.optionalSubjectIds.includes(o.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}>
                    <input type="checkbox" className="hidden" checked={form.optionalSubjectIds.includes(o.id)} onChange={() => toggleOptional(o.id)} />
                    {o.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          {!editing && (
            <p className="text-[11px] text-gray-400">The student's first password is their last name. They can change it after logging in.</p>
          )}

          <div className="pt-2">
            <Button type="submit" disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60">
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Save Student'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
