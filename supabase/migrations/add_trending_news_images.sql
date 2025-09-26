-- Add support for multiple images in trending_news table
CREATE TABLE IF NOT EXISTS trending_news_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trending_news_id UUID REFERENCES trending_news(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX idx_trending_news_images_news_id ON trending_news_images(trending_news_id);
CREATE INDEX idx_trending_news_images_order ON trending_news_images(trending_news_id, order_index);

-- Enable RLS
ALTER TABLE trending_news_images ENABLE ROW LEVEL SECURITY;

-- Allow public to read images
CREATE POLICY "Anyone can view trending news images" ON trending_news_images
    FOR SELECT USING (true);

-- Only authenticated users can manage images
CREATE POLICY "Authenticated users can insert trending news images" ON trending_news_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert sample images for existing trending news
-- You'll need to replace these UUIDs with actual IDs from your trending_news table
INSERT INTO trending_news_images (trending_news_id, image_url, caption, order_index) 
SELECT 
    tn.id,
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    'AI Lab Main Facility',
    0
FROM trending_news tn 
WHERE tn.headline LIKE '%AI Research Lab%'
LIMIT 1;

INSERT INTO trending_news_images (trending_news_id, image_url, caption, order_index) 
SELECT 
    tn.id,
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    'Research Equipment',
    1
FROM trending_news tn 
WHERE tn.headline LIKE '%AI Research Lab%'
LIMIT 1;

INSERT INTO trending_news_images (trending_news_id, image_url, caption, order_index) 
SELECT 
    tn.id,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    'Students in Lab',
    2
FROM trending_news tn 
WHERE tn.headline LIKE '%AI Research Lab%'
LIMIT 1;