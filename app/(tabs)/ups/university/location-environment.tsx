import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  DollarSign, 
  Shield, 
  Car, 
  Cloud, 
  Leaf, 
  Building, 
  Heart, 
  Phone, 
  ExternalLink, 
  Globe, 
  Info, 
  Calendar, 
  Clock, 
  Star, 
  TrendingUp, 
  TriangleAlert as AlertTriangle, 
  CircleCheck as CheckCircle, 
  Navigation, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Umbrella, 
  TreePine, 
  Factory, 
  ShoppingBag, 
  Utensils, 
  Film, 
  Music, 
  Camera, 
  Palette, 
  BookOpen, 
  GraduationCap, 
  Target, 
  Award, 
  Briefcase, 
  Chrome as Home, 
  Wifi, 
  Zap, 
  Fuel, 
  Bus, 
  Plane, 
  Brain as Train, 
  Bike 
} from 'lucide-react-native';

interface CulturalAttraction {
  name: string;
  type: string;
  description: string;
  location: string;
  significance: string;
  visiting_hours: string;
  admission_fee: string;
}

interface TransportationOption {
  type: string;
  options: Array<{
    name: string;
    description: string;
    cost: string;
    coverage: string;
    frequency: string;
  }>;
}

interface EntertainmentVenue {
  name: string;
  type: string;
  location: string;
  description: string;
  events: string[];
  student_programs: boolean;
  contact: string;
}

interface HealthcareFacility {
  name: string;
  type: string;
  location: string;
  description: string;
  services: string[];
  distance_from_campus: string;
  student_services: boolean;
  insurance_accepted: string[];
  emergency_contact: string;
}

interface ShoppingDiningVenue {
  name: string;
  type: string;
  location: string;
  description: string;
  features: string[];
  student_friendly: boolean;
  price_range: string;
}

interface UniversityLocationEnvironment {
  id: string;
  university_id: string;
  city_town_profile: string;
  population_demographics: string;
  economic_profile: string;
  cultural_attractions: CulturalAttraction[];
  safety_security: string;
  crime_statistics: string;
  emergency_services: string;
  transportation_options: TransportationOption[];
  public_transport: string;
  accessibility_features: string;
  weather_climate: string;
  seasonal_variations: string;
  natural_environment: string;
  pollution_levels: string;
  cost_of_living: string;
  shopping_dining: Array<{
    category: string;
    venues: ShoppingDiningVenue[];
  }>;
  entertainment_venues: EntertainmentVenue[];
  healthcare_facilities: HealthcareFacility[];
  created_at: string;
}

interface University {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
}

export default function LocationEnvironmentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [locationData, setLocationData] = useState<UniversityLocationEnvironment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  useEffect(() => {
    fetchLocationEnvironmentData();
  }, [id]);

  const fetchLocationEnvironmentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching location data for university ID:', id);
      
      // Fetch university basic information
      const { data: universityData, error: universityError } = await supabase
        .from('universities')
        .select('*')
        .eq('id', id)
        .single();

      console.log('University data:', universityData);
      console.log('University error:', universityError);

      if (universityError) {
        throw universityError;
      }

      if (!universityData) {
        throw new Error('University not found');
      }

      setUniversity(universityData);

      // Fetch location and environment data
      const { data: locationData, error: locationError } = await supabase
        .from('university_location_environment')
        .select('*')
        .eq('university_id', id)
        .maybeSingle();

      console.log('Location data:', locationData);
        // Set the fetched data or use mock data if none exists
        if (locationData && locationData.length > 0) {
          setLocationEnvironmentData(locationData[0]);
        } else {
          // Use mock data when no data exists in database
          setLocationEnvironmentData(mockLocationEnvironmentData);
        }

      if (locationError) {
        console.error('Error fetching location data:', locationError);
        // Generate sample data if no data exists
        generateSampleLocationData(universityData);
      } else if (!locationData) {
        // Generate sample data if no data exists
        generateSampleLocationData(universityData);
      } else {
        setLocationData(locationData);
      }
    } catch (err) {
      console.error('Error fetching location environment data:', err);
      setError('Failed to load location and environment information. Please try again.');
      // Set mock data even on error to prevent map undefined errors
      setLocationEnvironmentData(mockLocationEnvironmentData);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleLocationData = (universityInfo: University) => {
    const sampleLocationData: UniversityLocationEnvironment = {
      id: `location-${universityInfo.id}`,
      university_id: universityInfo.id,
      city_town_profile: `${universityInfo.location} is a vibrant city that offers an excellent environment for students. The city combines modern amenities with rich cultural heritage, providing students with diverse opportunities for learning, recreation, and personal growth.`,
      population_demographics: 'The city has a diverse population with a significant student community. The demographic mix includes young professionals, families, and a growing international community, creating a dynamic and multicultural environment.',
      economic_profile: 'The local economy is driven by education, technology, and service sectors. The presence of the university contributes significantly to the local economy, with numerous businesses catering to student needs and providing employment opportunities.',
      cultural_attractions: [
        {
          name: 'City Cultural Center',
          type: 'Cultural Center',
          description: 'A hub for arts, culture, and community events',
          location: 'Downtown area',
          significance: 'Important cultural landmark showcasing local heritage',
          visiting_hours: '9:00 AM - 6:00 PM',
          admission_fee: 'Free for students'
        },
        {
          name: 'Historical Museum',
          type: 'Museum',
          description: 'Showcases the rich history and heritage of the region',
          location: 'City center',
          significance: 'Preserves and displays local historical artifacts',
          visiting_hours: '10:00 AM - 5:00 PM',
          admission_fee: 'GHS 10 (Students: GHS 5)'
        },
        {
          name: 'Art Gallery',
          type: 'Gallery',
          description: 'Features contemporary and traditional art exhibitions',
          location: 'Arts district',
          significance: 'Promotes local and international artists',
          visiting_hours: '11:00 AM - 7:00 PM',
          admission_fee: 'Free entry'
        }
      ],
      safety_security: 'The area around the university is generally safe for students. The local authorities maintain regular patrols, and the university works closely with local law enforcement to ensure student safety. Students are advised to take normal precautions, especially when traveling at night.',
      crime_statistics: 'Crime rates in the university area are below the national average. Most incidents are minor theft or petty crimes. Violent crime is rare, and the university has implemented comprehensive security measures to protect students.',
      emergency_services: 'Emergency services are readily available with quick response times. The city has well-equipped hospitals, fire stations, and police stations within close proximity to the university campus.',
      transportation_options: [
        {
          type: 'Public Transportation',
          options: [
            {
              name: 'City Bus Service',
              description: 'Regular bus service connecting campus to major city areas',
              cost: 'GHS 2-5 per trip',
              coverage: 'Citywide coverage',
              frequency: 'Every 15-30 minutes'
            },
            {
              name: 'Trotro (Shared Taxi)',
              description: 'Local shared transportation system',
              cost: 'GHS 1-3 per trip',
              coverage: 'Local routes',
              frequency: 'Very frequent'
            }
          ]
        },
        {
          type: 'Private Transportation',
          options: [
            {
              name: 'Taxi Services',
              description: 'Licensed taxi services available 24/7',
              cost: 'GHS 10-30 per trip',
              coverage: 'Citywide',
              frequency: 'On-demand'
            },
            {
              name: 'Ride-sharing Apps',
              description: 'Uber and Bolt services available',
              cost: 'GHS 8-25 per trip',
              coverage: 'Major areas',
              frequency: 'On-demand'
            }
          ]
        }
      ],
      public_transport: 'The city has a well-developed public transportation system with buses, shared taxis (trotro), and ride-sharing services. Students can easily access all parts of the city using affordable public transport options.',
      accessibility_features: 'The city is working to improve accessibility with ramps, accessible public transport, and designated parking spaces. Many newer buildings and facilities are designed with accessibility in mind.',
      weather_climate: 'The city enjoys a tropical climate with warm temperatures year-round. There are two main seasons: wet season (April-October) and dry season (November-March). Average temperatures range from 24°C to 32°C.',
      seasonal_variations: 'Wet season brings heavy rainfall and higher humidity, while the dry season is characterized by lower humidity and occasional harmattan winds from the north. Students should prepare for both seasons.',
      natural_environment: 'The city is surrounded by lush greenery with several parks and natural reserves nearby. The environment is generally clean with ongoing efforts to maintain green spaces and reduce pollution.',
      pollution_levels: 'Air quality is generally good, though traffic congestion in peak hours can temporarily affect air quality in busy areas. The university area maintains better air quality due to green spaces.',
      cost_of_living: 'The cost of living is moderate and student-friendly. Accommodation, food, and transportation are affordable compared to major metropolitan areas. Students can live comfortably on a reasonable budget.',
      shopping_dining: [
        {
          category: 'Shopping Centers',
          venues: [
            {
              name: 'University Mall',
              type: 'Shopping Mall',
              location: 'Near campus',
              description: 'Modern shopping center with various stores and services',
              features: ['Clothing stores', 'Electronics', 'Bookstore', 'Food court'],
              student_friendly: true,
              price_range: 'Medium'
            },
            {
              name: 'Local Market',
              type: 'Traditional Market',
              location: 'City center',
              description: 'Traditional market with fresh produce and local goods',
              features: ['Fresh fruits', 'Vegetables', 'Local crafts', 'Affordable prices'],
              student_friendly: true,
              price_range: 'Low'
            }
          ]
        },
        {
          category: 'Restaurants & Cafes',
          venues: [
            {
              name: 'Campus Cafe',
              type: 'Cafe',
              location: 'On campus',
              description: 'Popular student hangout with affordable meals',
              features: ['Free WiFi', 'Study spaces', 'Local cuisine', 'Quick service'],
              student_friendly: true,
              price_range: 'Low'
            },
            {
              name: 'City Restaurant',
              type: 'Restaurant',
              location: 'Downtown',
              description: 'Family restaurant serving traditional and international cuisine',
              features: ['Traditional dishes', 'International menu', 'Group dining', 'Takeaway'],
              student_friendly: true,
              price_range: 'Medium'
            }
          ]
        }
      ],
      entertainment_venues: [
        {
          name: 'Student Recreation Center',
          type: 'Recreation Center',
          location: 'Near campus',
          description: 'Entertainment and recreation facility for students',
          events: ['Movie nights', 'Game tournaments', 'Social events', 'Cultural shows'],
          student_programs: true,
          contact: 'recreation@university.edu'
        },
        {
          name: 'City Cinema',
          type: 'Cinema',
          location: 'City center',
          description: 'Modern cinema showing latest movies',
          events: ['Latest movies', 'Student discounts', 'Special screenings'],
          student_programs: true,
          contact: 'info@citycinema.com'
        }
      ],
      healthcare_facilities: [
        {
          name: 'University Health Center',
          type: 'Health Center',
          location: 'On campus',
          description: 'Primary healthcare facility for students',
          services: ['General consultation', 'Emergency care', 'Mental health support', 'Pharmacy'],
          distance_from_campus: '0 km (On campus)',
          student_services: true,
          insurance_accepted: ['NHIS', 'Student insurance', 'Private insurance'],
          emergency_contact: '+233 123 456 789'
        },
        {
          name: 'City General Hospital',
          type: 'General Hospital',
          location: 'City center',
          description: 'Main hospital serving the city and surrounding areas',
          services: ['Emergency care', 'Specialist consultations', 'Surgery', 'Diagnostic services'],
          distance_from_campus: '5 km from campus',
          student_services: true,
          insurance_accepted: ['NHIS', 'Private insurance', 'International insurance'],
          emergency_contact: '+233 987 654 321'
        }
      ],
      created_at: new Date().toISOString()
    };

    setLocationData(sampleLocationData);
  };

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const openExternalLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const callPhone = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const sendEmail = (email: string, subject: string) => {
    if (email) {
      Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
    }
  };

  const getSafetyColor = (text: string) => {
    if (text.toLowerCase().includes('safe') || text.toLowerCase().includes('low crime')) {
      return '#10B981';
    }
    if (text.toLowerCase().includes('moderate') || text.toLowerCase().includes('caution')) {
      return '#F59E0B';
    }
    if (text.toLowerCase().includes('high crime') || text.toLowerCase().includes('dangerous')) {
      return '#EF4444';
    }
    return '#6B7280';
  };

  const getCostColor = (priceRange: string) => {
    switch (priceRange.toLowerCase()) {
      case 'very low':
      case 'free to low':
        return '#10B981';
      case 'low':
      case 'low to medium':
        return '#84CC16';
      case 'medium':
        return '#F59E0B';
      case 'medium to high':
        return '#EF4444';
      case 'high':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  const getTransportIcon = (transportType: string) => {
    if (transportType.toLowerCase().includes('bus') || transportType.toLowerCase().includes('trotro')) {
      return Bus;
    }
    if (transportType.toLowerCase().includes('taxi') || transportType.toLowerCase().includes('uber')) {
      return Car;
    }
    if (transportType.toLowerCase().includes('bike') || transportType.toLowerCase().includes('bicycle')) {
      return Bike;
    }
    if (transportType.toLowerCase().includes('train')) {
      return Train;
    }
    if (transportType.toLowerCase().includes('plane') || transportType.toLowerCase().includes('airport')) {
      return Plane;
    }
    return Navigation;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading location and environment information...</Text>
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

  if (!locationData) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.programName}>Location & Environment</Text>
              <Text style={styles.universityName}>{university.name}</Text>
            </View>
          </View>

          <View style={styles.noDataContainer}>
            <MapPin size={48} color="#9CA3AF" />
            <Text style={styles.noDataTitle}>Location Information Not Available</Text>
            <Text style={styles.noDataText}>
              Detailed location and environment information for {university.name} is not currently available in our database.
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
            <Text style={styles.programName}>Location & Environment</Text>
            <Text style={styles.universityName}>{university.name}</Text>
          </View>
        </View>

        {/* City Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Building size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>City Profile</Text>
          </View>
          <Text style={styles.sectionContent}>{locationData.city_town_profile}</Text>
        </View>

        {/* Demographics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Population & Demographics</Text>
          </View>
          <Text style={styles.sectionContent}>{locationData.population_demographics}</Text>
        </View>

        {/* Economic Profile */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={24} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Economic Profile</Text>
          </View>
          <Text style={styles.sectionContent}>{locationData.economic_profile}</Text>
        </View>

        {/* Weather & Climate */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Cloud size={24} color="#06B6D4" />
            <Text style={styles.sectionTitle}>Weather & Climate</Text>
          </View>
          
          <View style={styles.weatherGrid}>
            <View style={styles.weatherCard}>
              <Thermometer size={20} color="#EF4444" />
              <Text style={styles.weatherLabel}>Temperature</Text>
              <Text style={styles.weatherValue}>24°C - 32°C</Text>
            </View>
            <View style={styles.weatherCard}>
              <Droplets size={20} color="#3B82F6" />
              <Text style={styles.weatherLabel}>Humidity</Text>
              <Text style={styles.weatherValue}>High (70-85%)</Text>
            </View>
            <View style={styles.weatherCard}>
              <Wind size={20} color="#10B981" />
              <Text style={styles.weatherLabel}>Climate</Text>
              <Text style={styles.weatherValue}>Tropical Savanna</Text>
            </View>
          </View>

          <Text style={styles.sectionContent}>{locationData.weather_climate}</Text>
          
          <View style={styles.seasonalSection}>
            <Text style={styles.seasonalTitle}>Seasonal Variations</Text>
            <Text style={styles.seasonalText}>{locationData.seasonal_variations}</Text>
          </View>
        </View>

        {/* Safety & Security */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>Safety & Security</Text>
          </View>
          
          <View style={styles.safetyOverview}>
            <Text style={[styles.safetyStatus, { color: getSafetyColor(locationData.safety_security) }]}>
              Generally Safe for Students
            </Text>
            <Text style={styles.sectionContent}>{locationData.safety_security}</Text>
          </View>

          <View style={styles.crimeStatsSection}>
            <Text style={styles.crimeStatsTitle}>Crime Statistics</Text>
            <Text style={styles.crimeStatsText}>{locationData.crime_statistics}</Text>
          </View>

          <View style={styles.emergencySection}>
            <Text style={styles.emergencyTitle}>Emergency Services</Text>
            <Text style={styles.emergencyText}>{locationData.emergency_services}</Text>
            
            <View style={styles.emergencyNumbers}>
              <Text style={styles.emergencyNumbersTitle}>Emergency Numbers:</Text>
              <View style={styles.emergencyNumbersList}>
                <View style={styles.emergencyNumber}>
                  <Phone size={16} color="#EF4444" />
                  <Text style={styles.emergencyNumberText}>Police: 191</Text>
                </View>
                <View style={styles.emergencyNumber}>
                  <Phone size={16} color="#EF4444" />
                  <Text style={styles.emergencyNumberText}>Fire Service: 192</Text>
                </View>
                <View style={styles.emergencyNumber}>
                  <Phone size={16} color="#EF4444" />
                  <Text style={styles.emergencyNumberText}>Ambulance: 193</Text>
                </View>
                <View style={styles.emergencyNumber}>
                  <Phone size={16} color="#EF4444" />
                  <Text style={styles.emergencyNumberText}>Emergency Hotline: 999</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Transportation */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Car size={24} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Transportation Options</Text>
          </View>
          
          <Text style={styles.sectionContent}>{locationData.public_transport}</Text>

          {locationData.transportation_options.map((transportCategory, index) => (
            <View key={index} style={styles.transportCategory}>
              <Text style={styles.transportCategoryTitle}>{transportCategory.type}</Text>
              <View style={styles.transportOptionsList}>
                {transportCategory.options.map((option, optionIndex) => (
                  <View key={optionIndex} style={styles.transportOptionCard}>
                    <View style={styles.transportOptionHeader}>
                      <View style={styles.transportIcon}>
                        {React.createElement(getTransportIcon(option.name), { size: 20, color: '#F59E0B' })}
                      </View>
                      <Text style={styles.transportOptionName}>{option.name}</Text>
                      <Text style={styles.transportCost}>{option.cost}</Text>
                    </View>
                    <Text style={styles.transportDescription}>{option.description}</Text>
                    <View style={styles.transportDetails}>
                      <View style={styles.transportDetail}>
                        <MapPin size={14} color="#6B7280" />
                        <Text style={styles.transportDetailText}>Coverage: {option.coverage}</Text>
                      </View>
                      <View style={styles.transportDetail}>
                        <Clock size={14} color="#6B7280" />
                        <Text style={styles.transportDetailText}>Frequency: {option.frequency}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <View style={styles.accessibilitySection}>
            <Text style={styles.accessibilityTitle}>Accessibility Features</Text>
            <Text style={styles.accessibilityText}>{locationData.accessibility_features}</Text>
          </View>
        </View>

        {/* Cultural Attractions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Palette size={24} color="#EC4899" />
            <Text style={styles.sectionTitle}>Cultural Attractions</Text>
          </View>
          
          <View style={styles.attractionsList}>
            {locationData.cultural_attractions.map((attraction, index) => (
              <View key={index} style={styles.attractionCard}>
                <View style={styles.attractionHeader}>
                  <Text style={styles.attractionName}>{attraction.name}</Text>
                  <View style={styles.attractionTypeBadge}>
                    <Text style={styles.attractionTypeText}>{attraction.type}</Text>
                  </View>
                </View>
                
                <Text style={styles.attractionDescription}>{attraction.description}</Text>
                
                <View style={styles.attractionDetails}>
                  <View style={styles.attractionDetail}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.attractionDetailText}>{attraction.location}</Text>
                  </View>
                  <View style={styles.attractionDetail}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.attractionDetailText}>{attraction.visiting_hours}</Text>
                  </View>
                  <View style={styles.attractionDetail}>
                    <DollarSign size={14} color="#6B7280" />
                    <Text style={styles.attractionDetailText}>{attraction.admission_fee}</Text>
                  </View>
                </View>

                <View style={styles.significanceSection}>
                  <Text style={styles.significanceTitle}>Significance:</Text>
                  <Text style={styles.significanceText}>{attraction.significance}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Entertainment Venues */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Film size={24} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Entertainment & Cultural Venues</Text>
          </View>
          
          <View style={styles.venuesList}>
            {locationData.entertainment_venues.map((venue, index) => (
              <View key={index} style={styles.venueCard}>
                <View style={styles.venueHeader}>
                  <Text style={styles.venueName}>{venue.name}</Text>
                  {venue.student_programs && (
                    <View style={styles.studentFriendlyBadge}>
                      <GraduationCap size={12} color="#10B981" />
                      <Text style={styles.studentFriendlyText}>Student Programs</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.venueDescription}>{venue.description}</Text>
                
                <View style={styles.venueDetails}>
                  <View style={styles.venueDetail}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.venueDetailText}>{venue.location}</Text>
                  </View>
                  <View style={styles.venueDetail}>
                    <Building size={14} color="#6B7280" />
                    <Text style={styles.venueDetailText}>{venue.type}</Text>
                  </View>
                </View>

                <View style={styles.eventsSection}>
                  <Text style={styles.eventsTitle}>Events & Programs:</Text>
                  <View style={styles.eventsList}>
                    {venue.events.map((event, eventIndex) => (
                      <View key={eventIndex} style={styles.eventTag}>
                        <Text style={styles.eventText}>{event}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.contactVenueButton}
                  onPress={() => sendEmail(venue.contact, `Inquiry about ${venue.name}`)}
                >
                  <ExternalLink size={16} color="#8B5CF6" />
                  <Text style={styles.contactVenueText}>Contact Venue</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Shopping & Dining */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ShoppingBag size={24} color="#F97316" />
            <Text style={styles.sectionTitle}>Shopping & Dining</Text>
          </View>
          
          {locationData.shopping_dining.map((category, categoryIndex) => (
            <View key={categoryIndex} style={styles.shoppingCategory}>
              <Text style={styles.shoppingCategoryTitle}>{category.category}</Text>
              <View style={styles.venuesList}>
                {category.venues.map((venue, venueIndex) => (
                  <View key={venueIndex} style={styles.shoppingVenueCard}>
                    <View style={styles.shoppingVenueHeader}>
                      <Text style={styles.shoppingVenueName}>{venue.name}</Text>
                      <View style={styles.priceRangeBadge}>
                        <DollarSign size={12} color={getCostColor(venue.price_range)} />
                        <Text style={[styles.priceRangeText, { color: getCostColor(venue.price_range) }]}>
                          {venue.price_range}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.shoppingVenueDescription}>{venue.description}</Text>
                    
                    <View style={styles.venueDetails}>
                      <View style={styles.venueDetail}>
                        <MapPin size={14} color="#6B7280" />
                        <Text style={styles.venueDetailText}>{venue.location}</Text>
                      </View>
                      <View style={styles.venueDetail}>
                        <Building size={14} color="#6B7280" />
                        <Text style={styles.venueDetailText}>{venue.type}</Text>
                      </View>
                    </View>

                    <View style={styles.featuresSection}>
                      <Text style={styles.featuresTitle}>Features:</Text>
                      <View style={styles.featuresList}>
                        {venue.features.map((feature, featureIndex) => (
                          <View key={featureIndex} style={styles.featureTag}>
                            <Text style={styles.featureText}>{feature}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {venue.student_friendly && (
                      <View style={styles.studentFriendlySection}>
                        <CheckCircle size={16} color="#10B981" />
                        <Text style={styles.studentFriendlyLabel}>Student Friendly</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Healthcare Facilities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>Healthcare Facilities</Text>
          </View>
          
          <View style={styles.healthcareList}>
            {locationData.healthcare_facilities.map((facility, index) => (
              <View key={index} style={styles.healthcareCard}>
                <View style={styles.healthcareHeader}>
                  <Text style={styles.healthcareName}>{facility.name}</Text>
                  <View style={styles.healthcareTypeBadge}>
                    <Text style={styles.healthcareTypeText}>{facility.type}</Text>
                  </View>
                </View>
                
                <Text style={styles.healthcareDescription}>{facility.description}</Text>
                
                <View style={styles.healthcareDetails}>
                  <View style={styles.healthcareDetail}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.healthcareDetailText}>{facility.location}</Text>
                  </View>
                  <View style={styles.healthcareDetail}>
                    <Navigation size={14} color="#6B7280" />
                    <Text style={styles.healthcareDetailText}>Distance: {facility.distance_from_campus}</Text>
                  </View>
                </View>

                <View style={styles.servicesSection}>
                  <Text style={styles.servicesTitle}>Services:</Text>
                  <View style={styles.servicesList}>
                    {facility.services.map((service, serviceIndex) => (
                      <View key={serviceIndex} style={styles.serviceItem}>
                        <CheckCircle size={12} color="#10B981" />
                        <Text style={styles.serviceText}>{service}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.insuranceSection}>
                  <Text style={styles.insuranceTitle}>Insurance Accepted:</Text>
                  <View style={styles.insuranceList}>
                    {facility.insurance_accepted.map((insurance, insuranceIndex) => (
                      <View key={insuranceIndex} style={styles.insuranceTag}>
                        <Text style={styles.insuranceText}>{insurance}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {facility.student_services && (
                  <View style={styles.studentServicesSection}>
                    <CheckCircle size={16} color="#10B981" />
                    <Text style={styles.studentServicesText}>Student Services Available</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.emergencyContactButton}
                  onPress={() => callPhone(facility.emergency_contact)}
                >
                  <Phone size={16} color="#FFFFFF" />
                  <Text style={styles.emergencyContactText}>Emergency: {facility.emergency_contact}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Environment & Nature */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Leaf size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Natural Environment</Text>
          </View>
          
          <Text style={styles.sectionContent}>{locationData.natural_environment}</Text>
          
          <View style={styles.environmentalFactors}>
            <View style={styles.environmentalCard}>
              <Factory size={20} color="#6B7280" />
              <Text style={styles.environmentalTitle}>Air Quality</Text>
              <Text style={styles.environmentalText}>{locationData.pollution_levels}</Text>
            </View>
          </View>
        </View>

        {/* Cost of Living */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <DollarSign size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Cost of Living</Text>
          </View>
          
          <View style={styles.costOverview}>
            <Text style={styles.costTitle}>Student Budget Guide</Text>
            <Text style={styles.sectionContent}>{locationData.cost_of_living}</Text>
          </View>

          <View style={styles.budgetBreakdown}>
            <Text style={styles.budgetTitle}>Typical Monthly Student Budget:</Text>
            <View style={styles.budgetItems}>
              <View style={styles.budgetItem}>
                <Home size={16} color="#3B82F6" />
                <Text style={styles.budgetLabel}>Accommodation</Text>
                <Text style={styles.budgetAmount}>GHS 300-800</Text>
              </View>
              <View style={styles.budgetItem}>
                <Utensils size={16} color="#10B981" />
                <Text style={styles.budgetLabel}>Food</Text>
                <Text style={styles.budgetAmount}>GHS 200-400</Text>
              </View>
              <View style={styles.budgetItem}>
                <Car size={16} color="#F59E0B" />
                <Text style={styles.budgetLabel}>Transportation</Text>
                <Text style={styles.budgetAmount}>GHS 50-150</Text>
              </View>
              <View style={styles.budgetItem}>
                <BookOpen size={16} color="#8B5CF6" />
                <Text style={styles.budgetLabel}>Books & Supplies</Text>
                <Text style={styles.budgetAmount}>GHS 100-200</Text>
              </View>
              <View style={styles.budgetItem}>
                <Users size={16} color="#EC4899" />
                <Text style={styles.budgetLabel}>Entertainment</Text>
                <Text style={styles.budgetAmount}>GHS 100-300</Text>
              </View>
            </View>
          </View>
        </View>

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
  weatherGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  weatherCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  weatherLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  weatherValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
  },
  seasonalSection: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#06B6D4',
  },
  seasonalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0891B2',
    marginBottom: 8,
  },
  seasonalText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0E7490',
    lineHeight: 20,
  },
  safetyOverview: {
    marginBottom: 16,
  },
  safetyStatus: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    textAlign: 'center',
  },
  crimeStatsSection: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  crimeStatsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#15803D',
    marginBottom: 8,
  },
  crimeStatsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#166534',
    lineHeight: 20,
  },
  emergencySection: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  emergencyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#991B1B',
    lineHeight: 20,
    marginBottom: 16,
  },
  emergencyNumbers: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },
  emergencyNumbersTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginBottom: 8,
  },
  emergencyNumbersList: {
    gap: 6,
  },
  emergencyNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyNumberText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#991B1B',
  },
  transportCategory: {
    marginBottom: 20,
  },
  transportCategoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  transportOptionsList: {
    gap: 12,
  },
  transportOptionCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  transportOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  transportIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F59E0B15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transportOptionName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  transportCost: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  transportDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  transportDetails: {
    gap: 6,
  },
  transportDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transportDetailText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  accessibilitySection: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  accessibilityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  accessibilityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E3A8A',
    lineHeight: 20,
  },
  attractionsList: {
    gap: 16,
  },
  attractionCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  attractionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  attractionName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  attractionTypeBadge: {
    backgroundColor: '#EC489915',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  attractionTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#EC4899',
  },
  attractionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  attractionDetails: {
    gap: 6,
    marginBottom: 12,
  },
  attractionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attractionDetailText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  significanceSection: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
  },
  significanceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 4,
  },
  significanceText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 18,
  },
  venuesList: {
    gap: 16,
  },
  venueCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  venueName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  studentFriendlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  studentFriendlyText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  venueDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  venueDetails: {
    gap: 6,
    marginBottom: 12,
  },
  venueDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  venueDetailText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  eventsSection: {
    marginBottom: 12,
  },
  eventsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  eventsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  eventTag: {
    backgroundColor: '#8B5CF615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  contactVenueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF615',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  contactVenueText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
  },
  shoppingCategory: {
    marginBottom: 24,
  },
  shoppingCategoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  shoppingVenueCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  shoppingVenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shoppingVenueName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  priceRangeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  priceRangeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  shoppingVenueDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  featuresSection: {
    marginBottom: 12,
  },
  featuresTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featureTag: {
    backgroundColor: '#F9731615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#F97316',
  },
  studentFriendlySection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  studentFriendlyLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#15803D',
  },
  healthcareList: {
    gap: 16,
  },
  healthcareCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  healthcareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthcareName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  healthcareTypeBadge: {
    backgroundColor: '#EF444415',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  healthcareTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  healthcareDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  healthcareDetails: {
    gap: 6,
    marginBottom: 12,
  },
  healthcareDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  healthcareDetailText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  servicesSection: {
    marginBottom: 12,
  },
  servicesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  servicesList: {
    gap: 4,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  insuranceSection: {
    marginBottom: 12,
  },
  insuranceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  insuranceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  insuranceTag: {
    backgroundColor: '#3B82F615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  insuranceText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  studentServicesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  studentServicesText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#15803D',
  },
  emergencyContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  emergencyContactText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  environmentalFactors: {
    marginTop: 16,
  },
  environmentalCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  environmentalTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 6,
  },
  environmentalText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 18,
  },
  costOverview: {
    marginBottom: 20,
  },
  costTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginBottom: 12,
    textAlign: 'center',
  },
  budgetBreakdown: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  budgetTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#15803D',
    marginBottom: 12,
  },
  budgetItems: {
    gap: 8,
  },
  budgetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 12,
  },
  budgetLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    flex: 1,
  },
  budgetAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#15803D',
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