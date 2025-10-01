// Data validation utilities for localStorage
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data?: any;
}

// Validate user data structure
export const validateUserData = (data: any): ValidationResult => {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Invalid user data structure'] };
  }
  
  // Required fields
  const requiredFields = ['id', 'username', 'email', 'firstName', 'lastName', 'phone', 'address', 'createdAt', 'isAdmin', 'isActive'];
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate field types
  if (data.id && typeof data.id !== 'string') {
    errors.push('ID must be a string');
  }
  
  if (data.username && typeof data.username !== 'string') {
    errors.push('Username must be a string');
  }
  
  if (data.email && typeof data.email !== 'string') {
    errors.push('Email must be a string');
  }
  
  if (data.firstName && typeof data.firstName !== 'string') {
    errors.push('First name must be a string');
  }
  
  if (data.lastName && typeof data.lastName !== 'string') {
    errors.push('Last name must be a string');
  }
  
  if (data.phone && typeof data.phone !== 'string') {
    errors.push('Phone must be a string');
  }
  
  if (data.address && typeof data.address !== 'object') {
    errors.push('Address must be an object');
  }
  
  if (data.createdAt && typeof data.createdAt !== 'string') {
    errors.push('Created at must be a string');
  }
  
  if (data.isAdmin && typeof data.isAdmin !== 'boolean') {
    errors.push('Is admin must be a boolean');
  }
  
  if (data.isActive && typeof data.isActive !== 'boolean') {
    errors.push('Is active must be a boolean');
  }
  
  // Validate email format
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  // Validate address structure
  if (data.address && typeof data.address === 'object') {
    const addressFields = ['street', 'city', 'state', 'zipCode', 'country'];
    for (const field of addressFields) {
      if (!(field in data.address) || typeof data.address[field] !== 'string') {
        errors.push(`Address ${field} must be a string`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : null
  };
};

// Validate product data structure
export const validateProductData = (data: any): ValidationResult => {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Invalid product data structure'] };
  }
  
  // Required fields
  const requiredFields = ['id', 'name', 'description', 'price', 'category', 'subcategory', 'type', 'image', 'rating', 'reviews', 'inStock', 'stockQuantity'];
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate field types
  if (data.id && typeof data.id !== 'number') {
    errors.push('ID must be a number');
  }
  
  if (data.name && typeof data.name !== 'string') {
    errors.push('Name must be a string');
  }
  
  if (data.description && typeof data.description !== 'string') {
    errors.push('Description must be a string');
  }
  
  if (data.price && typeof data.price !== 'number') {
    errors.push('Price must be a number');
  }
  
  if (data.category && typeof data.category !== 'string') {
    errors.push('Category must be a string');
  }
  
  if (data.subcategory && typeof data.subcategory !== 'string') {
    errors.push('Subcategory must be a string');
  }
  
  if (data.type && typeof data.type !== 'string') {
    errors.push('Type must be a string');
  }
  
  if (data.image && typeof data.image !== 'string') {
    errors.push('Image must be a string');
  }
  
  if (data.rating && typeof data.rating !== 'number') {
    errors.push('Rating must be a number');
  }
  
  if (data.reviews && typeof data.reviews !== 'number') {
    errors.push('Reviews must be a number');
  }
  
  if (data.inStock && typeof data.inStock !== 'boolean') {
    errors.push('In stock must be a boolean');
  }
  
  if (data.stockQuantity && typeof data.stockQuantity !== 'number') {
    errors.push('Stock quantity must be a number');
  }
  
  // Validate price range
  if (data.price && (data.price < 0 || data.price > 10000)) {
    errors.push('Price must be between 0 and 10000');
  }
  
  // Validate rating range
  if (data.rating && (data.rating < 0 || data.rating > 5)) {
    errors.push('Rating must be between 0 and 5');
  }
  
  // Validate stock quantity
  if (data.stockQuantity && data.stockQuantity < 0) {
    errors.push('Stock quantity must be non-negative');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : null
  };
};

// Validate community post data structure
export const validateCommunityPostData = (data: any): ValidationResult => {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Invalid community post data structure'] };
  }
  
  // Required fields
  const requiredFields = ['id', 'user', 'avatar', 'time', 'content', 'likes', 'comments', 'isLiked', 'status', 'createdAt'];
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate field types
  if (data.id && typeof data.id !== 'number') {
    errors.push('ID must be a number');
  }
  
  if (data.user && typeof data.user !== 'string') {
    errors.push('User must be a string');
  }
  
  if (data.avatar && typeof data.avatar !== 'string') {
    errors.push('Avatar must be a string');
  }
  
  if (data.time && typeof data.time !== 'string') {
    errors.push('Time must be a string');
  }
  
  if (data.content && typeof data.content !== 'string') {
    errors.push('Content must be a string');
  }
  
  if (data.likes && typeof data.likes !== 'number') {
    errors.push('Likes must be a number');
  }
  
  if (data.comments && typeof data.comments !== 'number') {
    errors.push('Comments must be a number');
  }
  
  if (data.isLiked && typeof data.isLiked !== 'boolean') {
    errors.push('Is liked must be a boolean');
  }
  
  if (data.status && !['pending', 'approved', 'rejected'].includes(data.status)) {
    errors.push('Status must be pending, approved, or rejected');
  }
  
  if (data.createdAt && typeof data.createdAt !== 'string') {
    errors.push('Created at must be a string');
  }
  
  // Validate numeric ranges
  if (data.likes && data.likes < 0) {
    errors.push('Likes must be non-negative');
  }
  
  if (data.comments && data.comments < 0) {
    errors.push('Comments must be non-negative');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : null
  };
};

// Validate comment data structure
export const validateCommentData = (data: any): ValidationResult => {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Invalid comment data structure'] };
  }
  
  // Required fields
  const requiredFields = ['id', 'postId', 'user', 'avatar', 'content', 'time', 'createdAt'];
  for (const field of requiredFields) {
    if (!(field in data)) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate field types
  if (data.id && typeof data.id !== 'number') {
    errors.push('ID must be a number');
  }
  
  if (data.postId && typeof data.postId !== 'number') {
    errors.push('Post ID must be a number');
  }
  
  if (data.user && typeof data.user !== 'string') {
    errors.push('User must be a string');
  }
  
  if (data.avatar && typeof data.avatar !== 'string') {
    errors.push('Avatar must be a string');
  }
  
  if (data.content && typeof data.content !== 'string') {
    errors.push('Content must be a string');
  }
  
  if (data.time && typeof data.time !== 'string') {
    errors.push('Time must be a string');
  }
  
  if (data.createdAt && typeof data.createdAt !== 'string') {
    errors.push('Created at must be a string');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : null
  };
};

// Safe localStorage operations with validation
export const safeLocalStorageGet = (key: string, validator: (data: any) => ValidationResult, fallback: any = null): any => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return fallback;
    }
    
    const parsed = JSON.parse(stored);
    const validation = validator(parsed);
    
    if (validation.isValid) {
      return validation.data;
    } else {
      console.warn(`Invalid data in localStorage key "${key}":`, validation.errors);
      return fallback;
    }
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return fallback;
  }
};

export const safeLocalStorageSet = (key: string, data: any, validator: (data: any) => ValidationResult): boolean => {
  try {
    const validation = validator(data);
    
    if (validation.isValid) {
      localStorage.setItem(key, JSON.stringify(validation.data));
      return true;
    } else {
      console.error(`Invalid data for localStorage key "${key}":`, validation.errors);
      return false;
    }
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
};
