import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { productService } from '../services/product.service'
import { PRODUCT_CATEGORIES } from '../utils/constants'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'

const ProductForm = () => {
  const { id } = useParams()
  const isEditMode = !!id
  const navigate   = useNavigate()
  const [isLoading, setIsLoading]       = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages]           = useState([])

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    if (isEditMode) {
      fetchProductDetails()
    }
  }, [id])

  const fetchProductDetails = async () => {
    setIsLoading(true)
    try {
      const res = await productService.getProductById(id)
      const prod = res.data.data?.product
      if (prod) {
        reset({
          title: prod.title,
          description: prod.description,
          price: prod.price,
          category: prod.category,
          stock: prod.stock,
          tags: prod.tags?.join(', ') || '',
        })
        setExistingImages(prod.images || [])
      }
    } catch {
      toast.error('Failed to load product details')
      navigate('/dashboard/products')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + existingImages.length + newImages.length > 5) {
      toast.error('Maximum of 5 images allowed per product')
      return
    }
    setNewImages((prev) => [...prev, ...files])
  }

  const removeNewImage = (idx) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const removeExistingImage = async (publicId) => {
    try {
      await productService.removeImage(id, publicId)
      setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId))
      toast.success('Image removed successfully')
    } catch (err) {
      toast.error('Failed to remove image')
    }
  }

  const onSubmit = async (data) => {
    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error('At least one product image is required')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('price', data.price)
      formData.append('category', data.category)
      formData.append('stock', data.stock)
      
      const tagArray = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : []
      tagArray.forEach((t) => formData.append('tags', t))

      newImages.forEach((file) => {
        formData.append('images', file)
      })

      if (isEditMode) {
        await productService.updateProduct(id, formData)
        toast.success('Product updated successfully')
      } else {
        await productService.createProduct(formData)
        toast.success('Product created successfully')
      }
      navigate('/dashboard/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-heading font-bold text-gray-900">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-sm text-gray-500">Provide accurate details and images of your handicraft</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-6">
        {/* Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="form-title">Product Title *</label>
          <input
            id="form-title"
            type="text"
            placeholder="e.g. Blue Pottery Vase"
            className={`form-input ${errors.title ? 'border-red-400' : ''}`}
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 3, message: 'Title must be at least 3 characters' }
            })}
          />
          {errors.title && <p className="form-error">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Price */}
          <div className="form-group">
            <label className="form-label" htmlFor="form-price">Price (INR) *</label>
            <input
              id="form-price"
              type="number"
              min="1"
              placeholder="1200"
              className={`form-input ${errors.price ? 'border-red-400' : ''}`}
              {...register('price', {
                required: 'Price is required',
                min: { value: 1, message: 'Price must be greater than 0' }
              })}
            />
            {errors.price && <p className="form-error">{errors.price.message}</p>}
          </div>

          {/* Stock */}
          <div className="form-group">
            <label className="form-label" htmlFor="form-stock">Stock Quantity *</label>
            <input
              id="form-stock"
              type="number"
              min="0"
              placeholder="10"
              className={`form-input ${errors.stock ? 'border-red-400' : ''}`}
              {...register('stock', {
                required: 'Stock is required',
                min: { value: 0, message: 'Stock cannot be negative' }
              })}
            />
            {errors.stock && <p className="form-error">{errors.stock.message}</p>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="form-category">Category *</label>
            <select
              id="form-category"
              className={`form-input ${errors.category ? 'border-red-400' : ''}`}
              {...register('category', { required: 'Category is required' })}
            >
              <option value="">Select Category</option>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="form-error">{errors.category.message}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="form-desc">Product Description *</label>
          <textarea
            id="form-desc"
            rows={5}
            placeholder="Describe the handicraft process, material used, and uniqueness of this product..."
            className={`form-input resize-none ${errors.description ? 'border-red-400' : ''}`}
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 10, message: 'Description must be at least 10 characters' }
            })}
          />
          {errors.description && <p className="form-error">{errors.description.message}</p>}
        </div>

        {/* Tags */}
        <div className="form-group">
          <label className="form-label" htmlFor="form-tags">Tags <span className="text-gray-400">(comma separated)</span></label>
          <input
            id="form-tags"
            type="text"
            placeholder="clay, handmade, pottery, blue"
            className="form-input"
            {...register('tags')}
          />
        </div>

        {/* Image Upload Area */}
        <div className="space-y-4">
          <label className="form-label">Product Images * <span className="text-gray-400">(Max 5 images, up to 5MB each)</span></label>
          
          {/* File Input */}
          <div className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
            <label className="text-center cursor-pointer">
              <span className="text-sm font-semibold text-primary-600 block">Click to upload images</span>
              <span className="text-xs text-gray-500 block mt-1">Supports JPG, PNG, WebP</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Preview grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Existing Images */}
            {existingImages.map((img) => (
              <div key={img.publicId} className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100">
                <img src={img.url} alt="product" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.publicId)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-semibold text-white transition-opacity"
                >
                  Delete
                </button>
              </div>
            ))}

            {/* New Images previews */}
            {newImages.map((file, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100">
                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-semibold text-white transition-opacity"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
          </button>
          <Link to="/dashboard/products" className="btn btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
