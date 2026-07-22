import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { cartService } from '../services/cart.service'
import { useAuth } from './AuthContext.jsx'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

const initialState = {
  cart: null,
  isLoading: false,
  itemCount: 0,
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload,
        itemCount: action.payload?.items?.reduce((acc, i) => acc + i.quantity, 0) || 0,
        isLoading: false,
      }
    case 'CLEAR_CART':
      return { ...initialState }
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { isAuthenticated, user } = useAuth()

  // ─────────────────────────────────────────
  // Fetch cart when buyer logs in
  // ─────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated && user?.role === 'buyer') {
      fetchCart()
    } else {
      dispatch({ type: 'CLEAR_CART' })
    }
  }, [isAuthenticated, user])

  const fetchCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const res = await cartService.getCart()
      dispatch({ type: 'SET_CART', payload: res.data.data })
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      const res = await cartService.addToCart(productId, quantity)
      dispatch({ type: 'SET_CART', payload: res.data.data })
      toast.success('Added to cart!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
      throw err
    }
  }, [])

  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      const res = await cartService.updateCartItem(productId, quantity)
      dispatch({ type: 'SET_CART', payload: res.data.data })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart')
      throw err
    }
  }, [])

  const removeFromCart = useCallback(async (productId) => {
    try {
      const res = await cartService.removeFromCart(productId)
      dispatch({ type: 'SET_CART', payload: res.data.data })
      toast.success('Item removed from cart')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove item')
      throw err
    }
  }, [])

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart()
      dispatch({ type: 'CLEAR_CART' })
    } catch {}
  }, [])

  return (
    <CartContext.Provider
      value={{
        ...state,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

export default CartContext
