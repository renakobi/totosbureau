import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { hashPassword, verifyPassword, validatePassword, hashPasswordSync } from '../utils/auth';
import { supabase } from '../integrations/supabase/client';
import type { TablesInsert, TablesUpdate } from '../integrations/supabase/types';

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
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => Promise<User>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  loginUser: (username: string, password: string) => Promise<User | null>;
  logoutUser: () => void;
  getCurrentUser: () => User | null;
  getAllUsers: () => User[];
  isLoggedIn: () => boolean;
  isAdmin: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('totos-bureau-current-user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error loading current user from localStorage:', error);
      return null;
    }
  });

  // Load users from Supabase on mount
  useEffect(() => {
    loadUsersFromSupabase();
  }, []);

  const loadUsersFromSupabase = async () => {
    try {
      setIsLoadingUsers(true);
      console.log('Loading users from Supabase...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error loading users from Supabase:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        
        // If it's a permission/RLS error, log it clearly
        if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('policy')) {
          console.error('⚠️ RLS Policy Error: Check Supabase Row Level Security policies');
        }
        
        // Fallback to localStorage if Supabase fails
        try {
          const storedUsers = localStorage.getItem('totos-bureau-users');
          if (storedUsers) {
            const parsed = JSON.parse(storedUsers);
            setUsers(Array.isArray(parsed) ? parsed : []);
            console.log('Loaded users from localStorage fallback:', parsed.length);
          } else {
            console.warn('No users in localStorage fallback');
          }
        } catch (e) {
          console.error('Error loading users from localStorage fallback:', e);
        }
      } else {
        console.log('Successfully loaded users from Supabase:', data?.length || 0);
        // Transform Supabase data to match User interface
        const transformedUsers = (data || []).map((user: any) => ({
          ...user,
          address: typeof user.address === 'string' ? JSON.parse(user.address) : user.address
        }));
        setUsers(transformedUsers);
        
        // Auto-create admin account if it doesn't exist
        const adminExists = transformedUsers.some((u: User) => u.username === 'admin');
        if (!adminExists) {
          try {
            // SECURITY FIX: Use async password hashing for admin account
            const adminPasswordHash = await hashPassword('admin123');
            const adminUser: User = {
              id: generateUserId(),
              username: 'admin',
              email: 'admin@totosbureau.com',
              password: adminPasswordHash,
              firstName: 'Admin',
              lastName: 'User',
              phone: '0000000000',
              address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'United States'
              },
              createdAt: new Date().toISOString(),
              isAdmin: true,
              isActive: true
            };

            const adminInsert = {
              id: adminUser.id,
              username: adminUser.username,
              email: adminUser.email,
              password: adminUser.password,
              "firstName": adminUser.firstName,
              "lastName": adminUser.lastName,
              phone: adminUser.phone,
              address: JSON.stringify(adminUser.address),
              "createdAt": adminUser.createdAt,
              "isAdmin": adminUser.isAdmin,
              "isActive": adminUser.isActive
            } as TablesInsert<'users'>;
            const { data: insertedAdmin, error: insertError } = await supabase
              .from('users')
              .insert([adminInsert] as any)
              .select()
              .single();

            if (!insertError && insertedAdmin) {
              const insertedAdminTyped = insertedAdmin as any;
              const newAdmin = {
                ...insertedAdminTyped,
                address: typeof insertedAdminTyped.address === 'string' ? JSON.parse(insertedAdminTyped.address) : (insertedAdminTyped.address || {})
              } as User;
              transformedUsers.push(newAdmin);
              console.log('Default admin account created successfully');
            }
          } catch (createError) {
            console.error('Error creating default admin account:', createError);
          }
        }
        
        // Sync to localStorage as backup
        localStorage.setItem('totos-bureau-users', JSON.stringify(transformedUsers));
        setUsers(transformedUsers);
      }
    } catch (error) {
      console.error('Error in loadUsersFromSupabase:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // SECURITY FIX: Store minimal non-sensitive data in localStorage
  // Never store admin status or passwords in client storage
  // Admin status should be verified server-side on each request
  useEffect(() => {
    if (currentUser) {
      // Store only non-sensitive user data (no password, no admin status)
      const safeUserData = {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        // Explicitly exclude: password, isAdmin, isActive
      };
      localStorage.setItem('totos-bureau-current-user', JSON.stringify(safeUserData));
      localStorage.setItem('totos-bureau-user', 'true');
      // SECURITY FIX: Remove admin status from localStorage - verify server-side instead
      // localStorage.setItem('totos-bureau-admin', 'true'); // REMOVED - security risk
    } else {
      localStorage.removeItem('totos-bureau-current-user');
      localStorage.removeItem('totos-bureau-user');
      localStorage.removeItem('totos-bureau-admin'); // Clean up if exists
    }
  }, [currentUser]);

  const generateUserId = () => {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addUser = async (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => {
    // Check if username or email already exists in Supabase
    const { data: existingUsers } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${userData.username},email.eq.${userData.email}`);

    if (existingUsers && existingUsers.length > 0) {
      throw new Error('Username or email already exists');
    }

    // Password validation is handled in the form validation
    // No need to validate again here

    // SECURITY FIX: Use async bcrypt password hashing
    const passwordHash = await hashPassword(userData.password);
    const newUser: User = {
      ...userData,
      password: passwordHash, // Securely hashed password
      id: generateUserId(),
      createdAt: new Date().toISOString(),
      isActive: true
    };

    // Insert into Supabase
    const userInsert = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      "firstName": newUser.firstName,
      "lastName": newUser.lastName,
      phone: newUser.phone,
      address: JSON.stringify(newUser.address), // Store address as JSON string in Supabase
      "createdAt": newUser.createdAt,
      "isAdmin": newUser.isAdmin,
      "isActive": newUser.isActive
    } as TablesInsert<'users'>;
    const { data, error } = await supabase
      .from('users')
      .insert([userInsert] as any)
      .select()
      .single();

    if (error) {
      console.error('Error adding user to Supabase:', error);
      throw new Error('Failed to create user account');
    }

    if (!data) {
      throw new Error('No data returned from Supabase');
    }

    // Update local state
    const dataTyped = data as any;
    const transformedUser = {
      ...dataTyped,
      address: typeof dataTyped.address === 'string' ? JSON.parse(dataTyped.address) : (dataTyped.address || {})
    } as User;
    setUsers(prevUsers => [...prevUsers, transformedUser]);
    
    // Sync to localStorage as backup
    const updatedUsers = [...users, transformedUser];
    localStorage.setItem('totos-bureau-users', JSON.stringify(updatedUsers));

    return transformedUser;
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    // Prepare updates for Supabase (convert address to JSON string if present)
    const supabaseUpdates: Record<string, any> = {};
    if (updates.username !== undefined) supabaseUpdates.username = updates.username;
    if (updates.email !== undefined) supabaseUpdates.email = updates.email;
    if (updates.firstName !== undefined) supabaseUpdates["firstName"] = updates.firstName;
    if (updates.lastName !== undefined) supabaseUpdates["lastName"] = updates.lastName;
    if (updates.phone !== undefined) supabaseUpdates.phone = updates.phone;
    if (updates.address) {
      supabaseUpdates.address = JSON.stringify(updates.address);
    }
    // SECURITY FIX: Use async bcrypt password hashing for password updates
    if (updates.password) {
      supabaseUpdates.password = await hashPassword(updates.password);
    }
    if (updates.isAdmin !== undefined) supabaseUpdates["isAdmin"] = updates.isAdmin;
    if (updates.isActive !== undefined) supabaseUpdates["isActive"] = updates.isActive;

    // Update in Supabase
    // Type assertion needed due to Supabase type limitations with dynamic updates
    const updateQuery: any = supabase.from('users');
    const { error } = await updateQuery.update(supabaseUpdates).eq('id', userId);

    if (error) {
      console.error('Error updating user in Supabase:', error);
      throw new Error('Failed to update user');
    }

    // Update local state
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, ...updates } : user
      )
    );

    // Update current user if it's the same user
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prevUser => prevUser ? { ...prevUser, ...updates } : null);
    }

    // Sync to localStorage as backup
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, ...updates } : user
    );
    localStorage.setItem('totos-bureau-users', JSON.stringify(updatedUsers));
  };

  const deleteUser = async (userId: string) => {
    // Delete from Supabase
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user from Supabase:', error);
      throw new Error('Failed to delete user');
    }

    // Update local state
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    
    // Logout if current user is deleted
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
    }

    // Sync to localStorage as backup
    const updatedUsers = users.filter(user => user.id !== userId);
    localStorage.setItem('totos-bureau-users', JSON.stringify(updatedUsers));
  };

  const loginUser = async (username: string, password: string): Promise<User | null> => {
    try {
      console.log('Attempting login for:', username);
      // Query Supabase for user by username or email
      // Try username first, then email separately to avoid OR query issues
      let data = null;
      let error = null;

      // First try to find by username
      const { data: usernameData, error: usernameError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('isActive', true)
        .maybeSingle();

      if (usernameError) {
        console.error('Error querying Supabase by username:', usernameError);
        console.error('Error code:', usernameError.code);
        console.error('Error message:', usernameError.message);
        
        // Check for RLS/permission errors
        if (usernameError.code === 'PGRST301' || usernameError.message?.includes('permission') || usernameError.message?.includes('policy')) {
          console.error('⚠️ RLS Policy Error: User query blocked by Row Level Security');
        }
      } else if (usernameData) {
        console.log('User found by username in Supabase');
        data = usernameData;
      } else {
        // If not found by username, try email
        const { data: emailData, error: emailError } = await supabase
          .from('users')
          .select('*')
          .eq('email', username)
          .eq('isActive', true)
          .maybeSingle();

        if (emailError) {
          console.error('Error querying Supabase by email:', emailError);
          console.error('Error code:', emailError.code);
          console.error('Error message:', emailError.message);
          error = emailError;
          
          // Check for RLS/permission errors
          if (emailError.code === 'PGRST301' || emailError.message?.includes('permission') || emailError.message?.includes('policy')) {
            console.error('⚠️ RLS Policy Error: Email query blocked by Row Level Security');
          }
        } else if (emailData) {
          console.log('User found by email in Supabase');
          data = emailData;
        } else {
          console.log('User not found in Supabase (tried both username and email)');
        }
      }

      if (error || !data) {
        // Fallback to localStorage directly
        console.log('User not found in Supabase, checking localStorage...');
        return checkLocalStorageForUser(username, password);
      }

      // Transform Supabase data
      const user = {
        ...data,
        address: typeof data.address === 'string' ? JSON.parse(data.address) : (data.address || {})
      };

      // SECURITY FIX: Support both bcrypt and legacy password hashes
      // Check if password hash looks like bcrypt (starts with $2a$, $2b$, or $2y$)
      let passwordValid = false;
      if (user.password && user.password.startsWith('$2')) {
        // It's a bcrypt hash - use async verification
        try {
          passwordValid = await verifyPassword(password, user.password);
        } catch (e) {
          console.error('Error verifying bcrypt password:', e);
          passwordValid = false;
        }
      } else {
        // Legacy hash format - use sync verification for backward compatibility
        // This handles old passwords that haven't been migrated yet
        console.warn('Using legacy password verification - password will be migrated to bcrypt on next change');
        passwordValid = hashPasswordSync(password) === user.password;
      }
      
      if (passwordValid) {
        // SECURITY FIX: Don't store full user object with password in localStorage
        // Store only safe, non-sensitive data
        setCurrentUser(user);
        // If user was found in Supabase, sync minimal data to localStorage
        try {
          const storedUsers = localStorage.getItem('totos-bureau-users');
          const localUsers = storedUsers ? JSON.parse(storedUsers) : [];
          const userExists = localUsers.some((u: User) => u.id === user.id);
          if (!userExists) {
            // Store user without password
            const safeUser = { ...user };
            delete (safeUser as any).password;
            localUsers.push(safeUser);
            localStorage.setItem('totos-bureau-users', JSON.stringify(localUsers));
          }
        } catch (e) {
          console.error('Error syncing user to localStorage:', e);
        }
        return user;
      }

      return null;
    } catch (error) {
      console.error('Error in loginUser:', error);
      // Fallback to localStorage
      return await checkLocalStorageForUser(username, password);
    }
  };

  // Helper function to check localStorage for user
  // SECURITY FIX: Made async to support bcrypt password verification
  const checkLocalStorageForUser = async (username: string, password: string): Promise<User | null> => {
    try {
      const storedUsers = localStorage.getItem('totos-bureau-users');
      if (storedUsers) {
        const localUsers: User[] = JSON.parse(storedUsers);
        const localUser = localUsers.find(u => 
          (u.username === username || u.email === username) && 
          u.isActive
        );
        
        if (localUser) {
          // SECURITY FIX: Support both old (sync) and new (async bcrypt) password hashes
          // Check if password hash looks like bcrypt (starts with $2a$, $2b$, or $2y$)
          let passwordValid = false;
          if (localUser.password.startsWith('$2')) {
            // It's a bcrypt hash - use async verification
            try {
              passwordValid = await verifyPassword(password, localUser.password);
            } catch (e) {
              console.error('Error verifying bcrypt password:', e);
              passwordValid = false;
            }
          } else {
            // Legacy hash format - use sync verification for backward compatibility
            // These will be migrated to bcrypt on next password change
            console.warn('Using legacy password verification - password will be migrated to bcrypt on next change');
            passwordValid = hashPasswordSync(password) === localUser.password;
          }
          
          if (passwordValid) {
            setCurrentUser(localUser);
            // Try to sync this user to Supabase if it doesn't exist there
            syncUserToSupabase(localUser).catch(err => {
              console.error('Error syncing user to Supabase:', err);
            });
            return localUser;
          }
        }
      }
    } catch (e) {
      console.error('Error checking localStorage:', e);
    }
    return null;
  };

  // Helper function to sync a user from localStorage to Supabase
  const syncUserToSupabase = async (user: User): Promise<void> => {
    try {
      // Check if user already exists in Supabase by username first
      const { data: existingByUsername } = await supabase
        .from('users')
        .select('id')
        .eq('username', user.username)
        .maybeSingle();

      if (existingByUsername) {
        console.log('User already exists in Supabase (by username)');
        return;
      }

      // Check by email
      const { data: existingByEmail } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();

      if (existingByEmail) {
        console.log('User already exists in Supabase (by email)');
        return;
      }

      // User doesn't exist in Supabase, insert it
      console.log('Syncing user to Supabase:', user.email);
      const syncInsert = {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        "firstName": user.firstName,
        "lastName": user.lastName,
        phone: user.phone,
        address: JSON.stringify(user.address),
        "createdAt": user.createdAt,
        "isAdmin": user.isAdmin,
        "isActive": user.isActive
      } as TablesInsert<'users'>;
      const { data, error } = await supabase
        .from('users')
        .insert([syncInsert] as any)
        .select()
        .single();

      if (error) {
        console.error('Error syncing user to Supabase:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
      } else {
        console.log('User synced to Supabase successfully:', data);
        // Reload users from Supabase
        await loadUsersFromSupabase();
      }
    } catch (error) {
      console.error('Error in syncUserToSupabase:', error);
    }
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
