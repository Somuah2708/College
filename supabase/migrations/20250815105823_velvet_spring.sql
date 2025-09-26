/*
  # Create schedule events table

  1. New Tables
    - `schedule_events`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `description` (text)
      - `start_time` (text)
      - `end_time` (text)
      - `event_date` (date)
      - `location` (text)
      - `event_type` (text)
      - `color` (text)
      - `recurring` (boolean)
      - `recurring_pattern` (text)
      - `reminders` (jsonb array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `schedule_events` table
    - Add policies for authenticated users to manage their own events
*/

CREATE TABLE IF NOT EXISTS schedule_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  start_time text NOT NULL,
  end_time text NOT NULL,
  event_date date NOT NULL,
  location text DEFAULT '',
  event_type text DEFAULT 'personal',
  color text DEFAULT '#3B82F6',
  recurring boolean DEFAULT false,
  recurring_pattern text DEFAULT 'weekly',
  reminders jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE schedule_events ENABLE ROW LEVEL SECURITY;

-- Users can read their own events
CREATE POLICY "Users can read own schedule events"
  ON schedule_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own events
CREATE POLICY "Users can insert own schedule events"
  ON schedule_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own events
CREATE POLICY "Users can update own schedule events"
  ON schedule_events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own events
CREATE POLICY "Users can delete own schedule events"
  ON schedule_events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_schedule_events_user_date 
  ON schedule_events(user_id, event_date);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_schedule_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_schedule_events_updated_at_trigger
  BEFORE UPDATE ON schedule_events
  FOR EACH ROW
  EXECUTE FUNCTION update_schedule_events_updated_at();