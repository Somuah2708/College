/*
  # Create posts table for home screen

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `author_name` (text)
      - `author_avatar` (text)
      - `author_verified` (boolean)
      - `caption` (text)
      - `image_url` (text, nullable)
      - `video_url` (text, nullable)
      - `likes_count` (integer)
      - `comments_count` (integer)
      - `shares_count` (integer)
      - `views_count` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `posts` table
    - Add policy for public read access
    - Add policy for authenticated users to manage their own posts
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_avatar text DEFAULT '',
  author_verified boolean DEFAULT false,
  caption text NOT NULL,
  image_url text,
  video_url text,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are publicly readable"
  ON posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete their own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (true);