import React, { useState } from 'react'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { reviewService } from '../../services/review.service'
import { useAuth } from '../../context/AuthContext'
import StarRating from './StarRating'
import ReviewForm from './ReviewForm'
import { getAvatarUrl, timeAgo } from '../../utils/helpers'
import toast from 'react-hot-toast'

const ReviewCard = ({ review, onUpdate }) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const isOwner = user?._id === review.buyer?._id

  const handleDelete = async () => {
    if (!window.confirm('Delete this review?')) return
    try {
      await reviewService.deleteReview(review._id)
      toast.success('Review deleted')
      onUpdate?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete review')
    }
  }

  if (isEditing) {
    return (
      <ReviewForm
        existingReview={review}
        onSuccess={() => { setIsEditing(false); onUpdate?.() }}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div className="card p-4 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={getAvatarUrl(review.buyer)}
            alt={review.buyer?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-900 text-sm">{review.buyer?.name}</p>
            <p className="text-xs text-gray-400">{timeAgo(review.createdAt)}</p>
          </div>
        </div>

        {isOwner && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
              aria-label="Edit review"
            >
              <PencilSquareIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete review"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-3">
        <StarRating rating={review.rating} size="sm" />
        <p className="mt-2 text-sm text-gray-700 leading-relaxed">{review.comment}</p>
      </div>
    </div>
  )
}

export default ReviewCard
