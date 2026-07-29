const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'artisan_secret_key_2026');

      if (mongooseIsConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = decoded; // fallback for mock
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const isArtisan = (req, res, next) => {
  if (req.user && (req.user.role === 'artisan' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Artisan role required' });
  }
};

function mongooseIsConnected() {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
}

module.exports = { protect, isArtisan };
