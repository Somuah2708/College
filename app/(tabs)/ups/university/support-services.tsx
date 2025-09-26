import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Heart, Phone, Mail, MapPin, Clock, Play, Search, ListFilter as Filter, ChevronDown, ChevronUp, BookOpen, Brain, Shield, Briefcase, DollarSign, Globe, Monitor, Users, TriangleAlert as AlertTriangle, Headphones, GraduationCap, Target, Award, Calendar, ExternalLink, Building, Stethoscope, Accessibility, Laptop, Scale, LifeBuoy, UserCheck, Zap, FileText, Circle as HelpCircle, CircleCheck as CheckCircle, Info } from 'lucide-react-native';

interface SupportVideo {
  id: string;
  title: string;
  youtube_url: string;
  thumbnail_url: string;
  duration: string;
  description: string;
  category: string;
  view_count: string;
  upload_date: string;
  instructor_name: string;
}

interface EmergencyContact {
  service_name: string;
  phone_number: string;
  email: string;
  location: string;
  hours: string;
  description: string;
  priority: string;
}

interface WellnessProgram {
  program_name: string;
  description: string;
  schedule: string;
  location: string;
  registration_required: boolean;
  contact_info: string;
  target_audience: string;
}

interface UniversitySupportServices {
  id: string;
  university_id: string;
  academic_advising: string;
  tutoring_services: string;
  writing_centers: string;
  counseling_services: string;
  mental_health_support: string;
  crisis_intervention: string;
  disability_services: string;
  accessibility_accommodations: string;
  health_services: string;
  medical_facilities: string;
  pharmacy_services: string;
  insurance_options: string;
  financial_counseling: string;
  legal_aid_services: string;
  chaplaincy_services: string;
  multicultural_support: string;
  lgbtq_support: string;
  veteran_services: string;
  parent_student_support: string;
  support_services_overview: string;
  student_support_office_contact: any;
  academic_support_services: string;
  health_wellness_services: string;
  disability_accessibility_services: string;
  career_support_services: string;
  financial_support_services: string;
  international_student_support: string;
  safety_security_services: string;
  technology_it_support: string;
  student_advocacy_ombudsman: string;
  support_services_videos: SupportVideo[];
  emergency_contacts_directory: EmergencyContact[];
  wellness_programs_calendar: WellnessProgram[];
  peer_mentorship_details: string;
  crisis_intervention_services: string;
  student_rights_responsibilities: string;
  created_at: string;
}

interface University {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
}

export default function SupportServicesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [supportData, setSupportData] = useState<UniversitySupportServices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSupportServicesData();
  }, [id]);

  const fetchSupportServicesData = async () => {
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
        throw universityError;
      }

      if (!universityData) {
        throw new Error('University not found');
      }

      setUniversity(universityData);

      // Fetch support services data
      const { data: supportServicesData, error: supportServicesError } = await supabase
        .from('university_support_services')
        .select('*')
        .eq('university_id', id)
        .single();

      if (supportServicesError) {
        console.error('Error fetching support services data:', supportServicesError);
        // Generate comprehensive mock data if no data exists
        generateMockSupportData(universityData);
      } else {
        setSupportData(supportServicesData);
      }
    } catch (err) {
      console.error('Error fetching support services data:', err);
      setError('Failed to load support services information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateMockSupportData = (universityData: University) => {
    // Generate comprehensive mock support services data
    const mockSupportData: UniversitySupportServices = {
      id: 'support-1',
      university_id: universityData.id,
      academic_advising: 'Comprehensive academic advising services available to all students',
      tutoring_services: 'Free tutoring in mathematics, sciences, and writing',
      writing_centers: 'Professional writing support and editing services',
      counseling_services: 'Licensed counselors available for personal and academic support',
      mental_health_support: '24/7 mental health crisis support and therapy services',
      crisis_intervention: 'Immediate crisis intervention and emergency mental health support',
      disability_services: 'Comprehensive support for students with disabilities',
      accessibility_accommodations: 'Full range of accessibility accommodations and assistive technology',
      health_services: 'On-campus health clinic with medical professionals',
      medical_facilities: 'Modern medical facilities with pharmacy and specialist services',
      pharmacy_services: 'On-campus pharmacy with prescription and over-the-counter medications',
      insurance_options: 'Student health insurance plans and coverage options',
      financial_counseling: 'Financial planning and budgeting assistance',
      legal_aid_services: 'Legal consultation and assistance for students',
      chaplaincy_services: 'Multi-faith chaplaincy and spiritual support services',
      multicultural_support: 'Support for international and multicultural students',
      lgbtq_support: 'LGBTQ+ support services and safe spaces',
      veteran_services: 'Specialized support for veteran students',
      parent_student_support: 'Support services for student parents and families',
      support_services_overview: `${universityData.name} is committed to providing comprehensive support services that ensure student well-being, academic success, and personal development. Our integrated approach combines academic, health, financial, and personal support to create an environment where every student can thrive.`,
      student_support_office_contact: {
        office_name: 'Student Support Services Office',
        email: 'support@university.edu',
        phone: '+1 (555) 123-4567',
        emergency_phone: '+1 (555) 911-HELP',
        location: 'Student Services Building, Room 200',
        office_hours: 'Monday-Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 2:00 PM',
        after_hours_contact: '24/7 Crisis Hotline: +1 (555) CRISIS-1',
        website: 'https://university.edu/student-support',
        online_portal: 'https://portal.university.edu/support'
      },
      academic_support_services: 'Our Academic Support Services include personalized academic advising for course planning and degree completion, comprehensive tutoring programs in mathematics, sciences, writing, and specialized subjects, professional writing centers with editing assistance, research support through library services and citation guidance, study skills workshops, time management training, and academic success coaching.',
      health_wellness_services: 'Health and Wellness Services feature a fully-equipped on-campus health clinic with medical professionals, comprehensive mental health and counseling services with licensed therapists, crisis intervention support available 24/7, health education programs covering nutrition, fitness, and preventive care, medical insurance guidance and enrollment assistance, pharmacy services with prescription and over-the-counter medications, and wellness workshops focusing on stress management and healthy lifestyle choices.',
      disability_accessibility_services: 'Disability and Accessibility Services provide comprehensive learning support for students with disabilities, assistive technology including screen readers, voice recognition software, and adaptive equipment, accessible classroom accommodations such as note-taking assistance and extended testing time, accessible housing options with specialized accommodations, advocacy and inclusion initiatives promoting campus-wide accessibility, and individualized support plans tailored to each student\'s specific needs.',
      career_support_services: 'Career Support Services offer personalized career counseling and planning sessions, comprehensive job placement and internship support with industry connections, professional resume and interview workshops, networking events with employers and alumni, career fairs and recruitment events, industry-specific career guidance, and ongoing career development resources throughout your academic journey.',
      financial_support_services: 'Financial Support Services include emergency bursaries and hardship grants for students facing financial difficulties, comprehensive guidance on scholarship and financial aid applications, budgeting advice and financial literacy workshops, emergency loan programs for urgent financial needs, work-study program coordination, and financial planning assistance for international students.',
      international_student_support: 'International Student Support provides comprehensive orientation programs for foreign students, visa and immigration assistance with dedicated advisors, cultural adjustment support and integration programs, language support services including ESL classes, international student community building activities, assistance with banking and housing arrangements, and ongoing support throughout the academic journey.',
      safety_security_services: 'Safety and Security Services maintain 24/7 campus security patrols and monitoring, emergency escort services for safe campus navigation, comprehensive safety training programs, emergency response procedures and drills, campus-wide emergency notification systems, personal safety workshops, and coordination with local law enforcement for enhanced security.',
      technology_it_support: 'Technology and IT Support offers comprehensive help desk services for technical issues, Wi-Fi and network troubleshooting assistance, online learning platform support and training, software installation and licensing support, computer lab access and maintenance, cybersecurity awareness training, and 24/7 technical support for critical systems.',
      student_advocacy_ombudsman: 'Student Advocacy and Ombudsman services provide confidential assistance for raising concerns or complaints, mediation and conflict resolution services between students and faculty/staff, comprehensive information about student rights and responsibilities, advocacy for fair treatment and due process, guidance on academic appeals and grievance procedures, and neutral support for resolving disputes.',
      support_services_videos: Array.from({ length: 25 }, (_, index) => {
        const categories = [
          'Overview', 'Academic Support', 'Health & Wellness', 'Mental Health', 'Disability Services',
          'Career Support', 'Financial Aid', 'International Support', 'Safety & Security', 'IT Support',
          'Student Advocacy', 'Crisis Intervention', 'Peer Mentorship', 'Wellness Programs', 'Emergency Services'
        ];
        const category = categories[index % categories.length];
        
        return {
          id: `support-video-${index + 1}`,
          title: `${category} at ${universityData.name} - Guide ${Math.floor(index / categories.length) + 1}`,
          youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index}`,
          thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
          duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          description: `Comprehensive guide to ${category.toLowerCase()} services available at ${universityData.name}`,
          category: category,
          view_count: `${Math.floor(Math.random() * 50000) + 5000}`,
          upload_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          instructor_name: `${category} Coordinator`
        };
      }),
      emergency_contacts_directory: [
        {
          service_name: 'Campus Security',
          phone_number: '+1 (555) 123-SAFE',
          email: 'security@university.edu',
          location: 'Security Office, Main Campus',
          hours: '24/7',
          description: 'Emergency response, campus patrols, escort services',
          priority: 'high'
        },
        {
          service_name: 'Crisis Counseling Hotline',
          phone_number: '+1 (555) CRISIS-1',
          email: 'crisis@university.edu',
          location: 'Counseling Center',
          hours: '24/7',
          description: 'Immediate mental health crisis support',
          priority: 'urgent'
        },
        {
          service_name: 'Health Center Emergency',
          phone_number: '+1 (555) 123-HLTH',
          email: 'health@university.edu',
          location: 'Student Health Center',
          hours: '24/7 Emergency, 8 AM - 8 PM Regular',
          description: 'Medical emergencies and urgent health concerns',
          priority: 'high'
        },
        {
          service_name: 'Student Support Office',
          phone_number: '+1 (555) 123-4567',
          email: 'support@university.edu',
          location: 'Student Services Building, Room 200',
          hours: 'Monday-Friday: 8 AM - 6 PM',
          description: 'General student support and assistance',
          priority: 'medium'
        },
        {
          service_name: 'International Student Services',
          phone_number: '+1 (555) 123-INTL',
          email: 'international@university.edu',
          location: 'International House',
          hours: 'Monday-Friday: 9 AM - 5 PM',
          description: 'Visa, immigration, and international student support',
          priority: 'medium'
        }
      ],
      wellness_programs_calendar: [
        {
          program_name: 'Stress Management Workshop',
          description: 'Learn effective techniques for managing academic and personal stress',
          schedule: 'Every Tuesday, 3:00 PM - 4:30 PM',
          location: 'Wellness Center, Room 101',
          registration_required: true,
          contact_info: 'wellness@university.edu',
          target_audience: 'All students'
        },
        {
          program_name: 'Mindfulness Meditation Sessions',
          description: 'Guided meditation sessions for mental clarity and relaxation',
          schedule: 'Monday, Wednesday, Friday: 12:00 PM - 12:30 PM',
          location: 'Meditation Room, Student Center',
          registration_required: false,
          contact_info: 'mindfulness@university.edu',
          target_audience: 'All students and staff'
        },
        {
          program_name: 'Financial Literacy Workshop',
          description: 'Learn budgeting, saving, and financial planning skills',
          schedule: 'First Thursday of each month, 6:00 PM - 8:00 PM',
          location: 'Business Building, Lecture Hall 3',
          registration_required: true,
          contact_info: 'financial@university.edu',
          target_audience: 'Undergraduate and graduate students'
        },
        {
          program_name: 'Peer Support Groups',
          description: 'Student-led support groups for various topics and challenges',
          schedule: 'Various times throughout the week',
          location: 'Counseling Center Group Rooms',
          registration_required: true,
          contact_info: 'peer-support@university.edu',
          target_audience: 'Students seeking peer support'
        }
      ],
      peer_mentorship_details: 'Our Peer Mentorship Program connects new students with experienced upperclassmen who provide guidance, support, and friendship. The program includes academic mentoring for course selection and study strategies, social mentoring for campus integration and friendship building, career mentoring for professional development, and specialized mentoring for international students, first-generation college students, and students from underrepresented backgrounds.',
      crisis_intervention_services: 'Crisis Intervention Services provide immediate support for students experiencing mental health emergencies, personal crises, or traumatic events. Our trained crisis counselors are available 24/7 through our crisis hotline, emergency walk-in services, and mobile crisis response team. We also provide follow-up support, safety planning, and connections to ongoing mental health services.',
      student_rights_responsibilities: 'Students have the right to a safe and inclusive learning environment, fair treatment in academic and disciplinary matters, access to support services and accommodations, freedom of expression and assembly, and confidential counseling services. Student responsibilities include maintaining academic integrity, respecting others and university property, following university policies and procedures, and seeking help when needed.',
      created_at: new Date().toISOString()
    };

    setSupportData(mockSupportData);
  };

  const openYouTubeVideo = (url: string) => {
    Linking.openURL(url);
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

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('academic') || name.includes('tutoring')) return BookOpen;
    if (name.includes('health') || name.includes('medical')) return Stethoscope;
    if (name.includes('mental') || name.includes('counseling')) return Brain;
    if (name.includes('disability') || name.includes('accessibility')) return Accessibility;
    if (name.includes('career') || name.includes('job')) return Briefcase;
    if (name.includes('financial') || name.includes('money')) return DollarSign;
    if (name.includes('international') || name.includes('visa')) return Globe;
    if (name.includes('safety') || name.includes('security')) return Shield;
    if (name.includes('technology') || name.includes('it')) return Monitor;
    if (name.includes('advocacy') || name.includes('ombudsman')) return Scale;
    return Heart;
  };

  const getServiceColor = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('academic') || name.includes('tutoring')) return '#3B82F6';
    if (name.includes('health') || name.includes('medical')) return '#10B981';
    if (name.includes('mental') || name.includes('counseling')) return '#8B5CF6';
    if (name.includes('disability') || name.includes('accessibility')) return '#EC4899';
    if (name.includes('career') || name.includes('job')) return '#F59E0B';
    if (name.includes('financial') || name.includes('money')) return '#06B6D4';
    if (name.includes('international') || name.includes('visa')) return '#84CC16';
    if (name.includes('safety') || name.includes('security')) return '#EF4444';
    if (name.includes('technology') || name.includes('it')) return '#6366F1';
    if (name.includes('advocacy') || name.includes('ombudsman')) return '#14B8A6';
    return '#F97316';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#DC2626';
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const filteredVideos = supportData?.support_services_videos.filter(video => {
    const matchesSearch = searchQuery.trim() === '' ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedVideoCategory === 'all' || video.category === selectedVideoCategory;

    return matchesSearch && matchesCategory;
  }) || [];

  const videoCategories = Array.from(new Set(supportData?.support_services_videos.map(v => v.category) || []));

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading support services information...</Text>
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

  if (!supportData) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.programName}>Support Services</Text>
              <Text style={styles.universityName}>{university.name}</Text>
            </View>
          </View>

          <View style={styles.noDataContainer}>
            <Heart size={48} color="#9CA3AF" />
            <Text style={styles.noDataTitle}>Support Services Information Not Available</Text>
            <Text style={styles.noDataText}>
              Detailed support services information for {university.name} is not currently available in our database.
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
            <Text style={styles.programName}>Support Services</Text>
            <Text style={styles.universityName}>{university.name}</Text>
          </View>
        </View>

        {/* Support Services Videos */}
        <View style={styles.videosSection}>
          <View style={styles.sectionHeader}>
            <Play size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>Support Services Videos ({supportData.support_services_videos.length})</Text>
          </View>

          <View style={styles.videoFilters}>
            <View style={styles.searchContainer}>
              <Search size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search videos..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilters}>
              <TouchableOpacity
                style={[styles.categoryFilter, selectedVideoCategory === 'all' && styles.activeCategoryFilter]}
                onPress={() => setSelectedVideoCategory('all')}
              >
                <Text style={[styles.categoryFilterText, selectedVideoCategory === 'all' && styles.activeCategoryFilterText]}>
                  All ({supportData.support_services_videos.length})
                </Text>
              </TouchableOpacity>
              {videoCategories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryFilter, selectedVideoCategory === category && styles.activeCategoryFilter]}
                  onPress={() => setSelectedVideoCategory(category)}
                >
                  <Text style={[styles.categoryFilterText, selectedVideoCategory === category && styles.activeCategoryFilterText]}>
                    {category} ({supportData.support_services_videos.filter(v => v.category === category).length})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
            {filteredVideos.map((video) => (
              <TouchableOpacity
                key={video.id}
                style={styles.videoCard}
                onPress={() => openYouTubeVideo(video.youtube_url)}
              >
                <View style={styles.videoThumbnail}>
                  <Image 
                    source={{ uri: video.thumbnail_url }} 
                    style={styles.thumbnailImage}
                    defaultSource={{ uri: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' }}
                  />
                  <View style={styles.playOverlay}>
                    <Play size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.durationBadge}>
                    <Clock size={10} color="#FFFFFF" />
                    <Text style={styles.durationText}>{video.duration}</Text>
                  </View>
                </View>
                <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                <Text style={styles.videoInstructor}>by {video.instructor_name}</Text>
                <View style={styles.videoMeta}>
                  <Text style={styles.videoViews}>{video.view_count} views</Text>
                  <Text style={styles.videoDate}>{new Date(video.upload_date).toLocaleDateString()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 1. Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <Text style={styles.sectionContent}>{supportData.support_services_overview}</Text>
          
          {/* Contact Information */}
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Student Support Office</Text>
            <View style={styles.contactDetails}>
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => sendEmail(supportData.student_support_office_contact.email, 'Support Services Inquiry')}
              >
                <Mail size={16} color="#3B82F6" />
                <Text style={styles.contactText}>{supportData.student_support_office_contact.email}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => callPhone(supportData.student_support_office_contact.phone)}
              >
                <Phone size={16} color="#10B981" />
                <Text style={styles.contactText}>{supportData.student_support_office_contact.phone}</Text>
              </TouchableOpacity>

              <View style={styles.contactItem}>
                <MapPin size={16} color="#8B5CF6" />
                <Text style={styles.contactText}>{supportData.student_support_office_contact.location}</Text>
              </View>

              <View style={styles.contactItem}>
                <Clock size={16} color="#F59E0B" />
                <Text style={styles.contactText}>{supportData.student_support_office_contact.office_hours}</Text>
              </View>

              {supportData.student_support_office_contact.after_hours_contact && (
                <TouchableOpacity
                  style={styles.emergencyContact}
                  onPress={() => callPhone(supportData.student_support_office_contact.after_hours_contact.split(': ')[1])}
                >
                  <AlertTriangle size={16} color="#EF4444" />
                  <Text style={styles.emergencyContactText}>{supportData.student_support_office_contact.after_hours_contact}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* 2. Academic Support */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('academic')}
          >
            <View style={styles.sectionHeaderContent}>
              <BookOpen size={24} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Academic Support</Text>
            </View>
            {expandedSections.has('academic') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>
          
          {expandedSections.has('academic') && (
            <View style={styles.expandedContent}>
              <Text style={styles.sectionContent}>{supportData.academic_support_services}</Text>
              
              <View style={styles.servicesGrid}>
                <View style={styles.serviceCard}>
                  <GraduationCap size={20} color="#3B82F6" />
                  <Text style={styles.serviceTitle}>Academic Advising</Text>
                  <Text style={styles.serviceDescription}>Personalized course planning and degree guidance</Text>
                </View>
                
                <View style={styles.serviceCard}>
                  <Users size={20} color="#10B981" />
                  <Text style={styles.serviceTitle}>Tutoring Programs</Text>
                  <Text style={styles.serviceDescription}>Free peer and professional tutoring services</Text>
                </View>
                
                <View style={styles.serviceCard}>
                  <FileText size={20} color="#8B5CF6" />
                  <Text style={styles.serviceTitle}>Writing Centers</Text>
                  <Text style={styles.serviceDescription}>Professional writing support and editing</Text>
                </View>
                
                <View style={styles.serviceCard}>
                  <BookOpen size={20} color="#F59E0B" />
                  <Text style={styles.serviceTitle}>Research Support</Text>
                  <Text style={styles.serviceDescription}>Library assistance and citation guidance</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 3. Health & Wellness Services */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('health')}
          >
            <View style={styles.sectionHeaderContent}>
              <Stethoscope size={24} color="#10B981" />
              <Text style={styles.sectionTitle}>Health & Wellness Services</Text>
            </View>
            {expandedSections.has('health') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>
          
          {expandedSections.has('health') && (
            <View style={styles.expandedContent}>
              <Text style={styles.sectionContent}>{supportData.health_wellness_services}</Text>
              
              <View style={styles.servicesGrid}>
                <View style={styles.serviceCard}>
                  <Stethoscope size={20} color="#10B981" />
                  <Text style={styles.serviceTitle}>Health Clinic</Text>
                  <Text style={styles.serviceDescription}>On-campus medical care and treatment</Text>
                </View>
                
                <View style={styles.serviceCard}>
                  <Brain size={20} color="#8B5CF6" />
                  <Text style={styles.serviceTitle}>Mental Health</Text>
                  <Text style={styles.serviceDescription}>Counseling and psychological support</Text>
                </View>
                
                <View style={styles.serviceCard}>
                  <Heart size={20} color="#EF4444" />
                  <Text style={styles.serviceTitle}>Wellness Programs</Text>
                  <Text style={styles.serviceDescription}>Health education and prevention</Text>
                </View>
                
                <View style={styles.serviceCard}>
                  <Shield size={20} color="#06B6D4" />
                  <Text style={styles.serviceTitle}>Health Insurance</Text>
                  <Text style={styles.serviceDescription}>Insurance plans and coverage options</Text>
                </View>
              </View>

              {/* Wellness Programs Calendar */}
              <View style={styles.wellnessProgramsSection}>
                <Text style={styles.wellnessProgramsTitle}>Wellness Programs</Text>
                {supportData.wellness_programs_calendar.map((program, index) => (
                  <View key={index} style={styles.wellnessProgramCard}>
                    <View style={styles.programHeader}>
                      <Text style={styles.programName}>{program.program_name}</Text>
                      {program.registration_required && (
                        <View style={styles.registrationBadge}>
                          <Text style={styles.registrationText}>Registration Required</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.programDescription}>{program.description}</Text>
                    <View style={styles.programDetails}>
                      <View style={styles.programDetailItem}>
                        <Calendar size={14} color="#6B7280" />
                        <Text style={styles.programDetailText}>{program.schedule}</Text>
                      </View>
                      <View style={styles.programDetailItem}>
                        <MapPin size={14} color="#6B7280" />
                        <Text style={styles.programDetailText}>{program.location}</Text>
                      </View>
                      <View style={styles.programDetailItem}>
                        <Users size={14} color="#6B7280" />
                        <Text style={styles.programDetailText}>{program.target_audience}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.programContactButton}
                      onPress={() => sendEmail(program.contact_info, `Inquiry about ${program.program_name}`)}
                    >
                      <Mail size={14} color="#3B82F6" />
                      <Text style={styles.programContactText}>Contact for Info</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* 4. Disability & Accessibility Services */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('disability')}
          >
            <View style={styles.sectionHeaderContent}>
              <Accessibility size={24} color="#EC4899" />
              <Text style={styles.sectionTitle}>Disability & Accessibility Services</Text>
            </View>
            {expandedSections.has('disability') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>
          
          {expandedSections.has('disability') && (
            <View style={styles.expandedContent}>
              <Text style={styles.sectionContent}>{supportData.disability_accessibility_services}</Text>
              
              <View style={styles.accessibilityHighlights}>
                <View style={styles.accessibilityCard}>
                  <Laptop size={20} color="#EC4899" />
                  <Text style={styles.accessibilityTitle}>Assistive Technology</Text>
                  <Text style={styles.accessibilityDescription}>
                    Screen readers, voice recognition, adaptive keyboards, and specialized software
                  </Text>
                </View>
                
                <View style={styles.accessibilityCard}>
                  <Building size={20} color="#EC4899" />
                  <Text style={styles.accessibilityTitle}>Accessible Facilities</Text>
                  <Text style={styles.accessibilityDescription}>
                    Wheelchair accessible buildings, elevators, and specialized classroom setups
                  </Text>
                </View>
                
                <View style={styles.accessibilityCard}>
                  <UserCheck size={20} color="#EC4899" />
                  <Text style={styles.accessibilityTitle}>Learning Support</Text>
                  <Text style={styles.accessibilityDescription}>
                    Note-taking assistance, extended testing time, and individualized support plans
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 5. Career Support */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('career')}
          >
            <View style={styles.sectionHeaderContent}>
              <Briefcase size={24} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Career Support</Text>
            </View>
            {expandedSections.has('career') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>
          
          {expandedSections.has('career') && (
            <View style={styles.expandedContent}>
              <Text style={styles.sectionContent}>{supportData.career_support_services}</Text>
            </View>
          )}
        </View>

        {/* 6. Financial Support */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('financial')}
          >
            <View style={styles.sectionHeaderContent}>
              <DollarSign size={24} color="#06B6D4" />
              <Text style={styles.sectionTitle}>Financial Support</Text>
            </View>
            {expandedSections.has('financial') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>
          
          {expandedSections.has('financial') && (
            <View style={styles.expandedContent}>
              <Text style={styles.sectionContent}>{supportData.financial_support_services}</Text>
            </View>
          )}
        </View>

        {/* 7. International Student Support */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('international')}
          >
            <View style={styles.sectionHeaderContent}>
              <Globe size={24} color="#84CC16" />
              <Text style={styles.sectionTitle}>International Student Support</Text>
            </View>
            {expandedSections.has('international') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>
          
          {expandedSections.has('international') && (
            <View style={styles.expandedContent}>
              <Text style={styles.sectionContent}>{supportData.international_student_support}</Text>
            </View>
          )}
        </View>

        {/* 8. Safety & Security Services */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('safety')}
          >
            <View style={styles.sectionHeaderContent}>
              <Shield size={24} color="#EF4444" />
              <Text style={styles.sectionTitle}>Safety & Security Services</Text>
            </View>
            {expandedSections.has('safety') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>
          
          {expandedSections.has('safety') && (
            <View style={styles.expandedContent}>
              <Text style={styles.sectionContent}>{supportData.safety_security_services}</Text>
            </View>
          )}
        </View>

        {/* 9. Technology & IT Support */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('technology')}
          >
            <View style={styles.sectionHeaderContent}>
              <Monitor size={24} color="#6366F1" />
              <Text style={styles.sectionTitle}>Technology & IT Support</Text>
            </View>
            {expandedSections.has('technology') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>
          
          {expandedSections.has('technology') && (
            <View style={styles.expandedContent}>
              <Text style={styles.sectionContent}>{supportData.technology_it_support}</Text>
            </View>
          )}
        </View>

        {/* 10. Student Advocacy & Ombudsman */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('advocacy')}
          >
            <View style={styles.sectionHeaderContent}>
              <Scale size={24} color="#14B8A6" />
              <Text style={styles.sectionTitle}>Student Advocacy & Ombudsman</Text>
            </View>
            {expandedSections.has('advocacy') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>
          
          {expandedSections.has('advocacy') && (
            <View style={styles.expandedContent}>
              <Text style={styles.sectionContent}>{supportData.student_advocacy_ombudsman}</Text>
              
              <View style={styles.rightsSection}>
                <Text style={styles.rightsTitle}>Student Rights & Responsibilities</Text>
                <Text style={styles.rightsContent}>{supportData.student_rights_responsibilities}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Emergency Contacts Directory */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={24} color="#DC2626" />
            <Text style={styles.sectionTitle}>Emergency Contacts Directory</Text>
          </View>
          
          <View style={styles.emergencyContactsGrid}>
            {supportData.emergency_contacts_directory.map((contact, index) => (
              <View key={index} style={[
                styles.emergencyContactCard,
                { borderLeftColor: getPriorityColor(contact.priority) }
              ]}>
                <View style={styles.emergencyContactHeader}>
                  <Text style={styles.emergencyContactName}>{contact.service_name}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(contact.priority)}15` }]}>
                    <Text style={[styles.priorityText, { color: getPriorityColor(contact.priority) }]}>
                      {contact.priority}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.emergencyContactDescription}>{contact.description}</Text>
                
                <View style={styles.emergencyContactDetails}>
                  <TouchableOpacity
                    style={styles.emergencyContactItem}
                    onPress={() => callPhone(contact.phone_number)}
                  >
                    <Phone size={16} color="#EF4444" />
                    <Text style={styles.emergencyContactItemText}>{contact.phone_number}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.emergencyContactItem}
                    onPress={() => sendEmail(contact.email, `Emergency Support Request - ${contact.service_name}`)}
                  >
                    <Mail size={16} color="#3B82F6" />
                    <Text style={styles.emergencyContactItemText}>{contact.email}</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.emergencyContactItem}>
                    <MapPin size={16} color="#6B7280" />
                    <Text style={styles.emergencyContactItemText}>{contact.location}</Text>
                  </View>
                  
                  <View style={styles.emergencyContactItem}>
                    <Clock size={16} color="#F59E0B" />
                    <Text style={styles.emergencyContactItemText}>{contact.hours}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Peer Mentorship Program */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={24} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Peer Mentorship Program</Text>
          </View>
          <Text style={styles.sectionContent}>{supportData.peer_mentorship_details}</Text>
        </View>

        {/* Crisis Intervention Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <LifeBuoy size={24} color="#DC2626" />
            <Text style={styles.sectionTitle}>Crisis Intervention Services</Text>
          </View>
          <View style={styles.crisisSection}>
            <Text style={styles.sectionContent}>{supportData.crisis_intervention_services}</Text>
            <View style={styles.crisisHotline}>
              <AlertTriangle size={20} color="#DC2626" />
              <Text style={styles.crisisHotlineTitle}>24/7 Crisis Hotline</Text>
              <TouchableOpacity
                style={styles.crisisHotlineButton}
                onPress={() => callPhone(supportData.student_support_office_contact.emergency_phone)}
              >
                <Phone size={16} color="#FFFFFF" />
                <Text style={styles.crisisHotlineText}>Call Now: {supportData.student_support_office_contact.emergency_phone}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionButtons}>
          {supportData.student_support_office_contact.website && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => openExternalLink(supportData.student_support_office_contact.website)}
            >
              <Globe size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Support Portal</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => sendEmail(supportData.student_support_office_contact.email, 'Support Services Inquiry')}
          >
            <Mail size={20} color="#3B82F6" />
            <Text style={styles.secondaryButtonText}>Contact Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => callPhone(supportData.student_support_office_contact.emergency_phone)}
          >
            <AlertTriangle size={20} color="#FFFFFF" />
            <Text style={styles.emergencyButtonText}>Emergency</Text>
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
  videosSection: {
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
  videoFilters: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  categoryFilters: {
    flexDirection: 'row',
  },
  categoryFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeCategoryFilter: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryFilterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeCategoryFilterText: {
    color: '#FFFFFF',
  },
  videosContainer: {
    marginTop: 8,
  },
  videoCard: {
    width: 220,
    marginRight: 16,
  },
  videoThumbnail: {
    position: 'relative',
    width: '100%',
    height: 124,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    padding: 6,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  videoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  videoInstructor: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoViews: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  videoDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
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
  sectionHeaderClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  expandedContent: {
    marginTop: 8,
  },
  contactCard: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 12,
  },
  contactDetails: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
  },
  emergencyContact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  emergencyContactText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  serviceCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  serviceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 6,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  accessibilityHighlights: {
    gap: 12,
    marginTop: 16,
  },
  accessibilityCard: {
    backgroundColor: '#FDF2F8',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EC4899',
  },
  accessibilityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#BE185D',
    marginTop: 8,
    marginBottom: 6,
  },
  accessibilityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#831843',
    lineHeight: 20,
  },
  wellnessProgramsSection: {
    marginTop: 20,
  },
  wellnessProgramsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  wellnessProgramCard: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  programName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#15803D',
  },
  registrationBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  registrationText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
  },
  programDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#166534',
    lineHeight: 20,
    marginBottom: 12,
  },
  programDetails: {
    gap: 6,
    marginBottom: 12,
  },
  programDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  programDetailText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  programContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    gap: 6,
    alignSelf: 'flex-start',
  },
  programContactText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  emergencyContactsGrid: {
    gap: 12,
  },
  emergencyContactCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emergencyContactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyContactName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
  emergencyContactDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  emergencyContactDetails: {
    gap: 6,
  },
  emergencyContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyContactItemText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  rightsSection: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#14B8A6',
  },
  rightsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0891B2',
    marginBottom: 8,
  },
  rightsContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0E7490',
    lineHeight: 20,
  },
  crisisSection: {
    marginTop: 8,
  },
  crisisHotline: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FECACA',
  },
  crisisHotlineTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginTop: 8,
    marginBottom: 12,
  },
  crisisHotlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  crisisHotlineText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 8,
  },
  primaryButton: {
    flex: 2,
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
    flex: 2,
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
  emergencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 6,
  },
  emergencyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});