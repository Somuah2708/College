/*
  # Create missing tables for home screen functionality

  1. New Tables
    - `post_media` - For Instagram-style carousels with multiple images/videos per post
    - `post_hashtags` - For hashtag functionality and trending tracking
    - `hashtags` - Master hashtag table with usage counts

  2. Security
    - Enable RLS on all new tables
    - Add policies for public read access and authenticated user actions
*/

-- Create hashtags table for trending hashtags
CREATE TABLE IF NOT EXISTS hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hashtag text UNIQUE NOT NULL,
  usage_count integer DEFAULT 0,
  trending_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create post_media table for carousel functionality
CREATE TABLE IF NOT EXISTS post_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  media_url text NOT NULL,
  media_type text NOT NULL DEFAULT 'image',
  thumbnail_url text DEFAULT '',
  duration text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create post_hashtags junction table
CREATE TABLE IF NOT EXISTS post_hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  hashtag_id uuid NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, hashtag_id)
);

-- Enable RLS
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_hashtags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Hashtags are publicly readable"
  ON hashtags
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Post media is publicly readable"
  ON post_media
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Post hashtags are publicly readable"
  ON post_hashtags
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_post_media_post_id ON post_media(post_id);
CREATE INDEX IF NOT EXISTS idx_post_media_order ON post_media(post_id, order_index);
CREATE INDEX IF NOT EXISTS idx_post_hashtags_post_id ON post_hashtags(post_id);
CREATE INDEX IF NOT EXISTS idx_hashtags_trending ON hashtags(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_hashtags_usage ON hashtags(usage_count DESC);

-- Insert sample data for carousel testing
INSERT INTO post_media (post_id, media_url, media_type, order_index) 
SELECT 
  p.id,
  CASE 
    WHEN gs.i = 1 THEN 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg'
    WHEN gs.i = 2 THEN 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg'
    WHEN gs.i = 3 THEN 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg'
    WHEN gs.i = 4 THEN 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg'
    WHEN gs.i = 5 THEN 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg'
  END as media_url,
  'image' as media_type,
  gs.i as order_index
FROM posts p
CROSS JOIN generate_series(1, 5) as gs(i)
WHERE p.author_name = 'University of Ghana'
  AND p.caption LIKE '%Campus Tour%'
LIMIT 5;