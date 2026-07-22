import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../services/product.service'
import ProductGrid from '../components/product/ProductGrid'
import { PRODUCT_CATEGORIES, CATEGORY_ICONS } from '../utils/constants'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [isLoading, setIsLoading]               = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await productService.getProducts({ sort: 'rating', limit: 8 })
        setFeaturedProducts(res.data.data || [])
      } catch {
        // silent fail for public page
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <div className="animate-fade-in">
      {/* ─── Hero Section ─── */}
      <section className="hero-gradient bg-hero-pattern relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-900/80 to-accent-900/70" />
        <div className="container-app relative py-24 md:py-32 lg:py-40">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 badge bg-primary-500/20 text-primary-300 border border-primary-500/30 mb-6 px-3 py-1.5 text-sm">
              🇮🇳 Made in Rural India
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
              Discover Authentic
              <span className="block gradient-text bg-gradient-to-r from-primary-400 to-accent-400">
                Handcrafted Art
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-xl">
              Connect directly with skilled rural artisans across India. Every purchase supports a family and preserves centuries-old craft traditions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn btn-primary btn-lg">
                🛍️ Shop Now
              </Link>
              <Link to="/register?role=seller" className="btn border-2 border-white/30 text-white hover:bg-white/10 btn-lg">
                🏺 Sell Your Craft
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { value: '500+', label: 'Artisans' },
                { value: '2000+', label: 'Products' },
                { value: '10K+', label: 'Happy Buyers' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-primary-400">{value}</p>
                  <p className="text-sm text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full fill-surface">
            <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,80L1320,80C1200,80,960,80,720,80C480,80,240,80,120,80L0,80Z" />
          </svg>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="container-app py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary-500 font-medium text-sm mb-1">Browse by Craft</p>
            <h2 className="section-title">Explore Categories</h2>
          </div>
          <Link to="/products" className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {PRODUCT_CATEGORIES.slice(0, 12).map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${cat}`}
              className="group card-hover flex flex-col items-center gap-3 p-5 text-center"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                {CATEGORY_ICONS[cat] || '✨'}
              </span>
              <span className="text-xs font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section className="bg-gray-50 py-16">
        <div className="container-app">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-primary-500 font-medium text-sm mb-1">Top Rated</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link to="/products?sort=rating" className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors">
              View all →
            </Link>
          </div>
          <ProductGrid products={featuredProducts} isLoading={isLoading} />
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section className="container-app py-16">
        <div className="text-center mb-12">
          <p className="text-primary-500 font-medium text-sm mb-1">Why ArtisanMarket</p>
          <h2 className="page-title">Shopping with Purpose</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🤝', title: 'Direct from Artisans', desc: 'No middlemen — 100% of your money goes directly to the artisan family' },
            { icon: '✅', title: 'Authentic & Verified', desc: 'Every seller is verified. Every product is genuinely handcrafted.' },
            { icon: '🚚', title: 'Safe Delivery', desc: 'Carefully packaged and shipped across India with tracking' },
            { icon: '💚', title: 'Sustainable', desc: 'Eco-friendly products made with traditional, sustainable methods' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="card p-6 text-center group hover:border-primary-200 transition-colors">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
              <h3 className="font-heading font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="container-app pb-16">
        <div className="hero-gradient rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-pattern opacity-30" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Are you an artisan?
            </h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              Join thousands of artisans selling their craft online. Create your shop for free and reach buyers across India.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Selling Today →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
