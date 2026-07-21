// ─────────────────────────────────────────
// User Roles
// ─────────────────────────────────────────
const USER_ROLES = {
  BUYER: "buyer",
  SELLER: "seller",
};

// ─────────────────────────────────────────
// Order Status Flow
// ─────────────────────────────────────────
const ORDER_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  PACKED: "packed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Valid transitions for order status
const ORDER_STATUS_TRANSITIONS = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.ACCEPTED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.ACCEPTED]: [ORDER_STATUS.PACKED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PACKED]: [ORDER_STATUS.SHIPPED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.COMPLETED],
  [ORDER_STATUS.COMPLETED]: [],
  [ORDER_STATUS.CANCELLED]: [],
};

// ─────────────────────────────────────────
// Payment Status
// ─────────────────────────────────────────
const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
};

// ─────────────────────────────────────────
// Product Categories
// ─────────────────────────────────────────
const PRODUCT_CATEGORIES = [
  "Pottery",
  "Weaving",
  "Embroidery",
  "Woodcraft",
  "Jewelry",
  "Paintings",
  "Sculpture",
  "Textile",
  "Leather",
  "Bamboo",
  "Stone Craft",
  "Metal Craft",
  "Other",
];

// ─────────────────────────────────────────
// Pagination Defaults
// ─────────────────────────────────────────
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
};

// ─────────────────────────────────────────
// Cloudinary Folders
// ─────────────────────────────────────────
const CLOUDINARY_FOLDERS = {
  PRODUCTS: "artisan_marketplace/products",
  AVATARS: "artisan_marketplace/avatars",
};

// ─────────────────────────────────────────
// JWT
// ─────────────────────────────────────────
const JWT = {
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

// ─────────────────────────────────────────
// HTTP Status Codes
// ─────────────────────────────────────────
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
  USER_ROLES,
  ORDER_STATUS,
  ORDER_STATUS_TRANSITIONS,
  PAYMENT_STATUS,
  PRODUCT_CATEGORIES,
  PAGINATION,
  CLOUDINARY_FOLDERS,
  JWT,
  HTTP_STATUS,
};
