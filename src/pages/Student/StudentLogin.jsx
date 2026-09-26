import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentLogin } from '../../api/auth.api';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../../components/common/Button';

export default function StudentLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ admissionNumber: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await studentLogin(form);
      login(data.token, { ...data.student, role: 'student' });
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-6">Student Login</h1>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <label className="block text-sm mb-1">Admission Number</label>
        <input className="w-full border rounded-md px-3 py-2 mb-4 text-sm"
          value={form.admissionNumber} onChange={(e) => setForm({ ...form, admissionNumber: e.target.value })} />
        <label className="block text-sm mb-1">Password</label>
        <input type="password" className="w-full border rounded-md px-3 py-2 mb-6 text-sm"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  );
}
