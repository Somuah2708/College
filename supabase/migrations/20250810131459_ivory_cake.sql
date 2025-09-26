/*
  # Create Life Skills Lab tables

  1. New Tables
    - `program_life_skills`
      - `id` (uuid, primary key)
      - `program_id` (uuid, foreign key to academic_programs)
      - `skill_name` (text)
      - `skill_category` (text)
      - `skill_description` (text)
      - `detailed_content` (text)
      - `learning_objectives` (jsonb)
      - `skill_level` (text)
      - `estimated_duration` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)

    - `life_skill_videos`
      - `id` (uuid, primary key)
      - `life_skill_id` (uuid, foreign key to program_life_skills)
      - `video_title` (text)
      - `youtube_url` (text)
      - `thumbnail_url` (text)
      - `video_description` (text)
      - `duration` (text)
      - `instructor_name` (text)
      - `video_category` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)

    - `life_skill_resources`
      - `id` (uuid, primary key)
      - `life_skill_id` (uuid, foreign key to program_life_skills)
      - `resource_title` (text)
      - `resource_url` (text)
      - `resource_type` (text)
      - `resource_description` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
*/

-- Create program_life_skills table
CREATE TABLE IF NOT EXISTS program_life_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES academic_programs(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  skill_category text NOT NULL DEFAULT 'personal_development',
  skill_description text DEFAULT '',
  detailed_content text DEFAULT '',
  learning_objectives jsonb DEFAULT '[]'::jsonb,
  skill_level text DEFAULT 'beginner',
  estimated_duration text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create life_skill_videos table
CREATE TABLE IF NOT EXISTS life_skill_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  life_skill_id uuid NOT NULL REFERENCES program_life_skills(id) ON DELETE CASCADE,
  video_title text NOT NULL,
  youtube_url text NOT NULL,
  thumbnail_url text DEFAULT '',
  video_description text DEFAULT '',
  duration text DEFAULT '',
  instructor_name text DEFAULT '',
  video_category text DEFAULT 'tutorial',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create life_skill_resources table
CREATE TABLE IF NOT EXISTS life_skill_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  life_skill_id uuid NOT NULL REFERENCES program_life_skills(id) ON DELETE CASCADE,
  resource_title text NOT NULL,
  resource_url text NOT NULL,
  resource_type text DEFAULT 'article',
  resource_description text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_program_life_skills_program_id ON program_life_skills(program_id);
CREATE INDEX IF NOT EXISTS idx_program_life_skills_category ON program_life_skills(program_id, skill_category);
CREATE INDEX IF NOT EXISTS idx_program_life_skills_order ON program_life_skills(program_id, order_index);

CREATE INDEX IF NOT EXISTS idx_life_skill_videos_skill_id ON life_skill_videos(life_skill_id);
CREATE INDEX IF NOT EXISTS idx_life_skill_videos_order ON life_skill_videos(life_skill_id, order_index);

CREATE INDEX IF NOT EXISTS idx_life_skill_resources_skill_id ON life_skill_resources(life_skill_id);
CREATE INDEX IF NOT EXISTS idx_life_skill_resources_order ON life_skill_resources(life_skill_id, order_index);

-- Enable Row Level Security
ALTER TABLE program_life_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_skill_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_skill_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Program life skills are publicly readable"
  ON program_life_skills
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Life skill videos are publicly readable"
  ON life_skill_videos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Life skill resources are publicly readable"
  ON life_skill_resources
  FOR SELECT
  TO public
  USING (true);