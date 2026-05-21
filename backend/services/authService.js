const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('../utils/appError');

/**
 * Generate Access and Refresh Tokens
 * @param {string} id - User ID
 * @returns {object} { accessToken, refreshToken }
 */
const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });
  return { accessToken, refreshToken };
};

/**
 * Register a new user
 * @param {object} userData - User registration data
 */
const register = async (userData) => {
  const { name, email, password, role, referralCode, ...rest } = userData;
  
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  let referredBy = null;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (referrer) {
      referredBy = referrer._id;
    }
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'customer',
    referredBy,
    walletBalance: referredBy ? 50 : 0,
    ...rest
  });

  const tokens = generateTokens(user._id);
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user, tokens };
};

/**
 * Login user
 * @param {string} email
 * @param {string} password
 */
const login = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const tokens = generateTokens(user._id);
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user, tokens };
};

/**
 * Refresh access token
 * @param {string} incomingRefreshToken
 */
const refresh = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new AppError('Invalid refresh token', 401);
  }

  const tokens = generateTokens(user._id);
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  return tokens;
};

/**
 * Forgot Password - Generate reset token
 * @param {string} email
 */
const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError('User not found with this email', 404);
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  return { user, resetToken };
};

/**
 * Reset Password
 * @param {string} token
 * @param {string} newPassword
 */
const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Token is invalid or has expired', 400);
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  
  const tokens = generateTokens(user._id);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return { user, tokens };
};

module.exports = {
  register,
  login,
  refresh,
  forgotPassword,
  resetPassword,
  generateTokens
};
