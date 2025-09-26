const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vrqntnfnbmjcwvjjgfvq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycW50bmZuYm1qY3d2ampnZnZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTgzNzEsImV4cCI6MjA2OTk3NDM3MX0.pYkzUC4kbm8eCr-OHD2auYs9sMVp1vTWzzjWCNoD-hU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPostsColumns() {
  console.log('Checking posts table structure...\n');
  
  try {
    // Get a sample row to see all columns
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error:', error.message);
      return;
    }
    
    if (posts && posts.length > 0) {
      console.log('✅ Posts table columns:');
      Object.keys(posts[0]).forEach(col => {
        console.log(`   - ${col}: ${typeof posts[0][col]} (${posts[0][col]})`);
      });
    } else {
      console.log('⚠️  Posts table exists but has no data');
      
      // Try to get column info another way
      const { data: emptyResult, error: emptyError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000000'); // Non-existent ID
      
      console.log('Empty query error (shows available columns):', emptyError?.message);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkPostsColumns();