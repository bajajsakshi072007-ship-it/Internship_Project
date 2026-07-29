import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Volume2, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audioStory: '',
    price: '',
    category: 'Pottery & Terracotta',
    stateOfOrigin: user?.stateOfOrigin || 'Rajasthan',
    materialsUsed: '',
    dimensions: '',
    weight: '',
    stock: 1,
    ecoFriendly: true
  });

  const categories = [
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
    'Rajasthan',
    'Madhya Pradesh',
    'West Bengal',
    'Gujarat',
    'Bihar',
    'Odisha',
    'Uttar Pradesh',
    'Tamil Nadu',
    'Karnataka',
    'Assam',
    'Kashmir'
  ];

  useEffect(() => {
    if (isEdit) {
      async function loadExistingProduct() {
        setFetching(true);
        setFormError('');
        try {
          const prod = await api.getProductById(id);
          if (prod) {
            setFormData({
              title: prod.title || '',
              description: prod.description || '',
              audioStory: prod.audioStory || '',
              price: prod.price !== undefined ? prod.price : '',
              category: prod.category || 'Pottery & Terracotta',
              stateOfOrigin: prod.stateOfOrigin || 'Rajasthan',
              materialsUsed: Array.isArray(prod.materialsUsed) ? prod.materialsUsed.join(', ') : (prod.materialsUsed || ''),
              dimensions: prod.dimensions || '',
              weight: prod.weight || '',
              stock: prod.stock !== undefined ? prod.stock : 1,
              ecoFriendly: prod.ecoFriendly !== undefined ? prod.ecoFriendly : true
            });
            setImages(prod.images || []);
          }
        } catch (err) {
          console.error('Failed to load product details for editing:', err);
          setFormError('Failed to load existing craft details.');
        } finally {
          setFetching(false);
        }
      }
      loadExistingProduct();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!formData.title.trim()) {
      setFormError('Please enter a product title.');
      return;
    }

    if (images.length === 0) {
      setFormError('Please upload at least 1 craft image for your listing.');
      return;
    }

    if (Number(formData.price) <= 0) {
      setFormError('Price must be greater than zero.');
      return;
    }

    if (Number(formData.stock) < 0) {
      setFormError('Stock quantity cannot be negative.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images,
        materialsUsed: formData.materialsUsed
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      };

      if (isEdit) {
        await api.updateProduct(id, payload);
        setSuccessMsg('Craft listing updated successfully!');
      } else {
        await api.createProduct(payload);
        setSuccessMsg('New craft listing published successfully!');
      }

      setTimeout(() => {
        navigate('/artisan/products');
      }, 1000);
    } catch (err) {
      setFormError(err.message || 'Failed to save craft listing.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-terracotta-600 animate-spin mx-auto" />
        <p className="text-sm font-semibold text-stone-600">Loading craft details for editing...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between pb-4 border-b border-amber-200">
        <button
          onClick={() => navigate(-1)}
          className="text-stone-600 hover:text-terracotta-600 font-bold text-xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="text-2xl font-extrabold text-stone-900 font-serif">
          {isEdit ? 'Edit Craft Listing' : 'Create New Craft Listing'}
        </h1>
      </div>

      {formError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-amber-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
        
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1">
            Product Craft Title <span className="text-terracotta-600">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Handcrafted Terracotta Water Vessel / Chanderi Silk Saree"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-3 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
            required
          />
        </div>

        {/* Category & State of Origin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Craft Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-3 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">State of Origin *</label>
            <select
              value={formData.stateOfOrigin}
              onChange={(e) => setFormData({ ...formData, stateOfOrigin: e.target.value })}
              className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-3 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Price (₹ INR) *</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 650"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-3 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Available Quantity / Stock *</label>
            <input
              type="number"
              min="1"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-3 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              required
            />
          </div>
        </div>

        {/* Multi-Image Cloudinary Uploader */}
        <ImageUploader images={images} setImages={setImages} />

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1">Detailed Description *</label>
          <textarea
            rows="4"
            placeholder="Describe the craft heritage, technique, usage, and cultural backstory..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-3 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
            required
          />
        </div>

        {/* Audio Craft Story (Accessibility Feature) */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-terracotta-600" />
            Audio Story Narrative (Voice Description for Buyers)
          </label>
          <textarea
            rows="2"
            placeholder="Enter the artisan's personal story or voice narrative to be read out loud..."
            value={formData.audioStory}
            onChange={(e) => setFormData({ ...formData, audioStory: e.target.value })}
            className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-3 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <span className="text-[10px] text-stone-500 italic block mt-1">
            Buyers can listen to this narrative in regional Indian languages via Web Speech audio synthesis.
          </span>
        </div>

        {/* Materials & Dimensions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Materials Used (comma separated)</label>
            <input
              type="text"
              placeholder="Natural Clay, Vegetable Dyes, Silk Thread"
              value={formData.materialsUsed}
              onChange={(e) => setFormData({ ...formData, materialsUsed: e.target.value })}
              className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-3 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Dimensions & Size</label>
            <input
              type="text"
              placeholder="e.g. 10 x 8 inches"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              className="w-full bg-amber-50/40 border border-amber-300 rounded-xl p-3 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
        </div>

        {/* Eco Friendly Checkbox */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="eco"
            checked={formData.ecoFriendly}
            onChange={(e) => setFormData({ ...formData, ecoFriendly: e.target.checked })}
            className="w-4 h-4 accent-terracotta-600 cursor-pointer"
          />
          <label htmlFor="eco" className="text-xs font-bold text-stone-800 cursor-pointer">
            Mark as 100% Eco-Friendly & Handmade Craft
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-amber-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-amber-100 text-stone-800 font-bold text-xs px-5 py-3 rounded-xl hover:bg-amber-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs px-7 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Listing...' : isEdit ? 'Update Craft Listing' : 'Publish Craft Listing'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
