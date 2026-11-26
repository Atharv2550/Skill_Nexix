const fs = require('fs');
const path = require('path');

/**
 * Safely delete a locally uploaded file given its public /uploads/... path.
 */
const deleteUploadedFile = (publicPath) => {
  if (!publicPath || typeof publicPath !== 'string') return;
  if (!publicPath.startsWith('/uploads/')) return;

  const relativePath = publicPath.replace(/^\/uploads\//, '');
  const fullPath = path.join(__dirname, '..', 'uploads', relativePath);

  fs.unlink(fullPath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(`Failed to delete file ${fullPath}:`, err.message);
    }
  });
};

module.exports = { deleteUploadedFile };

