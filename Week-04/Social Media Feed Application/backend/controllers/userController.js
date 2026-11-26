const User = require('../models/User');
const Post = require('../models/Post');
const { isValidObjectId, isValidUsername, sanitizeUser } = require('../utils/validators');
const { deleteUploadedFile } = require('../utils/fileHelper');
const { enrichPostsWithCommentsCount } = require('../utils/postHelper');

/**
 * @desc    Get user profile by ID with post count
 * @route   GET /api/users/:id
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const postsCount = await Post.countDocuments({ user: user._id });
    const isOwner = req.user._id.toString() === user._id.toString();

    const profileData = {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      bio: user.bio || '',
      profilePicture: user.profilePicture || '',
      postsCount,
      createdAt: user.createdAt,
    };

    if (isOwner) {
      profileData.email = user.email;
    }

    res.status(200).json({
      success: true,
      user: profileData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update logged-in user's profile info and optional profile picture
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      if (req.file) deleteUploadedFile(`/uploads/avatars/${req.file.filename}`);
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { fullName, username, bio } = req.body;

    if (fullName !== undefined) {
      if (fullName.trim().length < 2) {
        if (req.file) deleteUploadedFile(`/uploads/avatars/${req.file.filename}`);
        return res.status(400).json({
          success: false,
          message: 'Full name must be at least 2 characters long.',
        });
      }
      user.fullName = fullName.trim();
    }

    if (username !== undefined) {
      if (!isValidUsername(username)) {
        if (req.file) deleteUploadedFile(`/uploads/avatars/${req.file.filename}`);
        return res.status(400).json({
          success: false,
          message: 'Username must be 3-30 characters and use only letters, numbers, or underscores.',
        });
      }
      const normalizedUsername = username.trim().toLowerCase();
      if (normalizedUsername !== user.username) {
        const duplicate = await User.findOne({
          username: normalizedUsername,
          _id: { $ne: user._id },
        });
        if (duplicate) {
          if (req.file) deleteUploadedFile(`/uploads/avatars/${req.file.filename}`);
          return res.status(409).json({
            success: false,
            message: 'This username is already taken.',
          });
        }
        user.username = normalizedUsername;
      }
    }

    if (bio !== undefined) {
      if (bio.trim().length > 250) {
        if (req.file) deleteUploadedFile(`/uploads/avatars/${req.file.filename}`);
        return res.status(400).json({
          success: false,
          message: 'Bio cannot exceed 250 characters.',
        });
      }
      user.bio = bio.trim();
    }

    if (req.file) {
      const previousAvatar = user.profilePicture;
      user.profilePicture = `/uploads/avatars/${req.file.filename}`;
      if (previousAvatar) {
        deleteUploadedFile(previousAvatar);
      }
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    if (req.file) deleteUploadedFile(`/uploads/avatars/${req.file.filename}`);
    next(error);
  }
};

/**
 * @desc    Get paginated posts by a specific user
 * @route   GET /api/users/:id/posts
 * @access  Private
 */
const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }

    const userExists = await User.exists({ _id: id });
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      Post.find({ user: id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'fullName username profilePicture'),
      Post.countDocuments({ user: id }),
    ]);

    const enrichedPosts = await enrichPostsWithCommentsCount(posts);
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      success: true,
      posts: enrichedPosts,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  getUserPosts,
};

