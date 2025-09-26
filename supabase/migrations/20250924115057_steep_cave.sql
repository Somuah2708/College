/*
  # Delete Home Screen Related Tables

  This migration removes all tables and functionalities specifically related to the home screen:
  
  1. Tables to be deleted:
     - posts (main content table)
     - post_media (images/videos for posts)
     - post_likes (user likes on posts)
     - post_hashtags (hashtag associations)
     - hashtags (hashtag definitions)
     - post_comments (comments on posts)
     - user_saved_posts (saved posts functionality)
     - trending_items (trending content)
     - post_categories (post categorization)
     - user_interactions (user activity tracking)

  2. Related functions and triggers will be automatically dropped
  
  3. All other tables and data remain untouched
*/

-- Drop tables in correct order (respecting foreign key dependencies)
DROP TABLE IF EXISTS post_hashtags CASCADE;
DROP TABLE IF EXISTS post_media CASCADE;
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS post_comments CASCADE;
DROP TABLE IF EXISTS user_saved_posts CASCADE;
DROP TABLE IF EXISTS user_interactions CASCADE;
DROP TABLE IF EXISTS trending_items CASCADE;
DROP TABLE IF EXISTS post_categories CASCADE;
DROP TABLE IF EXISTS hashtags CASCADE;
DROP TABLE IF EXISTS posts CASCADE;

-- Drop any related functions that might exist
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS increment_post_comment_count() CASCADE;
DROP FUNCTION IF EXISTS decrement_post_comment_count() CASCADE;