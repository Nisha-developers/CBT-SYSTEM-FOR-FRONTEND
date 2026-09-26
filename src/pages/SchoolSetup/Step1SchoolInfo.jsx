import { useNavigate } from 'react-router-dom';
import { useSchoolStore } from '../../store/useSchoolStore';
import Button from '../../components/common/Button';

const fields = ['name', 'motto', 'address', 'phone', 'email'];

export default function Step1SchoolInfo() {
  const navigate = useNavigate();
  const { wizard, setWizardStep } = useSchoolStore();
  const info = wizard.info;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h1 className="text-xl font-semibold mb-1">School Setup</h1>
        <p className="text-sm text-gray-500 mb-6">Step 1 of 4 — School Information</p>

        {fields.map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm mb-1 capitalize">{field}</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={info[field] || ''}
              onChange={(e) => setWizardStep('info', { ...info, [field]: e.target.value })}
            />
          </div>
        ))}
        {/* Logo upload wiring goes here — store the file/URL in wizard.info.logoUrl */}

        <Button className="w-full" onClick={() => navigate('/school-setup/classes')}>
          Continue
        </Button>
      </div>
    </div>
  );
}
