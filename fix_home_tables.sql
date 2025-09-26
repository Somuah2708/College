-- Essential tables for Home screen functionality
-- Run this in your Supabase SQL Editor
-- Fixed for your actual posts table structure

-- 1. Create post_media table (REQUIRED for Home screen media)
CREATE TABLE IF NOT EXISTS public.post_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  
  -- Media details (matching your app's expectations)
  media_type text NOT NULL CHECK (media_type IN ('image', 'video', 'gif', 'audio')),
  media_url text NOT NULL,
  thumbnail_url text,
  alt_text text DEFAULT '',
  
  -- Media metadata
  file_size bigint,
  duration integer, -- for videos/audio in seconds
  width integer,
  height integer,
  format text,
  
  -- Organization (needed by Home screen mapping)
  order_index integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  
  -- Processing status
  processing_status text DEFAULT 'completed' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  
  created_at timestamptz DEFAULT now()
);

-- 2. Create post_interactions table (for engagement tracking)
CREATE TABLE IF NOT EXISTS public.post_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  interaction_type text NOT NULL CHECK (interaction_type IN ('like', 'share', 'save', 'view', 'click', 'report')),
  interaction_data jsonb DEFAULT '{}',
  
  created_at timestamptz DEFAULT now(),
  
  -- One interaction per user per post per type
  UNIQUE(post_id, user_id, interaction_type)
);

-- 3. Performance indexes
CREATE INDEX IF NOT EXISTS idx_post_media_post_id ON public.post_media(post_id, order_index);
CREATE INDEX IF NOT EXISTS idx_post_media_type ON public.post_media(media_type);
CREATE INDEX IF NOT EXISTS idx_post_interactions_post ON public.post_interactions(post_id, interaction_type);

-- 4. Enable RLS
ALTER TABLE public.post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_interactions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for post_media (simplified for your table structure)
CREATE POLICY "post_media_public_read" ON public.post_media
  FOR SELECT TO public
  USING (true); -- Allow public read since your posts table doesn't have status/visibility columns

CREATE POLICY "post_media_owner_all" ON public.post_media
  FOR ALL TO authenticated
  USING (true) -- Simplified - you can make this more restrictive later
  WITH CHECK (true);

-- 6. RLS Policies for post_interactions (simplified for your table structure)
CREATE POLICY "interactions_public_read" ON public.post_interactions
  FOR SELECT TO public
  USING (true); -- Allow public read

CREATE POLICY "interactions_user_manage" ON public.post_interactions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. Enable realtime for posts (if not already enabled)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'posts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
  END IF;
END $$;

-- 8. Sample data for testing (optional - uncomment to use)
-- This matches your actual posts table structure
/*
-- Insert test posts with media
WITH test_post_1 AS (
  INSERT INTO public.posts (
    author_name, author_avatar, author_verified, caption, image_url, 
    likes_count, views_count, created_at
  ) VALUES (
    'Campus News Team', 
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face', 
    true,
    'Welcome to the new academic year! 🎓 Here are the top events and opportunities you won''t want to miss this semester.',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=675&fit=crop',
    42, 1250, now() - interval '2 hours'
  ) RETURNING id
)
INSERT INTO public.post_media (post_id, media_type, media_url, thumbnail_url, is_primary, order_index)
SELECT 
  test_post_1.id,
  'image',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=338&fit=crop',
  true, 0
FROM test_post_1;

-- Insert another post for trending
WITH test_post_2 AS (
  INSERT INTO public.posts (
    author_name, author_avatar, author_verified, caption, image_url, 
    likes_count, comments_count, shares_count, views_count, created_at
  ) VALUES (
    'International Office', 
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face', 
    true,
    '� Study abroad applications are now open! Discover amazing programs in over 30 countries and expand your horizons.',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=675&fit=crop',
    89, 23, 15, 2100, now() - interval '4 hours'
  ) RETURNING id
)
INSERT INTO public.post_media (post_id, media_type, media_url, thumbnail_url, is_primary, order_index)
SELECT 
  test_post_2.id,
  'image',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=338&fit=crop',
  true, 0
FROM test_post_2;

-- Insert a video post
INSERT INTO public.posts (
  author_name, author_avatar, author_verified, caption, video_url, 
  likes_count, comments_count, views_count, created_at
) VALUES (
  'Student Activities', 
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face', 
  false,
  '🎬 Behind the scenes of our amazing campus life! See what makes our university community so special.',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  156, 34, 3200, now() - interval '8 hours'
);
*/