import React, { useRef, useState, useCallback } from 'react'
import { PhotoIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

const MAX_IMAGES = 5
const MAX_SIZE_MB = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const ImageUploader = ({
  existingImages = [],
  newImages = [],
  onNewImages,
  onRemoveNew,
  onRemoveExisting,
  onReorderExisting,
  onReorderNew,
}) => {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [previewModalImg, setPreviewModalImg] = useState(null)

  const usedSlots = existingImages.length + newImages.length
  const remaining = MAX_IMAGES - usedSlots

  // File validation
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

  const handleInputChange = (e) => {
    if (e.target.files) validateAndAddFiles(e.target.files)
    e.target.value = ''
  }

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

  // Set selected existing image as primary (move to index 0)
  const setExistingPrimary = (index) => {
    if (index === 0 || !onReorderExisting) return
    const updated = [...existingImages]
    const [selected] = updated.splice(index, 1)
    updated.unshift(selected)
    onReorderExisting(updated)
    toast.success('Primary cover image updated')
  }

  // Set selected new image as primary (move to index 0)
  const setNewPrimary = (index) => {
    if (index === 0 || !onReorderNew) return
    const updated = [...newImages]
    const [selected] = updated.splice(index, 1)
    updated.unshift(selected)
    onReorderNew(updated)
    toast.success('Primary cover image updated')
  }

  const fillPercent = Math.round((usedSlots / MAX_IMAGES) * 100)
  const fillColor =
    fillPercent >= 100 ? 'bg-red-400' : fillPercent >= 80 ? 'bg-amber-400' : 'bg-primary-500'

  return (
    <div id="image-uploader" className="uploader-root space-y-4">
      {/* Header row */}
      <div className="uploader-header flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">
            Product Images & Gallery Preview
            <span className="text-red-500 ml-0.5">*</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            JPG, PNG, WebP · Max {MAX_SIZE_MB} MB each · Up to {MAX_IMAGES} images (First image is primary cover)
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

      {/* Progress bar */}
      <div className="uploader-progress h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`uploader-progress-fill h-full rounded-full transition-all duration-500 ${fillColor}`}
          style={{ width: `${fillPercent}%` }}
        />
      </div>

      {/* Drop zone */}
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
          <div
            className={`uploader-icon mx-auto mb-3 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              isDragging ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            <PhotoIcon className="w-6 h-6" />
          </div>

          {isDragging ? (
            <p className="uploader-drop-hint text-sm font-semibold text-primary-600 animate-pulse">
              Drop images here…
            </p>
          ) : (
            <>
              <p className="uploader-click-hint text-sm font-semibold text-primary-600">
                Click to browse or drag & drop images
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

      {/* Previews Grid / Gallery */}
      {(existingImages.length > 0 || newImages.length > 0) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 px-0.5">
            <span>Gallery Preview (Click ★ to set primary cover photo)</span>
            <span>Hover image to inspect or delete</span>
          </div>

          <div className="uploader-preview-grid grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Existing Cloudinary images */}
            {existingImages.map((img, idx) => (
              <PreviewTile
                key={img.publicId}
                src={img.url}
                isPrimary={idx === 0}
                onRemove={() => onRemoveExisting?.(img.publicId)}
                onSetPrimary={onReorderExisting ? () => setExistingPrimary(idx) : null}
                onInspect={() => setPreviewModalImg(img.url)}
                removeLabel="Delete from cloud"
                badgeColor="bg-amber-500"
              />
            ))}

            {/* New local images */}
            {newImages.map((file, idx) => {
              const isFirst = existingImages.length === 0 && idx === 0
              const objectUrl = URL.createObjectURL(file)
              return (
                <PreviewTile
                  key={`new-${idx}-${file.name}`}
                  src={objectUrl}
                  isPrimary={isFirst}
                  onRemove={() => onRemoveNew?.(idx)}
                  onSetPrimary={onReorderNew ? () => setNewPrimary(idx) : null}
                  onInspect={() => setPreviewModalImg(objectUrl)}
                  removeLabel="Remove"
                  badgeColor="bg-primary-500"
                  isLocal
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state hint */}
      {usedSlots === 0 && (
        <p className="uploader-empty-hint text-center text-xs text-gray-400 italic">
          At least one product image is required before saving your listing.
        </p>
      )}

      {/* Full state hint */}
      {remaining === 0 && (
        <p className="uploader-full-hint text-center text-xs text-amber-600 font-medium">
          ✓ Maximum {MAX_IMAGES} images reached. Remove an image to upload another.
        </p>
      )}

      {/* Lightbox Modal Preview */}
      {previewModalImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewModalImg(null)}
        >
          <div className="relative max-w-3xl w-full bg-white rounded-2xl p-2 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
              aria-label="Close preview"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <img
              src={previewModalImg}
              alt="Full size gallery preview"
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />
            <div className="p-3 text-center text-xs text-gray-500">
              Gallery Image Preview — Rural Artisan Marketplace
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// PreviewTile Card Component
const PreviewTile = ({
  src,
  isPrimary,
  onRemove,
  onSetPrimary,
  onInspect,
  removeLabel = 'Remove',
  badgeColor = 'bg-primary-500',
  isLocal = false,
}) => (
  <div className="uploader-tile relative aspect-square rounded-xl overflow-hidden group bg-gray-100 shadow-sm ring-1 ring-black/5 hover:ring-2 hover:ring-primary-400 transition-all duration-200">
    <img
      src={src}
      alt="Product gallery preview"
      className="uploader-tile-img w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />

    {/* Hover Action Overlay */}
    <div className="uploader-tile-overlay absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-200 p-2">
      {/* Inspect Button */}
      {onInspect && (
        <button
          type="button"
          onClick={onInspect}
          title="Inspect image"
          aria-label="Inspect image"
          className="bg-white/90 text-gray-800 hover:bg-white hover:scale-110 p-2 rounded-full transition-all shadow-md"
        >
          <EyeIcon className="w-4 h-4" />
        </button>
      )}

      {/* Set Primary Cover Button */}
      {!isPrimary && onSetPrimary && (
        <button
          type="button"
          onClick={onSetPrimary}
          title="Set as primary cover"
          aria-label="Set as primary cover"
          className="bg-amber-400 text-gray-900 hover:bg-amber-300 hover:scale-110 p-2 rounded-full transition-all shadow-md font-bold"
        >
          <StarSolid className="w-4 h-4 text-gray-900" />
        </button>
      )}

      {/* Delete / Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        title={removeLabel}
        aria-label={removeLabel}
        className="bg-red-500 text-white hover:bg-red-600 hover:scale-110 p-2 rounded-full transition-all shadow-md"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>

    {/* Primary Cover Badge */}
    {isPrimary && (
      <div
        className={`uploader-primary-badge absolute top-1.5 left-1.5 ${badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md`}
      >
        <StarSolid className="w-3 h-3 text-amber-200" />
        Primary
      </div>
    )}

    {/* Pending Upload Badge */}
    {isLocal && (
      <div className="uploader-local-badge absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
        New
      </div>
    )}
  </div>
)

export default ImageUploader

