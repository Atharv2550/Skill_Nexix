import { useState } from 'react';
import { Heart, MessageCircle, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { deletePost, likePost, unlikePost } from '../services/postService';
import { formatFullDate, formatRelativeTime } from '../utils/formatDate';
import { getMediaUrl } from '../utils/mediaUrl';
import Avatar from './Avatar';
import CommentSection from './CommentSection';
import ConfirmModal from './ConfirmModal';
import EditPostModal from './EditPostModal';

const PostCard = ({
  post,
  onPostUpdated,
  onPostDeleted,
  onPostLiked,
  onCommentsCountChange,
}) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [actionError, setActionError] = useState('');

  const author = post.user || {};
  const isOwner = author._id === user?._id;
  const likes = Array.isArray(post.likes) ? post.likes : [];
  const isLiked = likes.some((id) => id === user?._id || id?._id === user?._id);
  const likesCount = post.likesCount ?? likes.length;
  const commentsCount = post.commentsCount ?? 0;

  const isEdited =
    post.updatedAt &&
    post.createdAt &&
    new Date(post.updatedAt).getTime() - new Date(post.createdAt).getTime() > 2000;

  const handleToggleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    setActionError('');

    try {
      const data = isLiked ? await unlikePost(post._id) : await likePost(post._id);
      onPostLiked?.({
        postId: post._id,
        likes: data.likes,
        likesCount: data.likesCount,
      });
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsLiking(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setActionError('');
    try {
      await deletePost(post._id);
      setIsConfirmingDelete(false);
      onPostDeleted?.(post._id);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link to={`/profile/${author._id}`} className="shrink-0">
            <Avatar src={author.profilePicture} name={author.fullName} size="md" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                to={`/profile/${author._id}`}
                className="truncate text-sm font-bold text-slate-900 hover:text-indigo-600 transition"
              >
                {author.fullName || 'Unknown User'}
              </Link>
              <span className="text-xs text-slate-400">@{author.username || 'user'}</span>
            </div>
            <p
              title={formatFullDate(post.createdAt)}
              className="text-xs text-slate-400 mt-0.5"
            >
              {formatRelativeTime(post.createdAt)}
              {isEdited && <span className="ml-1.5 text-slate-400">· Edited</span>}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              aria-label="Edit post"
              title="Edit post"
              className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              aria-label="Delete post"
              title="Delete post"
              className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Text Content */}
      {post.content && (
        <p className="mt-3.5 text-[15px] leading-relaxed text-slate-800 whitespace-pre-wrap break-words">
          {post.content}
        </p>
      )}

      {/* Optional Post Image */}
      {post.image && (
        <div className="mt-3.5 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
          <img
            src={getMediaUrl(post.image)}
            alt="Post attachment"
            loading="lazy"
            className="max-h-[480px] w-full object-cover"
          />
        </div>
      )}

      {actionError && (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600">
          {actionError}
        </p>
      )}

      {/* Interaction Bar */}
      <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={isLiking}
          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${
            isLiked
              ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200/70'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{likesCount}</span>
          <span className="hidden sm:inline">{likesCount === 1 ? 'Like' : 'Likes'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowComments((prev) => !prev)}
          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
            showComments
              ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200/70'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          <span>{commentsCount}</span>
          <span className="hidden sm:inline">
            {commentsCount === 1 ? 'Comment' : 'Comments'}
          </span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={post._id}
          onCommentsCountChange={onCommentsCountChange}
        />
      )}

      {/* Edit Modal */}
      <EditPostModal
        post={post}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onPostUpdated={onPostUpdated}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmingDelete}
        title="Delete post"
        message="Are you sure you want to delete this post and all its comments? This action cannot be undone."
        confirmLabel="Delete post"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmingDelete(false)}
      />
    </article>
  );
};

export default PostCard;

