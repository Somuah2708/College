import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { ArrowLeft, Bookmark, Heart, MessageCircle, Share, MoveHorizontal as MoreHorizontal, Trash2, User } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface SavedPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  content: {
    image: string;
    video_url: string | null;
    caption: string;
    likes: number;
    comments: number;
    shares: number;
    timeAgo: string;
  };
  type: string;
  saved_at: string;
}

export default function SavedPostsScreen() {
  const router = useRouter();
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingPostId, setRemovingPostId] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please sign in to view your saved posts');
        return;
      }

      // Fetch saved post IDs
      const { data: savedPostsData, error: savedPostsError } = await supabase
        .from('saved_posts')
        .select('post_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (savedPostsError) {
        throw savedPostsError;
      }

      if (!savedPostsData || savedPostsData.length === 0) {
        setSavedPosts([]);
        return;
      }

      // For demo purposes, we'll use the mock posts from the home screen
      // In a real app, you would fetch the actual posts from the database
      const mockPosts = [
        {
          id: '1',
          user: {
            name: 'Stanford University',
            avatar: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
            verified: true
          },
          content: {
            image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
            video_url: null,
            caption: 'Exciting news! Our Computer Science program has been ranked #1 globally for the 5th consecutive year. Join thousands of students who are shaping the future of technology. 🚀\n\n#StanfordCS #TechEducation #Innovation',
            likes: 15420,
            comments: 892,
            shares: 234,
            timeAgo: '2 hours ago'
          },
          type: 'university_update'
        },
        {
          id: '2',
          user: {
            name: 'Sarah Chen',
            avatar: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
            verified: false
          },
          content: {
            image: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg',
            video_url: null,
            caption: 'Just received my acceptance letter to MIT! 🎉 After months of preparation and countless hours of studying, dreams do come true. Thank you to everyone who supported me on this journey.\n\n#MITBound #DreamsComeTrue #HardWorkPaysOff',
            likes: 3240,
            comments: 156,
            shares: 89,
            timeAgo: '4 hours ago'
          },
          type: 'student_achievement'
        },
        {
          id: '3',
          user: {
            name: 'Tech Scholarship Foundation',
            avatar: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
            verified: true
          },
          content: {
            image: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
            video_url: null,
            caption: '🚨 SCHOLARSHIP ALERT 🚨\n\nWe\'re offering 100 full scholarships for Computer Science students! Application deadline: March 15, 2025.\n\nRequirements:\n• GPA 3.5+\n• Leadership experience\n• Community service\n\nApply now! Link in bio.\n\n#TechScholarship #FullFunding #ComputerScience',
            likes: 8760,
            comments: 445,
            shares: 1200,
            timeAgo: '6 hours ago'
          },
          type: 'scholarship_announcement'
        },
        {
          id: '4',
          user: {
            name: 'Michael Rodriguez',
            avatar: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
            verified: false
          },
          content: {
            image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            caption: 'From student to Software Engineer at Google! 💻✨\n\nMy journey:\n📚 Computer Science at UC Berkeley\n🔬 Research internship at Stanford\n💼 Now building products used by millions\n\nTo current students: believe in yourself and never stop learning!\n\n#GoogleLife #SoftwareEngineer #AlumniStory #TechCareer',
            likes: 5680,
            comments: 289,
            shares: 167,
            timeAgo: '8 hours ago'
          },
          type: 'alumni_story'
        },
        {
          id: '5',
          user: {
            name: 'Harvard University',
            avatar: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
            verified: true
          },
          content: {
            image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            caption: 'Innovation Lab Update: Our students just developed an AI system that can predict climate patterns with 95% accuracy! 🌍🤖\n\nThis groundbreaking research will be presented at the International Climate Conference next month.\n\n#HarvardInnovation #ClimateAI #StudentResearch #Innovation',
            likes: 12340,
            comments: 567,
            shares: 890,
            timeAgo: '12 hours ago'
          },
          type: 'research_update'
        },
        {
          id: '6',
          user: {
            name: 'Global Education Network',
            avatar: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
            verified: true
          },
          content: {
            image: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
            video_url: null,
            caption: '🌟 FEATURED OPPORTUNITY 🌟\n\nExchange program to Tokyo University now open! Experience world-class education in Japan while immersing yourself in a rich cultural environment.\n\n✅ Full scholarship available\n✅ Housing provided\n✅ Language support included\n\nDeadline: February 28, 2025\n\n#StudyAbroad #TokyoUniversity #ExchangeProgram #GlobalEducation',
            likes: 6890,
            comments: 234,
            shares: 456,
            timeAgo: '1 day ago'
          },
          type: 'opportunity'
        }
      ];

      // Filter mock posts to only include saved ones
      const savedPostIds = savedPostsData.map(sp => sp.post_id);
      const filteredPosts = mockPosts
        .filter(post => savedPostIds.includes(post.id))
        .map(post => {
          const savedData = savedPostsData.find(sp => sp.post_id === post.id);
          return {
            ...post,
            saved_at: savedData?.created_at || new Date().toISOString()
          };
        });

      setSavedPosts(filteredPosts);
    } catch (err) {
      console.error('Error fetching saved posts:', err);
      setError('Failed to load saved posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeSavedPost = async (postId: string) => {
    try {
      setRemovingPostId(postId);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to manage saved posts.');
        return;
      }

      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', postId);

      if (error) {
        console.error('Error removing saved post:', error);
        Alert.alert('Error', 'Failed to remove saved post. Please try again.');
        return;
      }

      // Remove from local state
      setSavedPosts(prev => prev.filter(post => post.id !== postId));
      Alert.alert('Success', 'Post removed from saved items');
    } catch (error) {
      console.error('Error removing saved post:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setRemovingPostId(null);
    }
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
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Saved Posts</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading your saved posts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Saved Posts</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchSavedPosts}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Saved Posts</Text>
        <View style={styles.headerRight}>
          <Text style={styles.savedCount}>{savedPosts.length} saved</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {savedPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Bookmark size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No saved posts yet</Text>
            <Text style={styles.emptyText}>
              Posts you save will appear here. Tap the bookmark icon on any post to save it for later.
            </Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.exploreButtonText}>Explore Posts</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.postsContainer}>
            {savedPosts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                {/* Post Header */}
                <View style={styles.postHeader}>
                  <View style={styles.userInfo}>
                    <Image source={{ uri: post.user.avatar }} style={styles.userAvatar} />
                    <View style={styles.userDetails}>
                      <View style={styles.userNameRow}>
                        <Text style={styles.userName}>{post.user.name}</Text>
                        {post.user.verified && (
                          <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedText}>✓</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.timeAgo}>Saved {getTimeAgo(post.saved_at)}</Text>
                    </View>
                  </View>
                  <View style={styles.postActions}>
                    <TouchableOpacity
                      style={[styles.removeButton, removingPostId === post.id && styles.removingButton]}
                      onPress={() => removeSavedPost(post.id)}
                      disabled={removingPostId === post.id}
                    >
                      {removingPostId === post.id ? (
                        <ActivityIndicator size="small" color="#EF4444" />
                      ) : (
                        <Trash2 size={20} color="#EF4444" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.moreButton}>
                      <MoreHorizontal size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Post Content */}
                {post.content.video_url ? (
                  <View style={styles.videoContainer}>
                    <Video
                      source={{ uri: post.content.video_url }}
                      style={styles.postVideo}
                      useNativeControls
                      resizeMode={ResizeMode.CONTAIN}
                      shouldPlay={false}
                      isLooping={false}
                    />
                  </View>
                ) : (
                  <Image source={{ uri: post.content.image }} style={styles.postImage} />
                )}

                {/* Post Actions */}
                <View style={styles.postActionsRow}>
                  <View style={styles.leftActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Heart size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <MessageCircle size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Share size={24} color="#1F2937" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.savedIndicator}>
                    <Bookmark size={24} color="#3B82F6" fill="#3B82F6" />
                  </TouchableOpacity>
                </View>

                {/* Post Stats */}
                <View style={styles.postStats}>
                  <Text style={styles.likesText}>
                    {post.content.likes.toLocaleString()} likes
                  </Text>
                  <Text style={styles.commentsText}>
                    {post.content.comments} comments
                  </Text>
                </View>

                {/* Post Caption */}
                <View style={styles.captionContainer}>
                  <Text style={styles.caption}>
                    <Text style={styles.captionUsername}>{post.user.name}</Text>
                    {' '}{post.content.caption}
                  </Text>
                </View>

                {/* Original Post Time */}
                <View style={styles.originalTimeContainer}>
                  <Text style={styles.originalTimeText}>
                    Originally posted {post.content.timeAgo}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
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
    justifyContent: 'space-between',
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
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  savedCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  exploreButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  postsContainer: {
    paddingTop: 16,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginHorizontal: 16,
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
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  verifiedBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  timeAgo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  removingButton: {
    opacity: 0.6,
  },
  moreButton: {
    padding: 8,
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  videoContainer: {
    position: 'relative',
  },
  postVideo: {
    width: '100%',
    height: 300,
  },
  postActionsRow: {
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
    // No additional styles needed
  },
  savedIndicator: {
    // No additional styles needed
  },
  postStats: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    gap: 16,
  },
  likesText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  commentsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  captionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    lineHeight: 20,
  },
  captionUsername: {
    fontFamily: 'Inter-SemiBold',
  },
  originalTimeContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  originalTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});