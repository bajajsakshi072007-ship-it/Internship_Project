import React from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../hooks/useWishlist'
import ProductGrid from '../components/product/ProductGrid'
import EmptyState from '../components/common/EmptyState'

const Wishlist = () => {
  const { wishlist } = useWishlist()

  const products = wishlist?.products || []

  if (products.length === 0) {
    return (
      <div className="container-app py-12">
        <EmptyState
          icon="Wishlist"
          title="Your wishlist is empty"
          description="Save artisan products that you love here to purchase them later."
          actionLabel="Browse Products"
          actionTo="/products"
        />
      </div>
    )
  }

  return (
    <div className="container-app py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title mb-1">My Wishlist</h1>
        <p className="text-gray-500 text-sm">Products you have saved for later</p>
      </div>

      <ProductGrid products={products} emptyMessage="No items in your wishlist" />
    </div>
  )
}

export default Wishlist
