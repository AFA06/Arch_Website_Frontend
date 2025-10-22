import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Upload, Check, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import './AvatarUploader.css';

const AvatarUploader = ({ isOpen, onClose, onSave, currentImage, user }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle file selection
  const handleFileSelect = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'image/svg+xml', 'image/heic', 'image/heif'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, PNG, WEBP, SVG, HEIC, and HEIF images are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageSrc(reader.result);
    });
    reader.readAsDataURL(file);
  }, []);

  // Handle crop completion
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Create cropped image
  const createCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    
    return new Promise((resolve) => {
      image.onload = () => {
        const { x, y, width, height } = croppedAreaPixels;
        
        // Set canvas size to crop area
        canvas.width = width;
        canvas.height = height;
        
        // Draw cropped image
        ctx.drawImage(
          image,
          x, y, width, height,
          0, 0, width, height
        );
        
        // Convert to blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.9);
      };
      image.src = imageSrc;
    });
  }, [imageSrc, croppedAreaPixels]);

  // Handle save
  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    
    setIsLoading(true);
    try {
      const croppedBlob = await createCroppedImage();
      if (croppedBlob) {
        // Create a file from the blob
        const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });
        await onSave(file);
        onClose();
      }
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setImageSrc('');
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    onClose();
  };

  // Reset rotation
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    <div className={`avatar-uploader-modal ${isOpen ? 'open' : ''}`}>
      <div className="avatar-uploader-overlay" onClick={handleClose} />
      
      <div className="avatar-uploader-content">
        {/* Header */}
        <div className="avatar-uploader-header">
          <h3>Edit Profile Photo</h3>
          <button className="avatar-uploader-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Current Avatar Preview */}
        <div className="avatar-uploader-current">
          <div className="avatar-uploader-preview">
            {currentImage ? (
              <img 
                src={getImageUrl(currentImage)} 
                alt="Current avatar" 
                className="avatar-uploader-current-img"
              />
            ) : (
              <div className="avatar-uploader-default">
                {user?.name && user?.surname ? 
                  `${user.name[0]}${user.surname[0]}`.toUpperCase() : 
                  '?'
                }
              </div>
            )}
          </div>
          <p>Current photo</p>
        </div>

        {/* File Input */}
        {!imageSrc && (
          <div className="avatar-uploader-file-input">
            <input
              type="file"
              id="avatar-file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <label htmlFor="avatar-file" className="avatar-uploader-file-label">
              <Upload size={24} />
              <span>Choose Photo</span>
            </label>
          </div>
        )}

        {/* Cropper */}
        {imageSrc && (
          <div className="avatar-uploader-cropper">
            <div className="avatar-uploader-crop-container">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={true}
                style={{
                  containerStyle: {
                    width: '100%',
                    height: '300px',
                    position: 'relative',
                  },
                }}
              />
            </div>

            {/* Controls */}
            <div className="avatar-uploader-controls">
              <div className="avatar-uploader-control-group">
                <button 
                  className="avatar-uploader-control-btn"
                  onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                >
                  <ZoomOut size={16} />
                </button>
                <span className="avatar-uploader-zoom-text">
                  {Math.round(zoom * 100)}%
                </span>
                <button 
                  className="avatar-uploader-control-btn"
                  onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
                >
                  <ZoomIn size={16} />
                </button>
              </div>

              <button 
                className="avatar-uploader-control-btn"
                onClick={handleRotate}
              >
                <RotateCw size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="avatar-uploader-actions">
          <button 
            className="avatar-uploader-cancel" 
            onClick={handleClose}
          >
            Cancel
          </button>
          {imageSrc && (
            <button 
              className="avatar-uploader-save" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="avatar-uploader-spinner" />
              ) : (
                <>
                  <Check size={16} />
                  Save Photo
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarUploader;
