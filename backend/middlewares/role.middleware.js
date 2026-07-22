const { ApiError } = require("../utils/apiResponse");
const { USER_ROLES } = require("../utils/constants");

/**
 * Higher-order middleware to restrict access to specified roles.
 * Verifies req.user exists (set by auth.middleware `protect`) and checks if req.user.role is allowed.
 *
 * @param  {...string} allowedRoles - Roles allowed to access the route (e.g. 'buyer', 'seller')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required.");
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. Requires one of the following roles: ${allowedRoles.join(", ")}`
      );
    }

    next();
  };
};

/**
 * Alias for authorize
 */
const restrictTo = authorize;

/**
 * Restrict access to seller role only
 */
const requireSeller = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required.");
  }
  if (req.user.role !== USER_ROLES.SELLER) {
    throw new ApiError(403, "Access denied. Seller role required.");
  }
  next();
};

/**
 * Restrict access to buyer role only
 */
const requireBuyer = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required.");
  }
  if (req.user.role !== USER_ROLES.BUYER) {
    throw new ApiError(403, "Access denied. Buyer role required.");
  }
  next();
};

/**
 * Allow any authenticated user (both buyer and seller)
 */
const requireAnyRole = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required.");
  }
  next();
};

module.exports = {
  authorize,
  restrictTo,
  requireSeller,
  requireBuyer,
  requireAnyRole,
};
