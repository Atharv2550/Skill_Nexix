import { useEffect, useState } from 'react';
import { ImagePlus, Trash2, X } from 'lucide-react';
import { updatePost } from '../services/postService';
import { getMediaUrl, validateImageFile } from '../utils/mediaUrl';

const EditPostModal = ({ post, isOpen, onClose, onPostUpdated }) => {
  const [content, setContent] = useState(post?.content || '');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && post) {
      setContent(post.content || '');
      setImageFile(null);
      setPreviewUrl('');
      setRemoveImage(false);
      setError('');
    }
  }, [isOpen, post]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!isOpen || !post) return null;

  const displayedImage = previewUrl || (!removeImage ? getMediaUrl(post.image) : '');

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setError('');
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const handleRemoveCurrentImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(null);
    setPreviewUrl('');
    setRemoveImage(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();

    if (!trimmed && !displayedImage) {
      setError('Post must have either text content or an image.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const data = await updatePost(post._id, {
        content: trimmed,
        imageFile,
        removeImage,
      });
      onPostUpdated?.(data.post);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Edit Post</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <textarea
            rows={4}
            maxLength={2000}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Update your post..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          {displayedImage && (
            <div className="relative overflow-hidden rounded-xl border border-slate-200">
              <img
                src={displayedImage}
                alt="Post attachment"
                className="max-h-64 w-full object-contain bg-slate-50"
              />
              <button
                type="button"
                onClick={handleRemoveCurrentImage}
                className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-lg bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-rose-600 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>
          )}

          <div>
            <input
              id={`edit-post-image-${post._id}`}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />
            <label
              htmlFor={`edit-post-image-${post._id}`}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <ImagePlus className="h-4 w-4 text-indigo-500" />
              <span>{displayedImage ? 'Replace Image' : 'Add Image'}</span>
            </label>
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;

