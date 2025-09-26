/*
  # Create Inspirational Entertainment System

  1. New Tables
    - `program_entertainment_categories`
      - `id` (uuid, primary key)
      - `program_id` (uuid, foreign key to academic_programs)
      - `category_name` (text) - e.g., "Coding & Programming", "AI & Machine Learning"
      - `category_description` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)

    - `entertainment_content`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key to program_entertainment_categories)
      - `title` (text) - Movie/series title
      - `content_type` (text) - "movie", "series", "documentary"
      - `release_year` (integer)
      - `genre` (text)
      - `description` (text)
      - `imdb_rating` (numeric)
      - `duration` (text) - e.g., "2h 30m" or "8 episodes"
      - `trailer_url` (text)
      - `poster_image_url` (text)
      - `relevance_explanation` (text) - Why it's relevant to the program aspect
      - `key_themes` (jsonb) - Array of themes
      - `educational_value` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)

    - `entertainment_streaming_platforms`
      - `id` (uuid, primary key)
      - `content_id` (uuid, foreign key to entertainment_content)
      - `platform_name` (text) - e.g., "Netflix", "Amazon Prime", "Hulu"
      - `platform_url` (text)
      - `availability_region` (text) - e.g., "US", "Global", "UK"
      - `subscription_required` (boolean)
      - `rental_price` (text) - e.g., "$3.99", "Free with ads"
      - `purchase_price` (text)
      - `platform_logo_url` (text)
      - `last_verified` (timestamp)
      - `order_index` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add indexes for performance

  3. Sample Data
    - Computer Science categories and movies
    - Streaming platform information
*/

-- Create program entertainment categories table
CREATE TABLE IF NOT EXISTS program_entertainment_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES academic_programs(id) ON DELETE CASCADE,
  category_name text NOT NULL,
  category_description text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create entertainment content table
CREATE TABLE IF NOT EXISTS entertainment_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES program_entertainment_categories(id) ON DELETE CASCADE,
  title text NOT NULL,
  content_type text DEFAULT 'movie',
  release_year integer,
  genre text DEFAULT '',
  description text DEFAULT '',
  imdb_rating numeric(3,1),
  duration text DEFAULT '',
  trailer_url text DEFAULT '',
  poster_image_url text DEFAULT '',
  relevance_explanation text DEFAULT '',
  key_themes jsonb DEFAULT '[]',
  educational_value text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create streaming platforms table
CREATE TABLE IF NOT EXISTS entertainment_streaming_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES entertainment_content(id) ON DELETE CASCADE,
  platform_name text NOT NULL,
  platform_url text DEFAULT '',
  availability_region text DEFAULT 'Global',
  subscription_required boolean DEFAULT true,
  rental_price text DEFAULT '',
  purchase_price text DEFAULT '',
  platform_logo_url text DEFAULT '',
  last_verified timestamptz DEFAULT now(),
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE program_entertainment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE entertainment_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE entertainment_streaming_platforms ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Entertainment categories are publicly readable"
  ON program_entertainment_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Entertainment content is publicly readable"
  ON entertainment_content
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Streaming platforms are publicly readable"
  ON entertainment_streaming_platforms
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_program_entertainment_categories_program_id 
  ON program_entertainment_categories(program_id);
CREATE INDEX IF NOT EXISTS idx_program_entertainment_categories_order 
  ON program_entertainment_categories(program_id, order_index);

CREATE INDEX IF NOT EXISTS idx_entertainment_content_category_id 
  ON entertainment_content(category_id);
CREATE INDEX IF NOT EXISTS idx_entertainment_content_order 
  ON entertainment_content(category_id, order_index);
CREATE INDEX IF NOT EXISTS idx_entertainment_content_type 
  ON entertainment_content(category_id, content_type);

CREATE INDEX IF NOT EXISTS idx_entertainment_streaming_platforms_content_id 
  ON entertainment_streaming_platforms(content_id);
CREATE INDEX IF NOT EXISTS idx_entertainment_streaming_platforms_order 
  ON entertainment_streaming_platforms(content_id, order_index);