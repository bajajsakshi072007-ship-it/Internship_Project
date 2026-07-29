import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, ShoppingBag, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
  const { login, loading, error: authError } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both email and password.');
      return;
    }

    try {
      const user = await login({ email: email.trim(), password });
      if (user?.role === 'artisan') {
        navigate('/artisan/dashboard');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setLocalError(err.message || 'Invalid email or password.');
    }
  };

  const fillQuickDemo = (role) => {
    setLocalError('');
    if (role === 'artisan') {
      setEmail('sunita.artisan@example.com');
      setPassword('password123');
    } else {
      setEmail('buyer@example.com');
      setPassword('password123');
    }
  };

  const activeError = localError || authError;

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-amber-200 p-8 rounded-3xl space-y-6 shadow-lg">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-100/80 rounded-2xl flex items-center justify-center mx-auto text-terracotta-600 text-3xl shadow-sm border border-amber-200">
            🪔
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 font-serif">Welcome Back</h1>
          <p className="text-xs text-stone-500 font-medium">
            Sign in to access your Local Artisan account
          </p>
        </div>

        {/* Quick Demo Fill Helper */}
        <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-2">
          <span className="text-[11px] font-bold text-stone-700 block text-center uppercase tracking-wider">
            Quick Demo Credentials
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => fillQuickDemo('artisan')}
              className="bg-amber-200/80 hover:bg-amber-300 text-stone-900 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
            >
              <Store className="w-3.5 h-3.5 text-terracotta-600" />
              <span>Demo Artisan</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('buyer')}
              className="bg-stone-900 hover:bg-stone-800 text-white py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Buyer</span>
            </button>
          </div>
        </div>

        {/* Dynamic Error Feedback Banner */}
        {activeError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{activeError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-bold text-stone-800 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                id="login-email"
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="block text-xs font-bold text-stone-800">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] font-semibold text-terracotta-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 text-xs text-stone-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-terracotta-600 hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}


