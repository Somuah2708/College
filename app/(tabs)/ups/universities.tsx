import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, MapPin, Star, Users, ListFilter as Filter } from 'lucide-react-native';

export default function UniversitiesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const universities = [
    {
      name: 'Harvard University',
      location: 'Cambridge, MA',
      ranking: 1,
      students: '23,000',
      acceptance: '3.4%',
      type: 'Private',
      image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
    },
    {
      name: 'Stanford University',
      location: 'Stanford, CA',
      ranking: 2,
      students: '17,000',
      acceptance: '4.3%',
      type: 'Private',
      image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
    },
    {
      name: 'MIT',
      location: 'Cambridge, MA',
      ranking: 3,
      students: '11,520',
      acceptance: '7.3%',
      type: 'Private',
      image: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
    },
    {
      name: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      ranking: 4,
      students: '45,000',
      acceptance: '17.5%',
      type: 'Public',
      image: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg',
    },
  ];

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    uni.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredUniversities.map((university, index) => (
          <TouchableOpacity key={index} style={styles.universityCard}>
            <View style={styles.cardHeader}>
              <View style={styles.universityInfo}>
                <Text style={styles.universityName}>{university.name}</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.location}>{university.location}</Text>
                </View>
              </View>
              <View style={styles.rankingBadge}>
                <Star size={16} color="#F59E0B" />
                <Text style={styles.ranking}>#{university.ranking}</Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Users size={16} color="#6B7280" />
                <Text style={styles.statText}>{university.students} students</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.acceptanceRate}>{university.acceptance} acceptance</Text>
              </View>
              <View style={[styles.typeBadge, { backgroundColor: university.type === 'Private' ? '#3B82F615' : '#10B98115' }]}>
                <Text style={[styles.typeText, { color: university.type === 'Private' ? '#3B82F6' : '#10B981' }]}>
                  {university.type}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    padding: 24,
  },
  universityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  universityInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
});