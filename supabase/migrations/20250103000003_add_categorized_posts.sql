/*
  # Add diverse categorized posts for testing filter functionality
  
  This migration adds sample posts with proper categorization.
  Since you have an existing universities table, you'll need to:
  1. First run the inspect_and_map_universities.sql script
  2. Then manually update the university_id values in the INSERT statements below
  3. Replace 'your-university-id-here' with actual IDs from your universities table

  Categories: programs, academics, student-life, opportunities, news, policies, funding
*/

-- Insert categorized posts for comprehensive filter testing
-- NOTE: Replace the university_id values with actual IDs from your universities table

INSERT INTO public.posts (author_name, author_avatar, author_verified, caption, image_url, video_url, likes_count, comments_count, shares_count, views_count, university_id, category, tags) VALUES

-- Programs category posts
(
    'MIT Admissions',
    'https://images.pexels.com/photos/159844/mit-massachusetts-institute-of-technology-cambridge-university-159844.jpeg',
    true,
    'Introducing our new AI & Machine Learning Master''s Program! 🤖✨ 

Join the next generation of AI innovators with:
• Cutting-edge curriculum designed by industry experts
• Direct collaboration with leading tech companies
• Full scholarship opportunities available
• Applications open January 2025

#MITAIMasters #MachineLearning #FutureOfTech',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    null,
    8920,
    445,
    178,
    23456,
    null, -- Replace with your MIT university ID: 'your-mit-id-here'
    'programs',
    '["masters-program", "artificial-intelligence", "machine-learning", "technology", "innovation"]'::jsonb
),

-- Academics category posts
(
    'Stanford Research',
    'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
    true,
    'BREAKTHROUGH: Our team has developed a revolutionary quantum computing algorithm that could accelerate drug discovery by 1000x! 🧬⚡

Published in Nature Quantum Information today. This research represents 5 years of collaboration between Stanford''s CS and Medicine departments.

#QuantumComputing #DrugDiscovery #Stanford #Research #Innovation #Medicine',
    'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg',
    null,
    12450,
    678,
    234,
    34567,
    null, -- Replace with your Stanford university ID: 'your-stanford-id-here'
    'academics',
    '["research", "quantum-computing", "drug-discovery", "breakthrough", "medicine", "collaboration"]'::jsonb
),

-- Student Life category posts  
(
    'Berkeley Students Union',
    'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg',
    false,
    '🎉 SPRING FESTIVAL 2025 was absolutely incredible! 

3 days of amazing performances, food from around the world, and unforgettable memories with friends. Thank you to everyone who made this possible!

📸 Highlights:
• 50+ cultural performances
• Food trucks from 25+ countries
• 15,000 attendees across campus
• Live concerts featuring student bands

Already planning next year''s festival! 🌟

#BerkeleySpringFest #CampusLife #Diversity #Community #StudentLife',
    'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
    'https://sample-videos.com/zip/10/mp4/mp4/SampleVideo_1280x720_1mb.mp4',
    6789,
    234,
    89,
    19876,
    null, -- Replace with your UC Berkeley university ID: 'your-berkeley-id-here'
    'student-life',
    '["festival", "spring-fest", "cultural-diversity", "performances", "community", "campus-events"]'::jsonb
),

-- Opportunities category posts
(
    'Career Center',
    'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
    true,
    '🚀 TECH INTERNSHIP FAIR 2025 - March 15-16

200+ leading companies recruiting students:
• Google, Microsoft, Apple, Meta
• Tesla, SpaceX, NVIDIA
• Local companies and startups

✨ What to expect:
📋 On-spot interviews
💼 Internship & full-time positions
🎯 Networking sessions with industry leaders
📚 Resume review workshops

Register now! #TechCareers #Internships #CareerFair #Opportunities',
    'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg',
    null,
    7654,
    432,
    156,
    21098,
    null, -- Replace with appropriate university ID
    'opportunities',
    '["career-fair", "internships", "tech-companies", "networking", "job-opportunities", "recruiting"]'::jsonb
),

-- News category posts
(
    'University News',
    'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
    true,
    '📢 HISTORIC PARTNERSHIP: University announces $500M collaboration with leading tech companies to establish the Institute for Ethical AI.

This groundbreaking initiative will focus on:
🔍 AI safety and ethics research
🌐 Policy development for responsible AI
👥 Training next-gen AI ethicists
📚 Open-source educational resources

#UniversityNews #EthicalAI #Partnership #Innovation #AIEthics #Technology',
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    null,
    15678,
    789,
    345,
    45234,
    null, -- Replace with appropriate university ID
    'news',
    '["partnership", "ethical-ai", "institute", "collaboration", "ai-safety", "policy"]'::jsonb
),

-- Policies category post
(
    'Academic Affairs',
    'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
    true,
    '📋 NEW ACADEMIC POLICY: Flexible Learning Options

Effective Fall 2025, the university introduces enhanced flexibility for all students:

🏠 Hybrid learning options for select courses
⏰ Extended deadline policies for emergencies  
🌍 Study abroad credit transfers simplified
📱 Digital-first administrative processes
♿ Enhanced accessibility accommodations

Questions? Contact academic.affairs@university.edu

#AcademicPolicy #FlexibleLearning #StudentSuccess #Accessibility',
    'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
    null,
    4567,
    234,
    67,
    12345,
    null, -- Replace with appropriate university ID
    'policies',
    '["academic-policy", "flexible-learning", "hybrid-courses", "accessibility", "student-support"]'::jsonb
),

-- Funding category post
(
    'Financial Aid Office',
    'https://images.pexels.com/photos/159844/mit-massachusetts-institute-of-technology-cambridge-university-159844.jpeg',
    true,
    '💰 BREAKTHROUGH FUNDING: University announces $50M in new need-based scholarships!

🎯 Key Benefits:
• Families earning <$90K: FREE tuition
• Families earning <$140K: Reduced tuition  
• No student loans in financial aid packages
• Additional support for housing & meals
• Emergency funding for unexpected situations

This represents our largest financial aid expansion in university history!

Apply for aid: financialaid@university.edu

#FinancialAid #Scholarships #AccessibleEducation #FreeEducation #Opportunity',
    'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg',
    null,
    13456,
    678,
    189,
    38901,
    null, -- Replace with appropriate university ID
    'funding',
    '["financial-aid", "scholarships", "need-based", "free-tuition", "accessible-education", "support"]'::jsonb
);

-- After inserting, update the university_id values manually:
-- UPDATE posts SET university_id = 'your-actual-stanford-id' WHERE author_name LIKE '%Stanford%';
-- UPDATE posts SET university_id = 'your-actual-mit-id' WHERE author_name LIKE '%MIT%';
-- etc.