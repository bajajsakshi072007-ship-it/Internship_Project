import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { getAvatarUrl } from '../../utils/helpers'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen]       = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isScrolled, setIsScrolled]       = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsProfileOpen(false)
    await logout()
    navigate('/')
  }

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-primary-500' : 'text-gray-700 hover:text-primary-500'
    }`

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100' : 'bg-white'
      }`}
    >
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
              AM
            </div>
            <span className="font-heading font-bold text-lg text-gray-900 hidden sm:block">
              Artisan<span className="text-primary-500">Market</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/"         className={navLinkClass} end>Home</NavLink>
            <NavLink to="/products" className={navLinkClass}>Products</NavLink>
            <NavLink to="/about"    className={navLinkClass}>About</NavLink>
            <NavLink to="/contact"  className={navLinkClass}>Contact</NavLink>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Cart (buyer only) */}
            {isAuthenticated && user?.role === 'buyer' && (
              <Link
                to="/cart"
                className="relative p-2 text-gray-700 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all"
                aria-label="Shopping cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-scale-in">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Authenticated User */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-all"
                  aria-label="User menu"
                  aria-expanded={isProfileOpen}
                >
                  <img
                    src={getAvatarUrl(user)}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200"
                  />
                  <svg className={`w-4 h-4 text-gray-500 transition-transform hidden md:block ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-52 card shadow-lg py-2 animate-slide-down">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    {user?.role === 'seller' ? (
                      <Link to="/dashboard" onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                        Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link to="/orders" onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                          My Orders
                        </Link>
                        <Link to="/wishlist" onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                          Wishlist
                        </Link>
                      </>
                    )}
                    <Link to="/profile" onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      Profile
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"    className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1 animate-slide-down">
            {[
              { to: '/',         label: 'Home',     end: true },
              { to: '/products', label: 'Products' },
              { to: '/about',    label: 'About' },
              { to: '/contact',  label: 'Contact' },
            ].map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <div className="pt-2 flex gap-2 px-4">
                <Link to="/login"    onClick={() => setIsMenuOpen(false)} className="btn btn-outline btn-sm flex-1 justify-center">Login</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn btn-primary btn-sm flex-1 justify-center">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
