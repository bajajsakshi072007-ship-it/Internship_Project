import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, TrendingUp, ShoppingBag, Clock, CheckCircle2, Star, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import OrderStatusBadge from '../components/OrderStatusBadge';
import SalesTrendChart from '../components/SalesTrendChart';
import TopProductsChart from '../components/TopProductsChart';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ArtisanDashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const stats = await api.getArtisanAnalytics();
      setAnalytics(stats);

      const ordList = await api.getArtisanOrders();
      setOrders(ordList);

      const prodList = await api.getMyArtisanProducts();
      setMyProducts(prodList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [statusNotification, setStatusNotification] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setStatusNotification('');
    try {
      await api.updateOrderStatus(orderId, {
        status: newStatus,
        note: `Order status updated to ${newStatus} by artisan`
      });
      setStatusNotification(`Order #${orderId} status updated to "${newStatus}" successfully!`);
      setTimeout(() => setStatusNotification(''), 4000);
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((order) => {
    if (orderStatusFilter === 'All') return true;
    return order.orderStatus === orderStatusFilter;
  });

  const getStatusCount = (status) => {
    if (status === 'All') return orders.length;
    return orders.filter((o) => o.orderStatus === status).length;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-96 shimmer-loading rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-200">
        <div>
          <span className="text-xs font-bold text-terracotta-600 uppercase tracking-widest">Artisan Studio</span>
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
            Welcome, {user?.name || 'Sunita Devi'} 👋
          </h1>
          <p className="text-xs text-stone-600 font-medium mt-1">
            Manage your handmade craft catalog, track customer orders, and view sales revenue
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/artisan/products"
            className="bg-white hover:bg-amber-100 border border-amber-300 text-stone-900 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            Manage Craft Listings
          </Link>
          <Link
            to="/artisan/products/new"
            className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white border border-amber-200 p-6 rounded-3xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-terracotta-600">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Revenue</span>
            <div className="p-2 bg-terracotta-50 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-stone-900 block">
            ₹{analytics?.totalRevenue?.toLocaleString('en-IN') || 0}
          </span>
          <p className="text-[11px] text-stone-400 font-medium">Direct earnings from sales</p>
        </div>

        <div className="bg-white border border-amber-200 p-6 rounded-3xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Pending Orders</span>
            <div className="p-2 bg-amber-50 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-stone-900 block">
            {analytics?.pendingOrders || 0}
          </span>
          <p className="text-[11px] text-stone-400 font-medium">Requires dispatch packing</p>
        </div>

        <div className="bg-white border border-amber-200 p-6 rounded-3xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Active Listings</span>
            <div className="p-2 bg-emerald-50 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-stone-900 block">
            {myProducts.length || 0}
          </span>
          <p className="text-[11px] text-stone-400 font-medium">Live on marketplace</p>
        </div>

        <div className="bg-white border border-amber-200 p-6 rounded-3xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-purple-600">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Artisan Rating</span>
            <div className="p-2 bg-purple-50 rounded-xl">
              <Star className="w-5 h-5 fill-purple-400 text-purple-400" />
            </div>
          </div>
          <span className="text-3xl font-black text-stone-900 block">
            {analytics?.averageRating || 4.9} / 5.0
          </span>
          <p className="text-[11px] text-stone-400 font-medium">Based on buyer feedback</p>
        </div>

      </div>

      {/* Visual Analytics Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesTrendChart data={analytics?.monthlyRevenue} />
        <TopProductsChart products={analytics?.topProducts} />
      </section>

      {/* Orders Management Table */}
      <section className="bg-white border border-amber-200 rounded-3xl p-6 shadow-xs space-y-6">
        
        {/* Status Change Notification Banner */}
        {statusNotification && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{statusNotification}</span>
            </div>
            <button onClick={() => setStatusNotification('')} className="text-emerald-600 hover:text-emerald-800 p-0.5">
              ×
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-4">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-xl">Customer Craft Orders</h3>
            <p className="text-xs text-stone-500 mt-0.5">Manage fulfillment progress for incoming buyer orders</p>
          </div>
          <button
            onClick={loadDashboardData}
            className="p-2 text-stone-600 hover:text-terracotta-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1 text-xs font-bold"
          >
            <RefreshCw className="w-4 h-4 text-terracotta-600" />
            <span>Refresh Table</span>
          </button>
        </div>

        {/* Status Filter Tab Pills */}
        {orders.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {statusOptions.map((st) => {
              const count = getStatusCount(st);
              const isActive = orderStatusFilter === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-amber-50/80 text-stone-700 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <span>{st === 'All' ? 'All Orders' : st}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-amber-400 text-stone-900' : 'bg-amber-200/70 text-stone-800'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-amber-50/40 rounded-2xl border border-amber-100">
            <Package className="w-10 h-10 text-stone-400 mx-auto" />
            <p className="text-xs font-bold text-stone-700">No Customer Orders Received Yet</p>
            <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
              New orders placed by buyers for your handmade craft listings will appear here automatically.
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-8 text-center space-y-2 bg-amber-50/30 rounded-2xl border border-amber-100">
            <p className="text-xs font-bold text-stone-700">No orders matching "{orderStatusFilter}" status</p>
            <button
              type="button"
              onClick={() => setOrderStatusFilter('All')}
              className="text-xs font-bold text-terracotta-600 hover:underline cursor-pointer"
            >
              Show All Orders ({orders.length})
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-amber-200 text-[11px] uppercase font-bold text-stone-500 bg-amber-50/60">
                  <th className="p-3.5">Order ID & Date</th>
                  <th className="p-3.5">Buyer & Delivery</th>
                  <th className="p-3.5">Craft Items Purchased</th>
                  <th className="p-3.5">Total & Payment</th>
                  <th className="p-3.5">Current Status</th>
                  <th className="p-3.5 text-right">Fulfillment Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 text-xs font-semibold text-stone-800">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-stone-900 block">#{order._id}</span>
                      <span className="text-[10px] text-stone-500 font-normal">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div>
                        <span className="block font-extrabold text-stone-900">{order.buyerName}</span>
                        <span className="text-[11px] text-stone-600 font-medium block">
                          {order.shippingAddress?.city}, {order.shippingAddress?.state}
                        </span>
                        {order.shippingAddress?.phone && (
                          <span className="text-[10px] text-stone-400 font-mono">Ph: {order.shippingAddress.phone}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-1.5 max-w-xs">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            {item.image && (
                              <img src={item.image} alt={item.title} className="w-7 h-7 object-cover rounded-md border border-amber-200" />
                            )}
                            <span className="text-stone-800 text-[11px] font-bold truncate">
                              {item.title} <span className="text-stone-500 font-medium">({item.quantity}x)</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-black text-stone-900 block text-sm">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                      <span className="inline-block text-[10px] font-bold text-terracotta-700 bg-terracotta-50 px-2 py-0.5 rounded-md border border-terracotta-200/60 mt-0.5">
                        {order.paymentMethod || 'UPI'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <OrderStatusBadge status={order.orderStatus} />
                    </td>
                    <td className="p-3.5 text-right">
                      <select
                        value={order.orderStatus}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-amber-50 border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800 outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer disabled:opacity-50"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing / Crafting</option>
                        <option value="Shipped">Dispatched / Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
