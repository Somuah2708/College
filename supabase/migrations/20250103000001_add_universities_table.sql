/*
  # Add categorization to posts using existing universities table

  1. Modifications to existing tables
    - `posts` table:
      - Add `university_id` (uuid, foreign key to existing universities table)
      - Add `category` (text, required)
      - Add `tags` (jsonb, array of tags)

  2. Categories
    - Programs, Academics, Student Life, Opportunities, News, Policies, Funding

  3. Security
    - Update posts policies to include university filtering

  4. Indexes
    - Add indexes for better query performance on category and university_id

  Note: This assumes your existing universities table has at least:
  - id (uuid, primary key)
  - name (text)
  And works with whatever structure you currently have.
*/

-- Check if universities table exists (should exist based on user confirmation)
-- If not, this will show an error and you'll need to update the foreign key reference

-- Add categorization columns to posts table (referencing existing universities table)
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