import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { orderService } from '../services/order.service'
import OrderTimeline from '../components/order/OrderTimeline'
import Spinner from '../components/common/Spinner'
import { formatCurrency, formatDateTime, getOrderStatusColor, getOrderStatusLabel } from '../utils/helpers'
import toast from 'react-hot-toast'

const OrderDetails = () => {
  const { id } = useParams()
  const [order, setOrder]         = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    setIsLoading(true)
    try {
      const res = await orderService.getOrderById(id)
      setOrder(res.data.data)
    } catch {
      toast.error('Failed to load order details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    setCancelling(true)
    try {
      await orderService.cancelOrder(id)
      toast.success('Order cancelled successfully')
      fetchOrder()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancelling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container-app py-20 flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container-app py-20 text-center">
        <p className="text-gray-500">Order not found</p>
        <Link to="/orders" className="btn btn-primary mt-4">Back to Orders</Link>
      </div>
    )
  }

  const cancellable = ['pending', 'accepted'].includes(order.orderStatus)

  return (
    <div className="container-app py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/orders" className="hover:text-primary-500">Orders</Link>
        <span>/</span>
        <span className="text-gray-900 truncate">Order Details</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="page-title">Order Details</h1>
            <span className={`badge ${getOrderStatusColor(order.orderStatus)}`}>
              {getOrderStatusLabel(order.orderStatus)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">ID: {order._id} • Placed on {formatDateTime(order.createdAt)}</p>
        </div>

        {cancellable && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="btn btn-danger btn-sm"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-heading font-semibold text-gray-900">Order Items</h2>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, index) => (
                <div key={index} className="py-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || `https://placehold.co/150x150/f59e0b/ffffff?text=${encodeURIComponent(item.title)}`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 truncate">
                      <Link to={`/products/${item.product}`}>{item.title}</Link>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Price: {formatCurrency(item.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-primary-600 mt-1">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-base font-bold text-gray-950">
              <span>Total Price</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Delivery & Shipping */}
          <div className="card p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shipping Address</h2>
              <div className="text-sm text-gray-700 space-y-1.5">
                <p className="font-bold text-gray-900 text-base">{order.shippingAddress?.name}</p>
                <p className="flex items-center gap-1 text-gray-600">📞 <span className="font-medium">{order.shippingAddress?.phone}</span></p>
                <p className="text-gray-600">{order.shippingAddress?.street}</p>
                <p className="text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} - <span className="font-mono font-medium">{order.shippingAddress?.pincode}</span></p>
                <p className="text-gray-500 font-medium">{order.shippingAddress?.country || 'India'}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Payment & Parties</h2>
              <div className="text-sm text-gray-700 space-y-2">
                <div>
                  <p className="text-xs text-gray-400">Payment Option:</p>
                  <p className="font-semibold text-gray-900 capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Payment Status:</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold capitalize ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.buyer && (
                  <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                      👤
                    </div>
                    <div className="text-xs min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{order.buyer.name}</p>
                      <p className="text-gray-400 truncate">{order.buyer.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Timeline side panel */}
        <div className="card p-6 h-fit">
          <h2 className="text-lg font-heading font-semibold text-gray-900 mb-6">Tracking Timeline</h2>
          <OrderTimeline statusHistory={order.statusHistory} currentStatus={order.orderStatus} />
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
