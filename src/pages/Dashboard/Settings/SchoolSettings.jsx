import { useEffect, useState } from 'react';
import { getSchool, updateSchool } from '../../../api/school.api';
import Button from '../../../components/common/Button';

export default function SchoolSettings() {
  const [form, setForm] = useState({ name: '', motto: '', address: '', phone: '', email: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSchool().then(({ data }) => setForm(data.school || {}));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSchool(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">School Settings</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-3">
        {saved && <p className="text-sm text-green-600">Saved.</p>}
        {['name', 'motto', 'address', 'phone', 'email'].map((field) => (
          <input key={field} className="w-full border rounded-md px-3 py-2 text-sm" placeholder={field}
            value={form[field] || ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
        ))}
        <Button type="submit" className="w-full">Save Changes</Button>
      </form>
    </div>
  );
}
