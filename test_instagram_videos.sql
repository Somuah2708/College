-- Test video post with working video URL for Instagram-style playback

INSERT INTO public.posts (
  author_name, 
  author_avatar, 
  author_verified, 
  caption,
  video_url,
  likes_count,
  views_count,
  created_at
) VALUES (
  'Campus Media Team',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face',
  true,
  '🎥 Welcome to our beautiful campus! Take a quick tour and see what makes our university special. Tap to play the video! 🎓',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  25,
  1200,
  now() - interval '3 hours'
);

-- Add another video using post_media for testing
WITH campus_video AS (
  INSERT INTO public.posts (
    author_name, 
    author_avatar, 
    author_verified, 
    caption,
    likes_count,
    comments_count,
    views_count,
    created_at
  ) VALUES (
    'Student Life',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
    false,
    '🎬 Behind the scenes at our orientation week! So much fun and energy. Swipe to see both videos from the event! 📹✨',
    45,
    12,
    2800,
    now() - interval '5 hours'
  ) 
  RETURNING id
)
INSERT INTO public.post_media (post_id, media_type, media_url, thumbnail_url, is_primary, order_index, duration)
SELECT 
  campus_video.id,
  'video',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=338&fit=crop',
  true,  -- PRIMARY VIDEO
  0,     -- First video
  30     -- 30 seconds
FROM campus_video

UNION ALL SELECT 
  campus_video.id,
  'video',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=338&fit=crop',
  false, -- Second video
  1,     -- Second in order
  45     -- 45 seconds
FROM campus_video;