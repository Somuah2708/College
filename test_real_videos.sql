-- Professional College Videos with Real Working URLs
-- Run this to test your Instagram-style video implementation

-- Clear existing test data first (optional)
-- DELETE FROM public.post_media WHERE post_id IN (SELECT id FROM public.posts WHERE author_name LIKE '%Test%');
-- DELETE FROM public.posts WHERE author_name LIKE '%Test%';

-- Add professional college videos with real URLs
INSERT INTO public.posts (
  author_name, 
  author_avatar, 
  author_verified, 
  caption,
  video_url,
  likes_count,
  comments_count,
  shares_count,
  views_count,
  created_at
) VALUES 
-- Campus Tour Video
(
  'Stanford University',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
  true,
  '🎓 Take a virtual tour of our beautiful campus! From historic buildings to cutting-edge research facilities. What do you think? 🏛️✨ #CampusTour #StanfordLife',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  324,
  45,
  28,
  12500,
  now() - interval '2 hours'
),
-- Student Life Video
(
  'MIT Student Life',
  'https://images.unsplash.com/photo-1494790108755-2616c27d26ad?w=96&h=96&fit=crop&crop=face',
  false,
  '🚀 Day in the life of an MIT engineering student! From morning lectures to late-night lab sessions. The grind is real but so worth it! 💪📚 Who else is pulling all-nighters? #MITLife #Engineering #StudentLife',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  567,
  89,
  34,
  8900,
  now() - interval '4 hours'
),
-- Research Showcase
(
  'Harvard Research Lab',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face',
  true,
  '🔬 Breakthrough in quantum computing research! Our team just achieved a major milestone. Science is incredible! 🧪⚡ #Research #QuantumComputing #Harvard #Innovation',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  892,
  156,
  78,
  25600,
  now() - interval '6 hours'
),
-- Graduation Ceremony
(
  'UC Berkeley Official',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=96&h=96&fit=crop&crop=face',
  true,
  '🎉 Congratulations to our graduating class of 2025! 4 years of hard work, friendships, and memories. You did it! 🎓👏 #Graduation2025 #UCBerkeley #Proud',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  1234,
  234,
  189,
  45600,
  now() - interval '8 hours'
),
-- Sports Highlight
(
  'College Athletics',
  'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=96&h=96&fit=crop&crop=face',
  false,
  '🏀 GAME WINNER! Last second shot to win the championship! The crowd went absolutely wild! 🔥🏆 #MarchMadness #Basketball #GameWinner #Clutch',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  2456,
  445,
  567,
  89000,
  now() - interval '12 hours'
);

-- Add multiple media posts using post_media table for more professional content
WITH orientation_week AS (
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
    'NYU Student Affairs',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face',
    true,
    '📚 Orientation Week 2025 highlights! New students exploring campus, making friends, and getting ready for an amazing journey. Welcome to the NYU family! 💜 #OrientationWeek #NYU2025 #WelcomeWeek',
    456,
    67,
    23,
    15600,
    now() - interval '1 day'
  ) 
  RETURNING id
)
INSERT INTO public.post_media (post_id, media_type, media_url, thumbnail_url, is_primary, order_index, duration)
SELECT 
  orientation_week.id,
  'video',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=338&fit=crop',
  true,
  0,
  60
FROM orientation_week

UNION ALL SELECT 
  orientation_week.id,
  'video',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=338&fit=crop',
  false,
  1,
  45
FROM orientation_week;

-- Tech Conference Video
WITH tech_conference AS (
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
    'Carnegie Mellon CS',
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=96&h=96&fit=crop&crop=face',
    true,
    '💻 AI Conference 2025 was incredible! Leading researchers sharing groundbreaking insights on machine learning and robotics. The future is here! 🤖🚀 #AI2025 #MachineLearning #CarnegieMellon #TechConference',
    789,
    123,
    45,
    23400,
    now() - interval '1 day 6 hours'
  ) 
  RETURNING id
)
INSERT INTO public.post_media (post_id, media_type, media_url, thumbnail_url, is_primary, order_index, duration)
SELECT 
  tech_conference.id,
  'video',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=338&fit=crop',
  true,
  0,
  120
FROM tech_conference;

-- Study Abroad Video
INSERT INTO public.posts (
  author_name, 
  author_avatar, 
  author_verified, 
  caption,
  video_url,
  likes_count,
  comments_count,
  shares_count,
  views_count,
  created_at
) VALUES (
  'Study Abroad Program',
  'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=96&h=96&fit=crop&crop=face',
  false,
  '🌍 Study abroad in Tokyo was life-changing! From traditional temples to high-tech labs, every day was an adventure. Missing the ramen already! 🍜✈️ #StudyAbroad #Tokyo #CulturalExchange #Adventure',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  678,
  98,
  56,
  18900,
  now() - interval '2 days'
);

-- Success message
SELECT 'Professional college videos added successfully! 🎬' as message,
       'Videos include: Campus tours, student life, research, graduation, sports, conferences, and study abroad content' as content,
       'All videos use high-quality, working URLs that will showcase your Instagram-style implementation' as note;