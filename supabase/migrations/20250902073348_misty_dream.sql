/*
  # Create post_likes table for persistent like functionality

  1. New Tables
    - `post_likes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `post_id` (text, references posts table)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `post_likes` table
    - Add policy for users to manage their own likes
    - Add policy for users to view all likes (for like counts)

  3. Indexes
    - Unique constraint on user_id + post_id combination
    - Index on user_id for efficient user like queries
    - Index on post_id for efficient post like counts
*/

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Create unique constraint to prevent duplicate likes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'post_likes_user_post_unique' 
    AND table_name = 'post_likes'
  ) THEN
    ALTER TABLE post_likes ADD CONSTRAINT post_likes_user_post_unique UNIQUE (user_id, post_id);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_created_at ON post_likes(created_at DESC);

-- RLS Policies
CREATE POLICY "Users can insert their own likes"
  ON post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON post_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all likes"
  ON post_likes
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow public to view likes for like counts (optional - remove if you want likes to be private)
CREATE POLICY "Public can view likes for counts"
  ON post_likes
  FOR SELECT
  TO public
  USING (true);