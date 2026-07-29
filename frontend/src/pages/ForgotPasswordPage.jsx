import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { api } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [demoResetLink, setDemoResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setDemoResetLink('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.forgotPassword(email.trim());
      setSuccessMsg(res.message || 'Password reset instructions sent to your email.');
      if (res.resetToken) {
        setDemoResetLink(`/reset-password/${res.resetToken}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-amber-200 p-8 rounded-3xl space-y-6 shadow-lg">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-100/80 rounded-2xl flex items-center justify-center mx-auto text-terracotta-600 shadow-sm border border-amber-200">
            <KeyRound className="w-7 h-7 text-terracotta-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 font-serif">Reset Password</h1>
          <p className="text-xs text-stone-500 font-medium">
            Enter your registered email address to receive a secure password reset link.
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Feedback */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-2xl space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-700">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>

            {demoResetLink && (
              <div className="p-3 bg-white/80 border border-emerald-300 rounded-xl space-y-1.5 text-[11px]">
                <span className="font-bold text-stone-700 block">Demo Reset Link Preview:</span>
                <Link
                  to={demoResetLink}
                  className="text-terracotta-600 hover:underline font-mono break-all block"
                >
                  {window.location.origin}{demoResetLink}
                </Link>
                <p className="text-[10px] text-stone-500 italic">
                  (Click above link to test setting a new password)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-xs font-bold text-stone-800 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                id="reset-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-amber-50/40 border border-amber-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                required
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Sending Reset Request...' : 'Send Password Reset Link'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Navigation Link */}
        <div className="text-center pt-2 text-xs">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 font-bold text-stone-600 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
