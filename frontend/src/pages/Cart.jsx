import React from 'react'
import { Link } from 'react-pointer-sdk' // wait, Link is from react-router-dom, let's make sure it's correct
import { Link as RouterLink } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatCurrency, calcCartTotal } from '../utils/helpers'
import EmptyState from '../components/common/EmptyState'
import Spinner from '../components/common/Spinner'

const Cart = () => {
  const { cart, isLoading, updateQuantity, removeFromCart, clearCart } = useCart()

  if (isLoading && !cart) {
    return (
      <div className="container-app py-20 flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    )
  }

  const items = cart?.items || []

  if (items.length === 0) {
    return (
      <div className="container-app py-12">
        <EmptyState
          icon="Shopping Cart"
          title="Your cart is empty"
          description="Looks like you haven't added any handcrafted items to your cart yet."
          actionLabel="Browse Products"
          actionTo="/products"
        />
      </div>
    )
  }

  const total = calcCartTotal(items)

  const handleQtyChange = (productId, currentQty, stock, increment) => {
    const newQty = increment ? currentQty + 1 : currentQty - 1
    if (newQty < 1) return
    if (newQty > stock) return
    updateQuantity(productId, newQty)
  }

  return (
    <div className="container-app py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title mb-1">Shopping Cart</h1>
          <p className="text-gray-500 text-sm">You have {items.length} unique items in your cart</p>
        </div>
        <button onClick={clearCart} className="btn btn-outline border-red-200 text-red-600 hover:bg-red-50 text-xs">
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const prod = item.product
            if (!prod) return null
            const mainImg = prod.images?.[0]?.url || `https://placehold.co/150x150/f59e0b/ffffff?text=${encodeURIComponent(prod.title)}`

            return (
              <div key={prod._id} className="card p-4 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={mainImg}
                  alt={prod.title}
                  className="w-20 h-20 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h3 className="font-semibold text-gray-900 text-sm truncate hover:text-primary-600">
                    <RouterLink to={`/products/${prod._id}`}>{prod.title}</RouterLink>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Seller: {prod.seller?.name || 'Artisan'}</p>
                  <p className="text-sm font-semibold text-primary-600 mt-2">{formatCurrency(prod.price)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleQtyChange(prod._id, item.quantity, prod.stock, false)}
                      className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-l-lg transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm font-medium text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(prod._id, item.quantity, prod.stock, true)}
                      className="px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-r-lg transition-colors"
                      disabled={item.quantity >= prod.stock}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(prod._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="card p-6 h-fit space-y-4">
          <h2 className="text-lg font-heading font-semibold text-gray-900">Order Summary</h2>
          
          <div className="space-y-2 border-b border-gray-100 pb-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-800">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
          </div>

          <div className="flex justify-between text-base font-bold text-gray-950">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <RouterLink to="/checkout" className="btn btn-primary w-full btn-lg">
            Proceed to Checkout
          </RouterLink>
          
          <RouterLink to="/products" className="btn btn-ghost w-full text-xs">
            Continue Shopping
          </RouterLink>
        </div>
      </div>
    </div>
  )
}

export default Cart
