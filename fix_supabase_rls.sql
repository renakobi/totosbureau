-- Fix Supabase RLS policies to allow public access
-- Run this in your Supabase SQL Editor if queries are being blocked

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations" ON users;
DROP POLICY IF EXISTS "Allow public read" ON users;
DROP POLICY IF EXISTS "Allow public insert" ON users;
DROP POLICY IF EXISTS "Allow public update" ON users;
DROP POLICY IF EXISTS "Allow public delete" ON users;

-- Create permissive policies for public access (anonymous users)
-- This allows the app to work from any domain including Vercel
CREATE POLICY "Allow public read" ON users
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert" ON users
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update" ON users
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete" ON users
  FOR DELETE
  TO public
  USING (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users';

