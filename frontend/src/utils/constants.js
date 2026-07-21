// Product categories (must match backend)
export const PRODUCT_CATEGORIES = [
  'Pottery',
  'Weaving',
  'Embroidery',
  'Woodcraft',
  'Jewelry',
  'Paintings',
  'Sculpture',
  'Textile',
  'Leather',
  'Bamboo',
  'Stone Craft',
  'Metal Craft',
  'Other',
]

// Sort options for product listing
export const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'oldest',     label: 'Oldest First' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
]

// Order status progression
export const ORDER_STATUS_STEPS = [
  { status: 'pending',   label: 'Order Placed',  icon: '1' },
  { status: 'accepted',  label: 'Accepted',       icon: '2' },
  { status: 'packed',    label: 'Packed',         icon: '3' },
  { status: 'shipped',   label: 'Shipped',        icon: '4' },
  { status: 'delivered', label: 'Delivered',      icon: '5' },
  { status: 'completed', label: 'Completed',      icon: '6' },
]

// Category icon map (using text labels instead of emojis)
export const CATEGORY_ICONS = {
  'Pottery':     'P',
  'Weaving':     'W',
  'Embroidery':  'E',
  'Woodcraft':   'WC',
  'Jewelry':     'J',
  'Paintings':   'PT',
  'Sculpture':   'S',
  'Textile':     'T',
  'Leather':     'L',
  'Bamboo':      'B',
  'Stone Craft': 'SC',
  'Metal Craft': 'MC',
  'Other':       'O',
}

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'cod',    label: 'Cash on Delivery', description: 'Pay when you receive' },
  { value: 'online', label: 'Online Payment',   description: 'UPI / Net Banking (Mock)' },
]

// Roles
export const ROLES = {
  BUYER:  'buyer',
  SELLER: 'seller',
}

// Rating labels
export const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
}
