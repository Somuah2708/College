# University & Category Filter Implementation

This update adds comprehensive university and category filtering to your Instagram-style video feed app, **working with your existing universities table**.

## 🎯 What's New

### Database Structure
- **Uses Your Existing Universities Table**: No new university table created - works with what you have
- **Post Categorization**: Posts now belong to specific categories and can be linked to your universities
- **Enhanced Filtering**: Filter by both university and content category

### Categories Added
- **Programs**: Degree programs, courses, academic offerings
- **Academics**: Research, rankings, academic achievements  
- **Student Life**: Campus events, student experiences
- **Opportunities**: Scholarships, internships, competitions
- **News**: University announcements, partnerships
- **Policies**: Academic policies, guidelines
- **Funding**: Financial aid, grants, scholarships

## 📁 Files Changed

### Database Migrations (New)
```
supabase/migrations/
├── 20250103000001_add_universities_table.sql    # Add category/university_id to posts
├── 20250103000002_update_existing_posts.sql     # Categorize existing data  
└── 20250103000003_add_categorized_posts.sql     # Sample categorized posts

inspect_and_map_universities.sql                 # Helper script to map your data
```

### App Updates
- `app/(tabs)/index.tsx`: Updated with new filtering logic
- Enhanced university filtering with proper data relationships
- Category filtering with database-backed categories
- Improved type safety with proper interfaces

### Migration Scripts
- `run-migrations.js`: Node.js script for applying migrations
- `apply-migrations.sh`: Bash script using Supabase CLI

## 🚀 Setup Instructions

### Step 1: Inspect Your Existing Universities Table
```sql
-- Run this in your Supabase SQL editor first:
-- Copy content from inspect_and_map_universities.sql
```

### Step 2: Apply Migrations
#### Option A: Using Supabase CLI (Recommended)
```bash
# Apply all migrations
./apply-migrations.sh
```

#### Option B: Manual Application  
Copy and paste the SQL content from each migration file into your Supabase SQL editor in order:
1. `20250103000001_add_universities_table.sql` (adds columns to posts)
2. `20250103000002_update_existing_posts.sql` (categorizes existing posts)
3. `20250103000003_add_categorized_posts.sql` (adds sample posts - **update university_id values first!**)

### Step 3: Map Posts to Your Universities
After running the migrations, you'll need to manually assign university_id values to posts:

```sql
-- Example mapping (adjust based on your university IDs):
UPDATE posts SET university_id = 'your-stanford-id' WHERE author_name ILIKE '%stanford%';
UPDATE posts SET university_id = 'your-mit-id' WHERE author_name ILIKE '%mit%';
-- Continue for other universities...
```

## 🗃️ Database Schema

### Your Existing Universities Table
```sql
create table public.universities (
  id uuid not null default gen_random_uuid(),
  name text not null,
  location text null,
  website text null, 
  description text null,
  created_at timestamp with time zone not null default now(),
  constraint universities_pkey primary key (id)
);
```

### Updated Posts Table
```sql
posts (
  -- Your existing columns...
  university_id uuid REFERENCES universities(id),  -- New foreign key
  category text NOT NULL CHECK (category IN (      -- New enforced categories
    'programs', 'academics', 'student-life', 
    'opportunities', 'news', 'policies', 'funding'
  )),
  tags jsonb DEFAULT '[]'                          -- New flexible tagging
)
```

## 📱 App Features

### University Filter
- Modal with searchable university list
- Visual selection with checkmarks
- "All Universities" option to clear filter
- Proper university logos and location display

### Category Filter  
- Horizontal scrollable category pills
- Instagram-style design with icons
- Real-time filtering as you select categories
- Visual feedback for active category

### Combined Filtering
- Filter by university AND category simultaneously
- Smooth transitions between filter states
- Maintains scroll position during filtering

## 🎨 UI Components

### Filter Categories
```javascript
const categories = [
  { key: 'all', label: 'For You', icon: Heart, color: '#EF4444' },
  { key: 'programs', label: 'Programs', icon: GraduationCap, color: '#10B981' },
  { key: 'academics', label: 'Academics', icon: BookOpen, color: '#3B82F6' },
  { key: 'student-life', label: 'Student Life', icon: Users, color: '#8B5CF6' },
  { key: 'opportunities', label: 'Opportunities', icon: Target, color: '#F59E0B' },
  { key: 'news', label: 'News', icon: Globe, color: '#06B6D4' },
  { key: 'policies', label: 'Policies', icon: Award, color: '#EF4444' },
  { key: 'funding', label: 'Funding', icon: DollarSign, color: '#EC4899' },
];
```

### Sample Universities Included
- Stanford University
- Massachusetts Institute of Technology (MIT)
- Harvard University
- UC Berkeley
- Carnegie Mellon University
- University of Oxford
- University of Cambridge
- ETH Zurich
- University of Toronto
- National University of Singapore

## 📊 Sample Data

The migrations include diverse sample posts for each category:
- **Programs**: New AI/ML Master's program (MIT), PPE Online program (Oxford)
- **Academics**: Quantum computing research (Stanford), Physics ranking (Cambridge)
- **Student Life**: Spring festival (Berkeley), Business competition (Harvard)  
- **Opportunities**: Tech internship fair (ETH), Innovation challenge (Global)
- **News**: AI partnership announcement (Harvard)
- **Policies**: Flexible learning policy (Stanford)
- **Funding**: Need-based scholarships (MIT)

## 🔧 Technical Details

### Type Safety
- Proper TypeScript interfaces for `University` and enhanced `FeedPost`
- Type-safe database queries with relationship loading
- Improved error handling and data validation

### Performance Optimizations  
- Database indexes on `category`, `university_id`, and `created_at`
- Efficient filtering logic with early returns
- Proper foreign key relationships for data integrity

### Cross-Platform Compatibility
- All filtering works on Android, iOS, and Web
- Consistent UI/UX across platforms
- Maintained Instagram-style video auto-play functionality

## 🎯 Testing the Implementation

1. **Start your app**: `npm start` or `yarn start`
2. **Test category filtering**: Tap different category pills to see filtered content
3. **Test university filtering**: Tap the university filter button and select different universities  
4. **Test combined filtering**: Select both a university and category to see combined results
5. **Test video playback**: Ensure Instagram-style auto-play still works across all filters

## 🔄 Next Steps

1. Add search functionality within categories
2. Implement saved posts per category  
3. Add trending tags within each category
4. Implement push notifications for specific universities/categories
5. Add analytics for most popular categories/universities

## 🐛 Troubleshooting

### Migration Issues
- Ensure your Supabase project has proper permissions
- Check that all required columns exist before running updates
- Verify foreign key constraints are properly handled

### App Issues
- Clear Expo cache: `npx expo start --clear`
- Verify Supabase client is properly configured
- Check network connectivity for database queries

### Filter Not Working
- Verify migrations were applied successfully
- Check browser/app console for JavaScript errors
- Ensure categories match exactly between database and app code

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Native Filter Patterns](https://reactnative.dev/)
- [Instagram-Style Video Implementation](https://docs.expo.dev/versions/latest/sdk/av/)

---

**Ready to test!** Your Instagram-style video feed now supports comprehensive university and category filtering with a professional, scalable database structure. 🎉