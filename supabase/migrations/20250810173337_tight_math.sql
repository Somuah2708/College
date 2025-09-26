/*
  # Create Innovation Sandbox Tables

  1. New Tables
    - `program_innovation_opportunities`
      - `id` (uuid, primary key)
      - `program_id` (uuid, foreign key to academic_programs)
      - `opportunity_name` (text)
      - `opportunity_type` (text: competition, workshop, camp, lab, volunteer, hackathon)
      - `organization_name` (text)
      - `opportunity_description` (text)
      - `detailed_content` (text)
      - `eligibility_requirements` (jsonb array)
      - `application_process` (text)
      - `application_deadline` (timestamptz)
      - `application_url` (text)
      - `contact_email` (text)
      - `contact_phone` (text)
      - `program_duration` (text)
      - `location_type` (text: online, onsite, hybrid)
      - `location_address` (text)
      - `location_city` (text)
      - `location_country` (text)
      - `cost_information` (text)
      - `benefits_offered` (jsonb array)
      - `skills_developed` (jsonb array)
      - `networking_opportunities` (text)
      - `mentorship_available` (boolean)
      - `certification_provided` (boolean)
      - `prize_information` (text)
      - `past_winners` (jsonb array)
      - `success_stories` (text)
      - `application_tips` (text)
      - `common_mistakes` (text)
      - `preparation_resources` (jsonb array)
      - `difficulty_level` (text)
      - `time_commitment` (text)
      - `team_requirements` (text)
      - `technology_focus` (jsonb array)
      - `industry_partnerships` (jsonb array)
      - `alumni_involvement` (text)
      - `innovation_category` (text)
      - `impact_metrics` (text)
      - `sustainability_focus` (boolean)
      - `diversity_initiatives` (text)
      - `accessibility_features` (text)
      - `virtual_components` (text)
      - `follow_up_opportunities` (text)
      - `order_index` (integer)
      - `created_at` (timestamptz)

    - `innovation_opportunity_resources`
      - `id` (uuid, primary key)
      - `opportunity_id` (uuid, foreign key to program_innovation_opportunities)
      - `resource_title` (text)
      - `resource_url` (text)
      - `resource_type` (text: guide, tutorial, template, tool, dataset)
      - `resource_description` (text)
      - `is_free` (boolean)
      - `access_requirements` (text)
      - `order_index` (integer)
      - `created_at` (timestamptz)

    - `innovation_opportunity_mentors`
      - `id` (uuid, primary key)
      - `opportunity_id` (uuid, foreign key to program_innovation_opportunities)
      - `mentor_name` (text)
      - `mentor_title` (text)
      - `mentor_organization` (text)
      - `mentor_expertise` (jsonb array)
      - `mentor_bio` (text)
      - `linkedin_profile` (text)
      - `availability_schedule` (text)
      - `mentorship_style` (text)
      - `contact_method` (text)
      - `order_index` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add indexes for performance optimization

  3. Relationships
    - Foreign key constraints with CASCADE delete
    - Proper indexing for efficient queries
*/

-- Create program_innovation_opportunities table
CREATE TABLE IF NOT EXISTS program_innovation_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES academic_programs(id) ON DELETE CASCADE,
  opportunity_name text NOT NULL,
  opportunity_type text NOT NULL DEFAULT 'workshop',
  organization_name text NOT NULL DEFAULT '',
  opportunity_description text DEFAULT '',
  detailed_content text DEFAULT '',
  eligibility_requirements jsonb DEFAULT '[]',
  application_process text DEFAULT '',
  application_deadline timestamptz,
  application_url text DEFAULT '',
  contact_email text DEFAULT '',
  contact_phone text DEFAULT '',
  program_duration text DEFAULT '',
  location_type text DEFAULT 'hybrid',
  location_address text DEFAULT '',
  location_city text DEFAULT '',
  location_country text DEFAULT '',
  cost_information text DEFAULT '',
  benefits_offered jsonb DEFAULT '[]',
  skills_developed jsonb DEFAULT '[]',
  networking_opportunities text DEFAULT '',
  mentorship_available boolean DEFAULT false,
  certification_provided boolean DEFAULT false,
  prize_information text DEFAULT '',
  past_winners jsonb DEFAULT '[]',
  success_stories text DEFAULT '',
  application_tips text DEFAULT '',
  common_mistakes text DEFAULT '',
  preparation_resources jsonb DEFAULT '[]',
  difficulty_level text DEFAULT 'intermediate',
  time_commitment text DEFAULT '',
  team_requirements text DEFAULT '',
  technology_focus jsonb DEFAULT '[]',
  industry_partnerships jsonb DEFAULT '[]',
  alumni_involvement text DEFAULT '',
  innovation_category text DEFAULT 'general',
  impact_metrics text DEFAULT '',
  sustainability_focus boolean DEFAULT false,
  diversity_initiatives text DEFAULT '',
  accessibility_features text DEFAULT '',
  virtual_components text DEFAULT '',
  follow_up_opportunities text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create innovation_opportunity_resources table
CREATE TABLE IF NOT EXISTS innovation_opportunity_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES program_innovation_opportunities(id) ON DELETE CASCADE,
  resource_title text NOT NULL,
  resource_url text NOT NULL,
  resource_type text DEFAULT 'guide',
  resource_description text DEFAULT '',
  is_free boolean DEFAULT true,
  access_requirements text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create innovation_opportunity_mentors table
CREATE TABLE IF NOT EXISTS innovation_opportunity_mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES program_innovation_opportunities(id) ON DELETE CASCADE,
  mentor_name text NOT NULL,
  mentor_title text DEFAULT '',
  mentor_organization text DEFAULT '',
  mentor_expertise jsonb DEFAULT '[]',
  mentor_bio text DEFAULT '',
  linkedin_profile text DEFAULT '',
  availability_schedule text DEFAULT '',
  mentorship_style text DEFAULT '',
  contact_method text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE program_innovation_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_opportunity_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_opportunity_mentors ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Innovation opportunities are publicly readable"
  ON program_innovation_opportunities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Innovation opportunity resources are publicly readable"
  ON innovation_opportunity_resources
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Innovation opportunity mentors are publicly readable"
  ON innovation_opportunity_mentors
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_program_innovation_opportunities_program_id 
  ON program_innovation_opportunities(program_id);

CREATE INDEX IF NOT EXISTS idx_program_innovation_opportunities_type 
  ON program_innovation_opportunities(program_id, opportunity_type);

CREATE INDEX IF NOT EXISTS idx_program_innovation_opportunities_category 
  ON program_innovation_opportunities(program_id, innovation_category);

CREATE INDEX IF NOT EXISTS idx_program_innovation_opportunities_deadline 
  ON program_innovation_opportunities(application_deadline);

CREATE INDEX IF NOT EXISTS idx_program_innovation_opportunities_location 
  ON program_innovation_opportunities(program_id, location_type);

CREATE INDEX IF NOT EXISTS idx_program_innovation_opportunities_order 
  ON program_innovation_opportunities(program_id, order_index);

CREATE INDEX IF NOT EXISTS idx_innovation_opportunity_resources_opportunity_id 
  ON innovation_opportunity_resources(opportunity_id);

CREATE INDEX IF NOT EXISTS idx_innovation_opportunity_resources_order 
  ON innovation_opportunity_resources(opportunity_id, order_index);

CREATE INDEX IF NOT EXISTS idx_innovation_opportunity_mentors_opportunity_id 
  ON innovation_opportunity_mentors(opportunity_id);

CREATE INDEX IF NOT EXISTS idx_innovation_opportunity_mentors_order 
  ON innovation_opportunity_mentors(opportunity_id, order_index);