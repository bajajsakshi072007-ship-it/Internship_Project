import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { orderService } from '../services/order.service'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import {
  formatCurrency,
  formatDateTime,
  getOrderStatusColor,
  getOrderStatusLabel,
  getAvatarUrl,
} from '../utils/helpers'
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon, EyeIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const ALL_STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'packed', label: 'Packed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STATUS_TRANSITIONS = {
  pending: ['accepted', 'cancelled'],
  accepted: ['packed', 'cancelled'],
  packed: ['shipped'],
  shipped: ['delivered'],
  delivered: ['completed'],
  completed: [],
  cancelled: [],
}

const SellerOrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest') // 'newest' | 'oldest'

  useEffect(() => {
    fetchOrders()
  }, [pagination.page, statusFilter])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: 10,
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }

      const res = await orderService.getSellerOrders(params)
      const data = res.data?.data || []
      const meta = res.data?.meta || {}

      setOrders(data)
      setPagination((prev) => ({
        ...prev,
        totalPages: meta.totalPages || 1,
        total: meta.total || data.length,
      }))
    } catch (err) {
      toast.error('Failed to load orders history')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      await orderService.updateOrderStatus(orderId, { status: newStatus })
      toast.success(`Order status updated to ${getOrderStatusLabel(newStatus)}`)
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  // Client-side search and sort on fetched page data
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders]

    // Search query filter (Order ID or Buyer Name/Email)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter((order) => {
        const orderId = (order._id || '').toLowerCase()
        const buyerName = (order.buyer?.name || '').toLowerCase()
        const buyerEmail = (order.buyer?.email || '').toLowerCase()
        const itemTitles = (order.items || []).map((i) => i.title.toLowerCase()).join(' ')
        return orderId.includes(q) || buyerName.includes(q) || buyerEmail.includes(q) || itemTitles.includes(q)
      })
    }

    // Sort order
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    return result
  }, [orders, searchQuery, sortOrder])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Order History & Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Search, filter, and track all customer orders received for your artisan products.
          </p>
        </div>
        <div className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1.5 rounded-lg self-start sm:self-center">
          Total Orders: <span className="text-gray-900 font-bold">{pagination.total}</span>
        </div>
      </div>

      {/* Control Bar: Search, Status Filter, Sort */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white shadow-sm rounded-xl">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Buyer, or Product..."
            className="form-input pl-10 pr-4 py-2 text-sm w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPagination((p) => ({ ...p, page: 1 }))
              }}
              className="form-input py-2 px-3 text-xs font-medium w-36"
              aria-label="Filter by order status"
            >
              {ALL_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-2">
            <ArrowsUpDownIcon className="w-4 h-4 text-gray-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="form-input py-2 px-3 text-xs font-medium w-36"
              aria-label="Sort orders by date"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table Area */}
      {isLoading ? (
        <div className="card p-12 flex items-center justify-center min-h-[300px]">
          <Spinner size="lg" />
        </div>
      ) : filteredAndSortedOrders.length === 0 ? (
        <div className="card p-10 bg-white">
          {orders.length === 0 ? (
            <EmptyState
              title="No Orders Received Yet"
              description="When customers purchase your artisan handicrafts, their orders will appear here."
              actionLabel="View My Products"
              actionTo="/dashboard/products"
            />
          ) : (
            <div className="text-center py-8 space-y-3">
              <p className="text-3xl">🔍</p>
              <p className="text-base font-semibold text-gray-800">No matching orders found</p>
              <p className="text-xs text-gray-500">
                Try adjusting your search keywords or status filter options.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                }}
                className="btn btn-ghost text-xs mt-2"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden bg-white shadow-sm border border-gray-100 rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Buyer</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredAndSortedOrders.map((order) => {
                  const firstItem = order.items?.[0]
                  const extraItemsCount = (order.items?.length || 1) - 1
                  const allowedNextStatuses = STATUS_TRANSITIONS[order.orderStatus] || []

                  return (
                    <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Order ID */}
                      <td className="py-4 px-4 font-mono font-semibold text-primary-700">
                        <Link to={`/orders/${order._id}`} className="hover:underline" title={order._id}>
                          #{order._id.slice(-8).toUpperCase()}
                        </Link>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-gray-600">
                        {formatDateTime(order.createdAt)}
                      </td>

                      {/* Buyer Details */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={getAvatarUrl(order.buyer)}
                            alt={order.buyer?.name || 'Buyer'}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate max-w-[120px]" title={order.buyer?.name}>
                              {order.buyer?.name || 'Customer'}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate max-w-[130px]" title={order.buyer?.email}>
                              {order.buyer?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Items Summary */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          {firstItem?.image ? (
                            <img
                              src={firstItem.image}
                              alt={firstItem.title}
                              className="w-9 h-9 rounded-lg object-cover bg-gray-100 flex-shrink-0 border border-gray-100"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs flex-shrink-0">
                              🎨
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-[150px]" title={firstItem?.title}>
                              {firstItem?.title || 'Product'}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              Qty: {firstItem?.quantity || 1}
                              {extraItemsCount > 0 && (
                                <span className="ml-1 text-primary-600 font-semibold">
                                  (+{extraItemsCount} more)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 font-bold text-gray-900 whitespace-nowrap">
                        {formatCurrency(order.totalAmount)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`badge ${getOrderStatusColor(order.orderStatus)} text-xs font-bold px-2.5 py-1`}>
                          {getOrderStatusLabel(order.orderStatus)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick Status Update Selector if transition possible */}
                          {allowedNextStatuses.length > 0 ? (
                            <select
                              disabled={updatingId === order._id}
                              value=""
                              onChange={(e) => {
                                if (e.target.value) handleStatusUpdate(order._id, e.target.value)
                              }}
                              className="form-input py-1 px-2 text-xxs font-medium bg-gray-50 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100"
                              aria-label="Update Order Status"
                            >
                              <option value="" disabled>
                                Update Status...
                              </option>
                              {allowedNextStatuses.map((st) => (
                                <option key={st} value={st}>
                                  Mark as {getOrderStatusLabel(st)}
                                </option>
                              ))}
                            </select>
                          ) : null}

                          {/* View Detail Link */}
                          <Link
                            to={`/orders/${order._id}`}
                            className="btn btn-ghost text-xs p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
                            title="View Full Order Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 border-t border-gray-100 text-xs">
              <span className="text-gray-500">
                Page <span className="font-semibold text-gray-800">{pagination.page}</span> of{' '}
                <span className="font-semibold text-gray-800">{pagination.totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                  className="btn btn-ghost text-xs px-3 py-1.5 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  className="btn btn-ghost text-xs px-3 py-1.5 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SellerOrderHistory
