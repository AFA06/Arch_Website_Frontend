// src/utils/imageUtils.js

const API_BASE_URL = "http://localhost:5050";

/**
 * Constructs a full URL for an image
 * @param {string} imagePath - The image path (can be relative or full URL)
 * @returns {string} - Full URL for the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /uploads, construct full URL
  if (imagePath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // If it's just a filename, assume it's in uploads/avatars
  if (!imagePath.startsWith('/')) {
    return `${API_BASE_URL}/uploads/avatars/${imagePath}`;
  }
  
  // Default fallback
  return `${API_BASE_URL}${imagePath}`;
};

/**
 * Checks if an image URL is valid and accessible
 * @param {string} imageUrl - The image URL to check
 * @returns {Promise<boolean>} - Whether the image is accessible
 */
export const isImageAccessible = async (imageUrl) => {
  if (!imageUrl) return false;
  
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Gets user initials for fallback avatar
 * @param {string} name - User's first name
 * @param {string} surname - User's last name
 * @returns {string} - User initials
 */
export const getUserInitials = (name, surname) => {
  if (!name || !surname) return "?";
  return `${name[0]}${surname[0]}`.toUpperCase();
};
