import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import Button from '../components/common/Button';
import { resetPassword } from '../api/auth.api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const token = useParams();
  

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!token) {
      setError('Invalid or missing reset token. Please request a new reset link.');
      return;
    }

    setIsSubmitting(true);
    try {
        
      // Replace with your real API
       await resetPassword({ token: token.id, newPassword: form.password, confirmPassword: form.confirmPassword });

      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- SUCCESS STATE ---
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-blue-600/50 overflow-hidden">
            <div className="p-8 lg:p-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Password Reset Successful
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Your password has been updated. You'll be redirected to the login page in a moment.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Go to Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- FORM STATE ---
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-6">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-blue-600/50 overflow-hidden">
          
          <div className="p-8 lg:p-10">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-blue-600" />
                </div>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                Set New Password
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Choose a strong password you haven't used before.
              </p>
            </div>

            {/* Token Warning */}
            {!token && (
              <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-lg mb-5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  No reset token found in the URL. Please use the link from your email.
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-lg mb-5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 leading-relaxed">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
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
                <p className="text-xs text-gray-400 mt-0.5">Minimum 6 characters.</p>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !token}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}