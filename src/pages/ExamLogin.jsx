import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { examAdminLogin } from '../api/auth.api';
import { apiError } from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/common/Button';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function ExamLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState({ emailOrUsername: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const { data } = await examAdminLogin(form);
      login(data.accessToken, data.user);
      navigate('/exams/rooms');
    } catch (err) {
      setError(apiError(err, 'Login failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        <div className="p-8 lg:p-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-blue-600" />
              </div>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Examination Access</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to access the Available Examinations</p>
          </div>

          {error && (
            <div role="alert" className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-lg mb-5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" /> Email or Username
              </span>
              <input
                type="text"
                placeholder="e.g. admin@school.edu"
                autoComplete="username"
                value={form.emailOrUsername}
                onChange={(event) => setForm({ ...form, emailOrUsername: event.target.value })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                required
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-400" /> Password
              </span>
              <span className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </span>
            </label>

            <Link className="flex justify-end text-xs hover:text-blue-600" to="/ForgetPassword">Forget Password</Link>

            <Button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2">
              {isSubmitting ? 'Signing in…' : <>Login <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
