const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Parse a raw Cookie header string into a key-value map.
 */
const parseCookies = (cookieHeader = '') => {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach((part) => {
    const [rawKey, ...rawVal] = part.split('=');
    const key = rawKey ? rawKey.trim() : '';
    if (!key) return;
    cookies[key] = decodeURIComponent(rawVal.join('=').trim());
  });
  return cookies;
};

/**
 * Protect API routes by verifying JWT from HttpOnly cookie or Bearer header.
 */
const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this session no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.',
    });
  }
};

module.exports = { protect, parseCookies };

