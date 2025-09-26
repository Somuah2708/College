-- Fixed video post with working URLs and proper thumbnails

-- Test with a single working video first
INSERT INTO public.posts (
  author_name, 
  author_avatar, 
  author_verified, 
  caption,
  video_url,  -- Using the simple video_url column first
  likes_count,
  views_count,
  created_at
) VALUES (
  'Campus Media',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face',
  true,
  '🎬 Check out this amazing campus tour video! See all the beautiful spots on our campus.',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', -- Working sample video
  15,
  320,
  now() - interval '1 hour'
);

-- Test with post_media approach using working video URLs
WITH video_post AS (
  INSERT INTO public.posts (
    author_name, 
    author_avatar, 
    author_verified, 
    caption,
    likes_count,
    views_count,
    created_at
  ) VALUES (
    'Student Activities',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
    true,
    '📹 Behind the scenes at our welcome ceremony! Two amazing moments captured on video.',
    25,
    450,
    now() - interval '30 minutes'
  ) 
  RETURNING id
)
INSERT INTO public.post_media (post_id, media_type, media_url, thumbnail_url, is_primary, order_index, duration)
SELECT 
  video_post.id,
  'video',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4', -- Working video
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=338&fit=crop', -- Actual thumbnail
  true,  -- PRIMARY VIDEO
  0,     -- First media
  45     -- 45 seconds
FROM video_post

UNION ALL SELECT 
  video_post.id,
  'video',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', -- Another working video
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=338&fit=crop', -- Different thumbnail
  false, -- Not primary
  1,     -- Second media
  30     -- 30 seconds
FROM video_post;