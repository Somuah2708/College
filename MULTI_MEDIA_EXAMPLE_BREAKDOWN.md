# Multi-Media Post Example Breakdown

## 📱 What This Creates

### **Main Post (in `posts` table):**
```
ID: [auto-generated UUID]
Author: "Campus Events Team" ✅ (verified)
Caption: "🎉 What an amazing Freshers Week! Here are the highlights from our welcome events. Swipe through to see all the fun moments and behind-the-scenes action! 📸🎬 #FreshersWeek2025 #CampusLife"
Engagement: 0 likes, 0 comments, 0 shares, 0 views (starts at zero)
```

### **5 Media Items (in `post_media` table):**

**Media #0 (PRIMARY - shows first):**
- Type: `image`
- URL: Campus welcome banner image
- Thumbnail: Smaller version for previews
- `is_primary = true` ← This is what shows in the feed first!
- `order_index = 0` ← First in sequence

**Media #1:**
- Type: `video` 
- URL: Welcome ceremony video
- Thumbnail: Video preview image
- Duration: 180 seconds (3 minutes)
- `order_index = 1` ← Second in sequence

**Media #2:**
- Type: `image`
- URL: Students at registration
- `order_index = 2` ← Third in sequence

**Media #3:**
- Type: `image` 
- URL: Campus tour group photo
- `order_index = 3` ← Fourth in sequence

**Media #4:**
- Type: `video`
- URL: Behind-the-scenes video
- Duration: 240 seconds (4 minutes)
- `order_index = 4` ← Fifth (last) in sequence

---

## 📱 How This Appears in Your Home Screen

### **In the Feed:**
```
┌─────────────────────────────────────────┐
│ 👤 Campus Events Team ✅               │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │  [PRIMARY IMAGE SHOWS HERE]         │ │ ← The is_primary=true image
│ │  Campus welcome banner              │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 🎉 What an amazing Freshers Week!      │
│ Here are the highlights from our        │
│ welcome events. Swipe through to see    │
│ all the fun moments...                  │
│                                         │
│ 📷 5 media items • Swipe to see more   │ ← App detects 5 media
│                                         │
│ ❤️ 0  💬 0  📤 0  👁️ 0               │
│ Just now                                │
└─────────────────────────────────────────┘
```

### **When User Swipes/Taps Media:**
```
Media 1: [Primary Image] 
Media 2: [Video - 3:00] ▶️
Media 3: [Image]
Media 4: [Image] 
Media 5: [Video - 4:00] ▶️
```

### **In Trending Section:**
Uses the primary image as thumbnail and shows the caption as headline.

---

## 🔍 How Your App Code Handles This

Your `mapSupaPostToFeedPost` function will:

1. **Fetch the post** with all related `post_media`
2. **Sort media** by `order_index` (0, 1, 2, 3, 4)
3. **Find primary media** (`is_primary = true`) 
4. **Use primary for display** (main image, thumbnail)
5. **Store all media** for carousel/swiping

```javascript
// Your app sees this structure:
{
  id: "post-uuid",
  title: "🎉 What an amazing Freshers Week!...",
  media_url: "primary-image-url", // The is_primary=true image
  type: "image", // Based on primary media type
  author: {
    name: "Campus Events Team",
    verified: true,
    avatar: "team-avatar-url"
  },
  // All 5 media items available for carousel:
  all_media: [
    { type: "image", url: "...", is_primary: true, order: 0 },
    { type: "video", url: "...", duration: 180, order: 1 },
    { type: "image", url: "...", order: 2 },
    { type: "image", url: "...", order: 3 },
    { type: "video", url: "...", duration: 240, order: 4 }
  ]
}
```

---

## 🚀 Want to Test This?

1. **Copy the SQL** from `multi_media_post_example.sql`
2. **Paste in Supabase SQL Editor**
3. **Run it**
4. **Check your Home screen** - you should see:
   - The post appears in both feed and trending
   - Primary image shows first
   - Caption displays as post text
   - All 5 media items are linked and ready for carousel

The post will appear **instantly** thanks to Realtime! 🎉