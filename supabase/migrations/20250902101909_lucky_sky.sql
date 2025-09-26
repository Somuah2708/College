/*
  # Create study plans table

  1. New Tables
    - `study_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `plan_name` (text, required)
      - `description` (text, optional)
      - `subject` (text, optional)
      - `target_date` (date, required)
      - `status` (text, default 'active')
      - `priority` (text, default 'medium')
      - `study_sessions` (jsonb, array of study sessions)
      - `goals` (jsonb, array of goals)
      - `progress_percentage` (integer, default 0)
      - `total_hours_planned` (integer, default 0)
      - `total_hours_completed` (integer, default 0)
      - `study_methods` (jsonb, array of preferred study methods)
      - `resources` (jsonb, array of study resources)
      - `notes` (text, optional)
      - `reminder_settings` (jsonb, reminder preferences)
      - `tags` (jsonb, array of tags)
      - `is_archived` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `study_plans` table
    - Add policies for authenticated users to manage their own study plans

  3. Indexes
    - Add indexes for better query performance on user_id, status, and target_date
</*/

-- Create study_plans table
CREATE TABLE IF NOT EXISTS public.study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  description text DEFAULT '',
  subject text DEFAULT '',
  target_date date NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  study_sessions jsonb DEFAULT '[]'::jsonb,
  goals jsonb DEFAULT '[]'::jsonb,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  total_hours_planned integer DEFAULT 0,
  total_hours_completed integer DEFAULT 0,
  study_methods jsonb DEFAULT '[]'::jsonb,
  resources jsonb DEFAULT '[]'::jsonb,
  notes text DEFAULT '',
  reminder_settings jsonb DEFAULT '{}'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can insert their own study plans"
  ON public.study_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own study plans"
  ON public.study_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own study plans"
  ON public.study_plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study plans"
  ON public.study_plans
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON public.study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_status ON public.study_plans(user_id, status);
CREATE INDEX IF NOT EXISTS idx_study_plans_target_date ON public.study_plans(user_id, target_date);
CREATE INDEX IF NOT EXISTS idx_study_plans_priority ON public.study_plans(user_id, priority);
CREATE INDEX IF NOT EXISTS idx_study_plans_archived ON public.study_plans(user_id, is_archived);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_study_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_study_plans_updated_at_trigger
  BEFORE UPDATE ON public.study_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_study_plans_updated_at();