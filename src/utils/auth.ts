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

// Default admin credentials (should be changed in production)
export const DEFAULT_ADMIN = {
  id: 'admin-001',
  username: 'admin',
  email: 'admin@totosbureau.com',
  password: hashPassword('admin123'), // Changed from 'admin' to 'admin123'
  firstName: 'Admin',
  lastName: 'User',
  phone: '+1-555-0123',
  address: {
    street: '123 Admin St',
    city: 'Admin City',
    state: 'AC',
    zipCode: '12345',
    country: 'USA'
  },
  createdAt: new Date().toISOString(),
  isAdmin: true,
  isActive: true
};

// Password validation rules
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  // Debug logging
  console.log('validatePassword called with:', password, 'type:', typeof password);
  
  // Ensure password is a string and not empty
  if (!password || typeof password !== 'string' || password.trim() === '') {
    console.log('Password validation failed - empty or invalid');
    return {
      isValid: false,
      errors: ['Password is required']
    };
  }

  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors || []
  };
};
