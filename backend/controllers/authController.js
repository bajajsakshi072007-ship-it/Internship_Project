const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const mongoose = require('mongoose');

const generateToken = (id, role, name, email) => {
  return jwt.sign(
    { id, role, name, email },
    process.env.JWT_SECRET || 'artisan_secret_key_2026',
    { expiresIn: '30d' }
  );
};

// In-memory mock storage fallback if MongoDB is not connected
const memoryUsers = [];

const isDBConnected = () => mongoose.connection.readyState === 1;

// @desc    Register a new user (Buyer or Artisan)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, craftSpecialty, stateOfOrigin, district, village, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    if (isDBConnected()) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'buyer',
        phone: phone || '',
        craftSpecialty: craftSpecialty || '',
        stateOfOrigin: stateOfOrigin || 'Rajasthan',
        district: district || '',
        village: village || '',
        bio: bio || ''
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        craftSpecialty: user.craftSpecialty,
        stateOfOrigin: user.stateOfOrigin,
        bio: user.bio,
        token: generateToken(user._id, user.role, user.name, user.email)
      });
    } else {
      // Memory fallback
      const exists = memoryUsers.find(u => u.email === email.toLowerCase());
      if (exists) return res.status(400).json({ message: 'User already exists (mock mode)' });

      const mockId = 'mock_user_' + Date.now();
      const newUser = {
        _id: mockId,
        name,
        email: email.toLowerCase(),
        role: role || 'buyer',
        phone,
        craftSpecialty,
        stateOfOrigin: stateOfOrigin || 'Rajasthan',
        bio
      };
      memoryUsers.push(newUser);

      return res.status(201).json({
        ...newUser,
        token: generateToken(mockId, newUser.role, newUser.name, newUser.email)
      });
    }
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server registration error', error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || !email.trim() || !password.trim()) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (isDBConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          craftSpecialty: user.craftSpecialty,
          stateOfOrigin: user.stateOfOrigin,
          district: user.district,
          village: user.village,
          bio: user.bio,
          avatar: user.avatar,
          rating: user.rating,
          token: generateToken(user._id, user.role, user.name, user.email)
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      // Mock login check for demonstration / offline database fallback
      const user = memoryUsers.find(u => u.email === normalizedEmail);
      if (user || password === 'password123') {
        const mockUser = user || {
          _id: 'mock_artisan_1',
          name: normalizedEmail.includes('artisan') ? 'Sunita Devi' : 'Ananya Roy',
          email: normalizedEmail,
          role: normalizedEmail.includes('artisan') ? 'artisan' : 'buyer',
          craftSpecialty: 'Terracotta Pottery',
          stateOfOrigin: 'Rajasthan',
          bio: 'Master artisan creating terracotta pottery for 15+ years.'
        };
        return res.json({
          ...mockUser,
          token: generateToken(mockUser._id, mockUser.role, mockUser.name, mockUser.email)
        });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server login error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  if (isDBConnected()) {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    res.json(req.user);
  }
};

// @desc    Forgot Password - Generate Reset Token
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    // Generate random unhashed token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token to store in database (SHA-256)
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expireTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration

    if (isDBConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        // Return generic success to prevent user enumeration
        return res.json({
          success: true,
          message: 'If an account with that email exists, password reset instructions have been sent.'
        });
      }

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = expireTime;
      await user.save();

      return res.json({
        success: true,
        message: 'Password reset link generated successfully.',
        resetToken: resetToken
      });
    } else {
      // Memory fallback for mock mode
      const user = memoryUsers.find(u => u.email === normalizedEmail);
      if (user) {
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = expireTime;
      }
      return res.json({
        success: true,
        message: 'Password reset link generated (mock mode).',
        resetToken: resetToken
      });
    }
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Server error processing password reset request', error: error.message });
  }
};

// @desc    Reset Password with Token
// @route   PUT /api/auth/reset-password/:resetToken
const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash the token provided in the URL to compare with the DB hash
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    if (isDBConnected()) {
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired password reset token' });
      }

      // Hash new password using bcrypt
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Clear reset token fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return res.json({
        success: true,
        message: 'Password reset successful. You can now log in with your new password.'
      });
    } else {
      // Mock fallback
      const user = memoryUsers.find(u => u.resetPasswordToken === resetPasswordToken);
      if (user) {
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
      }
      return res.json({
        success: true,
        message: 'Password reset successful (mock mode).'
      });
    }
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Server error during password reset', error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, forgotPassword, resetPassword };
