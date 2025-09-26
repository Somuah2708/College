/*
  # Schools and Admission Requirements System

  1. New Tables
    - `program_universities`
      - Links programs to universities that offer them
      - Stores program-specific information per university
    - `admission_requirements`
      - Comprehensive admission requirements per program-university combination
      - WASSCE subjects and grades, cut-off points, entrance exams
    - `entrance_examinations`
      - Detailed entrance exam information
      - Exam dates, fees, registration deadlines

  2. Security
    - Enable RLS on all new tables
    - Add policies for public read access
*/

-- Program Universities junction table
CREATE TABLE IF NOT EXISTS program_universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES academic_programs(id) ON DELETE CASCADE,
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  program_availability text DEFAULT 'Available',
  special_requirements text DEFAULT '',
  application_process text DEFAULT '',
  contact_info jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(program_id, university_id)
);

-- Admission Requirements table
CREATE TABLE IF NOT EXISTS admission_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_university_id uuid NOT NULL REFERENCES program_universities(id) ON DELETE CASCADE,
  wassce_subjects jsonb DEFAULT '[]',
  minimum_grades jsonb DEFAULT '{}',
  cut_off_point text DEFAULT '',
  additional_requirements text DEFAULT '',
  application_deadline timestamptz,
  information_source text DEFAULT '',
  publication_year integer DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  last_updated timestamptz DEFAULT now(),
  source_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Entrance Examinations table
CREATE TABLE IF NOT EXISTS entrance_examinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admission_requirement_id uuid NOT NULL REFERENCES admission_requirements(id) ON DELETE CASCADE,
  exam_name text NOT NULL,
  exam_description text DEFAULT '',
  exam_date timestamptz,
  registration_deadline timestamptz,
  exam_fee text DEFAULT '',
  exam_website text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE program_universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE entrance_examinations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Program universities are publicly readable"
  ON program_universities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admission requirements are publicly readable"
  ON admission_requirements
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Entrance examinations are publicly readable"
  ON entrance_examinations
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_program_universities_program_id ON program_universities(program_id);
CREATE INDEX IF NOT EXISTS idx_program_universities_university_id ON program_universities(university_id);
CREATE INDEX IF NOT EXISTS idx_admission_requirements_program_university_id ON admission_requirements(program_university_id);
CREATE INDEX IF NOT EXISTS idx_entrance_examinations_admission_requirement_id ON entrance_examinations(admission_requirement_id);