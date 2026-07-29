import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, MapPin, Leaf, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800';

  return (
    <div className="group bg-white rounded-2xl border border-amber-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Product Image Showcase */}
      <div className="relative aspect-square overflow-hidden bg-amber-50/50 cursor-pointer">
        <Link to={`/products/${product._id}`}>
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* State Badge */}
        <span className="absolute top-3 left-3 bg-indigoCraft-900/85 backdrop-blur-md text-amber-200 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
          <MapPin className="w-3 h-3 text-terracotta-400" />
          {product.stateOfOrigin}
        </span>

        {/* Eco Friendly Tag */}
        {product.ecoFriendly && (
          <span className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
            <Leaf className="w-3 h-3" />
            Handmade
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
            <span className="text-terracotta-600 font-semibold">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.9'}</span>
              <span className="text-stone-400 text-[10px]">({product.numReviews || 12})</span>
            </div>
          </div>

          <Link to={`/products/${product._id}`}>
            <h3 className="font-semibold text-stone-900 line-clamp-2 hover:text-terracotta-600 transition-colors text-base leading-snug">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-stone-600 mt-1 line-clamp-1">
            {t('handcraftedBy')}: <strong className="text-stone-800">{product.artisanName}</strong>
          </p>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 block font-medium">Price</span>
            <span className="text-lg font-bold text-stone-900">₹{product.price.toLocaleString('en-IN')}</span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="bg-amber-100 hover:bg-terracotta-600 text-terracotta-800 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('addToCart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
