// Security Utilities

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

/**
 * Get authentication token
 * @returns {string|null} Token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get current user
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Clear authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('returnAfterLogin');
};

/**
 * Prevent video download and right-click on video elements
 * @param {HTMLVideoElement} videoElement - Video element to protect
 */
export const protectVideoElement = (videoElement) => {
  if (!videoElement) return;
  
  // Disable right-click
  const disableContextMenu = (e) => {
    e.preventDefault();
    return false;
  };
  
  videoElement.addEventListener('contextmenu', disableContextMenu);
  videoElement.setAttribute('controlsList', 'nodownload');
  videoElement.setAttribute('disablePictureInPicture', 'true');
  
  // Return cleanup function
  return () => {
    videoElement.removeEventListener('contextmenu', disableContextMenu);
  };
};

/**
 * Add watermark overlay to video container
 * @param {HTMLElement} container - Container element
 * @param {string} text - Watermark text (e.g., user email)
 */
export const addVideoWatermark = (container, text) => {
  const watermark = document.createElement('div');
  watermark.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: rgba(255, 255, 255, 0.1);
    pointer-events: none;
    z-index: 10;
    font-weight: bold;
    user-select: none;
    white-space: nowrap;
  `;
  watermark.textContent = text;
  container.appendChild(watermark);
  
  return watermark;
};

/**
 * Detect and prevent screen recording (limited effectiveness)
 */
export const detectScreenRecording = () => {
  // Check for common screen recording APIs
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    console.warn('Screen recording capability detected');
    // Note: We cannot actually prevent screen recording,
    // but we can log it or notify the server
  }
};

/**
 * Generate a secure random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
export const generateSecureRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
  } else {
    // Fallback for older browsers
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  
  return result;
};

/**
 * Check if current session is valid
 * @returns {boolean} True if session is valid
 */
export const isSessionValid = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Basic JWT token structure check
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload (without verification - server should verify)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      clearAuthData();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating session:', error);
    return false;
  }
};

/**
 * Setup CSRF protection (if needed)
 * @returns {string} CSRF token
 */
export const getCsrfToken = () => {
  let token = sessionStorage.getItem('csrfToken');
  if (!token) {
    token = generateSecureRandomString();
    sessionStorage.setItem('csrfToken', token);
  }
  return token;
};

/**
 * Prevent clickjacking by checking if page is in iframe
 */
export const preventClickjacking = () => {
  if (window.self !== window.top) {
    // Page is in an iframe, redirect to top
    window.top.location = window.self.location;
  }
};

// Initialize security measures
export const initSecurity = () => {
  // Prevent clickjacking
  preventClickjacking();
  
  // Check session validity
  if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
    if (!isSessionValid()) {
      window.location.href = '/login';
    }
  }
};

