import React from 'react'
import ProductCard from './ProductCard'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'

const ProductGrid = ({ products = [], isLoading = false, emptyMessage = 'No products found' }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-5 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <EmptyState
        icon="Search"
        title="No products found"
        description={emptyMessage}
        actionLabel="Browse all products"
        actionTo="/products"
      />
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
