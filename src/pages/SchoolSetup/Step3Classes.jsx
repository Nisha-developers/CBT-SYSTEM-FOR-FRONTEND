import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchoolStore } from '../../store/useSchoolStore';
import Button from '../../components/common/Button';
import Steps from '../../components/common/Steps';

export default function Step3Classes() {
  const navigate = useNavigate();
  const { wizard, setWizardStep } = useSchoolStore();
  const [input, setInput] = useState('');

  const addClass = () => {
    if (!input.trim()) return;
    setWizardStep('classes', [...wizard.classes, input.trim()]);
    setInput('');
  };
  const removeClass = (name) => setWizardStep('classes', wizard.classes.filter((c) => c !== name));

  return (
    <div className="min-h-screen flex items-center flex-col  bg-gray-50 mt-14">
      
    <Steps activeStep={3} textContent = 'Classes(Eg: JSS1, SS2)' />
   
       
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
    <Button className="mb-8" onClick={() => navigate('/school-setup/info2')}>
              Prev
            </Button>
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            placeholder="e.g. SS1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addClass()}
          />
          <Button variant="outline" onClick={addClass}>Add</Button>
        </div>

        <ul className="mb-6 space-y-1">
          {wizard.classes.map((c) => (
            <li key={c} className="flex justify-between text-sm bg-gray-50 px-3 py-2 rounded">
              {c}
              <button onClick={() => removeClass(c)} className="text-red-500">✕</button>
            </li>
          ))}
        </ul>
        
<div className="flex justify-end">
        <Button className="" onClick={() => navigate('/school-setup/arms')}>
          Next
        </Button>
      </div>
      </div>
    </div>
  );
}
