-- Fix Row Level Security (RLS) policies for products table
-- This script makes the products table accessible for all operations

-- ============================================
-- PRODUCTS TABLE RLS POLICIES
-- ============================================

-- Enable RLS on products table (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations" ON products;
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow public insert" ON products;
DROP POLICY IF EXISTS "Allow public update" ON products;
DROP POLICY IF EXISTS "Allow public delete" ON products;

-- Create a single permissive policy for all operations
-- This allows anyone to read, insert, update, and delete products
-- ⚠️ WARNING: This is permissive and should be restricted in production
CREATE POLICY "Allow all operations" ON products
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'products';

-- Test query to verify access
SELECT COUNT(*) as product_count FROM products;

-- Enable replication for realtime subscriptions
-- This allows the website to listen for changes in the products table
-- Note: If this fails, the table might already be in the publication
DO $$
BEGIN
  -- Try to add the table to the publication
  -- If it's already there, this will fail silently
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE products;
    RAISE NOTICE '✅ Products table added to realtime publication';
  EXCEPTION
    WHEN duplicate_object THEN
      RAISE NOTICE 'ℹ️ Products table already in realtime publication';
    WHEN OTHERS THEN
      RAISE NOTICE '⚠️ Could not add products to realtime publication: %', SQLERRM;
  END;
END $$;

-- Verify replication is enabled
SELECT 
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime' AND tablename = 'products';
