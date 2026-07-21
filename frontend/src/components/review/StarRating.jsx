import React from 'react'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'

/**
 * StarRating — displays interactive or static star rating
 *
 * @param {number}   rating      - Current rating value (0-5)
 * @param {Function} onRate      - If provided, stars are clickable
 * @param {string}   size        - 'sm' | 'md' | 'lg'
 * @param {boolean}  showLabel   - Show the numeric rating next to stars
 */
const StarRating = ({ rating = 0, onRate, size = 'md', showLabel = false }) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size] || 'w-5 h-5'

  return (
    <div className="flex items-center gap-0.5" role={onRate ? 'group' : undefined} aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(rating)
        return (
          <button
            key={i}
            type="button"
            onClick={() => onRate?.(i + 1)}
            disabled={!onRate}
            aria-label={`Rate ${i + 1} out of 5`}
            className={`transition-transform ${onRate ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
          >
            {filled
              ? <StarSolid   className={`${sizeClass} text-primary-400`} />
              : <StarOutline className={`${sizeClass} text-gray-300`} />
            }
          </button>
        )
      })}
      {showLabel && (
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating > 0 ? rating.toFixed(1) : 'No rating'}
        </span>
      )}
    </div>
  )
}

export default StarRating
