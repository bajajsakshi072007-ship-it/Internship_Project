import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/order.service'
import { formatCurrency, calcCartTotal } from '../utils/helpers'
import toast from 'react-hot-toast'

const Checkout = () => {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const items = cart?.items || []
  const total = calcCartTotal(items)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
      country: user?.address?.country || 'India',
      paymentMethod: 'cod',
    }
  })

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsLoading(true)
    try {
      const orderPayload = {
        items: items.map((i) => ({
          product: i.product._id,
          quantity: i.quantity,
        })),
        shippingAddress: {
          name: data.name,
          phone: data.phone,
          street: data.street,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          country: data.country,
        },
        paymentMethod: data.paymentMethod,
      }

      await orderService.placeOrder(orderPayload)
      toast.success('Order placed successfully!')
      await clearCart()
      navigate('/orders', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary mt-4">Go Shop</Link>
      </div>
    )
  }

  return (
    <div className="container-app py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title mb-1">Checkout</h1>
        <p className="text-gray-500 text-sm">Provide your shipping address and payment method</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">Shipping Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-name">Recipient Name *</label>
                <input
                  id="checkout-name"
                  type="text"
                  className={`form-input ${errors.name ? 'border-red-400' : ''}`}
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="form-error">{errors.name.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="checkout-phone">Phone Number *</label>
                <input
                  id="checkout-phone"
                  type="tel"
                  className={`form-input ${errors.phone ? 'border-red-400' : ''}`}
                  placeholder="10 digit mobile number"
                  {...register('phone', {
                    required: 'Phone is required',
                    pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid Indian phone number' }
                  })}
                />
                {errors.phone && <p className="form-error">{errors.phone.message}</p>}
              </div>

              <div className="form-group sm:col-span-2">
                <label className="form-label" htmlFor="checkout-street">Street Address *</label>
                <input
                  id="checkout-street"
                  type="text"
                  placeholder="House/Flat No, Street, Landmark"
                  className={`form-input ${errors.street ? 'border-red-400' : ''}`}
                  {...register('street', { required: 'Street is required' })}
                />
                {errors.street && <p className="form-error">{errors.street.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="checkout-city">City/Town *</label>
                <input
                  id="checkout-city"
                  type="text"
                  className={`form-input ${errors.city ? 'border-red-400' : ''}`}
                  {...register('city', { required: 'City is required' })}
                />
                {errors.city && <p className="form-error">{errors.city.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="checkout-state">State *</label>
                <input
                  id="checkout-state"
                  type="text"
                  className={`form-input ${errors.state ? 'border-red-400' : ''}`}
                  {...register('state', { required: 'State is required' })}
                />
                {errors.state && <p className="form-error">{errors.state.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="checkout-pincode">Pincode *</label>
                <input
                  id="checkout-pincode"
                  type="text"
                  placeholder="6 digit pincode"
                  className={`form-input ${errors.pincode ? 'border-red-400' : ''}`}
                  {...register('pincode', {
                    required: 'Pincode is required',
                    pattern: { value: /^\d{6}$/, message: 'Invalid 6-digit pincode' }
                  })}
                />
                {errors.pincode && <p className="form-error">{errors.pincode.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="checkout-country">Country</label>
                <input
                  id="checkout-country"
                  type="text"
                  className="form-input bg-gray-50"
                  readOnly
                  {...register('country')}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">Payment Method</h2>
            
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 rounded-xl border border-primary-200 bg-primary-50/30 cursor-pointer">
                <input
                  type="radio"
                  value="cod"
                  className="mt-1 text-primary-600 focus:ring-primary-500"
                  {...register('paymentMethod')}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-950">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when your order is delivered to your doorstep</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 cursor-not-allowed opacity-60">
                <input
                  type="radio"
                  value="online"
                  disabled
                  className="mt-1 text-primary-600 focus:ring-primary-500"
                  {...register('paymentMethod')}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Online Payment (UPI/Cards)</p>
                  <p className="text-xs text-gray-500">Currently disabled for maintenance</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Details side panel */}
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-heading font-semibold text-gray-900">Items in Order</h2>

            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product._id} className="py-3 flex items-center justify-between text-sm gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.product.title}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} x {formatCurrency(item.product.price)}</p>
                  </div>
                  <span className="font-semibold text-gray-900 flex-shrink-0">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-gray-950 text-base pt-2">
                <span>Total Amount</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full btn-lg"
            >
              {isLoading ? 'Placing Order...' : 'Place Order Now'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Checkout
