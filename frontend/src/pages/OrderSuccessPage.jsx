import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import OrderStatusBadge from '../components/OrderStatusBadge';

export default function OrderSuccessPage() {
  const location = useLocation();
  const order = location.state?.order || {
    _id: 'ord_demo_1001',
    totalAmount: 1300,
    orderStatus: 'Pending',
    shippingAddress: { city: 'Gurugram', state: 'Haryana' }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h1 className="text-3xl font-extrabold font-serif text-stone-900">
        Order Placed Successfully!
      </h1>

      <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
        Thank you for directly supporting rural Indian craftspeople. Your order details have been dispatched to the artisan.
      </p>

      {/* Summary Card */}
      <div className="bg-amber-50/80 border border-amber-200 p-6 rounded-3xl text-left space-y-4 max-w-lg mx-auto shadow-xs">
        <div className="flex justify-between items-center pb-3 border-b border-amber-200 text-xs font-bold">
          <span>Order ID: #{order._id}</span>
          <OrderStatusBadge status={order.orderStatus || 'Pending'} />
        </div>

        <div className="space-y-1 text-xs text-stone-700 font-medium">
          <div className="flex justify-between">
            <span>Total Paid Amount:</span>
            <strong className="text-stone-900 text-sm">₹{order.totalAmount?.toLocaleString('en-IN')}</strong>
          </div>
          <div className="flex justify-between">
            <span>Destination City:</span>
            <span>{order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
          </div>
        </div>

        <div className="p-3 bg-amber-100/70 rounded-xl text-[11px] text-amber-900 font-semibold flex items-center gap-2">
          <Truck className="w-4 h-4 text-terracotta-600" />
          <span>Craft item is being prepared for dispatch with eco-friendly padding.</span>
        </div>
      </div>

      <div className="pt-4 flex justify-center gap-4">
        <Link
          to="/my-orders"
          className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          <Package className="w-4 h-4" />
          <span>Track Order Status</span>
        </Link>
        <Link
          to="/products"
          className="bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 font-bold text-xs px-5 py-3 rounded-xl transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
