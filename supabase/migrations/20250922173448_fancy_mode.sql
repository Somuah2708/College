/*
  # Create missing home screen tables

  1. New Tables
    - `user_saved_posts` - User saved posts with collections
    - `trending_items` - Trending content management  
    - `post_categories` - Category organization
    - `post_comments` - Comments system (enhanced version)
    - `user_interactions` - User activity tracking

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for each table
    - Ensure proper user access controls

  3. Indexes
    - Add performance indexes for common queries
    - Optimize for trending and user-specific queries
*/

-- Create user_saved_posts table
CREATE TABLE IF NOT EXISTS user_saved_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  collection_name text DEFAULT 'default',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE user_saved_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved posts"
  ON user_saved_posts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for user_saved_posts
CREATE INDEX IF NOT EXISTS idx_user_saved_posts_user_id ON user_saved_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_posts_collection ON user_saved_posts(user_id, collection_name);
CREATE INDEX IF NOT EXISTS idx_user_saved_posts_created_at ON user_saved_posts(user_id, created_at DESC);

-- Create trending_items table
CREATE TABLE IF NOT EXISTS trending_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type text NOT NULL DEFAULT 'post',
  item_id text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  thumbnail_url text DEFAULT '',
  category text DEFAULT 'general',
  trending_score integer DEFAULT 0,
  views_count integer DEFAULT 0,
  engagement_rate numeric(5,2) DEFAULT 0.0,
  time_period text DEFAULT 'daily',
  source text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  is_featured boolean DEFAULT false,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trending_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trending items are publicly readable"
  ON trending_items
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for trending_items
CREATE INDEX IF NOT EXISTS idx_trending_items_score ON trending_items(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_trending_items_category ON trending_items(category);
CREATE INDEX IF NOT EXISTS idx_trending_items_featured ON trending_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_trending_items_period ON trending_items(time_period);

-- Create post_categories table
CREATE TABLE IF NOT EXISTS post_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  color text DEFAULT '#3B82F6',
  icon text DEFAULT 'folder',
  parent_id uuid REFERENCES post_categories(id) ON DELETE SET NULL,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  post_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post categories are publicly readable"
  ON post_categories
  FOR SELECT
  TO public
  USING (is_active = true);

-- Create indexes for post_categories
CREATE INDEX IF NOT EXISTS idx_post_categories_slug ON post_categories(slug);
CREATE INDEX IF NOT EXISTS idx_post_categories_parent ON post_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_order ON post_categories(order_index);

-- Create enhanced post_comments table (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'post_comments') THEN
    CREATE TABLE post_comments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      parent_comment_id uuid REFERENCES post_comments(id) ON DELETE CASCADE,
      content text NOT NULL,
      likes_count integer DEFAULT 0,
      replies_count integer DEFAULT 0,
      is_edited boolean DEFAULT false,
      is_pinned boolean DEFAULT false,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      CONSTRAINT post_comments_content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000)
    );

    ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Comments are publicly readable"
      ON post_comments
      FOR SELECT
      TO public
      USING (true);

    CREATE POLICY "Authenticated users can insert comments"
      ON post_comments
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own comments"
      ON post_comments
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own comments"
      ON post_comments
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);

    -- Create indexes for post_comments
    CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
    CREATE INDEX idx_post_comments_user_id ON post_comments(user_id);
    CREATE INDEX idx_post_comments_parent ON post_comments(parent_comment_id);
    CREATE INDEX idx_post_comments_created_at ON post_comments(created_at DESC);
  END IF;
END $$;

-- Create user_interactions table
CREATE TABLE IF NOT EXISTS user_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type text NOT NULL,
  target_type text NOT NULL,
  target_id text NOT NULL,
  metadata jsonb DEFAULT '{}',
  session_id text,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own interactions"
  ON user_interactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
  ON user_interactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for user_interactions
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_user_interactions_target ON user_interactions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_created_at ON user_interactions(created_at DESC);

-- Insert sample post categories
INSERT INTO post_categories (name, slug, description, color, icon, order_index) VALUES
  ('Universities', 'universities', 'University news and updates', '#3B82F6', 'building', 1),
  ('Programs', 'programs', 'Academic program information', '#10B981', 'graduation-cap', 2),
  ('Scholarships', 'scholarships', 'Scholarship opportunities and funding', '#F59E0B', 'award', 3),
  ('Student Life', 'student-life', 'Campus life and student activities', '#8B5CF6', 'users', 4),
  ('Career', 'career', 'Career opportunities and guidance', '#EF4444', 'briefcase', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample trending items
INSERT INTO trending_items (item_type, item_id, title, description, thumbnail_url, category, trending_score, views_count, engagement_rate, source) VALUES
  ('post', '1', 'University of Ghana Launches AI Research Center', 'New state-of-the-art facility for artificial intelligence research', 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg', 'Universities', 95, 45600, 12.5, 'University of Ghana'),
  ('post', '2', 'KNUST Engineering Program Wins International Award', 'Recognition for outstanding engineering education', 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg', 'Programs', 88, 32100, 15.2, 'KNUST'),
  ('post', '3', 'MasterCard Foundation Scholarships Open', 'New scholarship opportunities for African students', 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg', 'Scholarships', 92, 67800, 22.1, 'MasterCard Foundation')
ON CONFLICT DO NOTHING;