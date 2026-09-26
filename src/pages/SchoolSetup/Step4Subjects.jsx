import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchoolStore } from '../../store/useSchoolStore';
import { setupSchool as setupSchoolApi } from '../../api/school.api';
import Button from '../../components/common/Button';
import Steps from '../../components/common/Steps';

export default function Step4Subjects() {
  const navigate = useNavigate();
  const { wizard, setWizardStep, setSchool, resetWizard } = useSchoolStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const addSubject = () => {
    if (!input.trim()) return;
    setWizardStep('subjects', [...wizard.subjects, input.trim()]);
    setInput('');
  };

  const finishSetup = async () => {
    setSaving(true);
    setError('');
    try {
      const { data } = await setupSchoolApi({
        ...wizard.info,
        classes: wizard.classes,
        arms: wizard.arms,
        subjects: wizard.subjects,
      });
      setSchool(data.school);
      resetWizard();
      navigate('/school-setup/admin-signup');
    } catch (err) {
      setError(err.response?.data?.message || 'Setup failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center flex-col bg-gray-50 ">
     <Steps activeStep={5} textContent = 'Subjects (e.g. Mathematics, English)' />
       
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md mt-14">
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            placeholder="e.g. Mathematics"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSubject()}
          />
          <Button variant="outline" onClick={addSubject}>Add</Button>
        </div>

        <ul className="mb-6 space-y-1 text-sm">
          {wizard.subjects.map((s) => (
            <li key={s} className="bg-gray-50 px-3 py-2 rounded">{s}</li>
          ))}
        </ul>

        <Button className="w-full" onClick={finishSetup} disabled={saving}>
          {saving ? 'Setting up...' : 'Finish Setup'}
        </Button>
      </div>
    </div>
  );
}
