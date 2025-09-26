/*
  # Add saved posts functionality

  1. New Tables
    - `saved_posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `post_id` (uuid, foreign key to posts)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `saved_posts` table
    - Add policies for authenticated users to manage their own saved posts

  3. Indexes
    - Composite index on user_id and post_id for fast lookups
    - Index on user_id for fetching user's saved posts
*/

-- Create saved_posts table
CREATE TABLE IF NOT EXISTS saved_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_posts_user_id ON saved_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_user_post ON saved_posts(user_id, post_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_saved_posts_unique ON saved_posts(user_id, post_id);

-- Enable RLS
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own saved posts"
  ON saved_posts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save posts"
  ON saved_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave their posts"
  ON saved_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);