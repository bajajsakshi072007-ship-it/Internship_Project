import React from 'react'
import { Link } from 'react-router-dom'

const EmptyState = ({
  icon = null,
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  actionTo,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      {icon && <div className="text-xl font-bold uppercase tracking-wider text-gray-400 mb-4">{icon}</div>}
      <h3 className="text-xl font-heading font-semibold text-gray-800 mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-sm mb-6">{description}</p>}
      {actionLabel && (
        actionTo ? (
          <Link to={actionTo} className="btn btn-primary">
            {actionLabel}
          </Link>
        ) : (
          <button onClick={onAction} className="btn btn-primary">
            {actionLabel}
          </button>
        )
      )}
    </div>
  )
}

export default EmptyState
