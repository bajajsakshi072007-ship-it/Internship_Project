import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/auth.service'
import { getAvatarUrl, getErrorMessage } from '../utils/helpers'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUserInState } = useAuth()
  const [isEditing, setIsEditing]   = useState(false)
  const [isLoading, setIsLoading]   = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile, setAvatarFile]       = useState(null)

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfile } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || '',
        country: user?.address?.country || 'India',
      }
    }
  })

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, watch: watchPassword, formState: { errors: passwordErrors }, reset: resetPassword } = useForm()

  const newPasswordVal = watchPassword('newPassword')

  const onAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const onProfileUpdate = async (data) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.phone) formData.append('phone', data.phone)
      formData.append('bio', data.bio || '')
      formData.append('address[street]', data.address?.street || '')
      formData.append('address[city]', data.address?.city || '')
      formData.append('address[state]', data.address?.state || '')
      formData.append('address[pincode]', data.address?.pincode || '')
      formData.append('address[country]', data.address?.country || 'India')

      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }

      const res = await authService.updateProfile(formData)
      updateUserInState(res.data.data)
      setIsEditing(false)
      setAvatarFile(null)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordUpdate = async (data) => {
    setIsLoading(true)
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      })
      resetPassword()
      toast.success('Password changed successfully')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setAvatarPreview(null)
    setAvatarFile(null)
    resetProfile()
  }

  return (
    <div className="container-app py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title mb-1">My Profile</h1>
        <p className="text-gray-500 text-sm">Manage your account details and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card & Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar Selector */}
              <div className="relative">
                <img
                  src={avatarPreview || getAvatarUrl(user)}
                  alt={user?.name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-100"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 hover:bg-primary-600 flex items-center justify-center cursor-pointer text-white shadow-md text-xs transition-colors">
                    Edit
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Basic Details */}
              <div className="text-center sm:text-left flex-1 min-w-0">
                <h2 className="text-xl font-heading font-bold text-gray-900 truncate">{user?.name}</h2>
                <p className="text-sm text-gray-500 capitalize">{user?.role} Account</p>
                <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
                {user?.phone && <p className="text-sm text-gray-400 mt-0.5">{user.phone}</p>}
                {user?.bio && <p className="text-sm text-gray-600 mt-3 italic">"{user.bio}"</p>}
                
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="btn btn-outline btn-sm mt-4">
                    Edit Profile Details
                  </button>
                )}
              </div>
            </div>

            {/* Profile Edit Form */}
            {isEditing && (
              <form onSubmit={handleProfileSubmit(onProfileUpdate)} className="mt-6 border-t border-gray-100 pt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-name">Full Name</label>
                    <input
                      id="profile-name"
                      type="text"
                      className={`form-input ${profileErrors.name ? 'border-red-400' : ''}`}
                      {...registerProfile('name', { required: 'Name is required' })}
                    />
                    {profileErrors.name && <p className="form-error">{profileErrors.name.message}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-phone">Phone Number</label>
                    <input
                      id="profile-phone"
                      type="tel"
                      className={`form-input ${profileErrors.phone ? 'border-red-400' : ''}`}
                      {...registerProfile('phone', {
                        pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid Indian phone number' }
                      })}
                    />
                    {profileErrors.phone && <p className="form-error">{profileErrors.phone.message}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-bio">Bio</label>
                  <textarea
                    id="profile-bio"
                    rows={3}
                    className="form-input resize-none"
                    placeholder="Tell buyers about yourself or your workshop..."
                    {...registerProfile('bio', { maxLength: { value: 300, message: 'Bio cannot exceed 300 characters' } })}
                  />
                  {profileErrors.bio && <p className="form-error">{profileErrors.bio.message}</p>}
                </div>

                {/* Address Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-group sm:col-span-2">
                      <label className="form-label" htmlFor="profile-street">Street Address</label>
                      <input
                        id="profile-street"
                        type="text"
                        placeholder="123 Artisan Lane, Village Area"
                        className="form-input"
                        {...registerProfile('address.street')}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="profile-city">City/Town</label>
                      <input
                        id="profile-city"
                        type="text"
                        placeholder="Jaipur"
                        className="form-input"
                        {...registerProfile('address.city')}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="profile-state">State</label>
                      <input
                        id="profile-state"
                        type="text"
                        placeholder="Rajasthan"
                        className="form-input"
                        {...registerProfile('address.state')}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="profile-pincode">Pincode</label>
                      <input
                        id="profile-pincode"
                        type="text"
                        placeholder="302001"
                        className="form-input"
                        {...registerProfile('address.pincode')}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="profile-country">Country</label>
                      <input
                        id="profile-country"
                        type="text"
                        className="form-input bg-gray-50"
                        readOnly
                        {...registerProfile('address.country')}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="submit" disabled={isLoading} className="btn btn-primary">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={handleCancel} className="btn btn-ghost">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Change Password Panel */}
        <div className="card p-6 h-fit">
          <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit(onPasswordUpdate)} className="space-y-4">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-curr-pass">Current Password</label>
              <input
                id="profile-curr-pass"
                type="password"
                className={`form-input ${passwordErrors.currentPassword ? 'border-red-400' : ''}`}
                {...registerPassword('currentPassword', { required: 'Current password is required' })}
              />
              {passwordErrors.currentPassword && <p className="form-error">{passwordErrors.currentPassword.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-new-pass">New Password</label>
              <input
                id="profile-new-pass"
                type="password"
                className={`form-input ${passwordErrors.newPassword ? 'border-red-400' : ''}`}
                {...registerPassword('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  pattern: { value: /(?=.*[A-Za-z])(?=.*\d)/, message: 'Must contain a letter and a number' }
                })}
              />
              {passwordErrors.newPassword && <p className="form-error">{passwordErrors.newPassword.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-confirm-pass">Confirm New Password</label>
              <input
                id="profile-confirm-pass"
                type="password"
                className={`form-input ${passwordErrors.confirmPassword ? 'border-red-400' : ''}`}
                {...registerPassword('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: (value) => value === newPasswordVal || 'Passwords do not match'
                })}
              />
              {passwordErrors.confirmPassword && <p className="form-error">{passwordErrors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
