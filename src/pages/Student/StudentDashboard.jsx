import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { signOut } from '../../utils/session';
import { changeStudentPassword } from '../../api/auth.api';
import { apiError } from '../../api/axios';
import Button from '../../components/common/Button';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/student/login', { replace: true });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    if (form.newPassword !== form.confirm) return setMsg({ type: 'error', text: 'New passwords do not match.' });
    setBusy(true);
    try {
      await changeStudentPassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setMsg({ type: 'success', text: 'Password changed successfully.' });
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setMsg({ type: 'error', text: apiError(err) });
    } finally {
      setBusy(false);
    }
  };

  const field = 'w-full border rounded-md px-3 py-2 text-sm';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-start justify-between max-w-md">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Welcome, {user?.fullName}</h1>
          <p className="text-gray-500 mb-6">What would you like to do?</p>
        </div>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600">Log out</button>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-md">
        <Link to="/student/exams" className="bg-white p-5 rounded-lg shadow hover:shadow-md text-center">
          Available Exams
        </Link>
        <Link to="/student/results" className="bg-white p-5 rounded-lg shadow hover:shadow-md text-center">
          My Results
        </Link>
      </div>

      <form onSubmit={handleChangePassword} className="bg-white p-5 rounded-lg shadow max-w-md mt-8 space-y-3">
        <h2 className="font-semibold text-sm">Change Password</h2>
        {user?.mustChangePassword && (
          <p className="text-xs text-amber-600">Your password is still your last name. Please choose a new one.</p>
        )}
        {msg.text && (
          <p className={`text-xs rounded-md px-3 py-2 ${msg.type === 'error' ? 'text-red-700 bg-red-50' : 'text-emerald-700 bg-emerald-50'}`}>{msg.text}</p>
        )}
        <input type="password" className={field} placeholder="Current password" required
          value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
        <input type="password" className={field} placeholder="New password (min 8 characters)" minLength={8} required
          value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
        <input type="password" className={field} placeholder="Confirm new password" required
          value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        <Button type="submit" disabled={busy} className="w-full">{busy ? 'Saving...' : 'Change Password'}</Button>
      </form>
    </div>
  );
}
