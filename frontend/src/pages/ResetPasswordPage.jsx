import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function ResetPasswordPage() {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(resetToken, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Token may be invalid or expired.');
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
            <ShieldCheck className="w-7 h-7 text-terracotta-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 font-serif">Set New Password</h1>
          <p className="text-xs text-stone-500 font-medium">
            Please enter your new password below to secure your account.
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success View */}
        {success ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-900 text-center rounded-2xl space-y-4">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-emerald-800">Password Reset Complete!</h3>
              <p className="text-xs text-emerald-700">
                Your password has been securely updated in MongoDB. You can now sign in with your new password.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Proceed to Sign In
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-xs font-bold text-stone-800 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-amber-50/40 border border-amber-300 rounded-xl pl-9 pr-10 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  required
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-xs font-bold text-stone-800 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-amber-50/40 border border-amber-300 rounded-xl pl-9 pr-10 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  required
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center pt-2 text-xs text-stone-600">
          Remembered your password?{' '}
          <Link to="/login" className="font-bold text-terracotta-600 hover:underline">
            Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
