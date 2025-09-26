const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vrqntnfnbmjcwvjjgfvq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycW50bmZuYm1qY3d2ampnZnZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTgzNzEsImV4cCI6MjA2OTk3NDM3MX0.pYkzUC4kbm8eCr-OHD2auYs9sMVp1vTWzzjWCNoD-hU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('Checking Supabase tables...\n');
  
  try {
    // Check if posts table exists and get some info
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .limit(1);
    
    if (postsError) {
      console.log('❌ posts table:', postsError.message);
    } else {
      console.log('✅ posts table: EXISTS');
      console.log('   Sample columns:', posts.length > 0 ? Object.keys(posts[0]).slice(0, 5).join(', ') + '...' : 'No data yet');
    }
    
    // Check if post_media table exists
    const { data: media, error: mediaError } = await supabase
      .from('post_media')
      .select('*')
      .limit(1);
    
    if (mediaError) {
      console.log('❌ post_media table:', mediaError.message);
    } else {
      console.log('✅ post_media table: EXISTS');
      console.log('   Sample columns:', media.length > 0 ? Object.keys(media[0]).slice(0, 5).join(', ') + '...' : 'No data yet');
    }
    
    // Check what tables we can actually see
    console.log('\nTrying to list all accessible tables...');
    const { data: tables, error: tablesError } = await supabase.rpc('get_table_list');
    if (tablesError) {
      console.log('Cannot list tables directly, checking common ones individually');
      
      const tablesToCheck = ['posts', 'post_media', 'post_interactions', 'post_comments', 'user_settings'];
      for (const table of tablesToCheck) {
        const { data, error } = await supabase.from(table).select('count').limit(1);
        console.log(`${error ? '❌' : '✅'} ${table}: ${error ? error.message : 'EXISTS'}`);
      }
    } else {
      console.log('Available tables:', tables);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkTables();