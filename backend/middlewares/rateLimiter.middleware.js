const rateLimit = require("express-rate-limit");
const { sendError } = require("../utils/apiResponse");

const rateLimitHandler = (req, res) => {
  sendError(res, 429, "Too many requests. Please try again later.");
};

/**
 * Auth routes limiter: 10 requests per 15 minutes
 * Prevents brute-force attacks on login/register
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many authentication attempts. Please try again in 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * General API limiter: 100 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Upload limiter: 20 uploads per hour
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

module.exports = { authLimiter, generalLimiter, uploadLimiter };
