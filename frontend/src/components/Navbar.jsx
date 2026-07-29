import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Store, Search, Sparkles, Menu, X, Compass, PackageCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const { user, isArtisan, logout } = useAuth();
  const { totalItems } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-amber-50/90 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Platform Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-terracotta-500 to-terracotta-700 flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-105 transition-transform">
              🪔
            </div>
            <div>
              <span className="font-serif text-2xl font-extrabold tracking-tight text-stone-900 group-hover:text-terracotta-600 transition-colors">
                Gramin<span className="text-terracotta-600">Craft</span>
              </span>
              <span className="block text-[10px] font-bold tracking-widest text-stone-500 uppercase -mt-1">
                Rural Handicrafts Hub
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-amber-300/80 focus:border-terracotta-500 rounded-full pl-4 pr-10 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all shadow-xs text-stone-800"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-terracotta-600 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Navigation & Controls */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Multi-Language Selector */}
            <LanguageSelector />

            <Link
              to="/products"
              className="text-stone-700 hover:text-terracotta-600 font-semibold text-xs transition-colors flex items-center gap-1"
            >
              <Compass className="w-4 h-4 text-terracotta-500" />
              <span>{t('crafts')}</span>
            </Link>

            {user && !isArtisan && (
              <Link
                to="/my-orders"
                className="text-stone-700 hover:text-terracotta-600 font-semibold text-xs transition-colors flex items-center gap-1"
              >
                <PackageCheck className="w-4 h-4 text-amber-600" />
                <span>{t('myOrders')}</span>
              </Link>
            )}

            {isArtisan && (
              <Link
                to="/artisan/dashboard"
                className="bg-amber-200/80 hover:bg-amber-300 text-stone-900 border border-amber-400/60 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Store className="w-4 h-4 text-terracotta-600" />
                <span>{t('dashboard')}</span>
              </Link>
            )}

            {/* Shopping Cart Icon Badge */}
            <Link to="/cart" className="relative p-2 text-stone-700 hover:text-terracotta-600 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Auth Controls */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-amber-200">
                <div className="text-right">
                  <span className="block text-xs font-bold text-stone-900 leading-tight">{user.name}</span>
                  <span className="text-[10px] font-semibold text-terracotta-600 capitalize">
                    {user.role === 'artisan' ? 'Rural Artisan' : 'Conscious Buyer'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-stone-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                  title={t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-amber-200">
                <Link
                  to="/login"
                  className="text-stone-800 hover:text-terracotta-600 font-bold text-xs px-3 py-2 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('register')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSelector />
            <Link to="/cart" className="relative p-2 text-stone-700">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-terracotta-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-800 hover:text-terracotta-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-amber-50 border-b border-amber-200 p-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-amber-300 rounded-xl pl-4 pr-10 py-2 text-xs text-stone-800"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <div className="flex flex-col space-y-2 pt-2 text-sm font-semibold text-stone-800">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-amber-100">
              {t('crafts')}
            </Link>
            {user && !isArtisan && (
              <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-amber-100">
                {t('myOrders')}
              </Link>
            )}
            {isArtisan && (
              <Link to="/artisan/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 text-terracotta-600 border-b border-amber-100">
                {t('dashboard')}
              </Link>
            )}
            {user ? (
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="py-2 text-rose-600 text-left font-bold">
                {t('logout')} ({user.name})
              </button>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 border border-amber-300 rounded-xl">
                  {t('login')}
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-terracotta-600 text-white rounded-xl">
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
