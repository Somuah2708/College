# Video Issues & Solutions Guide

## 🚨 **Common Video Problems**

### **Problem 1: Videos Don't Play**
**Causes:**
- Video URL is broken/expired
- Video format not supported by React Native
- Video server doesn't allow cross-origin requests
- Video file is too large for mobile

**Solutions:**
```sql
-- ✅ USE THESE WORKING VIDEO URLS FOR TESTING:
'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'  -- 1MB, 720p
'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'  -- 2MB, 720p
'https://file-examples.com/storage/fe6d1d9b4b16b0e1c8dc5ca/2017/10/file_example_MP4_480_1_5MG.mp4'

-- ❌ AVOID THESE (often don't work on mobile):
'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' -- Too large
```

### **Problem 2: No Video Thumbnails**
**Causes:**
- `thumbnail_url` points to generic images instead of video frames
- Missing thumbnail_url entirely
- Thumbnail service not generating properly

**Solutions:**

#### **Option A: Use Video Frame as Thumbnail**
```sql
-- Generate thumbnail from video frame (if your video service supports it)
video_url: 'https://your-video.com/video.mp4'
thumbnail_url: 'https://your-video.com/video.mp4?t=5' -- Frame at 5 seconds
```

#### **Option B: Create Custom Thumbnails**
```sql
-- Use a screenshot/frame you captured from the video
video_url: 'https://your-video.com/campus-tour.mp4'
thumbnail_url: 'https://your-images.com/campus-tour-thumbnail.jpg' -- Custom screenshot
```

#### **Option C: Use Representative Images**
```sql
-- Use an image that represents the video content
video_url: 'https://sample-videos.com/campus-event.mp4'
thumbnail_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=338' -- Campus photo
```

---

## ✅ **Recommended Video Formats for Mobile**

### **Video Specs:**
- **Format**: MP4 (H.264 codec)
- **Resolution**: 720p or 1080p max
- **File Size**: Under 10MB for good performance
- **Duration**: Under 2 minutes for social media style

### **Thumbnail Specs:**
- **Format**: JPG or PNG
- **Size**: 600x338px (16:9 ratio)
- **File Size**: Under 100KB

---

## 🔧 **Quick Fixes to Try**

### **1. Test with Working Sample Videos**
Run this SQL to test with known working videos:

```sql
-- Simple video post with working URL
INSERT INTO public.posts (
  author_name, author_avatar, author_verified, caption, video_url, views_count
) VALUES (
  'Test Account', 
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96', 
  true,
  '🧪 Testing video playback - this should work!',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  100
);
```

### **2. Check Your App's Video Player**
Your React Native app might need video player configuration. Check if you have:
- `expo-av` installed for video playback
- Proper video player component in your feed
- Network permissions for video streaming

### **3. Add Proper Thumbnails**
Always include `thumbnail_url` for videos:

```sql
-- Video with proper thumbnail
INSERT INTO public.post_media (post_id, media_type, media_url, thumbnail_url, is_primary)
VALUES (
  'your-post-id',
  'video',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=338&fit=crop', -- Relevant image
  true
);
```

---

## 🎬 **Best Practices for Video Posts**

### **For Production Use:**

1. **Host videos properly**:
   - Use a video hosting service (YouTube, Vimeo, AWS S3, etc.)
   - Ensure HTTPS URLs
   - Enable CORS if hosting yourself

2. **Generate real thumbnails**:
   - Extract frame from video at interesting moment
   - Use video processing service to auto-generate
   - Create custom preview images

3. **Optimize for mobile**:
   - Keep videos under 10MB
   - Use progressive download
   - Provide multiple quality options

### **For Testing:**
- Use the sample URLs I provided above
- They're specifically designed to work with mobile apps
- Small file sizes load quickly

---

## 🧪 **Test This Now**

1. Run the `working_video_test.sql` file I created
2. Check your Home screen
3. Videos should play and show proper thumbnails
4. If they work, you know the issue was with the URLs!

Let me know what happens! 🎯