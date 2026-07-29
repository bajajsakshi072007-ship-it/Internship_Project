import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle2, ChevronDown, ChevronUp, MapPin, CreditCard, ArrowRight, RefreshCw, XCircle } from 'lucide-react';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { api } from '../services/api';

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const data = await api.getMyOrders();
      setOrders(data);
      if (data && data.length > 0 && !expandedOrder) {
        setExpandedOrder(data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching buyer orders:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  }, [expandedOrder]);

  useEffect(() => {
    fetchOrders();

    // Auto-polling interval every 12 seconds for prompt status updates
    const interval = setInterval(() => {
      fetchOrders();
    }, 12000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
        <div className="h-10 w-64 bg-amber-100 rounded-xl animate-pulse"></div>
        <div className="h-64 bg-amber-50 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="pb-4 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif">My Order History & Live Tracking</h1>
          <p className="text-xs text-stone-600 font-medium mt-1">
            Monitor fulfillment progress of your handmade rural crafts from artisan workshop to delivery
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="bg-white hover:bg-amber-100 border border-amber-300 text-stone-800 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            title="Refresh order status"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-terracotta-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Status'}</span>
          </button>
          <Link
            to="/products"
            className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
          >
            <span>Explore Crafts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-amber-200 p-12 rounded-3xl text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-amber-100/80 rounded-2xl flex items-center justify-center mx-auto text-terracotta-600">
            <Package className="w-8 h-8 text-terracotta-600" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No Craft Orders Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You haven't ordered any handmade artisan crafts yet. Discover unique pottery, silk sarees, and folk art today.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
          >
            <span>Browse Artisan Catalog</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order._id;
            return (
              <div
                key={order._id}
                className="bg-white border border-amber-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all"
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                  className="p-5 bg-amber-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-amber-100/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-stone-900 text-sm">Order #{order._id}</span>
                      <OrderStatusBadge status={order.orderStatus} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span>Placed: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-stone-700 bg-white px-2 py-0.5 rounded-md border border-amber-200 text-[10px]">
                        <CreditCard className="w-3 h-3 text-terracotta-600" />
                        {order.paymentMethod || 'UPI'} ({order.paymentStatus || 'Completed'})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-stone-400 block font-semibold">Total Amount</span>
                      <span className="text-base font-black text-stone-900">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                    </div>

                    <button className="p-1.5 bg-amber-200/80 rounded-full text-stone-800">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details & Tracking Timeline */}
                {isExpanded && (
                  <div className="p-6 border-t border-amber-200 space-y-6 bg-white">
                    
                    {/* Items */}
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs mb-3">Craft Items in this Order:</h4>
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/40 border border-amber-200/80">
                            <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl border border-amber-200" />
                            <div className="flex-1">
                              <h5 className="font-bold text-stone-900 text-xs">{item.title}</h5>
                              <span className="text-[11px] text-stone-600 font-medium">Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</span>
                            </div>
                            <span className="font-extrabold text-stone-900 text-xs">
                              ₹{(item.price * item.quantity)?.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                          <MapPin className="w-4 h-4 text-terracotta-600" />
                          <span>Delivery Address:</span>
                        </div>
                        <p className="text-xs text-stone-700 pl-5 font-medium">
                          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </p>
                        <p className="text-[11px] text-stone-500 pl-5">Phone: {order.shippingAddress.phone}</p>
                      </div>
                    )}

                    {/* Order Tracking Progress Timeline */}
                    <div className="pt-2">
                      <h4 className="font-bold text-stone-900 text-xs mb-4">Fulfillment Tracking Timeline</h4>
                      
                      <div className="relative border-l-2 border-amber-300 ml-3 space-y-6 pl-6">
                        {order.timeline?.map((step, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-terracotta-600 border-2 border-white shadow-xs"></div>
                            <div>
                              <span className="font-bold text-stone-900 text-xs">{step.status}</span>
                              <p className="text-xs text-stone-600 mt-0.5">{step.note}</p>
                              <span className="text-[10px] text-stone-400 block mt-1 font-mono">
                                {new Date(step.updatedAt).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

