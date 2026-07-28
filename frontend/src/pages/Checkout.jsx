import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/order.service'
import { formatCurrency, calcCartTotal } from '../utils/helpers'
import { ShieldCheckIcon, TruckIcon, CreditCardIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Checkout = () => {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const items = cart?.items || []
  const total = calcCartTotal(items)

  // Check unique sellers in cart
  const uniqueSellers = [...new Set(items.map((i) => i.product?.seller?._id || i.product?.seller))].filter(Boolean)
  const hasMultipleSellers = uniqueSellers.length > 1

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
      country: user?.address?.country || 'India',
      paymentMethod: 'cod',
    },
  })

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    if (hasMultipleSellers) {
      const msg = 'All products in an order must belong to the same artisan. Please adjust your cart to order from one artisan at a time.'
      setServerError(msg)
      toast.error(msg)
      return
    }

    setIsLoading(true)
    setServerError('')
    try {
      const orderPayload = {
        items: items.map((i) => ({
          product: i.product._id,
          quantity: i.quantity,
        })),
        shippingAddress: {
          name: data.name.trim(),
          phone: data.phone.trim(),
          street: data.street.trim(),
          city: data.city.trim(),
          state: data.state.trim(),
          pincode: data.pincode.trim(),
          country: data.country || 'India',
        },
        paymentMethod: data.paymentMethod,
      }

      await orderService.placeOrder(orderPayload)
      toast.success('🎉 Order placed successfully!')
      await clearCart()
      navigate('/orders', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to place order. Please try again.'
      setServerError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
          🛍️
        </div>
        <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 text-sm mt-1">Explore our unique rural handicrafts and add items to your cart.</p>
        <Link to="/products" className="btn btn-primary mt-6">
          Browse Handicrafts
        </Link>
      </div>
    )
  }

  return (
    <div className="container-app py-8 animate-fade-in max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h1 className="page-title text-2xl sm:text-3xl font-heading font-bold text-gray-900">
          Order Placement & Checkout
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Complete your delivery details to purchase authentic rural handicrafts directly from artisans.
        </p>
      </div>

      {/* Multiple Seller Warning */}
      {hasMultipleSellers && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800 flex items-start gap-3 shadow-sm">
          <InformationCircleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Multiple Artisans Detected in Cart</p>
            <p className="text-xs text-amber-700 mt-0.5">
              To support direct rural shipping, each order must contain items from a single artisan. Please select items from one artisan or place separate orders per seller.
            </p>
          </div>
        </div>
      )}

      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex items-start gap-3">
          <span className="text-base leading-none">⚠️</span>
          <div className="flex-1">{serverError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Shipping & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Section */}
          <div className="card p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <TruckIcon className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-heading font-semibold text-gray-900">Shipping Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="form-group sm:col-span-1">
                <label className="form-label font-medium text-gray-700 text-sm block mb-1" htmlFor="checkout-name">
                  Recipient Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  placeholder="Sunita Sharma"
                  className={`form-input w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.name ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                  }`}
                  {...register('name', { required: 'Recipient name is required' })}
                />
                {errors.name && <p className="form-error text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              {/* Phone */}
              <div className="form-group sm:col-span-1">
                <label className="form-label font-medium text-gray-700 text-sm block mb-1" htmlFor="checkout-phone">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  placeholder="9876543210"
                  className={`form-input w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.phone ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                  }`}
                  {...register('phone', {
                    required: '10-digit mobile number is required',
                    pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' },
                  })}
                />
                {errors.phone && <p className="form-error text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>

              {/* Street Address */}
              <div className="form-group sm:col-span-2">
                <label className="form-label font-medium text-gray-700 text-sm block mb-1" htmlFor="checkout-street">
                  Street Address / Landmark <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-street"
                  type="text"
                  placeholder="House No., Street Name, Near Temple/School"
                  className={`form-input w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.street ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                  }`}
                  {...register('street', { required: 'Street address is required' })}
                />
                {errors.street && <p className="form-error text-xs text-red-500 mt-1">{errors.street.message}</p>}
              </div>

              {/* City */}
              <div className="form-group">
                <label className="form-label font-medium text-gray-700 text-sm block mb-1" htmlFor="checkout-city">
                  City / District <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-city"
                  type="text"
                  placeholder="Jaipur"
                  className={`form-input w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.city ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                  }`}
                  {...register('city', { required: 'City is required' })}
                />
                {errors.city && <p className="form-error text-xs text-red-500 mt-1">{errors.city.message}</p>}
              </div>

              {/* State */}
              <div className="form-group">
                <label className="form-label font-medium text-gray-700 text-sm block mb-1" htmlFor="checkout-state">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-state"
                  type="text"
                  placeholder="Rajasthan"
                  className={`form-input w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.state ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                  }`}
                  {...register('state', { required: 'State is required' })}
                />
                {errors.state && <p className="form-error text-xs text-red-500 mt-1">{errors.state.message}</p>}
              </div>

              {/* Pincode */}
              <div className="form-group">
                <label className="form-label font-medium text-gray-700 text-sm block mb-1" htmlFor="checkout-pincode">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-pincode"
                  type="text"
                  placeholder="302001"
                  className={`form-input w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.pincode ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                  }`}
                  {...register('pincode', {
                    required: '6-digit pincode is required',
                    pattern: { value: /^\d{6}$/, message: 'Enter a valid 6-digit postal code' },
                  })}
                />
                {errors.pincode && <p className="form-error text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
              </div>

              {/* Country */}
              <div className="form-group">
                <label className="form-label font-medium text-gray-700 text-sm block mb-1" htmlFor="checkout-country">
                  Country
                </label>
                <input
                  id="checkout-country"
                  type="text"
                  className="form-input w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600"
                  readOnly
                  {...register('country')}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="card p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <CreditCardIcon className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-heading font-semibold text-gray-900">Payment Option</h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-primary-500 bg-primary-50/30 cursor-pointer shadow-sm">
                <input
                  type="radio"
                  value="cod"
                  defaultChecked
                  className="mt-1 text-primary-600 focus:ring-primary-500"
                  {...register('paymentMethod')}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900">💵 Cash on Delivery (COD)</p>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      Zero Extra Fee
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Pay in cash directly to the courier agent when your handcrafted order arrives.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 opacity-60 cursor-not-allowed bg-gray-50">
                <input
                  type="radio"
                  value="online"
                  disabled
                  className="mt-1 text-gray-400"
                  {...register('paymentMethod')}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Online Payment (Cards / UPI)</p>
                  <p className="text-xs text-gray-400">Currently undergoing maintenance. Please use Cash on Delivery.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Panel */}
        <div className="space-y-6">
          <div className="card p-6 bg-white rounded-2xl border border-gray-100 shadow-md sticky top-20 space-y-4">
            <h2 className="text-lg font-heading font-bold text-gray-900 border-b border-gray-100 pb-3">
              Order Summary ({items.length} item{items.length !== 1 ? 's' : ''})
            </h2>

            {/* Product items preview */}
            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1 space-y-2">
              {items.map((item) => {
                const prod = item.product
                if (!prod) return null
                const imgUrl = prod.images?.[0]?.url || `https://placehold.co/100x100?text=Craft`

                return (
                  <div key={prod._id} className="pt-2 flex items-center justify-between gap-3 text-sm">
                    <img src={imgUrl} alt={prod.title} className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-xs truncate">{prod.title}</p>
                      <p className="text-[11px] text-gray-500">
                        Qty: <span className="font-semibold text-gray-700">{item.quantity}</span> × {formatCurrency(prod.price)}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900 text-xs flex-shrink-0">
                      {formatCurrency(prod.price * item.quantity)}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-gray-800">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Delivery Charge</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-950 pt-2 border-t border-gray-100">
                <span>Total Amount</span>
                <span className="text-primary-600">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Trust badge */}
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>100% Direct Artisan Support & Verified Handcrafted Guarantee</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || hasMultipleSellers}
              className="btn btn-primary w-full py-3.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 text-center"
            >
              {isLoading ? 'Processing Order...' : 'Confirm & Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Checkout

