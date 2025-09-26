#!/bin/bash

# Apply Database Migrations for University & Category Support
# Run this script from the project root directory

echo "🚀 Starting database migrations for university and category support..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    echo "or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ This doesn't appear to be a Supabase project."
    echo "Make sure you're in the project root and have run 'supabase init'."
    exit 1
fi

echo "📋 Applying migrations in order..."
echo ""

# Apply migrations one by one
migration_files=(
    "20250103000001_add_universities_table.sql"
    "20250103000002_update_existing_posts.sql" 
    "20250103000003_add_categorized_posts.sql"
)

for migration in "${migration_files[@]}"; do
    if [ -f "supabase/migrations/$migration" ]; then
        echo "📄 Applying migration: $migration"
        supabase db reset --linked
        if [ $? -eq 0 ]; then
            echo "✅ Successfully applied: $migration"
        else
            echo "❌ Failed to apply: $migration"
            echo "Please check the error above and fix the migration file."
            exit 1
        fi
        echo ""
    else
        echo "⚠️  Migration file not found: $migration"
        echo ""
    fi
done

echo "🎉 All migrations completed successfully!"
echo ""
echo "📊 Your database now includes:"
echo "  • Universities table with sample data"
echo "  • Posts table with category and university_id columns"
echo "  • Proper categorization (programs, academics, student-life, etc.)"
echo "  • Enhanced filtering capabilities"
echo ""
echo "🔄 Next steps:"
echo "  1. Your React Native app is already updated"
echo "  2. Start your Expo server: npm start or yarn start"
echo "  3. Test the new university and category filters"
echo ""

# Show current database status
echo "📈 Checking database status..."
supabase db diff --linked