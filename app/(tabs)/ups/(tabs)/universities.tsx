import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, MapPin, Star, Users, ListFilter as Filter } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface University {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
  created_at: string;
  ranking?: number;
}

export default function UniversitiesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('universities')
        .select('*')
        .order('name'); // We'll sort by ranking in the component since ranking isn't in the DB yet

      if (fetchError) {
        throw fetchError;
      }

      // Add mock rankings for demonstration and sort by ranking
      const universitiesWithRankings = (data || []).map((uni, index) => ({
        ...uni,
        ranking: getUniversityRanking(uni.name)
      })).sort((a, b) => (a.ranking || 999) - (b.ranking || 999));

      setUniversities(universitiesWithRankings);
    } catch (err) {
      console.error('Error fetching universities:', err);
      setError('Failed to load universities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUniversityRanking = (name: string): number => {
    // Mock rankings based on university names - in a real app this would come from the database
    const rankings: { [key: string]: number } = {
      'University of Ghana': 1,
      'Kwame Nkrumah University of Science and Technology': 2,
      'University of Cape Coast': 3,
      'Ashesi University': 4,
      'Ghana Technology University College': 5,
      'University of Education, Winneba': 6,
      'University for Development Studies': 7,
      'University of Mines and Technology': 8,
      'Ghana Institute of Management and Public Administration': 9,
      'Central University': 10,
      'Valley View University': 11,
      'Presbyterian University College': 12,
      'Methodist University College': 13,
      'Wisconsin International University College': 14,
      'Regent University College of Science and Technology': 15
    };
    
    return rankings[name] || 999; // Default high number for unranked universities
  };

  const getRankingColor = (ranking: number): string => {
    if (ranking <= 3) return '#DC2626'; // Top 3 - Red
    if (ranking <= 5) return '#EF4444'; // Top 5 - Light Red
    if (ranking <= 10) return '#F59E0B'; // Top 10 - Orange
    if (ranking <= 20) return '#10B981'; // Top 20 - Green
    return '#6B7280'; // Others - Gray
  };

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (uni.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUniversityCard = ({ item: university, index }: { item: University; index: number }) => (
    <TouchableOpacity 
      style={styles.universityCard}
      onPress={() => router.push(`/ups/university-detail?id=${university.id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.universityInfo}>
          <Text style={styles.universityName}>{university.name}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.location}>{university.location || 'Location not specified'}</Text>
          </View>
        </View>
      </View>

      {university.ranking && (
        <View style={[styles.rankingBadge, { backgroundColor: `${getRankingColor(university.ranking)}15` }]}>
          <Star size={14} color={getRankingColor(university.ranking)} />
          <Text style={[styles.ranking, { color: getRankingColor(university.ranking) }]}>
            #{university.ranking}
          </Text>
        </View>
      )}

      {university.description && (
        <Text style={styles.description} numberOfLines={2}>
          {university.description}
        </Text>
      )}

      {university.website && (
        <View style={styles.websiteContainer}>
          <Text style={styles.websiteText}>Visit Website</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading universities...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUniversities}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Universities</Text>
          <Text style={styles.subtitle}>Discover top universities worldwide</Text>
          
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search universities..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={16} color="#6B7280" />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Ranking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterText}>Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        {filteredUniversities.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              {searchQuery ? 'No universities found matching your search.' : 'No universities available.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredUniversities}
            renderItem={renderUniversityCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  universityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 8,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    marginBottom: 16,
  },
  universityInfo: {
    width: '100%',
  },
  universityName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
    flexWrap: 'wrap',
    minHeight: 40,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
    flexWrap: 'wrap',
  },
  rankingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 4,
  },
  ranking: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
  },
  rankingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  ranking: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  acceptanceRate: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#DC2626',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 'auto',
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
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
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  websiteContainer: {
    alignSelf: 'flex-start',
  },
  websiteText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  row: {
    justifyContent: 'space-between',
  },
  flatListContent: {
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
});