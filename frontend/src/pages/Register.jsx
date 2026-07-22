import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Register = () => {
  const { register: registerUser, user: currentUser, isAuthenticated } = useAuth()
  const navigate  = useNavigate()
  const [isLoading, setIsLoading]       = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('buyer')

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === 'seller') {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
  }, [isAuthenticated, currentUser, navigate])

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: 'buyer' },
  })

  const password = watch('password')

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        role: selectedRole,
      }
      const user = await registerUser(payload)
      if (user?.role === 'seller') {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 py-12 px-4">
      <div className="w-full max-w-lg animate-scale-in">
        <div className="card p-8 shadow-card-hover">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🏺
            </div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join our artisan community</p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-gray-100 rounded-xl">
            {[
              { value: 'buyer',  label: '🛍️ I\'m a Buyer',   desc: 'Shop products' },
              { value: 'seller', label: '🏺 I\'m an Artisan', desc: 'Sell my craft' },
            ].map(({ value, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedRole(value)}
                className={`py-3 px-3 rounded-lg text-sm font-medium text-center transition-all duration-200 ${
                  selectedRole === value
                    ? 'bg-white shadow-sm text-primary-700 ring-1 ring-primary-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div>{label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                className={`form-input ${errors.name ? 'border-red-400' : ''}`}
                placeholder="Priya Sharma"
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
              />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                className={`form-input ${errors.email ? 'border-red-400' : ''}`}
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                })}
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">Phone Number <span className="text-gray-400">(optional)</span></label>
              <input
                id="reg-phone"
                type="tel"
                autoComplete="tel"
                className={`form-input ${errors.phone ? 'border-red-400' : ''}`}
                placeholder="9876543210"
                {...register('phone', {
                  pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit mobile number' },
                })}
              />
              {errors.phone && <p className="form-error">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`form-input pr-12 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="Min 6 characters"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
                    pattern: { value: /(?=.*[A-Za-z])(?=.*\d)/, message: 'Must contain a letter and a number' },
                  })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" aria-label="Toggle password">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`form-input ${errors.confirmPassword ? 'border-red-400' : ''}`}
                placeholder="Repeat password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (v) => v === password || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary w-full btn-lg mt-2">
              {isLoading ? 'Creating Account...' : `Create ${selectedRole === 'seller' ? 'Seller' : 'Buyer'} Account`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
