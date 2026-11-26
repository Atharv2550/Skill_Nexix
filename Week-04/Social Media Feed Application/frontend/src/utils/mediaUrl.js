const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Resolve backend media paths (e.g. /uploads/posts/...) into full URLs.
 */
export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }
  const normalizedBase = API_BASE.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validate an image file before previewing or uploading.
 */
export const validateImageFile = (file) => {
  if (!file) return 'No file selected.';
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return 'Only JPG, JPEG, PNG, and WEBP images are allowed.';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Image size must be 5 MB or smaller.';
  }
  return null;
};

