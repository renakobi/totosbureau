
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations" ON products;
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow public insert" ON products;
DROP POLICY IF EXISTS "Allow public update" ON products;
DROP POLICY IF EXISTS "Allow public delete" ON products;

CREATE POLICY "Allow all operations" ON products
  FOR ALL
  USING (true)
  WITH CHECK (true);

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

SELECT COUNT(*) as product_count FROM products;

DO $$
BEGIN

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE products;
    RAISE NOTICE ' Products table added to realtime publication';
  EXCEPTION
    WHEN duplicate_object THEN
      RAISE NOTICE ' Products table already in realtime publication';
    WHEN OTHERS THEN
      RAISE NOTICE ' Could not add products to realtime publication: %', SQLERRM;
  END;
END $$;

SELECT 
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime' AND tablename = 'products';
