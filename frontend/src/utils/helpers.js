// ─────────────────────────────────────────
// Currency Formatting
// ─────────────────────────────────────────
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// ─────────────────────────────────────────
// Date Formatting
// ─────────────────────────────────────────
export const formatDate = (date, options = {}) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(date))
}

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

// ─────────────────────────────────────────
// Text Helpers
// ─────────────────────────────────────────
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// ─────────────────────────────────────────
// Order Status Helpers
// ─────────────────────────────────────────
export const getOrderStatusColor = (status) => {
  const map = {
    pending:   'badge-warning',
    accepted:  'badge-info',
    packed:    'badge-info',
    shipped:   'badge-primary',
    delivered: 'badge-success',
    completed: 'badge-success',
    cancelled: 'badge-danger',
  }
  return map[status] || 'badge-gray'
}

export const getOrderStatusLabel = (status) => {
  const map = {
    pending:   'Pending',
    accepted:  'Accepted',
    packed:    'Packed',
    shipped:   'Shipped',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return map[status] || status
}

// ─────────────────────────────────────────
// Avatar Helpers
// ─────────────────────────────────────────
export const getAvatarUrl = (user) => {
  if (user?.avatar?.url) return user.avatar.url
  // Generate placeholder from name initials
  const name = user?.name || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f59e0b&color=fff&size=128`
}

// ─────────────────────────────────────────
// Calculate cart total
// ─────────────────────────────────────────
export const calcCartTotal = (items = []) => {
  return items.reduce((total, item) => {
    const price = item.product?.price || 0
    return total + price * item.quantity
  }, 0)
}

// ─────────────────────────────────────────
// Extract API error message
// ─────────────────────────────────────────
export const getErrorMessage = (err) => {
  return (
    err?.response?.data?.message ||
    err?.message ||
    'Something went wrong. Please try again.'
  )
}

// ─────────────────────────────────────────
// Validate file size and type
// ─────────────────────────────────────────
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (!allowedTypes.includes(file.type)) {
    return 'Only JPG, PNG, and WebP images are allowed'
  }
  if (file.size > maxSize) {
    return 'File size must be less than 5MB'
  }
  return null
}
