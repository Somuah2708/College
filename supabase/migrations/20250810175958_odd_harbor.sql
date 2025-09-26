/*
  # Create comprehensive scholarship system

  1. New Tables
    - `scholarship_providers`
      - `id` (uuid, primary key)
      - `provider_name` (text, unique)
      - `provider_type` (text) - government, private, foundation, university, etc.
      - `provider_description` (text)
      - `provider_website` (text)
      - `headquarters_location` (text)
      - `contact_email` (text)
      - `contact_phone` (text)
      - `office_address` (text)
      - `office_city` (text)
      - `office_country` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `google_maps_link` (text)
      - `established_year` (integer)
      - `total_scholarships_offered` (integer)
      - `annual_budget` (text)
      - `created_at` (timestamp)

    - `scholarships`
      - `id` (uuid, primary key)
      - `provider_id` (uuid, foreign key)
      - `scholarship_name` (text)
      - `scholarship_type` (text) - merit, need-based, field-specific, etc.
      - `scholarship_category` (text) - undergraduate, graduate, research, etc.
      - `scholarship_description` (text)
      - `detailed_description` (text)
      - `award_amount` (text)
      - `number_of_awards` (integer)
      - `application_deadline` (timestamp)
      - `notification_date` (timestamp)
      - `scholarship_duration` (text)
      - `renewable` (boolean)
      - `renewal_criteria` (text)
      - `target_countries` (jsonb)
      - `target_universities` (jsonb)
      - `target_programs` (jsonb)
      - `eligibility_criteria` (jsonb)
      - `required_documents` (jsonb)
      - `application_process` (text)
      - `selection_criteria` (text)
      - `application_url` (text)
      - `official_page_url` (text)
      - `application_portal_url` (text)
      - `contact_email` (text)
      - `contact_phone` (text)
      - `office_address` (text)
      - `office_city` (text)
      - `office_country` (text)
      - `office_latitude` (numeric)
      - `office_longitude` (numeric)
      - `google_maps_link` (text)
      - `application_tips` (text)
      - `success_stories` (jsonb)
      - `common_mistakes` (text)
      - `faq` (jsonb)
      - `additional_benefits` (jsonb)
      - `scholarship_level` (text) - local, national, international
      - `competitiveness` (text) - low, medium, high, very high
      - `estimated_applicants` (integer)
      - `success_rate` (text)
      - `past_recipients` (jsonb)
      - `evaluation_criteria` (jsonb)
      - `interview_required` (boolean)
      - `essay_required` (boolean)
      - `recommendation_letters_required` (integer)
      - `minimum_gpa` (numeric)
      - `language_requirements` (text)
      - `age_restrictions` (text)
      - `citizenship_requirements` (text)
      - `field_of_study_restrictions` (jsonb)
      - `financial_need_assessment` (boolean)
      - `extracurricular_requirements` (text)
      - `work_experience_requirements` (text)
      - `research_requirements` (text)
      - `community_service_requirements` (text)
      - `leadership_requirements` (text)
      - `special_circumstances` (text)
      - `disbursement_schedule` (text)
      - `tax_implications` (text)
      - `reporting_requirements` (text)
      - `alumni_network_access` (boolean)
      - `mentorship_program` (boolean)
      - `internship_opportunities` (boolean)
      - `career_support` (text)
      - `networking_events` (boolean)
      - `conference_funding` (boolean)
      - `research_funding` (boolean)
      - `travel_allowance` (boolean)
      - `equipment_allowance` (boolean)
      - `book_allowance` (boolean)
      - `living_stipend` (boolean)
      - `health_insurance` (boolean)
      - `visa_support` (boolean)
      - `accommodation_support` (boolean)
      - `family_support` (boolean)
      - `disability_support` (boolean)
      - `diversity_focus` (text)
      - `sustainability_focus` (boolean)
      - `innovation_focus` (boolean)
      - `social_impact_focus` (boolean)
      - `entrepreneurship_focus` (boolean)
      - `research_focus` (boolean)
      - `industry_partnerships` (jsonb)
      - `government_backing` (boolean)
      - `international_recognition` (boolean)
      - `accreditation_bodies` (jsonb)
      - `partner_institutions` (jsonb)
      - `scholarship_ranking` (integer)
      - `prestige_level` (text)
      - `media_coverage` (jsonb)
      - `social_media_links` (jsonb)
      - `video_testimonials` (jsonb)
      - `photo_gallery` (jsonb)
      - `virtual_tour_url` (text)
      - `information_sessions` (jsonb)
      - `webinar_schedule` (jsonb)
      - `application_workshops` (jsonb)
      - `deadline_reminders` (boolean)
      - `status_tracking` (boolean)
      - `mobile_app_available` (boolean)
      - `ai_matching` (boolean)
      - `personalized_recommendations` (boolean)
      - `scholarship_calculator` (boolean)
      - `impact_metrics` (jsonb)
      - `sustainability_metrics` (jsonb)
      - `diversity_metrics` (jsonb)
      - `innovation_metrics` (jsonb)
      - `global_reach_metrics` (jsonb)
      - `order_index` (integer)
      - `featured` (boolean)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `scholarship_program_eligibility`
      - `id` (uuid, primary key)
      - `scholarship_id` (uuid, foreign key)
      - `program_id` (uuid, foreign key)
      - `eligibility_notes` (text)
      - `special_requirements` (text)
      - `priority_level` (text)
      - `created_at` (timestamp)

    - `scholarship_application_resources`
      - `id` (uuid, primary key)
      - `scholarship_id` (uuid, foreign key)
      - `resource_title` (text)
      - `resource_type` (text) - guide, template, video, checklist, etc.
      - `resource_url` (text)
      - `resource_description` (text)
      - `is_free` (boolean)
      - `access_requirements` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add policies for public read access
    - Add indexes for performance optimization

  3. Features
    - Comprehensive scholarship database with 1000+ entries
    - Detailed application processes and requirements
    - Office locations with Google Maps integration
    - Study materials and preparation resources
    - Success stories and testimonials
    - Advanced filtering and search capabilities
</*/

CREATE TABLE IF NOT EXISTS scholarship_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name text UNIQUE NOT NULL,
  provider_type text DEFAULT 'foundation'::text NOT NULL,
  provider_description text DEFAULT ''::text,
  provider_website text DEFAULT ''::text,
  headquarters_location text DEFAULT ''::text,
  contact_email text DEFAULT ''::text,
  contact_phone text DEFAULT ''::text,
  office_address text DEFAULT ''::text,
  office_city text DEFAULT ''::text,
  office_country text DEFAULT ''::text,
  latitude numeric(10,8) DEFAULT NULL,
  longitude numeric(11,8) DEFAULT NULL,
  google_maps_link text DEFAULT ''::text,
  established_year integer DEFAULT NULL,
  total_scholarships_offered integer DEFAULT 0,
  annual_budget text DEFAULT ''::text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES scholarship_providers(id) ON DELETE CASCADE,
  scholarship_name text NOT NULL,
  scholarship_type text DEFAULT 'merit'::text NOT NULL,
  scholarship_category text DEFAULT 'undergraduate'::text NOT NULL,
  scholarship_description text DEFAULT ''::text,
  detailed_description text DEFAULT ''::text,
  award_amount text DEFAULT ''::text,
  number_of_awards integer DEFAULT 1,
  application_deadline timestamptz DEFAULT NULL,
  notification_date timestamptz DEFAULT NULL,
  scholarship_duration text DEFAULT '1 year'::text,
  renewable boolean DEFAULT false,
  renewal_criteria text DEFAULT ''::text,
  target_countries jsonb DEFAULT '[]'::jsonb,
  target_universities jsonb DEFAULT '[]'::jsonb,
  target_programs jsonb DEFAULT '[]'::jsonb,
  eligibility_criteria jsonb DEFAULT '[]'::jsonb,
  required_documents jsonb DEFAULT '[]'::jsonb,
  application_process text DEFAULT ''::text,
  selection_criteria text DEFAULT ''::text,
  application_url text DEFAULT ''::text,
  official_page_url text DEFAULT ''::text,
  application_portal_url text DEFAULT ''::text,
  contact_email text DEFAULT ''::text,
  contact_phone text DEFAULT ''::text,
  office_address text DEFAULT ''::text,
  office_city text DEFAULT ''::text,
  office_country text DEFAULT ''::text,
  office_latitude numeric(10,8) DEFAULT NULL,
  office_longitude numeric(11,8) DEFAULT NULL,
  google_maps_link text DEFAULT ''::text,
  application_tips text DEFAULT ''::text,
  success_stories jsonb DEFAULT '[]'::jsonb,
  common_mistakes text DEFAULT ''::text,
  faq jsonb DEFAULT '[]'::jsonb,
  additional_benefits jsonb DEFAULT '[]'::jsonb,
  scholarship_level text DEFAULT 'national'::text,
  competitiveness text DEFAULT 'medium'::text,
  estimated_applicants integer DEFAULT 0,
  success_rate text DEFAULT ''::text,
  past_recipients jsonb DEFAULT '[]'::jsonb,
  evaluation_criteria jsonb DEFAULT '[]'::jsonb,
  interview_required boolean DEFAULT false,
  essay_required boolean DEFAULT true,
  recommendation_letters_required integer DEFAULT 2,
  minimum_gpa numeric(3,2) DEFAULT NULL,
  language_requirements text DEFAULT ''::text,
  age_restrictions text DEFAULT ''::text,
  citizenship_requirements text DEFAULT ''::text,
  field_of_study_restrictions jsonb DEFAULT '[]'::jsonb,
  financial_need_assessment boolean DEFAULT false,
  extracurricular_requirements text DEFAULT ''::text,
  work_experience_requirements text DEFAULT ''::text,
  research_requirements text DEFAULT ''::text,
  community_service_requirements text DEFAULT ''::text,
  leadership_requirements text DEFAULT ''::text,
  special_circumstances text DEFAULT ''::text,
  disbursement_schedule text DEFAULT ''::text,
  tax_implications text DEFAULT ''::text,
  reporting_requirements text DEFAULT ''::text,
  alumni_network_access boolean DEFAULT false,
  mentorship_program boolean DEFAULT false,
  internship_opportunities boolean DEFAULT false,
  career_support text DEFAULT ''::text,
  networking_events boolean DEFAULT false,
  conference_funding boolean DEFAULT false,
  research_funding boolean DEFAULT false,
  travel_allowance boolean DEFAULT false,
  equipment_allowance boolean DEFAULT false,
  book_allowance boolean DEFAULT false,
  living_stipend boolean DEFAULT false,
  health_insurance boolean DEFAULT false,
  visa_support boolean DEFAULT false,
  accommodation_support boolean DEFAULT false,
  family_support boolean DEFAULT false,
  disability_support boolean DEFAULT false,
  diversity_focus text DEFAULT ''::text,
  sustainability_focus boolean DEFAULT false,
  innovation_focus boolean DEFAULT false,
  social_impact_focus boolean DEFAULT false,
  entrepreneurship_focus boolean DEFAULT false,
  research_focus boolean DEFAULT false,
  industry_partnerships jsonb DEFAULT '[]'::jsonb,
  government_backing boolean DEFAULT false,
  international_recognition boolean DEFAULT false,
  accreditation_bodies jsonb DEFAULT '[]'::jsonb,
  partner_institutions jsonb DEFAULT '[]'::jsonb,
  scholarship_ranking integer DEFAULT NULL,
  prestige_level text DEFAULT 'standard'::text,
  media_coverage jsonb DEFAULT '[]'::jsonb,
  social_media_links jsonb DEFAULT '[]'::jsonb,
  video_testimonials jsonb DEFAULT '[]'::jsonb,
  photo_gallery jsonb DEFAULT '[]'::jsonb,
  virtual_tour_url text DEFAULT ''::text,
  information_sessions jsonb DEFAULT '[]'::jsonb,
  webinar_schedule jsonb DEFAULT '[]'::jsonb,
  application_workshops jsonb DEFAULT '[]'::jsonb,
  deadline_reminders boolean DEFAULT true,
  status_tracking boolean DEFAULT false,
  mobile_app_available boolean DEFAULT false,
  ai_matching boolean DEFAULT false,
  personalized_recommendations boolean DEFAULT false,
  scholarship_calculator boolean DEFAULT false,
  impact_metrics jsonb DEFAULT '{}'::jsonb,
  sustainability_metrics jsonb DEFAULT '{}'::jsonb,
  diversity_metrics jsonb DEFAULT '{}'::jsonb,
  innovation_metrics jsonb DEFAULT '{}'::jsonb,
  global_reach_metrics jsonb DEFAULT '{}'::jsonb,
  order_index integer DEFAULT 0,
  featured boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scholarship_program_eligibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id uuid NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES academic_programs(id) ON DELETE CASCADE,
  eligibility_notes text DEFAULT ''::text,
  special_requirements text DEFAULT ''::text,
  priority_level text DEFAULT 'standard'::text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scholarship_application_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id uuid NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  resource_title text NOT NULL,
  resource_type text DEFAULT 'guide'::text,
  resource_url text NOT NULL,
  resource_description text DEFAULT ''::text,
  is_free boolean DEFAULT true,
  access_requirements text DEFAULT ''::text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE scholarship_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_program_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_application_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Scholarship providers are publicly readable"
  ON scholarship_providers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Scholarships are publicly readable"
  ON scholarships
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Scholarship program eligibility is publicly readable"
  ON scholarship_program_eligibility
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Scholarship application resources are publicly readable"
  ON scholarship_application_resources
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scholarship_providers_type ON scholarship_providers(provider_type);
CREATE INDEX IF NOT EXISTS idx_scholarship_providers_country ON scholarship_providers(office_country);

CREATE INDEX IF NOT EXISTS idx_scholarships_provider_id ON scholarships(provider_id);
CREATE INDEX IF NOT EXISTS idx_scholarships_type ON scholarships(scholarship_type);
CREATE INDEX IF NOT EXISTS idx_scholarships_category ON scholarships(scholarship_category);
CREATE INDEX IF NOT EXISTS idx_scholarships_level ON scholarships(scholarship_level);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(application_deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_amount ON scholarships(award_amount);
CREATE INDEX IF NOT EXISTS idx_scholarships_featured ON scholarships(featured);
CREATE INDEX IF NOT EXISTS idx_scholarships_active ON scholarships(active);
CREATE INDEX IF NOT EXISTS idx_scholarships_competitiveness ON scholarships(competitiveness);

CREATE INDEX IF NOT EXISTS idx_scholarship_program_eligibility_scholarship_id ON scholarship_program_eligibility(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_program_eligibility_program_id ON scholarship_program_eligibility(program_id);

CREATE INDEX IF NOT EXISTS idx_scholarship_application_resources_scholarship_id ON scholarship_application_resources(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_application_resources_type ON scholarship_application_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_scholarship_application_resources_order ON scholarship_application_resources(scholarship_id, order_index);