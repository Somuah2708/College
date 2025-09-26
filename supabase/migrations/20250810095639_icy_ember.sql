/*
  # Enhance Academic Programs Table

  1. New Columns Added
    - `description` (text): General overview of the program
    - `program_code` (text): Unique identifier or code for the program
    - `admission_requirements` (jsonb): Structured data for requirements (GPA, test scores, essays, etc.)
    - `application_deadline` (timestamp): Final date for applications
    - `tuition_fees` (text): Information about tuition costs
    - `financial_aid_options` (text): Details about scholarships, grants, and loans
    - `curriculum_overview` (text): Summary of program's curriculum structure
    - `course_list_json` (jsonb): Array of course objects with details
    - `faculty_details` (jsonb): Information about key faculty members
    - `career_prospects` (jsonb): Potential job roles, industries, and career paths
    - `employment_statistics` (text): Employment rates and salary data
    - `research_opportunities` (text): Research projects and lab opportunities
    - `accreditation_info` (text): Program accreditation details
    - `contact_email` (text): Email for program inquiries
    - `contact_phone` (text): Phone number for program inquiries
    - `program_website_url` (text): Official program website URL

  2. Security
    - Maintain existing RLS settings
    - No changes to existing policies
*/

-- Add new columns to academic_programs table
DO $$
BEGIN
  -- Add description column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'description'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN description text DEFAULT '';
  END IF;

  -- Add program_code column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'program_code'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN program_code text DEFAULT '';
  END IF;

  -- Add admission_requirements column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'admission_requirements'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN admission_requirements jsonb DEFAULT '{}';
  END IF;

  -- Add application_deadline column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'application_deadline'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN application_deadline timestamptz;
  END IF;

  -- Add tuition_fees column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'tuition_fees'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN tuition_fees text DEFAULT '';
  END IF;

  -- Add financial_aid_options column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'financial_aid_options'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN financial_aid_options text DEFAULT '';
  END IF;

  -- Add curriculum_overview column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'curriculum_overview'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN curriculum_overview text DEFAULT '';
  END IF;

  -- Add course_list_json column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'course_list_json'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN course_list_json jsonb DEFAULT '[]';
  END IF;

  -- Add faculty_details column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'faculty_details'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN faculty_details jsonb DEFAULT '[]';
  END IF;

  -- Add career_prospects column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'career_prospects'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN career_prospects jsonb DEFAULT '{}';
  END IF;

  -- Add employment_statistics column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'employment_statistics'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN employment_statistics text DEFAULT '';
  END IF;

  -- Add research_opportunities column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'research_opportunities'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN research_opportunities text DEFAULT '';
  END IF;

  -- Add accreditation_info column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'accreditation_info'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN accreditation_info text DEFAULT '';
  END IF;

  -- Add contact_email column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'contact_email'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN contact_email text DEFAULT '';
  END IF;

  -- Add contact_phone column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'contact_phone'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN contact_phone text DEFAULT '';
  END IF;

  -- Add program_website_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'academic_programs' AND column_name = 'program_website_url'
  ) THEN
    ALTER TABLE academic_programs ADD COLUMN program_website_url text DEFAULT '';
  END IF;
END $$;