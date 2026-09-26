import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSignup } from '../api/auth.api';
import { useAuthStore } from '../store/useAuthStore';
import { useSchoolStore } from '../store/useSchoolStore';
import Button from '../components/common/Button';

// Last step of first-time setup: create the administrator account,
// linked to the school created in the wizard (Section 5).
export default function AdminSignup() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const school = useSchoolStore((s) => s.school);
  const [form, setForm] = useState({ fullName: '', email: '', username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await adminSignup({ ...form, schoolId: school?.id });
      login(data.token, { ...data.admin, role: 'admin' });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-6">Create Admin Account</h1>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {['fullName', 'email', 'username', 'password'].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm mb-1 capitalize">{field}</label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          </div>
        ))}
        <Button type="submit" className="w-full">Create Account</Button>
      </form>
    </div>
  );
}
