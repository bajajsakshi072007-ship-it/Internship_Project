import React from 'react'
import { Link } from 'react-router-dom'
import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { formatCurrency, truncateText } from '../../utils/helpers'

const ProductCard = ({ product }) => {
  const { isAuthenticated, user } = useAuth()
  const { addToCart, isLoading: cartLoading } = useCart()
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()

  const wishlisted = isWishlisted(product._id)
  const isBuyer    = isAuthenticated && user?.role === 'buyer'
  const mainImage  = product.images?.[0]?.url || `https://placehold.co/400x400/f59e0b/ffffff?text=${encodeURIComponent(product.title)}`

  const handleWishlist = async (e) => {
    e.preventDefault()
    if (!isBuyer) return
    if (wishlisted) {
      await removeFromWishlist(product._id)
    } else {
      await addToWishlist(product._id)
    }
  }

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!isBuyer) return
    await addToCart(product._id, 1)
  }

  const stars = Math.round(product.rating || 0)

  return (
    <Link
      to={`/products/${product._id}`}
      className="card-hover group block overflow-hidden"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-gray-100">
        <img
          src={mainImage}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Out of stock badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="badge bg-red-500 text-white text-xs px-3 py-1">Out of Stock</span>
          </div>
        )}

        {/* Actions overlay */}
        {isBuyer && product.stock > 0 && (
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
            >
              {wishlisted
                ? <HeartSolid className="w-5 h-5 text-red-500" />
                : <HeartIcon   className="w-5 h-5 text-gray-600" />
              }
            </button>
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              aria-label="Add to cart"
              className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary-50 transition-colors"
            >
              <ShoppingCartIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* Category badge */}
        <span className="absolute bottom-3 left-3 badge badge-primary text-xs">
          {product.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">by {product.seller?.name || 'Artisan'}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 group-hover:text-primary-600 transition-colors">
          {truncateText(product.title, 50)}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={`w-3.5 h-3.5 ${i < stars ? 'text-primary-400 fill-primary-400' : 'text-gray-200 fill-gray-200'}`}
            />
          ))}
          {product.numReviews > 0 && (
            <span className="text-xs text-gray-500 ml-1">({product.numReviews})</span>
          )}
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary-600 text-base">
            {formatCurrency(product.price)}
          </span>
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-xs text-orange-500 font-medium">
              Only {product.stock} left!
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
