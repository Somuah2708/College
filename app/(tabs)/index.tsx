import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, ActivityIndicator, TextInput, Animated, Dimensions, Modal, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import * as Linking from 'expo-linking';
import AutoScrollingImages from '@/components/AutoScrollingImages';
import { useItemVisibility } from '@/hooks/useItemVisibility';

// Platform-specific WebView import
let WebView: any;
try {
  if (Platform.OS === 'web') {
    // For web platform, create a custom WebView component using iframe
    WebView = ({ source, style, onLoad, onError, ...props }: any) => {
      const iframeRef = useRef<HTMLIFrameElement>(null);
      
      useEffect(() => {
        if (onLoad) {
          // Simulate onLoad after a delay
          const timer = setTimeout(onLoad, 1000);
          return () => clearTimeout(timer);
        }
      }, [onLoad]);

      // Convert React Native style to web-compatible CSS
      const webStyle = {
        width: '100%',
        height: '220px',
        border: 'none',
        backgroundColor: '#000000',
        display: 'block',
        ...style,
      };

      return (
        <div style={webStyle}>
          <iframe
            ref={iframeRef}
            src={source?.uri}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: '#000000',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={true}
            onLoad={onLoad}
            onError={onError}
            title="YouTube Video Player"
          />
        </div>
      );
    };
  } else {
    // For mobile platforms, use react-native-webview
    const { WebView: RNWebView } = require('react-native-webview');
    WebView = RNWebView;
  }
} catch (error) {
  console.log('WebView import error:', error);
  // Fallback component if WebView fails to import
  WebView = ({ source, style, onError }: any) => {
    const handlePress = () => {
      if (source?.uri) {
        Linking.openURL(source.uri).catch(err => {
          console.error('Failed to open URL:', err);
          if (onError) onError(err);
        });
      }
    };

    return (
      <TouchableOpacity onPress={handlePress} style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }]}>
        <Text style={{ color: '#FFFFFF', textAlign: 'center', padding: 20 }}>
          WebView not supported on this platform.{'\n'}
          Tap to open in browser.
        </Text>
      </TouchableOpacity>
    );
  };
}

import { Search, Bell, User, TrendingUp, Clock, Eye, Building, GraduationCap, Award, Chrome as Home, Calendar, Film, Briefcase, Heart, ChevronRight, MapPin, Star, Users, DollarSign, Play, BookOpen, Target, Globe, MessageCircle, Share, Bookmark, MoveHorizontal as MoreHorizontal, X, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

// Helper functions for YouTube URL handling
const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

const isMP4Url = (url: string): boolean => {
  return url.includes('.mp4') || url.includes('commondatastorage.googleapis.com');
};

interface TrendingNews {
  id: string;
  headline: string;
  summary: string;
  thumbnail: string;
  images?: Array<{
    id: string;
    image_url: string;
    caption?: string;
    order_index: number;
  }>;
  category: string;
  publishedAt: string;
  readTime: string;
  trending_score: number;
  source: string;
}

interface University {
  id: string;
  name: string;
  location?: string;
  website?: string;
  description?: string;
  created_at: string;
}

interface FeedPost {
  id: string;
  category: string;
  type: 'video' | 'image' | 'carousel';
  title: string;
  description: string;
  media_url: string;
  thumbnail_url?: string;
  duration?: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    type: 'university' | 'student' | 'organization';
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  metadata: {
    location?: string;
    program?: string;
    amount?: string;
    deadline?: string;
    rating?: number;
    salary?: string;
    university?: string;
  };
  tags: string[];
  university?: University;
  created_at: string;
}

// Helpers to map Supabase rows to UI-friendly shapes without changing UI
const estimateReadTime = (text: string): string => {
  const words = text ? text.trim().split(/\s+/).length : 0;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
};

const mapAuthorRoleToType = (role?: string): 'university' | 'student' | 'organization' => {
  const r = (role || '').toLowerCase();
  if (r.includes('student')) return 'student';
  if (r.includes('university') || r.includes('school') || r.includes('college')) return 'university';
  return 'organization';
};

type SupaPost = {
  id: string;
  author_name: string;
  author_avatar: string;
  author_verified: boolean;
  caption: string;
  image_url: string | null;
  video_url: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  category: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  university_id: string | null;
  universities?: {
    id: string;
    name: string;
    location?: string;
    website?: string;
    description?: string;
    created_at: string;
  } | null;
  post_media?: Array<{
    media_type: 'image' | 'video' | 'gif' | 'audio';
    media_url: string;
    thumbnail_url: string | null;
    duration: number | null;
    is_primary: boolean;
    order_index: number;
  }>;
};

const mapSupaPostToFeedPost = (p: SupaPost): FeedPost => {
  const media = [...(p.post_media || [])].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  const primary = media.find(m => m.is_primary) || media[0];
  
  // Determine type based on available media
  let type: FeedPost['type'] = 'image';
  let media_url = 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg';
  let thumbnail_url: string | undefined;
  let duration: string | undefined;
  
  if (primary) {
    // Use post_media if available
    type = primary.media_type === 'video' ? 'video' : 'image';
    media_url = primary.media_url;
    thumbnail_url = primary.thumbnail_url || undefined;
    duration = primary.duration ? `${Math.max(1, Math.round((primary.duration || 0) / 60))}:00` : undefined;
  } else if (p.video_url) {
    // Use legacy video_url column
    type = 'video';
    media_url = p.video_url;
  } else if (p.image_url) {
    // Use legacy image_url column
    type = 'image';
    media_url = p.image_url;
  }

  return {
    id: p.id,
    category: p.category || 'news', // Use the category from database
    type,
    title: p.caption || 'Untitled',
    description: p.caption || '',
    media_url,
    thumbnail_url,
    duration,
    author: {
      name: p.author_name || 'Unknown',
      avatar: p.author_avatar || 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
      verified: !!p.author_verified,
      type: mapAuthorRoleToType(p.author_name), // Infer type from author name
    },
    engagement: {
      likes: p.likes_count || 0,
      comments: p.comments_count || 0,
      shares: p.shares_count || 0,
      views: p.views_count || 0,
    },
    metadata: {
      university: p.universities?.name,
    },
    tags: p.tags || [], // Use tags from database
    university: p.universities || undefined,
    created_at: p.created_at,
  };
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingNews, setTrendingNews] = useState<TrendingNews[]>([]);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [showUniversityFilter, setShowUniversityFilter] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  
  // Trending news visibility tracking
  const { visibleIndex: visibleTrendingIndex, refs: trendingRefs, handleScroll: handleTrendingScroll } = useItemVisibility();
  
  // Video playback state
  const [visibleVideoId, setVisibleVideoId] = useState<string | null>(null);
  const videoRefs = useRef<{[key: string]: Video}>({});
  const youtubeRefs = useRef<{[key: string]: WebView}>({});
  const postRefs = useRef<{[key: string]: View}>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentScrollY, setCurrentScrollY] = useState(0);
  const [youtubePlaying, setYoutubePlaying] = useState<{[key: string]: boolean}>({});

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

  useEffect(() => {
    loadData();
    loadUniversities();
  }, []);

  // Realtime updates: refresh feed/trending when posts change in backend
  useEffect(() => {
    const channel = supabase
      .channel('realtime:posts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          loadFeedPosts();
          loadTrendingNews();
        }
      )
      .subscribe();

    return () => {
      try { supabase.removeChannel(channel); } catch {}
    };
  }, []);

  useEffect(() => {
    filterFeedPosts();
  }, [selectedCategory]);

  // Auto-play first video when posts load (Instagram-style)
  useEffect(() => {
    if (feedPosts.length > 0 && !visibleVideoId) {
      const firstVideoPost = feedPosts.find(post => post.type === 'video');
      if (firstVideoPost) {
        console.log('Setting first video as visible:', firstVideoPost.id);
        setVisibleVideoId(firstVideoPost.id);
        
        // If it's a YouTube video, mark it as playing
        if (isYouTubeUrl(firstVideoPost.media_url)) {
          setYoutubePlaying(prev => ({ ...prev, [firstVideoPost.id]: true }));
        }
      }
    }
  }, [feedPosts]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadTrendingNews(),
        loadFeedPosts()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')  // Select all columns from your existing table
        .order('name');

      if (error) {
        console.error('Error loading universities:', error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log('Loaded universities from database:', data.length);
        setUniversities(data);
      } else {
        console.log('No universities found in database');
        setUniversities([]);
      }
    } catch (error) {
      console.error('Error loading universities:', error);
      // Set empty array if there's an error
      setUniversities([]);
    }
  };
  const loadTrendingNews = async () => {
    try {
      console.log('🔄 Loading trending news...');
      
      // Try to load from dedicated trending_news table first with images
      const { data, error } = await supabase
        .from('trending_news')
        .select(`
          *,
          trending_news_images(id, image_url, caption, order_index)
        `)
        .eq('is_active', true)
        .order('trending_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      console.log('📊 Fetched trending news:', data?.length || 0);

      if (data && data.length > 0) {
        const mapped: TrendingNews[] = data.map((item: any) => {
          // Sort images by order_index
          const sortedImages = (item.trending_news_images || [])
            .sort((a: any, b: any) => a.order_index - b.order_index);

          return {
            id: item.id,
            headline: item.headline,
            summary: item.summary || '',
            thumbnail: item.thumbnail_url || 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
            images: sortedImages.length > 0 ? sortedImages.map((img: any) => ({
              id: img.id,
              image_url: img.image_url,
              caption: img.caption,
              order_index: img.order_index
            })) : [{
              id: 'thumbnail',
              image_url: item.thumbnail_url || 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
              caption: 'Main image',
              order_index: 0
            }],
            category: item.category || 'General',
            publishedAt: item.published_at,
            readTime: item.read_time || estimateReadTime(item.headline),
            trending_score: item.trending_score || 50,
            source: item.source || 'News Source',
          };
        });
        
        setTrendingNews(mapped);
        console.log('✅ Trending news loaded from database');
        return;
      }
      
      throw new Error('No trending news found in database');
    } catch (e) {
      console.log('⚠️ Using fallback trending news data');
      // Fallback to existing mock data when database is empty
      const mockNews: TrendingNews[] = [
        { 
          id: 'mock-1', 
          headline: 'New STEM Scholarship Program Launches', 
          summary: 'Government announces $50M funding for science students', 
          thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg', 
          images: [
            { id: 'mock-img-1', image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg', caption: 'Students in lab', order_index: 0 },
            { id: 'mock-img-2', image_url: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg', caption: 'Research facility', order_index: 1 }
          ],
          category: 'Scholarships', 
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), 
          readTime: '3 min read', 
          trending_score: 95, 
          source: 'Ministry of Education' 
        },
        { 
          id: 'mock-2', 
          headline: 'University Admission Deadlines Extended', 
          summary: 'Technical issues prompt deadline extension for major universities', 
          thumbnail: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg', 
          images: [
            { id: 'mock-img-3', image_url: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg', caption: 'University building', order_index: 0 },
            { id: 'mock-img-4', image_url: 'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg', caption: 'Students studying', order_index: 1 }
          ],
          category: 'Admissions', 
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), 
          readTime: '2 min read', 
          trending_score: 88, 
          source: 'University News' 
        },
        { 
          id: 'mock-3', 
          headline: 'AI Program Rankings Released', 
          summary: 'Top universities for artificial intelligence studies revealed', 
          thumbnail: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg', 
          images: [
            { id: 'mock-img-5', image_url: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg', caption: 'Computer science lab', order_index: 0 },
            { id: 'mock-img-6', image_url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg', caption: 'AI technology', order_index: 1 }
          ],
          category: 'Rankings', 
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), 
          readTime: '4 min read', 
          trending_score: 82, 
          source: 'Education Weekly' 
        }
      ];
      setTrendingNews(mockNews);
    }
  };

  const loadFeedPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, author_name, author_avatar, author_verified,
          caption, image_url, video_url, likes_count, comments_count, shares_count, views_count,
          category, tags, university_id,
          created_at, updated_at,
          universities(id, name, location, website, description, created_at),
          post_media(media_type, media_url, thumbnail_url, duration, is_primary, order_index)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const mapped: FeedPost[] = (data || []).map((row: SupaPost) => mapSupaPostToFeedPost(row));

      if (mapped.length > 0) {
        setFeedPosts(mapped);
        return;
      }
      throw new Error('No posts found');
    } catch (e) {
      console.error('Error loading feed posts:', e);
      // Fallback to empty array when backend has issues
      setFeedPosts([]);
    }
  };

  const filterFeedPosts = () => {
    return feedPosts.filter(post => {
      // Filter by category
      if (selectedCategory !== 'all' && post.category !== selectedCategory) {
        return false;
      }
      
      // Filter by university
      if (selectedUniversity) {
        const selectedUni = universities.find(u => u.id === selectedUniversity);
        if (!selectedUni) return false;
        
        // Check if post is from the selected university
        const isFromUniversity = 
          post.university?.id === selectedUniversity ||
          post.university?.name === selectedUni.name ||
          post.author.name.toLowerCase().includes(selectedUni.name.toLowerCase());
        
        if (!isFromUniversity) return false;
      }
      
      return true;
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const toggleLike = (postId: string) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

  const toggleSave = (postId: string) => {
    const newSaved = new Set(savedPosts);
    if (newSaved.has(postId)) {
      newSaved.delete(postId);
    } else {
      newSaved.add(postId);
    }
    setSavedPosts(newSaved);
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getAuthorTypeIcon = (type: string) => {
    switch (type) {
      case 'university': return Building;
      case 'student': return User;
      case 'organization': return Award;
      default: return User;
    }
  };

  // Instagram-style video component with auto-play
  const renderVideo = (post: FeedPost) => {
    try {
      const videoId = post?.id;
      const isVisible = visibleVideoId === videoId;
      const videoUrl = post?.media_url;
      
      // Ensure we have valid data before proceeding
      if (!videoId || !videoUrl || typeof videoId !== 'string' || typeof videoUrl !== 'string') {
        return (
          <View style={styles.videoContainer}>
            <Text style={styles.errorText}>Invalid video data</Text>
          </View>
        );
      }
      
      // Check if it's a YouTube URL
      if (isYouTubeUrl(videoUrl)) {
        const youtubeVideoId = getYouTubeVideoId(videoUrl);
        const isPlaying = youtubePlaying[videoId] || false;
        
        if (!youtubeVideoId || typeof youtubeVideoId !== 'string') {
          console.log('Invalid YouTube video ID for URL:', videoUrl);
          return (
            <View style={styles.videoContainer}>
              <Text style={styles.errorText}>Invalid YouTube URL</Text>
            </View>
          );
        }

        console.log('Rendering YouTube video:', { videoId, youtubeVideoId, isVisible, isPlaying });

        // Create YouTube embed URL for WebView with better parameters
        const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&loop=1&playlist=${youtubeVideoId}`;
        
        return (
          <View style={styles.videoContainer}>
            {/* WebView for both web and mobile */}
            <WebView
              ref={(ref: any) => {
                if (ref && !youtubeRefs.current[videoId]) {
                  youtubeRefs.current[videoId] = ref;
                  console.log('WebView ref set for:', videoId, 'Platform:', Platform.OS);
                }
              }}
              source={{ uri: embedUrl }}
              style={Platform.OS === 'web' ? {
                width: '100%',
                height: '220px',
                backgroundColor: '#000000'
              } : [
                styles.youtubeWebView,
                { 
                  opacity: 1,
                  backgroundColor: '#000000' 
                }
              ]}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.webViewLoading}>
                  <ActivityIndicator size="large" color="#FF0000" />
                  <Text style={[styles.loadingText, { color: '#FFFFFF' }]}>Loading YouTube...</Text>
                </View>
              )}
              onLoad={() => {
                console.log('YouTube WebView loaded for:', youtubeVideoId, 'Platform:', Platform.OS);
              }}
              onError={(error: any) => {
                console.log('YouTube WebView error:', error, 'Platform:', Platform.OS);
              }}
              onMessage={(event: any) => {
                console.log('WebView message:', event.nativeEvent?.data);
              }}
            />
            
            {/* YouTube overlay controls */}
            <TouchableOpacity 
              style={styles.videoOverlay}
              onPress={() => {
                // Toggle play state
                const currentlyPlaying = youtubePlaying[videoId] || false;
                setYoutubePlaying(prev => ({ ...prev, [videoId]: !currentlyPlaying }));
                
                // For mobile: open in YouTube app as fallback
                if (Platform.OS !== 'web') {
                  const url = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
                  Linking.openURL(url).catch(err => console.error('Failed to open YouTube:', err));
                }
              }}
            >
              {!isPlaying && (
                <View style={styles.playOverlay}>
                  <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                    style={styles.playGradient}
                  >
                    <Play size={32} color="#FFFFFF" />
                  </LinearGradient>
                </View>
              )}
            </TouchableOpacity>

            {/* Views counter */}
            {post.engagement?.views && typeof post.engagement.views === 'number' && (
              <View style={styles.viewsBadge}>
                <Eye size={12} color="#FFFFFF" />
                <Text style={styles.viewsText}>{(post.engagement.views / 1000).toFixed(1)}K views</Text>
              </View>
            )}

            {/* YouTube badge */}
            <View style={styles.youtubeBadge}>
              <Text style={styles.youtubeBadgeText}>YouTube</Text>
            </View>
          </View>
        );
      }
    
    // Handle MP4/direct video URLs (unchanged)
    return (
      <View style={styles.videoContainer}>
        <Video
          ref={(ref) => {
            if (ref && !videoRefs.current[videoId]) {
              videoRefs.current[videoId] = ref;
              console.log('MP4 Video ref set for:', videoId);
            }
          }}
          source={{ uri: videoUrl }}
          style={styles.mediaImage}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isVisible}
          isLooping
          isMuted={true} // Start muted like Instagram
          useNativeControls={false}
          onLoad={() => {
            console.log('MP4 video loaded');
          }}
          onError={(error) => {
            console.log('Video error:', error);
          }}
        />
        
        {/* Video overlay controls */}
        <TouchableOpacity 
          style={styles.videoOverlay}
          onPress={() => {
            const video = videoRefs.current[videoId];
            if (video) {
              video.getStatusAsync().then(status => {
                if (status.isLoaded) {
                  if (status.isPlaying) {
                    video.pauseAsync();
                  } else {
                    video.playAsync();
                  }
                }
              });
            }
          }}
        >
          {!isVisible && (
            <View style={styles.playOverlay}>
              <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                style={styles.playGradient}
              >
                <Play size={32} color="#FFFFFF" />
              </LinearGradient>
            </View>
          )}
        </TouchableOpacity>

        {/* Video duration badge */}
        {post.duration && typeof post.duration === 'string' && (
          <View style={styles.durationBadge}>
            <Clock size={12} color="#FFFFFF" />
            <Text style={styles.durationText}>{post.duration}</Text>
          </View>
        )}

        {/* Views counter */}
        {post.engagement?.views && typeof post.engagement.views === 'number' && (
          <View style={styles.viewsBadge}>
            <Eye size={12} color="#FFFFFF" />
            <Text style={styles.viewsText}>{(post.engagement.views / 1000).toFixed(1)}K views</Text>
          </View>
        )}

        {/* Mute/unmute button */}
        <TouchableOpacity 
          style={styles.muteButton}
          onPress={() => {
            const video = videoRefs.current[videoId];
            if (video) {
              video.getStatusAsync().then(status => {
                if (status.isLoaded) {
                  video.setIsMutedAsync(!status.isMuted);
                }
              });
            }
          }}
        >
          <View style={styles.muteIcon}>
            <Text style={styles.muteText}>🔊</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  } catch (error) {
    console.error('Error in renderVideo:', error);
    return (
      <View style={styles.videoContainer}>
        <Text style={styles.errorText}>Error loading video</Text>
      </View>
    );
  }
  };  // Track which videos should auto-play based on scroll position
  const handleVideoVisibility = (videoId: string, isVisible: boolean) => {
    if (isVisible) {
      setVisibleVideoId(videoId);
    } else if (visibleVideoId === videoId) {
      setVisibleVideoId(null);
    }
  };

  // Throttled video visibility check for performance
  const throttledVideoCheck = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setCurrentScrollY(scrollY);

    // Throttle video visibility checks for better performance
    if (throttledVideoCheck.current) {
      clearTimeout(throttledVideoCheck.current);
    }
    
    throttledVideoCheck.current = setTimeout(() => {
      checkVideoVisibility().catch(error => {
        console.log('Error in checkVideoVisibility:', error);
      });
    }, 150) as any; // Instagram-style responsiveness
  };

  // Instagram-style scroll detection for auto-playing videos - IMPROVED VERSION
  const checkVideoVisibility = async () => {
    const windowHeight = Dimensions.get('window').height;
    const viewportTop = currentScrollY;
    const viewportBottom = currentScrollY + windowHeight;
    const viewportCenter = viewportTop + windowHeight / 2;

    let closestVideoToCenter = null;
    let smallestDistance = Infinity;

    // Find the video closest to center of viewport
    feedPosts
      .filter(post => post.type === 'video')
      .forEach((post, index) => {
        // More accurate post position calculation
        // Each post is roughly 600px (header + video + actions + padding)
        const estimatedPostTop = index * 600;
        const estimatedPostBottom = estimatedPostTop + 400; // Video area height
        const postCenter = estimatedPostTop + 200;

        // Check if post is in viewport
        const isInViewport = estimatedPostBottom > viewportTop && estimatedPostTop < viewportBottom;
        
        if (isInViewport) {
          const distanceFromCenter = Math.abs(postCenter - viewportCenter);
          
          if (distanceFromCenter < smallestDistance) {
            smallestDistance = distanceFromCenter;
            closestVideoToCenter = post;
          }
        }
      });

    // Update visible video (only one video plays at a time - Instagram style)
    if (closestVideoToCenter && closestVideoToCenter.id !== visibleVideoId) {
      console.log('Making video visible:', closestVideoToCenter.id);
      
      // Pause previous video
      if (visibleVideoId) {
        const previousPost = feedPosts.find(p => p.id === visibleVideoId);
        if (previousPost) {
          if (isYouTubeUrl(previousPost.media_url)) {
            setYoutubePlaying(prev => ({ ...prev, [visibleVideoId]: false }));
            const webView = youtubeRefs.current[visibleVideoId];
            if (webView && Platform.OS !== 'web' && webView.injectJavaScript) {
              webView.injectJavaScript(`
                var videos = document.querySelectorAll('video');
                videos.forEach(video => video.pause());
                true;
              `);
            }
          } else {
            const video = videoRefs.current[visibleVideoId];
            if (video) {
              video.pauseAsync();
            }
          }
        }
      }
      
      // Play new video
      setVisibleVideoId(closestVideoToCenter.id);
      
      if (isYouTubeUrl(closestVideoToCenter.media_url)) {
        setYoutubePlaying(prev => ({ ...prev, [closestVideoToCenter.id]: true }));
        
        // Inject JavaScript for both web and mobile platforms
        // Delay to ensure WebView is ready
        setTimeout(() => {
          const webView = youtubeRefs.current[closestVideoToCenter.id];
          if (webView && webView.injectJavaScript) {
            console.log('Playing YouTube video:', closestVideoToCenter.id, 'Platform:', Platform.OS);
            webView.injectJavaScript(`
              var videos = document.querySelectorAll('video');
              videos.forEach(video => {
                video.muted = true;
                video.play().catch(e => console.log('YouTube auto-play failed:', e));
              });
              true;
            `);
          }
        }, 500);
      } else {
        const video = videoRefs.current[closestVideoToCenter.id];
        if (video) {
          video.playAsync();
        }
      }
    } else if (!closestVideoToCenter && visibleVideoId) {
      // No video in viewport - pause current video
      console.log('No video in viewport, pausing:', visibleVideoId);
      
      const currentPost = feedPosts.find(p => p.id === visibleVideoId);
      if (currentPost) {
        if (isYouTubeUrl(currentPost.media_url)) {
          setYoutubePlaying(prev => ({ ...prev, [visibleVideoId]: false }));
          // Inject JavaScript for both web and mobile platforms
          const webView = youtubeRefs.current[visibleVideoId];
          if (webView && webView.injectJavaScript) {
            webView.injectJavaScript(`
              var videos = document.querySelectorAll('video');
              videos.forEach(video => video.pause());
              true;
            `);
          }
        } else {
          const video = videoRefs.current[visibleVideoId];
          if (video) {
            try {
              // Check if video is ready before pausing
              const status = await video.getStatusAsync();
              if (status.isLoaded) {
                await video.pauseAsync();
              }
            } catch (error) {
              console.log('Error pausing video:', error);
            }
          }
        }
      }
      
      setVisibleVideoId(null);
    }
  };

  const renderTrendingNews = () => (
    <View style={styles.trendingSection}>
      <View style={styles.trendingHeader}>
        <TrendingUp size={20} color="#EF4444" />
        <Text style={styles.trendingTitle}>Trending Now</Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.trendingContainer}
        onScroll={handleTrendingScroll}
        scrollEventThrottle={16}
      >
        {trendingNews.map((news, index) => (
          <TouchableOpacity
            key={news.id}
            ref={(ref) => trendingRefs.current[index] = ref}
            style={styles.trendingCard}
            onPress={() => router.push({
              pathname: '/news-detail',
              params: {
                id: news.id,
                headline: news.headline,
                summary: news.summary,
                thumbnail: news.thumbnail,
                category: news.category,
                publishedAt: news.publishedAt,
                readTime: news.readTime,
                trending_score: news.trending_score.toString(),
                source: news.source
              }
            })}
          >
            {/* Use AutoScrollingImages component for multiple images */}
            <AutoScrollingImages
              images={news.images || [{ 
                id: 'thumbnail', 
                image_url: news.thumbnail, 
                caption: 'Main image', 
                order_index: 0 
              }]}
              width={280}
              height={160}
              autoScrollInterval={2000}
              showIndicators={true}
              isVisible={index === visibleTrendingIndex}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.trendingOverlay}
            >
              <View style={styles.trendingBadge}>
                <Text style={styles.trendingBadgeText}>TRENDING</Text>
              </View>
              <Text style={styles.trendingHeadline} numberOfLines={2}>
                {news.headline}
              </Text>
              <View style={styles.trendingMeta}>
                <Text style={styles.trendingSource}>{news.source}</Text>
                <Text style={styles.trendingTime}>{news.readTime}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderFeedPost = (post: FeedPost) => {
    const AuthorIcon = getAuthorTypeIcon(post.author.type);
    const isLiked = likedPosts.has(post.id);
    const isSaved = savedPosts.has(post.id);

    return (
      <View 
        key={post.id} 
        style={styles.feedPost}
        ref={(ref) => {
          if (ref) postRefs.current[post.id] = ref;
        }}
      >
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <Image source={{ uri: post.author.avatar }} style={styles.authorAvatar} />
            <View style={styles.authorDetails}>
              <View style={styles.authorNameRow}>
                <Text style={styles.authorName}>{post.author.name}</Text>
                {post.author.verified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓</Text>
                  </View>
                )}
                <View style={styles.authorTypeBadge}>
                  <AuthorIcon size={12} color="#6B7280" />
                </View>
              </View>
              <Text style={styles.postTime}>{getTimeAgo(post.created_at)}</Text>
              {post.metadata?.location && typeof post.metadata.location === 'string' && (
                <View style={styles.locationRow}>
                  <MapPin size={12} color="#6B7280" />
                  <Text style={styles.locationText}>{post.metadata.location}</Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postDescription} numberOfLines={3}>
            {post.description}
          </Text>
        </View>

        {/* Media */}
        <View style={styles.mediaContainer}>
          {post.type === 'video' ? (
            renderVideo(post)
          ) : (
            <Image source={{ uri: post.media_url }} style={styles.mediaImage} />
          )}
        </View>

        {/* Metadata Badges */}
        <View style={styles.metadataContainer}>
          {post.metadata.program && (
            <View style={styles.metadataBadge}>
              <GraduationCap size={14} color="#3B82F6" />
              <Text style={styles.metadataText}>{post.metadata.program}</Text>
            </View>
          )}
          {post.metadata.amount && (
            <View style={styles.metadataBadge}>
              <DollarSign size={14} color="#10B981" />
              <Text style={styles.metadataText}>{post.metadata.amount}</Text>
            </View>
          )}
          {post.metadata.salary && (
            <View style={styles.metadataBadge}>
              <DollarSign size={14} color="#10B981" />
              <Text style={styles.metadataText}>{post.metadata.salary}</Text>
            </View>
          )}
          {post.metadata.rating && (
            <View style={styles.metadataBadge}>
              <Star size={14} color="#F59E0B" />
              <Text style={styles.metadataText}>{post.metadata.rating}/10</Text>
            </View>
          )}
          {post.metadata.deadline && (
            <View style={[styles.metadataBadge, styles.deadlineBadge]}>
              <Calendar size={14} color="#EF4444" />
              <Text style={[styles.metadataText, styles.deadlineText]}>
                Due {new Date(post.metadata.deadline).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <View style={styles.leftActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => toggleLike(post.id)}
            >
              <Heart 
                size={24} 
                color={isLiked ? "#EF4444" : "#1F2937"}
                fill={isLiked ? "#EF4444" : "none"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={24} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => toggleSave(post.id)}
          >
            <Bookmark 
              size={24} 
              color={isSaved ? "#1F2937" : "#1F2937"}
              fill={isSaved ? "#1F2937" : "none"}
            />
          </TouchableOpacity>
        </View>

        {/* Engagement Stats */}
        <View style={styles.engagementStats}>
          <Text style={styles.likesCount}>
            {(post.engagement.likes + (isLiked ? 1 : 0)).toLocaleString()} likes
          </Text>
          <Text style={styles.commentsCount}>
            View all {post.engagement.comments.toLocaleString()} comments
          </Text>
        </View>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {post.tags.slice(0, 3).map((tag, index) => (
            <Text key={index} style={styles.tagText}>
              #{tag}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const filteredPosts = selectedCategory === 'all' 
    ? feedPosts 
    : feedPosts.filter(post => post.category === selectedCategory);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          { 
            backgroundColor: colors.cardBackground,
            opacity: headerOpacity
          }
        ]}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: colors.text }]}>Good morning</Text>
            <Text style={[styles.userName, { color: colors.textSecondary }]}>Welcome back</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color={colors.text} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push('/auth')}
            >
              <User size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search universities, programs, scholarships..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { 
            useNativeDriver: true,
            listener: handleScroll // Use our Instagram-style video detection
          }
        )}
        scrollEventThrottle={16}
      >
        {/* Trending News Section (Reduced Height) */}
        {renderTrendingNews()}

        {/* University Filter Button */}
        <View style={styles.filterSection}>
          <TouchableOpacity 
            style={styles.universityFilterButton}
            onPress={() => setShowUniversityFilter(true)}
          >
            <Building size={20} color="#3B82F6" />
            <Text style={styles.filterButtonText}>
              {selectedUniversity ? selectedUniversity : 'Filter by University'}
            </Text>
            <ChevronRight size={16} color="#6B7280" />
          </TouchableOpacity>
          
          {selectedUniversity && (
            <TouchableOpacity 
              style={styles.clearFilterButton}
              onPress={() => setSelectedUniversity(null)}
            >
              <Text style={styles.clearFilterText}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        <View style={styles.categoryFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.key && styles.activeCategoryButton,
                  { backgroundColor: selectedCategory === category.key ? category.color : '#F3F4F6' }
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <category.icon 
                  size={16} 
                  color={selectedCategory === category.key ? '#FFFFFF' : '#6B7280'} 
                />
                <Text style={[
                  styles.categoryButtonText,
                  { color: selectedCategory === category.key ? '#FFFFFF' : '#6B7280' }
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Instagram-Style Feed */}
        <View style={styles.feedContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Loading your feed...
              </Text>
            </View>
          ) : (
            filterFeedPosts().map((post) => renderFeedPost(post))
          )}
        </View>
      </Animated.ScrollView>
      
      {/* University Filter Modal */}
      <Modal
        visible={showUniversityFilter}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowUniversityFilter(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select University</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowUniversityFilter(false)}
            >
              <X size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalSearchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search universities..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <ScrollView style={styles.universitiesList} showsVerticalScrollIndicator={false}>
            <TouchableOpacity 
              style={[styles.universityItem, !selectedUniversity && styles.selectedUniversityItem]}
              onPress={() => {
                setSelectedUniversity(null);
                setShowUniversityFilter(false);
              }}
            >
              <View style={styles.universityLogo}>
                <Globe size={24} color="#3B82F6" />
              </View>
              <View style={styles.universityInfo}>
                <Text style={styles.universityName}>All Universities</Text>
                <Text style={styles.universityLocation}>Show content from all institutions</Text>
              </View>
              {!selectedUniversity && (
                <CheckCircle size={20} color="#3B82F6" />
              )}
            </TouchableOpacity>
            
            {universities.map((university) => {
              // Use default logo since your table doesn't have logo fields
              const logoUrl = 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg';
              const location = university.location || 'Location not specified';

              return (
                <TouchableOpacity 
                  key={university.id}
                  style={[styles.universityItem, selectedUniversity === university.id && styles.selectedUniversityItem]}
                  onPress={() => {
                    setSelectedUniversity(university.id);
                    setShowUniversityFilter(false);
                  }}
                >
                  <Image source={{ uri: logoUrl }} style={styles.universityLogo} />
                  <View style={styles.universityInfo}>
                    <Text style={styles.universityName}>{university.name}</Text>
                    <Text style={styles.universityLocation}>{location}</Text>
                  </View>
                  {selectedUniversity === university.id && (
                    <CheckCircle size={20} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  profileButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  content: {
    flex: 1,
  },
  
  // Trending Section (Reduced Height)
  trendingSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
    gap: 8,
  },
  trendingTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  trendingContainer: {
    paddingLeft: 24,
  },
  trendingCard: {
    width: 280,
    height: 120,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  trendingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    justifyContent: 'flex-end',
  },
  trendingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  trendingBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  trendingHeadline: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 6,
  },
  trendingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendingSource: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  trendingTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },

  // University Filter Section
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  universityFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
    marginRight: 12,
    gap: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    flex: 1,
  },
  clearFilterButton: {
    backgroundColor: '#EF444415',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearFilterText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  // Category Filter
  categoryFilter: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryScroll: {
    paddingHorizontal: 24,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    gap: 6,
  },
  activeCategoryButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },

  // Instagram-Style Feed
  feedContainer: {
    backgroundColor: '#F8FAFC',
  },
  feedPost: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  verifiedBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  authorTypeBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  postTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  moreButton: {
    padding: 4,
  },
  postContent: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 22,
  },
  postDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  mediaContainer: {
    position: 'relative',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
    backgroundColor: '#000000',
  },
  mediaImage: {
    width: '100%',
    height: 300,
  },
  carouselContainer: {
    position: 'relative',
  },
  carousel: {
    width: '100%',
    height: 300,
  },
  carouselVideoContainer: {
    width: width,
    height: 300,
    position: 'relative',
  },
  carouselIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  carouselDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeCarouselDot: {
    backgroundColor: '#FFFFFF',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mediaCounter: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mediaCounterText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  playGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  viewsBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  viewsText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  // New Instagram-style video controls
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteButton: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  metadataBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  deadlineBadge: {
    backgroundColor: '#FEF2F2',
  },
  metadataText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  deadlineText: {
    color: '#EF4444',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  saveButton: {
    padding: 4,
  },
  engagementStats: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  likesCount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  commentsCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  tagsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  
  // University Filter Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  universitiesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  universityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  selectedUniversityItem: {
    backgroundColor: '#3B82F615',
    borderColor: '#3B82F6',
  },
  universityLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  universityInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  universityLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: 16,
  },
  // YouTube WebView styles - IMPROVED
  youtubeWebView: {
    width: width,
    height: 220,
    backgroundColor: '#000000',
    flex: 1,
  },
  webViewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    zIndex: 1,
  },
  youtubeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF0000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  youtubeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  openYouTubeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openYouTubeText: {
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    padding: 20,
  },
});