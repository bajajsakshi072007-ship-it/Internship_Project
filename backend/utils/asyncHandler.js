/**
 * Wraps async route handlers to automatically catch errors
 * and pass them to Express error middleware via next()
 * Eliminates repetitive try/catch blocks in controllers
 *
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
