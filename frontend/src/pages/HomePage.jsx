import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Award, ArrowRight, ShieldCheck, Heart, Volume2, Store } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import AudioPlayer from '../components/AudioPlayer';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getProducts({ featured: 'true' });
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    { name: 'Pottery & Terracotta', icon: '🏺', color: 'from-amber-700 to-terracotta-600', count: '120+ Crafts' },
    { name: 'Handloom & Textiles', icon: '🧵', color: 'from-purple-800 to-indigoCraft-500', count: '85+ Sarees & Fabrics' },
    { name: 'Metalcraft & Dhokra', icon: '🪔', color: 'from-yellow-700 to-amber-600', count: '60+ Statues' },
    { name: 'Woodcraft & Carvings', icon: '🪵', color: 'from-stone-800 to-amber-900', count: '45+ Carvings' },
    { name: 'Folk Art & Paintings', icon: '🎨', color: 'from-rose-700 to-terracotta-600', count: '90+ Artworks' },
    { name: 'Bamboo & Jute', icon: '🧺', color: 'from-emerald-800 to-teal-600', count: '50+ Eco Items' },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-100/80 via-amber-50 to-amber-50/20 pt-12 pb-20 border-b border-amber-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-100 border border-terracotta-200 text-terracotta-800 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
                <span>Empowering 5,000+ Rural Artisans Across India</span>
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
                {t('heroTitle')}
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-medium max-w-2xl">
                {t('heroSubtitle')}
              </p>

              {/* Audio Story Preview Badge */}
              <div className="pt-2">
                <AudioPlayer
                  text="Welcome to GraminCraft! We connect master rural artisans from remote Indian villages directly to your doorstep with zero middlemen."
                  title="Listen to Platform Introduction"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/products"
                  className="w-full sm:w-auto bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Compass className="w-5 h-5" />
                  <span>Explore Craft Marketplace</span>
                </Link>

                <Link
                  to="/register?role=artisan"
                  className="w-full sm:w-auto bg-white hover:bg-amber-100 text-stone-900 border border-amber-300 font-bold text-sm px-6 py-3.5 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Store className="w-5 h-5 text-terracotta-600" />
                  <span>Artisan Registration</span>
                </Link>
              </div>
            </div>

            {/* Hero Image Showcase Grid */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                <div className="glass-card rounded-3xl p-4 shadow-2xl border border-amber-300/80 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800"
                    alt="Master Artisan Crafting Terracotta"
                    className="w-full h-72 object-cover rounded-2xl shadow-md"
                  />
                  <div className="mt-4 p-3 bg-amber-50/90 rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">Sunita Devi • Terracotta Sculptor</h4>
                      <p className="text-xs text-stone-500">Molela Village, Rajasthan</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-300">
                      Verified Artisan
                    </span>
                  </div>
                </div>

                {/* Decorative floating stats pill */}
                <div className="absolute -bottom-6 -left-6 bg-stone-900 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-700">
                  <div className="p-2.5 bg-amber-500 rounded-xl text-stone-950 font-bold text-lg">
                    100%
                  </div>
                  <div>
                    <span className="block text-xs font-bold">Direct Fair Trade</span>
                    <span className="text-[10px] text-stone-400">Zero Middlemen Commission</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Craft Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-terracotta-600 uppercase tracking-widest">Handicraft Traditions</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">Explore by Traditional Craft Form</h2>
          </div>
          <Link to="/products" className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1">
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white border border-amber-200/80 hover:border-terracotta-400 p-5 rounded-2xl text-center shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-between hover:-translate-y-1"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="font-bold text-stone-900 text-xs line-clamp-1 group-hover:text-terracotta-600">
                {cat.name}
              </h3>
              <span className="text-[10px] text-stone-400 font-semibold mt-1">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Crafts Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-100/40 border border-amber-200 rounded-3xl p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Curated Heritage Selection</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">Featured Rural Handicrafts</h2>
            </div>
            <Link to="/products" className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1">
              <span>Browse Full Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 shimmer-loading rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Rural Empowerment & Impact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigoCraft-900 via-indigoCraft-800 to-stone-900 rounded-3xl text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30 inline-block">
                Digital Inclusion for Rural Talent
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-wide leading-tight">
                Why Support GraminCraft?
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed max-w-2xl">
                Rural artisans often lack digital storefront access and technical e-commerce tools. GraminCraft provides voice-guided listing creation, localized multi-language UI, direct order tracking, and sales analytics to empower artisan families toward sustainable economic freedom.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 text-center sm:text-left">
                <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <span className="block text-2xl font-extrabold text-amber-400">100%</span>
                  <span className="text-[11px] text-stone-300">Direct Earnings</span>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <span className="block text-2xl font-extrabold text-amber-400">7+</span>
                  <span className="text-[11px] text-stone-300">Local Languages</span>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <span className="block text-2xl font-extrabold text-amber-400">Audio</span>
                  <span className="text-[11px] text-stone-300">Voice Narratives</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-center space-y-4">
                <h3 className="font-serif font-bold text-lg text-amber-300">Are You an Artisan?</h3>
                <p className="text-xs text-stone-200">
                  Start selling your handmade crafts to thousands of conscious buyers today.
                </p>
                <Link
                  to="/register?role=artisan"
                  className="block w-full bg-terracotta-600 hover:bg-terracotta-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md"
                >
                  Create Artisan Storefront
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
