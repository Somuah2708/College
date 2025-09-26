import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Chrome as Home, DollarSign, MapPin, Users, Wifi, Car, Shield, Utensils, ExternalLink, Globe, Building, Bed, Bath, Zap, Phone, Mail, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Info, FileText, Star, Calendar, Camera, Navigation, Heart, BookOpen, Target, Award, Briefcase, TrendingUp, Eye } from 'lucide-react-native';

interface AccommodationDetails {
  id: string;
  name: string;
  type: 'on_campus' | 'off_campus';
  description: string;
  capacity: number;
  room_types: any[];
  cost_per_semester: string;
  cost_per_month: string;
  location: string;
  distance_to_campus: string;
  amenities: string[];
  facilities: string[];
  room_features: string[];
  security_features: string[];
  meal_options: string[];
  application_process: string;
  application_deadline: string;
  contact_info: any;
  photos: string[];
  virtual_tour_url: string;
  reviews: any[];
  occupancy_rate: number;
  satisfaction_rating: number;
  rules_and_regulations: string[];
  maintenance_schedule: string;
  emergency_procedures: string;
  wifi_details: string;
  parking_info: string;
  laundry_details: string;
  study_areas: string;
  social_spaces: string;
  accessibility_features: string[];
  pet_policy: string;
  guest_policy: string;
  payment_options: string[];
  refund_policy: string;
  move_in_process: string;
  move_out_process: string;
  resident_advisor_info: string;
  community_events: string[];
  nearby_amenities: string[];
  transportation_options: string[];
}

interface University {
  id: string;
  name: string;
  location: string;
  website: string;
}

export default function AccommodationDetailScreen() {
  const { universityId, accommodationId, accommodationType } = useLocalSearchParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [accommodation, setAccommodation] = useState<AccommodationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchAccommodationDetails();
  }, [universityId, accommodationId]);

  const fetchAccommodationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch university information
      const { data: universityData, error: universityError } = await supabase
        .from('universities')
        .select('*')
        .eq('id', universityId)
        .single();

      if (universityError) {
        throw universityError;
      }

      setUniversity(universityData);

      // For demo purposes, generate detailed accommodation data
      // In a real app, you would fetch this from a dedicated accommodations table
      
      // Generate accommodation name based on type and ID
      let accommodationName = 'Unknown Accommodation';
      if (accommodationType === 'on_campus') {
        const hostelNames = [
          'Commonwealth Hall',
          'Akuafo Hall', 
          'Legon Hall',
          'Volta Hall',
          'Mensah Sarbah Hall',
          'Alexander Adum Kwapong Hall',
          'Jean Nelson Aka Hall',
          'Elizabeth Frances Sey Hall',
          'Hilla Limann Hall',
          'International Students Hostel'
        ];
        const hostelIndex = parseInt((accommodationId as string).replace('hostel-', '')) || 0;
        accommodationName = hostelNames[hostelIndex] || `Hostel ${hostelIndex + 1}`;
      } else if (accommodationType === 'off_campus') {
        const housingNames = [
          'University Heights Apartments',
          'Campus View Residences',
          'Student Village Complex',
          'Academic Gardens',
          'Scholars Court',
          'Education City Apartments',
          'Knowledge Park Residences',
          'Learning Lodge',
          'Study Haven Apartments',
          'Campus Edge Housing'
        ];
        const housingIndex = parseInt((accommodationId as string).replace('housing-', '')) || 0;
        accommodationName = housingNames[housingIndex] || `Housing ${housingIndex + 1}`;
      } else if (accommodationType === 'room_type') {
        const roomTypeNames = [
          'Single Standard Room',
          'Double Shared Room',
          'Premium Suite',
          'Executive Single',
          'Family Apartment',
          'Studio Apartment',
          'Deluxe Double',
          'Economy Single',
          'Graduate Suite',
          'International Student Room'
        ];
        const roomIndex = parseInt((accommodationId as string).replace('room-', '')) || 0;
        accommodationName = roomTypeNames[roomIndex] || `Room Type ${roomIndex + 1}`;
      }

      const mockAccommodation: AccommodationDetails = {
        id: accommodationId as string,
        name: accommodationName,
        type: accommodationType as 'on_campus' | 'off_campus',
        description: accommodationType === 'on_campus' 
          ? 'Commonwealth Hall is one of the premier on-campus residential facilities, offering modern amenities and a vibrant community atmosphere for students. Built in 2018, it features state-of-the-art facilities and sustainable design elements.'
          : 'University Heights Apartments offers comfortable off-campus living with easy access to campus. These modern apartments provide independence while maintaining proximity to university facilities and student life.',
        capacity: accommodationType === 'on_campus' ? 450 : 200,
        room_types: [
          {
            type: 'Single Room',
            description: 'Private room with shared bathroom facilities',
            occupancy: 1,
            size: '12 sqm',
            cost: accommodationType === 'on_campus' ? 'GHS 2,500/semester' : 'GHS 1,800/month',
            features: ['Single bed', 'Study desk', 'Wardrobe', 'Window view']
          },
          {
            type: 'Double Room',
            description: 'Shared room with two beds and private bathroom',
            occupancy: 2,
            size: '18 sqm',
            cost: accommodationType === 'on_campus' ? 'GHS 2,000/semester' : 'GHS 1,400/month',
            features: ['Two single beds', 'Two study desks', 'Shared wardrobe', 'Private bathroom']
          },
          {
            type: 'Suite',
            description: 'Premium accommodation with living area and private bathroom',
            occupancy: accommodationType === 'on_campus' ? 4 : 2,
            size: '35 sqm',
            cost: accommodationType === 'on_campus' ? 'GHS 3,200/semester' : 'GHS 2,500/month',
            features: ['Living area', 'Kitchenette', 'Private bathroom', 'Balcony']
          }
        ],
        cost_per_semester: accommodationType === 'on_campus' ? 'GHS 2,000 - 3,200' : 'N/A',
        cost_per_month: accommodationType === 'off_campus' ? 'GHS 1,400 - 2,500' : 'N/A',
        location: accommodationType === 'on_campus' ? 'Central Campus, Block A' : '2.5km from Main Campus',
        distance_to_campus: accommodationType === 'on_campus' ? 'On Campus' : '2.5km (8 minutes by car)',
        amenities: [
          'High-speed WiFi',
          '24/7 Security',
          'Laundry facilities',
          'Common study areas',
          'Recreation room',
          'Gym access',
          'Parking spaces',
          'Cafeteria/Kitchen',
          'Medical clinic nearby',
          'Postal services'
        ],
        facilities: [
          'Modern elevator access',
          'Air conditioning',
          'Backup power supply',
          'Water filtration system',
          'Fire safety systems',
          'CCTV surveillance',
          'Electronic key card access',
          'Maintenance workshop',
          'Storage facilities',
          'Bicycle parking'
        ],
        room_features: [
          'Comfortable mattresses',
          'Study desk with lamp',
          'Built-in wardrobes',
          'Ceiling fans',
          'Power outlets',
          'Ethernet ports',
          'Window blinds',
          'Mirror',
          'Waste bins',
          'Notice board'
        ],
        security_features: [
          '24/7 security guards',
          'CCTV monitoring',
          'Electronic access cards',
          'Visitor registration system',
          'Emergency call buttons',
          'Well-lit pathways',
          'Secure entry points',
          'Night patrol services',
          'Emergency evacuation plans',
          'Fire detection systems'
        ],
        meal_options: accommodationType === 'on_campus' ? [
          'Full meal plan (3 meals/day)',
          'Partial meal plan (2 meals/day)',
          'Breakfast only plan',
          'Weekend meal plan',
          'Pay-per-meal option'
        ] : [
          'Shared kitchen facilities',
          'Nearby restaurants',
          'Food delivery services',
          'Local market access',
          'Cooking equipment provided'
        ],
        application_process: 'Online application through university portal, submit required documents, pay application fee, await allocation confirmation',
        application_deadline: '2025-06-30',
        contact_info: {
          email: accommodationType === 'on_campus' ? 'housing@university.edu.gh' : 'offcampus@university.edu.gh',
          phone: '+233 123 456 789',
          office: 'Student Housing Office, Administration Block',
          office_hours: 'Monday - Friday: 8:00 AM - 5:00 PM',
          emergency_contact: '+233 987 654 321'
        },
        photos: [
          'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
          'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
          'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
          'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg',
          'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg'
        ],
        virtual_tour_url: `https://virtualtour.university.edu.gh/${accommodationType}/${accommodationId}`,
        reviews: [
          {
            student_name: 'Kwame Asante',
            year: 'Final Year',
            program: 'Computer Science',
            rating: 4.5,
            review: 'Great accommodation with excellent facilities. The study areas are quiet and well-equipped. WiFi is reliable and the security is top-notch.',
            date: '2024-11-15'
          },
          {
            student_name: 'Ama Serwaa',
            year: '3rd Year',
            program: 'Engineering',
            rating: 4.2,
            review: 'Clean and comfortable rooms. The location is perfect for accessing campus facilities. Maintenance team is very responsive.',
            date: '2024-10-28'
          },
          {
            student_name: 'Kofi Mensah',
            year: '2nd Year',
            program: 'Business Administration',
            rating: 4.0,
            review: 'Good value for money. The community atmosphere is great for making friends and studying together.',
            date: '2024-09-12'
          }
        ],
        occupancy_rate: 92,
        satisfaction_rating: 4.3,
        rules_and_regulations: [
          'No smoking in rooms or common areas',
          'Quiet hours: 10:00 PM - 6:00 AM',
          'Visitors must register at reception',
          'No pets allowed (except service animals)',
          'Alcohol consumption prohibited',
          'Maintain cleanliness in shared spaces',
          'Report maintenance issues promptly',
          'Respect other residents\' privacy',
          'Follow fire safety protocols',
          'No unauthorized modifications to rooms'
        ],
        maintenance_schedule: 'Regular maintenance every Tuesday and Thursday. Emergency repairs available 24/7. Deep cleaning monthly.',
        emergency_procedures: 'Emergency exits clearly marked. Fire assembly point at main courtyard. Emergency contact numbers posted in each room.',
        wifi_details: 'High-speed fiber internet (100 Mbps) available in all rooms and common areas. Free access with student credentials.',
        parking_info: accommodationType === 'on_campus' 
          ? 'Limited parking spaces available. Monthly permit required (GHS 50/month). Bicycle parking free.'
          : 'Dedicated parking spaces for each unit. Visitor parking available. No additional fees.',
        laundry_details: 'Coin-operated washing machines and dryers available 24/7. Cost: GHS 5 per wash, GHS 3 per dry cycle.',
        study_areas: 'Quiet study rooms on each floor. 24/7 access with key card. Group study rooms available for booking.',
        social_spaces: 'Common lounge with TV and games. Outdoor terrace with seating. Event hall for community activities.',
        accessibility_features: [
          'Wheelchair accessible entrances',
          'Elevator access to all floors',
          'Accessible bathrooms',
          'Braille signage',
          'Emergency assistance systems',
          'Accessible parking spaces'
        ],
        pet_policy: 'Pets not allowed except for registered service animals. Emotional support animals require documentation.',
        guest_policy: 'Guests allowed until 10:00 PM on weekdays, midnight on weekends. Overnight guests require prior approval.',
        payment_options: [
          'Bank transfer',
          'Mobile money (MTN, Vodafone)',
          'Credit/Debit card',
          'Cash payments at bursar office',
          'Installment plans available'
        ],
        refund_policy: 'Full refund if cancelled 30 days before semester. 50% refund if cancelled 14 days before. No refund after move-in.',
        move_in_process: 'Check-in during orientation week. Bring ID, admission letter, and payment receipt. Room inspection and key collection.',
        move_out_process: 'Room inspection, key return, damage assessment. Security deposit refund within 14 days if no damages.',
        resident_advisor_info: 'Trained RAs on each floor available for support, conflict resolution, and emergency assistance. Office hours: 6:00 PM - 10:00 PM daily.',
        community_events: [
          'Welcome orientation',
          'Study groups',
          'Movie nights',
          'Cultural celebrations',
          'Sports tournaments',
          'Academic workshops',
          'Career talks',
          'Health and wellness programs'
        ],
        nearby_amenities: [
          'University library (5 min walk)',
          'Medical center (3 min walk)',
          'Cafeteria and restaurants',
          'ATM and banking services',
          'Bookstore and stationery',
          'Pharmacy',
          'Gym and sports facilities',
          'Shopping center (10 min walk)'
        ],
        transportation_options: [
          'University shuttle service',
          'Public bus routes',
          'Taxi and ride-sharing',
          'Bicycle rental',
          'Walking paths to campus',
          'Motorcycle taxi (okada)'
        ]
      };

      setAccommodation(mockAccommodation);
    } catch (err) {
      console.error('Error fetching accommodation details:', err);
      setError('Failed to load accommodation details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openExternalLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const sendEmail = (email: string, subject: string) => {
    if (email) {
      Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
    }
  };

  const callPhone = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const openVirtualTour = () => {
    if (accommodation?.virtual_tour_url) {
      openExternalLink(accommodation.virtual_tour_url);
    }
  };

  const openMaps = () => {
    if (accommodation && university) {
      const query = `${accommodation.name}, ${university.name}, ${university.location}`;
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      openExternalLink(mapsUrl);
    }
  };

  const renderRoomTypes = () => (
    <View style={styles.roomTypesContainer}>
      {accommodation?.room_types.map((roomType: any, index: number) => (
        <View key={index} style={styles.roomTypeCard}>
          <View style={styles.roomTypeHeader}>
            <Text style={styles.roomTypeName}>{roomType.type}</Text>
            <Text style={styles.roomTypeCost}>{roomType.cost}</Text>
          </View>
          <Text style={styles.roomTypeDescription}>{roomType.description}</Text>
          <View style={styles.roomTypeDetails}>
            <View style={styles.roomTypeDetail}>
              <Users size={16} color="#6B7280" />
              <Text style={styles.roomTypeDetailText}>Occupancy: {roomType.occupancy}</Text>
            </View>
            <View style={styles.roomTypeDetail}>
              <Home size={16} color="#6B7280" />
              <Text style={styles.roomTypeDetailText}>Size: {roomType.size}</Text>
            </View>
          </View>
          <View style={styles.roomFeatures}>
            {roomType.features.map((feature: string, featureIndex: number) => (
              <View key={featureIndex} style={styles.featureItem}>
                <CheckCircle size={12} color="#10B981" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderAmenities = () => (
    <View style={styles.amenitiesGrid}>
      {accommodation?.amenities.map((amenity: string, index: number) => (
        <View key={index} style={styles.amenityItem}>
          <CheckCircle size={16} color="#10B981" />
          <Text style={styles.amenityText}>{amenity}</Text>
        </View>
      ))}
    </View>
  );

  const renderReviews = () => (
    <View style={styles.reviewsContainer}>
      {accommodation?.reviews.map((review: any, index: number) => (
        <View key={index} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <View style={styles.reviewerInfo}>
              <Text style={styles.reviewerName}>{review.student_name}</Text>
              <Text style={styles.reviewerDetails}>{review.year} • {review.program}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{review.rating}</Text>
            </View>
          </View>
          <Text style={styles.reviewText}>{review.review}</Text>
          <Text style={styles.reviewDate}>{new Date(review.date).toLocaleDateString()}</Text>
        </View>
      ))}
    </View>
  );

  const renderPhotos = () => (
    <View style={styles.photosSection}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
        {accommodation?.photos.map((photo: string, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.photoCard}
            onPress={() => setSelectedImageIndex(index)}
          >
            <Image source={{ uri: photo }} style={styles.photoImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading accommodation details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !accommodation || !university) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Accommodation not found'}</Text>
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
            <Text style={styles.accommodationName}>{accommodation.name}</Text>
            <Text style={styles.universityName}>{university.name}</Text>
            <View style={styles.typeContainer}>
              <View style={[styles.typeBadge, { backgroundColor: accommodation.type === 'on_campus' ? '#3B82F615' : '#10B98115' }]}>
                <Text style={[styles.typeText, { color: accommodation.type === 'on_campus' ? '#3B82F6' : '#10B981' }]}>
                  {accommodation.type === 'on_campus' ? 'On-Campus' : 'Off-Campus'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Photo Gallery */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Camera size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Photo Gallery</Text>
          </View>
          {renderPhotos()}
        </View>

        {/* Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <Text style={styles.sectionContent}>{accommodation.description}</Text>
          
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Users size={20} color="#3B82F6" />
              <Text style={styles.statValue}>{accommodation.capacity}</Text>
              <Text style={styles.statLabel}>Capacity</Text>
            </View>
            <View style={styles.statItem}>
              <Star size={20} color="#F59E0B" />
              <Text style={styles.statValue}>{accommodation.satisfaction_rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.statValue}>{accommodation.occupancy_rate}%</Text>
              <Text style={styles.statLabel}>Occupancy</Text>
            </View>
          </View>
        </View>

        {/* Location & Access */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>Location & Access</Text>
          </View>
          <View style={styles.locationDetails}>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Address:</Text>
              <Text style={styles.locationValue}>{accommodation.location}</Text>
            </View>
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Distance to Campus:</Text>
              <Text style={styles.locationValue}>{accommodation.distance_to_campus}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.mapsButton} onPress={openMaps}>
            <Navigation size={16} color="#FFFFFF" />
            <Text style={styles.mapsButtonText}>View on Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Room Types & Pricing */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bed size={24} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Room Types & Pricing</Text>
          </View>
          {renderRoomTypes()}
        </View>

        {/* Amenities & Facilities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Amenities & Facilities</Text>
          </View>
          {renderAmenities()}
        </View>

        {/* Security Features */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>Security Features</Text>
          </View>
          <View style={styles.securityList}>
            {accommodation.security_features.map((feature: string, index: number) => (
              <View key={index} style={styles.securityItem}>
                <Shield size={16} color="#EF4444" />
                <Text style={styles.securityText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Meal Options */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Utensils size={24} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Meal Options</Text>
          </View>
          <View style={styles.mealOptionsList}>
            {accommodation.meal_options.map((option: string, index: number) => (
              <View key={index} style={styles.mealOptionItem}>
                <Utensils size={16} color="#F59E0B" />
                <Text style={styles.mealOptionText}>{option}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Student Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={24} color="#EC4899" />
            <Text style={styles.sectionTitle}>Student Reviews</Text>
          </View>
          {renderReviews()}
        </View>

        {/* Rules & Regulations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={24} color="#6366F1" />
            <Text style={styles.sectionTitle}>Rules & Regulations</Text>
          </View>
          <View style={styles.rulesList}>
            {accommodation.rules_and_regulations.map((rule: string, index: number) => (
              <View key={index} style={styles.ruleItem}>
                <AlertCircle size={16} color="#F59E0B" />
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Application Process */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={24} color="#06B6D4" />
            <Text style={styles.sectionTitle}>Application Process</Text>
          </View>
          <Text style={styles.sectionContent}>{accommodation.application_process}</Text>
          
          <View style={styles.deadlineContainer}>
            <Calendar size={16} color="#EF4444" />
            <Text style={styles.deadlineText}>
              Application Deadline: {new Date(accommodation.application_deadline).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Phone size={24} color="#14B8A6" />
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>
          <View style={styles.contactDetails}>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => sendEmail(accommodation.contact_info.email, `Inquiry about ${accommodation.name}`)}
            >
              <Mail size={20} color="#3B82F6" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{accommodation.contact_info.email}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => callPhone(accommodation.contact_info.phone)}
            >
              <Phone size={20} color="#10B981" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{accommodation.contact_info.phone}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.contactItem}>
              <Building size={20} color="#8B5CF6" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Office</Text>
                <Text style={styles.contactValue}>{accommodation.contact_info.office}</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <Clock size={20} color="#F59E0B" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Office Hours</Text>
                <Text style={styles.contactValue}>{accommodation.contact_info.office_hours}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Transportation Options */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Car size={24} color="#F97316" />
            <Text style={styles.sectionTitle}>Transportation Options</Text>
          </View>
          <View style={styles.transportationList}>
            {accommodation.transportation_options.map((option: string, index: number) => (
              <View key={index} style={styles.transportationItem}>
                <Car size={16} color="#F97316" />
                <Text style={styles.transportationText}>{option}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Nearby Amenities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={24} color="#84CC16" />
            <Text style={styles.sectionTitle}>Nearby Amenities</Text>
          </View>
          <View style={styles.amenitiesNearbyList}>
            {accommodation.nearby_amenities.map((amenity: string, index: number) => (
              <View key={index} style={styles.nearbyAmenityItem}>
                <MapPin size={16} color="#84CC16" />
                <Text style={styles.nearbyAmenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <DollarSign size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Payment Information</Text>
          </View>
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentTitle}>Accepted Payment Methods:</Text>
            <View style={styles.paymentMethodsList}>
              {accommodation.payment_options.map((option: string, index: number) => (
                <View key={index} style={styles.paymentMethodItem}>
                  <CheckCircle size={16} color="#10B981" />
                  <Text style={styles.paymentMethodText}>{option}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.refundPolicyContainer}>
              <Text style={styles.refundPolicyTitle}>Refund Policy:</Text>
              <Text style={styles.refundPolicyText}>{accommodation.refund_policy}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={openVirtualTour}>
            <Eye size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Virtual Tour</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => sendEmail(accommodation.contact_info.email, `Application for ${accommodation.name}`)}
          >
            <Mail size={20} color="#3B82F6" />
            <Text style={styles.secondaryButtonText}>Apply Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={openMaps}>
            <Navigation size={20} color="#3B82F6" />
            <Text style={styles.secondaryButtonText}>Directions</Text>
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
  accommodationName: {
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
  typeContainer: {
    marginTop: 8,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
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
    marginBottom: 16,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  photosSection: {
    marginTop: 8,
  },
  photosContainer: {
    paddingVertical: 8,
  },
  photoCard: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  locationDetails: {
    gap: 12,
    marginBottom: 16,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  locationLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  locationValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  mapsButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  roomTypesContainer: {
    gap: 16,
  },
  roomTypeCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  roomTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomTypeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  roomTypeCost: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  roomTypeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  roomTypeDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  roomTypeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roomTypeDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  roomFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
    minWidth: '45%',
  },
  amenityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
  },
  securityList: {
    gap: 8,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  securityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
  },
  mealOptionsList: {
    gap: 8,
  },
  mealOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mealOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
  },
  reviewsContainer: {
    gap: 16,
  },
  reviewCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  reviewerDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  rulesList: {
    gap: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  ruleText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
    lineHeight: 20,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  deadlineText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  contactDetails: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  transportationList: {
    gap: 8,
  },
  transportationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transportationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
  },
  amenitiesNearbyList: {
    gap: 8,
  },
  nearbyAmenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nearbyAmenityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
  },
  paymentDetails: {
    gap: 16,
  },
  paymentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  paymentMethodsList: {
    gap: 8,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentMethodText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  refundPolicyContainer: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  refundPolicyTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
    marginBottom: 6,
  },
  refundPolicyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E3A8A',
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
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
});