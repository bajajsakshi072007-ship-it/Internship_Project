import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline'

// ─────────────────────────────────────────────────────────────────
// ImageGallery
//
// Props:
//   images  – Array<{ url: string, publicId: string }>
//   alt     – string  (product title)
// ─────────────────────────────────────────────────────────────────
const ImageGallery = ({ images = [], alt = 'Product image' }) => {
  const [activeIndex, setActiveIndex]   = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isAnimating, setIsAnimating]   = useState(false)
  const [direction, setDirection]       = useState('next') // 'next' | 'prev'
  const thumbsRef = useRef(null)

  const total = images.length

  // ── Navigation helpers ──────────────────────────────────────────
  const goTo = useCallback(
    (index, dir = 'next') => {
      if (isAnimating || index === activeIndex) return
      setDirection(dir)
      setIsAnimating(true)
      setTimeout(() => {
        setActiveIndex(index)
        setIsAnimating(false)
      }, 200)
    },
    [isAnimating, activeIndex]
  )

  const goPrev = useCallback(() => {
    const prev = (activeIndex - 1 + total) % total
    goTo(prev, 'prev')
  }, [activeIndex, total, goTo])

  const goNext = useCallback(() => {
    const next = (activeIndex + 1) % total
    goTo(next, 'next')
  }, [activeIndex, total, goTo])

  // ── Keyboard navigation ──────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'Escape')     setLightboxOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goPrev, goNext])

  // ── Scroll active thumbnail into view ───────────────────────────
  useEffect(() => {
    if (!thumbsRef.current) return
    const btn = thumbsRef.current.querySelector(`[data-index="${activeIndex}"]`)
    btn?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [activeIndex])

  if (!images || images.length === 0) return null

  const currentImage = images[activeIndex]

  // ── Slide animation class ────────────────────────────────────────
  const slideClass = isAnimating
    ? direction === 'next'
      ? 'opacity-0 translate-x-4'
      : 'opacity-0 -translate-x-4'
    : 'opacity-100 translate-x-0'

  return (
    <>
      {/* ── Main gallery ──────────────────────────────────────────── */}
      <div className="gallery-root space-y-3">
        {/* Active image */}
        <div className="gallery-main-wrap relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group shadow-md">
          <img
            src={currentImage?.url}
            alt={`${alt} — image ${activeIndex + 1}`}
            className={`gallery-main-img w-full h-full object-cover transition-all duration-200 ${slideClass}`}
          />

          {/* Image counter pill */}
          {total > 1 && (
            <div className="gallery-counter absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {activeIndex + 1} / {total}
            </div>
          )}

          {/* Expand button */}
          <button
            id="gallery-expand-btn"
            onClick={() => setLightboxOpen(true)}
            aria-label="View full screen"
            className="gallery-expand-btn absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ArrowsPointingOutIcon className="w-4 h-4" />
          </button>

          {/* Prev / Next arrows */}
          {total > 1 && (
            <>
              <button
                id="gallery-prev-btn"
                onClick={goPrev}
                aria-label="Previous image"
                className="gallery-nav-btn gallery-prev-btn absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                id="gallery-next-btn"
                onClick={goNext}
                aria-label="Next image"
                className="gallery-nav-btn gallery-next-btn absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {total > 1 && (
          <div
            ref={thumbsRef}
            className="gallery-thumbs flex gap-2 overflow-x-auto pb-1 no-scrollbar"
            role="tablist"
            aria-label="Product images"
          >
            {images.map((img, i) => (
              <button
                key={img.publicId || i}
                data-index={i}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Image ${i + 1}`}
                id={`gallery-thumb-${i}`}
                onClick={() => goTo(i, i > activeIndex ? 'next' : 'prev')}
                className={`gallery-thumb flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden ring-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-primary-500 ${
                  i === activeIndex
                    ? 'ring-primary-500 scale-105 shadow-md'
                    : 'ring-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={`${alt} thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Dot indicators (mobile fallback) */}
        {total > 1 && (
          <div className="gallery-dots flex justify-center gap-1.5 sm:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > activeIndex ? 'next' : 'prev')}
                aria-label={`Go to image ${i + 1}`}
                className={`gallery-dot rounded-full transition-all duration-200 ${
                  i === activeIndex
                    ? 'w-4 h-2 bg-primary-500'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox modal ────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          id="gallery-lightbox"
          className="gallery-lightbox fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false) }}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close */}
          <button
            id="gallery-lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
            className="gallery-lightbox-close absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="gallery-lightbox-counter absolute top-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
            {activeIndex + 1} / {total}
          </div>

          {/* Prev */}
          {total > 1 && (
            <button
              id="gallery-lightbox-prev"
              onClick={goPrev}
              aria-label="Previous image"
              className="gallery-lightbox-prev absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
          )}

          {/* Main lightbox image */}
          <img
            src={currentImage?.url}
            alt={`${alt} — full size ${activeIndex + 1}`}
            className={`gallery-lightbox-img max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl transition-all duration-200 ${slideClass}`}
          />

          {/* Next */}
          {total > 1 && (
            <button
              id="gallery-lightbox-next"
              onClick={goNext}
              aria-label="Next image"
              className="gallery-lightbox-next absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          )}

          {/* Thumbnail strip in lightbox */}
          {total > 1 && (
            <div className="gallery-lightbox-thumbs absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[80vw] pb-1 no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={img.publicId || i}
                  onClick={() => goTo(i, i > activeIndex ? 'next' : 'prev')}
                  aria-label={`Image ${i + 1}`}
                  className={`gallery-lightbox-thumb flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden ring-2 transition-all duration-200 hover:scale-110 ${
                    i === activeIndex
                      ? 'ring-primary-400 scale-110'
                      : 'ring-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img.url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default ImageGallery
