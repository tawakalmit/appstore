-- TokoApps Database Schema
-- Run this in Supabase SQL Editor

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT '📦',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Apps table
CREATE TABLE apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('apk', 'webapp')),
  price INTEGER NOT NULL DEFAULT 0,
  icon_url TEXT NOT NULL DEFAULT '',
  screenshots TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id),
  developer TEXT NOT NULL DEFAULT 'TokoApps Dev',
  version TEXT NOT NULL DEFAULT '1.0.0',
  download_url TEXT NOT NULL DEFAULT '',
  demo_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_downloads INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User purchases table
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded')),
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, app_id)
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, app_id)
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and apps
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Published apps are viewable by everyone" ON apps FOR SELECT USING (is_published = true);

-- Users can only see their own purchases
CREATE POLICY "Users can view own purchases" ON purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own purchases" ON purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews are public to read, but only owners can write
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Seed categories
INSERT INTO categories (name, slug, icon) VALUES
  ('Bisnis', 'bisnis', '💼'),
  ('Produktivitas', 'produktivitas', '⚡'),
  ('Marketing', 'marketing', '📢'),
  ('Edukasi', 'edukasi', '📚'),
  ('Keuangan', 'keuangan', '💰'),
  ('Utilitas', 'utilitas', '🔧'),
  ('Desain', 'desain', '🎨'),
  ('Komunikasi', 'komunikasi', '💬'),
  ('E-Commerce', 'e-commerce', '🛒'),
  ('Kesehatan', 'kesehatan', '🏥'),
  ('Hiburan', 'hiburan', '🎮'),
  ('Keamanan', 'keamanan', '🔐');
