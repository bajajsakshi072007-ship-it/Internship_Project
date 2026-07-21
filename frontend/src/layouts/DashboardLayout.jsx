import React, { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAvatarUrl } from '../utils/helpers'

const DashboardLayout = () => {
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navItems = [
    { to: '/dashboard',          label: 'Overview',      icon: '', end: true },
    { to: '/dashboard/products', label: 'My Products',   icon: '' },
  ]

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary-500 text-white shadow-sm'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 shadow-sm
        transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
              AM
            </div>
            <span className="font-heading font-bold text-gray-900">
              Artisan<span className="text-primary-500">Market</span>
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src={getAvatarUrl(user)} alt={user?.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100" />
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">Artisan Seller</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">Menu</p>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <hr className="my-3 border-gray-100" />
          <NavLink to="/profile" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
            Profile
          </NavLink>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
            View Store
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-heading font-bold text-gray-900">Seller Dashboard</h1>
          <div className="text-sm text-gray-500 hidden sm:block">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
