-- Migration script to create users table in Supabase
-- Run this in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  phone TEXT NOT NULL,
  address JSONB NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "isAdmin" BOOLEAN DEFAULT FALSE,
  "isActive" BOOLEAN DEFAULT TRUE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_isActive ON users("isActive");

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read all users" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Allow all operations" ON users;

-- Create permissive policies to allow all operations
-- This is for development - tighten security in production
CREATE POLICY "Allow all operations" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create default admin account (username: admin, password: admin123)
-- The password hash for "admin123" is calculated using the hashPassword function
INSERT INTO users (id, username, email, password, "firstName", "lastName", phone, address, "isAdmin", "isActive")
VALUES (
  'admin-' || extract(epoch from now())::text || '-' || substr(md5(random()::text), 1, 9),
  'admin',
  'admin@totosbureau.com',
  '-969161597',  -- Hash of "admin123"
  'Admin',
  'User',
  '0000000000',
  '{"street": "", "city": "", "state": "", "zipCode": "", "country": "United States"}'::jsonb,
  true,
  true
)
ON CONFLICT (username) DO NOTHING;

-- Note: If you have existing users in localStorage, you'll need to migrate them manually
-- or create a migration script to import them into Supabase

