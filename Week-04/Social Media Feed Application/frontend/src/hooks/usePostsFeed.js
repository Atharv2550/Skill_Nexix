import { useCallback, useEffect, useState } from 'react';
import { useSocket } from './useSocket';

/**
 * Reusable hook to manage paginated posts and real-time Socket.IO updates
 * for both the Home Feed and User Profile feeds.
 */
export const usePostsFeed = (fetcher, { filterAuthorId = null, limit = 10 } = {}) => {
  const { socket } = useSocket();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const loadPosts = useCallback(
    async (pageNum = 1, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError('');

      try {
        const data = await fetcher(pageNum, limit);
        const fetchedPosts = data.posts || [];

        setPosts((prev) => {
          if (!append) return fetchedPosts;
          const existingIds = new Set(prev.map((p) => p._id));
          const uniqueNew = fetchedPosts.filter((p) => !existingIds.has(p._id));
          return [...prev, ...uniqueNew];
        });

        setPage(data.pagination?.page || pageNum);
        setHasMore(Boolean(data.pagination?.hasMore));
        setTotalPosts(data.pagination?.totalPosts ?? fetchedPosts.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [fetcher, limit]
  );

  useEffect(() => {
    loadPosts(1, false);
  }, [loadPosts]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadPosts(page + 1, true);
    }
  }, [loadPosts, loadingMore, hasMore, page]);

  const prependPost = useCallback(
    (newPost) => {
      if (!newPost) return;
      if (filterAuthorId && newPost.user?._id !== filterAuthorId) return;
      setPosts((prev) => {
        if (prev.some((p) => p._id === newPost._id)) return prev;
        setTotalPosts((count) => count + 1);
        return [newPost, ...prev];
      });
    },
    [filterAuthorId]
  );

  const updatePostInState = useCallback((updatedPost) => {
    if (!updatedPost) return;
    setPosts((prev) =>
      prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  }, []);

  const removePostFromState = useCallback((postId) => {
    setPosts((prev) => {
      const exists = prev.some((p) => p._id === postId);
      if (exists) setTotalPosts((count) => Math.max(0, count - 1));
      return prev.filter((post) => post._id !== postId);
    });
  }, []);

  const updateLikesInState = useCallback(({ postId, likes, likesCount }) => {
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId ? { ...post, likes, likesCount } : post
      )
    );
  }, []);

  const updateCommentsCountInState = useCallback((postId, commentsCount) => {
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId ? { ...post, commentsCount } : post
      )
    );
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onPostCreated = (post) => prependPost(post);
    const onPostUpdated = (post) => updatePostInState(post);
    const onPostDeleted = ({ postId }) => removePostFromState(postId);
    const onPostLiked = (payload) => updateLikesInState(payload);
    const onCommentCreated = ({ postId, commentsCount }) =>
      updateCommentsCountInState(postId, commentsCount);
    const onCommentDeleted = ({ postId, commentsCount }) =>
      updateCommentsCountInState(postId, commentsCount);

    socket.on('post:created', onPostCreated);
    socket.on('post:updated', onPostUpdated);
    socket.on('post:deleted', onPostDeleted);
    socket.on('post:liked', onPostLiked);
    socket.on('comment:created', onCommentCreated);
    socket.on('comment:deleted', onCommentDeleted);

    return () => {
      socket.off('post:created', onPostCreated);
      socket.off('post:updated', onPostUpdated);
      socket.off('post:deleted', onPostDeleted);
      socket.off('post:liked', onPostLiked);
      socket.off('comment:created', onCommentCreated);
      socket.off('comment:deleted', onCommentDeleted);
    };
  }, [
    socket,
    prependPost,
    updatePostInState,
    removePostFromState,
    updateLikesInState,
    updateCommentsCountInState,
  ]);

  return {
    posts,
    totalPosts,
    loading,
    loadingMore,
    error,
    hasMore,
    refresh: () => loadPosts(1, false),
    loadMore,
    prependPost,
    updatePostInState,
    removePostFromState,
    updateLikesInState,
    updateCommentsCountInState,
  };
};

