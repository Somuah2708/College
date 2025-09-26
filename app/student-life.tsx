import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { ArrowLeft, Search, Heart, MessageCircle, Share, Bookmark, MoveHorizontal as MoreHorizontal, Users, Award, Heart as HeartIcon, Music } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface Post {
  id: string;
  created_at: string;
  updated_at: string;
  caption: string;
  image_url: string | null;
  video_url: string | null;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  author_id: string | null;
  author_name: string;
  author_role: string;
  status: string;
  scheduled_for: string | null;
  tags: string[];
  target_audience: string[];
}

export default function StudentLifeScreen() {
  const router = useRouter();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [videoLoading, setVideoLoading] = useState<{[key: string]: boolean}>({});

  const subcategories = [
    { key: 'all', label: 'All Student Life', icon: Users },
    { key: 'clubs', label: 'Clubs & Societies', icon: Award },
    { key: 'welfare', label: 'Student Welfare', icon: HeartIcon },
    { key: 'sports', label: 'Sports & Cultural Events', icon: Music },
  ];

  useEffect(() => {
    fetchStudentLifePosts();
  }, [selectedSubcategory]);

  const fetchStudentLifePosts = async () => {
    try {
      setLoading(true);
      
      // Fetch posts from database
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .contains('tags', selectedSubcategory === 'all' ? '[]' : JSON.stringify([selectedSubcategory]))
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching posts:', error);
        generateSampleStudentLifePosts();
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching student life posts:', error);
      generateSampleStudentLifePosts();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleStudentLifePosts = () => {
    const samplePosts: Post[] = [
      {
        id: 'student-1',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '🎭 CULTURAL FESTIVAL: University of Ghana presents "Heritage Week 2025" - celebrating our rich Ghanaian culture!\n\nEvents lineup:\n🥁 Traditional drumming and dancing\n🎨 Art exhibitions by student artists\n🍲 Food festival with local delicacies\n📚 Poetry and storytelling sessions\n🎵 Live music performances\n\nDate: February 24-28, 2025\nVenue: UG Great Hall and surroundings\nEntry: Free for students\n\nCome celebrate our heritage together!\n\n#UGHeritageWeek #GhanaianCulture #StudentLife #CulturalFestival',
        image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
        video_url: null,
        likes: 4560,
        comments: 234,
        shares: 456,
        views: 12340,
        author_id: 'ug-student-affairs',
        author_name: 'UG Student Affairs',
        author_role: 'Student Affairs Office',
        status: 'published',
        scheduled_for: null,
        tags: ['sports', 'cultural_events', 'heritage', 'festival'],
        target_audience: ['current_students', 'faculty', 'community']
      },
      {
        id: 'student-2',
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '🧠 MENTAL HEALTH AWARENESS: KNUST launches "Mind Matters" campaign to support student mental wellness.\n\nNew initiatives:\n• Free counseling sessions\n• Peer support groups\n• Stress management workshops\n• 24/7 mental health hotline\n• Mindfulness and meditation classes\n• Academic stress support\n\nRemember: It\'s okay to not be okay. Seeking help is a sign of strength, not weakness.\n\nContact: mindmatters@knust.edu.gh\nHotline: 0800-MIND-HELP\n\n#MentalHealthMatters #StudentWelfare #KNUST #MindMatters #SupportSystem',
        image_url: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        likes: 7890,
        comments: 445,
        shares: 789,
        views: 18920,
        author_id: 'knust-wellness',
        author_name: 'KNUST Wellness Center',
        author_role: 'Student Support Services',
        status: 'published',
        scheduled_for: null,
        tags: ['welfare', 'mental_health', 'support_services', 'counseling'],
        target_audience: ['current_students', 'parents', 'faculty']
      },
      {
        id: 'student-3',
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '🏆 CLUB SPOTLIGHT: UCC Robotics Club wins National Robotics Competition 2025!\n\nAchievements:\n🥇 1st Place - Autonomous Navigation Challenge\n🥈 2nd Place - Industrial Automation Task\n🏅 Best Innovation Award\n\nTeam members:\n• Kwame Asante (Team Lead) - Mechanical Engineering\n• Ama Serwaa (Programmer) - Computer Science\n• Kofi Mensah (Designer) - Electrical Engineering\n\nPrize: GHS 15,000 + equipment sponsorship\n\nProud of our brilliant students! 🤖\n\n#UCCRobotics #NationalChampions #StudentAchievement #STEM #Innovation',
        image_url: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
        video_url: null,
        likes: 6780,
        comments: 345,
        shares: 567,
        views: 15670,
        author_id: 'ucc-robotics',
        author_name: 'UCC Robotics Club',
        author_role: 'Student Organization',
        status: 'published',
        scheduled_for: null,
        tags: ['clubs', 'robotics', 'competition', 'achievement'],
        target_audience: ['current_students', 'stem_students', 'engineering_students']
      },
      {
        id: 'student-4',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '⚽ SPORTS UPDATE: Inter-University Games 2025 kicks off next month! Ashesi University hosting this year\'s championship.\n\nSports categories:\n⚽ Football (Men & Women)\n🏀 Basketball\n🏐 Volleyball\n🏓 Table Tennis\n🏃‍♂️ Athletics\n🏊‍♀️ Swimming\n♟️ Chess\n🏸 Badminton\n\nDates: March 10-17, 2025\nVenue: Ashesi University Sports Complex\nParticipating: 25+ universities\n\nCome support your university teams!\n\n#InterUniGames #AshesiSports #UniversitySports #StudentAthletes #Competition',
        image_url: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        likes: 3450,
        comments: 178,
        shares: 234,
        views: 9870,
        author_id: 'ashesi-sports',
        author_name: 'Ashesi Sports Department',
        author_role: 'University Sports',
        status: 'published',
        scheduled_for: null,
        tags: ['sports', 'inter_university', 'competition', 'athletics'],
        target_audience: ['current_students', 'athletes', 'sports_fans']
      }
    ];

    setPosts(samplePosts);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery.trim() === '' ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedSubcategory === 'all' ||
      post.tags.includes(selectedSubcategory) ||
      post.tags.some(tag => tag.includes(selectedSubcategory));

    return matchesSearch && matchesCategory;
  });

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

  const handleVideoLoad = (postId: string) => {
    setVideoLoading(prev => ({ ...prev, [postId]: false }));
  };

  const handleVideoLoadStart = (postId: string) => {
    setVideoLoading(prev => ({ ...prev, [postId]: true }));
  };

  const handleVideoError = (postId: string, error: any) => {
    console.warn('Video load error for post', postId, '- this is expected in web environment');
    setVideoLoading(prev => ({ ...prev, [postId]: false }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.title}>🏫 Student Life</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search student life updates..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Subcategory Filters */}
        <View style={styles.subcategoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subcategoriesContainer}>
            {subcategories.map((subcategory) => (
              <TouchableOpacity
                key={subcategory.key}
                style={[
                  styles.subcategoryButton,
                  selectedSubcategory === subcategory.key && styles.activeSubcategoryButton
                ]}
                onPress={() => setSelectedSubcategory(subcategory.key)}
              >
                <subcategory.icon 
                  size={16} 
                  color={selectedSubcategory === subcategory.key ? '#FFFFFF' : '#6B7280'} 
                />
                <Text style={[
                  styles.subcategoryText,
                  selectedSubcategory === subcategory.key && styles.activeSubcategoryText
                ]}>
                  {subcategory.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Posts Feed */}
        <View style={styles.feedContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F59E0B" />
              <Text style={styles.loadingText}>Loading student life updates...</Text>
            </View>
          ) : filteredPosts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Users size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No student life updates found</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Try adjusting your search terms' : 'Check back later for updates'}
              </Text>
            </View>
          ) : (
            filteredPosts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                {/* Post Header */}
                <View style={styles.postHeader}>
                  <View style={styles.userInfo}>
                    <View style={styles.userAvatar}>
                      <Users size={20} color="#F59E0B" />
                    </View>
                    <View style={styles.userDetails}>
                      <View style={styles.userNameRow}>
                        <Text style={styles.userName}>{post.author_name}</Text>
                        <View style={styles.verifiedBadge}>
                          <Text style={styles.verifiedText}>✓</Text>
                        </View>
                      </View>
                      <Text style={styles.authorRole}>{post.author_role}</Text>
                      <Text style={styles.timeAgo}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.moreButton}>
                    <MoreHorizontal size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Post Content */}
                {post.video_url ? (
                  <View style={styles.videoContainer}>
                    {videoLoading[post.id] && (
                      <View style={styles.videoLoadingOverlay}>
                        <ActivityIndicator size="large" color="#F59E0B" />
                      </View>
                    )}
                    <Video
                      source={{ uri: post.video_url }}
                      style={styles.postVideo}
                      useNativeControls
                      resizeMode={ResizeMode.CONTAIN}
                      shouldPlay={false}
                      isLooping={false}
                      onLoad={() => handleVideoLoad(post.id)}
                      onLoadStart={() => handleVideoLoadStart(post.id)}
                      onError={(error) => handleVideoError(post.id, error)}
                    />
                  </View>
                ) : post.image_url ? (
                  <Image source={{ uri: post.image_url }} style={styles.postImage} />
                ) : null}

                {/* Post Actions */}
                <View style={styles.postActions}>
                  <View style={styles.leftActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => toggleLike(post.id)}
                    >
                      <Heart 
                        size={24} 
                        color={likedPosts.has(post.id) ? "#EF4444" : "#1F2937"}
                        fill={likedPosts.has(post.id) ? "#EF4444" : "none"}
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
                      color={savedPosts.has(post.id) ? "#1F2937" : "#1F2937"}
                      fill={savedPosts.has(post.id) ? "#1F2937" : "none"}
                    />
                  </TouchableOpacity>
                </View>

                {/* Post Stats */}
                <View style={styles.postStats}>
                  <Text style={styles.likesCount}>
                    {(post.likes + (likedPosts.has(post.id) ? 1 : 0)).toLocaleString()} likes
                  </Text>
                  <Text style={styles.viewsCount}>
                    {post.views.toLocaleString()} views
                  </Text>
                </View>

                {/* Post Caption */}
                <View style={styles.captionContainer}>
                  <Text style={styles.caption}>
                    <Text style={styles.captionUsername}>{post.author_name}</Text>
                    {' '}
                    {post.caption}
                  </Text>
                </View>

                {/* Comments Preview */}
                <TouchableOpacity style={styles.commentsPreview}>
                  <Text style={styles.commentsText}>
                    View all {post.comments.toLocaleString()} comments
                  </Text>
                </TouchableOpacity>

                {/* Tags */}
                <View style={styles.tagsContainer}>
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <View key={index} style={styles.tagBadge}>
                      <Text style={styles.tagText}>#{tag.replace('_', '')}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  subcategoriesSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  subcategoriesContainer: {
    paddingHorizontal: 24,
  },
  subcategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    gap: 6,
  },
  activeSubcategoryButton: {
    backgroundColor: '#F59E0B',
  },
  subcategoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeSubcategoryText: {
    color: '#FFFFFF',
  },
  feedContainer: {
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  postCard: {
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F59E0B15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  verifiedBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  verifiedText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  authorRole: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    marginTop: 2,
  },
  timeAgo: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  videoContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
    backgroundColor: '#000000',
  },
  postVideo: {
    width: '100%',
    height: '100%',
  },
  videoLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  likesCount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  viewsCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  captionContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    lineHeight: 20,
  },
  captionUsername: {
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  commentsPreview: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  commentsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  tagsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  tagBadge: {
    backgroundColor: '#F59E0B15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
  },
});