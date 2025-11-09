// SECURITY FIX: Replace weak password hashing with bcrypt
// Using bcryptjs (pure JS implementation) for client-side compatibility
// NOTE: In production, password hashing should ideally be done server-side
import bcrypt from 'bcryptjs';

// Hash password with bcrypt (12 salt rounds for security vs performance balance)
// This provides cryptographically secure hashing with salt to prevent rainbow table attacks
export const hashPassword = async (password: string): Promise<string> => {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  
  const saltRounds = 12; // OWASP recommends 10-12 rounds
  return await bcrypt.hash(password, saltRounds);
};

// Verify password against bcrypt hash
// Uses constant-time comparison to prevent timing attacks
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  if (!password || !hashedPassword) {
    return false;
  }
  
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

// Legacy support: Synchronous version for backward compatibility during migration
// This will be removed after all passwords are migrated to bcrypt
export const hashPasswordSync = (password: string): string => {
  // This is a temporary migration helper - do not use for new passwords
  console.warn('Using legacy password hashing - migrate to async hashPassword');
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
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
