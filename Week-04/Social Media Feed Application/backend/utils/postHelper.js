const Comment = require('../models/Comment');

/**
 * Attach commentsCount to an array of Mongoose post documents or plain objects
 * using a single aggregation query to avoid N+1 database calls.
 */
const enrichPostsWithCommentsCount = async (posts) => {
  if (!posts || posts.length === 0) return [];

  const postIds = posts.map((post) => post._id);
  const counts = await Comment.aggregate([
    { $match: { post: { $in: postIds } } },
    { $group: { _id: '$post', count: { $sum: 1 } } },
  ]);

  const countMap = new Map(counts.map((item) => [item._id.toString(), item.count]));

  return posts.map((post) => {
    const plain = typeof post.toObject === 'function' ? post.toObject() : { ...post };
    plain.commentsCount = countMap.get(plain._id.toString()) || 0;
    plain.likesCount = Array.isArray(plain.likes) ? plain.likes.length : 0;
    return plain;
  });
};

module.exports = { enrichPostsWithCommentsCount };

