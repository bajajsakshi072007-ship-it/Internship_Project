import React from 'react';
import { Heart, ShieldCheck, Truck, RefreshCw, Award, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="p-3 bg-terracotta-600/20 text-terracotta-400 rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-white text-sm">100% Authentic Rural Crafts</h4>
            <p className="text-xs text-stone-400">Directly sourced from verified rural master artisans across India.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="p-3 bg-amber-600/20 text-amber-400 rounded-2xl">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-white text-sm">Direct Artisan Empowerment</h4>
            <p className="text-xs text-stone-400">100% fair pricing proceeds go directly to village craftspeople.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-white text-sm">Eco Packaging & Safe Delivery</h4>
            <p className="text-xs text-stone-400">Fragile craft items protected with biodegradable husk & jute padding.</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-white text-sm">Transparent Order Tracking</h4>
            <p className="text-xs text-stone-400">Track fulfillment status from village workshop to your doorstep.</p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪔</span>
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                Gramin<span className="text-terracotta-400">Craft</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Bridging the digital divide for rural India's handicraft artisans. Empowering local communities through direct e-commerce access, fair trade, and cultural preservation.
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-white text-sm mb-4">Handicraft Categories</h5>
            <ul className="space-y-2 text-xs text-stone-400 font-medium">
              <li><a href="/products?category=Pottery%20%26%20Terracotta" className="hover:text-amber-400 transition-colors">Terracotta & Pottery</a></li>
              <li><a href="/products?category=Handloom%20%26%20Textiles" className="hover:text-amber-400 transition-colors">Chanderi & Handloom Textiles</a></li>
              <li><a href="/products?category=Metalcraft%20%26%20Dhokra" className="hover:text-amber-400 transition-colors">Dhokra Brass & Metalcraft</a></li>
              <li><a href="/products?category=Folk%20Art%20%26%20Paintings" className="hover:text-amber-400 transition-colors">Madhubani & Warli Folk Paintings</a></li>
              <li><a href="/products?category=Woodcraft%20%26%20Carvings" className="hover:text-amber-400 transition-colors">Woodcraft & Teak Carvings</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white text-sm mb-4">Rural States & Regions</h5>
            <ul className="space-y-2 text-xs text-stone-400 font-medium">
              <li><a href="/products?stateOfOrigin=Rajasthan" className="hover:text-amber-400 transition-colors">Rajasthan Clay Artisans</a></li>
              <li><a href="/products?stateOfOrigin=Madhya%20Pradesh" className="hover:text-amber-400 transition-colors">Madhya Pradesh Weavers</a></li>
              <li><a href="/products?stateOfOrigin=West%20Bengal" className="hover:text-amber-400 transition-colors">West Bengal Dhokra Artists</a></li>
              <li><a href="/products?stateOfOrigin=Gujarat" className="hover:text-amber-400 transition-colors">Gujarat Kutch Woodcraft</a></li>
              <li><a href="/products?stateOfOrigin=Bihar" className="hover:text-amber-400 transition-colors">Bihar Mithila Painters</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white text-sm mb-4">Artisan Community</h5>
            <p className="text-xs text-stone-400 mb-4">
              Are you a rural artisan or self-help craft group? Join GraminCraft to setup your digital storefront today.
            </p>
            <a
              href="/register?role=artisan"
              className="inline-flex items-center gap-1.5 bg-terracotta-600 hover:bg-terracotta-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join as Rural Seller</span>
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 text-center text-xs text-stone-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 GraminCraft Local Artisan Platform. Built for Rural Empowerment.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Rural Artisans & Traditional Crafts
          </p>
        </div>
      </div>
    </footer>
  );
}
