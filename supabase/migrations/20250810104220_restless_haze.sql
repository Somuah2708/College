/*
  # Add Program Videos and Course Journey Tables

  1. New Tables
    - `program_videos`
      - `id` (uuid, primary key)
      - `program_id` (uuid, foreign key to academic_programs)
      - `title` (text)
      - `youtube_url` (text)
      - `thumbnail_url` (text)
      - `description` (text)
      - `duration` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)

    - `program_courses`
      - `id` (uuid, primary key)
      - `program_id` (uuid, foreign key to academic_programs)
      - `course_code` (text)
      - `course_name` (text)
      - `semester` (integer)
      - `year` (integer)
      - `credits` (integer)
      - `description` (text)
      - `prerequisites` (text)
      - `created_at` (timestamp)

    - `course_videos`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key to program_courses)
      - `title` (text)
      - `youtube_url` (text)
      - `thumbnail_url` (text)
      - `description` (text)
      - `duration` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)

  2. Enhanced academic_programs table
    - Add `history_and_evolution` (text)
    - Add `core_philosophy` (text)
    - Add `purpose` (text)
    - Add `relevance_and_applications` (text)
    - Add `wikipedia_links` (jsonb)
    - Add `external_links` (jsonb)

  3. Security
    - Enable RLS on all new tables
    - Add policies for public read access
*/

-- Add new columns to academic_programs table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'history_and_evolution'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN history_and_evolution text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'core_philosophy'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN core_philosophy text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'purpose'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN purpose text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'relevance_and_applications'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN relevance_and_applications text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'wikipedia_links'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN wikipedia_links jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'external_links'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN external_links jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Create program_videos table
CREATE TABLE IF NOT EXISTS program_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES academic_programs(id) ON DELETE CASCADE,
  title text NOT NULL,
  youtube_url text NOT NULL,
  thumbnail_url text DEFAULT '',
  description text DEFAULT '',
  duration text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE program_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Program videos are publicly readable"
  ON program_videos
  FOR SELECT
  TO public
  USING (true);

-- Create program_courses table
CREATE TABLE IF NOT EXISTS program_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES academic_programs(id) ON DELETE CASCADE,
  course_code text NOT NULL,
  course_name text NOT NULL,
  semester integer NOT NULL DEFAULT 1,
  year integer NOT NULL DEFAULT 1,
  credits integer DEFAULT 3,
  description text DEFAULT '',
  prerequisites text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE program_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Program courses are publicly readable"
  ON program_courses
  FOR SELECT
  TO public
  USING (true);

-- Create course_videos table
CREATE TABLE IF NOT EXISTS course_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES program_courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  youtube_url text NOT NULL,
  thumbnail_url text DEFAULT '',
  description text DEFAULT '',
  duration text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE course_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Course videos are publicly readable"
  ON course_videos
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_program_videos_program_id ON program_videos(program_id);
CREATE INDEX IF NOT EXISTS idx_program_videos_order ON program_videos(program_id, order_index);
CREATE INDEX IF NOT EXISTS idx_program_courses_program_id ON program_courses(program_id);
CREATE INDEX IF NOT EXISTS idx_program_courses_semester ON program_courses(program_id, year, semester);
CREATE INDEX IF NOT EXISTS idx_course_videos_course_id ON course_videos(course_id);
CREATE INDEX IF NOT EXISTS idx_course_videos_order ON course_videos(course_id, order_index);