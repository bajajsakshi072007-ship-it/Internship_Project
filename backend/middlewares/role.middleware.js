const { ApiError } = require("../utils/apiResponse");
const { USER_ROLES } = require("../utils/constants");

/**
 * Restrict access to seller role only
 */
const requireSeller = (req, res, next) => {
  if (req.user && req.user.role === USER_ROLES.SELLER) {
    return next();
  }
  throw new ApiError(403, "Access denied. Seller role required.");
};

/**
 * Restrict access to buyer role only
 */
const requireBuyer = (req, res, next) => {
  if (req.user && req.user.role === USER_ROLES.BUYER) {
    return next();
  }
  throw new ApiError(403, "Access denied. Buyer role required.");
};

/**
 * Allow any authenticated user (both buyer and seller)
 * Used where role doesn't matter but auth is required
 */
const requireAnyRole = (req, res, next) => {
  if (req.user) {
    return next();
  }
  throw new ApiError(401, "Authentication required.");
};

module.exports = { requireSeller, requireBuyer, requireAnyRole };
