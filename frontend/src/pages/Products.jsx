import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useDebounce } from '../hooks/useDebounce'
import ProductGrid from '../components/product/ProductGrid'
import Pagination from '../components/common/Pagination'
import { PRODUCT_CATEGORIES, SORT_OPTIONS } from '../utils/constants'
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput]   = useState(searchParams.get('search') || '')
  const [showFilters, setShowFilters]   = useState(false)
  const debouncedSearch = useDebounce(searchInput, 500)

  const { products, meta, isLoading, params, updateParams, goToPage } = useProducts({
    category: searchParams.get('category') || '',
    sort:     searchParams.get('sort')     || 'newest',
    search:   searchParams.get('search')   || '',
  })

  // Sync debounced search
  useEffect(() => {
    updateParams({ search: debouncedSearch })
    if (debouncedSearch) {
      setSearchParams((prev) => { prev.set('search', debouncedSearch); return prev })
    } else {
      setSearchParams((prev) => { prev.delete('search'); return prev })
    }
  }, [debouncedSearch])

  const handleCategory = (cat) => {
    const newCat = params.category === cat ? '' : cat
    updateParams({ category: newCat })
    if (newCat) setSearchParams((prev) => { prev.set('category', newCat); return prev })
    else setSearchParams((prev) => { prev.delete('category'); return prev })
  }

  const handleSort = (e) => {
    updateParams({ sort: e.target.value })
    setSearchParams((prev) => { prev.set('sort', e.target.value); return prev })
  }

  const handlePriceFilter = (min, max) => {
    updateParams({ minPrice: min || undefined, maxPrice: max || undefined })
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearchParams({})
    updateParams({ search: '', category: '', minPrice: undefined, maxPrice: undefined, sort: 'newest' })
  }

  const hasFilters = params.search || params.category || params.minPrice || params.maxPrice

  return (
    <div className="container-app py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title mb-1">All Products</h1>
        <p className="text-gray-500 text-sm">
          {meta?.total ? `${meta.total} products found` : 'Explore our collection'}
        </p>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            id="product-search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="form-input pl-12"
          />
        </div>

        <select
          value={params.sort || 'newest'}
          onChange={handleSort}
          className="form-input sm:w-48"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'} gap-2`}
          aria-expanded={showFilters}
        >
          <FunnelIcon className="w-5 h-5" />
          Filters
          {hasFilters && <span className="w-2 h-2 rounded-full bg-red-400" />}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-5 mb-6 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Filters</h3>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600">
                <XMarkIcon className="w-4 h-4" /> Clear all
              </button>
            )}
          </div>

          {/* Category */}
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-700 mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    params.category === cat
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Price Range (₹)</p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min"
                min="0"
                className="form-input w-28"
                onChange={(e) => handlePriceFilter(e.target.value, params.maxPrice)}
              />
              <span className="text-gray-400">—</span>
              <input
                type="number"
                placeholder="Max"
                min="0"
                className="form-input w-28"
                onChange={(e) => handlePriceFilter(params.minPrice, e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Active filter pills */}
      {(params.category || params.search) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {params.category && (
            <span className="badge badge-primary gap-1">
              {params.category}
              <button onClick={() => handleCategory(params.category)} aria-label="Remove category filter">×</button>
            </span>
          )}
          {params.search && (
            <span className="badge badge-gray gap-1">
              "{params.search}"
              <button onClick={() => setSearchInput('')} aria-label="Remove search filter">×</button>
            </span>
          )}
        </div>
      )}

      {/* Products */}
      <ProductGrid products={products} isLoading={isLoading} />

      {/* Pagination */}
      {meta && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  )
}

export default Products
