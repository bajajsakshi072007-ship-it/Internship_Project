import React from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import EmptyState from '../components/common/EmptyState'
import Spinner from '../components/common/Spinner'
import Pagination from '../components/common/Pagination'
import { formatCurrency, formatDate, getOrderStatusColor, getOrderStatusLabel } from '../utils/helpers'

const OrderHistory = () => {
  const { orders, meta, isLoading, goToPage } = useOrders({ role: 'buyer' })

  if (isLoading && orders.length === 0) {
    return (
      <div className="container-app py-20 flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container-app py-12">
        <EmptyState
          icon="Orders"
          title="No orders found"
          description="Looks like you haven't placed any orders yet."
          actionLabel="Browse Products"
          actionTo="/products"
        />
      </div>
    )
  }

  return (
    <div className="container-app py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title mb-1">My Orders</h1>
        <p className="text-gray-500 text-sm">Track and view history of your placed orders</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary-100 transition-colors">
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-gray-500 uppercase">Order ID: {order._id}</span>
                <span className={`badge ${getOrderStatusColor(order.orderStatus)}`}>
                  {getOrderStatusLabel(order.orderStatus)}
                </span>
              </div>

              <div className="flex items-center gap-4 py-2 border-y border-gray-100">
                {order.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={item.image || `https://placehold.co/100x100/f59e0b/ffffff?text=${encodeURIComponent(item.title)}`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <span className="text-xs text-gray-400">+{order.items.length - 3} more</span>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {order.items.map((i) => i.title).join(', ')}
                  </p>
                  <p className="text-xs text-gray-500">Ordered on: {formatDate(order.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Total Items: {order.items.reduce((sum, i) => sum + i.quantity, 0)}</span>
                <span>•</span>
                <span>Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 justify-end text-right">
              <div>
                <p className="text-xs text-gray-400">Total Amount</p>
                <p className="text-lg font-bold text-primary-600 mt-0.5">{formatCurrency(order.totalAmount)}</p>
              </div>
              <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm justify-center">
                Track Order
              </Link>
            </div>
          </div>
        ))}
      </div>

      {meta && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  )
}

export default OrderHistory
