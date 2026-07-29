import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-terracotta-600">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold font-serif text-stone-900">Your Craft Basket is Empty</h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Explore handmade terracotta, sarees, metalware, and folk paintings crafted by rural Indian artisans.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-terracotta-600 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md hover:bg-terracotta-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Handicraft Marketplace</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-amber-200">
        <h1 className="text-3xl font-extrabold text-stone-900 font-serif">
          Shopping Basket ({totalItems} items)
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(({ product, quantity }) => (
            <div
              key={product._id}
              className="bg-white border border-amber-200 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded-xl border border-amber-200"
                />
                <div>
                  <h3 className="font-bold text-stone-900 text-sm line-clamp-1">{product.title}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Artisan: {product.artisanName}</p>
                  <span className="text-xs font-bold text-terracotta-600 mt-1 block">
                    ₹{product.price.toLocaleString('en-IN')} each
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="flex items-center border border-amber-300 rounded-xl bg-amber-50/50 p-1">
                  <button
                    onClick={() => updateQuantity(product._id, -1)}
                    className="w-7 h-7 font-bold text-stone-700 hover:bg-amber-200 rounded-lg"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-stone-900 text-xs">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product._id, 1)}
                    className="w-7 h-7 font-bold text-stone-700 hover:bg-amber-200 rounded-lg"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-stone-900 text-base">
                    ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(product._id)}
                  className="text-stone-400 hover:text-rose-600 p-2 transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-amber-100/60 border border-amber-300/80 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="font-serif font-bold text-stone-900 text-lg">Order Summary</h3>
            
            <div className="space-y-2 text-xs font-semibold text-stone-700 border-b border-amber-200 pb-4">
              <div className="flex justify-between">
                <span>Crafts Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Eco Shipping & Handling</span>
                <span className="text-emerald-700 font-bold">FREE (Promotional)</span>
              </div>
            </div>

            <div className="flex justify-between text-base font-extrabold text-stone-900 pt-1">
              <span>Total Amount</span>
              <span className="text-2xl text-terracotta-600">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>{t('checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-[11px] text-stone-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Secure Checkout & Fair Trade Guarantee</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
