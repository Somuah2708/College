import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { ArrowLeft, Search, Heart, MessageCircle, Share, Bookmark, MoveHorizontal as MoreHorizontal, Globe, Briefcase, Award, Users, Plane, Target } from 'lucide-react-native';
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

export default function OpportunitiesScreen() {
  const router = useRouter();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [videoLoading, setVideoLoading] = useState<{[key: string]: boolean}>({});

  const subcategories = [
    { key: 'all', label: 'All Opportunities', icon: Globe },
    { key: 'internships', label: 'Internships & Work-Study', icon: Briefcase },
    { key: 'jobs', label: 'Job Openings for Graduates', icon: Users },
    { key: 'competitions', label: 'Competitions & Challenges', icon: Award },
    { key: 'exchange', label: 'Exchange & Study Abroad', icon: Plane },
  ];

  useEffect(() => {
    fetchOpportunityPosts();
  }, [selectedSubcategory]);

  const fetchOpportunityPosts = async () => {
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
        generateSampleOpportunityPosts();
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching opportunity posts:', error);
      generateSampleOpportunityPosts();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleOpportunityPosts = () => {
    const samplePosts: Post[] = [
      {
        id: 'opportunity-1',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '💼 INTERNSHIP OPPORTUNITY: Google Africa is now accepting applications for Summer 2025 Software Engineering Internships!\n\nProgram highlights:\n• 12-week paid internship\n• Mentorship from senior engineers\n• Real project impact\n• Potential full-time offer\n• Relocation support to Lagos/Accra\n\nRequirements:\n• Computer Science or related field\n• Strong programming skills\n• Problem-solving abilities\n\nDeadline: February 28, 2025\nApply: careers.google.com/africa\n\n#GoogleAfrica #SoftwareInternship #TechCareers #PaidInternship',
        image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
        video_url: null,
        likes: 8920,
        comments: 567,
        shares: 1234,
        views: 23450,
        author_id: 'google-africa',
        author_name: 'Google Africa',
        author_role: 'Technology Company',
        status: 'published',
        scheduled_for: null,
        tags: ['internships', 'google', 'software_engineering', 'paid_internship'],
        target_audience: ['current_students', 'computer_science_students']
      },
      {
        id: 'opportunity-2',
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '🏆 COMPETITION ALERT: Africa Code Challenge 2025 is here! Compete with the best programmers across Africa for amazing prizes.\n\nPrizes:\n🥇 1st Place: $10,000 + MacBook Pro\n🥈 2nd Place: $5,000 + iPad Pro\n🥉 3rd Place: $2,500 + Apple Watch\n\nCategories:\n• Web Development\n• Mobile Apps\n• AI/Machine Learning\n• Blockchain\n\nRegistration: Free\nDeadline: March 1, 2025\nCompetition: March 15-17, 2025\n\nRegister: africacodechallenge.com\n\n#AfricaCodeChallenge #Programming #Competition #TechPrizes',
        image_url: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        likes: 6780,
        comments: 345,
        shares: 890,
        views: 19230,
        author_id: 'africa-code',
        author_name: 'Africa Code Challenge',
        author_role: 'Competition Organizer',
        status: 'published',
        scheduled_for: null,
        tags: ['competitions', 'programming', 'africa', 'prizes'],
        target_audience: ['current_students', 'developers', 'tech_enthusiasts']
      },
      {
        id: 'opportunity-3',
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '✈️ STUDY ABROAD: University of Oxford announces Ghana-UK Exchange Program for 2025!\n\nProgram details:\n• One semester at Oxford University\n• Full scholarship coverage\n• Accommodation provided\n• Cultural immersion program\n• Academic credit transfer\n\nEligible students:\n• 3rd year undergraduates\n• GPA 3.7 or higher\n• Strong English proficiency\n• Leadership experience\n\nApplication opens: February 1, 2025\nDeadline: April 15, 2025\n\nMore info: oxford.edu.uk/ghana-exchange\n\n#Oxford #StudyAbroad #ExchangeProgram #UKEducation #FullScholarship',
        image_url: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
        video_url: null,
        likes: 12340,
        comments: 678,
        shares: 1567,
        views: 34560,
        author_id: 'oxford-uni',
        author_name: 'University of Oxford',
        author_role: 'International University',
        status: 'published',
        scheduled_for: null,
        tags: ['exchange', 'oxford', 'study_abroad', 'full_scholarship'],
        target_audience: ['current_students', 'high_achievers']
      },
      {
        id: 'opportunity-4',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        caption: '🎯 GRADUATE OPPORTUNITY: Unilever Ghana Graduate Trainee Program 2025 now open!\n\nProgram benefits:\n• 18-month structured training\n• Rotation across departments\n• Competitive salary + benefits\n• International exposure\n• Fast-track to management\n• Mentorship from senior leaders\n\nEligible degrees:\n• Business Administration\n• Engineering\n• Marketing\n• Supply Chain\n• Finance\n\nRequirements:\n• First/Second Class degree\n• NYSS completion\n• Strong leadership potential\n\nDeadline: March 20, 2025\nApply: careers.unilever.com.gh\n\n#Unilever #GraduateTrainee #ManagementTraining #CareerOpportunity',
        image_url: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        likes: 4560,
        comments: 234,
        shares: 456,
        views: 15670,
        author_id: 'unilever-ghana',
        author_name: 'Unilever Ghana',
        author_role: 'Multinational Company',
        status: 'published',
        scheduled_for: null,
        tags: ['jobs', 'graduate_trainee', 'unilever', 'management_training'],
        target_audience: ['final_year_students', 'recent_graduates']
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
          <Text style={styles.title}>🌍 Opportunities</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search opportunities..."
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
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text style={styles.loadingText}>Loading opportunities...</Text>
            </View>
          ) : filteredPosts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Globe size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No opportunities found</Text>
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
                      <Globe size={20} color="#8B5CF6" />
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
                        <ActivityIndicator size="large" color="#8B5CF6" />
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
    backgroundColor: '#8B5CF6',
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
    backgroundColor: '#8B5CF615',
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
    backgroundColor: '#8B5CF6',
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
    color: '#8B5CF6',
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
    backgroundColor: '#8B5CF615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
});