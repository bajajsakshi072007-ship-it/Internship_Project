import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productService } from '../services/product.service'
import { reviewService } from '../services/review.service'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import ProductGrid from '../components/product/ProductGrid'
import StarRating from '../components/review/StarRating'
import ReviewCard from '../components/review/ReviewCard'
import ReviewForm from '../components/review/ReviewForm'
import Spinner from '../components/common/Spinner'
import { formatCurrency, getAvatarUrl } from '../utils/helpers'
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

const ProductDetails = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()

  const [data, setData]             = useState(null)
  const [reviews, setReviews]       = useState([])
  const [isLoading, setIsLoading]   = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity]     = useState(1)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [addingToCart, setAddingToCart]     = useState(false)

  const isBuyer    = isAuthenticated && user?.role === 'buyer'
  const wishlisted = isWishlisted(id)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    setIsLoading(true)
    try {
      const res = await productService.getProductById(id)
      setData(res.data.data)
      setReviews(res.data.data.product?.reviews || [])
      setActiveImage(0)
    } catch (err) {
      toast.error('Product not found')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await reviewService.getProductReviews(id)
      setReviews(res.data.data || [])
      // Also refetch product to update rating
      fetchProduct()
    } catch {}
  }

  if (isLoading) {
    return (
      <div className="container-app py-20 flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    )
  }

  if (!data?.product) {
    return (
      <div className="container-app py-20 text-center">
        <p className="text-xl text-gray-500">Product not found</p>
        <Link to="/products" className="btn btn-primary mt-4">Browse Products</Link>
      </div>
    )
  }

  const { product, related } = data
  const images = product.images?.length > 0
    ? product.images
    : [{ url: `https://placehold.co/600x600/f59e0b/ffffff?text=${encodeURIComponent(product.title)}`, publicId: 'placeholder' }]

  const handleAddToCart = async () => {
    if (!isBuyer) { toast.error('Please login as a buyer'); return }
    setAddingToCart(true)
    await addToCart(product._id, quantity)
    setAddingToCart(false)
  }

  const handleWishlist = async () => {
    if (!isBuyer) { toast.error('Please login as a buyer'); return }
    if (wishlisted) await removeFromWishlist(product._id)
    else await addToWishlist(product._id)
  }

  return (
    <div className="container-app py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-500">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary-500">Products</Link>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={images[activeImage]?.url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden ring-2 transition-all ${
                    activeImage === i ? 'ring-primary-500' : 'ring-transparent'
                  }`}
                >
                  <img src={img.url} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="badge badge-primary mb-3">{product.category}</span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2">
            {product.title}
          </h1>

          {/* Seller */}
          <div className="flex items-center gap-2 mb-4">
            <img src={getAvatarUrl(product.seller)} alt={product.seller?.name} className="w-7 h-7 rounded-full" />
            <span className="text-sm text-gray-500">by <span className="font-medium text-gray-700">{product.seller?.name}</span></span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-5">
            <StarRating rating={product.rating} showLabel />
            <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-primary-600">{formatCurrency(product.price)}</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Stock Status */}
          <div className="mb-5">
            {product.stock > 0 ? (
              <span className="badge badge-success">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="badge badge-danger">Out of Stock</span>
            )}
          </div>

          {/* Quantity */}
          {product.stock > 0 && isBuyer && (
            <div className="flex items-center gap-3 mb-6">
              <span className="form-label mb-0">Qty:</span>
              <div className="flex items-center border border-gray-200 rounded-xl">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-xl transition-colors"
                >−</button>
                <span className="px-4 py-2 text-gray-900 font-medium text-sm border-x border-gray-200">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-xl transition-colors"
                >+</button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {product.stock > 0 && isBuyer && (
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="btn btn-primary flex-1 gap-2"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            )}
            {isBuyer && (
              <button
                onClick={handleWishlist}
                className={`btn ${wishlisted ? 'btn-danger' : 'btn-outline'} gap-2`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {wishlisted ? <HeartSolid className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}
                {wishlisted ? 'Saved' : 'Wishlist'}
              </button>
            )}
            {!isAuthenticated && (
              <Link to="/login" className="btn btn-primary flex-1">Login to Purchase</Link>
            )}
          </div>

          {/* Artisan Bio */}
          {product.seller?.bio && (
            <div className="mt-6 p-4 bg-primary-50 rounded-xl">
              <p className="text-sm font-medium text-gray-700 mb-1">About the Artisan</p>
              <p className="text-sm text-gray-600">{product.seller.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <section id="reviews" className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Customer Reviews ({reviews.length})</h2>
          {isBuyer && !showReviewForm && (
            <button onClick={() => setShowReviewForm(true)} className="btn btn-outline btn-sm">
              Write a Review
            </button>
          )}
        </div>

        {showReviewForm && (
          <div className="mb-6">
            <ReviewForm
              productId={id}
              onSuccess={() => { setShowReviewForm(false); fetchReviews() }}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} onUpdate={fetchReviews} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-gray-500">
            <p className="text-3xl mb-3">⭐</p>
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </section>

      {/* Related Products */}
      {related?.length > 0 && (
        <section>
          <h2 className="section-title mb-6">Related Products</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  )
}

export default ProductDetails
