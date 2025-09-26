/*
  # Enhance University Support Services Table

  1. New Columns Added
    - `support_services_overview` (text) - Purpose and mission of student support services
    - `student_support_office_contact` (jsonb) - Complete contact information for support office
    - `academic_support_services` (text) - Academic advising, tutoring, writing labs, research assistance
    - `health_wellness_services` (text) - On-campus clinic, mental health, counseling services
    - `disability_accessibility_services` (text) - Learning support, assistive technology, accessibility options
    - `career_support_services` (text) - Career counseling, job placement, resume workshops
    - `financial_support_services` (text) - Emergency bursaries, hardship grants, budgeting advice
    - `international_student_support` (text) - Orientation, visa assistance, cultural adjustment support
    - `safety_security_services` (text) - Campus security, emergency services, safety training
    - `technology_it_support` (text) - Help desk, Wi-Fi support, online learning assistance
    - `student_advocacy_ombudsman` (text) - Complaint procedures, mediation, rights information
    - `support_services_videos` (jsonb) - Comprehensive video gallery (25+ videos per university)
    - `emergency_contacts_directory` (jsonb) - Complete emergency contact information
    - `wellness_programs_calendar` (jsonb) - Wellness workshops and health awareness events
    - `peer_mentorship_details` (text) - Peer mentorship and support programs
    - `crisis_intervention_services` (text) - Crisis support and intervention procedures
    - `accessibility_accommodations` (text) - Detailed accessibility accommodations available
    - `student_rights_responsibilities` (text) - Student rights, responsibilities, and code of conduct

  2. Security
    - Enable RLS on `university_support_services` table
    - Add policy for public read access to support services information

  3. Performance
    - Add indexes for efficient querying by university_id
*/

-- Add new columns to university_support_services table
DO $$
BEGIN
  -- Support services overview
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'support_services_overview'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN support_services_overview text DEFAULT '';
  END IF;

  -- Student support office contact
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'student_support_office_contact'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN student_support_office_contact jsonb DEFAULT '{}';
  END IF;

  -- Academic support services
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'academic_support_services'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN academic_support_services text DEFAULT '';
  END IF;

  -- Health and wellness services
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'health_wellness_services'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN health_wellness_services text DEFAULT '';
  END IF;

  -- Disability and accessibility services
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'disability_accessibility_services'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN disability_accessibility_services text DEFAULT '';
  END IF;

  -- Career support services
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'career_support_services'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN career_support_services text DEFAULT '';
  END IF;

  -- Financial support services
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'financial_support_services'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN financial_support_services text DEFAULT '';
  END IF;

  -- International student support
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'international_student_support'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN international_student_support text DEFAULT '';
  END IF;

  -- Safety and security services
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'safety_security_services'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN safety_security_services text DEFAULT '';
  END IF;

  -- Technology and IT support
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'technology_it_support'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN technology_it_support text DEFAULT '';
  END IF;

  -- Student advocacy and ombudsman
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'student_advocacy_ombudsman'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN student_advocacy_ombudsman text DEFAULT '';
  END IF;

  -- Support services videos
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'support_services_videos'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN support_services_videos jsonb DEFAULT '[]';
  END IF;

  -- Emergency contacts directory
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'emergency_contacts_directory'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN emergency_contacts_directory jsonb DEFAULT '[]';
  END IF;

  -- Wellness programs calendar
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'wellness_programs_calendar'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN wellness_programs_calendar jsonb DEFAULT '[]';
  END IF;

  -- Peer mentorship details
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'peer_mentorship_details'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN peer_mentorship_details text DEFAULT '';
  END IF;

  -- Crisis intervention services
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'crisis_intervention_services'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN crisis_intervention_services text DEFAULT '';
  END IF;

  -- Accessibility accommodations
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'accessibility_accommodations'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN accessibility_accommodations text DEFAULT '';
  END IF;

  -- Student rights and responsibilities
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_support_services' AND column_name = 'student_rights_responsibilities'
  ) THEN
    ALTER TABLE university_support_services ADD COLUMN student_rights_responsibilities text DEFAULT '';
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE university_support_services ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'university_support_services' 
    AND policyname = 'University support services is publicly readable'
  ) THEN
    CREATE POLICY "University support services is publicly readable"
      ON university_support_services
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_university_support_services_enhanced_university_id 
ON university_support_services (university_id);