-- Helper script to inspect your existing universities table and map to posts
-- Run this in your Supabase SQL editor to see what universities you have

-- 1. Show all universities in your existing table
SELECT 'Existing Universities:' as info;
SELECT id, name, 
       COALESCE(location, '') as location,
       COALESCE(website, '') as website,
       COALESCE(description, '') as description,
       created_at
FROM universities 
ORDER BY name;

-- 2. Show existing posts that could be mapped to universities
SELECT 'Posts that could be mapped to universities:' as info;
SELECT id, author_name, LEFT(caption, 100) as caption_preview
FROM posts 
WHERE author_name IS NOT NULL
ORDER BY created_at DESC;

-- 3. Manual mapping examples (adjust based on your data)
-- Uncomment and modify these based on what you see above:

-- Example: If you have a Stanford University with id 'abc123':
-- UPDATE posts 
-- SET university_id = 'your-stanford-university-id'
-- WHERE author_name ILIKE '%stanford%';

-- Example: If you have an MIT with id 'def456':
-- UPDATE posts 
-- SET university_id = 'your-mit-university-id' 
-- WHERE author_name ILIKE '%mit%' OR caption ILIKE '%mit%';

-- 4. Check the results
SELECT 'Final mapping results:' as info;
SELECT 
  p.id,
  p.author_name,
  p.category,
  u.name as university_name,
  LEFT(p.caption, 50) as caption_preview
FROM posts p
LEFT JOIN universities u ON p.university_id = u.id
ORDER BY p.created_at DESC;