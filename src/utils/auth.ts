// Simple password hashing utility (in production, use bcrypt or similar)
export const hashPassword = (password: string): string => {
  // Simple hash function - in production, use proper hashing like bcrypt
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

// Password validation rules - simplified
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  // Ensure password is a string and not empty
  if (!password || typeof password !== 'string' || password.trim() === '') {
    return {
      isValid: false,
      errors: ['Password is required']
    };
  }

  const errors: string[] = [];
  
  // Minimum length
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  // Must contain at least one number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Must contain at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors || []
  };
};
