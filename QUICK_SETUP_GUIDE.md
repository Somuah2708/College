# Quick Setup Guide for Your Universities Table

## ✅ **Updated for Your Table Structure**
```sql
create table public.universities (
  id uuid not null default gen_random_uuid(),
  name text not null,
  location text null,
  website text null, 
  description text null,
  created_at timestamp with time zone not null default now(),
  constraint universities_pkey primary key (id)
);
```

## 🚀 **Apply Changes (3 Steps)**

### **Step 1: Add Columns to Posts Table**
Run this in your Supabase SQL editor:

```sql
-- Add categorization columns to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS university_id uuid REFERENCES public.universities(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'news',
ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]'::jsonb;

-- Add check constraint for valid categories
ALTER TABLE public.posts 
ADD CONSTRAINT posts_category_check 
CHECK (category IN ('programs', 'academics', 'student-life', 'opportunities', 'news', 'policies', 'funding'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS posts_university_id_idx ON public.posts(university_id);
CREATE INDEX IF NOT EXISTS posts_category_idx ON public.posts(category);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts(created_at DESC);
```

### **Step 2: Categorize Existing Posts**
```sql
-- Update existing posts with categories based on content
UPDATE public.posts 
SET 
  category = CASE 
    WHEN caption ILIKE '%scholarship%' OR caption ILIKE '%financial aid%' OR caption ILIKE '%funding%' THEN 'funding'
    WHEN caption ILIKE '%program%' OR caption ILIKE '%course%' OR caption ILIKE '%degree%' THEN 'programs'
    WHEN caption ILIKE '%research%' OR caption ILIKE '%ranking%' OR caption ILIKE '%academic%' THEN 'academics'
    WHEN caption ILIKE '%student%' OR caption ILIKE '%campus%' OR caption ILIKE '%event%' THEN 'student-life'
    WHEN caption ILIKE '%internship%' OR caption ILIKE '%job%' OR caption ILIKE '%career%' OR caption ILIKE '%opportunity%' THEN 'opportunities'
    WHEN caption ILIKE '%policy%' OR caption ILIKE '%guideline%' OR caption ILIKE '%rule%' THEN 'policies'
    ELSE 'news'
  END,
  tags = CASE
    WHEN caption ILIKE '%scholarship%' THEN '["scholarship", "financial-aid", "funding"]'::jsonb
    WHEN caption ILIKE '%program%' THEN '["program", "education", "academic"]'::jsonb
    WHEN caption ILIKE '%research%' THEN '["research", "academic", "science"]'::jsonb
    WHEN caption ILIKE '%student%' THEN '["student-life", "campus", "community"]'::jsonb
    ELSE '["general", "announcement"]'::jsonb
  END
WHERE category IS NULL OR category = '';
```

### **Step 3: Inspect & Map Universities (Optional)**
First, see what universities you have:
```sql
-- Show your existing universities
SELECT id, name, location, website, description FROM universities ORDER BY name;
```

Then map posts to universities:
```sql
-- Example mapping - adjust IDs based on your data:
UPDATE posts SET university_id = 'your-stanford-id-here' WHERE author_name ILIKE '%stanford%';
UPDATE posts SET university_id = 'your-mit-id-here' WHERE author_name ILIKE '%mit%';
-- Continue for your universities...
```

## 📱 **Your App is Ready!**

Your React Native app has been updated to work with:
- ✅ Your exact universities table structure (id, name, location, website, description)
- ✅ New category filtering (Programs, Academics, Student Life, etc.)
- ✅ University filtering using your existing university data
- ✅ Combined filtering (University + Category)
- ✅ Instagram-style video playback maintained

## 🎯 **Categories Available**
- **Programs**: Degree programs, courses
- **Academics**: Research, rankings, achievements
- **Student Life**: Campus events, student experiences  
- **Opportunities**: Scholarships, internships, jobs
- **News**: University announcements
- **Policies**: Academic policies, guidelines
- **Funding**: Financial aid, grants, scholarships

After running the SQL commands above, just restart your Expo server and you'll have full university and category filtering! 🎉