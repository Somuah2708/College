/*
  # Add notification preferences to user settings

  1. Schema Updates
    - Add notification preference columns to user_settings table
    - Add default values for new notification settings
    - Ensure backward compatibility

  2. New Columns
    - scholarship_alerts (boolean, default true)
    - program_updates (boolean, default true) 
    - university_news (boolean, default true)
    - career_opportunities (boolean, default true)
    - event_reminders (boolean, default true)
    - application_deadlines (boolean, default true)
    - interest_based_content (boolean, default true)
*/

-- Add notification preference columns to user_settings table
DO $$
BEGIN
  -- Add scholarship_alerts column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'scholarship_alerts'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN scholarship_alerts boolean DEFAULT true;
  END IF;

  -- Add program_updates column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'program_updates'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN program_updates boolean DEFAULT true;
  END IF;

  -- Add university_news column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'university_news'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN university_news boolean DEFAULT true;
  END IF;

  -- Add career_opportunities column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'career_opportunities'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN career_opportunities boolean DEFAULT true;
  END IF;

  -- Add event_reminders column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'event_reminders'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN event_reminders boolean DEFAULT true;
  END IF;

  -- Add application_deadlines column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'application_deadlines'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN application_deadlines boolean DEFAULT true;
  END IF;

  -- Add interest_based_content column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_settings' AND column_name = 'interest_based_content'
  ) THEN
    ALTER TABLE user_settings ADD COLUMN interest_based_content boolean DEFAULT true;
  END IF;
END $$;