import React from 'react'

const sizeClasses = {
  sm:  'w-5 h-5 border-2',
  md:  'w-8 h-8 border-2',
  lg:  'w-12 h-12 border-3',
  xl:  'w-16 h-16 border-4',
}

const Spinner = ({ size = 'md', className = '', label = 'Loading...' }) => {
  return (
    <div role="status" aria-label={label} className={`inline-flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          border-primary-200
          border-t-primary-500
          animate-spin
        `}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}

export default Spinner
