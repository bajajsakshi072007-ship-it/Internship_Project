import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { wishlistService } from '../services/wishlist.service'
import { useAuth } from './AuthContext.jsx'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.payload, productIds: action.payload?.products?.map(p => p._id) || [] }
    case 'CLEAR':
      return { wishlist: null, productIds: [] }
    default:
      return state
  }
}

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { wishlist: null, productIds: [] })
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user?.role === 'buyer') {
      fetchWishlist()
    } else {
      dispatch({ type: 'CLEAR' })
    }
  }, [isAuthenticated, user])

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await wishlistService.getWishlist()
      dispatch({ type: 'SET_WISHLIST', payload: res.data.data })
    } catch {}
  }, [])

  const addToWishlist = useCallback(async (productId) => {
    try {
      await wishlistService.addToWishlist(productId)
      await fetchWishlist()
      toast.success('Added to wishlist')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add to wishlist'
      if (!msg.includes('already')) toast.error(msg)
    }
  }, [fetchWishlist])

  const removeFromWishlist = useCallback(async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId)
      await fetchWishlist()
      toast.success('Removed from wishlist')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove from wishlist')
    }
  }, [fetchWishlist])

  const isWishlisted = useCallback((productId) => {
    return state.productIds.includes(productId)
  }, [state.productIds])

  return (
    <WishlistContext.Provider value={{ ...state, addToWishlist, removeFromWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}

export default WishlistContext
