import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Clock, Briefcase, TrendingUp, ListFilter as Filter } from 'lucide-react-native';

export default function ProgramsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const programs = [
    {
      title: 'Computer Science',
      university: 'Stanford University',
      duration: '4 years',
      degree: 'Bachelor of Science',
      employment: '94%',
      salary: '$120,000',
      category: 'Technology',
      color: '#3B82F6',
    },
    {
      title: 'Business Administration',
      university: 'Harvard Business School',
      duration: '4 years',
      degree: 'Bachelor of Business Administration',
      employment: '92%',
      salary: '$85,000',
      category: 'Business',
      color: '#10B981',
    },
    {
      title: 'Biomedical Engineering',
      university: 'Johns Hopkins University',
      duration: '4 years',
      degree: 'Bachelor of Engineering',
      employment: '89%',
      salary: '$95,000',
      category: 'Engineering',
      color: '#8B5CF6',
    },
    {
      title: 'Psychology',
      university: 'University of California, Berkeley',
      duration: '4 years',
      degree: 'Bachelor of Arts',
      employment: '78%',
      salary: '$55,000',
      category: 'Liberal Arts',
      color: '#F59E0B',
    },
    {
      title: 'Data Science',
      university: 'MIT',
      duration: '4 years',
      degree: 'Bachelor of Science',
      employment: '96%',
      salary: '$110,000',
      category: 'Technology',
      color: '#06B6D4',
    },
  ];

  const filteredPrograms = programs.filter(program =>
    program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Programs</Text>
        <Text style={styles.subtitle}>Explore academic programs and career paths</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search programs..."
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
            <Text style={styles.filterText}>Technology</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Business</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredPrograms.map((program, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.programCard}
            onPress={() => router.push(`/ups/program-detail?id=${index + 1}`)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.programInfo}>
                <Text style={styles.programTitle}>{program.title}</Text>
                <Text style={styles.university}>{program.university}</Text>
                <Text style={styles.degree}>{program.degree}</Text>
              </View>
              <View style={[styles.categoryBadge, { backgroundColor: `${program.color}15` }]}>
                <Text style={[styles.categoryText, { color: program.color }]}>
                  {program.category}
                </Text>
              </View>
            </View>

            <View style={styles.programDetails}>
              <View style={styles.detailItem}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.detailText}>{program.duration}</Text>
              </View>
              <View style={styles.detailItem}>
                <Briefcase size={16} color="#6B7280" />
                <Text style={styles.detailText}>{program.employment} employment</Text>
              </View>
              <View style={styles.detailItem}>
                <TrendingUp size={16} color="#6B7280" />
                <Text style={styles.detailText}>{program.salary} avg. salary</Text>
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
  programCard: {
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
  programInfo: {
    flex: 1,
  },
  programTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  university: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginBottom: 4,
  },
  degree: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  programDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});