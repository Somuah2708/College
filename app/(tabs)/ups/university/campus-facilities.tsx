import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  BookOpen, 
  Monitor, 
  Building, 
  Wifi, 
  Heart, 
  Dumbbell, 
  Coffee,
  Lightbulb,
  Microscope,
  Globe,
  Info,
  ExternalLink,
  MapPin,
  Clock,
  Users,
  Shield,
  Car,
  Utensils,
  CreditCard,
  Mail,
  CircleCheck as CheckCircle
} from 'lucide-react-native';

interface CampusFacilities {
  id: string;
  university_id: string;
  libraries: any[];
  laboratories: any[];
  lecture_halls: any[];
  ict_facilities: string;
  wifi_access: string;
  health_services: any;
  sports_facilities: any[];
  recreation_centers: any[];
  innovation_hubs: any[];
  research_centers: any[];
  special_resources: any[];
  accessibility_features: string;
  security_systems: string;
  parking_facilities: string;
  dining_facilities: any[];
  bookstore_services: string;
  banking_services: string;
  postal_services: string;
  maintenance_standards: string;
  created_at: string;
}

interface University {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
}

export default function CampusFacilitiesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [facilitiesData, setFacilitiesData] = useState<CampusFacilities | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampusFacilities();
  }, [id]);

  const fetchCampusFacilities = async () => {
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

      // Fetch campus facilities data
      const { data: facilitiesData, error: facilitiesError } = await supabase
        .from('university_campus_facilities')
        .select('*')
        .eq('university_id', id)
        .maybeSingle();

      if (facilitiesError) {
        console.error('Campus facilities fetch error:', facilitiesError);
        // Generate mock data if no data exists
        generateMockFacilitiesData();
      } else if (facilitiesData) {
        console.log('Campus facilities data fetched:', facilitiesData);
        setFacilitiesData(facilitiesData);
      } else {
        // Generate mock data if no data exists
        generateMockFacilitiesData();
      }
    } catch (err) {
      console.error('Error in fetchCampusFacilities:', err);
      setError('Failed to load campus facilities information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateMockFacilitiesData = () => {
    const mockData: CampusFacilities = {
      id: 'mock-facilities',
      university_id: id as string,
      libraries: [
        {
          name: 'Main University Library',
          description: 'Central library with over 500,000 books and digital resources',
          capacity: '2,000 students',
          opening_hours: '24/7 during exam periods, 6:00 AM - 12:00 AM regular',
          special_collections: ['Rare books', 'Digital archives', 'Thesis collection'],
          services: ['Research assistance', 'Computer lab', 'Group study rooms', 'Silent study areas']
        },
        {
          name: 'Science & Technology Library',
          description: 'Specialized library for STEM subjects with latest research materials',
          capacity: '800 students',
          opening_hours: '7:00 AM - 11:00 PM',
          special_collections: ['Scientific journals', 'Technical manuals', 'Patent database'],
          services: ['3D printing lab', 'Maker space', 'Technical workshops']
        },
        {
          name: 'Digital Learning Center',
          description: 'Modern facility focused on digital resources and e-learning',
          capacity: '500 students',
          opening_hours: '6:00 AM - 10:00 PM',
          special_collections: ['E-books', 'Online databases', 'Multimedia resources'],
          services: ['Computer training', 'Digital literacy programs', 'Virtual reality lab']
        }
      ],
      laboratories: [
        {
          name: 'Computer Science Lab',
          description: 'State-of-the-art computing facility with latest hardware and software',
          capacity: '60 workstations',
          equipment: ['High-performance computers', 'Dual monitors', 'Development software', 'Network infrastructure'],
          specialization: 'Programming, software development, and system administration'
        },
        {
          name: 'Physics Laboratory',
          description: 'Well-equipped physics lab for experiments and research',
          capacity: '40 students',
          equipment: ['Oscilloscopes', 'Spectrometers', 'Laser equipment', 'Measurement instruments'],
          specialization: 'Experimental physics and materials science'
        },
        {
          name: 'Chemistry Laboratory',
          description: 'Modern chemistry lab with safety equipment and analytical instruments',
          capacity: '50 students',
          equipment: ['Fume hoods', 'Analytical balances', 'Spectrophotometers', 'Safety equipment'],
          specialization: 'Organic, inorganic, and analytical chemistry'
        }
      ],
      lecture_halls: [
        {
          name: 'Great Hall',
          capacity: '1,200 seats',
          features: ['Audio-visual system', 'Air conditioning', 'Wheelchair accessible', 'Recording equipment'],
          usage: 'Major lectures, conferences, and ceremonies'
        },
        {
          name: 'Science Auditorium',
          capacity: '500 seats',
          features: ['Interactive whiteboards', 'Video conferencing', 'Laboratory demonstration area'],
          usage: 'Science lectures and demonstrations'
        },
        {
          name: 'Technology Center',
          capacity: '300 seats',
          features: ['Smart boards', 'Wireless presentation', 'Collaborative learning spaces'],
          usage: 'Technology and engineering courses'
        }
      ],
      ict_facilities: 'Campus-wide fiber optic network, 24/7 IT support, computer labs in every building, free WiFi access, online learning platforms, digital library access, and cloud computing resources.',
      wifi_access: 'Free high-speed WiFi available throughout campus with speeds up to 1 Gbps. Students receive login credentials upon enrollment. Guest access available for visitors.',
      health_services: {
        clinic: 'On-campus medical clinic with qualified nurses and visiting doctors',
        services: ['General consultation', 'Emergency care', 'Mental health counseling', 'Health education'],
        hours: 'Monday-Friday: 8:00 AM - 6:00 PM, Emergency: 24/7',
        insurance: 'Student health insurance available, partnerships with local hospitals'
      },
      sports_facilities: [
        {
          name: 'Sports Complex',
          facilities: ['Football field', 'Basketball courts', 'Tennis courts', 'Swimming pool'],
          description: 'Modern sports complex with international standard facilities'
        },
        {
          name: 'Fitness Center',
          facilities: ['Gym equipment', 'Cardio machines', 'Weight training', 'Group exercise rooms'],
          description: 'Fully equipped fitness center with professional trainers'
        },
        {
          name: 'Athletics Track',
          facilities: ['400m track', 'Field events area', 'Spectator stands'],
          description: 'International standard athletics track for training and competitions'
        }
      ],
      recreation_centers: [
        {
          name: 'Student Recreation Center',
          facilities: ['Game rooms', 'TV lounge', 'Music practice rooms', 'Art studios'],
          description: 'Central hub for student recreational activities and social gatherings'
        },
        {
          name: 'Cultural Center',
          facilities: ['Performance hall', 'Exhibition space', 'Workshop rooms'],
          description: 'Venue for cultural events, performances, and artistic activities'
        }
      ],
      innovation_hubs: [
        {
          name: 'Innovation Lab',
          description: 'Collaborative space for entrepreneurship and innovation projects',
          facilities: ['Co-working spaces', 'Meeting rooms', 'Prototyping equipment', 'Mentorship programs'],
          programs: ['Startup incubator', 'Innovation challenges', 'Entrepreneurship workshops']
        },
        {
          name: 'Maker Space',
          description: 'Hands-on facility for creating and building projects',
          facilities: ['3D printers', 'Laser cutters', 'Electronics lab', 'Woodworking tools'],
          programs: ['DIY workshops', 'Product development', 'Technical training']
        }
      ],
      research_centers: [
        {
          name: 'Advanced Computing Research Center',
          description: 'Leading research facility for computer science and AI',
          focus_areas: ['Artificial Intelligence', 'Machine Learning', 'Cybersecurity', 'Data Science'],
          facilities: ['High-performance computing cluster', 'Research labs', 'Conference rooms']
        },
        {
          name: 'Sustainable Technology Center',
          description: 'Research center focused on environmental technology solutions',
          focus_areas: ['Renewable energy', 'Environmental monitoring', 'Green technology'],
          facilities: ['Environmental testing lab', 'Solar panel testing', 'Research greenhouse']
        }
      ],
      special_resources: [
        {
          name: 'Digital Media Studio',
          description: 'Professional studio for video production and digital content creation',
          equipment: ['Professional cameras', 'Editing suites', 'Sound recording', 'Green screen']
        },
        {
          name: 'Language Learning Center',
          description: 'Facility for foreign language learning and cultural exchange',
          resources: ['Language software', 'Conversation practice rooms', 'Cultural library']
        }
      ],
      accessibility_features: 'Wheelchair accessible buildings, elevators in all multi-story buildings, accessible restrooms, reserved parking spaces, assistive technology in libraries, sign language interpreters available upon request.',
      security_systems: '24/7 security patrol, CCTV monitoring, electronic access control, emergency call boxes, well-lit pathways, visitor registration system, and emergency response protocols.',
      parking_facilities: 'Multiple parking lots with over 2,000 spaces, designated areas for students, faculty, and visitors, motorcycle parking, bicycle racks, and electric vehicle charging stations.',
      dining_facilities: [
        {
          name: 'Main Cafeteria',
          description: 'Large dining hall serving variety of local and international cuisine',
          capacity: '800 diners',
          hours: '6:00 AM - 10:00 PM',
          services: ['Buffet meals', 'À la carte options', 'Vegetarian menu', 'Halal options']
        },
        {
          name: 'Student Union Food Court',
          description: 'Casual dining with multiple food vendors',
          capacity: '400 diners',
          hours: '7:00 AM - 9:00 PM',
          services: ['Fast food', 'Local dishes', 'Snacks', 'Beverages']
        },
        {
          name: 'Faculty Club Restaurant',
          description: 'Upscale dining for faculty, staff, and special events',
          capacity: '150 diners',
          hours: '11:00 AM - 8:00 PM',
          services: ['Fine dining', 'Conference catering', 'Private events']
        }
      ],
      bookstore_services: 'Full-service bookstore with textbooks, stationery, university merchandise, computer accessories, and printing services. Online ordering available with campus delivery.',
      banking_services: 'On-campus ATMs from major banks, mobile banking services, student account opening assistance, and financial literacy workshops.',
      postal_services: 'Campus post office with mail delivery, package services, courier services, and PO Box rentals for students and staff.',
      maintenance_standards: 'Regular maintenance schedules, 24/7 emergency repairs, preventive maintenance programs, and sustainability initiatives including energy-efficient systems.',
      created_at: new Date().toISOString()
    };

    setFacilitiesData(mockData);
  };

  const openExternalLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderLibraries = () => {
    if (!facilitiesData?.libraries || facilitiesData.libraries.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <BookOpen size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No library information available</Text>
        </View>
      );
    }

    return (
      <View style={styles.facilitiesList}>
        {facilitiesData.libraries.map((library: any, index: number) => (
          <View key={`library-${index}`} style={styles.facilityCard}>
            <Text style={styles.facilityName}>{library.name || `Library ${index + 1}`}</Text>
            <Text style={styles.facilityDescription}>{library.description || 'No description available'}</Text>
            
            <View style={styles.facilityDetails}>
              {library.capacity && (
                <View style={styles.detailRow}>
                  <Users size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Capacity: {library.capacity}</Text>
                </View>
              )}
              {library.opening_hours && (
                <View style={styles.detailRow}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Hours: {typeof library.opening_hours === 'object' && library.opening_hours.weekdays && library.opening_hours.weekends ? `Weekdays: ${library.opening_hours.weekdays}, Weekends: ${library.opening_hours.weekends}` : library.opening_hours}</Text>
                </View>
              )}
            </View>

            {library.services && Array.isArray(library.services) && (
              <View style={styles.servicesList}>
                <Text style={styles.servicesTitle}>Services:</Text>
                {library.services.map((service: string, serviceIndex: number) => (
                  <View key={`service-${index}-${serviceIndex}`} style={styles.serviceItem}>
                    <CheckCircle size={12} color="#10B981" />
                    <Text style={styles.serviceText}>{service}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderLaboratories = () => {
    if (!facilitiesData?.laboratories || facilitiesData.laboratories.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Microscope size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No laboratory information available</Text>
        </View>
      );
    }

    return (
      <View style={styles.facilitiesList}>
        {facilitiesData.laboratories.map((lab: any, index: number) => (
          <View key={`lab-${index}`} style={styles.facilityCard}>
            <Text style={styles.facilityName}>{lab.name || `Laboratory ${index + 1}`}</Text>
            <Text style={styles.facilityDescription}>{lab.description || 'No description available'}</Text>
            
            <View style={styles.facilityDetails}>
              {lab.capacity && (
                <View style={styles.detailRow}>
                  <Users size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Capacity: {lab.capacity}</Text>
                </View>
              )}
              {lab.specialization && (
                <View style={styles.detailRow}>
                  <Lightbulb size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Focus: {lab.specialization}</Text>
                </View>
              )}
            </View>

            {lab.equipment && Array.isArray(lab.equipment) && (
              <View style={styles.equipmentList}>
                <Text style={styles.equipmentTitle}>Equipment:</Text>
                {lab.equipment.map((equipment: string, equipIndex: number) => (
                  <View key={`equipment-${index}-${equipIndex}`} style={styles.equipmentItem}>
                    <CheckCircle size={12} color="#8B5CF6" />
                    <Text style={styles.equipmentText}>{equipment}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderSportsFacilities = () => {
    if (!facilitiesData?.sports_facilities || facilitiesData.sports_facilities.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Dumbbell size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No sports facilities information available</Text>
        </View>
      );
    }

    return (
      <View style={styles.facilitiesList}>
        {facilitiesData.sports_facilities.map((facility: any, index: number) => (
          <View key={`sports-${index}`} style={styles.facilityCard}>
            <Text style={styles.facilityName}>{facility.name || `Sports Facility ${index + 1}`}</Text>
            <Text style={styles.facilityDescription}>{facility.description || 'No description available'}</Text>
            
            {facility.facilities && Array.isArray(facility.facilities) && (
              <View style={styles.facilitiesList}>
                <Text style={styles.facilitiesTitle}>Available Facilities:</Text>
                {facility.facilities.map((item: string, itemIndex: number) => (
                  <View key={`facility-${index}-${itemIndex}`} style={styles.facilityItem}>
                    <Dumbbell size={12} color="#F59E0B" />
                    <Text style={styles.facilityItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderDiningFacilities = () => {
    if (!facilitiesData?.dining_facilities || facilitiesData.dining_facilities.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Utensils size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No dining facilities information available</Text>
        </View>
      );
    }

    return (
      <View style={styles.facilitiesList}>
        {facilitiesData.dining_facilities.map((dining: any, index: number) => (
          <View key={`dining-${index}`} style={styles.facilityCard}>
            <Text style={styles.facilityName}>{dining.name || `Dining Facility ${index + 1}`}</Text>
            <Text style={styles.facilityDescription}>{dining.description || 'No description available'}</Text>
            
            <View style={styles.facilityDetails}>
              {dining.capacity && (
                <View style={styles.detailRow}>
                  <Users size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Capacity: {dining.capacity}</Text>
                </View>
              )}
              {dining.hours && (
                <View style={styles.detailRow}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Hours: {typeof dining.hours === 'object' && dining.hours.weekdays && dining.hours.weekends ? `Weekdays: ${dining.hours.weekdays}, Weekends: ${dining.hours.weekends}` : dining.hours}</Text>
                </View>
              )}
            </View>

            {dining.services && Array.isArray(dining.services) && (
              <View style={styles.servicesList}>
                <Text style={styles.servicesTitle}>Services:</Text>
                {dining.services.map((service: string, serviceIndex: number) => (
                  <View key={`dining-service-${index}-${serviceIndex}`} style={styles.serviceItem}>
                    <Utensils size={12} color="#EF4444" />
                    <Text style={styles.serviceText}>{service}</Text>
                  </View>
                ))}
              </View>
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
          <Text style={styles.loadingText}>Loading campus facilities...</Text>
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
          <View style={styles.headerInfo}>
            <Text style={styles.programName}>Campus Facilities</Text>
            <Text style={styles.universityName}>{university.name}</Text>
          </View>
        </View>

        {/* Libraries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Libraries</Text>
          </View>
          {renderLibraries()}
        </View>

        {/* Laboratories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Microscope size={24} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Laboratories</Text>
          </View>
          {renderLaboratories()}
        </View>

        {/* ICT Facilities */}
        {facilitiesData?.ict_facilities && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Monitor size={24} color="#10B981" />
              <Text style={styles.sectionTitle}>ICT Facilities</Text>
            </View>
            <Text style={styles.sectionContent}>{facilitiesData.ict_facilities}</Text>
          </View>
        )}

        {/* WiFi Access */}
        {facilitiesData?.wifi_access && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Wifi size={24} color="#06B6D4" />
              <Text style={styles.sectionTitle}>WiFi Access</Text>
            </View>
            <Text style={styles.sectionContent}>{facilitiesData.wifi_access}</Text>
          </View>
        )}

        {/* Health Services */}
        {facilitiesData?.health_services && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heart size={24} color="#EF4444" />
              <Text style={styles.sectionTitle}>Health Services</Text>
            </View>
            <View style={styles.healthServicesContainer}>
              {facilitiesData.health_services.clinic && (
                <Text style={styles.healthServiceText}>{facilitiesData.health_services.clinic}</Text>
              )}
              {facilitiesData.health_services.services && Array.isArray(facilitiesData.health_services.services) && (
                <View style={styles.servicesList}>
                  <Text style={styles.servicesTitle}>Available Services:</Text>
                  {facilitiesData.health_services.services.map((service: string, index: number) => (
                    <View key={`health-service-${index}`} style={styles.serviceItem}>
                      <Heart size={12} color="#EF4444" />
                      <Text style={styles.serviceText}>{service}</Text>
                    </View>
                  ))}
                </View>
              )}
              {facilitiesData.health_services.hours && (
                <View style={styles.detailRow}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Hours: {typeof facilitiesData.health_services.hours === 'object' && facilitiesData.health_services.hours.weekdays && facilitiesData.health_services.hours.weekends ? `Weekdays: ${facilitiesData.health_services.hours.weekdays}, Weekends: ${facilitiesData.health_services.hours.weekends}` : facilitiesData.health_services.hours}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Sports Facilities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Dumbbell size={24} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Sports Facilities</Text>
          </View>
          {renderSportsFacilities()}
        </View>

        {/* Dining Facilities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Utensils size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>Dining Facilities</Text>
          </View>
          {renderDiningFacilities()}
        </View>

        {/* Security Systems */}
        {facilitiesData?.security_systems && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={24} color="#EF4444" />
              <Text style={styles.sectionTitle}>Security Systems</Text>
            </View>
            <Text style={styles.sectionContent}>{facilitiesData.security_systems}</Text>
          </View>
        )}

        {/* Parking Facilities */}
        {facilitiesData?.parking_facilities && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Car size={24} color="#6B7280" />
              <Text style={styles.sectionTitle}>Parking Facilities</Text>
            </View>
            <Text style={styles.sectionContent}>{facilitiesData.parking_facilities}</Text>
          </View>
        )}

        {/* Additional Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Building size={24} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Additional Services</Text>
          </View>
          <View style={styles.additionalServices}>
            {facilitiesData?.bookstore_services && (
              <View style={styles.serviceCard}>
                <Text style={styles.serviceCardTitle}>Bookstore Services</Text>
                <Text style={styles.serviceCardText}>{facilitiesData.bookstore_services}</Text>
              </View>
            )}
            {facilitiesData?.banking_services && (
              <View style={styles.serviceCard}>
                <Text style={styles.serviceCardTitle}>Banking Services</Text>
                <Text style={styles.serviceCardText}>{facilitiesData.banking_services}</Text>
              </View>
            )}
            {facilitiesData?.postal_services && (
              <View style={styles.serviceCard}>
                <Text style={styles.serviceCardTitle}>Postal Services</Text>
                <Text style={styles.serviceCardText}>{facilitiesData.postal_services}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Accessibility Features */}
        {facilitiesData?.accessibility_features && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heart size={24} color="#10B981" />
              <Text style={styles.sectionTitle}>Accessibility Features</Text>
            </View>
            <Text style={styles.sectionContent}>{facilitiesData.accessibility_features}</Text>
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
  noDataContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  facilitiesList: {
    gap: 16,
  },
  facilityCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  facilityName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  facilityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  facilityDetails: {
    gap: 6,
    marginBottom: 12,
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
  servicesList: {
    marginTop: 8,
  },
  servicesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
  },
  equipmentList: {
    marginTop: 8,
  },
  equipmentTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  equipmentText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
  },
  facilitiesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  facilityItemText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
  },
  healthServicesContainer: {
    gap: 12,
  },
  healthServiceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  additionalServices: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  serviceCardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  serviceCardText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
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