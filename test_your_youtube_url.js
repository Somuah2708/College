const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testYourYouTubeURL() {
  console.log('🎬 Testing your specific YouTube URL: https://youtu.be/VVCnWwQwfoU\n');

  try {
    // Add your specific YouTube URL
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        author_name: 'Test Channel',
        author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
        author_verified: false,
        caption: '🎬 Testing YouTube video: https://youtu.be/VVCnWwQwfoU - This should work with Instagram-style auto-play! Let me know if you see this video playing properly. #Test #YouTube',
        video_url: 'https://youtu.be/VVCnWwQwfoU', // Your specific URL
        likes_count: 42,
        comments_count: 8,
        shares_count: 3,
        views_count: 156
      })
      .select();

    if (error) throw error;

    console.log('✅ Successfully added your YouTube URL to the database!');
    console.log('📱 Now check your app:');
    console.log('1. Open the app (should be running with debugging)');
    console.log('2. Go to Home tab');
    console.log('3. Scroll to find your test video');
    console.log('4. Check the console logs for debugging info');
    
    console.log('\n🔍 What to look for in the logs:');
    console.log('• "YouTube player loaded successfully" - Component loaded');
    console.log('• "YouTube Video Debug" - Video detection working');  
    console.log('• "Rendering YouTube player for videoId: VVCnWwQwfoU" - Player rendering');
    console.log('• "YouTube player ready" - Player loaded successfully');
    console.log('• "YouTube player error" - If there\'s an issue');
    
    console.log('\n💡 If you see "YouTube (Fallback)" badge:');
    console.log('• The YouTube player component isn\'t loading');
    console.log('• You\'ll see a thumbnail with play button instead');
    console.log('• This is expected on web, should work on mobile');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('row-level security')) {
      console.log('\n🔧 RLS Issue - Run this SQL in Supabase instead:');
      console.log(`
INSERT INTO public.posts (
  author_name, author_avatar, author_verified, caption, video_url,
  likes_count, comments_count, shares_count, views_count, created_at
) VALUES (
  'Test Channel',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
  false,
  '🎬 Testing YouTube: https://youtu.be/VVCnWwQwfoU #Test #YouTube',
  'https://youtu.be/VVCnWwQwfoU',
  42, 8, 3, 156, now()
);
      `);
    }
  }
}

testYourYouTubeURL();