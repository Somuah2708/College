/*
  # Fix and enhance University Career & Alumni table

  1. New Columns Added
    - `career_services_overview` - Overview of career support services
    - `career_office_contact` - Complete contact information for career services
    - `academic_career_integration` - How career services integrate with academics
    - `internship_programs_detailed` - Comprehensive internship program information
    - `job_placement_services` - Job placement and recruitment services
    - `career_counseling_services` - Individual and group career counseling
    - `resume_interview_workshops` - Resume writing and interview preparation
    - `networking_events_calendar` - Professional networking events and career fairs
    - `employer_partnerships_detailed` - Industry partnerships and employer relationships
    - `alumni_network_detailed` - Alumni network size, engagement, and benefits
    - `notable_graduates_profiles` - Detailed profiles of successful alumni
    - `alumni_achievements_database` - Comprehensive alumni achievement records
    - `career_outcomes_by_program` - Employment outcomes by academic program
    - `salary_statistics_detailed` - Detailed salary data by program and year
    - `employment_rates_by_year` - Historical employment rate data
    - `industry_placement_breakdown` - Where graduates work by industry
    - `geographic_employment_distribution` - Where graduates work globally
    - `entrepreneurship_support_programs` - Startup and business creation support
    - `startup_incubators_accelerators` - University-affiliated incubators
    - `research_commercialization_support` - Research to market programs
    - `continuing_education_alumni` - Lifelong learning opportunities
    - `alumni_mentorship_programs` - Formal mentorship matching
    - `alumni_giving_impact` - Alumni contributions and their impact
    - `career_success_metrics` - Key performance indicators for career success
    - `industry_advisory_boards` - Industry professionals advising programs
    - `career_fairs_recruitment_events` - Annual career events and employer visits
    - `professional_development_workshops` - Skill development and training
    - `leadership_development_programs` - Leadership training and opportunities
    - `global_career_opportunities` - International career placement support
    - `career_videos` - 25+ videos covering all career aspects

  2. Security
    - Enable RLS on `university_career_alumni` table
    - Add policy for public read access
*/

-- Add new columns to university_career_alumni table
DO $$
BEGIN
  -- Career Services Overview
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'career_services_overview'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN career_services_overview text DEFAULT '';
  END IF;

  -- Career Office Contact
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'career_office_contact'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN career_office_contact jsonb DEFAULT '{}';
  END IF;

  -- Academic Career Integration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'academic_career_integration'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN academic_career_integration text DEFAULT '';
  END IF;

  -- Internship Programs Detailed
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'internship_programs_detailed'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN internship_programs_detailed jsonb DEFAULT '[]';
  END IF;

  -- Job Placement Services
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'job_placement_services'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN job_placement_services text DEFAULT '';
  END IF;

  -- Career Counseling Services
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'career_counseling_services'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN career_counseling_services text DEFAULT '';
  END IF;

  -- Resume Interview Workshops
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'resume_interview_workshops'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN resume_interview_workshops text DEFAULT '';
  END IF;

  -- Networking Events Calendar
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'networking_events_calendar'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN networking_events_calendar jsonb DEFAULT '[]';
  END IF;

  -- Employer Partnerships Detailed
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'employer_partnerships_detailed'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN employer_partnerships_detailed jsonb DEFAULT '[]';
  END IF;

  -- Alumni Network Detailed
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'alumni_network_detailed'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN alumni_network_detailed jsonb DEFAULT '{}';
  END IF;

  -- Notable Graduates Profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'notable_graduates_profiles'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN notable_graduates_profiles jsonb DEFAULT '[]';
  END IF;

  -- Alumni Achievements Database
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'alumni_achievements_database'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN alumni_achievements_database jsonb DEFAULT '[]';
  END IF;

  -- Career Outcomes by Program
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'career_outcomes_by_program'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN career_outcomes_by_program jsonb DEFAULT '{}';
  END IF;

  -- Salary Statistics Detailed
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'salary_statistics_detailed'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN salary_statistics_detailed jsonb DEFAULT '{}';
  END IF;

  -- Employment Rates by Year
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'employment_rates_by_year'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN employment_rates_by_year jsonb DEFAULT '{}';
  END IF;

  -- Industry Placement Breakdown
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'industry_placement_breakdown'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN industry_placement_breakdown jsonb DEFAULT '{}';
  END IF;

  -- Geographic Employment Distribution
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'geographic_employment_distribution'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN geographic_employment_distribution jsonb DEFAULT '{}';
  END IF;

  -- Entrepreneurship Support Programs
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'entrepreneurship_support_programs'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN entrepreneurship_support_programs text DEFAULT '';
  END IF;

  -- Startup Incubators Accelerators
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'startup_incubators_accelerators'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN startup_incubators_accelerators jsonb DEFAULT '[]';
  END IF;

  -- Research Commercialization Support
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'research_commercialization_support'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN research_commercialization_support text DEFAULT '';
  END IF;

  -- Continuing Education Alumni
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'continuing_education_alumni'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN continuing_education_alumni text DEFAULT '';
  END IF;

  -- Alumni Mentorship Programs
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'alumni_mentorship_programs'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN alumni_mentorship_programs text DEFAULT '';
  END IF;

  -- Alumni Giving Impact
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'alumni_giving_impact'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN alumni_giving_impact jsonb DEFAULT '{}';
  END IF;

  -- Career Success Metrics
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'career_success_metrics'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN career_success_metrics jsonb DEFAULT '{}';
  END IF;

  -- Industry Advisory Boards
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'industry_advisory_boards'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN industry_advisory_boards jsonb DEFAULT '[]';
  END IF;

  -- Career Fairs Recruitment Events
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'career_fairs_recruitment_events'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN career_fairs_recruitment_events jsonb DEFAULT '[]';
  END IF;

  -- Professional Development Workshops
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'professional_development_workshops'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN professional_development_workshops jsonb DEFAULT '[]';
  END IF;

  -- Leadership Development Programs
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'leadership_development_programs'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN leadership_development_programs jsonb DEFAULT '[]';
  END IF;

  -- Global Career Opportunities
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'global_career_opportunities'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN global_career_opportunities text DEFAULT '';
  END IF;

  -- Career Videos
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_career_alumni' AND column_name = 'career_videos'
  ) THEN
    ALTER TABLE university_career_alumni ADD COLUMN career_videos jsonb DEFAULT '[]';
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_university_career_alumni_enhanced_university_id 
ON university_career_alumni(university_id);

-- Enable RLS
ALTER TABLE university_career_alumni ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'university_career_alumni' 
    AND policyname = 'University career alumni is publicly readable'
  ) THEN
    CREATE POLICY "University career alumni is publicly readable"
      ON university_career_alumni
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;