/*
  # Create Entrepreneurship Support System

  1. New Tables
    - `program_entrepreneurship_resources`
      - `id` (uuid, primary key)
      - `program_id` (uuid, foreign key to academic_programs)
      - `resource_name` (text, name of the entrepreneurship resource)
      - `resource_type` (text, type: club, incubator, competition, training, innovation_lab)
      - `organization_name` (text, name of organizing body)
      - `resource_description` (text, detailed description)
      - `detailed_content` (text, comprehensive information)
      - `benefits_offered` (jsonb, array of benefits and opportunities)
      - `requirements_checklist` (jsonb, array of requirements with priority levels)
      - `application_process` (text, how to apply or join)
      - `application_deadline` (timestamptz, deadline if applicable)
      - `application_url` (text, direct application link)
      - `contact_email` (text, contact information)
      - `contact_phone` (text, phone contact)
      - `program_duration` (text, duration of program/resource)
      - `funding_amount` (text, funding available if applicable)
      - `success_stories` (text, alumni success examples)
      - `additional_resources` (jsonb, external links and tools)
      - `tips_and_advice` (text, expert advice)
      - `common_mistakes` (text, pitfalls to avoid)
      - `resource_category` (text, broader category grouping)
      - `order_index` (integer, display order)
      - `created_at` (timestamptz)

    - `entrepreneurship_videos`
      - `id` (uuid, primary key)
      - `entrepreneurship_resource_id` (uuid, foreign key)
      - `video_title` (text, YouTube video title)
      - `youtube_url` (text, YouTube video URL)
      - `thumbnail_url` (text, video thumbnail)
      - `video_description` (text, description of video content)
      - `duration` (text, video duration)
      - `instructor_name` (text, video instructor/creator)
      - `video_category` (text, tutorial, workshop, case_study, etc.)
      - `order_index` (integer, display order)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add indexes for performance optimization
*/

-- Create program entrepreneurship resources table
CREATE TABLE IF NOT EXISTS program_entrepreneurship_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES academic_programs(id) ON DELETE CASCADE,
  resource_name text NOT NULL,
  resource_type text NOT NULL DEFAULT 'club',
  organization_name text NOT NULL DEFAULT '',
  resource_description text DEFAULT '',
  detailed_content text DEFAULT '',
  benefits_offered jsonb DEFAULT '[]'::jsonb,
  requirements_checklist jsonb DEFAULT '[]'::jsonb,
  application_process text DEFAULT '',
  application_deadline timestamptz,
  application_url text DEFAULT '',
  contact_email text DEFAULT '',
  contact_phone text DEFAULT '',
  program_duration text DEFAULT '',
  funding_amount text DEFAULT '',
  success_stories text DEFAULT '',
  additional_resources jsonb DEFAULT '[]'::jsonb,
  tips_and_advice text DEFAULT '',
  common_mistakes text DEFAULT '',
  resource_category text DEFAULT 'general',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create entrepreneurship videos table
CREATE TABLE IF NOT EXISTS entrepreneurship_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entrepreneurship_resource_id uuid NOT NULL REFERENCES program_entrepreneurship_resources(id) ON DELETE CASCADE,
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

-- Enable RLS
ALTER TABLE program_entrepreneurship_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE entrepreneurship_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Entrepreneurship resources are publicly readable"
  ON program_entrepreneurship_resources
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Entrepreneurship videos are publicly readable"
  ON entrepreneurship_videos
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_program_entrepreneurship_resources_program_id 
  ON program_entrepreneurship_resources(program_id);

CREATE INDEX IF NOT EXISTS idx_program_entrepreneurship_resources_type 
  ON program_entrepreneurship_resources(program_id, resource_type);

CREATE INDEX IF NOT EXISTS idx_program_entrepreneurship_resources_category 
  ON program_entrepreneurship_resources(program_id, resource_category);

CREATE INDEX IF NOT EXISTS idx_program_entrepreneurship_resources_order 
  ON program_entrepreneurship_resources(program_id, order_index);

CREATE INDEX IF NOT EXISTS idx_entrepreneurship_videos_resource_id 
  ON entrepreneurship_videos(entrepreneurship_resource_id);

CREATE INDEX IF NOT EXISTS idx_entrepreneurship_videos_order 
  ON entrepreneurship_videos(entrepreneurship_resource_id, order_index);