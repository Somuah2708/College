import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { ArrowLeft, Search, Heart, MessageCircle, Share, Bookmark, MoveHorizontal as MoreHorizontal, GraduationCap, BookOpen, Award, Users, Calendar, TrendingUp, Building, Lightbulb } from 'lucide-react-native';
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

export default function AcademicsScreen() {
  const router = useRouter();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [videoLoading, setVideoLoading] = useState<{[key: string]: boolean}>({});

  const subcategories = [
    { key: 'all', label: 'All Academic News', icon: GraduationCap },
    { key: 'admissions', label: 'Admissions Updates', icon: BookOpen },
    { key: 'programs', label: 'Program Launches & Changes', icon: Award },
    { key: 'rankings', label: 'University Rankings & Achievements', icon: TrendingUp },
    { key: 'events', label: 'Campus Events', icon: Calendar },
    { key: 'research', label: 'Research & Innovation', icon: Lightbulb },
    { key: 'partnerships', label: 'Partnerships & Collaborations', icon: Building },
  ];

  useEffect(() => {
    fetchAcademicPosts();
  }, [selectedSubcategory]);

  const fetchAcademicPosts = async () => {
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
        // Generate sample academic posts for demo
        generateSampleAcademicPosts();
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching academic posts:', error);
      generateSampleAcademicPosts();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleAcademicPosts = () => {
    const samplePosts: Post[] = [
      {
        id: 'academic-1',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '🎓 ADMISSION UPDATE: University of Ghana announces new Computer Science admission requirements for 2025. Mathematics grade requirement increased to A1-B2. Early application deadline: March 15, 2025.\n\n#UGAdmissions #ComputerScience #AdmissionUpdate',
        image_url: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
        video_url: null,
        likes: 1240,
        comments: 89,
        shares: 156,
        views: 5670,
        author_id: 'ug-official',
        author_name: 'University of Ghana',
        author_role: 'Official University Account',
        status: 'published',
        scheduled_for: null,
        tags: ['admissions', 'computer_science', 'requirements'],
        target_audience: ['prospective_students', 'parents']
      },
      {
        id: 'academic-2',
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '🚀 NEW PROGRAM LAUNCH: KNUST introduces Artificial Intelligence and Robotics Engineering program starting September 2025! This cutting-edge program combines AI, machine learning, and robotics.\n\nApplication opens: February 1, 2025\nDuration: 4 years\nDegree: B.Eng in AI & Robotics\n\n#KNUST #AIRobotics #NewProgram #Engineering',
        image_url: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        likes: 2890,
        comments: 234,
        shares: 445,
        views: 12340,
        author_id: 'knust-official',
        author_name: 'KNUST',
        author_role: 'Official University Account',
        status: 'published',
        scheduled_for: null,
        tags: ['programs', 'artificial_intelligence', 'robotics', 'engineering'],
        target_audience: ['prospective_students', 'current_students']
      },
      {
        id: 'academic-3',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '🏆 RANKING ACHIEVEMENT: Ashesi University ranked #1 private university in West Africa by Times Higher Education! Our commitment to excellence in liberal arts education continues to be recognized globally.\n\n#AshesiUniversity #Ranking #Excellence #WestAfrica #PrivateUniversity',
        image_url: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg',
        video_url: null,
        likes: 3450,
        comments: 167,
        shares: 289,
        views: 8920,
        author_id: 'ashesi-official',
        author_name: 'Ashesi University',
        author_role: 'Official University Account',
        status: 'published',
        scheduled_for: null,
        tags: ['rankings', 'achievement', 'private_university'],
        target_audience: ['current_students', 'alumni', 'prospective_students']
      },
      {
        id: 'academic-4',
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '🔬 RESEARCH BREAKTHROUGH: UCC students develop innovative water purification system using local materials! This groundbreaking research could provide clean water access to rural communities across Ghana.\n\nLead researcher: Final year Chemistry student Mary Asante\nProject duration: 18 months\nFunding: UNESCO Research Grant\n\n#UCC #Research #Innovation #WaterPurification #StudentResearch',
        image_url: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        likes: 5670,
        comments: 345,
        shares: 678,
        views: 15680,
        author_id: 'ucc-official',
        author_name: 'University of Cape Coast',
        author_role: 'Official University Account',
        status: 'published',
        scheduled_for: null,
        tags: ['research', 'innovation', 'chemistry', 'student_achievement'],
        target_audience: ['current_students', 'researchers', 'general_public']
      },
      {
        id: 'academic-5',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '🤝 PARTNERSHIP ANNOUNCEMENT: University of Ghana signs MoU with Google for AI research collaboration! This partnership will establish an AI research lab on campus and provide internship opportunities for students.\n\nBenefits:\n• State-of-the-art AI lab\n• Google internships for top students\n• Faculty exchange program\n• Research funding up to $2M\n\n#UG #Google #Partnership #AI #Research #Internships',
        image_url: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
        video_url: null,
        likes: 8920,
        comments: 567,
        shares: 1234,
        views: 23450,
        author_id: 'ug-official',
        author_name: 'University of Ghana',
        author_role: 'Official University Account',
        status: 'published',
        scheduled_for: null,
        tags: ['partnerships', 'google', 'ai_research', 'internships'],
        target_audience: ['current_students', 'faculty', 'researchers']
      },
      {
        id: 'academic-6',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '📅 CAMPUS EVENT: Annual Science and Technology Fair 2025 at GTUC! Join us for 3 days of innovation, exhibitions, and networking.\n\nDate: March 20-22, 2025\nVenue: GTUC Main Campus\nTime: 9:00 AM - 6:00 PM daily\n\nFeaturing:\n• Student project exhibitions\n• Industry expert talks\n• Startup pitch competitions\n• Career fair with 50+ companies\n\nRegistration: Free for students\n\n#GTUC #SciTechFair #Innovation #CareerFair #StudentProjects',
        image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
        video_url: null,
        likes: 2340,
        comments: 123,
        shares: 234,
        views: 6780,
        author_id: 'gtuc-official',
        author_name: 'Ghana Technology University College',
        author_role: 'Official University Account',
        status: 'published',
        scheduled_for: null,
        tags: ['events', 'science_fair', 'career_fair', 'innovation'],
        target_audience: ['current_students', 'prospective_students', 'industry']
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
          <Text style={styles.title}>🎓 Academics</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search academic news..."
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
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Loading academic news...</Text>
            </View>
          ) : filteredPosts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <GraduationCap size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No academic news found</Text>
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
                      <GraduationCap size={20} color="#3B82F6" />
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
                        <ActivityIndicator size="large" color="#3B82F6" />
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
    backgroundColor: '#3B82F6',
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
    backgroundColor: '#3B82F615',
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
    backgroundColor: '#3B82F6',
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
    color: '#3B82F6',
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
    backgroundColor: '#3B82F615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
});