-- Add multiple images for testing auto-scroll and manual scroll
-- Replace 'YOUR_TRENDING_NEWS_ID' with an actual ID from your trending_news table

-- Example: Add 4 images to one trending news item for testing
INSERT INTO trending_news_images (trending_news_id, image_url, caption, order_index) VALUES

-- Replace this UUID with your actual trending news ID
('YOUR_TRENDING_NEWS_ID', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop', 'University Campus Main Building', 0),
('YOUR_TRENDING_NEWS_ID', 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop', 'Students in Library', 1),
('YOUR_TRENDING_NEWS_ID', 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&h=400&fit=crop', 'Science Laboratory', 2),
('YOUR_TRENDING_NEWS_ID', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop', 'Graduation Ceremony', 3);

-- Add images to another trending news item (replace the UUID)
INSERT INTO trending_news_images (trending_news_id, image_url, caption, order_index) VALUES
('ANOTHER_TRENDING_NEWS_ID', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop', 'Study Group Discussion', 0),
('ANOTHER_TRENDING_NEWS_ID', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop', 'Lecture Hall', 1),
('ANOTHER_TRENDING_NEWS_ID', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop', 'Computer Lab', 2);

-- Query to check your current trending news IDs (run this first)
-- SELECT id, headline FROM trending_news ORDER BY trending_score DESC;