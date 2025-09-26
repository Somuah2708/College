import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  Users, 
  Award, 
  Calendar, 
  Music, 
  Heart, 
  Globe,
  Info,
  ExternalLink,
  Building,
  Lightbulb,
  Star,
  CircleCheck as CheckCircle
} from 'lucide-react-native';

interface StudentLifeData {
  id: string;
  university_id: string;
  clubs_societies: any[];
  student_unions: any[];
  events_traditions: any[];
  cultural_activities: any[];
  community_engagement: any[];
  volunteer_opportunities: any[];
  leadership_programs: any[];
  mentorship_programs: any[];
  peer_support_systems: string;
  diversity_inclusion: string;
  international_student_support: string;
  orientation_programs: string;
  graduation_ceremonies: string;
  alumni_events: string;
  campus_traditions: string;
  student_publications: any[];
  radio_tv_stations: any[];
  social_media_presence: any[];
  created_at: string;
}

interface University {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
}

export default function StudentLifeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [studentLifeData, setStudentLifeData] = useState<StudentLifeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentLifeData();
  }, [id]);

  const fetchStudentLifeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch university basic information
      const { data: universityData, error: universityError } = await supabase
        .from('universities')
        .select('*')
        .eq('id', id)
        .single();

      if (universityError) {
        console.error('University fetch error:', universityError);
        throw universityError;
      }

      if (!universityData) {
        throw new Error('University not found');
      }

      setUniversity(universityData);

      // Fetch student life data
      const { data: studentLifeData, error: studentLifeError } = await supabase
        .from('university_student_life')
        .select('*')
        .eq('university_id', id)
        .maybeSingle();

      if (studentLifeError) {
        console.error('Student life fetch error:', studentLifeError);
        setStudentLifeData(null);
      } else {
        console.log('Student life data fetched:', studentLifeData);
        setStudentLifeData(studentLifeData);
      }
    } catch (err) {
      console.error('Error in fetchStudentLifeData:', err);
      setError('Failed to load student life information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openExternalLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderClubsAndSocieties = () => {
    const clubs = studentLifeData?.clubs_societies || [];
    
    if (clubs.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Users size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No clubs and societies information available</Text>
        </View>
      );
    }

    return (
      <View style={styles.clubsList}>
        {clubs.map((club: any, index: number) => (
          <View key={`club-${index}`} style={styles.clubCard}>
            <Text style={styles.clubName}>{club.name || `Club ${index + 1}`}</Text>
            <Text style={styles.clubDescription}>{club.description || 'No description available'}</Text>
            
            {club.activities && Array.isArray(club.activities) && (
              <View style={styles.activitiesList}>
                <Text style={styles.activitiesTitle}>Activities:</Text>
                {club.activities.map((activity: string, actIndex: number) => (
                  <View key={`activity-${index}-${actIndex}`} style={styles.activityItem}>
                    <CheckCircle size={12} color="#10B981" />
                    <Text style={styles.activityText}>{activity}</Text>
                  </View>
                ))}
              </View>
            )}

            {club.contact_info && (
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Contact:</Text>
                <Text style={styles.contactText}>{club.contact_info}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderEvents = () => {
    const events = studentLifeData?.events_traditions || [];
    
    if (events.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Calendar size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No events and traditions information available</Text>
        </View>
      );
    }

    return (
      <View style={styles.eventsList}>
        {events.map((event: any, index: number) => (
          <View key={`event-${index}`} style={styles.eventCard}>
            <Text style={styles.eventName}>{event.name || `Event ${index + 1}`}</Text>
            <Text style={styles.eventDescription}>{event.description || 'No description available'}</Text>
            
            {event.frequency && (
              <View style={styles.eventDetail}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.eventDetailText}>Frequency: {event.frequency}</Text>
              </View>
            )}

            {event.participants && (
              <View style={styles.eventDetail}>
                <Users size={16} color="#6B7280" />
                <Text style={styles.eventDetailText}>Participants: {event.participants}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderCulturalActivities = () => {
    const activities = studentLifeData?.cultural_activities || [];
    
    if (activities.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Music size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No cultural activities information available</Text>
        </View>
      );
    }

    return (
      <View style={styles.activitiesList}>
        {activities.map((activity: any, index: number) => (
          <View key={`cultural-${index}`} style={styles.activityCard}>
            <Text style={styles.activityName}>{activity.name || `Cultural Activity ${index + 1}`}</Text>
            <Text style={styles.activityDescription}>{activity.description || 'No description available'}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderStudentPublications = () => {
    const publications = studentLifeData?.student_publications || [];
    
    if (publications.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Award size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No student publications information available</Text>
        </View>
      );
    }

    return (
      <View style={styles.publicationsList}>
        {publications.map((publication: any, index: number) => (
          <View key={`publication-${index}`} style={styles.publicationCard}>
            <Text style={styles.publicationName}>{publication.name || `Publication ${index + 1}`}</Text>
            <Text style={styles.publicationDescription}>{publication.description || 'No description available'}</Text>
            
            {publication.website && (
              <TouchableOpacity
                style={styles.publicationLink}
                onPress={() => openExternalLink(publication.website)}
              >
                <ExternalLink size={14} color="#3B82F6" />
                <Text style={styles.publicationLinkText}>Visit Website</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading student life information...</Text>
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

  if (!studentLifeData) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.programName}>Student Life</Text>
              <Text style={styles.universityName}>{university.name}</Text>
            </View>
          </View>

          <View style={styles.noDataContainer}>
            <Users size={48} color="#9CA3AF" />
            <Text style={styles.noDataTitle}>Student Life Information Not Available</Text>
            <Text style={styles.noDataText}>
              Detailed student life information for {university.name} is not currently available in our database.
            </Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => openExternalLink(university.website)}
            >
              <Globe size={16} color="#3B82F6" />
              <Text style={styles.contactButtonText}>Visit University Website</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
          <View style={styles.headerInfo}>
            <Text style={styles.programName}>Student Life</Text>
            <Text style={styles.universityName}>{university.name}</Text>
          </View>
        </View>

        {/* Clubs & Societies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Clubs & Societies</Text>
          </View>
          {renderClubsAndSocieties()}
        </View>

        {/* Events & Traditions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Events & Traditions</Text>
          </View>
          {renderEvents()}
        </View>

        {/* Cultural Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Music size={24} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Cultural Activities</Text>
          </View>
          {renderCulturalActivities()}
        </View>

        {/* Student Publications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Award size={24} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Student Publications</Text>
          </View>
          {renderStudentPublications()}
        </View>

        {/* Support Systems */}
        {studentLifeData.peer_support_systems && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heart size={24} color="#EF4444" />
              <Text style={styles.sectionTitle}>Peer Support Systems</Text>
            </View>
            <Text style={styles.sectionContent}>{studentLifeData.peer_support_systems}</Text>
          </View>
        )}

        {/* Diversity & Inclusion */}
        {studentLifeData.diversity_inclusion && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Star size={24} color="#EC4899" />
              <Text style={styles.sectionTitle}>Diversity & Inclusion</Text>
            </View>
            <Text style={styles.sectionContent}>{studentLifeData.diversity_inclusion}</Text>
          </View>
        )}

        {/* International Student Support */}
        {studentLifeData.international_student_support && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={24} color="#06B6D4" />
              <Text style={styles.sectionTitle}>International Student Support</Text>
            </View>
            <Text style={styles.sectionContent}>{studentLifeData.international_student_support}</Text>
          </View>
        )}

        {/* Orientation Programs */}
        {studentLifeData.orientation_programs && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Lightbulb size={24} color="#84CC16" />
              <Text style={styles.sectionTitle}>Orientation Programs</Text>
            </View>
            <Text style={styles.sectionContent}>{studentLifeData.orientation_programs}</Text>
          </View>
        )}

        {/* Campus Traditions */}
        {studentLifeData.campus_traditions && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Award size={24} color="#F97316" />
              <Text style={styles.sectionTitle}>Campus Traditions</Text>
            </View>
            <Text style={styles.sectionContent}>{studentLifeData.campus_traditions}</Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionButtons}>
          {university.website && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => openExternalLink(university.website)}
            >
              <Globe size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>University Website</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push(`/ups/university-detail?id=${university.id}`)}
          >
            <Info size={20} color="#3B82F6" />
            <Text style={styles.secondaryButtonText}>University Overview</Text>
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
  headerInfo: {
    flex: 1,
  },
  programName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  universityName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noDataTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 12,
  },
  sectionContent: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  clubsList: {
    gap: 16,
  },
  clubCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  clubName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  clubDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  activitiesList: {
    marginBottom: 12,
  },
  activitiesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  activityText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
  },
  contactInfo: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
  },
  contactLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#1E40AF',
  },
  eventsList: {
    gap: 16,
  },
  eventCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  eventDetailText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  activityCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  activityName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  publicationsList: {
    gap: 16,
  },
  publicationCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  publicationName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  publicationDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  publicationLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  publicationLinkText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
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