-- Create post_media table for Home screen backend integration
-- This script is idempotent - safe to run multiple times

-- Create the post_media table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.post_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE,
  
  -- Media details
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
  
  -- Organization
  order_index integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  
  -- Processing status
  processing_status text DEFAULT 'completed' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_post_media_post_id ON public.post_media(post_id, order_index);
CREATE INDEX IF NOT EXISTS idx_post_media_type ON public.post_media(media_type);

-- Enable Row Level Security
ALTER TABLE public.post_media ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for public reading (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'post_media' 
    AND policyname = 'Post media is publicly readable'
  ) THEN
    CREATE POLICY "Post media is publicly readable" ON public.post_media
      FOR SELECT TO public
      USING (EXISTS (
        SELECT 1 FROM public.posts 
        WHERE posts.id = post_media.post_id 
        AND posts.status = 'published' 
        AND posts.visibility = 'public'
      ));
  END IF;
END $$;

-- Create RLS policy for authenticated users managing their media (if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'post_media' 
    AND policyname = 'Users can manage media for their posts'
  ) THEN
    CREATE POLICY "Users can manage media for their posts" ON public.post_media
      FOR ALL TO authenticated
      USING (EXISTS (
        SELECT 1 FROM public.posts 
        WHERE posts.id = post_media.post_id 
        AND posts.author_id = auth.uid()
      ))
      WITH CHECK (EXISTS (
        SELECT 1 FROM public.posts 
        WHERE posts.id = post_media.post_id 
        AND posts.author_id = auth.uid()
      ));
  END IF;
END $$;

-- Add posts table to realtime publication (idempotent)
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

-- Optional: Insert a sample post with media for testing
-- Uncomment the following lines if you want sample data

/*
-- Insert sample post
INSERT INTO public.posts (
  author_id, author_name, author_username, author_avatar_url, author_verified, author_role,
  caption, post_type, content_data, status, visibility, tags, category, location,
  trending_score, published_at
) VALUES (
  gen_random_uuid(), 'Campus Team', 'campus_official', 'https://placehold.co/96x96', true, 'admin',
  'Welcome to the new semester! Check out upcoming events and opportunities.', 'image',
  '{"title":"Welcome Week 2025","summary":"New semester events, club fairs, and academic resources"}'::jsonb,
  'published', 'public', ARRAY['welcome','events','semester'], 'news', 'Main Campus',
  15.0, now()
) 
ON CONFLICT DO NOTHING
RETURNING id;

-- Insert sample media (replace the post_id with actual ID if running separately)
-- You'll need to get the post ID from the above insert or use an existing post ID
INSERT INTO public.post_media (post_id, media_type, media_url, thumbnail_url, is_primary, order_index)
SELECT 
  p.id, 
  'image', 
  'https://placehold.co/1200x675/4F46E5/FFFFFF?text=Welcome+Week', 
  'https://placehold.co/600x338/4F46E5/FFFFFF?text=Welcome+Week', 
  true, 
  0
FROM public.posts p 
WHERE p.author_username = 'campus_official' 
AND p.caption LIKE 'Welcome to the new semester!%'
LIMIT 1
ON CONFLICT DO NOTHING;
*/