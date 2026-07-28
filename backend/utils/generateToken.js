const jwt = require("jsonwebtoken");

/**
 * Generate a signed JWT token for a user
 *
 * @param {Object} payload - Data to encode in the token
 * @param {string} payload.id - User's MongoDB _id
 * @param {string} payload.role - User's role (buyer/seller)
 * @returns {string} Signed JWT token
 */
const generateToken = ({ id, role }) => {
  const secret = process.env.JWT_SECRET || "default_jwt_secret_artisan_marketplace_2026";
  return jwt.sign({ id, role }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
