import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Chrome as Home, DollarSign, MapPin, Users, Wifi, Car, Shield, Utensils, ExternalLink, Globe, Building, Bed, Bath, Zap, Phone, Mail, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Info, FileText, ChevronRight } from 'lucide-react-native';

interface AccommodationData {
  id: string;
  university_id: string;
  on_campus_hostels: any[];
  off_campus_housing: any[];
  accommodation_costs: any;
  amenities_included: any[];
  room_types: any[];
  allocation_process: string;
  application_deadlines: any;
  housing_policies: string;
  meal_plans: any[];
  utilities_included: string;
  internet_access: string;
  laundry_facilities: string;
  study_spaces: string;
  social_areas: string;
  security_measures: string;
  guest_policies: string;
  maintenance_services: string;
  housing_support_staff: string;
  created_at: string;
}

interface University {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
}

export default function AccommodationHousingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [accommodationData, setAccommodationData] = useState<AccommodationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccommodationData();
  }, [id]);

  const fetchAccommodationData = async () => {
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

      // Fetch accommodation data from Supabase
      const { data: accommodationData, error: accommodationError } = await supabase
        .from('university_accommodation')
        .select('*')
        .eq('university_id', id)
        .limit(1);

      if (accommodationError) {
        console.error('Accommodation fetch error:', accommodationError);
        setAccommodationData(null);
      } else {
        console.log('Accommodation data fetched:', accommodationData);
        setAccommodationData(accommodationData?.[0] || null);
      }
    } catch (err) {
      console.error('Error in fetchAccommodationData:', err);
      setError('Failed to load accommodation information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openExternalLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderOnCampusHostels = () => {
    if (!accommodationData?.on_campus_hostels || accommodationData.on_campus_hostels.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Building size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No on-campus hostel information available</Text>
        </View>
      );
    }

    return (
      <View style={styles.hostelsList}>
        {accommodationData.on_campus_hostels.map((hostel: any, index: number) => (
          <TouchableOpacity 
            key={index} 
            style={styles.hostelCard}
            onPress={() => router.push(`/ups/university/accommodation-detail?universityId=${university.id}&accommodationId=hostel-${index}&accommodationType=on_campus`)}
          >
            <Text style={styles.hostelName}>{hostel.name || `Hostel ${index + 1}`}</Text>
            {hostel.description && (
              <Text style={styles.hostelDescription}>{hostel.description}</Text>
            )}
            <View style={styles.hostelDetails}>
              {hostel.capacity && (
                <View style={styles.detailRow}>
                  <Users size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Capacity: {hostel.capacity}</Text>
                </View>
              )}
              {hostel.room_types && (
                <View style={styles.detailRow}>
                  <Bed size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Room Types: {hostel.room_types}</Text>
                </View>
              )}
              {hostel.cost_per_semester && (
                <View style={styles.detailRow}>
                  <DollarSign size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Cost: {hostel.cost_per_semester}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderOffCampusHousing = () => {
    if (!accommodationData?.off_campus_housing || accommodationData.off_campus_housing.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Home size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No off-campus housing information available</Text>
        </View>
      );
    }

    return (
      <View style={styles.housingList}>
        {accommodationData.off_campus_housing.map((housing: any, index: number) => (
          <TouchableOpacity 
            key={index} 
            style={styles.housingCard}
            onPress={() => router.push(`/ups/university/accommodation-detail?universityId=${university.id}&accommodationId=housing-${index}&accommodationType=off_campus`)}
          >
            <Text style={styles.housingName}>{housing.name || `Housing Option ${index + 1}`}</Text>
            {housing.description && (
              <Text style={styles.housingDescription}>{housing.description}</Text>
            )}
            <View style={styles.housingDetails}>
              {housing.location && (
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Location: {housing.location}</Text>
                </View>
              )}
              {housing.price_range && (
                <View style={styles.detailRow}>
                  <DollarSign size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Price Range: {housing.price_range}</Text>
                </View>
              )}
              {housing.distance_to_campus && (
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Distance: {housing.distance_to_campus}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderAccommodationCosts = () => {
    if (!accommodationData?.accommodation_costs || Object.keys(accommodationData.accommodation_costs).length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <DollarSign size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No cost information available</Text>
        </View>
      );
    }

    return (
      <View style={styles.costsList}>
        {Object.entries(accommodationData.accommodation_costs).map(([category, cost]) => (
          <View key={category} style={styles.costItem}>
            <Text style={styles.costCategory}>{category.replace('_', ' ').toUpperCase()}</Text>
            <Text style={styles.costValue}>
              {typeof cost === 'object' && cost !== null && 'per_semester' in cost 
                ? String((cost as any).per_semester)
                : String(cost)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderRoomTypes = () => {
    if (!accommodationData?.room_types || accommodationData.room_types.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Bed size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No room type information available</Text>
        </View>
      );
    }

    return (
      <View style={styles.roomTypesList}>
        {accommodationData.room_types.map((roomType: any, index: number) => (
          <TouchableOpacity 
            key={index} 
            style={styles.roomTypeCard}
            onPress={() => router.push(`/ups/university/accommodation-detail?universityId=${university.id}&accommodationId=room-${index}&accommodationType=room_type`)}
          >
            <Text style={styles.roomTypeName}>{roomType.type || `Room Type ${index + 1}`}</Text>
            {roomType.description && (
              <Text style={styles.roomTypeDescription}>{roomType.description}</Text>
            )}
            <View style={styles.roomTypeDetails}>
              {roomType.occupancy && (
                <View style={styles.detailRow}>
                  <Users size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Occupancy: {roomType.occupancy}</Text>
                </View>
              )}
              {roomType.facilities && (
                <View style={styles.detailRow}>
                  <Home size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Facilities: {roomType.facilities}</Text>
                </View>
              )}
              {roomType.cost && (
                <View style={styles.detailRow}>
                  <DollarSign size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Cost: {roomType.cost}</Text>
                </View>
              )}
            </View>
            <View style={styles.viewDetailsContainer}>
              <ChevronRight size={16} color="#3B82F6" />
              <Text style={styles.viewDetailsText}>View Details</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMealPlans = () => {
    if (!accommodationData?.meal_plans || accommodationData.meal_plans.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Utensils size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No meal plan information available</Text>
        </View>
      );
    }

    return (
      <View style={styles.mealPlansList}>
        {accommodationData.meal_plans.map((plan: any, index: number) => (
          <View key={index} style={styles.mealPlanCard}>
            <Text style={styles.mealPlanName}>{plan.name || `Meal Plan ${index + 1}`}</Text>
            {plan.description && (
              <Text style={styles.mealPlanDescription}>{plan.description}</Text>
            )}
            <View style={styles.mealPlanDetails}>
              {plan.cost && (
                <View style={styles.detailRow}>
                  <DollarSign size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Cost: {plan.cost}</Text>
                </View>
              )}
              {plan.meals_per_day && (
                <View style={styles.detailRow}>
                  <Utensils size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Meals: {plan.meals_per_day} per day</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderAmenities = () => {
    if (!accommodationData?.amenities_included || accommodationData.amenities_included.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Home size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No amenities information available</Text>
        </View>
      );
    }

    return (
      <View style={styles.amenitiesList}>
        {accommodationData.amenities_included.map((amenity: any, index: number) => (
          <View key={index} style={styles.amenityItem}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.amenityText}>
              {typeof amenity === 'string' ? amenity : amenity.name || `Amenity ${index + 1}`}
            </Text>
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
          <Text style={styles.loadingText}>Loading accommodation information...</Text>
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

  if (!accommodationData) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.programName}>Accommodation & Housing</Text>
              <Text style={styles.universityName}>{university.name}</Text>
            </View>
          </View>

          <View style={styles.noDataContainer}>
            <Home size={48} color="#9CA3AF" />
            <Text style={styles.noDataTitle}>Accommodation Information Not Available</Text>
            <Text style={styles.noDataText}>
              Detailed accommodation information for {university.name} is not currently available in our database.
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
            <Text style={styles.programName}>Accommodation & Housing</Text>
            <Text style={styles.universityName}>{university.name}</Text>
          </View>
        </View>

        {/* On-Campus Hostels */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Building size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>On-Campus Hostels</Text>
          </View>
          {renderOnCampusHostels()}
        </View>

        {/* Off-Campus Housing */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Home size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Off-Campus Housing Options</Text>
          </View>
          {renderOffCampusHousing()}
        </View>

        {/* Accommodation Costs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <DollarSign size={24} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Accommodation Costs</Text>
          </View>
          {renderAccommodationCosts()}
        </View>

        {/* Room Types */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bed size={24} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Room Types Available</Text>
          </View>
          {renderRoomTypes()}
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Amenities Included</Text>
          </View>
          {renderAmenities()}
        </View>

        {/* Meal Plans */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Utensils size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>Meal Plans</Text>
          </View>
          {renderMealPlans()}
        </View>

        {/* Utilities & Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Zap size={24} color="#06B6D4" />
            <Text style={styles.sectionTitle}>Utilities & Services</Text>
          </View>
          <View style={styles.utilitiesContainer}>
            {accommodationData.utilities_included && (
              <View style={styles.utilityItem}>
                <Text style={styles.utilityLabel}>Utilities Included:</Text>
                <Text style={styles.utilityText}>{accommodationData.utilities_included}</Text>
              </View>
            )}
            {accommodationData.internet_access && (
              <View style={styles.utilityItem}>
                <Text style={styles.utilityLabel}>Internet Access:</Text>
                <Text style={styles.utilityText}>{accommodationData.internet_access}</Text>
              </View>
            )}
            {accommodationData.laundry_facilities && (
              <View style={styles.utilityItem}>
                <Text style={styles.utilityLabel}>Laundry Facilities:</Text>
                <Text style={styles.utilityText}>{accommodationData.laundry_facilities}</Text>
              </View>
            )}
            {accommodationData.study_spaces && (
              <View style={styles.utilityItem}>
                <Text style={styles.utilityLabel}>Study Spaces:</Text>
                <Text style={styles.utilityText}>{accommodationData.study_spaces}</Text>
              </View>
            )}
            {accommodationData.social_areas && (
              <View style={styles.utilityItem}>
                <Text style={styles.utilityLabel}>Social Areas:</Text>
                <Text style={styles.utilityText}>{accommodationData.social_areas}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Security & Policies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>Security & Policies</Text>
          </View>
          <View style={styles.policiesContainer}>
            {accommodationData.security_measures && (
              <View style={styles.policyItem}>
                <Text style={styles.policyLabel}>Security Measures:</Text>
                <Text style={styles.policyText}>{accommodationData.security_measures}</Text>
              </View>
            )}
            {accommodationData.guest_policies && (
              <View style={styles.policyItem}>
                <Text style={styles.policyLabel}>Guest Policies:</Text>
                <Text style={styles.policyText}>{accommodationData.guest_policies}</Text>
              </View>
            )}
            {accommodationData.housing_policies && (
              <View style={styles.policyItem}>
                <Text style={styles.policyLabel}>Housing Policies:</Text>
                <Text style={styles.policyText}>{accommodationData.housing_policies}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Application Process */}
        {accommodationData.allocation_process && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText size={24} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Application & Allocation Process</Text>
            </View>
            <Text style={styles.sectionContent}>{accommodationData.allocation_process}</Text>
          </View>
        )}

        {/* Application Deadlines */}
        {accommodationData.application_deadlines && Object.keys(accommodationData.application_deadlines).length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={24} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Application Deadlines</Text>
            </View>
            <View style={styles.deadlinesList}>
              {Object.entries(accommodationData.application_deadlines).map(([category, deadline]) => (
                <View key={category} style={styles.deadlineItem}>
                  <Clock size={16} color="#F59E0B" />
                  <View style={styles.deadlineInfo}>
                    <Text style={styles.deadlineCategory}>{category.replace('_', ' ').toUpperCase()}</Text>
                    <Text style={styles.deadlineDate}>{deadline as string}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Support Services */}
        {accommodationData.housing_support_staff && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={24} color="#EC4899" />
              <Text style={styles.sectionTitle}>Housing Support Services</Text>
            </View>
            <Text style={styles.sectionContent}>{accommodationData.housing_support_staff}</Text>
          </View>
        )}

        {/* Maintenance Services */}
        {accommodationData.maintenance_services && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={24} color="#14B8A6" />
              <Text style={styles.sectionTitle}>Maintenance Services</Text>
            </View>
            <Text style={styles.sectionContent}>{accommodationData.maintenance_services}</Text>
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
  hostelsList: {
    gap: 12,
  },
  hostelCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  hostelName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  hostelDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  hostelDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  housingList: {
    gap: 12,
  },
  housingCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  housingName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  housingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  housingDetails: {
    gap: 6,
  },
  costsList: {
    gap: 8,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  costCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  costValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  roomTypesList: {
    gap: 12,
  },
  roomTypeCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  roomTypeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  roomTypeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  roomTypeDetails: {
    gap: 6,
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  mealPlansList: {
    gap: 12,
  },
  mealPlanCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mealPlanName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  mealPlanDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  mealPlanDetails: {
    gap: 6,
  },
  amenitiesList: {
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amenityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
  },
  utilitiesContainer: {
    gap: 12,
  },
  utilityItem: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  utilityLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  utilityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  policiesContainer: {
    gap: 12,
  },
  policyItem: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  policyLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  policyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  deadlinesList: {
    gap: 12,
  },
  deadlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  deadlineInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deadlineCategory: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 2,
  },
  deadlineDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#78350F',
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