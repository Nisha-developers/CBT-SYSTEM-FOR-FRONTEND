import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchoolStore } from '../../store/useSchoolStore';
import Button from '../../components/common/Button';
import Steps from '../../components/common/Steps';

// Arms belong to a class (e.g. SS2 -> A, B). Depends on classes from Step 3.
export default function Step2Arms() {
  const navigate = useNavigate();
  const { wizard, setWizardStep } = useSchoolStore();
  const [className, setClassName] = useState(wizard.classes[0] || '');
  const [armInput, setArmInput] = useState('');

  const addArm = () => {
    if (!className || !armInput.trim()) return;
    const existingGroup = wizard.arms.find((g) => g.className === className);
    let updated;
    if (existingGroup) {
      updated = wizard.arms.map((g) =>
        g.className === className ? { ...g, armNames: [...g.armNames, armInput.trim()] } : g
      );
    } else {
      updated = [...wizard.arms, { className, armNames: [armInput.trim()] }];
    }
    setWizardStep('arms', updated);
    setArmInput('');
  };

  return (
    <div className="min-h-screen flex items-center  bg-gray-50 flex-col">
      
       <Steps activeStep={4} textContent = 'Arms per class (e.g. A, B, Science)' />
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md mt-14">
       
     <Button className="mb-8" onClick={() => navigate('/school-setup/classes')}>
              Prev
            </Button>
        {wizard.classes.length === 0 ? (
          <p className="text-sm text-red-500 mb-4">Add classes first (previous step).</p>
        ) : (
          <>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm mb-3"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            >
              {wizard.classes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 border rounded-md px-3 py-2 text-sm"
                placeholder="e.g. A"
                value={armInput}
                onChange={(e) => setArmInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addArm()}
              />
              <Button variant="outline" onClick={addArm}>Add</Button>
            </div>
          </>
        )}

        <ul className="mb-6 space-y-1 text-sm">
          {wizard.arms.map((g) => (
            <li key={g.className} className="bg-gray-50 px-3 py-2 rounded">
              <strong>{g.className}:</strong> {g.armNames.join(', ')}
            </li>
          ))}
        </ul>
<div className="flex justify-end">
        <Button className="" onClick={() => navigate('/school-setup/subjects')}>
         Next
        </Button>
        </div>
      </div>
    </div>
  );
}
