import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { authService } from '../services/auth.service'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, isLoading: true }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'AUTH_LOGOUT':
      return { ...initialState, isLoading: false }
    case 'PROFILE_UPDATED':
      return { ...state, user: action.payload }
    case 'LOADING_DONE':
      return { ...state, isLoading: false }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // ─────────────────────────────────────────
  // Load user from localStorage on mount
  // ─────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user  = localStorage.getItem('user')

    if (token && user) {
      try {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: JSON.parse(user), token },
        })
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        dispatch({ type: 'LOADING_DONE' })
      }
    } else {
      dispatch({ type: 'LOADING_DONE' })
    }
  }, [])

  // ─────────────────────────────────────────
  // Register
  // ─────────────────────────────────────────
  const register = useCallback(async (data) => {
    const res = await authService.register(data)
    const { user, token } = res.data.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
    toast.success(`Welcome, ${user.name}!`)
    return user
  }, [])

  // ─────────────────────────────────────────
  // Login
  // ─────────────────────────────────────────
  const login = useCallback(async (data) => {
    const res = await authService.login(data)
    const { user, token } = res.data.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
    toast.success(`Welcome back, ${user.name}!`)
    return user
  }, [])

  // ─────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch({ type: 'AUTH_LOGOUT' })
    toast.success('Logged out successfully')
  }, [])

  // ─────────────────────────────────────────
  // Update profile in state
  // ─────────────────────────────────────────
  const updateUserInState = useCallback((user) => {
    localStorage.setItem('user', JSON.stringify(user))
    dispatch({ type: 'PROFILE_UPDATED', payload: user })
  }, [])

  const value = {
    ...state,
    register,
    login,
    logout,
    updateUserInState,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export default AuthContext
