/*
  # Comprehensive University Information System

  1. New Tables
    - `university_basic_info` - Basic overview information for universities
    - `university_programs_academics` - Academic programs and departments
    - `university_admission_requirements` - Detailed admission criteria
    - `university_tuition_costs` - Comprehensive cost information
    - `university_scholarships` - University-specific scholarships
    - `university_campus_facilities` - Campus infrastructure and facilities
    - `university_accommodation` - Housing and accommodation options
    - `university_student_life` - Student activities and campus culture
    - `university_career_alumni` - Career services and alumni information
    - `university_location_environment` - Location details and environment
    - `university_international_opportunities` - Global programs and partnerships
    - `university_support_services` - Student support and counseling services

  2. Security
    - Enable RLS on all new tables
    - Add policies for public read access
*/

-- University Basic Info
CREATE TABLE IF NOT EXISTS university_basic_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  year_established integer DEFAULT NULL,
  university_history text DEFAULT '',
  university_type text DEFAULT 'public',
  accreditation_status text DEFAULT '',
  rankings_reputation jsonb DEFAULT '{}',
  motto text DEFAULT '',
  vision_statement text DEFAULT '',
  mission_statement text DEFAULT '',
  core_values jsonb DEFAULT '[]',
  leadership_team jsonb DEFAULT '[]',
  governance_structure text DEFAULT '',
  institutional_partnerships jsonb DEFAULT '[]',
  awards_recognition jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE university_basic_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University basic info is publicly readable"
  ON university_basic_info
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_university_basic_info_university_id ON university_basic_info(university_id);
CREATE INDEX idx_university_basic_info_type ON university_basic_info(university_type);

-- University Programs & Academics
CREATE TABLE IF NOT EXISTS university_programs_academics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  faculties_colleges jsonb DEFAULT '[]',
  departments jsonb DEFAULT '[]',
  undergraduate_programs jsonb DEFAULT '[]',
  postgraduate_programs jsonb DEFAULT '[]',
  doctoral_programs jsonb DEFAULT '[]',
  specializations jsonb DEFAULT '[]',
  unique_courses jsonb DEFAULT '[]',
  language_of_instruction jsonb DEFAULT '["English"]',
  academic_calendar text DEFAULT '',
  credit_system text DEFAULT '',
  grading_system text DEFAULT '',
  academic_standards text DEFAULT '',
  research_areas jsonb DEFAULT '[]',
  faculty_student_ratio text DEFAULT '',
  class_sizes text DEFAULT '',
  teaching_methodology text DEFAULT '',
  online_learning_options text DEFAULT '',
  continuing_education text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE university_programs_academics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University programs academics is publicly readable"
  ON university_programs_academics
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_university_programs_academics_university_id ON university_programs_academics(university_id);

-- University Admission Requirements
CREATE TABLE IF NOT EXISTS university_admission_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  general_entry_criteria text DEFAULT '',
  program_specific_cutoffs jsonb DEFAULT '{}',
  required_subjects_grades jsonb DEFAULT '[]',
  portfolio_requirements text DEFAULT '',
  interview_requirements text DEFAULT '',
  application_deadlines jsonb DEFAULT '{}',
  application_procedures text DEFAULT '',
  entrance_examinations jsonb DEFAULT '[]',
  language_proficiency_requirements text DEFAULT '',
  international_student_requirements text DEFAULT '',
  transfer_student_requirements text DEFAULT '',
  mature_student_requirements text DEFAULT '',
  application_fees text DEFAULT '',
  document_requirements jsonb DEFAULT '[]',
  application_tips text DEFAULT '',
  common_mistakes text DEFAULT '',
  selection_process text DEFAULT '',
  notification_timeline text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE university_admission_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University admission requirements is publicly readable"
  ON university_admission_requirements
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_university_admission_requirements_university_id ON university_admission_requirements(university_id);

-- University Tuition & Costs
CREATE TABLE IF NOT EXISTS university_tuition_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  local_student_tuition jsonb DEFAULT '{}',
  international_student_tuition jsonb DEFAULT '{}',
  registration_fees text DEFAULT '',
  laboratory_fees text DEFAULT '',
  library_fees text DEFAULT '',
  accommodation_costs jsonb DEFAULT '{}',
  meal_plan_costs jsonb DEFAULT '{}',
  transportation_costs text DEFAULT '',
  textbook_costs text DEFAULT '',
  technology_fees text DEFAULT '',
  health_insurance text DEFAULT '',
  estimated_living_expenses jsonb DEFAULT '{}',
  payment_plans jsonb DEFAULT '[]',
  refund_policies text DEFAULT '',
  financial_aid_availability text DEFAULT '',
  work_study_opportunities text DEFAULT '',
  cost_comparison_notes text DEFAULT '',
  hidden_costs text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE university_tuition_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University tuition costs is publicly readable"
  ON university_tuition_costs
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_university_tuition_costs_university_id ON university_tuition_costs(university_id);

-- University Scholarships
CREATE TABLE IF NOT EXISTS university_scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  scholarship_name text NOT NULL,
  scholarship_type text DEFAULT 'merit',
  scholarship_description text DEFAULT '',
  award_amount text DEFAULT '',
  number_of_awards integer DEFAULT 1,
  eligibility_criteria jsonb DEFAULT '[]',
  application_process text DEFAULT '',
  application_deadline timestamptz DEFAULT NULL,
  renewable boolean DEFAULT false,
  renewal_criteria text DEFAULT '',
  target_programs jsonb DEFAULT '[]',
  target_demographics jsonb DEFAULT '[]',
  selection_criteria text DEFAULT '',
  application_tips text DEFAULT '',
  success_stories text DEFAULT '',
  contact_information jsonb DEFAULT '{}',
  application_url text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE university_scholarships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University scholarships is publicly readable"
  ON university_scholarships
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_university_scholarships_university_id ON university_scholarships(university_id);
CREATE INDEX idx_university_scholarships_type ON university_scholarships(scholarship_type);
CREATE INDEX idx_university_scholarships_deadline ON university_scholarships(application_deadline);

-- University Campus Facilities
CREATE TABLE IF NOT EXISTS university_campus_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  libraries jsonb DEFAULT '[]',
  laboratories jsonb DEFAULT '[]',
  lecture_halls jsonb DEFAULT '[]',
  ict_facilities text DEFAULT '',
  wifi_access text DEFAULT '',
  health_services jsonb DEFAULT '{}',
  sports_facilities jsonb DEFAULT '[]',
  recreation_centers jsonb DEFAULT '[]',
  innovation_hubs jsonb DEFAULT '[]',
  research_centers jsonb DEFAULT '[]',
  special_resources jsonb DEFAULT '[]',
  accessibility_features text DEFAULT '',
  security_systems text DEFAULT '',
  parking_facilities text DEFAULT '',
  dining_facilities jsonb DEFAULT '[]',
  bookstore_services text DEFAULT '',
  banking_services text DEFAULT '',
  postal_services text DEFAULT '',
  maintenance_standards text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE university_campus_facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University campus facilities is publicly readable"
  ON university_campus_facilities
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_university_campus_facilities_university_id ON university_campus_facilities(university_id);

-- University Accommodation & Housing
CREATE TABLE IF NOT EXISTS university_accommodation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  on_campus_hostels jsonb DEFAULT '[]',
  off_campus_housing jsonb DEFAULT '[]',
  accommodation_costs jsonb DEFAULT '{}',
  amenities_included jsonb DEFAULT '[]',
  room_types jsonb DEFAULT '[]',
  allocation_process text DEFAULT '',
  application_deadlines jsonb DEFAULT '{}',
  housing_policies text DEFAULT '',
  meal_plans jsonb DEFAULT '[]',
  utilities_included text DEFAULT '',
  internet_access text DEFAULT '',
  laundry_facilities text DEFAULT '',
  study_spaces text DEFAULT '',
  social_areas text DEFAULT '',
  security_measures text DEFAULT '',
  guest_policies text DEFAULT '',
  maintenance_services text DEFAULT '',
  housing_support_staff text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE university_accommodation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University accommodation is publicly readable"
  ON university_accommodation
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_university_accommodation_university_id ON university_accommodation(university_id);

-- University Student Life
CREATE TABLE IF NOT EXISTS university_student_life (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  clubs_societies jsonb DEFAULT '[]',
  student_unions jsonb DEFAULT '[]',
  events_traditions jsonb DEFAULT '[]',
  cultural_activities jsonb DEFAULT '[]',
  community_engagement jsonb DEFAULT '[]',
  volunteer_opportunities jsonb DEFAULT '[]',
  leadership_programs jsonb DEFAULT '[]',
  mentorship_programs jsonb DEFAULT '[]',
  peer_support_systems text DEFAULT '',
  diversity_inclusion text DEFAULT '',
  international_student_support text DEFAULT '',
  orientation_programs text DEFAULT '',
  graduation_ceremonies text DEFAULT '',
  alumni_events text DEFAULT '',
  campus_traditions text DEFAULT '',
  student_publications jsonb DEFAULT '[]',
  radio_tv_stations jsonb DEFAULT '[]',
  social_media_presence jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE university_student_life ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University student life is publicly readable"
  ON university_student_life
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_university_student_life_university_id ON university_student_life(university_id);

-- University Career & Alumni
CREATE TABLE IF NOT EXISTS university_career_alumni (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  internship_programs jsonb DEFAULT '[]',
  career_services text DEFAULT '',
  job_placement_rates jsonb DEFAULT '{}',
  employment_statistics text DEFAULT '',
  alumni_network_size text DEFAULT '',
  notable_graduates jsonb DEFAULT '[]',
  alumni_achievements jsonb DEFAULT '[]',
  industry_partnerships jsonb DEFAULT '[]',
  employer_relationships jsonb DEFAULT '[]',
  career_fairs jsonb DEFAULT '[]',
  networking_events jsonb DEFAULT '[]',
  mentorship_opportunities text DEFAULT '',
  entrepreneurship_support text DEFAULT '',
  startup_incubators jsonb DEFAULT '[]',
  research_commercialization text DEFAULT '',
  industry_collaborations jsonb DEFAULT '[]',
  graduate_outcomes jsonb DEFAULT '{}',
  salary_statistics jsonb DEFAULT '{}',
  career_progression_data text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE university_career_alumni ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University career alumni is publicly readable"
  ON university_career_alumni
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_university_career_alumni_university_id ON university_career_alumni(university_id);

-- University Location & Environment
CREATE TABLE IF NOT EXISTS university_location_environment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  city_town_profile text DEFAULT '',
  population_demographics text DEFAULT '',
  economic_profile text DEFAULT '',
  cultural_attractions jsonb DEFAULT '[]',
  safety_security text DEFAULT '',
  crime_statistics text DEFAULT '',
  emergency_services text DEFAULT '',
  transportation_options jsonb DEFAULT '[]',
  public_transport text DEFAULT '',
  accessibility_features text DEFAULT '',
  weather_climate text DEFAULT '',
  seasonal_variations text DEFAULT '',
  natural_environment text DEFAULT '',
  pollution_levels text DEFAULT '',
  cost_of_living text DEFAULT '',
  shopping_dining jsonb DEFAULT '[]',
  entertainment_venues jsonb DEFAULT '[]',
  healthcare_facilities jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE university_location_environment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University location environment is publicly readable"
  ON university_location_environment
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_university_location_environment_university_id ON university_location_environment(university_id);

-- University International Opportunities
CREATE TABLE IF NOT EXISTS university_international_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  exchange_programs jsonb DEFAULT '[]',
  partner_universities jsonb DEFAULT '[]',
  study_abroad_opportunities jsonb DEFAULT '[]',
  international_internships jsonb DEFAULT '[]',
  dual_degree_programs jsonb DEFAULT '[]',
  summer_programs jsonb DEFAULT '[]',
  research_collaborations jsonb DEFAULT '[]',
  faculty_exchange text DEFAULT '',
  student_mobility_statistics text DEFAULT '',
  language_support text DEFAULT '',
  cultural_preparation text DEFAULT '',
  visa_support text DEFAULT '',
  international_student_services text DEFAULT '',
  global_alumni_network text DEFAULT '',
  international_rankings text DEFAULT '',
  cross_cultural_programs text DEFAULT '',
  global_citizenship_initiatives text DEFAULT '',
  international_conferences jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE university_international_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University international opportunities is publicly readable"
  ON university_international_opportunities
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_university_international_opportunities_university_id ON university_international_opportunities(university_id);

-- University Support Services
CREATE TABLE IF NOT EXISTS university_support_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  academic_advising text DEFAULT '',
  tutoring_services text DEFAULT '',
  writing_centers text DEFAULT '',
  counseling_services text DEFAULT '',
  mental_health_support text DEFAULT '',
  crisis_intervention text DEFAULT '',
  disability_services text DEFAULT '',
  accessibility_accommodations text DEFAULT '',
  health_services text DEFAULT '',
  medical_facilities text DEFAULT '',
  pharmacy_services text DEFAULT '',
  insurance_options text DEFAULT '',
  financial_counseling text DEFAULT '',
  legal_aid_services text DEFAULT '',
  chaplaincy_services text DEFAULT '',
  multicultural_support text DEFAULT '',
  lgbtq_support text DEFAULT '',
  veteran_services text DEFAULT '',
  parent_student_support text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE university_support_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "University support services is publicly readable"
  ON university_support_services
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_university_support_services_university_id ON university_support_services(university_id);