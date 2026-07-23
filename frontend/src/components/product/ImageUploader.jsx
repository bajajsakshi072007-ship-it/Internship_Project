import React, { useRef, useState, useCallback } from 'react'
import { PhotoIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────
const MAX_IMAGES    = 5
const MAX_SIZE_MB   = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const ALLOWED_TYPES  = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// ─────────────────────────────────────────────────────────────────
// ImageUploader
//
// Props:
//   existingImages   – Array<{ url, publicId }>   (images already on Cloudinary)
//   newImages        – Array<File>                 (newly selected local files)
//   onNewImages      – (files: File[]) => void
//   onRemoveNew      – (index: number) => void
//   onRemoveExisting – (publicId: string) => void  (triggers API delete)
// ─────────────────────────────────────────────────────────────────
const ImageUploader = ({
  existingImages   = [],
  newImages        = [],
  onNewImages,
  onRemoveNew,
  onRemoveExisting,
}) => {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const usedSlots = existingImages.length + newImages.length
  const remaining = MAX_IMAGES - usedSlots

  // ── File validation ──────────────────────────────────────────────
  const validateAndAddFiles = useCallback(
    (rawFiles) => {
      const files = Array.from(rawFiles)
      const valid = []

      for (const file of files) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(`"${file.name}" is not a supported image type (JPG, PNG, WebP only)`)
          continue
        }
        if (file.size > MAX_SIZE_BYTES) {
          toast.error(`"${file.name}" exceeds the 5 MB size limit`)
          continue
        }
        valid.push(file)
      }

      if (valid.length + usedSlots > MAX_IMAGES) {
        const canAdd = MAX_IMAGES - usedSlots
        toast.error(`You can only add ${canAdd} more image${canAdd !== 1 ? 's' : ''} (max ${MAX_IMAGES})`)
        onNewImages?.(valid.slice(0, canAdd))
        return
      }

      if (valid.length > 0) onNewImages?.(valid)
    },
    [usedSlots, onNewImages]
  )

  // ── Input change handler ─────────────────────────────────────────
  const handleInputChange = (e) => {
    if (e.target.files) validateAndAddFiles(e.target.files)
    // reset so the same file can be re-selected
    e.target.value = ''
  }

  // ── Drag & Drop ──────────────────────────────────────────────────
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`)
      return
    }
    validateAndAddFiles(e.dataTransfer.files)
  }

  // ── Progress bar fill ────────────────────────────────────────────
  const fillPercent = Math.round((usedSlots / MAX_IMAGES) * 100)
  const fillColor =
    fillPercent >= 100
      ? 'bg-red-400'
      : fillPercent >= 80
      ? 'bg-amber-400'
      : 'bg-primary-500'

  return (
    <div id="image-uploader" className="uploader-root space-y-4">
      {/* ── Header row ────────────────────────────────────────────── */}
      <div className="uploader-header flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">
            Product Images
            <span className="text-red-500 ml-0.5">*</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            JPG, PNG, WebP · Max {MAX_SIZE_MB} MB each · Up to {MAX_IMAGES} images
          </p>
        </div>

        {/* Slot counter badge */}
        <span
          className={`uploader-slot-badge text-xs font-bold px-2.5 py-1 rounded-full ${
            usedSlots >= MAX_IMAGES
              ? 'bg-red-100 text-red-600'
              : usedSlots > 0
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {usedSlots} / {MAX_IMAGES} images
        </span>
      </div>

      {/* ── Progress bar ──────────────────────────────────────────── */}
      <div className="uploader-progress h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`uploader-progress-fill h-full rounded-full transition-all duration-500 ${fillColor}`}
          style={{ width: `${fillPercent}%` }}
        />
      </div>

      {/* ── Drop zone ─────────────────────────────────────────────── */}
      {remaining > 0 && (
        <div
          id="uploader-dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          aria-label="Upload product images"
          className={`uploader-dropzone cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
            isDragging
              ? 'border-primary-500 bg-primary-50 scale-[1.01] shadow-md'
              : 'border-gray-200 bg-gray-50/60 hover:border-primary-400 hover:bg-primary-50/40 hover:shadow-sm'
          }`}
        >
          {/* Icon */}
          <div className={`uploader-icon mx-auto mb-3 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
            isDragging ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            <PhotoIcon className="w-6 h-6" />
          </div>

          {isDragging ? (
            <p className="uploader-drop-hint text-sm font-semibold text-primary-600 animate-pulse">
              Drop images here…
            </p>
          ) : (
            <>
              <p className="uploader-click-hint text-sm font-semibold text-primary-600">
                Click to browse or drag & drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {remaining} slot{remaining !== 1 ? 's' : ''} remaining
              </p>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleInputChange}
            className="hidden"
            id="uploader-file-input"
          />
        </div>
      )}

      {/* ── Previews grid ─────────────────────────────────────────── */}
      {(existingImages.length > 0 || newImages.length > 0) && (
        <div className="uploader-preview-grid grid grid-cols-3 sm:grid-cols-5 gap-3">
          {/* Existing (Cloudinary) images */}
          {existingImages.map((img, idx) => (
            <PreviewTile
              key={img.publicId}
              src={img.url}
              label={idx === 0 ? 'Primary' : null}
              isPrimary={idx === 0}
              onRemove={() => onRemoveExisting?.(img.publicId)}
              removeLabel="Delete from cloud"
              badgeColor="bg-amber-500"
            />
          ))}

          {/* New (local file) images */}
          {newImages.map((file, idx) => {
            const isFirst = existingImages.length === 0 && idx === 0
            return (
              <PreviewTile
                key={`new-${idx}-${file.name}`}
                src={URL.createObjectURL(file)}
                label={isFirst ? 'Primary' : null}
                isPrimary={isFirst}
                onRemove={() => onRemoveNew?.(idx)}
                removeLabel="Remove"
                badgeColor="bg-primary-500"
                isLocal
              />
            )
          })}
        </div>
      )}

      {/* ── Empty state hint ──────────────────────────────────────── */}
      {usedSlots === 0 && (
        <p className="uploader-empty-hint text-center text-xs text-gray-400 italic">
          At least one image is required before publishing your product.
        </p>
      )}

      {/* ── Full state hint ───────────────────────────────────────── */}
      {remaining === 0 && (
        <p className="uploader-full-hint text-center text-xs text-amber-600 font-medium">
          ✓ Maximum {MAX_IMAGES} images reached. Remove one to add another.
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// PreviewTile — individual image thumbnail card
// ─────────────────────────────────────────────────────────────────
const PreviewTile = ({
  src,
  label,
  isPrimary,
  onRemove,
  removeLabel = 'Remove',
  badgeColor = 'bg-primary-500',
  isLocal = false,
}) => (
  <div className="uploader-tile relative aspect-square rounded-xl overflow-hidden group bg-gray-100 shadow-sm ring-1 ring-black/5 hover:ring-2 hover:ring-primary-300 transition-all duration-200">
    <img
      src={src}
      alt="Product preview"
      className="uploader-tile-img w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />

    {/* Overlay with remove button */}
    <div className="uploader-tile-overlay absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-200">
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className="uploader-tile-remove bg-white text-gray-800 hover:bg-red-500 hover:text-white p-1.5 rounded-full transition-colors shadow-md"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
      <span className="text-white text-[10px] font-medium">{removeLabel}</span>
    </div>

    {/* Primary badge */}
    {isPrimary && (
      <div className={`uploader-primary-badge absolute top-1.5 left-1.5 ${badgeColor} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow`}>
        <StarSolid className="w-2.5 h-2.5" />
        Primary
      </div>
    )}

    {/* Local (pending upload) indicator */}
    {isLocal && (
      <div className="uploader-local-badge absolute bottom-1.5 right-1.5 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded-full">
        New
      </div>
    )}
  </div>
)

export default ImageUploader
