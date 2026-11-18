import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  KeyRound,
  ArrowRight
} from 'lucide-react';
import Button from '../components/common/Button';
import { forgetPassword } from '../api/auth.api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
        console.log(email);
      await forgetPassword({ email });
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-6">
      <div className="w-full max-w-md">

        {/* ========================================================= */}
        {/* CARD */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-blue-600/50 overflow-hidden">
          
          <div className="p-8 lg:p-10">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <KeyRound className="w-7 h-7 text-blue-600" />
                </div>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                Forgot Password?
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            {/* Success State */}
            {success ? (
              <div className="space-y-5">
                <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">
                      Check your inbox
                    </p>
                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                       We've sent a link to <strong>{email}</strong> for you to reset your password. The link expires in 30 minutes.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setEmail('');
                    }}
                    className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Try a different email
                  </button>
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Back to Login
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-lg mb-5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 leading-relaxed">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. admin@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}

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