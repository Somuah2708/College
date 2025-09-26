/*
  # Insert sample posts for home screen

  1. Sample Data
    - Insert 6 diverse posts with realistic content
    - Include university announcements, student stories, scholarships
    - Add proper engagement metrics
    - Mix of image and video content
*/

INSERT INTO posts (author_name, author_avatar, author_verified, caption, image_url, video_url, likes_count, comments_count, shares_count, views_count) VALUES
(
  'Stanford University',
  'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
  true,
  'Exciting news! Our Computer Science program has been ranked #1 globally for the 5th consecutive year. Join thousands of students who are shaping the future of technology. 🚀

#StanfordCS #TechEducation #Innovation',
  'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
  null,
  15420,
  892,
  234,
  45670
),
(
  'Sarah Chen',
  'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
  false,
  'Just received my acceptance letter to MIT! 🎉 After months of preparation and countless hours of studying, dreams do come true. Thank you to everyone who supported me on this journey.

#MITBound #DreamsComeTrue #HardWorkPaysOff',
  'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg',
  null,
  3240,
  156,
  89,
  12340
),
(
  'Tech Scholarship Foundation',
  'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
  true,
  '🚨 SCHOLARSHIP ALERT 🚨

We''re offering 100 full scholarships for Computer Science students! Application deadline: March 15, 2025.

Requirements:
• GPA 3.5+
• Leadership experience
• Community service

Apply now! Link in bio.

#TechScholarship #FullFunding #ComputerScience',
  'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
  null,
  8760,
  445,
  1200,
  28900
),
(
  'Michael Rodriguez',
  'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
  false,
  'From student to Software Engineer at Google! 💻✨

My journey:
📚 Computer Science at UC Berkeley
🔬 Research internship at Stanford
💼 Now building products used by millions

To current students: believe in yourself and never stop learning!

#GoogleLife #SoftwareEngineer #AlumniStory #TechCareer',
  'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  5680,
  289,
  167,
  18450
),
(
  'Harvard University',
  'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
  true,
  'Innovation Lab Update: Our students just developed an AI system that can predict climate patterns with 95% accuracy! 🌍🤖

This groundbreaking research will be presented at the International Climate Conference next month.

#HarvardInnovation #ClimateAI #StudentResearch #Innovation',
  'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  12340,
  567,
  890,
  34560
),
(
  'Global Education Network',
  'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
  true,
  '🌟 FEATURED OPPORTUNITY 🌟

Exchange program to Tokyo University now open! Experience world-class education in Japan while immersing yourself in a rich cultural environment.

✅ Full scholarship available
✅ Housing provided
✅ Language support included

Deadline: February 28, 2025

#StudyAbroad #TokyoUniversity #ExchangeProgram #GlobalEducation',
  'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
  null,
  6890,
  234,
  456,
  19230
);