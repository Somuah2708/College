-- Create trending_news table
CREATE TABLE IF NOT EXISTS trending_news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    headline TEXT NOT NULL,
    summary TEXT,
    thumbnail_url TEXT,
    category TEXT DEFAULT 'General',
    source TEXT NOT NULL,
    trending_score INTEGER DEFAULT 50,
    read_time TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Add RLS (Row Level Security)
ALTER TABLE trending_news ENABLE ROW LEVEL SECURITY;

-- Allow public to read trending news
CREATE POLICY "Anyone can view trending news" ON trending_news
    FOR SELECT USING (is_active = true);

-- Only authenticated users can insert/update (for admin panel later)
CREATE POLICY "Authenticated users can insert trending news" ON trending_news
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update trending news" ON trending_news
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX idx_trending_news_score ON trending_news(trending_score DESC);
CREATE INDEX idx_trending_news_published ON trending_news(published_at DESC);
CREATE INDEX idx_trending_news_active ON trending_news(is_active);

-- Insert some sample trending news
INSERT INTO trending_news (headline, summary, thumbnail_url, category, source, trending_score) VALUES
('New AI Research Lab Opens at MIT', 'Massachusetts Institute of Technology unveils state-of-the-art artificial intelligence research facility with cutting-edge equipment and renowned researchers.', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop', 'Technology', 'MIT News', 95),

('Global Student Exchange Program Launches', 'Universities worldwide collaborate on unprecedented international exchange initiative, offering students opportunities to study across continents with full scholarship support.', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop', 'Education', 'Education Weekly', 88),

('Record-Breaking Scholarship Fund Announced', 'Private foundation commits $500M to support underrepresented students in STEM fields, marking the largest educational grant in recent history.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop', 'Finance', 'Financial Times', 92),

('Virtual Reality Classrooms Transform Learning', 'Revolutionary VR technology implementation across 200+ universities shows 40% improvement in student engagement and comprehension rates.', 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400&h=200&fit=crop', 'Technology', 'EdTech Today', 85),

('Climate Change Research Initiative Expands', 'International consortium of universities launches $2B research program to tackle climate change, involving over 50 institutions across 20 countries.', 'https://images.unsplash.com/photo-1569163139842-de4bfdd3f6c2?w=400&h=200&fit=crop', 'Research', 'Science Daily', 78);