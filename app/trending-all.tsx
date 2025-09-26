import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Search, TrendingUp, Clock, Eye, Star, ListFilter as Filter, Calendar, Award, Building, GraduationCap, DollarSign, Users, MapPin, Briefcase, Film } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface TrendingItem {
  id: string;
  headline: string;
  summary: string;
  thumbnail: string;
  category: string;
  publishedAt: string;
  readTime: string;
  trending_score: number;
  source: string;
  views: number;
  engagement_rate: number;
  content_type: 'news' | 'video' | 'announcement' | 'update';
}

export default function TrendingAllScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'trending_score' | 'views' | 'recent'>('trending_score');

  const categories = [
    { key: 'all', label: 'All Trending', icon: TrendingUp, color: '#EF4444' },
    { key: 'Universities', label: 'Universities', icon: Building, color: '#3B82F6' },
    { key: 'Programs', label: 'Programs', icon: GraduationCap, color: '#10B981' },
    { key: 'Scholarships', label: 'Scholarships', icon: Award, color: '#F59E0B' },
    { key: 'Accommodation', label: 'Housing', icon: Building, color: '#8B5CF6' },
    { key: 'Events', label: 'Events', icon: Calendar, color: '#EF4444' },
    { key: 'Entertainment', label: 'Entertainment', icon: Film, color: '#EC4899' },
    { key: 'Jobs', label: 'Jobs & Internships', icon: Briefcase, color: '#06B6D4' },
  ];

  useEffect(() => {
    loadTrendingItems();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [searchQuery, selectedCategory, sortBy, trendingItems]);

  const loadTrendingItems = async () => {
    try {
      setLoading(true);
      
      // Generate comprehensive trending items for all categories
      const mockTrendingItems: TrendingItem[] = [
        // Universities
        {
          id: 'trending-uni-1',
          headline: 'University of Ghana Launches New AI Research Center',
          summary: 'State-of-the-art facility will focus on machine learning applications for African challenges',
          thumbnail: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
          category: 'Universities',
          publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          readTime: '3 min read',
          trending_score: 98,
          source: 'University of Ghana',
          views: 45600,
          engagement_rate: 12.5,
          content_type: 'announcement'
        },
        {
          id: 'trending-uni-2',
          headline: 'KNUST Engineering Faculty Wins International Award',
          summary: 'Recognition for outstanding contribution to sustainable engineering education in Africa',
          thumbnail: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
          category: 'Universities',
          publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          readTime: '4 min read',
          trending_score: 94,
          source: 'KNUST',
          views: 38900,
          engagement_rate: 15.2,
          content_type: 'news'
        },
        {
          id: 'trending-uni-3',
          headline: 'Ashesi University Partners with Google for Tech Hub',
          summary: 'New collaboration will establish Google Developer Hub on Ashesi campus',
          thumbnail: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg',
          category: 'Universities',
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          readTime: '2 min read',
          trending_score: 91,
          source: 'Ashesi University',
          views: 32100,
          engagement_rate: 18.7,
          content_type: 'announcement'
        },
        
        // Programs
        {
          id: 'trending-prog-1',
          headline: 'New Cybersecurity Program Launches at UCC',
          summary: 'First-of-its-kind program addresses growing demand for cybersecurity professionals',
          thumbnail: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
          category: 'Programs',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          readTime: '5 min read',
          trending_score: 96,
          source: 'University of Cape Coast',
          views: 41200,
          engagement_rate: 14.8,
          content_type: 'announcement'
        },
        {
          id: 'trending-prog-2',
          headline: 'Medical School Admission Requirements Updated',
          summary: 'New WASSCE requirements and interview process for 2025 medical school applications',
          thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
          category: 'Programs',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          readTime: '6 min read',
          trending_score: 89,
          source: 'Medical Schools Ghana',
          views: 28700,
          engagement_rate: 11.3,
          content_type: 'update'
        },
        
        // Scholarships
        {
          id: 'trending-schol-1',
          headline: 'MasterCard Foundation Announces 1000 New Scholarships',
          summary: 'Largest scholarship program in Africa opens applications for 2025 academic year',
          thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
          category: 'Scholarships',
          publishedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
          readTime: '4 min read',
          trending_score: 99,
          source: 'MasterCard Foundation',
          views: 67800,
          engagement_rate: 22.1,
          content_type: 'announcement'
        },
        {
          id: 'trending-schol-2',
          headline: 'Government Scholarship Deadline Extended',
          summary: 'GETF scholarship application deadline moved to March 31 due to high demand',
          thumbnail: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
          category: 'Scholarships',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          readTime: '2 min read',
          trending_score: 87,
          source: 'Ghana Education Trust Fund',
          views: 23400,
          engagement_rate: 16.9,
          content_type: 'update'
        },
        
        // Accommodation
        {
          id: 'trending-acc-1',
          headline: 'New Student Housing Complex Opens at UG',
          summary: 'Modern 500-bed facility features smart rooms and sustainable design',
          thumbnail: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
          category: 'Accommodation',
          publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
          readTime: '3 min read',
          trending_score: 85,
          source: 'University of Ghana',
          views: 19800,
          engagement_rate: 13.4,
          content_type: 'news'
        },
        
        // Events
        {
          id: 'trending-event-1',
          headline: 'Africa Tech Summit 2025 Registration Open',
          summary: 'Largest technology conference in Africa featuring 200+ speakers and 50+ countries',
          thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
          category: 'Events',
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          readTime: '5 min read',
          trending_score: 92,
          source: 'Africa Tech Summit',
          views: 34500,
          engagement_rate: 19.2,
          content_type: 'announcement'
        },
        
        // Entertainment
        {
          id: 'trending-ent-1',
          headline: 'Netflix Releases "The Pursuit of Knowledge" Documentary',
          summary: 'Inspiring documentary follows African students pursuing higher education dreams',
          thumbnail: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
          category: 'Entertainment',
          publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
          readTime: '3 min read',
          trending_score: 83,
          source: 'Netflix',
          views: 15600,
          engagement_rate: 8.7,
          content_type: 'news'
        },
        
        // Jobs
        {
          id: 'trending-job-1',
          headline: 'Google Africa Opens 500 Graduate Positions',
          summary: 'Massive recruitment drive for software engineers, data scientists, and product managers',
          thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
          category: 'Jobs',
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          readTime: '4 min read',
          trending_score: 95,
          source: 'Google Africa',
          views: 52300,
          engagement_rate: 25.8,
          content_type: 'announcement'
        },
        {
          id: 'trending-job-2',
          headline: 'Microsoft Internship Program Applications Open',
          summary: 'Summer 2025 internship program offers mentorship and potential full-time offers',
          thumbnail: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
          category: 'Jobs',
          publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
          readTime: '3 min read',
          trending_score: 88,
          source: 'Microsoft',
          views: 29100,
          engagement_rate: 17.3,
          content_type: 'announcement'
        }
      ];

      setTrendingItems(mockTrendingItems);
      setFilteredItems(mockTrendingItems);
    } catch (error) {
      console.error('Error loading trending items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortItems = () => {
    let filtered = trendingItems;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'trending_score':
          return b.trending_score - a.trending_score;
        case 'views':
          return b.views - a.views;
        case 'recent':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        default:
          return b.trending_score - a.trending_score;
      }
    });

    setFilteredItems(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrendingItems();
    setRefreshing(false);
  };

  const getTrendingColor = (score: number) => {
    if (score >= 95) return '#EF4444'; // Hot trending
    if (score >= 85) return '#F59E0B'; // Trending
    if (score >= 75) return '#3B82F6'; // Popular
    return '#6B7280'; // Normal
  };

  const getTrendingLabel = (score: number) => {
    if (score >= 95) return 'HOT';
    if (score >= 85) return 'TRENDING';
    if (score >= 75) return 'POPULAR';
    return 'RISING';
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Universities': return Building;
      case 'Programs': return GraduationCap;
      case 'Scholarships': return Award;
      case 'Accommodation': return Building;
      case 'Events': return Calendar;
      case 'Entertainment': return Film;
      case 'Jobs': return Briefcase;
      default: return TrendingUp;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Universities': return '#3B82F6';
      case 'Programs': return '#10B981';
      case 'Scholarships': return '#F59E0B';
      case 'Accommodation': return '#8B5CF6';
      case 'Events': return '#EF4444';
      case 'Entertainment': return '#EC4899';
      case 'Jobs': return '#06B6D4';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
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
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>All Trending</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Discover what's hot in education right now
            </Text>
          </View>
          <View style={styles.trendingIcon}>
            <TrendingUp size={24} color="#EF4444" />
          </View>
        </View>

        {/* Search and Filters */}
        <View style={[styles.searchSection, { backgroundColor: colors.cardBackground }]}>
          <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search trending topics..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.key && styles.activeCategoryButton,
                  { backgroundColor: selectedCategory === category.key ? category.color : colors.inputBackground }
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <category.icon 
                  size={16} 
                  color={selectedCategory === category.key ? '#FFFFFF' : colors.textSecondary} 
                />
                <Text style={[
                  styles.categoryButtonText,
                  { color: selectedCategory === category.key ? '#FFFFFF' : colors.textSecondary }
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.sortContainer}>
            <Text style={[styles.sortLabel, { color: colors.textSecondary }]}>Sort by:</Text>
            <View style={styles.sortButtons}>
              {[
                { key: 'trending_score', label: 'Trending Score' },
                { key: 'views', label: 'Views' },
                { key: 'recent', label: 'Most Recent' }
              ].map((sort) => (
                <TouchableOpacity
                  key={sort.key}
                  style={[
                    styles.sortButton,
                    sortBy === sort.key && styles.activeSortButton,
                    { backgroundColor: sortBy === sort.key ? colors.primary : colors.inputBackground }
                  ]}
                  onPress={() => setSortBy(sort.key as any)}
                >
                  <Text style={[
                    styles.sortButtonText,
                    { color: sortBy === sort.key ? '#FFFFFF' : colors.textSecondary }
                  ]}>
                    {sort.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsCount, { color: colors.text }]}>
            {filteredItems.length} trending {filteredItems.length === 1 ? 'item' : 'items'}
          </Text>
        </View>

        {/* Trending Items List */}
        <View style={styles.trendingList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Loading trending content...
              </Text>
            </View>
          ) : filteredItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <TrendingUp size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No trending items found</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {searchQuery ? 'Try adjusting your search terms' : 'Check back later for trending content'}
              </Text>
            </View>
          ) : (
            filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.trendingCard, { backgroundColor: colors.cardBackground }]}
                onPress={() => router.push({
                  pathname: '/news-detail',
                  params: {
                    id: item.id,
                    headline: item.headline,
                    summary: item.summary,
                    thumbnail: item.thumbnail,
                    category: item.category,
                    publishedAt: item.publishedAt,
                    readTime: item.readTime,
                    trending_score: item.trending_score.toString(),
                    source: item.source
                  }
                })}
              >
                <Image source={{ uri: item.thumbnail }} style={styles.cardImage} />
                
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardMeta}>
                      <View style={[styles.trendingBadge, { backgroundColor: getTrendingColor(item.trending_score) }]}>
                        <Star size={12} color="#FFFFFF" />
                        <Text style={styles.trendingBadgeText}>
                          {getTrendingLabel(item.trending_score)}
                        </Text>
                      </View>
                      
                      <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(item.category)}15` }]}>
                        {React.createElement(getCategoryIcon(item.category), { 
                          size: 12, 
                          color: getCategoryColor(item.category) 
                        })}
                        <Text style={[styles.categoryBadgeText, { color: getCategoryColor(item.category) }]}>
                          {item.category}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.scoreContainer}>
                      <Text style={[styles.trendingScore, { color: getTrendingColor(item.trending_score) }]}>
                        {item.trending_score}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                    {item.headline}
                  </Text>
                  
                  <Text style={[styles.cardSummary, { color: colors.textSecondary }]} numberOfLines={3}>
                    {item.summary}
                  </Text>

                  <View style={styles.cardFooter}>
                    <View style={styles.sourceInfo}>
                      <Text style={[styles.sourceText, { color: colors.primary }]}>{item.source}</Text>
                      <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                        {getTimeAgo(item.publishedAt)}
                      </Text>
                    </View>
                    
                    <View style={styles.engagementStats}>
                      <View style={styles.statItem}>
                        <Eye size={14} color={colors.textSecondary} />
                        <Text style={[styles.statText, { color: colors.textSecondary }]}>
                          {(item.views / 1000).toFixed(1)}K
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Clock size={14} color={colors.textSecondary} />
                        <Text style={[styles.statText, { color: colors.textSecondary }]}>
                          {item.readTime}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
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
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    lineHeight: 22,
  },
  trendingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EF444415',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  categoriesContainer: {
    marginBottom: 16,
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
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sortLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeSortButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sortButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  resultsHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  resultsCount: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  trendingList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  trendingCard: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  cardImage: {
    width: 120,
    height: 120,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendingBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  trendingScore: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 22,
    marginBottom: 6,
  },
  cardSummary: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sourceInfo: {
    flex: 1,
  },
  sourceText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  engagementStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});