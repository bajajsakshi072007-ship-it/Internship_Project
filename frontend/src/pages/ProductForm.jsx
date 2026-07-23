import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { productService } from '../services/product.service'
import { PRODUCT_CATEGORIES } from '../utils/constants'
import Spinner from '../components/common/Spinner'
import ImageUploader from '../components/product/ImageUploader'
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
            aria-invalid={errors.title ? 'true' : 'false'}
            aria-describedby={errors.title ? 'title-error' : undefined}
            className={`form-input ${errors.title ? 'border-red-400 focus:ring-red-400' : ''}`}
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 3, message: 'Title must be at least 3 characters' }
            })}
          />
          {errors.title && <p id="title-error" className="form-error">{errors.title.message}</p>}
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
              aria-invalid={errors.price ? 'true' : 'false'}
              aria-describedby={errors.price ? 'price-error' : undefined}
              className={`form-input ${errors.price ? 'border-red-400 focus:ring-red-400' : ''}`}
              {...register('price', {
                required: 'Price is required',
                min: { value: 1, message: 'Price must be greater than 0' }
              })}
            />
            {errors.price && <p id="price-error" className="form-error">{errors.price.message}</p>}
          </div>

          {/* Stock */}
          <div className="form-group">
            <label className="form-label" htmlFor="form-stock">Stock Quantity *</label>
            <input
              id="form-stock"
              type="number"
              min="0"
              placeholder="10"
              aria-invalid={errors.stock ? 'true' : 'false'}
              aria-describedby={errors.stock ? 'stock-error' : undefined}
              className={`form-input ${errors.stock ? 'border-red-400 focus:ring-red-400' : ''}`}
              {...register('stock', {
                required: 'Stock is required',
                min: { value: 0, message: 'Stock cannot be negative' }
              })}
            />
            {errors.stock && <p id="stock-error" className="form-error">{errors.stock.message}</p>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="form-category">Category *</label>
            <select
              id="form-category"
              aria-invalid={errors.category ? 'true' : 'false'}
              aria-describedby={errors.category ? 'category-error' : undefined}
              className={`form-input ${errors.category ? 'border-red-400 focus:ring-red-400' : ''}`}
              {...register('category', { required: 'Category is required' })}
            >
              <option value="">Select Category</option>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p id="category-error" className="form-error">{errors.category.message}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="form-desc">Product Description *</label>
          <textarea
            id="form-desc"
            rows={5}
            placeholder="Describe the handicraft process, material used, and uniqueness of this product..."
            aria-invalid={errors.description ? 'true' : 'false'}
            aria-describedby={errors.description ? 'desc-error' : undefined}
            className={`form-input resize-none ${errors.description ? 'border-red-400 focus:ring-red-400' : ''}`}
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 10, message: 'Description must be at least 10 characters' }
            })}
          />
          {errors.description && <p id="desc-error" className="form-error">{errors.description.message}</p>}
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
        <ImageUploader
          existingImages={existingImages}
          newImages={newImages}
          onNewImages={(files) => setNewImages((prev) => [...prev, ...files])}
          onRemoveNew={removeNewImage}
          onRemoveExisting={removeExistingImage}
        />

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
