import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Send, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { createPost } from '../services/postService';
import { validateImageFile } from '../utils/mediaUrl';
import Avatar from './Avatar';

const MAX_CONTENT_LENGTH = 2000;

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = '';
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setError('');
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();

    if (!trimmed && !imageFile) {
      setError('Write something or attach an image before posting.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const data = await createPost({ content: trimmed, imageFile });
      setContent('');
      clearImage();
      if (onPostCreated) {
        onPostCreated(data.post);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3.5">
          <Avatar src={user?.profilePicture} name={user?.fullName} size="md" />
          <div className="flex-1 min-w-0">
            <textarea
              rows={3}
              maxLength={MAX_CONTENT_LENGTH}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError('');
              }}
              placeholder={`What's on your mind, ${user?.fullName?.split(' ')[0] || 'there'}?`}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />

            {previewUrl && (
              <div className="relative mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img
                  src={previewUrl}
                  alt="Selected upload preview"
                  className="max-h-80 w-full object-contain bg-slate-900/5"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  aria-label="Remove image"
                  className="absolute right-2.5 top-2.5 rounded-full bg-slate-900/75 p-1.5 text-white hover:bg-slate-900 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {error && (
              <p className="mt-2.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">
                {error}
              </p>
            )}

            <div className="mt-3 flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  id="create-post-image"
                />
                <label
                  htmlFor="create-post-image"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition"
                >
                  <ImagePlus className="h-4 w-4 text-indigo-500" />
                  <span>{imageFile ? 'Change Photo' : 'Add Photo'}</span>
                </label>

                <span className="hidden sm:inline text-xs text-slate-400">
                  {content.length}/{MAX_CONTENT_LENGTH}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || (!content.trim() && !imageFile)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50 transition"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;

