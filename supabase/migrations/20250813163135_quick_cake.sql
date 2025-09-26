/*
  # Fix University Tuition Costs Table

  1. Enhanced Tuition & Costs System
    - Add comprehensive tuition breakdown columns
    - Add interactive cost calculator data
    - Add payment plans and methods
    - Add historical cost trends
    - Add financial planning resources
    - Add comprehensive video content

  2. Security
    - Maintain existing RLS policies
    - Ensure public read access for cost information

  3. Performance
    - Add indexes for efficient querying
    - Optimize for cost calculator functionality
*/

-- Add comprehensive tuition and cost columns to university_tuition_costs table
DO $$
BEGIN
  -- Overview and Contact Information
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'tuition_overview'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN tuition_overview text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'fees_office_contact'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN fees_office_contact jsonb DEFAULT '{}';
  END IF;

  -- Detailed Fee Structures
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'local_student_detailed_fees'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN local_student_detailed_fees jsonb DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'international_student_detailed_fees'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN international_student_detailed_fees jsonb DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'program_specific_fees'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN program_specific_fees jsonb DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'additional_mandatory_fees'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN additional_mandatory_fees jsonb DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'optional_fees_services'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN optional_fees_services jsonb DEFAULT '{}';
  END IF;

  -- Accommodation and Living Costs
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'accommodation_detailed_costs'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN accommodation_detailed_costs jsonb DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'meal_plans_detailed'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN meal_plans_detailed jsonb DEFAULT '[]';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'living_expenses_breakdown'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN living_expenses_breakdown jsonb DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'transportation_detailed_costs'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN transportation_detailed_costs jsonb DEFAULT '{}';
  END IF;

  -- Academic Materials and Technology
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'textbooks_supplies_costs'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN textbooks_supplies_costs jsonb DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'technology_equipment_fees'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN technology_equipment_fees jsonb DEFAULT '{}';
  END IF;

  -- Health and Insurance
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'health_insurance_details'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN health_insurance_details jsonb DEFAULT '{}';
  END IF;

  -- Payment Information
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'payment_plans_detailed'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN payment_plans_detailed jsonb DEFAULT '[]';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'payment_methods_accepted'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN payment_methods_accepted jsonb DEFAULT '[]';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'late_payment_policies'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN late_payment_policies text DEFAULT '';
  END IF;

  -- Policies and Procedures
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'refund_policies_detailed'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN refund_policies_detailed text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'withdrawal_procedures'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN withdrawal_procedures text DEFAULT '';
  END IF;

  -- Financial Aid Integration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'financial_aid_integration'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN financial_aid_integration text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'work_study_earnings'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN work_study_earnings jsonb DEFAULT '{}';
  END IF;

  -- Cost Analysis and Planning
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'cost_comparison_tools'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN cost_comparison_tools jsonb DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'hidden_costs_warnings'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN hidden_costs_warnings jsonb DEFAULT '[]';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'cost_calculator_data'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN cost_calculator_data jsonb DEFAULT '{}';
  END IF;

  -- Historical Data and Trends
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'cost_trends_history'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN cost_trends_history jsonb DEFAULT '[]';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'future_projections'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN future_projections jsonb DEFAULT '{}';
  END IF;

  -- Financial Planning Resources
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'financial_planning_resources'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN financial_planning_resources jsonb DEFAULT '[]';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'budgeting_tools'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN budgeting_tools jsonb DEFAULT '[]';
  END IF;

  -- Currency and International Support
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'currency_conversion_rates'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN currency_conversion_rates jsonb DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'international_payment_support'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN international_payment_support text DEFAULT '';
  END IF;

  -- Video Content
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'tuition_videos'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN tuition_videos jsonb DEFAULT '[]';
  END IF;

  -- Emergency and Support
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'emergency_financial_support'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN emergency_financial_support text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'payment_assistance_programs'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN payment_assistance_programs jsonb DEFAULT '[]';
  END IF;

  -- Cost Transparency and Comparison
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'cost_transparency_report'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN cost_transparency_report text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'peer_institution_comparison'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN peer_institution_comparison jsonb DEFAULT '[]';
  END IF;

  -- Student Financial Wellness
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'financial_literacy_programs'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN financial_literacy_programs jsonb DEFAULT '[]';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'university_tuition_costs' AND column_name = 'debt_management_resources'
  ) THEN
    ALTER TABLE university_tuition_costs ADD COLUMN debt_management_resources jsonb DEFAULT '[]';
  END IF;

END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_university_tuition_costs_enhanced_university_id 
ON university_tuition_costs(university_id);

-- Ensure RLS is enabled and add public read policy if not exists
ALTER TABLE university_tuition_costs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'university_tuition_costs' 
    AND policyname = 'University tuition costs are publicly readable'
  ) THEN
    CREATE POLICY "University tuition costs are publicly readable"
      ON university_tuition_costs
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;