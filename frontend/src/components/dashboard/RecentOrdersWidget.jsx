import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency, formatDateTime, getOrderStatusColor, getOrderStatusLabel } from '../../utils/helpers'

/**
 * RecentOrdersWidget — Dashboard notification widget for top 3 recent orders
 */
const RecentOrdersWidget = ({ orders = [], onUpdateStatus, statusLoading }) => {
  // Top 3 most recent orders
  const recentOrders = orders.slice(0, 3)

  return (
    <div className="card p-6 space-y-4 shadow-sm border border-gray-100 bg-white rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-gray-900 font-heading">Recent Orders</h2>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xxs font-medium bg-green-50 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Live Sync
          </span>
        </div>
        <Link
          to="/dashboard/orders"
          className="text-xs text-primary-600 font-semibold hover:text-primary-700 transition-colors"
        >
          View all ({orders.length}) →
        </Link>
      </div>

      {/* Orders List */}
      {recentOrders.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {recentOrders.map((order) => (
            <div
              key={order._id}
              className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-gray-50/50 p-2.5 rounded-xl"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900 text-xs">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <span className={`badge text-xxs ${getOrderStatusColor(order.orderStatus)}`}>
                    {getOrderStatusLabel(order.orderStatus)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Customer: <span className="font-medium text-gray-700">{order.buyer?.name || 'Customer'}</span> • {formatDateTime(order.createdAt)}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
                <div className="text-left sm:text-right">
                  <p className="font-bold text-primary-600 text-sm">{formatCurrency(order.totalAmount)}</p>
                  <p className="text-xxs text-gray-400">{order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}</p>
                </div>

                {order.orderStatus === 'pending' && onUpdateStatus && (
                  <button
                    onClick={() => onUpdateStatus(order._id, 'accepted')}
                    disabled={statusLoading}
                    className="btn btn-primary btn-sm text-xs py-1 px-3 shadow-xs"
                  >
                    Accept
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-400 space-y-2">
          <div className="text-3xl">📦</div>
          <p className="text-xs font-medium text-gray-500">No recent orders received yet</p>
          <p className="text-xxs text-gray-400">New customer orders will appear here automatically.</p>
        </div>
      )}
    </div>
  )
}

export default RecentOrdersWidget
