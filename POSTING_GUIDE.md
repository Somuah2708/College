# Your Content Posting System - Complete Guide

## 📋 Table Structure Overview

You have **3 main tables** for content posting:

### 1. **`posts` table** (MAIN CONTENT)
This is your **primary content table** where all posts are stored.

**Columns you have:**
- `id` - Unique post identifier (auto-generated)
- `author_name` - Name of who posted (e.g., "University of Ghana")
- `author_avatar` - Profile picture URL of author
- `author_verified` - Blue checkmark (true/false)
- `caption` - The main text content of the post
- `image_url` - Single image URL (legacy - still works)
- `video_url` - Single video URL (legacy - still works)
- `likes_count`, `comments_count`, `shares_count`, `views_count` - Engagement metrics
- `created_at`, `updated_at` - Timestamps

### 2. **`post_media` table** (MULTIPLE MEDIA)
This table allows **multiple images/videos per post** (modern approach).

**Columns:**
- `id` - Unique media identifier
- `post_id` - Links to posts table
- `media_type` - 'image', 'video', 'gif', 'audio'
- `media_url` - The actual media file URL
- `thumbnail_url` - Smaller preview image
- `is_primary` - Which media shows first (true/false)
- `order_index` - Order of media (0, 1, 2...)
- `duration` - For videos (in seconds)

### 3. **`post_interactions` table** (ENGAGEMENT)
Tracks user engagement (likes, shares, saves, views).

**Columns:**
- `post_id` - Which post was interacted with
- `user_id` - Who interacted
- `interaction_type` - 'like', 'share', 'save', 'view'

---

## 🚀 How to Post Content

### Method 1: Simple Post (Using Legacy Columns)
```sql
-- For a simple image post
INSERT INTO public.posts (
  author_name, 
  author_avatar, 
  author_verified, 
  caption, 
  image_url,
  likes_count,
  views_count
) VALUES (
  'Your University Name',
  'https://your-logo-url.com/logo.jpg',
  true,
  'Your post content here! 🎓',
  'https://your-image-url.com/image.jpg',
  0,
  0
);

-- For a video post
INSERT INTO public.posts (
  author_name, 
  author_avatar, 
  author_verified, 
  caption, 
  video_url,
  likes_count,
  views_count
) VALUES (
  'Campus TV',
  'https://your-avatar.com/avatar.jpg',
  false,
  'Check out our campus tour! 🎬',
  'https://your-video-url.com/video.mp4',
  0,
  0
);
```

### Method 2: Advanced Post (Multiple Media)
```sql
-- Step 1: Create the post
WITH new_post AS (
  INSERT INTO public.posts (
    author_name, 
    author_avatar, 
    author_verified, 
    caption
  ) VALUES (
    'Student Life Office',
    'https://your-avatar.com/avatar.jpg',
    true,
    'Welcome Week 2025! Here are all the amazing events happening this week 📸'
  ) RETURNING id
)
-- Step 2: Add multiple media to that post
INSERT INTO public.post_media (post_id, media_type, media_url, thumbnail_url, is_primary, order_index)
SELECT 
  new_post.id,
  'image',
  'https://unsplash.com/image1.jpg',
  'https://unsplash.com/image1-thumb.jpg',
  true,  -- This is the primary image (shows first)
  0      -- First image
FROM new_post
UNION ALL
SELECT 
  new_post.id,
  'image',
  'https://unsplash.com/image2.jpg',
  'https://unsplash.com/image2-thumb.jpg',
  false, -- Not primary
  1      -- Second image
FROM new_post
UNION ALL
SELECT 
  new_post.id,
  'video',
  'https://your-video.com/event-video.mp4',
  'https://your-video.com/video-thumb.jpg',
  false, -- Not primary
  2      -- Third media item
FROM new_post;
```

---

## 🔍 How Your Home Screen Reads Content

Your app shows posts in **2 sections**:

### **"Trending Now" Section**
- Orders posts by `views_count` (highest first)
- Uses the `caption` as headline
- Shows `author_name` as source
- Uses primary media or `image_url` as thumbnail

### **Main Feed Section**
- Shows all posts ordered by `created_at` (newest first)
- Displays media from `post_media` table first, then falls back to `image_url`/`video_url`
- Shows engagement metrics (likes, comments, shares, views)

---

## 💡 Best Practices for Posting

### ✅ **DO:**
1. **Always include** `author_name`, `author_avatar`, and `caption`
2. **Set `is_primary = true`** for one media item per post (the main image/video)
3. **Use high-quality images** (1200x675 for main, 600x338 for thumbnails)
4. **Keep captions engaging** (they become headlines in trending)
5. **Include emojis** for better engagement

### ❌ **AVOID:**
1. **Empty captions** (they show as "Untitled" in app)
2. **Broken image URLs** (will show placeholder)
3. **Multiple `is_primary = true`** media (confuses the app)

---

## 🎯 Quick Examples

### University Announcement
```sql
INSERT INTO public.posts (
  author_name, author_avatar, author_verified, caption, image_url, likes_count, views_count
) VALUES (
  'University of Ghana',
  'https://commons.wikimedia.org/wiki/Special:FilePath/University_of_Ghana.png',
  true,
  '📢 Final year students: Thesis submission deadline is October 15th. Visit the academic office for guidelines and requirements.',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=675&fit=crop',
  0, 0
);
```

### Student Event
```sql
INSERT INTO public.posts (
  author_name, author_avatar, author_verified, caption, image_url, likes_count, views_count
) VALUES (
  'Student Union',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop',
  false,
  '🎉 Game Night this Friday at 7PM in the Student Center! Bring your friends and compete for amazing prizes. Free pizza and drinks! 🍕',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=675&fit=crop',
  0, 0
);
```

### Multi-Image Gallery Post
```sql
WITH gallery_post AS (
  INSERT INTO public.posts (author_name, author_avatar, author_verified, caption) 
  VALUES ('Campus Photography Club', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop', 
          false, '📸 Beautiful moments captured around our campus this semester. Swipe to see more!')
  RETURNING id
)
INSERT INTO public.post_media (post_id, media_type, media_url, is_primary, order_index)
SELECT gallery_post.id, 'image', 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=675&fit=crop', true, 0 FROM gallery_post
UNION ALL SELECT gallery_post.id, 'image', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=675&fit=crop', false, 1 FROM gallery_post
UNION ALL SELECT gallery_post.id, 'image', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=675&fit=crop', false, 2 FROM gallery_post;
```

---

## 🔄 Content Will Appear Instantly

Thanks to **Realtime** setup, as soon as you insert into the `posts` table, your Home screen will automatically refresh and show the new content!

Your posting workflow: **Database → Instant Home Screen Update** ✨