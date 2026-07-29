import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, QrCode, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const [shipping, setShipping] = useState({
    street: '42 MG Road, Sector 14',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122001',
    phone: '+91 9876543210'
  });

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const items = cart.map(({ product, quantity }) => ({
        product: product._id,
        artisan: product.artisan || 'mock_artisan_1',
        title: product.title,
        price: product.price,
        quantity,
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'
      }));

      const orderData = {
        items,
        shippingAddress: shipping,
        paymentMethod,
        totalAmount: subtotal
      };

      const createdOrder = await api.createOrder(orderData);
      clearCart();
      navigate('/order-success', { state: { order: createdOrder } });
    } catch (err) {
      alert(err.message || 'Order placement failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-extrabold text-stone-900 font-serif">Checkout & Delivery</h1>

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Shipping & Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Address Box */}
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Truck className="w-5 h-5 text-terracotta-600" />
              Delivery Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="sm:col-span-2">
                <label className="block text-stone-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={shipping.street}
                  onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                  className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">State</label>
                <input
                  type="text"
                  value={shipping.state}
                  onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                  className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Pincode</label>
                <input
                  type="text"
                  value={shipping.pincode}
                  onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })}
                  className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  value={shipping.phone}
                  onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                  className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-terracotta-600" />
              Select Payment Method
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              {[
                { id: 'UPI', label: 'UPI / GPay / PhonePe', icon: QrCode },
                { id: 'COD', label: 'Cash on Delivery (COD)', icon: Truck },
                { id: 'Card', label: 'Debit / Credit Card', icon: CreditCard },
                { id: 'NetBanking', label: 'Net Banking', icon: ShieldCheck }
              ].map((pm) => {
                const IconComp = pm.icon;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3 transition-all ${
                      paymentMethod === pm.id
                        ? 'border-terracotta-600 bg-terracotta-50/50 text-terracotta-900 shadow-xs'
                        : 'border-amber-200 bg-stone-50 text-stone-700 hover:border-amber-300'
                    }`}
                  >
                    <IconComp className="w-5 h-5 text-terracotta-600" />
                    <span>{pm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-amber-100/60 border border-amber-300/80 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-stone-900 text-lg">Order Items ({cart.length})</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(({ product, quantity }) => (
                <div key={product._id} className="flex items-center justify-between text-xs font-semibold text-stone-800">
                  <span className="line-clamp-1">{product.title} (x{quantity})</span>
                  <span>₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-amber-200 pt-4 flex justify-between text-lg font-extrabold text-stone-900">
              <span>Total Payable</span>
              <span className="text-terracotta-600 text-2xl">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Processing Order...' : 'Confirm Order & Place Request'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
