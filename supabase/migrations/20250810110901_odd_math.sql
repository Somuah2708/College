/*
  # Add Tools & Resources and Internship Hub functionality

  1. New Tables
    - `program_tools_resources`
      - `id` (uuid, primary key)
      - `program_id` (uuid, foreign key to academic_programs)
      - `resource_name` (text)
      - `resource_type` (text) - books, software, equipment, journals, etc.
      - `description` (text)
      - `purchase_links` (jsonb) - array of purchase/access links
      - `price_range` (text)
      - `necessity_level` (text) - required, recommended, optional
      - `category` (text) - learning materials, equipment, software, etc.
      - `order_index` (integer)
      - `created_at` (timestamptz)

    - `program_internships`
      - `id` (uuid, primary key)
      - `program_id` (uuid, foreign key to academic_programs)
      - `organization_name` (text)
      - `position_title` (text)
      - `description` (text)
      - `location_address` (text)
      - `location_city` (text)
      - `location_country` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `application_url` (text)
      - `application_email` (text)
      - `application_deadline` (timestamptz)
      - `duration` (text)
      - `compensation` (text)
      - `requirements` (text)
      - `google_maps_link` (text)
      - `organization_website` (text)
      - `is_remote` (boolean)
      - `order_index` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

-- Create program_tools_resources table
CREATE TABLE IF NOT EXISTS program_tools_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES academic_programs(id) ON DELETE CASCADE,
  resource_name text NOT NULL,
  resource_type text NOT NULL DEFAULT 'learning_material',
  description text DEFAULT '',
  purchase_links jsonb DEFAULT '[]'::jsonb,
  price_range text DEFAULT '',
  necessity_level text DEFAULT 'recommended',
  category text DEFAULT 'general',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create program_internships table
CREATE TABLE IF NOT EXISTS program_internships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES academic_programs(id) ON DELETE CASCADE,
  organization_name text NOT NULL,
  position_title text NOT NULL,
  description text DEFAULT '',
  location_address text DEFAULT '',
  location_city text DEFAULT '',
  location_country text DEFAULT '',
  latitude decimal(10,8) DEFAULT NULL,
  longitude decimal(11,8) DEFAULT NULL,
  application_url text DEFAULT '',
  application_email text DEFAULT '',
  application_deadline timestamptz DEFAULT NULL,
  duration text DEFAULT '',
  compensation text DEFAULT '',
  requirements text DEFAULT '',
  google_maps_link text DEFAULT '',
  organization_website text DEFAULT '',
  is_remote boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_program_tools_resources_program_id ON program_tools_resources(program_id);
CREATE INDEX IF NOT EXISTS idx_program_tools_resources_category ON program_tools_resources(program_id, category);
CREATE INDEX IF NOT EXISTS idx_program_tools_resources_type ON program_tools_resources(program_id, resource_type);
CREATE INDEX IF NOT EXISTS idx_program_internships_program_id ON program_internships(program_id);
CREATE INDEX IF NOT EXISTS idx_program_internships_location ON program_internships(program_id, location_city, location_country);
CREATE INDEX IF NOT EXISTS idx_program_internships_remote ON program_internships(program_id, is_remote);

-- Enable RLS
ALTER TABLE program_tools_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_internships ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for public read access
CREATE POLICY "Program tools and resources are publicly readable"
  ON program_tools_resources
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Program internships are publicly readable"
  ON program_internships
  FOR SELECT
  TO public
  USING (true);