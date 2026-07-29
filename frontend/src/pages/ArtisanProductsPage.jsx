import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, ExternalLink, Star, Leaf, Image as ImageIcon, Package, Search, X, Filter } from 'lucide-react';
import { api } from '../services/api';

export default function ArtisanProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [actionFeedback, setActionFeedback] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Pottery & Terracotta',
    'Handloom & Textiles',
    'Woodcraft & Carvings',
    'Metalcraft & Dhokra',
    'Folk Art & Paintings',
    'Jewelry & Ornaments',
    'Bamboo & Jute',
    'Other Crafts'
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getMyArtisanProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading artisan products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this craft listing'}"? This action cannot be undone.`)) return;

    setDeletingId(id);
    setActionFeedback('');
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setActionFeedback(`Craft listing "${title || ''}" removed successfully.`);
      setTimeout(() => setActionFeedback(''), 4000);
    } catch (err) {
      alert(err.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      product.title?.toLowerCase().includes(q) ||
      product.description?.toLowerCase().includes(q) ||
      product.category?.toLowerCase().includes(q) ||
      (Array.isArray(product.materialsUsed) && product.materialsUsed.some((m) => m.toLowerCase().includes(q)));

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
        <div className="h-10 w-64 bg-amber-100 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 bg-amber-50 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif">My Craft Listings Catalog</h1>
          <p className="text-xs text-stone-600 font-medium mt-1">
            Add, update, or remove your handmade products available on the marketplace ({products.length} Items)
          </p>
        </div>

        <Link
          to="/artisan/products/new"
          className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Product</span>
        </Link>
      </div>

      {/* Search & Filter Controls */}
      {products.length > 0 && (
        <div className="bg-white border border-amber-200 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search crafts by title, material, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-amber-50/50 border border-amber-300 rounded-xl pl-9 pr-8 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-amber-50/50 border border-amber-300 rounded-xl pl-8 pr-3 py-2.5 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-terracotta-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Active Filter Clear */}
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs font-bold text-terracotta-600 hover:underline whitespace-nowrap cursor-pointer px-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-white border border-amber-200 p-12 rounded-3xl text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-amber-100/80 rounded-2xl flex items-center justify-center mx-auto text-terracotta-600">
            <Package className="w-8 h-8 text-terracotta-600" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No Listings Added Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Create your first digital craft listing with photos and voice description.
          </p>
          <Link
            to="/artisan/products/new"
            className="inline-flex items-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Product Listing</span>
          </Link>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-amber-200 p-10 rounded-3xl text-center space-y-3 shadow-xs">
          <h3 className="text-base font-bold text-stone-900">No Matching Crafts Found</h3>
          <p className="text-xs text-stone-500">
            No products match your search query "{searchQuery}" in "{selectedCategory}".
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="bg-amber-100 hover:bg-amber-200 text-stone-900 font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Clear Search & Category Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-amber-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video overflow-hidden bg-stone-100 border-b border-amber-100">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="bg-stone-900/80 backdrop-blur-md text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    Stock: {product.stock}
                  </span>
                  {product.ecoFriendly && (
                    <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Leaf className="w-3 h-3" />
                      Eco
                    </span>
                  )}
                </div>

                {/* Photo Count */}
                {product.images?.length > 1 && (
                  <span className="absolute bottom-2.5 right-2.5 bg-stone-900/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {product.images.length} Photos
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-extrabold text-terracotta-600 uppercase tracking-wider">{product.category}</span>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating || 4.8}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-stone-900 text-sm line-clamp-2">{product.title}</h3>
                  <span className="text-lg font-black text-stone-900 block mt-2">₹{product.price?.toLocaleString('en-IN')}</span>
                </div>

                {/* Action Bar */}
                <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
                  <Link
                    to={`/products/${product._id}`}
                    target="_blank"
                    className="text-stone-600 hover:text-terracotta-600 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/artisan/products/edit/${product._id}`}
                      className="p-2 text-stone-700 hover:text-terracotta-600 hover:bg-amber-100 rounded-xl transition-colors"
                      title="Edit Craft Listing"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id, product.title)}
                      disabled={deletingId === product._id}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

