import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, RotateCcw, Compass, MapPin, Tag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function ProductsPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedState, setSelectedState] = useState(searchParams.get('stateOfOrigin') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('newest');

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

  const states = [
    'All',
    'Rajasthan',
    'Madhya Pradesh',
    'West Bengal',
    'Gujarat',
    'Bihar',
    'Odisha',
    'Uttar Pradesh',
    'Tamil Nadu',
    'Karnataka'
  ];

  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategory, selectedState, searchQuery, maxPrice, sortBy]);

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedState !== 'All') params.stateOfOrigin = selectedState;
      if (searchQuery) params.search = searchQuery;
      if (maxPrice) params.maxPrice = maxPrice;

      const data = await api.getProducts(params);

      // Client-side sorting
      let sorted = [...data];
      if (sortBy === 'price-low') {
        sorted.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        sorted.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      setProducts(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedState('All');
    setSearchQuery('');
    setMaxPrice(5000);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-200">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 font-serif">Handicraft Marketplace</h1>
          <p className="text-xs text-stone-600 font-medium mt-1">
            Discover authentic handmade crafts created by rural artisans across India
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-stone-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 outline-none focus:ring-2 focus:ring-amber-200"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Grid Layout: Sidebar Filters + Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-terracotta-600" />
                Filter Crafts
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-terracotta-600 hover:underline font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Search Filter */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-2">Search Keyword</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Terracotta pot, Saree..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-amber-50/50 border border-amber-200 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-2">Craft Category</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-terracotta-600 text-white shadow-xs'
                        : 'text-stone-700 hover:bg-amber-100/60'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* State of Origin Filter */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-2">State of Origin</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-2 text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-amber-300 outline-none"
              >
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-stone-800">Max Price</label>
                <span className="text-xs font-bold text-terracotta-600">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="300"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-terracotta-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 shimmer-loading rounded-2xl"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-amber-200 rounded-2xl p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-700">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">No Handicrafts Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No products match your active search filters. Try resetting your filter options or searching for a different craft item.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-terracotta-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
