import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { hashPassword, verifyPassword, DEFAULT_ADMIN, validatePassword } from '../utils/auth';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Add password field
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  isAdmin: boolean;
  isActive: boolean;
}

interface UserContextType {
  users: User[];
  currentUser: User | null;
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => User;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  loginUser: (username: string, password: string) => User | null;
  logoutUser: () => void;
  getCurrentUser: () => User | null;
  getAllUsers: () => User[];
  isLoggedIn: () => boolean;
  isAdmin: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem('totos-bureau-users');
      if (storedUsers) {
        const parsed = JSON.parse(storedUsers);
        // Initialize with default admin if no users exist
        if (parsed.length === 0) {
          return [DEFAULT_ADMIN];
        }
        return parsed;
      }
      return [DEFAULT_ADMIN];
    } catch (error) {
      console.error('Error loading users from localStorage:', error);
      return [DEFAULT_ADMIN];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('totos-bureau-current-user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error loading current user from localStorage:', error);
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('totos-bureau-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('totos-bureau-current-user', JSON.stringify(currentUser));
      localStorage.setItem('totos-bureau-user', 'true');
      if (currentUser.isAdmin) {
        localStorage.setItem('totos-bureau-admin', 'true');
      }
    } else {
      localStorage.removeItem('totos-bureau-current-user');
      localStorage.removeItem('totos-bureau-user');
      localStorage.removeItem('totos-bureau-admin');
    }
  }, [currentUser]);

  const generateUserId = () => {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => {
    // Check if username or email already exists
    const existingUser = users.find(
      user => user.username === userData.username || user.email === userData.email
    );

    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    // Validate password
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    const newUser: User = {
      ...userData,
      password: hashPassword(userData.password), // Hash the password
      id: generateUserId(),
      createdAt: new Date().toISOString(),
      isActive: true
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    return newUser;
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, ...updates } : user
      )
    );

    // Update current user if it's the same user
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prevUser => prevUser ? { ...prevUser, ...updates } : null);
    }
  };

  const deleteUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    
    // Logout if current user is deleted
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
    }
  };

  const loginUser = (username: string, password: string) => {
    const user = users.find(u => 
      (u.username === username || u.email === username) && 
      u.isActive
    );

    if (user && verifyPassword(password, user.password)) {
      setCurrentUser(user);
      return user;
    }

    return null;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const getCurrentUser = () => currentUser;

  const isLoggedIn = () => {
    return currentUser !== null;
  };

  const getAllUsers = (): User[] => {
    return users;
  };

  const isAdmin = () => {
    return currentUser?.isAdmin || false;
  };

  return (
    <UserContext.Provider value={{
      users,
      currentUser,
      addUser,
      updateUser,
      deleteUser,
      loginUser,
      logoutUser,
      getCurrentUser,
      getAllUsers,
      isLoggedIn,
      isAdmin
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
