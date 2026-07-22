import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardService } from '../services/dashboard.service'
import { orderService } from '../services/order.service'
import StatsCard from '../components/dashboard/StatsCard'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import { formatCurrency, formatDateTime, getOrderStatusColor, getOrderStatusLabel } from '../utils/helpers'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import toast from 'react-hot-toast'

const SellerDashboard = () => {
  const [data, setData]             = useState(null)
  const [salesData, setSalesData]   = useState([])
  const [isLoading, setIsLoading]   = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [selectedYear, setSelectedYear]   = useState(new Date().getFullYear())
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    fetchSalesChart(selectedYear)
  }, [selectedYear])

  const fetchDashboardData = async (manual = false) => {
    if (manual) setIsRefreshing(true)
    try {
      const res = await dashboardService.getDashboardStats()
      setData(res.data.data)
      setLastUpdated(new Date())
      if (manual) toast.success('Dashboard refreshed')
    } catch {
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const fetchSalesChart = async (year) => {
    try {
      const res = await dashboardService.getMonthlySales(year)
      setSalesData(res.data.data?.data || [])
    } catch {}
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    setStatusLoading(true)
    try {
      await orderService.updateOrderStatus(orderId, { status: newStatus })
      toast.success('Order status updated')
      fetchDashboardData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status')
    } finally {
      setStatusLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!data) return null

  const { stats, lowStockProducts = [], recentOrders = [], recentReviews = [] } = data

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dashboard Header & Refresh Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Artisan Dashboard Overview</h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time sales revenue, order status, and inventory count summary.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            className="btn btn-ghost text-xs flex items-center gap-2"
            title="Refresh dashboard data"
          >
            <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <Link to="/dashboard/products/new" className="btn btn-primary text-xs">
            + Add Product
          </Link>
        </div>
      </div>

      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon="💰"
          color="success"
          subtitle="Delivered and completed sales"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="📦"
          color="info"
          subtitle="Received customer orders"
        />
        <StatsCard
          title="Inventory Count"
          value={stats.totalProducts}
          icon="🎨"
          color="primary"
          subtitle="Active listed products"
        />
        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon="⏳"
          color="warning"
          subtitle="Action required"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Monthly Sales (INR)</h2>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="form-input py-1 px-3 text-xs w-28"
              aria-label="Select year for sales trend"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="h-72">
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip formatter={(value) => [`INR ${value}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">No sales data recorded</div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card p-6 space-y-4">
          <h2 className="text-base font-bold text-gray-900">Low Stock Alert</h2>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.map((prod) => (
                <div key={prod._id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    <img src={prod.images?.[0]?.url || 'https://placehold.co/100x100'} alt={prod.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-900 truncate">{prod.title}</p>
                    <p className="text-xxs text-gray-500 capitalize">{prod.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="badge bg-red-100 text-red-700 text-xxs font-bold">Qty: {prod.stock}</span>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Link to="/dashboard/products" className="btn btn-ghost w-full py-2 text-xs">Manage Inventory</Link>
              </div>
            </div>
          ) : (
            <div className="h-60 flex flex-col items-center justify-center text-center text-gray-400">
              <span className="text-2xl mb-2">Check</span>
              <p className="text-sm">All products are well stocked</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
            <Link to="/orders/seller" className="text-xs text-primary-600 font-medium hover:text-primary-700">View all</Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div key={order._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">ID: {order._id.slice(-8)}</span>
                      <span className={`badge ${getOrderStatusColor(order.orderStatus)}`}>
                        {getOrderStatusLabel(order.orderStatus)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Customer: {order.buyer?.name} | {formatDateTime(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-primary-600">{formatCurrency(order.totalAmount)}</p>
                      <p className="text-xxs text-gray-400">{order.items.length} items</p>
                    </div>

                    {order.orderStatus === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'accepted')}
                        disabled={statusLoading}
                        className="btn btn-primary btn-sm"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400">No orders received yet</div>
          )}
        </div>

        {/* Customer Reviews Panel */}
        <div className="card p-6 space-y-4">
          <h2 className="text-base font-bold text-gray-900">Recent Customer Reviews</h2>
          {recentReviews.length > 0 ? (
            <div className="space-y-4 max-h-[30rem] overflow-y-auto pr-1">
              {recentReviews.map((rev) => (
                <div key={rev._id} className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <p className="font-medium text-gray-900">{rev.buyer?.name || 'Anonymous'}</p>
                    <span className="text-gray-400 font-medium">Rating: {rev.rating}/5</span>
                  </div>
                  <p className="text-xxs text-primary-600 font-semibold truncate">Product: {rev.product?.title}</p>
                  <p className="text-xs text-gray-600 leading-normal italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-gray-400">No reviews received yet</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard
