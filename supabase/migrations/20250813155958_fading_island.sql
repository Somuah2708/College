/*
  # Fix University Scholarships & Financial Aid Table

  1. New Columns Added
    - `financial_aid_overview` (text) - University's commitment to accessible education
    - `scholarship_office_contact` (jsonb) - Complete contact information for financial aid office
    - `merit_based_scholarships` (jsonb) - Academic excellence and entrance scholarships
    - `need_based_scholarships` (jsonb) - Low-income background support programs
    - `special_category_scholarships` (jsonb) - Sports, arts, leadership, disability, regional awards
    - `donor_sponsored_scholarships` (jsonb) - Alumni, corporate, and foundation funded scholarships
    - `financial_aid_options` (jsonb) - Bursaries, work-study, loans, fee waivers
    - `eligibility_requirements_detailed` (text) - Comprehensive eligibility criteria
    - `application_process_guide` (text) - Step-by-step application instructions
    - `required_documents_checklist` (jsonb) - Complete document requirements
    - `renewal_conditions` (text) - Renewal criteria and GPA requirements
    - `external_scholarships_linked` (jsonb) - Government and international partner programs
    - `scholarship_success_stories` (jsonb) - Alumni testimonials and success profiles
    - `scholarship_videos` (jsonb) - 25+ videos covering all scholarship aspects
    - `application_deadlines_calendar` (jsonb) - Comprehensive deadlines calendar
    - `financial_need_assessment` (text) - Financial need evaluation criteria
    - `scholarship_statistics` (jsonb) - Success rates and award distribution data
    - `emergency_financial_support` (text) - Crisis support and emergency aid options

  2. Security
    - Enable RLS on `university_scholarships` table
    - Add policy for public read access
*/

-- Add new columns to university_scholarships table
DO $$
BEGIN
  -- Financial aid overview
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'financial_aid_overview'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN financial_aid_overview text DEFAULT '';
  END IF;

  -- Scholarship office contact
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'scholarship_office_contact'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN scholarship_office_contact jsonb DEFAULT '{}';
  END IF;

  -- Merit-based scholarships
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'merit_based_scholarships'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN merit_based_scholarships jsonb DEFAULT '[]';
  END IF;

  -- Need-based scholarships
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'need_based_scholarships'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN need_based_scholarships jsonb DEFAULT '[]';
  END IF;

  -- Special category scholarships
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'special_category_scholarships'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN special_category_scholarships jsonb DEFAULT '[]';
  END IF;

  -- Donor sponsored scholarships
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'donor_sponsored_scholarships'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN donor_sponsored_scholarships jsonb DEFAULT '[]';
  END IF;

  -- Financial aid options
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'financial_aid_options'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN financial_aid_options jsonb DEFAULT '{}';
  END IF;

  -- Eligibility requirements detailed
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'eligibility_requirements_detailed'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN eligibility_requirements_detailed text DEFAULT '';
  END IF;

  -- Application process guide
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'application_process_guide'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN application_process_guide text DEFAULT '';
  END IF;

  -- Required documents checklist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'required_documents_checklist'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN required_documents_checklist jsonb DEFAULT '[]';
  END IF;

  -- Renewal conditions
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'renewal_conditions'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN renewal_conditions text DEFAULT '';
  END IF;

  -- External scholarships linked
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'external_scholarships_linked'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN external_scholarships_linked jsonb DEFAULT '[]';
  END IF;

  -- Scholarship success stories
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'scholarship_success_stories'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN scholarship_success_stories jsonb DEFAULT '[]';
  END IF;

  -- Scholarship videos
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'scholarship_videos'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN scholarship_videos jsonb DEFAULT '[]';
  END IF;

  -- Application deadlines calendar
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'application_deadlines_calendar'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN application_deadlines_calendar jsonb DEFAULT '{}';
  END IF;

  -- Financial need assessment
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'financial_need_assessment'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN financial_need_assessment text DEFAULT '';
  END IF;

  -- Scholarship statistics
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'scholarship_statistics'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN scholarship_statistics jsonb DEFAULT '{}';
  END IF;

  -- Emergency financial support
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_scholarships' AND column_name = 'emergency_financial_support'
  ) THEN
    ALTER TABLE university_scholarships ADD COLUMN emergency_financial_support text DEFAULT '';
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE university_scholarships ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'university_scholarships' 
    AND policyname = 'University scholarships are publicly readable'
  ) THEN
    CREATE POLICY "University scholarships are publicly readable"
      ON university_scholarships
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_university_scholarships_enhanced_university_id 
ON university_scholarships (university_id);

CREATE INDEX IF NOT EXISTS idx_university_scholarships_enhanced_deadline 
ON university_scholarships (application_deadline);

CREATE INDEX IF NOT EXISTS idx_university_scholarships_enhanced_type 
ON university_scholarships (scholarship_type);