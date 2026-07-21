const { body } = require("express-validator");

const createReviewValidator = [
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Review comment is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Comment must be between 5 and 500 characters"),
];

const updateReviewValidator = [
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage("Comment must be between 5 and 500 characters"),
];

module.exports = { createReviewValidator, updateReviewValidator };
