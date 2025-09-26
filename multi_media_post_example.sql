-- Example: Multi-media post with 3 images + 2 videos
-- This creates a post about a campus event with mixed media

-- Step 1: Create the main post
WITH campus_event_post AS (
  INSERT INTO public.posts (
    author_name, 
    author_avatar, 
    author_verified, 
    caption,
    likes_count,
    comments_count,
    shares_count,
    views_count,
    created_at
  ) VALUES (
    'Campus Events Team',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face',
    true,
    '🎉 What an amazing Freshers Week! Here are the highlights from our welcome events. Swipe through to see all the fun moments and behind-the-scenes action! 📸🎬 #FreshersWeek2025 #CampusLife',
    0, 0, 0, 0,
    now()
  ) 
  RETURNING id
)
-- Step 2: Insert all 5 media items for this post
INSERT INTO public.post_media (post_id, media_type, media_url, thumbnail_url, is_primary, order_index, duration)
SELECT 
  campus_event_post.id,
  'image',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=338&fit=crop',
  true,  -- PRIMARY IMAGE (shows first in feed)
  0,     -- First media item
  null   -- No duration for images
FROM campus_event_post

UNION ALL SELECT 
  campus_event_post.id,
  'video',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=338&fit=crop',
  false, -- Not primary
  1,     -- Second media item
  180    -- 3 minutes video
FROM campus_event_post

UNION ALL SELECT 
  campus_event_post.id,
  'image',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=338&fit=crop',
  false, -- Not primary
  2,     -- Third media item
  null   -- No duration for images
FROM campus_event_post

UNION ALL SELECT 
  campus_event_post.id,
  'image',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=338&fit=crop',
  false, -- Not primary
  3,     -- Fourth media item
  null   -- No duration for images
FROM campus_event_post

UNION ALL SELECT 
  campus_event_post.id,
  'video',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=338&fit=crop',
  false, -- Not primary
  4,     -- Fifth (last) media item
  240    -- 4 minutes video
FROM campus_event_post;