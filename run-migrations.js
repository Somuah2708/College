const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client (you'll need to provide your URL and key)
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
  
  // List of new migration files to run
  const migrationFiles = [
    '20250103000001_add_universities_table.sql',
    '20250103000002_update_existing_posts.sql',
    '20250103000003_add_categorized_posts.sql'
  ];

  console.log('🚀 Starting database migrations...\n');

  for (const filename of migrationFiles) {
    const filePath = path.join(migrationsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Migration file not found: ${filename}`);
      continue;
    }

    try {
      const sqlContent = fs.readFileSync(filePath, 'utf8');
      console.log(`📄 Running migration: ${filename}`);
      
      // Execute the SQL
      const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
      
      if (error) {
        console.error(`❌ Error in migration ${filename}:`, error);
        process.exit(1);
      } else {
        console.log(`✅ Successfully applied: ${filename}`);
      }
    } catch (error) {
      console.error(`❌ Failed to read or execute migration ${filename}:`, error);
      process.exit(1);
    }
  }

  console.log('\n🎉 All migrations completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Update your Supabase URL and service key in this script');
  console.log('2. Run this script to apply the database changes');
  console.log('3. Your React Native app is already updated to use the new structure');
}

// If running this script directly
if (require.main === module) {
  if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_SERVICE_ROLE_KEY') {
    console.log('❌ Please update the Supabase URL and service key in this script first!');
    console.log('\nYou can find these in your Supabase project settings:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to Settings > API');
    console.log('4. Copy the URL and service_role key');
    process.exit(1);
  }
  
  runMigrations().catch(console.error);
}

module.exports = { runMigrations };