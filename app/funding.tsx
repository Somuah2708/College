import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { ArrowLeft, Search, Heart, MessageCircle, Share, Bookmark, MoveHorizontal as MoreHorizontal, Award, DollarSign, Calendar, TrendingUp, Users, Target } from 'lucide-react-native';
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

export default function FundingScreen() {
  const router = useRouter();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [videoLoading, setVideoLoading] = useState<{[key: string]: boolean}>({});

  const subcategories = [
    { key: 'all', label: 'All Funding News', icon: Award },
    { key: 'announcements', label: 'Scholarship Announcements', icon: DollarSign },
    { key: 'deadlines', label: 'Application Deadlines', icon: Calendar },
    { key: 'policy_changes', label: 'Financial Aid Policy Changes', icon: TrendingUp },
    { key: 'success_stories', label: 'Winners & Success Stories', icon: Users },
  ];

  useEffect(() => {
    fetchFundingPosts();
  }, [selectedSubcategory]);

  const fetchFundingPosts = async () => {
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
        generateSampleFundingPosts();
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching funding posts:', error);
      generateSampleFundingPosts();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleFundingPosts = () => {
    const samplePosts: Post[] = [
      {
        id: 'funding-1',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '🚨 SCHOLARSHIP ALERT 🚨\n\nMasterCard Foundation announces 500 new scholarships for African students! Full funding including tuition, accommodation, and living expenses.\n\nEligibility:\n• African citizenship\n• Academic excellence (GPA 3.5+)\n• Leadership potential\n• Financial need\n\nDeadline: March 31, 2025\nValue: Up to $50,000 per year\n\nApply now at mastercardfdn.org/scholars\n\n#MasterCardFoundation #Scholarship #FullFunding #AfricanStudents',
        image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
        video_url: null,
        likes: 12450,
        comments: 789,
        shares: 2340,
        views: 45670,
        author_id: 'mcf-official',
        author_name: 'MasterCard Foundation',
        author_role: 'Scholarship Provider',
        status: 'published',
        scheduled_for: null,
        tags: ['announcements', 'mastercard', 'full_funding', 'african_students'],
        target_audience: ['prospective_students', 'current_students']
      },
      {
        id: 'funding-2',
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '⏰ DEADLINE REMINDER: Only 15 days left to apply for the Ghana Education Trust Fund scholarship!\n\nAmount: GHS 25,000 per academic year\nEligible programs: All undergraduate programs\nRequirements: WASSCE aggregate 6-15\n\nDon\'t miss out on this opportunity!\n\nApply: getfund.gov.gh\nDeadline: February 15, 2025\n\n#GETF #DeadlineAlert #GhanaScholarship #UndergraduateScholarship',
        image_url: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        likes: 3890,
        comments: 234,
        shares: 567,
        views: 12340,
        author_id: 'getf-official',
        author_name: 'Ghana Education Trust Fund',
        author_role: 'Government Agency',
        status: 'published',
        scheduled_for: null,
        tags: ['deadlines', 'getf', 'government_scholarship', 'undergraduate'],
        target_audience: ['prospective_students', 'parents']
      },
      {
        id: 'funding-3',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '📢 POLICY UPDATE: Ministry of Education announces new student loan scheme with 0% interest rate for STEM programs!\n\nKey features:\n• Zero interest for Science, Technology, Engineering, Math programs\n• Repayment starts 2 years after graduation\n• Maximum loan: GHS 50,000 per year\n• Grace period for unemployed graduates\n\nEffective: September 2025 academic year\n\n#StudentLoan #STEMEducation #ZeroInterest #EducationPolicy #MinistryOfEducation',
        image_url: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg',
        video_url: null,
        likes: 8760,
        comments: 445,
        shares: 1200,
        views: 28900,
        author_id: 'moe-ghana',
        author_name: 'Ministry of Education Ghana',
        author_role: 'Government Ministry',
        status: 'published',
        scheduled_for: null,
        tags: ['policy_changes', 'student_loans', 'stem_programs', 'zero_interest'],
        target_audience: ['current_students', 'prospective_students', 'parents']
      },
      {
        id: 'funding-4',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '🌟 SUCCESS STORY: Meet Akosua Mensah, recipient of the Chevening Scholarship to Oxford University!\n\n"The scholarship changed my life completely. From a small town in Ghana to studying International Relations at Oxford - dreams do come true with hard work and the right opportunities."\n\nAkosua\'s journey:\n📚 First Class Honours from University of Ghana\n🏆 Student leader and community volunteer\n✈️ Now pursuing Master\'s at Oxford\n💼 Plans to work in international diplomacy\n\nInspiring story for all scholarship applicants!\n\n#Chevening #Oxford #SuccessStory #ScholarshipWinner #Inspiration',
        image_url: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        likes: 5670,
        comments: 289,
        shares: 678,
        views: 18450,
        author_id: 'chevening-uk',
        author_name: 'Chevening Scholarships',
        author_role: 'UK Government Scholarship',
        status: 'published',
        scheduled_for: null,
        tags: ['success_stories', 'chevening', 'oxford', 'international_scholarship'],
        target_audience: ['prospective_students', 'scholarship_applicants']
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
          <Text style={styles.title}>💰 Funding</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search funding opportunities..."
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
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.loadingText}>Loading funding news...</Text>
            </View>
          ) : filteredPosts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Award size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No funding news found</Text>
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
                      <Award size={20} color="#10B981" />
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
                        <ActivityIndicator size="large" color="#10B981" />
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
    backgroundColor: '#10B981',
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
    backgroundColor: '#10B98115',
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
    backgroundColor: '#10B981',
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
    color: '#10B981',
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
    backgroundColor: '#10B98115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
});