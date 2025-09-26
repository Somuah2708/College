/*
  # Update existing posts with university and category assignments

  1. Data Updates
    - Assign universities to existing posts based on content analysis
    - Set appropriate categories for each post
    - Add relevant tags to posts

  2. Post Categories:
    - programs: University program announcements, course info
    - academics: Academic achievements, research, rankings
    - student-life: Student experiences, campus life, events
    - opportunities: Scholarships, internships, job openings
    - news: General university news and announcements
    - policies: University policies, guidelines, procedures
    - funding: Financial aid, grants, funding opportunities

  Note: This uses your existing universities table.
  You may need to adjust the university selection logic based on 
  what universities exist in your table and their naming.
*/

-- Update existing posts with categories (without university assignment for now)
-- You can manually assign university_id values later based on your existing data

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

-- Log completion
-- You can now manually assign university_id values by running queries like:
-- UPDATE posts SET university_id = 'your-stanford-id' WHERE author_name ILIKE '%stanford%';
-- UPDATE posts SET university_id = 'your-mit-id' WHERE author_name ILIKE '%mit%';