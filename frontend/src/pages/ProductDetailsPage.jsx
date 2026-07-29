import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Leaf, ShoppingBag, Truck, ShieldCheck, Heart, UserCheck, MessageSquare, Sparkles } from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const prodData = await api.getProductById(id);
        setProduct(prodData);
        const revData = await api.getProductReviews(id);
        setReviews(revData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const rev = await api.addReview(id, {
        rating: newRating,
        comment: newComment
      });
      setReviews([rev, ...reviews]);
      setNewComment('');
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-96 shimmer-loading rounded-3xl"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-stone-900">Craft Product Not Found</h2>
        <Link to="/products" className="text-terracotta-600 font-bold underline mt-2 inline-block">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image Gallery (Cloudinary Multi-Image Preview) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden border border-amber-200 shadow-md bg-stone-100 relative">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.ecoFriendly && (
              <span className="absolute top-4 right-4 bg-emerald-700/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <Leaf className="w-3.5 h-3.5" />
                Handcrafted Eco Craft
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-terracotta-600 ring-2 ring-terracotta-200' : 'border-amber-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Purchase Controls */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-terracotta-600 bg-terracotta-50 px-2.5 py-1 rounded-md border border-terracotta-200">
                {product.category}
              </span>
              <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                {product.stateOfOrigin}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-stone-900 font-serif leading-tight">
              {product.title}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-2 mt-3 text-sm">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                  />
                ))}
              </div>
              <span className="font-bold text-stone-900">{product.rating || '4.9'}</span>
              <span className="text-stone-400 text-xs">({reviews.length} Verified Buyer Reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-bold block">Artisan Fair Price</span>
              <span className="text-3xl font-black text-stone-900">₹{product.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                In Stock ({product.stock} items available)
              </span>
            </div>
          </div>

          {/* Product Description & Audio Story */}
          <div className="space-y-3">
            <h3 className="font-bold text-stone-900 text-sm">About this Craft</h3>
            <p className="text-stone-700 text-sm leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Audio Story Feature */}
            {product.audioStory && (
              <div className="pt-2">
                <AudioPlayer text={product.audioStory} title="Listen to Artisan Craft Story" />
              </div>
            )}
          </div>

          {/* Craft Specifications */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-xl border border-amber-200 text-xs">
            <div>
              <span className="text-stone-400 block font-semibold">Materials Used</span>
              <span className="font-bold text-stone-800">
                {product.materialsUsed?.join(', ') || 'Natural organic raw materials'}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block font-semibold">Dimensions / Size</span>
              <span className="font-bold text-stone-800">{product.dimensions || 'Standard Traditional Size'}</span>
            </div>
          </div>

          {/* Artisan Card */}
          <div className="p-4 bg-amber-100/60 rounded-2xl border border-amber-300/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-terracotta-600 text-white flex items-center justify-center font-bold text-lg shadow">
              {product.artisanName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                {product.artisanName}
                <UserCheck className="w-4 h-4 text-emerald-600" />
              </h4>
              <p className="text-xs text-stone-600">Master Artisan • {product.stateOfOrigin}</p>
            </div>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-amber-300 rounded-xl bg-white p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 font-bold text-stone-700 hover:bg-amber-100 rounded-lg flex items-center justify-center"
              >
                -
              </button>
              <span className="w-10 text-center font-bold text-stone-900 text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 font-bold text-stone-700 hover:bg-amber-100 rounded-lg flex items-center justify-center"
              >
                +
              </button>
            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              className="flex-1 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add {quantity} to Cart</span>
            </button>
          </div>

        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-8 border-t border-amber-200 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-serif text-stone-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-terracotta-600" />
            Customer Reviews ({reviews.length})
          </h2>
        </div>

        {/* Submit Review Form */}
        {user ? (
          <form onSubmit={handleReviewSubmit} className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl space-y-4">
            <h4 className="font-bold text-stone-900 text-sm">Write a Review & Support the Artisan</h4>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-stone-700">Rating:</span>
              <div className="flex items-center gap-1 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-0.5 focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows="3"
              placeholder="Share your feedback on the craft quality, packaging, and artisan work..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-white border border-amber-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              required
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-stone-700 flex items-center justify-between">
            <span>Please login to write a verified customer review.</span>
            <Link to="/login" className="font-bold text-terracotta-600 underline">Login Now</Link>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-stone-500 italic">No reviews yet for this craft listing.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="bg-white border border-amber-200 p-5 rounded-2xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{rev.userName}</span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-stone-700 font-medium">{rev.comment}</p>

                {rev.artisanReply && (
                  <div className="mt-3 p-3 bg-amber-50 rounded-xl border-l-4 border-terracotta-600 text-xs">
                    <span className="font-bold text-terracotta-700 block mb-1">Artisan Response:</span>
                    <p className="text-stone-700 italic">{rev.artisanReply}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
