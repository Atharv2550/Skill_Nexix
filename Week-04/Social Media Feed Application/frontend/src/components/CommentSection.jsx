import { useEffect, useState } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { addComment, deleteComment, fetchComments } from '../services/postService';
import { formatRelativeTime } from '../utils/formatDate';
import Avatar from './Avatar';
import ConfirmModal from './ConfirmModal';

const CommentSection = ({ postId, onCommentsCountChange }) => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadComments = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchComments(postId);
        if (active) {
          setComments(data.comments || []);
          onCommentsCountChange?.(postId, data.commentsCount ?? data.comments?.length ?? 0);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadComments();
    return () => {
      active = false;
    };
  }, [postId]);

  // Real-time comment listeners for this expanded post
  useEffect(() => {
    if (!socket) return;

    const handleCommentCreated = (payload) => {
      if (payload.postId !== postId) return;
      setComments((prev) =>
        prev.some((c) => c._id === payload.comment._id)
          ? prev
          : [...prev, payload.comment]
      );
    };

    const handleCommentDeleted = (payload) => {
      if (payload.postId !== postId) return;
      setComments((prev) => prev.filter((c) => c._id !== payload.commentId));
    };

    socket.on('comment:created', handleCommentCreated);
    socket.on('comment:deleted', handleCommentDeleted);

    return () => {
      socket.off('comment:created', handleCommentCreated);
      socket.off('comment:deleted', handleCommentDeleted);
    };
  }, [socket, postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError('');
    try {
      const data = await addComment(postId, trimmed);
      setComments((prev) =>
        prev.some((c) => c._id === data.comment._id) ? prev : [...prev, data.comment]
      );
      onCommentsCountChange?.(postId, data.commentsCount);
      setText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;
    setDeleting(true);
    try {
      const data = await deleteComment(postId, commentToDelete._id);
      setComments((prev) => prev.filter((c) => c._id !== commentToDelete._id));
      onCommentsCountChange?.(postId, data.commentsCount);
      setCommentToDelete(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mt-4 border-t border-slate-100 pt-4 animate-fade-in">
      {/* Add comment form */}
      <form onSubmit={handleAddComment} className="flex items-center gap-2.5">
        <Avatar src={user?.profilePicture} name={user?.fullName} size="sm" />
        <div className="relative flex-1">
          <input
            type="text"
            maxLength={1000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-4 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            aria-label="Submit comment"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-indigo-600 p-1.5 text-white hover:bg-indigo-700 disabled:opacity-40 transition"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>
      )}

      {/* Comments list */}
      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="space-y-2.5">
            <div className="h-10 rounded-xl bg-slate-100 animate-pulse" />
            <div className="h-10 rounded-xl bg-slate-100 animate-pulse" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-2">
            No comments yet. Start the conversation!
          </p>
        ) : (
          comments.map((comment) => {
            const isOwner = comment.user?._id === user?._id;
            return (
              <div
                key={comment._id}
                className="flex items-start gap-2.5 rounded-xl bg-slate-50/90 px-3.5 py-2.5"
              >
                <Link to={`/profile/${comment.user?._id}`} className="shrink-0 mt-0.5">
                  <Avatar
                    src={comment.user?.profilePicture}
                    name={comment.user?.fullName}
                    size="xs"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Link
                        to={`/profile/${comment.user?._id}`}
                        className="truncate text-xs font-semibold text-slate-900 hover:text-indigo-600"
                      >
                        @{comment.user?.username}
                      </Link>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>

                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => setCommentToDelete(comment)}
                        aria-label="Delete comment"
                        className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="mt-0.5 text-sm text-slate-700 break-words whitespace-pre-wrap">
                    {comment.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(commentToDelete)}
        title="Delete comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCommentToDelete(null)}
      />
    </div>
  );
};

export default CommentSection;

