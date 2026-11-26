import { getMediaUrl } from '../utils/mediaUrl';

const SIZE_CLASSES = {
  xs: 'h-7 w-7 text-xs',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-24 w-24 text-2xl sm:h-28 sm:w-28 sm:text-3xl',
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const resolvedSrc = getMediaUrl(src);

  if (resolvedSrc) {
    return (
      <img
        src={resolvedSrc}
        alt={name || 'User avatar'}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-white shadow-sm shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      aria-label={name || 'User avatar'}
      className={`${sizeClass} rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 text-white font-semibold flex items-center justify-center ring-2 ring-white shadow-sm shrink-0 select-none ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;

