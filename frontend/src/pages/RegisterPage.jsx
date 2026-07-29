import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Store, ShoppingBag, User, Mail, Lock, MapPin, Sparkles, ArrowRight, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'buyer';

  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(defaultRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    craftSpecialty: '',
    stateOfOrigin: 'Rajasthan',
    district: '',
    village: '',
    bio: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register({ ...formData, role });
      if (user.role === 'artisan') {
        navigate('/artisan/dashboard');
      } else {
        navigate('/products');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white border border-amber-200 p-8 rounded-3xl space-y-6 shadow-md">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-stone-900 font-serif">Create Account</h1>
          <p className="text-xs text-stone-500 font-medium">
            Join GraminCraft as a Conscious Buyer or Rural Artisan
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-amber-100/60 rounded-2xl border border-amber-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              role === 'buyer'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>I am a Buyer</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('artisan')}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              role === 'artisan'
                ? 'bg-terracotta-600 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>I am a Rural Artisan</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Sunita Devi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Email Address *</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Password (min 6 chars) *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              minLength={6}
              required
            />
          </div>

          {/* Additional Artisan Fields */}
          {role === 'artisan' && (
            <div className="pt-2 border-t border-amber-100 space-y-4">
              <h4 className="font-bold text-stone-900 text-xs text-terracotta-700 uppercase tracking-wider">
                Artisan Heritage Profile Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Craft Specialty *</label>
                  <input
                    type="text"
                    placeholder="e.g. Terracotta Pottery, Handloom Saree"
                    value={formData.craftSpecialty}
                    onChange={(e) => setFormData({ ...formData, craftSpecialty: e.target.value })}
                    className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    required={role === 'artisan'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">State of Origin *</label>
                  <select
                    value={formData.stateOfOrigin}
                    onChange={(e) => setFormData({ ...formData, stateOfOrigin: e.target.value })}
                    className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  >
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Artisan Family Bio & Heritage Story</label>
                <textarea
                  rows="2"
                  placeholder="Share a short bio about your village, family craft history, and traditional techniques..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Register & Join GraminCraft'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-600">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-terracotta-600 hover:underline">
            Login Here
          </Link>
        </div>

      </div>
    </div>
  );
}
