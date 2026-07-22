import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Spinner from './Spinner'

/**
 * Role-based route guard.
 * Requires authentication AND a specific role.
 *
 * @param {string} role - Required role ('buyer' | 'seller')
 */
const RoleRoute = ({ role }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user?.role !== role) {
    // Wrong role — redirect to appropriate home
    const redirectPath = user?.role === 'seller' ? '/dashboard' : '/'
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

export default RoleRoute
