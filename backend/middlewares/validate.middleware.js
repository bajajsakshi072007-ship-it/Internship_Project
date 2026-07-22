const { validationResult } = require("express-validator");
const { sendError } = require("../utils/apiResponse");

/**
 * Middleware to run after express-validator chains.
 * Collects all validation errors and returns a 422 response.
 * Place after all validator chains in a route array.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return sendError(res, 422, "Validation failed", formatted);
  }

  next();
};

module.exports = validate;
