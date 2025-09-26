/*
  # After School Toolkit Schema

  1. New Tables
    - `program_after_school_resources`
      - `id` (uuid, primary key)
      - `program_id` (uuid, foreign key to academic_programs)
      - `resource_title` (text)
      - `resource_category` (text) - cv_writing, interview_prep, national_service, financial_planning, etc.
      - `resource_description` (text)
      - `detailed_content` (text) - elaborate content for the resource
      - `checklist_items` (jsonb) - array of checklist items
      - `youtube_videos` (jsonb) - array of YouTube video objects
      - `external_resources` (jsonb) - array of additional resource links
      - `tips_and_advice` (text)
      - `common_mistakes` (text)
      - `success_stories` (text)
      - `order_index` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `program_after_school_resources` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS program_after_school_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES academic_programs(id) ON DELETE CASCADE,
  resource_title text NOT NULL,
  resource_category text NOT NULL DEFAULT 'general',
  resource_description text DEFAULT '',
  detailed_content text DEFAULT '',
  checklist_items jsonb DEFAULT '[]'::jsonb,
  youtube_videos jsonb DEFAULT '[]'::jsonb,
  external_resources jsonb DEFAULT '[]'::jsonb,
  tips_and_advice text DEFAULT '',
  common_mistakes text DEFAULT '',
  success_stories text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_program_after_school_resources_program_id 
ON program_after_school_resources(program_id);

CREATE INDEX IF NOT EXISTS idx_program_after_school_resources_category 
ON program_after_school_resources(program_id, resource_category);

CREATE INDEX IF NOT EXISTS idx_program_after_school_resources_order 
ON program_after_school_resources(program_id, order_index);

-- Enable RLS
ALTER TABLE program_after_school_resources ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "After school resources are publicly readable"
  ON program_after_school_resources
  FOR SELECT
  TO public
  USING (true);