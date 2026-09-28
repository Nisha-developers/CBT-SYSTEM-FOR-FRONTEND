import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchoolStore } from '../../store/useSchoolStore';
import { setupSchool as setupSchoolApi } from '../../api/school.api';
import Button from '../../components/common/Button';
import Steps from '../../components/common/Steps';

export default function Step4Subjects() {
  const navigate = useNavigate();
  const { wizard, setWizardStep, setSchool, resetWizard } = useSchoolStore();

  const [compulsoryInput, setCompulsoryInput] = useState('');
  const [optionalInput, setOptionalInput] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  // ticked class + arm pairs: [{ className, armName }]
  const [selected, setSelected] = useState([]);
  // subject currently being edited: { type, className, armName, subject } | null
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

  const compulsoryList = wizard.subjects || [];
  const optionalList = wizard.optionalSubject || [];

  /* ---------- helpers ---------- */

  const getArms = (cls) => {
    const entry = (wizard.arms || []).find((a) =>
      Array.isArray(a.className) ? a.className.includes(cls) : a.className === cls
    );
    return entry?.armNames || [];
  };

  const isSelected = (className, armName) =>
    selected.some((s) => s.className === className && s.armName === armName);

  const toggleArm = (className, armName) => {
    setSelected((prev) =>
      isSelected(className, armName)
        ? prev.filter((s) => !(s.className === className && s.armName === armName))
        : [...prev, { className, armName }]
    );
  };

  const allArmsTicked = (cls) => {
    const arms = getArms(cls);
    return arms.length > 0 && arms.every((arm) => isSelected(cls, arm));
  };

  const toggleWholeClass = (cls) => {
    const arms = getArms(cls);
    if (allArmsTicked(cls)) {
      setSelected((prev) => prev.filter((s) => s.className !== cls));
    } else {
      setSelected((prev) => [
        ...prev.filter((s) => s.className !== cls),
        ...arms.map((armName) => ({ className: cls, armName })),
      ]);
    }
  };

  // Adds `subject` to every ticked class/arm inside `list`, under `field`
  const addToSelected = (list, field, subject) => {
    const next = [...list];
    selected.forEach(({ className, armName }) => {
      const idx = next.findIndex(
        (item) => item.className === className && item.armName === armName
      );
      if (idx >= 0) {
        const already = next[idx][field].some(
          (s) => s.toLowerCase() === subject.toLowerCase()
        );
        if (!already) {
          next[idx] = { ...next[idx], [field]: [...next[idx][field], subject] };
        }
      } else {
        next.push({ className, armName, [field]: [subject] });
      }
    });
    return next;
  };

  const addSubject = (type) => {
    const isCompulsory = type === 'compulsory';
    const subject = (isCompulsory ? compulsoryInput : optionalInput).trim();

    if (!subject) return;
    if (selected.length === 0) {
      setError('Tick at least one class and arm first');
      return;
    }
    setError('');

    if (isCompulsory) {
      setWizardStep('subjects', addToSelected(compulsoryList, 'offerSubject', subject));
      setCompulsoryInput('');
    } else {
      setWizardStep('optionalSubject', addToSelected(optionalList, 'optionalSubject', subject));
      setOptionalInput('');
    }
  };

  const removeSubject = (type, className, armName, subject) => {
    const isCompulsory = type === 'compulsory';
    const list = isCompulsory ? compulsoryList : optionalList;
    const field = isCompulsory ? 'offerSubject' : 'optionalSubject';

    const updated = list
      .map((item) =>
        item.className === className && item.armName === armName
          ? { ...item, [field]: item[field].filter((s) => s !== subject) }
          : item
      )
      .filter((item) => item[field].length > 0);

    setWizardStep(isCompulsory ? 'subjects' : 'optionalSubject', updated);
  };

  const startEdit = (type, className, armName, subject) => {
    setEditing({ type, className, armName, subject });
    setEditValue(subject);
    setError('');
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditValue('');
  };

  const saveEdit = () => {
    if (!editing) return;
    const { type, className, armName, subject } = editing;
    const newName = editValue.trim();

    if (!newName) {
      setError('Subject name cannot be empty');
      return;
    }

    const isCompulsory = type === 'compulsory';
    const list = isCompulsory ? compulsoryList : optionalList;
    const field = isCompulsory ? 'offerSubject' : 'optionalSubject';

    const target = list.find(
      (item) => item.className === className && item.armName === armName
    );
    const duplicate = target?.[field].some(
      (s) => s !== subject && s.toLowerCase() === newName.toLowerCase()
    );
    if (duplicate) {
      setError(`${newName} already exists in ${className} ${armName}`);
      return;
    }

    const updated = list.map((item) =>
      item.className === className && item.armName === armName
        ? { ...item, [field]: item[field].map((s) => (s === subject ? newName : s)) }
        : item
    );

    setWizardStep(isCompulsory ? 'subjects' : 'optionalSubject', updated);
    setError('');
    cancelEdit();
  };

  const finishSetup = async () => {
    setSaving(true);
    setError('');
    // try {
    //   const { data } = await setupSchoolApi({
    //     ...wizard.info,
    //     classes: wizard.classes,
    //     arms: wizard.arms,
    //     subjects: wizard.subjects,
    //     optionalSubject: wizard.optionalSubject,
    //   });
    //   setSchool(data.school);
    // } catch (err) {
    //   console.log(err.response?.data?.message);
    //   setError(err.response?.data?.message || 'Setup failed');
    // } finally {
    //   setSaving(false);
    // }
    localStorage.setItem(
      'setupSchoolApi',
      JSON.stringify({
        ...wizard.info,
        classes: wizard.classes,
        arms: wizard.arms,
        subjects: wizard.subjects,
        optionalSubject: wizard.optionalSubject,
      })
    );
    resetWizard();
    navigate('/');
  };

  /* ---------- reusable pieces ---------- */

  // Called as a function (not <Component />) so inputs keep focus while typing
  const renderGroups = (title, list, field, type) => (
    <div className="mb-6">
      <h3 className="text-base font-bold text-blue-800 border-b border-blue-100 pb-1 mb-3">
        {title}
      </h3>
      {list.length === 0 ? (
        <p className="text-sm text-gray-400">No subjects added yet.</p>
      ) : (
        list.map((item) => (
          <div key={`${item.className}-${item.armName}`} className="mb-4">
            <h4 className="font-bold text-gray-800 mb-2">
              {item.className} {item.armName}
            </h4>
            <ul className="space-y-1 text-sm">
              {item[field].map((s) => {
                const isEditing =
                  editing &&
                  editing.type === type &&
                  editing.className === item.className &&
                  editing.armName === item.armName &&
                  editing.subject === s;

                return (
                  <li
                    key={s}
                    className="bg-gray-50 px-3 py-2 rounded flex items-center justify-between gap-2"
                  >
                    {isEditing ? (
                      <>
                        <input
                          autoFocus
                          className="flex-1 border rounded-md px-2 py-1 text-sm"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') cancelEdit();
                          }}
                        />
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          onClick={saveEdit}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="text-gray-500 hover:text-gray-700"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1">{s}</span>
                 
    <Button
  type="button"
  variant='process'
  aria-label={`Edit ${s}`}
  className="p-2 flex items-center justify-center "
  onClick={() => startEdit(type, item.className, item.armName, s)}
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20H21" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M16.5 3.5C16.8978 3.10218 17.4374 2.87868 18 2.87868C18.5626 2.87868 19.1022 3.10218 19.5 3.5C19.8978 3.89782 20.1213 4.43739 20.1213 5C20.1213 5.56261 19.8978 6.10218 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</Button>

<Button
  variant="danger"
  className="p-2 flex items-center justify-center"
  aria-label={`Remove ${s}`}
  onClick={() => removeSubject(type, item.className, item.armName, s)}
>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 6H21"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6"
      stroke="#fff"
      strokeWidth="2"
    />
    <path
      d="M19 6L18.2 20H5.8L5 6"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 10V16M14 10V16"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
</Button>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );

  /* ---------- render ---------- */

  return (
    <div className="min-h-screen flex items-center flex-col bg-gray-50 pb-10">
      <Steps activeStep={5} textContent="Subjects (e.g. Mathematics, English)" />

      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md mt-14">
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <Button className="mb-8" onClick={() => navigate('/school-setup/arms')}>
          Prev
        </Button>

        {/* Class + arm checklist */}
        <h3 className="text-base font-bold text-blue-800 mb-1">Select classes and arms</h3>
        <p className="text-sm text-gray-500 mb-3">
          Subjects you add go to every ticked arm.
        </p>

        <div className="border rounded-md divide-y mb-6 max-h-64 overflow-y-auto">
          {(wizard.classes || []).map((cls) => {
            const arms = getArms(cls);
            return (
              <div key={cls} className="p-3">
                <label className="flex items-center gap-2 font-semibold text-blue-800 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={allArmsTicked(cls)}
                    onChange={() => toggleWholeClass(cls)}
                    disabled={arms.length === 0}
                  />
                  {cls}
                </label>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 ml-6">
                  {arms.length === 0 && (
                    <span className="text-xs text-gray-400">No arms added</span>
                  )}
                  {arms.map((arm) => (
                    <label
                      key={arm}
                      className="flex items-center gap-1 text-sm text-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="accent-blue-600"
                        checked={isSelected(cls, arm)}
                        onChange={() => toggleArm(cls, arm)}
                      />
                      {arm}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add subjects */}
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            placeholder="Compulsory subject e.g. Mathematics"
            value={compulsoryInput}
            onChange={(e) => setCompulsoryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSubject('compulsory')}
          />
          <Button variant="outline" onClick={() => addSubject('compulsory')}>
            Add
          </Button>
        </div>

        <div className="flex gap-2 mb-8">
          <input
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            placeholder="Optional subject e.g. French"
            value={optionalInput}
            onChange={(e) => setOptionalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSubject('optional')}
          />
          <Button variant="outline" onClick={() => addSubject('optional')}>
            Add
          </Button>
        </div>

        {/* Output */}
        {renderGroups('Compulsory Subjects', compulsoryList, 'offerSubject', 'compulsory')}
        {renderGroups('Optional Subjects', optionalList, 'optionalSubject', 'optional')}

        <Button className="w-full" onClick={finishSetup} disabled={saving}>
          {saving ? 'Setting up...' : 'Finish Setup'}
        </Button>
      </div>
    </div>
  );
}