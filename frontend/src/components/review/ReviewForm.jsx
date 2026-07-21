import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { reviewService } from '../../services/review.service'
import StarRating from './StarRating'
import toast from 'react-hot-toast'

const ReviewForm = ({ productId, existingReview, onSuccess, onCancel }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      comment: existingReview?.comment || '',
    },
  })

  const onSubmit = async (data) => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setIsSubmitting(true)
    try {
      if (existingReview) {
        await reviewService.updateReview(existingReview._id, { rating, comment: data.comment })
        toast.success('Review updated!')
      } else {
        await reviewService.addReview(productId, { rating, comment: data.comment })
        toast.success('Review submitted!')
      }
      onSuccess?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-5 space-y-4">
      <h3 className="font-heading font-semibold text-gray-800">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      {/* Star Rating */}
      <div>
        <p className="form-label">Your Rating *</p>
        <StarRating rating={rating} onRate={setRating} size="lg" showLabel />
      </div>

      {/* Comment */}
      <div className="form-group">
        <label className="form-label" htmlFor="review-comment">Comment *</label>
        <textarea
          id="review-comment"
          rows={4}
          placeholder="Share your experience with this product..."
          className={`form-input resize-none ${errors.comment ? 'border-red-400' : ''}`}
          {...register('comment', {
            required: 'Comment is required',
            minLength: { value: 5,   message: 'Comment must be at least 5 characters' },
            maxLength: { value: 500, message: 'Comment cannot exceed 500 characters' },
          })}
        />
        {errors.comment && <p className="form-error">{errors.comment.message}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-ghost">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default ReviewForm
