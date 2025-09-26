/*
  # Home Screen Content Management System

  1. New Tables
    - `posts`
      - Core post content with author info, captions, engagement metrics
      - Support for different post types (text, image, video, carousel)
      - Scheduling and status management
    - `post_media`
      - Multiple media items per post (images, videos)
      - Support for carousels and mixed media
      - Media metadata and processing status
    - `post_interactions`
      - User interactions (likes, shares, saves, views)
      - Comprehensive engagement tracking
    - `post_comments`
      - Nested comments with threading support
      - Comment reactions and moderation
    - `post_hashtags`
      - Hashtag management and trending tracking
    - `user_feed_preferences`
      - Personalized feed customization
      - Content filtering and algorithm preferences
    - `trending_content`
      - Real-time trending calculation
      - Category-based trending
    - `content_reports`
      - Content moderation and reporting system

  2. Security
    - Enable RLS on all tables
    - Appropriate policies for public reading and authenticated user actions
    - Content moderation and safety policies

  3. Features
    - Full CRUD operations for posts and media
    - Real-time engagement tracking
    - Trending algorithm support
    - Content moderation system
    - Personalized feed preferences
    - Advanced search and filtering
*/

-- Posts table - Core content management
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL DEFAULT '',
  author_username text NOT NULL DEFAULT '',
  author_avatar_url text DEFAULT '',
  author_verified boolean DEFAULT false,
  author_role text DEFAULT 'student',
  
  -- Content
  caption text NOT NULL,
  post_type text NOT NULL DEFAULT 'text' CHECK (post_type IN ('text', 'image', 'video', 'carousel', 'poll', 'event')),
  content_data jsonb DEFAULT '{}',
  
  -- Engagement metrics
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  saves_count integer DEFAULT 0,
  
  -- Post management
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'deleted', 'scheduled')),
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
  scheduled_for timestamptz,
  published_at timestamptz DEFAULT now(),
  
  -- Categorization and discovery
  tags text[] DEFAULT '{}',
  category text DEFAULT 'general',
  target_audience text[] DEFAULT '{}',
  location text DEFAULT '',
  
  -- Algorithm and trending
  engagement_score numeric DEFAULT 0,
  trending_score numeric DEFAULT 0,
  quality_score numeric DEFAULT 0,
  
  -- Moderation
  is_featured boolean DEFAULT false,
  is_pinned boolean DEFAULT false,
  content_warnings text[] DEFAULT '{}',
  moderation_status text DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(caption, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(author_name, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'C')
  ) STORED
);

-- Post media table - Support for multiple images/videos per post
CREATE TABLE IF NOT EXISTS post_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  
  -- Media details
  media_type text NOT NULL CHECK (media_type IN ('image', 'video', 'gif', 'audio')),
  media_url text NOT NULL,
  thumbnail_url text,
  alt_text text DEFAULT '',
  
  -- Media metadata
  file_size bigint,
  duration integer, -- for videos/audio in seconds
  width integer,
  height integer,
  format text,
  
  -- Organization
  order_index integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  
  -- Processing status
  processing_status text DEFAULT 'completed' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  
  created_at timestamptz DEFAULT now()
);

-- Post interactions - Comprehensive engagement tracking
CREATE TABLE IF NOT EXISTS post_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Interaction types
  interaction_type text NOT NULL CHECK (interaction_type IN ('like', 'share', 'save', 'view', 'click', 'report')),
  
  -- Interaction metadata
  interaction_data jsonb DEFAULT '{}',
  device_info jsonb DEFAULT '{}',
  
  created_at timestamptz DEFAULT now(),
  
  -- Ensure one interaction per user per post per type
  UNIQUE(post_id, user_id, interaction_type)
);

-- Post comments - Threaded commenting system
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES post_comments(id) ON DELETE CASCADE,
  
  -- Comment content
  content text NOT NULL,
  
  -- Engagement
  likes_count integer DEFAULT 0,
  replies_count integer DEFAULT 0,
  
  -- Moderation
  is_edited boolean DEFAULT false,
  is_pinned boolean DEFAULT false,
  moderation_status text DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Prevent excessively long comments
  CONSTRAINT comment_length_check CHECK (char_length(content) >= 1 AND char_length(content) <= 2000)
);

-- Post hashtags - Hashtag management and trending
CREATE TABLE IF NOT EXISTS post_hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hashtag text NOT NULL,
  
  -- Trending metrics
  usage_count integer DEFAULT 1,
  trending_score numeric DEFAULT 0,
  
  -- Categorization
  category text DEFAULT 'general',
  
  -- Metadata
  first_used_at timestamptz DEFAULT now(),
  last_used_at timestamptz DEFAULT now(),
  
  -- Ensure unique hashtags
  UNIQUE(hashtag)
);

-- Post hashtag associations
CREATE TABLE IF NOT EXISTS post_hashtag_associations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  hashtag_id uuid REFERENCES post_hashtags(id) ON DELETE CASCADE,
  
  created_at timestamptz DEFAULT now(),
  
  -- Ensure unique associations
  UNIQUE(post_id, hashtag_id)
);

-- User feed preferences - Personalization
CREATE TABLE IF NOT EXISTS user_feed_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Feed algorithm preferences
  algorithm_type text DEFAULT 'balanced' CHECK (algorithm_type IN ('chronological', 'engagement', 'balanced', 'personalized')),
  
  -- Content preferences
  preferred_categories text[] DEFAULT '{}',
  blocked_categories text[] DEFAULT '{}',
  preferred_authors text[] DEFAULT '{}',
  blocked_authors text[] DEFAULT '{}',
  
  -- Interaction preferences
  show_liked_posts boolean DEFAULT true,
  show_shared_posts boolean DEFAULT true,
  show_trending boolean DEFAULT true,
  show_recommendations boolean DEFAULT true,
  
  -- Content filtering
  content_language text DEFAULT 'en',
  mature_content boolean DEFAULT false,
  
  -- Notification preferences for feed
  notify_on_new_posts boolean DEFAULT true,
  notify_on_trending boolean DEFAULT true,
  notify_on_mentions boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- One preference set per user
  UNIQUE(user_id)
);

-- Trending content - Real-time trending calculation
CREATE TABLE IF NOT EXISTS trending_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  content_type text NOT NULL DEFAULT 'post',
  
  -- Trending metrics
  trending_score numeric NOT NULL DEFAULT 0,
  engagement_velocity numeric DEFAULT 0, -- engagement per hour
  view_velocity numeric DEFAULT 0, -- views per hour
  
  -- Trending categories
  trending_category text DEFAULT 'general',
  trending_region text DEFAULT 'global',
  
  -- Time windows
  trending_period text DEFAULT '24h' CHECK (trending_period IN ('1h', '6h', '24h', '7d', '30d')),
  
  -- Metadata
  calculated_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '24 hours'),
  
  -- Ensure unique trending entries per period
  UNIQUE(content_id, trending_period, trending_category)
);

-- Content reports - Moderation system
CREATE TABLE IF NOT EXISTS content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  content_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  content_type text NOT NULL DEFAULT 'post',
  
  -- Report details
  report_reason text NOT NULL CHECK (report_reason IN ('spam', 'harassment', 'inappropriate', 'misinformation', 'copyright', 'other')),
  report_description text DEFAULT '',
  
  -- Moderation
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  moderator_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  moderator_notes text DEFAULT '',
  resolution_action text DEFAULT '',
  
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- User saved posts - Save functionality
CREATE TABLE IF NOT EXISTS user_saved_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  
  -- Save organization
  collection_name text DEFAULT 'default',
  notes text DEFAULT '',
  
  created_at timestamptz DEFAULT now(),
  
  -- Ensure unique saves per user per post
  UNIQUE(user_id, post_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts(status, published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_trending ON posts(trending_score DESC, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_engagement ON posts(engagement_score DESC, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING gin(search_vector);

CREATE INDEX IF NOT EXISTS idx_post_media_post_id ON post_media(post_id, order_index);
CREATE INDEX IF NOT EXISTS idx_post_media_type ON post_media(media_type);

CREATE INDEX IF NOT EXISTS idx_post_interactions_post ON post_interactions(post_id, interaction_type);
CREATE INDEX IF NOT EXISTS idx_post_interactions_user ON post_interactions(user_id, interaction_type);
CREATE INDEX IF NOT EXISTS idx_post_interactions_created ON post_interactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_post_comments_post ON post_comments(post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_comments_user ON post_comments(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent ON post_comments(parent_comment_id, created_at);

CREATE INDEX IF NOT EXISTS idx_hashtags_trending ON post_hashtags(trending_score DESC, usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_hashtags_category ON post_hashtags(category, trending_score DESC);

CREATE INDEX IF NOT EXISTS idx_trending_content_score ON trending_content(trending_score DESC, calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_trending_content_category ON trending_content(trending_category, trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_trending_content_expires ON trending_content(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_content_reports_status ON content_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_reports_content ON content_reports(content_id, content_type);

CREATE INDEX IF NOT EXISTS idx_user_saved_posts_user ON user_saved_posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_saved_posts_collection ON user_saved_posts(user_id, collection_name, created_at DESC);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_hashtag_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feed_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Posts policies
CREATE POLICY "Posts are publicly readable" ON posts
  FOR SELECT TO public
  USING (status = 'published' AND visibility = 'public');

CREATE POLICY "Users can create their own posts" ON posts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE TO authenticated
  USING (auth.uid() = author_id);

-- Post media policies
CREATE POLICY "Post media is publicly readable" ON post_media
  FOR SELECT TO public
  USING (EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.id = post_media.post_id 
    AND posts.status = 'published' 
    AND posts.visibility = 'public'
  ));

CREATE POLICY "Users can manage media for their posts" ON post_media
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.id = post_media.post_id 
    AND posts.author_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.id = post_media.post_id 
    AND posts.author_id = auth.uid()
  ));

-- Post interactions policies
CREATE POLICY "Users can view public post interactions" ON post_interactions
  FOR SELECT TO public
  USING (EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.id = post_interactions.post_id 
    AND posts.status = 'published' 
    AND posts.visibility = 'public'
  ));

CREATE POLICY "Users can manage their own interactions" ON post_interactions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Post comments policies
CREATE POLICY "Comments are publicly readable" ON post_comments
  FOR SELECT TO public
  USING (EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.id = post_comments.post_id 
    AND posts.status = 'published' 
    AND posts.visibility = 'public'
  ) AND moderation_status = 'approved');

CREATE POLICY "Authenticated users can create comments" ON post_comments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON post_comments
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON post_comments
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Hashtags policies
CREATE POLICY "Hashtags are publicly readable" ON post_hashtags
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Authenticated users can create hashtags" ON post_hashtags
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update hashtag metrics" ON post_hashtags
  FOR UPDATE TO authenticated
  USING (true);

-- Hashtag associations policies
CREATE POLICY "Hashtag associations are publicly readable" ON post_hashtag_associations
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Users can manage hashtags for their posts" ON post_hashtag_associations
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.id = post_hashtag_associations.post_id 
    AND posts.author_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM posts 
    WHERE posts.id = post_hashtag_associations.post_id 
    AND posts.author_id = auth.uid()
  ));

-- User feed preferences policies
CREATE POLICY "Users can manage their own feed preferences" ON user_feed_preferences
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trending content policies
CREATE POLICY "Trending content is publicly readable" ON trending_content
  FOR SELECT TO public
  USING (expires_at > now() OR expires_at IS NULL);

CREATE POLICY "System can manage trending content" ON trending_content
  FOR ALL TO authenticated
  USING (true);

-- Content reports policies
CREATE POLICY "Users can create content reports" ON content_reports
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON content_reports
  FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id);

-- User saved posts policies
CREATE POLICY "Users can manage their own saved posts" ON user_saved_posts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Functions for updating engagement metrics

-- Function to update post engagement counts
CREATE OR REPLACE FUNCTION update_post_engagement_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment count
    IF NEW.interaction_type = 'like' THEN
      UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    ELSIF NEW.interaction_type = 'share' THEN
      UPDATE posts SET shares_count = shares_count + 1 WHERE id = NEW.post_id;
    ELSIF NEW.interaction_type = 'save' THEN
      UPDATE posts SET saves_count = saves_count + 1 WHERE id = NEW.post_id;
    ELSIF NEW.interaction_type = 'view' THEN
      UPDATE posts SET views_count = views_count + 1 WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement count
    IF OLD.interaction_type = 'like' THEN
      UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
    ELSIF OLD.interaction_type = 'share' THEN
      UPDATE posts SET shares_count = GREATEST(0, shares_count - 1) WHERE id = OLD.post_id;
    ELSIF OLD.interaction_type = 'save' THEN
      UPDATE posts SET saves_count = GREATEST(0, saves_count - 1) WHERE id = OLD.post_id;
    ELSIF OLD.interaction_type = 'view' THEN
      UPDATE posts SET views_count = GREATEST(0, views_count - 1) WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update comment counts
CREATE OR REPLACE FUNCTION update_post_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    -- Update parent comment reply count if this is a reply
    IF NEW.parent_comment_id IS NOT NULL THEN
      UPDATE post_comments SET replies_count = replies_count + 1 WHERE id = NEW.parent_comment_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
    -- Update parent comment reply count if this was a reply
    IF OLD.parent_comment_id IS NOT NULL THEN
      UPDATE post_comments SET replies_count = GREATEST(0, replies_count - 1) WHERE id = OLD.parent_comment_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update hashtag usage
CREATE OR REPLACE FUNCTION update_hashtag_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE post_hashtags 
    SET usage_count = usage_count + 1, last_used_at = now()
    WHERE id = NEW.hashtag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE post_hashtags 
    SET usage_count = GREATEST(0, usage_count - 1)
    WHERE id = OLD.hashtag_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate engagement score
CREATE OR REPLACE FUNCTION calculate_engagement_score(post_id uuid)
RETURNS numeric AS $$
DECLARE
  likes_weight numeric := 1.0;
  comments_weight numeric := 3.0;
  shares_weight numeric := 5.0;
  saves_weight numeric := 2.0;
  views_weight numeric := 0.1;
  
  post_likes integer;
  post_comments integer;
  post_shares integer;
  post_saves integer;
  post_views integer;
  post_age_hours numeric;
  
  engagement_score numeric;
BEGIN
  -- Get post metrics
  SELECT likes_count, comments_count, shares_count, saves_count, views_count,
         EXTRACT(EPOCH FROM (now() - published_at)) / 3600
  INTO post_likes, post_comments, post_shares, post_saves, post_views, post_age_hours
  FROM posts WHERE id = post_id;
  
  -- Calculate weighted engagement score with time decay
  engagement_score := (
    (post_likes * likes_weight) +
    (post_comments * comments_weight) +
    (post_shares * shares_weight) +
    (post_saves * saves_weight) +
    (post_views * views_weight)
  ) / GREATEST(1, post_age_hours * 0.1); -- Time decay factor
  
  RETURN engagement_score;
END;
$$ LANGUAGE plpgsql;

-- Function to update posts updated_at timestamp
CREATE OR REPLACE FUNCTION update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update comments updated_at timestamp
CREATE OR REPLACE FUNCTION update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update user feed preferences updated_at timestamp
CREATE OR REPLACE FUNCTION update_feed_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_post_engagement_trigger
  AFTER INSERT OR DELETE ON post_interactions
  FOR EACH ROW EXECUTE FUNCTION update_post_engagement_counts();

CREATE TRIGGER update_post_comment_counts_trigger
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comment_counts();

CREATE TRIGGER update_hashtag_usage_trigger
  AFTER INSERT OR DELETE ON post_hashtag_associations
  FOR EACH ROW EXECUTE FUNCTION update_hashtag_usage();

CREATE TRIGGER update_posts_updated_at_trigger
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_posts_updated_at();

CREATE TRIGGER update_comments_updated_at_trigger
  BEFORE UPDATE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_comments_updated_at();

CREATE TRIGGER update_feed_preferences_updated_at_trigger
  BEFORE UPDATE ON user_feed_preferences
  FOR EACH ROW EXECUTE FUNCTION update_feed_preferences_updated_at();