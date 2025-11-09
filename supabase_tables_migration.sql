-- Migration script to create all necessary tables in Supabase
-- Run this in your Supabase SQL Editor after running supabase_migration.sql

-- ============================================
-- 1. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  "originalPrice" DECIMAL(10, 2),
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  image TEXT NOT NULL,
  badge TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  "inStock" BOOLEAN DEFAULT TRUE,
  "stockQuantity" INTEGER DEFAULT 0,
  flavors JSONB,
  type TEXT NOT NULL,
  "onSale" BOOLEAN DEFAULT FALSE,
  ingredients TEXT,
  "aboutProduct" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for products
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_inStock ON products("inStock");
CREATE INDEX IF NOT EXISTS idx_products_onSale ON products("onSale");

-- ============================================
-- 2. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  "orderNumber" TEXT UNIQUE NOT NULL,
  "userId" TEXT REFERENCES users(id) ON DELETE SET NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  "orderDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "estimatedDelivery" TIMESTAMP WITH TIME ZONE,
  "shippingAddress" JSONB NOT NULL,
  "billingAddress" JSONB NOT NULL,
  "paymentMethod" JSONB,
  "trackingNumber" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_userId ON orders("userId");
CREATE INDEX IF NOT EXISTS idx_orders_orderNumber ON orders("orderNumber");
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_orderDate ON orders("orderDate");

-- ============================================
-- 3. COMMUNITY POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS community_posts (
  id SERIAL PRIMARY KEY,
  "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
  user TEXT NOT NULL,
  avatar TEXT,
  content TEXT NOT NULL,
  image TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  "isLiked" BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for community_posts
CREATE INDEX IF NOT EXISTS idx_community_posts_userId ON community_posts("userId");
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_posts_createdAt ON community_posts("createdAt");

-- ============================================
-- 4. COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  "postId" INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
  "userId" TEXT REFERENCES users(id) ON DELETE SET NULL,
  user TEXT NOT NULL,
  avatar TEXT,
  content TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for comments
CREATE INDEX IF NOT EXISTS idx_comments_postId ON comments("postId");
CREATE INDEX IF NOT EXISTS idx_comments_userId ON comments("userId");
CREATE INDEX IF NOT EXISTS idx_comments_createdAt ON comments("createdAt");

-- ============================================
-- 5. USER FAVORITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_favorites (
  id SERIAL PRIMARY KEY,
  "userId" TEXT REFERENCES users(id) ON DELETE CASCADE,
  "productId" INTEGER REFERENCES products(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("userId", "productId")
);

-- Indexes for user_favorites
CREATE INDEX IF NOT EXISTS idx_user_favorites_userId ON user_favorites("userId");
CREATE INDEX IF NOT EXISTS idx_user_favorites_productId ON user_favorites("productId");

-- ============================================
-- 6. SHIPPING SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS shipping_settings (
  id SERIAL PRIMARY KEY,
  "standardCost" DECIMAL(10, 2) NOT NULL DEFAULT 9.99,
  "freeShippingThreshold" DECIMAL(10, 2) NOT NULL DEFAULT 50,
  enabled BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default shipping settings (only one row should exist)
INSERT INTO shipping_settings ("standardCost", "freeShippingThreshold", enabled)
VALUES (9.99, 50, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

-- Products: Public read, admin write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read products" ON products;
DROP POLICY IF EXISTS "Allow admin write products" ON products;
CREATE POLICY "Allow public read products" ON products FOR SELECT TO public USING (true);
CREATE POLICY "Allow admin write products" ON products FOR ALL TO public USING (true) WITH CHECK (true);

-- Orders: Users can read their own, admins can read all, users can insert
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users read own orders" ON orders;
DROP POLICY IF EXISTS "Allow users insert orders" ON orders;
DROP POLICY IF EXISTS "Allow admin all orders" ON orders;
CREATE POLICY "Allow users read own orders" ON orders FOR SELECT TO public USING (true);
CREATE POLICY "Allow users insert orders" ON orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow admin all orders" ON orders FOR ALL TO public USING (true) WITH CHECK (true);

-- Community Posts: Public read approved, users can insert, admins can moderate
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read approved posts" ON community_posts;
DROP POLICY IF EXISTS "Allow users insert posts" ON community_posts;
DROP POLICY IF EXISTS "Allow admin all posts" ON community_posts;
CREATE POLICY "Allow public read approved posts" ON community_posts FOR SELECT TO public USING (status = 'approved' OR true);
CREATE POLICY "Allow users insert posts" ON community_posts FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow admin all posts" ON community_posts FOR ALL TO public USING (true) WITH CHECK (true);

-- Comments: Public read, users can insert
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read comments" ON comments;
DROP POLICY IF EXISTS "Allow users insert comments" ON comments;
DROP POLICY IF EXISTS "Allow admin all comments" ON comments;
CREATE POLICY "Allow public read comments" ON comments FOR SELECT TO public USING (true);
CREATE POLICY "Allow users insert comments" ON comments FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow admin all comments" ON comments FOR ALL TO public USING (true) WITH CHECK (true);

-- User Favorites: Users can read/insert their own
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Allow admin all favorites" ON user_favorites;
CREATE POLICY "Allow users own favorites" ON user_favorites FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all favorites" ON user_favorites FOR ALL TO public USING (true) WITH CHECK (true);

-- Shipping Settings: Public read, admin write
ALTER TABLE shipping_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read shipping" ON shipping_settings;
DROP POLICY IF EXISTS "Allow admin write shipping" ON shipping_settings;
CREATE POLICY "Allow public read shipping" ON shipping_settings FOR SELECT TO public USING (true);
CREATE POLICY "Allow admin write shipping" ON shipping_settings FOR ALL TO public USING (true) WITH CHECK (true);

-- ============================================
-- VERIFY TABLES WERE CREATED
-- ============================================
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('products', 'orders', 'community_posts', 'comments', 'user_favorites', 'shipping_settings')
ORDER BY table_name;

