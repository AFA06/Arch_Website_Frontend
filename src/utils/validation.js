// Input Validation and Sanitization Utilities

/**
 * Sanitize string input by removing potentially dangerous characters
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  // Remove script tags and potential XSS vectors
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and errors array
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate and sanitize form data
 * @param {Object} formData - Form data to validate
 * @param {Object} rules - Validation rules object
 * @returns {Object} Validation result with isValid, errors, and sanitizedData
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  const sanitizedData = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const rule = rules[field];
    
    // Required check
    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${rule.label || field} is required`;
      return;
    }
    
    // Email validation
    if (rule.type === 'email' && value && !isValidEmail(value)) {
      errors[field] = `${rule.label || field} must be a valid email`;
    }
    
    // Min length
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
    }
    
    // Max length
    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} must be less than ${rule.maxLength} characters`;
    }
    
    // Pattern matching
    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.patternMessage || `${rule.label || field} is invalid`;
    }
    
    // Custom validation
    if (rule.validate && value) {
      const customError = rule.validate(value);
      if (customError) {
        errors[field] = customError;
      }
    }
    
    // Sanitize the value
    sanitizedData[field] = typeof value === 'string' ? sanitizeString(value) : value;
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options (maxSize, allowedTypes)
 * @returns {Object} Validation result
 */
export const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 2 * 1024 * 1024, // 2MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
  } = options;
  
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: `File size must be less than ${maxSize / (1024 * 1024)}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `File type must be one of: ${allowedTypes.join(', ')}` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Validate price input (UZS)
 * @param {number|string} price - Price to validate
 * @returns {Object} Validation result
 */
export const validatePrice = (price) => {
  const numPrice = typeof price === 'string' ? parseInt(price, 10) : price;
  
  if (isNaN(numPrice)) {
    return { isValid: false, error: 'Price must be a number' };
  }
  
  if (numPrice < 0) {
    return { isValid: false, error: 'Price cannot be negative' };
  }
  
  if (numPrice > 1000000000) {
    return { isValid: false, error: 'Price is too large' };
  }
  
  return { isValid: true, error: null, value: numPrice };
};

/**
 * Rate limiting helper for client-side
 * @param {Function} fn - Function to rate limit
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Rate limited function
 */
export const debounce = (fn, delay = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

