-- Migration script to update admin password from legacy hash to bcrypt
-- Run this in Supabase SQL Editor to upgrade the admin password

-- Step 1: Check current admin password hash format
SELECT username, password, 
  CASE 
    WHEN password LIKE '$2%' THEN 'bcrypt'
    ELSE 'legacy'
  END as hash_type
FROM users 
WHERE username = 'admin';

-- Step 2: Update admin password to bcrypt hash
-- This hash is for "admin123" with 12 salt rounds
-- Generated using: bcrypt.hash('admin123', 12)
UPDATE users 
SET password = '$2a$12$vSXZKYjtBWlGio35Z0XAceaRSKrz3RgYB14EIVQfkL3Lp0zGkHYOC'
WHERE username = 'admin';

-- Step 3: Verify the update
SELECT username, 
  CASE 
    WHEN password LIKE '$2%' THEN 'bcrypt ✅'
    ELSE 'legacy ⚠️'
  END as hash_type,
  LENGTH(password) as hash_length
FROM users 
WHERE username = 'admin';

