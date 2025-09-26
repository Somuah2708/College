const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addYouTubeVideos() {
  console.log('🎬 Adding real YouTube videos to your database...\n');

  try {
    // College campus tour video
    const { data: post1, error: error1 } = await supabase
      .from('posts')
      .insert({
        author_name: 'MIT OpenCourseWare',
        author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
        author_verified: true,
        caption: '🎓 Welcome to MIT! Take a virtual tour of our beautiful campus and learn about our history. From the iconic dome to cutting-edge labs! 🏛️✨ #MIT #CampusTour #Education',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Classic video for testing
        likes_count: 1524,
        comments_count: 145,
        shares_count: 89,
        views_count: 45600
      })
      .select();

    if (error1) throw error1;
    console.log('✅ Added MIT campus tour YouTube video');

    // Student life video
    const { data: post2, error: error2 } = await supabase
      .from('posts')
      .insert({
        author_name: 'Harvard University',
        author_avatar: 'https://images.unsplash.com/photo-1494790108755-2616c27d26ad?w=96&h=96&fit=crop&crop=face',
        author_verified: true,
        caption: '📚 A day in the life of Harvard students! From morning lectures to evening study groups. The academic journey is incredible! 💪📖 #Harvard #StudentLife #Academic',
        video_url: 'https://youtu.be/dQw4w9WgXcQ', // Short YouTube URL format
        likes_count: 892,
        comments_count: 234,
        shares_count: 156,
        views_count: 78900
      })
      .select();

    if (error2) throw error2;
    console.log('✅ Added Harvard student life YouTube video');

    // Research showcase
    const { data: post3, error: error3 } = await supabase
      .from('posts')
      .insert({
        author_name: 'Stanford Research',
        author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face',
        author_verified: true,
        caption: '🔬 Breakthrough in AI research! Our lab just achieved a major milestone in machine learning. The future is here! 🤖⚡ #Stanford #AI #Research #Innovation',
        video_url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', // Different video for variety
        likes_count: 2134,
        comments_count: 445,
        shares_count: 289,
        views_count: 125600
      })
      .select();

    if (error3) throw error3;
    console.log('✅ Added Stanford research YouTube video');

    // Graduation ceremony
    const { data: post4, error: error4 } = await supabase
      .from('posts')
      .insert({
        author_name: 'UC Berkeley Official',
        author_avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=96&h=96&fit=crop&crop=face',
        author_verified: true,
        caption: '🎉 Congratulations Class of 2025! What an incredible journey. From first-year orientation to walking across this stage. So proud! 🎓👏 #UCBerkeley #Graduation #ClassOf2025',
        video_url: 'https://youtu.be/jNQXAC9IVRw', // Short format
        likes_count: 3456,
        comments_count: 678,
        shares_count: 445,
        views_count: 234500
      })
      .select();

    if (error4) throw error4;
    console.log('✅ Added UC Berkeley graduation YouTube video');

    // Mix of YouTube and MP4 for testing
    const { data: post5, error: error5 } = await supabase
      .from('posts')
      .insert({
        author_name: 'College Sports Network',
        author_avatar: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=96&h=96&fit=crop&crop=face',
        author_verified: false,
        caption: '🏀 INCREDIBLE basketball highlight! Last-second three-pointer to win the championship. The crowd went absolutely wild! 🔥🏆 #MarchMadness #Basketball #GameWinner',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Keep some MP4 for comparison
        likes_count: 5678,
        comments_count: 890,
        shares_count: 567,
        views_count: 345600
      })
      .select();

    if (error5) throw error5;
    console.log('✅ Added sports highlight MP4 video for comparison');

    console.log('\n🎉 SUCCESS! Added 4 YouTube videos + 1 MP4 for testing!');
    console.log('\n📱 Now test your YouTube integration:');
    console.log('1. Open your app');
    console.log('2. Go to the Home tab'); 
    console.log('3. Scroll through to see both YouTube and MP4 videos!');
    
    console.log('\n✨ What to expect:');
    console.log('• YouTube videos will show with red "YouTube" badge');
    console.log('• Both video types auto-play when scrolled to');
    console.log('• Tap to pause/play both YouTube and MP4 videos');
    console.log('• YouTube videos use native YouTube player');
    console.log('• MP4 videos use expo-av Video component');
    
    console.log('\n🔥 Now you can add ANY YouTube URL to your database!');
    console.log('Just paste YouTube URLs like:');
    console.log('• https://www.youtube.com/watch?v=VIDEO_ID');
    console.log('• https://youtu.be/VIDEO_ID');
    
  } catch (error) {
    console.error('❌ Error adding YouTube videos:', error.message);
  }
}

addYouTubeVideos();