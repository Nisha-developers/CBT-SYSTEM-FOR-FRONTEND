import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminLogin } from '../api/auth.api';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/common/Button';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ShieldCheck,
  ArrowRight,
  Loader2
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ emailOrUsername: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    navigate('/dashboard');
    // try {
    //   const { data } = await adminLogin(form);
    //   login(data.token, { ...data.admin, role: 'admin' });
    //   navigate('/dashboard');
    // } catch (err) {
    //   setError(err.response?.data?.message || 'Login failed');
    // }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-6">
      
      <div className="w-full max-w-md">
        
        {/* ========================================================= */}
        {/* LOGIN CARD */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-blue-600/50 overflow-hidden">
          
          <div className="p-8 lg:p-10">
            
            {/* ========================================================= */}
            {/* BRANDING / HEADER */}
            {/* ========================================================= */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-blue-600" />
                </div>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                Admin Login
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Sign in to access the administration dashboard.
              </p>
            </div>

            {/* ========================================================= */}
            {/* ERROR MESSAGE */}
            {/* ========================================================= */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-lg mb-5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 leading-relaxed">{error}</p>
              </div>
            )}

            {/* ========================================================= */}
            {/* FORM */}
            {/* ========================================================= */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email or Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  Email or Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. admin@school.edu"
                  value={form.emailOrUsername}
                  onChange={(e) => setForm({ ...form, emailOrUsername: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

             

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}