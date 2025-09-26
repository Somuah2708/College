/*
  # Fix Comments Table for Post Interactions

  1. New Tables
    - `comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references posts table)
      - `user_id` (uuid, references auth.users)
      - `content` (text, comment content)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `comments` table
    - Add policies for authenticated users to manage their own comments
    - Add policy for public read access to all comments

  3. Indexes
    - Index on post_id for fast comment retrieval
    - Index on user_id for user comment management
    - Index on created_at for chronological ordering

  4. Functions
    - Auto-update timestamp trigger
    - Comment count update function for posts table
*/

-- Drop existing comments table if it exists (to ensure clean recreation)
DROP TABLE IF EXISTS comments CASCADE;

-- Create comments table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT comments_content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000),
  CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_created ON comments(post_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Comments are publicly readable"
  ON comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_comments_updated_at_trigger ON comments;
CREATE TRIGGER update_comments_updated_at_trigger
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comments_updated_at();

-- Function to increment comment count on posts
CREATE OR REPLACE FUNCTION increment_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts 
  SET comments = comments + 1 
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement comment count on posts
CREATE OR REPLACE FUNCTION decrement_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts 
  SET comments = GREATEST(comments - 1, 0)
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for comment count management
DROP TRIGGER IF EXISTS increment_comment_count_trigger ON comments;
CREATE TRIGGER increment_comment_count_trigger
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION increment_post_comment_count();

DROP TRIGGER IF EXISTS decrement_comment_count_trigger ON comments;
CREATE TRIGGER decrement_comment_count_trigger
  AFTER DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION decrement_post_comment_count();

-- Insert some sample comments for testing (optional)
DO $$
DECLARE
  sample_post_id uuid;
  sample_user_id uuid;
BEGIN
  -- Get a sample post ID (if posts exist)
  SELECT id INTO sample_post_id FROM posts LIMIT 1;
  
  -- Get a sample user ID (if users exist)
  SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
  
  -- Only insert sample comments if we have both post and user
  IF sample_post_id IS NOT NULL AND sample_user_id IS NOT NULL THEN
    INSERT INTO comments (post_id, user_id, content) VALUES
    (sample_post_id, sample_user_id, 'This is an amazing post! Thanks for sharing.'),
    (sample_post_id, sample_user_id, 'Very informative content. Looking forward to more updates like this.');
  END IF;
END $$;