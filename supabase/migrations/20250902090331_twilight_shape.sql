/*
  # Create assignments table for Assignment Tracker

  1. New Tables
    - `assignments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, required)
      - `description` (text)
      - `subject` (text)
      - `due_date` (date, required)
      - `due_time` (time, required)
      - `priority` (text, enum: low, medium, high, urgent)
      - `status` (text, enum: pending, in_progress, completed, overdue)
      - `estimated_hours` (integer)
      - `actual_hours` (integer)
      - `reminders` (jsonb, array of reminder settings)
      - `attachments` (jsonb, array of attachment URLs)
      - `notes` (text)
      - `notification_ids` (jsonb, array of notification IDs)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `assignments` table
    - Add policies for authenticated users to manage their own assignments
*/

CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  subject text DEFAULT '',
  due_date date NOT NULL,
  due_time time NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  estimated_hours integer DEFAULT 2,
  actual_hours integer,
  reminders jsonb DEFAULT '[]'::jsonb,
  attachments jsonb DEFAULT '[]'::jsonb,
  notes text DEFAULT '',
  notification_ids jsonb DEFAULT '[]'::jsonb,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for assignments
CREATE POLICY "Users can insert their own assignments"
  ON assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own assignments"
  ON assignments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own assignments"
  ON assignments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assignments"
  ON assignments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_assignments_updated_at_trigger
  BEFORE UPDATE ON assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_assignments_updated_at();

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_assignments_priority ON assignments(user_id, priority);