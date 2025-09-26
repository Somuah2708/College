/*
  # Add push token support to user profiles

  1. Schema Changes
    - Add `push_token` column to `user_profiles` table for storing Expo push tokens
    - Add `notification_preferences` column for storing user notification settings
    - Add indexes for efficient querying

  2. Security
    - Update RLS policies to allow users to update their own push tokens
    - Ensure push tokens are only accessible by the user themselves

  3. Functions
    - Add function to clean up expired push tokens
*/

-- Add push token column to user_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'push_token'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN push_token text;
  END IF;
END $$;

-- Add notification preferences column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'notification_preferences'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN notification_preferences jsonb DEFAULT '{
      "push_notifications": true,
      "email_notifications": true,
      "scholarship_alerts": true,
      "program_updates": true,
      "university_news": true,
      "career_opportunities": true,
      "event_reminders": true,
      "application_deadlines": true,
      "interest_based_content": true
    }'::jsonb;
  END IF;
END $$;

-- Add last_notification_check column to track when user last checked notifications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'last_notification_check'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_notification_check timestamptz DEFAULT now();
  END IF;
END $$;

-- Create index for push token lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_push_token 
ON user_profiles (push_token) 
WHERE push_token IS NOT NULL;

-- Create index for notification preferences
CREATE INDEX IF NOT EXISTS idx_user_profiles_notification_preferences 
ON user_profiles USING gin (notification_preferences);

-- Function to clean up expired or invalid push tokens
CREATE OR REPLACE FUNCTION cleanup_expired_push_tokens()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Remove push tokens that haven't been updated in 90 days
  UPDATE user_profiles 
  SET push_token = NULL 
  WHERE push_token IS NOT NULL 
    AND updated_at < now() - interval '90 days';
END;
$$;

-- Create a scheduled job to run cleanup weekly (if using pg_cron extension)
-- SELECT cron.schedule('cleanup-push-tokens', '0 2 * * 0', 'SELECT cleanup_expired_push_tokens();');

-- Update RLS policies to allow users to update their push tokens
CREATE POLICY IF NOT EXISTS "Users can update their own push token"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON user_profiles TO authenticated;