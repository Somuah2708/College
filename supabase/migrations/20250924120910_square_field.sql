/*
  # Populate Home Screen with Sample Data

  1. Sample Posts
    - Various post types (text, image, video, carousel)
    - Different authors and content categories
    - Realistic engagement metrics
    - Diverse content for testing

  2. Sample Media
    - Multiple images per post for carousels
    - Video content with thumbnails
    - Proper media metadata

  3. Sample Interactions
    - Likes, shares, saves, views
    - Comments and replies
    - Hashtag usage

  4. Sample Trending Data
    - Trending posts and hashtags
    - Category-based trending
*/

-- Insert sample posts
INSERT INTO posts (
  id,
  author_id,
  author_name,
  author_username,
  author_avatar_url,
  author_verified,
  author_role,
  caption,
  post_type,
  content_data,
  likes_count,
  comments_count,
  shares_count,
  views_count,
  saves_count,
  status,
  visibility,
  published_at,
  tags,
  category,
  target_audience,
  location,
  engagement_score,
  trending_score,
  quality_score,
  is_featured
) VALUES 
-- Post 1: University announcement with carousel
(
  'post-1',
  null,
  'Stanford University',
  'stanford_official',
  'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
  true,
  'university',
  'Exciting news! Our Computer Science program has been ranked #1 globally for the 5th consecutive year. Join thousands of students who are shaping the future of technology. 🚀

#StanfordCS #TechEducation #Innovation #ComputerScience #University #Ranking #Technology #Education #Students #Future',
  'carousel',
  '{"announcement_type": "ranking", "program": "Computer Science", "ranking": 1, "consecutive_years": 5}',
  15420,
  892,
  234,
  45670,
  1240,
  'published',
  'public',
  now() - interval '2 hours',
  ARRAY['stanford', 'computer_science', 'ranking', 'technology', 'education', 'university'],
  'academics',
  ARRAY['prospective_students', 'current_students', 'parents', 'educators'],
  'Stanford, CA',
  95.5,
  98.2,
  9.8,
  true
),
-- Post 2: Student achievement story
(
  'post-2',
  null,
  'Sarah Chen',
  'sarah_chen_cs',
  'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
  false,
  'student',
  'Just received my acceptance letter to MIT! 🎉 After months of preparation and countless hours of studying, dreams do come true. Thank you to everyone who supported me on this journey.

The key was consistency, never giving up, and believing in myself. To everyone applying this year - you got this! 💪

#MITBound #DreamsComeTrue #HardWorkPaysOff #MIT #Acceptance #StudentLife #Motivation #Success #Engineering #Goals',
  'image',
  '{"achievement_type": "acceptance", "university": "MIT", "program": "Engineering", "application_year": 2025}',
  3240,
  156,
  89,
  12340,
  567,
  'published',
  'public',
  now() - interval '4 hours',
  ARRAY['mit', 'acceptance', 'student_achievement', 'motivation', 'engineering'],
  'student_life',
  ARRAY['prospective_students', 'current_students', 'parents'],
  'Boston, MA',
  87.3,
  92.1,
  9.2,
  true
),
-- Post 3: Scholarship announcement
(
  'post-3',
  null,
  'Tech Scholarship Foundation',
  'tech_scholarships',
  'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
  true,
  'organization',
  '🚨 SCHOLARSHIP ALERT 🚨

We''re offering 100 full scholarships for Computer Science students! Application deadline: March 15, 2025.

Requirements:
• GPA 3.5+
• Leadership experience
• Community service
• Essay submission

This covers:
✅ Full tuition
✅ Living expenses
✅ Textbooks
✅ Laptop allowance
✅ Mentorship program

Apply now! Link in bio.

#TechScholarship #FullFunding #ComputerScience #Scholarship #Education #Opportunity #Students #Technology #Apply #Deadline',
  'image',
  '{"scholarship_type": "full_funding", "amount": "full_tuition", "deadline": "2025-03-15", "spots_available": 100}',
  8760,
  445,
  1200,
  28900,
  2340,
  'published',
  'public',
  now() - interval '6 hours',
  ARRAY['scholarship', 'computer_science', 'full_funding', 'opportunity', 'education'],
  'funding',
  ARRAY['prospective_students', 'current_students', 'parents'],
  'Global',
  91.7,
  95.8,
  9.5,
  true
),
-- Post 4: Alumni success story with video
(
  'post-4',
  null,
  'Michael Rodriguez',
  'mike_rodriguez_dev',
  'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
  false,
  'alumni',
  'From student to Software Engineer at Google! 💻✨

My journey:
📚 Computer Science at UC Berkeley
🔬 Research internship at Stanford
💼 Now building products used by millions

To current students: believe in yourself and never stop learning!

Key tips that helped me:
1. Build projects outside of class
2. Contribute to open source
3. Network with professionals
4. Never stop learning new technologies
5. Practice coding interviews regularly

#GoogleLife #SoftwareEngineer #AlumniStory #TechCareer #UCBerkeley #Google #Success #Coding #Career #Inspiration',
  'video',
  '{"career_progression": ["UC Berkeley", "Stanford Research", "Google"], "current_role": "Software Engineer", "company": "Google"}',
  5680,
  289,
  167,
  18450,
  890,
  'published',
  'public',
  now() - interval '8 hours',
  ARRAY['google', 'software_engineer', 'alumni', 'career', 'success', 'berkeley'],
  'career',
  ARRAY['current_students', 'prospective_students', 'career_seekers'],
  'Mountain View, CA',
  89.4,
  88.7,
  9.1,
  false
),
-- Post 5: Research breakthrough
(
  'post-5',
  null,
  'Harvard University',
  'harvard_official',
  'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
  true,
  'university',
  'Innovation Lab Update: Our students just developed an AI system that can predict climate patterns with 95% accuracy! 🌍🤖

This groundbreaking research will be presented at the International Climate Conference next month.

Research highlights:
🔬 2 years of development
📊 95% accuracy rate
🌡️ Climate pattern prediction
🏆 International recognition
👥 Student-led research team

Proud of our brilliant researchers! This is the future of climate science.

#HarvardInnovation #ClimateAI #StudentResearch #Innovation #AI #ClimateScience #Research #Harvard #Breakthrough #Future',
  'carousel',
  '{"research_type": "AI_climate", "accuracy": "95%", "duration": "2_years", "team_type": "student_led"}',
  12340,
  567,
  890,
  34560,
  1567,
  'published',
  'public',
  now() - interval '12 hours',
  ARRAY['harvard', 'ai', 'climate', 'research', 'innovation', 'students'],
  'research',
  ARRAY['researchers', 'students', 'academics', 'climate_enthusiasts'],
  'Cambridge, MA',
  93.2,
  94.5,
  9.7,
  true
),
-- Post 6: Study abroad opportunity
(
  'post-6',
  null,
  'Global Education Network',
  'global_edu_network',
  'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
  true,
  'organization',
  '🌟 FEATURED OPPORTUNITY 🌟

Exchange program to Tokyo University now open! Experience world-class education in Japan while immersing yourself in a rich cultural environment.

Program benefits:
✅ Full scholarship available
✅ Housing provided
✅ Language support included
✅ Cultural immersion program
✅ Academic credit transfer
✅ Internship opportunities

Application requirements:
• GPA 3.0+
• Language proficiency
• Cultural adaptability
• Academic excellence

Deadline: February 28, 2025

#StudyAbroad #TokyoUniversity #ExchangeProgram #GlobalEducation #Japan #Scholarship #Opportunity #Culture #International #Students',
  'image',
  '{"program_type": "exchange", "destination": "Tokyo_University", "duration": "1_semester", "scholarship": true}',
  6890,
  234,
  456,
  19230,
  1123,
  'published',
  'public',
  now() - interval '1 day',
  ARRAY['study_abroad', 'tokyo', 'exchange', 'scholarship', 'japan', 'international'],
  'opportunities',
  ARRAY['current_students', 'international_students'],
  'Tokyo, Japan',
  85.6,
  87.3,
  8.9,
  false
),
-- Post 7: Campus life update
(
  'post-7',
  null,
  'UCLA Student Life',
  'ucla_student_life',
  'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg',
  true,
  'university',
  'Spring Festival 2025 is here! 🌸🎉

Join us for a week of amazing events:
🎭 Cultural performances
🍕 Food festival
🎵 Live music concerts
🏆 Sports competitions
🎨 Art exhibitions
📚 Academic showcases

When: March 15-22, 2025
Where: UCLA Campus
Cost: FREE for students!

This is what makes college life unforgettable. See you there!

#UCLASpringFest #CampusLife #StudentEvents #Culture #Festival #UCLA #Students #Community #Fun #Spring2025',
  'carousel',
  '{"event_type": "festival", "duration": "1_week", "cost": "free", "activities": ["cultural", "food", "music", "sports", "art"]}',
  4560,
  178,
  234,
  15670,
  678,
  'published',
  'public',
  now() - interval '18 hours',
  ARRAY['ucla', 'campus_life', 'festival', 'events', 'student_life', 'community'],
  'student_life',
  ARRAY['current_students', 'prospective_students', 'local_community'],
  'Los Angeles, CA',
  82.1,
  84.6,
  8.7,
  false
),
-- Post 8: Career advice
(
  'post-8',
  null,
  'Career Coach Lisa',
  'career_coach_lisa',
  'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
  false,
  'career_coach',
  'Top 5 mistakes students make when applying for internships (and how to avoid them) 🎯

1️⃣ Generic applications
❌ Don''t: Send the same resume everywhere
✅ Do: Customize for each company

2️⃣ Weak online presence
❌ Don''t: Ignore LinkedIn and GitHub
✅ Do: Build a professional online brand

3️⃣ Poor interview prep
❌ Don''t: Wing it
✅ Do: Practice behavioral and technical questions

4️⃣ Not following up
❌ Don''t: Apply and forget
✅ Do: Send thoughtful follow-up emails

5️⃣ Limiting your options
❌ Don''t: Only apply to big tech
✅ Do: Consider startups and mid-size companies

Save this post for your internship applications! 💾

#CareerAdvice #Internships #JobSearch #Students #Career #Tips #Professional #Success #Applications #Interview',
  'text',
  '{"advice_type": "internship_tips", "tips_count": 5, "target": "students"}',
  7890,
  345,
  567,
  21230,
  1890,
  'published',
  'public',
  now() - interval '1 day 6 hours',
  ARRAY['career_advice', 'internships', 'job_search', 'tips', 'students'],
  'career',
  ARRAY['current_students', 'job_seekers', 'career_changers'],
  'Remote',
  88.9,
  86.4,
  9.3,
  false
);

-- Insert sample media for posts
INSERT INTO post_media (
  id,
  post_id,
  media_type,
  media_url,
  thumbnail_url,
  alt_text,
  width,
  height,
  order_index,
  is_primary
) VALUES 
-- Media for Post 1 (Stanford - carousel)
('media-1-1', 'post-1', 'image', 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg', null, 'Stanford University campus aerial view', 1920, 1080, 0, true),
('media-1-2', 'post-1', 'image', 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg', null, 'Computer Science building at Stanford', 1920, 1080, 1, false),
('media-1-3', 'post-1', 'image', 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg', null, 'Students working in CS lab', 1920, 1080, 2, false),
('media-1-4', 'post-1', 'image', 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg', null, 'Graduation ceremony at Stanford', 1920, 1080, 3, false),
('media-1-5', 'post-1', 'image', 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg', null, 'Stanford CS ranking certificate', 1920, 1080, 4, false),

-- Media for Post 2 (Sarah - single image)
('media-2-1', 'post-2', 'image', 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg', null, 'MIT acceptance letter celebration', 1920, 1080, 0, true),

-- Media for Post 3 (Scholarship - single image)
('media-3-1', 'post-3', 'image', 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg', null, 'Scholarship announcement graphic', 1920, 1080, 0, true),

-- Media for Post 4 (Michael - video)
('media-4-1', 'post-4', 'video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg', 'Michael Rodriguez career journey video', 1920, 1080, 0, true),

-- Media for Post 5 (Harvard - carousel)
('media-5-1', 'post-5', 'image', 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg', null, 'Harvard Innovation Lab exterior', 1920, 1080, 0, true),
('media-5-2', 'post-5', 'image', 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg', null, 'AI research equipment and setup', 1920, 1080, 1, false),
('media-5-3', 'post-5', 'image', 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg', null, 'Climate data visualization screens', 1920, 1080, 2, false),
('media-5-4', 'post-5', 'image', 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg', null, 'Research team presenting findings', 1920, 1080, 3, false),

-- Media for Post 6 (Global Education - single image)
('media-6-1', 'post-6', 'image', 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg', null, 'Tokyo University campus and students', 1920, 1080, 0, true),

-- Media for Post 7 (UCLA - carousel)
('media-7-1', 'post-7', 'image', 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg', null, 'UCLA Spring Festival main stage', 1920, 1080, 0, true),
('media-7-2', 'post-7', 'image', 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg', null, 'Cultural performance at festival', 1920, 1080, 1, false),
('media-7-3', 'post-7', 'image', 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg', null, 'Food festival booths and vendors', 1920, 1080, 2, false),
('media-7-4', 'post-7', 'image', 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg', null, 'Students enjoying festival activities', 1920, 1080, 3, false);

-- Insert sample hashtags
INSERT INTO post_hashtags (
  hashtag,
  usage_count,
  trending_score,
  category,
  first_used_at,
  last_used_at
) VALUES 
('#stanford', 5, 95.2, 'universities', now() - interval '2 hours', now() - interval '2 hours'),
('#mit', 8, 92.1, 'universities', now() - interval '1 week', now() - interval '4 hours'),
('#scholarship', 15, 89.7, 'funding', now() - interval '2 weeks', now() - interval '6 hours'),
('#computer_science', 25, 87.3, 'academics', now() - interval '1 month', now() - interval '2 hours'),
('#career', 12, 85.6, 'career', now() - interval '3 weeks', now() - interval '1 day'),
('#innovation', 18, 84.2, 'research', now() - interval '2 weeks', now() - interval '12 hours'),
('#student_life', 22, 82.8, 'student_life', now() - interval '1 month', now() - interval '18 hours'),
('#technology', 30, 81.5, 'technology', now() - interval '2 months', now() - interval '2 hours'),
('#education', 35, 80.1, 'education', now() - interval '3 months', now() - interval '6 hours'),
('#opportunity', 20, 78.9, 'opportunities', now() - interval '1 month', now() - interval '1 day');

-- Insert hashtag associations
INSERT INTO post_hashtag_associations (post_id, hashtag_id) 
SELECT p.id, h.id 
FROM posts p, post_hashtags h 
WHERE 
  (p.id = 'post-1' AND h.hashtag IN ('#stanford', '#computer_science', '#technology', '#education')) OR
  (p.id = 'post-2' AND h.hashtag IN ('#mit', '#student_life', '#education')) OR
  (p.id = 'post-3' AND h.hashtag IN ('#scholarship', '#computer_science', '#opportunity', '#education')) OR
  (p.id = 'post-4' AND h.hashtag IN ('#career', '#technology', '#innovation')) OR
  (p.id = 'post-5' AND h.hashtag IN ('#innovation', '#technology', '#education')) OR
  (p.id = 'post-6' AND h.hashtag IN ('#opportunity', '#education', '#student_life')) OR
  (p.id = 'post-7' AND h.hashtag IN ('#student_life', '#education')) OR
  (p.id = 'post-8' AND h.hashtag IN ('#career', '#opportunity', '#education'));

-- Insert sample interactions (likes, views, etc.)
INSERT INTO post_interactions (
  post_id,
  user_id,
  interaction_type,
  interaction_data
) 
SELECT 
  p.id,
  null, -- Anonymous interactions for demo
  'view',
  '{"source": "feed", "device": "mobile"}'
FROM posts p;

-- Insert sample comments
INSERT INTO post_comments (
  id,
  post_id,
  user_id,
  content,
  likes_count,
  created_at
) VALUES 
-- Comments for Post 1 (Stanford)
('comment-1-1', 'post-1', null, 'Congratulations Stanford! Well deserved recognition for an amazing program. 🎉', 45, now() - interval '1 hour'),
('comment-1-2', 'post-1', null, 'This is why Stanford CS is my dream school! Working hard to get there 💪', 32, now() - interval '30 minutes'),
('comment-1-3', 'post-1', null, 'As a current Stanford CS student, I can confirm this program is incredible! The faculty and resources are world-class.', 67, now() - interval '45 minutes'),

-- Comments for Post 2 (Sarah)
('comment-2-1', 'post-2', null, 'Congratulations Sarah! Your hard work paid off! MIT is lucky to have you 🎓', 28, now() - interval '3 hours'),
('comment-2-2', 'post-2', null, 'So inspiring! Can you share some tips for the application process?', 19, now() - interval '2 hours'),
('comment-2-3', 'post-2', null, 'Amazing achievement! Wishing you all the best at MIT 🚀', 15, now() - interval '1 hour'),

-- Comments for Post 3 (Scholarship)
('comment-3-1', 'post-3', null, 'This is exactly what I needed! Thank you for this opportunity 🙏', 89, now() - interval '5 hours'),
('comment-3-2', 'post-3', null, 'When will the application portal open? Can''t wait to apply!', 56, now() - interval '4 hours'),
('comment-3-3', 'post-3', null, 'Full funding including laptop allowance? This is incredible! 💻', 73, now() - interval '3 hours'),

-- Comments for Post 4 (Michael)
('comment-4-1', 'post-4', null, 'Your journey is so inspiring Michael! Thanks for sharing these valuable tips 💡', 34, now() - interval '7 hours'),
('comment-4-2', 'post-4', null, 'The open source contribution tip is gold! Started contributing last month and already seeing results.', 41, now() - interval '6 hours'),

-- Comments for Post 5 (Harvard)
('comment-5-1', 'post-5', null, 'This AI research could revolutionize climate science! Proud of these students 🌍', 78, now() - interval '10 hours'),
('comment-5-2', 'post-5', null, 'Harvard continues to lead in innovation. Can''t wait to see the conference presentation!', 52, now() - interval '8 hours'),

-- Comments for Post 6 (Global Education)
('comment-6-1', 'post-6', null, 'Tokyo University exchange sounds amazing! Definitely applying for this opportunity 🇯🇵', 23, now() - interval '20 hours'),
('comment-6-2', 'post-6', null, 'The cultural immersion aspect is what makes this program special. Great opportunity!', 18, now() - interval '18 hours'),

-- Comments for Post 7 (UCLA)
('comment-7-1', 'post-7', null, 'UCLA Spring Festival is always the highlight of the year! Can''t wait 🎉', 12, now() - interval '15 hours'),
('comment-7-2', 'post-7', null, 'The food festival alone is worth attending! See you all there 🍕', 8, now() - interval '12 hours'),

-- Comments for Post 8 (Career Coach)
('comment-8-1', 'post-8', null, 'These tips are so practical! Wish I had known this during my internship search.', 67, now() - interval '1 day 2 hours'),
('comment-8-2', 'post-8', null, 'The networking tip changed my career trajectory. Thanks for the great advice! 🙌', 45, now() - interval '1 day 1 hour');

-- Insert trending content
INSERT INTO trending_content (
  content_id,
  content_type,
  trending_score,
  engagement_velocity,
  view_velocity,
  trending_category,
  trending_period,
  calculated_at,
  expires_at
) VALUES 
('post-1', 'post', 98.2, 45.6, 123.4, 'academics', '24h', now(), now() + interval '24 hours'),
('post-3', 'post', 95.8, 38.9, 98.7, 'funding', '24h', now(), now() + interval '24 hours'),
('post-5', 'post', 94.5, 42.1, 87.3, 'research', '24h', now(), now() + interval '24 hours'),
('post-2', 'post', 92.1, 35.7, 76.2, 'student_life', '24h', now(), now() + interval '24 hours'),
('post-4', 'post', 88.7, 29.4, 65.8, 'career', '24h', now(), now() + interval '24 hours');

-- Insert sample user feed preferences (for when users are authenticated)
INSERT INTO user_feed_preferences (
  user_id,
  algorithm_type,
  preferred_categories,
  show_trending,
  show_recommendations,
  notify_on_trending
) 
SELECT 
  id,
  'balanced',
  ARRAY['academics', 'career', 'opportunities'],
  true,
  true,
  true
FROM auth.users 
LIMIT 5;