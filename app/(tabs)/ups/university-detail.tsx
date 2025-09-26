import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking } from 'react-native';
import { ArrowLeft, Info, BookOpen, GraduationCap, DollarSign, Award, Building, Chrome as Home, Users, Briefcase, MapPin, Globe, Heart, ChevronRight } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface UniversityDetails {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
}

export default function UniversityDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [university, setUniversity] = useState<UniversityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUniversityDetails();
  }, [id]);

  const fetchUniversityDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('universities')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        throw new Error('University not found');
      }
      
      setUniversity(data);
    } catch (err) {
      console.error('Error fetching university details:', err);
      setError('Failed to load university details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openWebsite = () => {
    if (university?.website) {
      Linking.openURL(university.website);
    } else {
      Alert.alert('Website Not Available', 'No website URL is available for this university.');
    }
  };

  const openLocation = () => {
    if (university?.location) {
      // Create Google Maps URL with the university location
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(university.name + ', ' + university.location)}`;
      Linking.openURL(mapsUrl);
    } else {
      Alert.alert('Location Not Available', 'No location information is available for this university.');
    }
  };

  const leftColumnSections = [
    {
      title: 'Basic Overview',
      icon: Info,
      content: 'University name, location, history, type, accreditation, and rankings',
      color: '#3B82F6',
      route: 'university/basic-overview'
    },
    {
      title: 'Programs & Academics', 
      icon: BookOpen,
      content: 'Faculties, departments, available programs, and academic structure',
      color: '#10B981',
      route: 'university/programs-academics'
    },
    {
      title: 'Admission Requirements',
      icon: GraduationCap,
      content: 'Entry criteria, cut-off points, application procedures, and deadlines',
      color: '#8B5CF6',
      route: 'university/admission-requirements'
    },
    {
      title: 'Tuition & Costs',
      icon: DollarSign,
      content: 'Tuition fees, living expenses, payment plans, and cost breakdowns',
      color: '#F59E0B',
      route: 'university/tuition-costs'
    },
    {
      title: 'Scholarships & Financial Aid',
      icon: Award,
      content: 'Available scholarships, eligibility criteria, and financial support options',
      color: '#EF4444',
      route: 'university/scholarships-aid'
    },
    {
      title: 'Campus Facilities',
      icon: Building,
      content: 'Libraries, labs, ICT facilities, health services, and special resources',
      color: '#06B6D4',
      route: 'university/campus-facilities'
    }
  ];

  const rightColumnSections = [
    {
      title: 'Accommodation & Housing',
      icon: Home,
      content: 'On-campus hostels, off-campus options, costs, and allocation process',
      color: '#84CC16',
      route: 'university/accommodation-housing'
    },
    {
      title: 'Student Life',
      icon: Users,
      content: 'Clubs, societies, events, traditions, and community engagement',
      color: '#EC4899',
      route: 'university/student-life'
    },
    {
      title: 'Career & Alumni',
      icon: Briefcase,
      content: 'Career services, job placement rates, alumni network, and notable graduates',
      color: '#F97316',
      route: 'university/career-alumni'
    },
    {
      title: 'Location & Environment',
      icon: MapPin,
      content: 'City profile, safety, transportation, weather, and local environment',
      color: '#14B8A6',
      route: 'university/location-environment'
    },
    {
      title: 'International Opportunities',
      icon: Globe,
      content: 'Exchange programs, partnerships, study abroad, and global initiatives',
      color: '#6366F1',
      route: 'university/international-opportunities'
    },
    {
      title: 'Support Services',
      icon: Heart,
      content: 'Academic advising, counseling, mental health, and disability services',
      color: '#DC2626',
      route: 'university/support-services'
    }
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading university details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !university) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'University not found'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>University Details</Text>
        </View>

        <View style={styles.sectionsContainer}>
          <View style={styles.column}>
            {leftColumnSections.map((section, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.sectionCard}
                onPress={() => {
                  router.push(`/ups/${section.route}?id=${university.id}`);
                }}
              >
                <View style={[styles.sectionIcon, { backgroundColor: `${section.color}15` }]}>
                  <section.icon size={20} color={section.color} />
                </View>
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionText} numberOfLines={3}>
                    {section.content}
                  </Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.column}>
            {rightColumnSections.map((section, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.sectionCard}
                onPress={() => {
                  router.push(`/ups/${section.route}?id=${university.id}`);
                }}
              >
                <View style={[styles.sectionIcon, { backgroundColor: `${section.color}15` }]}>
                  <section.icon size={20} color={section.color} />
                </View>
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionText} numberOfLines={3}>
                    {section.content}
                  </Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={openWebsite}>
            <Globe size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Visit Website</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={openLocation}>
            <MapPin size={20} color="#3B82F6" />
            <Text style={styles.secondaryButtonText}>View on Maps</Text>
          </TouchableOpacity>
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
  backButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backIcon: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  sectionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 12,
  },
  column: {
    flex: 1,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    minHeight: 100,
  },
  sectionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    flexShrink: 0,
  },
  sectionContent: {
    flex: 1,
    paddingRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 22,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
});