/*
  # Create Certification Boost Tables

  1. New Tables
    - `program_certifications`
      - `id` (uuid, primary key)
      - `program_id` (uuid, foreign key to academic_programs)
      - `certification_name` (text)
      - `certification_provider` (text)
      - `certification_category` (text)
      - `certification_description` (text)
      - `detailed_content` (text)
      - `certification_level` (text)
      - `estimated_duration` (text)
      - `cost_range` (text)
      - `prerequisites` (text)
      - `learning_objectives` (jsonb)
      - `skills_gained` (jsonb)
      - `career_benefits` (text)
      - `industry_recognition` (text)
      - `certification_url` (text)
      - `provider_website` (text)
      - `application_process` (text)
      - `exam_format` (text)
      - `passing_criteria` (text)
      - `renewal_requirements` (text)
      - `study_materials` (jsonb)
      - `practice_resources` (jsonb)
      - `success_tips` (text)
      - `common_challenges` (text)
      - `job_market_demand` (text)
      - `salary_impact` (text)
      - `related_certifications` (jsonb)
      - `testimonials` (jsonb)
      - `order_index` (integer)
      - `created_at` (timestamp)

    - `certification_study_materials`
      - `id` (uuid, primary key)
      - `certification_id` (uuid, foreign key to program_certifications)
      - `material_title` (text)
      - `material_type` (text)
      - `material_url` (text)
      - `material_description` (text)
      - `is_free` (boolean)
      - `cost` (text)
      - `provider` (text)
      - `difficulty_level` (text)
      - `estimated_hours` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)

    - `certification_practice_tests`
      - `id` (uuid, primary key)
      - `certification_id` (uuid, foreign key to program_certifications)
      - `test_title` (text)
      - `test_url` (text)
      - `test_description` (text)
      - `test_type` (text)
      - `question_count` (integer)
      - `time_limit` (text)
      - `is_free` (boolean)
      - `cost` (text)
      - `provider` (text)
      - `difficulty_level` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add indexes for performance optimization

  3. Features
    - Comprehensive certification information with 300+ programs
    - Study materials and practice resources
    - Cost information and provider details
    - Career benefits and industry recognition
    - Learning objectives and skills gained
    - Application processes and exam formats
*/

-- Create program_certifications table
CREATE TABLE IF NOT EXISTS program_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES academic_programs(id) ON DELETE CASCADE,
  certification_name text NOT NULL,
  certification_provider text NOT NULL,
  certification_category text DEFAULT 'general'::text NOT NULL,
  certification_description text DEFAULT ''::text,
  detailed_content text DEFAULT ''::text,
  certification_level text DEFAULT 'beginner'::text,
  estimated_duration text DEFAULT ''::text,
  cost_range text DEFAULT ''::text,
  prerequisites text DEFAULT ''::text,
  learning_objectives jsonb DEFAULT '[]'::jsonb,
  skills_gained jsonb DEFAULT '[]'::jsonb,
  career_benefits text DEFAULT ''::text,
  industry_recognition text DEFAULT ''::text,
  certification_url text DEFAULT ''::text,
  provider_website text DEFAULT ''::text,
  application_process text DEFAULT ''::text,
  exam_format text DEFAULT ''::text,
  passing_criteria text DEFAULT ''::text,
  renewal_requirements text DEFAULT ''::text,
  study_materials jsonb DEFAULT '[]'::jsonb,
  practice_resources jsonb DEFAULT '[]'::jsonb,
  success_tips text DEFAULT ''::text,
  common_challenges text DEFAULT ''::text,
  job_market_demand text DEFAULT ''::text,
  salary_impact text DEFAULT ''::text,
  related_certifications jsonb DEFAULT '[]'::jsonb,
  testimonials jsonb DEFAULT '[]'::jsonb,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create certification_study_materials table
CREATE TABLE IF NOT EXISTS certification_study_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id uuid NOT NULL REFERENCES program_certifications(id) ON DELETE CASCADE,
  material_title text NOT NULL,
  material_type text DEFAULT 'book'::text,
  material_url text NOT NULL,
  material_description text DEFAULT ''::text,
  is_free boolean DEFAULT false,
  cost text DEFAULT ''::text,
  provider text DEFAULT ''::text,
  difficulty_level text DEFAULT 'beginner'::text,
  estimated_hours text DEFAULT ''::text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create certification_practice_tests table
CREATE TABLE IF NOT EXISTS certification_practice_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certification_id uuid NOT NULL REFERENCES program_certifications(id) ON DELETE CASCADE,
  test_title text NOT NULL,
  test_url text NOT NULL,
  test_description text DEFAULT ''::text,
  test_type text DEFAULT 'practice_exam'::text,
  question_count integer DEFAULT 0,
  time_limit text DEFAULT ''::text,
  is_free boolean DEFAULT false,
  cost text DEFAULT ''::text,
  provider text DEFAULT ''::text,
  difficulty_level text DEFAULT 'beginner'::text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE program_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_practice_tests ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Program certifications are publicly readable"
  ON program_certifications
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Certification study materials are publicly readable"
  ON certification_study_materials
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Certification practice tests are publicly readable"
  ON certification_practice_tests
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_program_certifications_program_id 
  ON program_certifications(program_id);

CREATE INDEX IF NOT EXISTS idx_program_certifications_category 
  ON program_certifications(program_id, certification_category);

CREATE INDEX IF NOT EXISTS idx_program_certifications_level 
  ON program_certifications(program_id, certification_level);

CREATE INDEX IF NOT EXISTS idx_program_certifications_order 
  ON program_certifications(program_id, order_index);

CREATE INDEX IF NOT EXISTS idx_certification_study_materials_certification_id 
  ON certification_study_materials(certification_id);

CREATE INDEX IF NOT EXISTS idx_certification_study_materials_order 
  ON certification_study_materials(certification_id, order_index);

CREATE INDEX IF NOT EXISTS idx_certification_practice_tests_certification_id 
  ON certification_practice_tests(certification_id);

CREATE INDEX IF NOT EXISTS idx_certification_practice_tests_order 
  ON certification_practice_tests(certification_id, order_index);