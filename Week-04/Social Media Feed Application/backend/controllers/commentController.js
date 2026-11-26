const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { isValidObjectId } = require('../utils/validators');

/**
 * @desc    Add a comment to a post
 * @route   POST /api/posts/:id/comments
 * @access  Private
 */
const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const text = (req.body.text || '').trim();

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID.' });
    }

    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required.' });
    }

    const postExists = await Post.exists({ _id: id });
    if (!postExists) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const comment = await Comment.create({
      post: id,
      user: req.user._id,
      text,
    });

    await comment.populate('user', 'fullName username profilePicture');
    const commentsCount = await Comment.countDocuments({ post: id });

    const io = req.app.get('io');
    if (io) {
      io.emit('comment:created', {
        postId: id,
        comment,
        commentsCount,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Comment added.',
      comment,
      commentsCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all comments for a post
 * @route   GET /api/posts/:id/comments
 * @access  Private
 */
const getComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID.' });
    }

    const postExists = await Post.exists({ _id: id });
    if (!postExists) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const comments = await Comment.find({ post: id })
      .sort({ createdAt: 1 })
      .populate('user', 'fullName username profilePicture');

    res.status(200).json({
      success: true,
      comments,
      commentsCount: comments.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete own comment
 * @route   DELETE /api/posts/:id/comments/:commentId
 * @access  Private
 */
const deleteComment = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    if (!isValidObjectId(id) || !isValidObjectId(commentId)) {
      return res.status(400).json({ success: false, message: 'Invalid post or comment ID.' });
    }

    const comment = await Comment.findOne({ _id: commentId, post: id });
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found.' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment.',
      });
    }

    await comment.deleteOne();
    const commentsCount = await Comment.countDocuments({ post: id });

    const io = req.app.get('io');
    if (io) {
      io.emit('comment:deleted', {
        postId: id,
        commentId,
        commentsCount,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted.',
      commentId,
      commentsCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
};

