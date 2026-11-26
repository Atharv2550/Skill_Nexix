const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(String(email || '').trim());

const isValidUsername = (username) => /^[a-zA-Z0-9_]{3,30}$/.test(String(username || '').trim());

/**
 * Format user document for safe API responses (never includes password).
 */
const sanitizeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  username: user.username,
  email: user.email,
  bio: user.bio || '',
  profilePicture: user.profilePicture || '',
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

module.exports = {
  isValidObjectId,
  isValidEmail,
  isValidUsername,
  sanitizeUser,
};

