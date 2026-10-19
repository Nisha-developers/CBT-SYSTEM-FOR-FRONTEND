import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminSignup } from '../api/auth.api';
import { checkSchoolExists } from '../api/school.api';
import { apiError } from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/common/Button';
import { UserPlus, Mail, Lock, User, AtSign, Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

const inputCls =
  'w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors';

// Last step of first-time setup: create the super-admin account.
export default function AdminSignup() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ fullName: '', email: '', username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  // Guard: only reachable after the school exists and before an admin exists.
  useEffect(() => {
    checkSchoolExists()
      .then(({ data }) => {
        if (!data.exists) navigate('/school-setup/info', { replace: true });
        else if (data.hasAdmin) navigate('/login', { replace: true });
      })
      .catch(() => {});
  }, [navigate]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setBusy(true);
    try {
      const { data } = await adminSignup({
        fullName: form.fullName, email: form.email, username: form.username, password: form.password,
      });
      login(data.accessToken, data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl shadow-blue-600/50 p-8 lg:p-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
              <UserPlus className="w-7 h-7 text-blue-600" />
            </div>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Create Admin Account</h1>
          <p className="text-sm text-gray-500 mt-1">Your school is ready. Create the main administrator account.</p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-lg mb-5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-gray-700">
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gray-400" />Full Name</span>
            <input className={inputCls} value={form.fullName} onChange={set('fullName')} required />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-gray-700">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" />Email</span>
            <input type="email" className={inputCls} value={form.email} onChange={set('email')} required />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-gray-700">
            <span className="flex items-center gap-1.5"><AtSign className="w-3.5 h-3.5 text-gray-400" />Username</span>
            <input className={inputCls} value={form.username} onChange={set('username')} minLength={3} required />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-gray-700">
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-gray-400" />Password</span>
            <div className="relative">
              <input type={show ? 'text' : 'password'} className={`${inputCls} pr-10`} value={form.password}
                onChange={set('password')} minLength={8} required />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[11px] text-gray-400 font-normal">At least 8 characters.</span>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-medium text-gray-700">
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-gray-400" />Confirm Password</span>
            <input type={show ? 'text' : 'password'} className={inputCls} value={form.confirm} onChange={set('confirm')} required />
          </label>

          <Button type="submit" disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60">
            {busy ? (<><Loader2 className="w-4 h-4 animate-spin" />Creating...</>) : (<>Create Account<ArrowRight className="w-4 h-4" /></>)}
          </Button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-5">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
