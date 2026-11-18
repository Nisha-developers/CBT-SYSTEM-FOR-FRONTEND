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
  const [editingClass, setEditingClass] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
const addArm = () => {
  const newArm = armInput.trim();

  if (!className || !newArm) return;

  const updated = wizard.classes.map((classItem) => {
    const existingGroup = wizard.arms.find(
      (g) => g.className === classItem
    );

    if (!existingGroup) {
      return {
        className: classItem,
        armNames: [newArm]
      };
    }

    const alreadyExists = existingGroup.armNames.some(
      (arm) => arm.toLowerCase() === newArm.toLowerCase()
    );

    if (alreadyExists) {
      return existingGroup;
    }

    return {
      ...existingGroup,
      armNames: [...existingGroup.armNames, newArm]
    };
  });

  setWizardStep('arms', updated);
  setArmInput('');
};

const editArm = (className, index, armName) => {
  window.scrollTo({
  top: 0,
  behavior: 'smooth'
});
  setClassName(className);
  setArmInput(armName);
  setEditingClass(className);
  setEditingIndex(index);
};

const updateArm = () => {
  const updatedArm = armInput.trim();

  if (!updatedArm) return;

  const updated = wizard.arms.map((group) => {
    if (group.className !== editingClass) return group;

    const duplicate = group.armNames.some(
      (arm, index) =>
        index !== editingIndex &&
        arm.toLowerCase() === updatedArm.toLowerCase()
    );

    if (duplicate) return group;

    return {
      ...group,
      armNames: group.armNames.map((arm, index) =>
        index === editingIndex ? updatedArm : arm
      )
    };
  });

  setWizardStep('arms', updated);
  setEditingClass(null);
  setEditingIndex(null);
  setArmInput('');
};

const deleteArm = (className, index) => {
  const updated = wizard.arms
    .map((group) => {
      if (group.className !== className) return group;

      return {
        ...group,
        armNames: group.armNames.filter(
          (_, armIndex) => armIndex !== index
        )
      };
    })
    .filter((group) => group.armNames.length > 0);

  setWizardStep('arms', updated);
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
             {editingClass !== null ? (
  <Button onClick={updateArm}>
    Update
  </Button>
) : (
  <Button variant="outline" onClick={addArm}>
    Add
  </Button>
)}
            </div>
          </>
        )}

       <ul className="mb-6 space-y-2 text-sm">
  {wizard.arms.map((g) => (
    <li
      key={g.className}
      className="bg-gray-50 px-3 py-2 rounded"
    >
      <strong>{g.className}:</strong>

      <div className="flex flex-wrap gap-2 mt-2">
        {g.armNames.map((arm, index) => (
          <div
            key={index}
            className="flex items-center gap-1"
          >
            <span className="bg-white border px-2 py-1 rounded">
              {arm}
            </span>

           <Button
  variant="process"
  className="p-2 flex items-center justify-center"
  onClick={() => editArm(g.className, index, arm)}
>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 20H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16.5 3.5C16.8978 3.10218 17.4374 2.87868 18 2.87868C18.5626 2.87868 19.1022 3.10218 19.5 3.5C19.8978 3.89782 20.1213 4.43739 20.1213 5C20.1213 5.56261 19.8978 6.10218 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</Button>

<Button
  variant="danger"
  className="p-2 flex items-center justify-center"
  onClick={() => deleteArm(g.className, index)}
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
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M19 6L18.2 20H5.8L5 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 10V16M14 10V16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
</Button>
          </div>
        ))}
      </div>
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
