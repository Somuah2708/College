const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read environment variables
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials in .env file');
  console.log('Please make sure you have EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTestVideos() {
  console.log('🎬 Adding professional college videos to your database...\n');

  try {
    // Campus Tour Video
    const { data: post1, error: error1 } = await supabase
      .from('posts')
      .insert({
        author_name: 'Stanford University',
        author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
        author_verified: true,
        caption: '🎓 Take a virtual tour of our beautiful campus! From historic buildings to cutting-edge research facilities. What do you think? 🏛️✨ #CampusTour #StanfordLife',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        likes_count: 324,
        comments_count: 45,
        shares_count: 28,
        views_count: 12500
      })
      .select();

    if (error1) throw error1;
    console.log('✅ Added Stanford campus tour video');

    // Student Life Video
    const { data: post2, error: error2 } = await supabase
      .from('posts')
      .insert({
        author_name: 'MIT Student Life',
        author_avatar: 'https://images.unsplash.com/photo-1494790108755-2616c27d26ad?w=96&h=96&fit=crop&crop=face',
        author_verified: false,
        caption: '🚀 Day in the life of an MIT engineering student! From morning lectures to late-night lab sessions. The grind is real but so worth it! 💪📚 Who else is pulling all-nighters? #MITLife #Engineering #StudentLife',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        likes_count: 567,
        comments_count: 89,
        shares_count: 34,
        views_count: 8900
      })
      .select();

    if (error2) throw error2;
    console.log('✅ Added MIT student life video');

    // Research Showcase
    const { data: post3, error: error3 } = await supabase
      .from('posts')
      .insert({
        author_name: 'Harvard Research Lab',
        author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face',
        author_verified: true,
        caption: '🔬 Breakthrough in quantum computing research! Our team just achieved a major milestone. Science is incredible! 🧪⚡ #Research #QuantumComputing #Harvard #Innovation',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        likes_count: 892,
        comments_count: 156,
        shares_count: 78,
        views_count: 25600
      })
      .select();

    if (error3) throw error3;
    console.log('✅ Added Harvard research showcase video');

    // Graduation Ceremony
    const { data: post4, error: error4 } = await supabase
      .from('posts')
      .insert({
        author_name: 'UC Berkeley Official',
        author_avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=96&h=96&fit=crop&crop=face',
        author_verified: true,
        caption: '🎉 Congratulations to our graduating class of 2025! 4 years of hard work, friendships, and memories. You did it! 🎓👏 #Graduation2025 #UCBerkeley #Proud',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        likes_count: 1234,
        comments_count: 234,
        shares_count: 189,
        views_count: 45600
      })
      .select();

    if (error4) throw error4;
    console.log('✅ Added UC Berkeley graduation video');

    // Sports Highlight
    const { data: post5, error: error5 } = await supabase
      .from('posts')
      .insert({
        author_name: 'College Athletics',
        author_avatar: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=96&h=96&fit=crop&crop=face',
        author_verified: false,
        caption: '🏀 GAME WINNER! Last second shot to win the championship! The crowd went absolutely wild! 🔥🏆 #MarchMadness #Basketball #GameWinner #Clutch',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        likes_count: 2456,
        comments_count: 445,
        shares_count: 567,
        views_count: 89000
      })
      .select();

    if (error5) throw error5;
    console.log('✅ Added college sports highlight video');

    console.log('\n🎉 SUCCESS! Added 5 professional college videos to your database!');
    console.log('\n📱 Now test your Instagram-style video feed:');
    console.log('1. Open your app (scan the QR code or press "i" for iOS simulator)');
    console.log('2. Go to the Home tab');
    console.log('3. Scroll through the feed to see auto-playing videos!');
    console.log('\n✨ Features to test:');
    console.log('• Videos should auto-play when you scroll to them');
    console.log('• Tap videos to pause/play');
    console.log('• Tap the speaker icon to unmute');
    console.log('• Only one video plays at a time (Instagram style!)');
    
  } catch (error) {
    console.error('❌ Error adding videos:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('• Make sure your Supabase credentials are correct');
    console.log('• Check that your posts table exists');
    console.log('• Verify your internet connection');
  }
}

addTestVideos();