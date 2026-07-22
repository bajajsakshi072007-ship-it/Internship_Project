const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiResponse");
const User = require("../models/User.model");

/**
 * Protects routes by verifying JWT from Authorization header.
 * Attaches req.user on success.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized. No token provided.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Token has expired. Please login again.");
    }
    throw new ApiError(401, "Invalid token. Please login again.");
  }

  // Fetch user and verify they still exist and are active
  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    throw new ApiError(401, "User associated with this token no longer exists.");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated.");
  }

  req.user = user;
  next();
});

module.exports = { protect };
