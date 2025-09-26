import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, DollarSign, Calendar, Users, Award, ListFilter as Filter } from 'lucide-react-native';

export default function ScholarshipsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const scholarships = [
    {
      title: 'Merit Excellence Scholarship',
      provider: 'National Education Foundation',
      amount: '$25,000',
      deadline: 'March 15, 2025',
      applicants: '5,000+',
      type: 'Merit-based',
      requirements: 'GPA 3.8+, Leadership experience',
      color: '#3B82F6',
    },
    {
      title: 'STEM Innovation Grant',
      provider: 'Technology Advancement Fund',
      amount: '$15,000',
      deadline: 'April 30, 2025',
      applicants: '2,500+',
      type: 'Field-specific',
      requirements: 'STEM major, Research proposal',
      color: '#10B981',
    },
    {
      title: 'Community Impact Award',
      provider: 'Social Change Institute',
      amount: '$10,000',
      deadline: 'May 15, 2025',
      applicants: '3,000+',
      type: 'Service-based',
      requirements: 'Community service, Essay',
      color: '#8B5CF6',
    },
    {
      title: 'First Generation College Grant',
      provider: 'Educational Equity Alliance',
      amount: '$20,000',
      deadline: 'February 28, 2025',
      applicants: '4,000+',
      type: 'Need-based',
      requirements: 'First-gen student, Financial need',
      color: '#F59E0B',
    },
    {
      title: 'Creative Arts Scholarship',
      provider: 'Arts Education Council',
      amount: '$12,000',
      deadline: 'June 1, 2025',
      applicants: '1,800+',
      type: 'Talent-based',
      requirements: 'Portfolio submission, Audition',
      color: '#EF4444',
    },
  ];

  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholarship.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scholarships</Text>
        <Text style={styles.subtitle}>Find funding for your education</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search scholarships..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={16} color="#6B7280" style={{ marginRight: 6 }} />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Merit-based</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Need-based</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredScholarships.map((scholarship, index) => (
          <TouchableOpacity key={index} style={styles.scholarshipCard}>
            <View style={styles.cardHeader}>
              <View style={styles.scholarshipInfo}>
                <Text style={styles.scholarshipTitle}>{scholarship.title}</Text>
                <Text style={styles.provider}>{scholarship.provider}</Text>
              </View>
              <View style={[styles.typeBadge, { backgroundColor: `${scholarship.color}15` }]}>
                <Text style={[styles.typeText, { color: scholarship.color }]}>
                  {scholarship.type}
                </Text>
              </View>
            </View>

            <View style={styles.amountContainer}>
              <DollarSign size={20} color="#10B981" style={{ marginRight: 8 }} />
              <Text style={styles.amount}>{scholarship.amount}</Text>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Calendar size={16} color="#6B7280" style={{ marginRight: 8 }} />
                <Text style={styles.detailText}>Deadline: {scholarship.deadline || 'Not specified'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Users size={16} color="#6B7280" style={{ marginRight: 8 }} />
                <Text style={styles.detailText}>{scholarship.applicants || '0'} applicants</Text>
              </View>
            </View>

            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsLabel}>Requirements:</Text>
              <Text style={styles.requirements}>{scholarship.requirements || 'Requirements not specified'}</Text>
            </View>

            <TouchableOpacity style={[styles.applyButton, { backgroundColor: scholarship.color }]}>
              <Award size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </TouchableOpacity>
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
    marginHorizontal: -4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
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
  scholarshipCard: {
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
  scholarshipInfo: {
    flex: 1,
  },
  scholarshipTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  provider: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  amount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  detailsContainer: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  requirementsContainer: {
    marginBottom: 20,
  },
  requirementsLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  requirements: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});