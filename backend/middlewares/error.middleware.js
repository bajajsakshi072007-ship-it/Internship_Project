/**
 * Centralized error handling middleware.
 * Maps various error types to consistent JSON responses.
 * In production, suppresses stack traces.
 */
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || null;

  // ─────────────────────────────────────────
  // Mongoose CastError (invalid ObjectId)
  // ─────────────────────────────────────────
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ─────────────────────────────────────────
  // Mongoose Duplicate Key Error (code 11000)
  // ─────────────────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // ─────────────────────────────────────────
  // Mongoose Validation Error
  // ─────────────────────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // ─────────────────────────────────────────
  // JWT Errors
  // ─────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please login again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please login again.";
  }

  // ─────────────────────────────────────────
  // Multer errors
  // ─────────────────────────────────────────
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File too large. Maximum size is 5MB per file.";
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    statusCode = 400;
    message = "Too many files. Maximum 5 images allowed.";
  }

  // ─────────────────────────────────────────
  // Log error in non-production environments
  // ─────────────────────────────────────────
  if (process.env.NODE_ENV !== "production") {
    console.error(`❌ [${req.method}] ${req.path} → ${statusCode}: ${message}`);
    if (err.stack) console.error(err.stack);
  }

  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  // Include stack trace in development only
  if (process.env.NODE_ENV === "development" && err.stack) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
