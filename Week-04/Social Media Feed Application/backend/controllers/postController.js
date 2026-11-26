const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { isValidObjectId } = require('../utils/validators');
const { deleteUploadedFile } = require('../utils/fileHelper');
const { enrichPostsWithCommentsCount } = require('../utils/postHelper');

/**
 * @desc    Create a new post (text and/or image)
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = async (req, res, next) => {
  try {
    const content = (req.body.content || '').trim();
    const imagePath = req.file ? `/uploads/posts/${req.file.filename}` : '';

    if (!content && !imagePath) {
      return res.status(400).json({
        success: false,
        message: 'Post must include text content or an image.',
      });
    }

    const post = await Post.create({
      user: req.user._id,
      content,
      image: imagePath,
    });

    await post.populate('user', 'fullName username profilePicture');
    const [enrichedPost] = await enrichPostsWithCommentsCount([post]);

    const io = req.app.get('io');
    if (io) {
      io.emit('post:created', enrichedPost);
    }

    res.status(201).json({
      success: true,
      message: 'Post published successfully.',
      post: enrichedPost,
    });
  } catch (error) {
    if (req.file) deleteUploadedFile(`/uploads/posts/${req.file.filename}`);
    next(error);
  }
};

/**
 * @desc    Get paginated home feed posts in reverse chronological order
 * @route   GET /api/posts
 * @access  Private
 */
const getPosts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'fullName username profilePicture'),
      Post.countDocuments(),
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

/**
 * @desc    Get a single post by ID
 * @route   GET /api/posts/:id
 * @access  Private
 */
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID.' });
    }

    const post = await Post.findById(id).populate('user', 'fullName username profilePicture');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const [enrichedPost] = await enrichPostsWithCommentsCount([post]);

    res.status(200).json({
      success: true,
      post: enrichedPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update own post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      if (req.file) deleteUploadedFile(`/uploads/posts/${req.file.filename}`);
      return res.status(400).json({ success: false, message: 'Invalid post ID.' });
    }

    const post = await Post.findById(id);
    if (!post) {
      if (req.file) deleteUploadedFile(`/uploads/posts/${req.file.filename}`);
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      if (req.file) deleteUploadedFile(`/uploads/posts/${req.file.filename}`);
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this post.',
      });
    }

    const nextContent =
      req.body.content !== undefined ? req.body.content.trim() : post.content;
    const removeImage = req.body.removeImage === 'true' || req.body.removeImage === true;

    let nextImage = post.image;
    let fileToDelete = null;

    if (req.file) {
      fileToDelete = post.image;
      nextImage = `/uploads/posts/${req.file.filename}`;
    } else if (removeImage && post.image) {
      fileToDelete = post.image;
      nextImage = '';
    }

    if (!nextContent && !nextImage) {
      if (req.file) deleteUploadedFile(`/uploads/posts/${req.file.filename}`);
      return res.status(400).json({
        success: false,
        message: 'Post must have either text content or an image.',
      });
    }

    post.content = nextContent;
    post.image = nextImage;
    await post.save();

    if (fileToDelete) {
      deleteUploadedFile(fileToDelete);
    }

    await post.populate('user', 'fullName username profilePicture');
    const [enrichedPost] = await enrichPostsWithCommentsCount([post]);

    const io = req.app.get('io');
    if (io) {
      io.emit('post:updated', enrichedPost);
    }

    res.status(200).json({
      success: true,
      message: 'Post updated successfully.',
      post: enrichedPost,
    });
  } catch (error) {
    if (req.file) deleteUploadedFile(`/uploads/posts/${req.file.filename}`);
    next(error);
  }
};

/**
 * @desc    Delete own post and its comments
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID.' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post.',
      });
    }

    await Comment.deleteMany({ post: post._id });
    if (post.image) {
      deleteUploadedFile(post.image);
    }
    await post.deleteOne();

    const io = req.app.get('io');
    if (io) {
      io.emit('post:deleted', { postId: id });
    }

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully.',
      postId: id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Like a post (atomic $addToSet prevents duplicate likes)
 * @route   POST /api/posts/:id/like
 * @access  Private
 */
const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID.' });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const payload = {
      postId: post._id.toString(),
      likes: post.likes,
      likesCount: post.likes.length,
      userId: req.user._id.toString(),
    };

    const io = req.app.get('io');
    if (io) {
      io.emit('post:liked', payload);
    }

    res.status(200).json({
      success: true,
      ...payload,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unlike a post (atomic $pull)
 * @route   DELETE /api/posts/:id/like
 * @access  Private
 */
const unlikePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID.' });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const payload = {
      postId: post._id.toString(),
      likes: post.likes,
      likesCount: post.likes.length,
      userId: req.user._id.toString(),
    };

    const io = req.app.get('io');
    if (io) {
      io.emit('post:liked', payload);
    }

    res.status(200).json({
      success: true,
      ...payload,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
};

