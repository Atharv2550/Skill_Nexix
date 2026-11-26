import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/upload';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);

  // Revoke object URL when preview changes or component unmounts to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = (file) => {
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    const hasValidMime = ALLOWED_TYPES.includes(file.type);

    if (!hasValidMime || !hasValidExtension) {
      return 'Invalid file format. Please select a JPG, JPEG, PNG, or WEBP image.';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'File is too large. Maximum allowed size is 5 MB.';
    }

    return '';
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSuccessMessage('');
    setErrorMessage('');
    setUploadedImage(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setSelectedFile(null);
      setPreviewUrl('');
      setErrorMessage(validationError);
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    if (!selectedFile) {
      setErrorMessage('No image selected. Please choose an image before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setIsUploading(true);

      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedImage({
        filename: response.data.filename,
        imageUrl: response.data.imageUrl,
      });
      setSuccessMessage(response.data.message || 'Image uploaded successfully!');
      setSelectedFile(null);
      setPreviewUrl('');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      setErrorMessage(
        serverMessage || 'Failed to upload image. Please make sure the backend server is running.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadedImage(null);
    setSuccessMessage('');
    setErrorMessage('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <main className="page">
      <section className="card">
        <header className="card-header">
          <h1>Image Upload</h1>
          <p>Select a JPG, JPEG, PNG, or WEBP image (max 5 MB) to upload.</p>
        </header>

        <div className="upload-controls">
          <label htmlFor="image-input" className="file-label">
            Choose Image
          </label>
          <input
            id="image-input"
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="file-input"
          />

          <p className="file-status">
            {selectedFile
              ? `Selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`
              : 'No image selected'}
          </p>
        </div>

        {previewUrl && (
          <div className="image-box">
            <h2>Preview (Before Upload)</h2>
            <img src={previewUrl} alt="Selected preview" className="preview-img" />
          </div>
        )}

        <div className="actions">
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="btn btn-primary"
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>

          {(selectedFile || uploadedImage || errorMessage) && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isUploading}
              className="btn btn-secondary"
            >
              {uploadedImage ? 'Upload Another Image' : 'Clear'}
            </button>
          )}
        </div>

        {errorMessage && (
          <div role="alert" className="alert alert-error">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div role="status" className="alert alert-success">
            {successMessage}
          </div>
        )}

        {uploadedImage && (
          <div className="image-box">
            <h2>Uploaded Image</h2>
            <img
              src={uploadedImage.imageUrl}
              alt={uploadedImage.filename}
              className="preview-img"
            />
            <p className="uploaded-meta">
              <strong>Filename:</strong> {uploadedImage.filename}
            </p>
            <p className="uploaded-meta">
              <strong>URL:</strong>{' '}
              <a href={uploadedImage.imageUrl} target="_blank" rel="noreferrer">
                {uploadedImage.imageUrl}
              </a>
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;

