import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Register = () => {
  const { register: registerUser, user: currentUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === 'seller') {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
  }, [isAuthenticated, currentUser, navigate])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: 'buyer',
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const selectedRole = watch('role')
  const password = watch('password') || ''

  // Password strength checks
  const hasMinLength = password.length >= 6
  const hasLetter = /[A-Za-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  const strengthScore = [hasMinLength, hasLetter, hasNumber, password.length >= 8 || hasSpecial].filter(Boolean).length

  const getStrengthLabel = () => {
    if (!password) return { text: '', color: 'bg-gray-200', width: '0%' }
    if (strengthScore <= 1) return { text: 'Weak', color: 'bg-red-500', width: '33%' }
    if (strengthScore === 2 || strengthScore === 3) return { text: 'Medium', color: 'bg-amber-500', width: '66%' }
    return { text: 'Strong', color: 'bg-emerald-500', width: '100%' }
  }

  const strengthInfo = getStrengthLabel()

  const onSubmit = async (data) => {
    setIsLoading(true)
    setServerError('')
    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        phone: data.phone?.trim() || undefined,
        role: data.role,
      }
      const user = await registerUser(payload)
      if (user?.role === 'seller') {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      let msg = 'Registration failed. Please try again.'
      if (err.response?.data) {
        if (err.response.data.errors && Array.isArray(err.response.data.errors) && err.response.data.errors.length > 0) {
          msg = err.response.data.errors.map((e) => e.message).join(' | ')
        } else if (err.response.data.message) {
          msg = err.response.data.message
        }
      } else if (err.message) {
        msg = err.message
      }
      setServerError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 py-12 px-4">
      <div className="w-full max-w-lg animate-scale-in">
        <div className="card p-8 shadow-card-hover bg-white rounded-2xl border border-gray-100">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-md text-white">
              🏺
            </div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join our rural artisan community as a Buyer or Seller</p>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-3">
              <span className="text-base leading-none">⚠️</span>
              <div className="flex-1">{serverError}</div>
            </div>
          )}

          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl">
              {[
                { value: 'buyer', label: "🛍️ I'm a Buyer", desc: 'Shop authentic crafts' },
                { value: 'seller', label: "🏺 I'm an Artisan", desc: 'Sell handcrafted products' },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('role', value, { shouldValidate: true })}
                  className={`py-3 px-3 rounded-lg text-sm font-medium text-center transition-all duration-200 ${
                    selectedRole === value
                      ? 'bg-white shadow-sm text-primary-700 ring-2 ring-primary-500 font-semibold'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-sm">{label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <input type="hidden" {...register('role')} />

            {/* Name */}
            <div className="form-group">
              <label className="form-label font-medium text-gray-700 text-sm block mb-1" htmlFor="reg-name">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                className={`form-input w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.name ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                }`}
                placeholder="Priya Sharma"
                {...register('name', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
                })}
              />
              {errors.name && <p className="form-error text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label font-medium text-gray-700 text-sm block mb-1" htmlFor="reg-email">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                className={`form-input w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.email ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                }`}
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please enter a valid email address' },
                })}
              />
              {errors.email && <p className="form-error text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label font-medium text-gray-700 text-sm block mb-1" htmlFor="reg-phone">
                Phone Number <span className="text-gray-400 text-xs font-normal">(optional)</span>
              </label>
              <input
                id="reg-phone"
                type="tel"
                autoComplete="tel"
                className={`form-input w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.phone ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                }`}
                placeholder="9876543210"
                {...register('phone', {
                  pattern: { value: /^[6-9]\d{9}$/, message: 'Please enter a valid 10-digit Indian mobile number' },
                })}
              />
              {errors.phone && <p className="form-error text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label font-medium text-gray-700 text-sm block mb-1" htmlFor="reg-password">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`form-input w-full px-4 py-2.5 pr-12 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.password ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                  }`}
                  placeholder="At least 6 characters with letter & number"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    pattern: {
                      value: /(?=.*[A-Za-z])(?=.*\d)/,
                      message: 'Password must contain at least one letter and one number',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 text-sm"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="form-error text-xs text-red-500 mt-1">{errors.password.message}</p>}

              {/* Password Strength Meter & Hints */}
              {password.length > 0 && (
                <div className="mt-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-gray-600">
                    <span>Password Strength:</span>
                    <span className="font-semibold">{strengthInfo.text}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strengthInfo.color}`}
                      style={{ width: strengthInfo.width }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-1 text-[11px]">
                    <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                      {hasMinLength ? '✓' : '•'} Min 6 chars
                    </span>
                    <span className={`flex items-center gap-1 ${hasLetter ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                      {hasLetter ? '✓' : '•'} 1 Letter
                    </span>
                    <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                      {hasNumber ? '✓' : '•'} 1 Number
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label font-medium text-gray-700 text-sm block mb-1" htmlFor="reg-confirm">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="reg-confirm"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`form-input w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.confirmPassword ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                }`}
                placeholder="Re-enter password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === password || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className="form-error text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-3 px-4 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 mt-4 text-center"
            >
              {isLoading
                ? 'Creating Account...'
                : `Create ${selectedRole === 'seller' ? 'Artisan / Seller' : 'Buyer'} Account`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 underline-offset-2 hover:underline">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

