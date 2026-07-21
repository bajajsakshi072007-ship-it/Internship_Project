import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const delta = 2

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i)
    }

    if (currentPage - delta > 2) pages.unshift('...')
    if (currentPage + delta < totalPages - 1) pages.push('...')

    pages.unshift(1)
    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-1.5 text-sm text-gray-400">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
              currentPage === page
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </nav>
  )
}

export default Pagination
