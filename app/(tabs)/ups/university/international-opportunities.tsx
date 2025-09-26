import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Globe, Plane, Award, Trophy, BookOpen, Heart, FileText, Users, Play, Clock, ExternalLink, Mail, Phone, MapPin, DollarSign, Calendar, Search, ListFilter as Filter, ChevronDown, ChevronUp, Star, Building, GraduationCap, Briefcase, Target, Shield, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Info, Lightbulb, Navigation, CreditCard, Calculator, Languages, Flag, Camera, Video, MessageCircle, ThumbsUp, Eye, Share } from 'lucide-react-native';

interface StudyAbroadProgram {
  id: string;
  program_name: string;
  partner_university: string;
  country: string;
  duration: string;
  program_type: string;
  eligibility: string;
  application_deadline: string;
  program_description: string;
  application_url: string;
  contact_email: string;
  scholarship_available: boolean;
  estimated_cost: string;
  housing_provided: boolean;
  language_requirements: string;
  academic_requirements: string;
  cultural_activities: string;
}

interface InternationalInternship {
  id: string;
  internship_title: string;
  company: string;
  location: string;
  duration: string;
  compensation: string;
  field: string;
  internship_type: string;
  description: string;
  eligibility: string;
  application_deadline: string;
  application_url: string;
  contact_person: string;
  contact_email: string;
  visa_sponsorship: boolean;
  housing_assistance: boolean;
  mentorship_program: boolean;
  skills_required: string[];
  application_process: string;
  benefits: string[];
}

interface Scholarship {
  id: string;
  scholarship_name: string;
  provider: string;
  scholarship_type: string;
  target_countries: string[];
  award_amount: string;
  duration: string;
  eligibility: string;
  application_deadline: string;
  application_url: string;
  description: string;
  application_guide: string;
  success_tips: string;
  contact_email: string;
  alumni_network: boolean;
  mentorship_available: boolean;
}

interface Conference {
  id: string;
  event_name: string;
  location: string;
  event_type: string;
  field: string;
  date: string;
  registration_deadline: string;
  description: string;
  eligibility: string;
  application_process: string;
  benefits: string[];
  estimated_cost: string;
  scholarship_available: boolean;
  contact_email: string;
  website: string;
}

interface VolunteerProgram {
  id: string;
  program_name: string;
  location: string;
  duration: string;
  program_type: string;
  description: string;
  eligibility: string;
  application_deadline: string;
  estimated_cost: string;
  application_url: string;
  contact_email: string;
  skills_gained: string[];
  impact_focus: string;
  safety_measures: string;
}

interface AlumniExperience {
  id: string;
  alumni_name: string;
  program_attended: string;
  graduation_year: number;
  current_position: string;
  testimonial: string;
  key_advice: string;
  challenges_faced: string;
  how_overcome: string;
  career_impact: string;
  video_testimonial_url: string;
  linkedin_profile: string;
  contact_email: string;
}

interface InternationalVideo {
  id: string;
  title: string;
  youtube_url: string;
  thumbnail_url: string;
  duration: string;
  category: string;
  description: string;
  instructor: string;
  views: string;
  upload_date: string;
}

interface CountryGuide {
  id: string;
  country: string;
  overview: string;
  academic_system: string;
  cultural_highlights: string;
  practical_tips: string;
  cost_of_living: string;
  weather: string;
  transportation: string;
  healthcare: string;
  safety: string;
  student_life: string;
}

interface UniversityInternationalOpportunities {
  id: string;
  university_id: string;
  study_abroad_programs: StudyAbroadProgram[];
  international_internships: InternationalInternship[];
  overseas_scholarships_funding: Scholarship[];
  global_conferences_competitions: Conference[];
  language_cultural_preparation: any;
  volunteering_service_abroad: VolunteerProgram[];
  visa_travel_guidance: any;
  alumni_peer_experiences: AlumniExperience[];
  international_videos: InternationalVideo[];
  opportunity_finder_filters: any;
  application_tracker_tools: any[];
  cost_estimator_data: any;
  country_specific_guides: CountryGuide[];
  pre_departure_resources: any[];
  emergency_contacts_abroad: any[];
  cultural_adaptation_tips: string;
  work_permit_information: any;
  travel_health_insurance: any;
}

interface University {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
}

export default function InternationalOpportunitiesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [internationalData, setInternationalData] = useState<UniversityInternationalOpportunities | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['study_abroad']));
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('all');
  const [selectedDurationFilter, setSelectedDurationFilter] = useState<string>('all');
  const [selectedFieldFilter, setSelectedFieldFilter] = useState<string>('all');

  useEffect(() => {
    fetchInternationalData();
  }, [id]);

  const fetchInternationalData = async () => {
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

      // Fetch international opportunities data
      const { data: internationalData, error: internationalError } = await supabase
        .from('university_international_opportunities')
        .select('*')
        .eq('university_id', id);

      if (internationalError) {
      }

      // Handle the result as an array and take the first item if it exists
      setInternationalData(internationalData && internationalData.length > 0 ? internationalData[0] : null);
    } catch (err) {
      console.error('Error fetching international data:', err);
      setError('Failed to load international opportunities information. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const toggleSectionExpansion = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getVideosByCategory = (category: string) => {
    if (!internationalData?.international_videos) return [];
    
    if (category === 'all') {
      return internationalData.international_videos;
    }
    
    return internationalData.international_videos.filter(video => video.category === category);
  };

  const getFilteredVideos = () => {
    let videos = getVideosByCategory(selectedVideoCategory);
    
    if (searchQuery.trim()) {
      videos = videos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return videos;
  };

  const videoCategories = [
    { key: 'all', label: 'All Videos', icon: Video },
    { key: 'study_abroad_overview', label: 'Study Abroad', icon: GraduationCap },
    { key: 'study_abroad_programs', label: 'Exchange Programs', icon: Globe },
    { key: 'international_internships', label: 'Internships', icon: Briefcase },
    { key: 'scholarships_funding', label: 'Scholarships', icon: Award },
    { key: 'conferences_competitions', label: 'Competitions', icon: Trophy },
    { key: 'language_cultural_prep', label: 'Cultural Prep', icon: Languages },
    { key: 'volunteering_service', label: 'Volunteering', icon: Heart },
    { key: 'visa_travel_guidance', label: 'Visa & Travel', icon: FileText },
    { key: 'alumni_experiences', label: 'Alumni Stories', icon: Users },
    { key: 'interactive_tools', label: 'Tools & Tips', icon: Target }
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading international opportunities...</Text>
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

  if (!internationalData) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.programName}>International Opportunities</Text>
              <Text style={styles.universityName}>{university.name}</Text>
            </View>
          </View>

          <View style={styles.noDataContainer}>
            <Globe size={48} color="#9CA3AF" />
            <Text style={styles.noDataTitle}>International Opportunities Information Not Available</Text>
            <Text style={styles.noDataText}>
              Detailed international opportunities information for {university.name} is not currently available in our database.
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

  const filteredVideos = getFilteredVideos();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.programName}>International Opportunities</Text>
            <Text style={styles.universityName}>{university.name}</Text>
          </View>
        </View>

        {/* Video Gallery Section */}
        <View style={styles.videosSection}>
          <View style={styles.sectionHeader}>
            <Play size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>International Opportunities Videos ({internationalData.international_videos?.length || 0})</Text>
          </View>

          {/* Video Search and Filters */}
          <View style={styles.videoFiltersContainer}>
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
              {videoCategories.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryFilterButton,
                    selectedVideoCategory === category.key && styles.activeCategoryFilter
                  ]}
                  onPress={() => setSelectedVideoCategory(category.key)}
                >
                  <category.icon size={16} color={selectedVideoCategory === category.key ? '#FFFFFF' : '#6B7280'} />
                  <Text style={[
                    styles.categoryFilterText,
                    selectedVideoCategory === category.key && styles.activeCategoryFilterText
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Videos Grid */}
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
                    <Play size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.durationBadge}>
                    <Clock size={12} color="#FFFFFF" />
                    <Text style={styles.durationText}>{video.duration}</Text>
                  </View>
                </View>
                <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                <Text style={styles.videoInstructor}>by {video.instructor}</Text>
                <View style={styles.videoStats}>
                  <View style={styles.videoStat}>
                    <Eye size={12} color="#6B7280" />
                    <Text style={styles.videoStatText}>{video.views}</Text>
                  </View>
                  <Text style={styles.videoDate}>{new Date(video.upload_date).toLocaleDateString()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 1. Study Abroad Programs */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('study_abroad')}
          >
            <View style={styles.sectionHeaderContent}>
              <GraduationCap size={24} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Study Abroad Programs</Text>
            </View>
            {expandedSections.has('study_abroad') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('study_abroad') && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Explore semester and year-long exchange programs with our partner universities worldwide.
              </Text>
              
              {internationalData.study_abroad_programs?.map((program) => (
                <View key={program.id} style={styles.programCard}>
                  <View style={styles.programHeader}>
                    <Text style={styles.programTitle}>{program.program_name}</Text>
                    <View style={styles.programBadges}>
                      {program.scholarship_available && (
                        <View style={styles.scholarshipBadge}>
                          <Award size={12} color="#F59E0B" />
                          <Text style={styles.scholarshipBadgeText}>Scholarship</Text>
                        </View>
                      )}
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>{program.program_type}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.programDetails}>
                    <View style={styles.programDetailRow}>
                      <Building size={16} color="#6B7280" />
                      <Text style={styles.programDetailText}>{program.partner_university}</Text>
                    </View>
                    <View style={styles.programDetailRow}>
                      <MapPin size={16} color="#6B7280" />
                      <Text style={styles.programDetailText}>{program.country}</Text>
                    </View>
                    <View style={styles.programDetailRow}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.programDetailText}>{program.duration}</Text>
                    </View>
                    <View style={styles.programDetailRow}>
                      <DollarSign size={16} color="#6B7280" />
                      <Text style={styles.programDetailText}>{program.estimated_cost}</Text>
                    </View>
                    <View style={styles.programDetailRow}>
                      <Calendar size={16} color="#6B7280" />
                      <Text style={styles.programDetailText}>Deadline: {new Date(program.application_deadline).toLocaleDateString()}</Text>
                    </View>
                  </View>

                  <Text style={styles.programDescription}>{program.program_description}</Text>

                  <View style={styles.requirementsSection}>
                    <Text style={styles.requirementsTitle}>Requirements:</Text>
                    <Text style={styles.requirementsText}>{program.eligibility}</Text>
                    <Text style={styles.requirementsText}>Academic: {program.academic_requirements}</Text>
                    <Text style={styles.requirementsText}>Language: {program.language_requirements}</Text>
                  </View>

                  {program.cultural_activities && (
                    <View style={styles.culturalSection}>
                      <Text style={styles.culturalTitle}>Cultural Activities:</Text>
                      <Text style={styles.culturalText}>{program.cultural_activities}</Text>
                    </View>
                  )}

                  <View style={styles.programActions}>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => openExternalLink(program.application_url)}
                    >
                      <ExternalLink size={16} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>Apply Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => sendEmail(program.contact_email, `Inquiry about ${program.program_name}`)}
                    >
                      <Mail size={16} color="#3B82F6" />
                      <Text style={styles.secondaryButtonText}>Contact</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 2. International Internships */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('internships')}
          >
            <View style={styles.sectionHeaderContent}>
              <Briefcase size={24} color="#10B981" />
              <Text style={styles.sectionTitle}>International Internships & Work Placements</Text>
            </View>
            {expandedSections.has('internships') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('internships') && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Gain valuable international work experience through paid and unpaid internships with global companies.
              </Text>
              
              {internationalData.international_internships?.map((internship) => (
                <View key={internship.id} style={styles.internshipCard}>
                  <View style={styles.internshipHeader}>
                    <Text style={styles.internshipTitle}>{internship.internship_title}</Text>
                    <View style={styles.internshipBadges}>
                      {internship.visa_sponsorship && (
                        <View style={styles.visaBadge}>
                          <CheckCircle size={12} color="#10B981" />
                          <Text style={styles.visaBadgeText}>Visa Sponsored</Text>
                        </View>
                      )}
                      <View style={[styles.typeBadge, { backgroundColor: internship.internship_type === 'Paid' ? '#10B98115' : '#F59E0B15' }]}>
                        <Text style={[styles.typeBadgeText, { color: internship.internship_type === 'Paid' ? '#10B981' : '#F59E0B' }]}>
                          {internship.internship_type}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.internshipDetails}>
                    <View style={styles.internshipDetailRow}>
                      <Building size={16} color="#6B7280" />
                      <Text style={styles.internshipDetailText}>{internship.company}</Text>
                    </View>
                    <View style={styles.internshipDetailRow}>
                      <MapPin size={16} color="#6B7280" />
                      <Text style={styles.internshipDetailText}>{internship.location}</Text>
                    </View>
                    <View style={styles.internshipDetailRow}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.internshipDetailText}>{internship.duration}</Text>
                    </View>
                    <View style={styles.internshipDetailRow}>
                      <DollarSign size={16} color="#6B7280" />
                      <Text style={styles.internshipDetailText}>{internship.compensation}</Text>
                    </View>
                    <View style={styles.internshipDetailRow}>
                      <Target size={16} color="#6B7280" />
                      <Text style={styles.internshipDetailText}>{internship.field}</Text>
                    </View>
                  </View>

                  <Text style={styles.internshipDescription}>{internship.description}</Text>

                  <View style={styles.skillsSection}>
                    <Text style={styles.skillsTitle}>Required Skills:</Text>
                    <View style={styles.skillsTags}>
                      {internship.skills_required?.map((skill, index) => (
                        <View key={index} style={styles.skillTag}>
                          <Text style={styles.skillTagText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.benefitsSection}>
                    <Text style={styles.benefitsTitle}>Benefits:</Text>
                    <View style={styles.benefitsList}>
                      {internship.benefits?.map((benefit, index) => (
                        <View key={index} style={styles.benefitItem}>
                          <CheckCircle size={14} color="#10B981" />
                          <Text style={styles.benefitText}>{benefit}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.internshipActions}>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => openExternalLink(internship.application_url)}
                    >
                      <ExternalLink size={16} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>Apply</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => sendEmail(internship.contact_email, `Inquiry about ${internship.internship_title}`)}
                    >
                      <Mail size={16} color="#10B981" />
                      <Text style={styles.secondaryButtonText}>Contact</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 3. Scholarships & Funding */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('scholarships')}
          >
            <View style={styles.sectionHeaderContent}>
              <Award size={24} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Scholarships & Funding for Overseas Study</Text>
            </View>
            {expandedSections.has('scholarships') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('scholarships') && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Discover government-funded scholarships, university-specific grants, and private foundation funding for international study.
              </Text>
              
              {internationalData.overseas_scholarships_funding?.map((scholarship) => (
                <View key={scholarship.id} style={styles.scholarshipCard}>
                  <View style={styles.scholarshipHeader}>
                    <Text style={styles.scholarshipTitle}>{scholarship.scholarship_name}</Text>
                    <View style={styles.scholarshipBadges}>
                      <View style={styles.providerBadge}>
                        <Text style={styles.providerBadgeText}>{scholarship.scholarship_type}</Text>
                      </View>
                      {scholarship.alumni_network && (
                        <View style={styles.networkBadge}>
                          <Users size={12} color="#8B5CF6" />
                          <Text style={styles.networkBadgeText}>Alumni Network</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <Text style={styles.scholarshipProvider}>by {scholarship.provider}</Text>
                  <Text style={styles.scholarshipDescription}>{scholarship.description}</Text>

                  <View style={styles.scholarshipDetails}>
                    <View style={styles.scholarshipDetailRow}>
                      <DollarSign size={16} color="#6B7280" />
                      <Text style={styles.scholarshipDetailText}>{scholarship.award_amount}</Text>
                    </View>
                    <View style={styles.scholarshipDetailRow}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.scholarshipDetailText}>{scholarship.duration}</Text>
                    </View>
                    <View style={styles.scholarshipDetailRow}>
                      <Calendar size={16} color="#6B7280" />
                      <Text style={styles.scholarshipDetailText}>Deadline: {new Date(scholarship.application_deadline).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.scholarshipDetailRow}>
                      <Globe size={16} color="#6B7280" />
                      <Text style={styles.scholarshipDetailText}>{scholarship.target_countries.join(', ')}</Text>
                    </View>
                  </View>

                  <View style={styles.eligibilitySection}>
                    <Text style={styles.eligibilityTitle}>Eligibility:</Text>
                    <Text style={styles.eligibilityText}>{scholarship.eligibility}</Text>
                  </View>

                  <View style={styles.tipsSection}>
                    <Text style={styles.tipsTitle}>Success Tips:</Text>
                    <Text style={styles.tipsText}>{scholarship.success_tips}</Text>
                  </View>

                  <View style={styles.scholarshipActions}>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => openExternalLink(scholarship.application_url)}
                    >
                      <ExternalLink size={16} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>Apply</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => sendEmail(scholarship.contact_email, `Inquiry about ${scholarship.scholarship_name}`)}
                    >
                      <Mail size={16} color="#F59E0B" />
                      <Text style={styles.secondaryButtonText}>Contact</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 4. Global Conferences & Competitions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('conferences')}
          >
            <View style={styles.sectionHeaderContent}>
              <Trophy size={24} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Global Conferences & Competitions</Text>
            </View>
            {expandedSections.has('conferences') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('conferences') && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Participate in international academic competitions, conferences, and leadership summits.
              </Text>
              
              {internationalData.global_conferences_competitions?.map((conference) => (
                <View key={conference.id} style={styles.conferenceCard}>
                  <View style={styles.conferenceHeader}>
                    <Text style={styles.conferenceTitle}>{conference.event_name}</Text>
                    <View style={styles.conferenceBadges}>
                      {conference.scholarship_available && (
                        <View style={styles.scholarshipBadge}>
                          <Award size={12} color="#F59E0B" />
                          <Text style={styles.scholarshipBadgeText}>Funding Available</Text>
                        </View>
                      )}
                      <View style={styles.fieldBadge}>
                        <Text style={styles.fieldBadgeText}>{conference.field}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.conferenceDetails}>
                    <View style={styles.conferenceDetailRow}>
                      <MapPin size={16} color="#6B7280" />
                      <Text style={styles.conferenceDetailText}>{conference.location}</Text>
                    </View>
                    <View style={styles.conferenceDetailRow}>
                      <Calendar size={16} color="#6B7280" />
                      <Text style={styles.conferenceDetailText}>Event: {new Date(conference.date).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.conferenceDetailRow}>
                      <AlertCircle size={16} color="#6B7280" />
                      <Text style={styles.conferenceDetailText}>Registration: {new Date(conference.registration_deadline).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.conferenceDetailRow}>
                      <DollarSign size={16} color="#6B7280" />
                      <Text style={styles.conferenceDetailText}>{conference.estimated_cost}</Text>
                    </View>
                  </View>

                  <Text style={styles.conferenceDescription}>{conference.description}</Text>

                  <View style={styles.benefitsSection}>
                    <Text style={styles.benefitsTitle}>Benefits:</Text>
                    <View style={styles.benefitsList}>
                      {conference.benefits?.map((benefit, index) => (
                        <View key={index} style={styles.benefitItem}>
                          <Star size={14} color="#8B5CF6" />
                          <Text style={styles.benefitText}>{benefit}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.conferenceActions}>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => openExternalLink(conference.website)}
                    >
                      <ExternalLink size={16} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => sendEmail(conference.contact_email, `Inquiry about ${conference.event_name}`)}
                    >
                      <Mail size={16} color="#8B5CF6" />
                      <Text style={styles.secondaryButtonText}>Contact</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 5. Language & Cultural Preparation */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('language_prep')}
          >
            <View style={styles.sectionHeaderContent}>
              <Languages size={24} color="#EC4899" />
              <Text style={styles.sectionTitle}>Language & Cultural Preparation</Text>
            </View>
            {expandedSections.has('language_prep') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('language_prep') && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Prepare for your international experience with language learning resources and cultural orientation programs.
              </Text>

              {/* Language Learning Resources */}
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Language Learning Resources</Text>
                {internationalData.language_cultural_preparation?.language_learning_resources?.map((resource: any, index: number) => (
                  <View key={index} style={styles.languageCard}>
                    <View style={styles.languageHeader}>
                      <Text style={styles.languageName}>{resource.language}</Text>
                      <Text style={styles.languageCost}>{resource.cost}</Text>
                    </View>
                    <Text style={styles.languageProvider}>by {resource.provider}</Text>
                    <Text style={styles.languageType}>{resource.course_type} • {resource.duration}</Text>
                    <TouchableOpacity
                      style={styles.languageContact}
                      onPress={() => sendEmail(resource.contact, `Inquiry about ${resource.language} classes`)}
                    >
                      <Mail size={14} color="#EC4899" />
                      <Text style={styles.languageContactText}>Contact for enrollment</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Cultural Orientation Programs */}
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Cultural Orientation Programs</Text>
                {internationalData.language_cultural_preparation?.cultural_orientation_programs?.map((program: any, index: number) => (
                  <View key={index} style={styles.orientationCard}>
                    <Text style={styles.orientationTitle}>{program.program_name}</Text>
                    <Text style={styles.orientationDuration}>{program.duration} • {program.cost}</Text>
                    <Text style={styles.orientationDescription}>
                      Topics: {program.topics?.join(', ')}
                    </Text>
                    <Text style={styles.orientationSchedule}>Schedule: {program.schedule}</Text>
                  </View>
                ))}
              </View>

              {/* Cultural Adaptation Tips */}
              <View style={styles.adaptationSection}>
                <Text style={styles.adaptationTitle}>Cultural Adaptation Tips</Text>
                <Text style={styles.adaptationText}>{internationalData.cultural_adaptation_tips}</Text>
              </View>
            </View>
          )}
        </View>

        {/* 6. Volunteering & Service Abroad */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('volunteering')}
          >
            <View style={styles.sectionHeaderContent}>
              <Heart size={24} color="#EF4444" />
              <Text style={styles.sectionTitle}>Volunteering & Service Abroad</Text>
            </View>
            {expandedSections.has('volunteering') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('volunteering') && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Make a global impact through humanitarian service, environmental projects, and community development programs.
              </Text>
              
              {internationalData.volunteering_service_abroad?.map((program) => (
                <View key={program.id} style={styles.volunteerCard}>
                  <View style={styles.volunteerHeader}>
                    <Text style={styles.volunteerTitle}>{program.program_name}</Text>
                    <View style={styles.volunteerBadge}>
                      <Text style={styles.volunteerBadgeText}>{program.program_type}</Text>
                    </View>
                  </View>

                  <View style={styles.volunteerDetails}>
                    <View style={styles.volunteerDetailRow}>
                      <MapPin size={16} color="#6B7280" />
                      <Text style={styles.volunteerDetailText}>{program.location}</Text>
                    </View>
                    <View style={styles.volunteerDetailRow}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.volunteerDetailText}>{program.duration}</Text>
                    </View>
                    <View style={styles.volunteerDetailRow}>
                      <DollarSign size={16} color="#6B7280" />
                      <Text style={styles.volunteerDetailText}>{program.estimated_cost}</Text>
                    </View>
                    <View style={styles.volunteerDetailRow}>
                      <Target size={16} color="#6B7280" />
                      <Text style={styles.volunteerDetailText}>{program.impact_focus}</Text>
                    </View>
                  </View>

                  <Text style={styles.volunteerDescription}>{program.description}</Text>

                  <View style={styles.skillsSection}>
                    <Text style={styles.skillsTitle}>Skills You'll Gain:</Text>
                    <View style={styles.skillsTags}>
                      {program.skills_gained?.map((skill, index) => (
                        <View key={index} style={styles.skillTag}>
                          <Text style={styles.skillTagText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.safetySection}>
                    <Text style={styles.safetyTitle}>Safety Measures:</Text>
                    <Text style={styles.safetyText}>{program.safety_measures}</Text>
                  </View>

                  <View style={styles.volunteerActions}>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => openExternalLink(program.application_url)}
                    >
                      <Heart size={16} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>Apply</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => sendEmail(program.contact_email, `Inquiry about ${program.program_name}`)}
                    >
                      <Mail size={16} color="#EF4444" />
                      <Text style={styles.secondaryButtonText}>Contact</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 7. Visa & Travel Guidance */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('visa_travel')}
          >
            <View style={styles.sectionHeaderContent}>
              <FileText size={24} color="#06B6D4" />
              <Text style={styles.sectionTitle}>Visa & Travel Guidance</Text>
            </View>
            {expandedSections.has('visa_travel') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('visa_travel') && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Complete guidance on visa requirements, travel health, insurance, and preparation for studying abroad.
              </Text>

              {/* Visa Requirements by Country */}
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Visa Requirements by Country</Text>
                {Object.entries(internationalData.visa_travel_guidance?.visa_requirements_by_country || {}).map(([country, requirements]: [string, any]) => (
                  <View key={country} style={styles.visaCard}>
                    <View style={styles.visaHeader}>
                      <Flag size={20} color="#06B6D4" />
                      <Text style={styles.visaCountry}>{country}</Text>
                    </View>
                    <View style={styles.visaDetails}>
                      <Text style={styles.visaType}>{requirements.visa_type}</Text>
                      <View style={styles.visaInfo}>
                        <Text style={styles.visaInfoText}>Processing: {requirements.processing_time}</Text>
                        <Text style={styles.visaInfoText}>Cost: {requirements.cost}</Text>
                        <Text style={styles.visaInfoText}>Work Permission: {requirements.work_permission}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.visaButton}
                      onPress={() => openExternalLink(requirements.application_url)}
                    >
                      <ExternalLink size={14} color="#06B6D4" />
                      <Text style={styles.visaButtonText}>Apply for Visa</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Travel Health Requirements */}
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Travel Health & Insurance</Text>
                <View style={styles.healthCard}>
                  <View style={styles.healthSection}>
                    <Text style={styles.healthTitle}>Required Vaccinations:</Text>
                    <View style={styles.vaccinationsList}>
                      {internationalData.visa_travel_guidance?.travel_health_requirements?.vaccinations?.map((vaccination: string, index: number) => (
                        <View key={index} style={styles.vaccinationItem}>
                          <Shield size={14} color="#10B981" />
                          <Text style={styles.vaccinationText}>{vaccination}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.healthSection}>
                    <Text style={styles.healthTitle}>Health Insurance:</Text>
                    <Text style={styles.healthText}>{internationalData.visa_travel_guidance?.travel_health_requirements?.health_insurance}</Text>
                  </View>

                  <View style={styles.healthSection}>
                    <Text style={styles.healthTitle}>Medical Preparation:</Text>
                    <Text style={styles.healthText}>{internationalData.visa_travel_guidance?.travel_health_requirements?.medical_checkup}</Text>
                  </View>
                </View>
              </View>

              {/* Packing & Budgeting Tips */}
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Packing & Budgeting Tips</Text>
                <View style={styles.tipsCard}>
                  <View style={styles.tipsSection}>
                    <Text style={styles.tipsTitle}>Essential Items:</Text>
                    <View style={styles.tipsList}>
                      {internationalData.visa_travel_guidance?.packing_budgeting_tips?.essential_items?.map((item: string, index: number) => (
                        <View key={index} style={styles.tipItem}>
                          <CheckCircle size={14} color="#10B981" />
                          <Text style={styles.tipText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.budgetingAdvice}>
                    <Text style={styles.budgetingTitle}>Budgeting Advice:</Text>
                    <Text style={styles.budgetingText}>{internationalData.visa_travel_guidance?.packing_budgeting_tips?.budgeting_advice}</Text>
                    <Text style={styles.budgetingText}>Money Transfer: {internationalData.visa_travel_guidance?.packing_budgeting_tips?.money_transfer}</Text>
                    <Text style={styles.budgetingText}>Emergency Fund: {internationalData.visa_travel_guidance?.packing_budgeting_tips?.emergency_fund}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 8. Alumni & Peer Experiences */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('alumni')}
          >
            <View style={styles.sectionHeaderContent}>
              <Users size={24} color="#14B8A6" />
              <Text style={styles.sectionTitle}>Alumni & Peer Experiences</Text>
            </View>
            {expandedSections.has('alumni') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('alumni') && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Learn from the experiences of alumni and current students who have studied or worked abroad.
              </Text>
              
              {internationalData.alumni_peer_experiences?.map((experience) => (
                <View key={experience.id} style={styles.experienceCard}>
                  <View style={styles.experienceHeader}>
                    <View style={styles.alumniInfo}>
                      <Text style={styles.alumniName}>{experience.alumni_name}</Text>
                      <Text style={styles.alumniProgram}>{experience.program_attended}</Text>
                      <Text style={styles.alumniPosition}>{experience.current_position}</Text>
                    </View>
                    <View style={styles.graduationBadge}>
                      <Text style={styles.graduationYear}>Class of {experience.graduation_year}</Text>
                    </View>
                  </View>

                  <View style={styles.testimonialSection}>
                    <Text style={styles.testimonialTitle}>Experience:</Text>
                    <Text style={styles.testimonialText}>"{experience.testimonial}"</Text>
                  </View>

                  <View style={styles.adviceSection}>
                    <Text style={styles.adviceTitle}>Key Advice:</Text>
                    <Text style={styles.adviceText}>"{experience.key_advice}"</Text>
                  </View>

                  <View style={styles.challengesSection}>
                    <Text style={styles.challengesTitle}>Challenges & Solutions:</Text>
                    <Text style={styles.challengesText}>
                      <Text style={styles.challengesLabel}>Challenge: </Text>
                      {experience.challenges_faced}
                    </Text>
                    <Text style={styles.challengesText}>
                      <Text style={styles.challengesLabel}>Solution: </Text>
                      {experience.how_overcome}
                    </Text>
                  </View>

                  <View style={styles.impactSection}>
                    <Text style={styles.impactTitle}>Career Impact:</Text>
                    <Text style={styles.impactText}>{experience.career_impact}</Text>
                  </View>

                  <View style={styles.experienceActions}>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => openYouTubeVideo(experience.video_testimonial_url)}
                    >
                      <Play size={16} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>Watch Story</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => openExternalLink(experience.linkedin_profile)}
                    >
                      <ExternalLink size={16} color="#14B8A6" />
                      <Text style={styles.secondaryButtonText}>LinkedIn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => sendEmail(experience.contact_email, `Connect with ${experience.alumni_name}`)}
                    >
                      <Mail size={16} color="#14B8A6" />
                      <Text style={styles.secondaryButtonText}>Contact</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 9. Interactive Tools */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('tools')}
          >
            <View style={styles.sectionHeaderContent}>
              <Target size={24} color="#F97316" />
              <Text style={styles.sectionTitle}>Interactive Tools</Text>
            </View>
            {expandedSections.has('tools') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('tools') && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Use our interactive tools to find opportunities, track applications, and estimate costs for studying abroad.
              </Text>

              {/* Opportunity Finder */}
              <View style={styles.toolCard}>
                <View style={styles.toolHeader}>
                  <Search size={24} color="#3B82F6" />
                  <Text style={styles.toolTitle}>Opportunity Finder</Text>
                </View>
                <Text style={styles.toolDescription}>
                  Filter international opportunities by country, duration, field of study, and funding type.
                </Text>
                
                <View style={styles.finderFilters}>
                  <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>Country:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {['all', ...(internationalData.opportunity_finder_filters?.countries || [])].map((country) => (
                        <TouchableOpacity
                          key={country}
                          style={[
                            styles.filterChip,
                            selectedCountryFilter === country && styles.activeFilterChip
                          ]}
                          onPress={() => setSelectedCountryFilter(country)}
                        >
                          <Text style={[
                            styles.filterChipText,
                            selectedCountryFilter === country && styles.activeFilterChipText
                          ]}>
                            {country === 'all' ? 'All Countries' : country}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>Duration:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {['all', ...(internationalData.opportunity_finder_filters?.durations || [])].map((duration) => (
                        <TouchableOpacity
                          key={duration}
                          style={[
                            styles.filterChip,
                            selectedDurationFilter === duration && styles.activeFilterChip
                          ]}
                          onPress={() => setSelectedDurationFilter(duration)}
                        >
                          <Text style={[
                            styles.filterChipText,
                            selectedDurationFilter === duration && styles.activeFilterChipText
                          ]}>
                            {duration === 'all' ? 'All Durations' : duration}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>Field:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {['all', ...(internationalData.opportunity_finder_filters?.fields_of_study || [])].map((field) => (
                        <TouchableOpacity
                          key={field}
                          style={[
                            styles.filterChip,
                            selectedFieldFilter === field && styles.activeFilterChip
                          ]}
                          onPress={() => setSelectedFieldFilter(field)}
                        >
                          <Text style={[
                            styles.filterChipText,
                            selectedFieldFilter === field && styles.activeFilterChipText
                          ]}>
                            {field === 'all' ? 'All Fields' : field}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>

              {/* Application Tracker */}
              <View style={styles.toolCard}>
                <View style={styles.toolHeader}>
                  <FileText size={24} color="#10B981" />
                  <Text style={styles.toolTitle}>Application Tracker</Text>
                </View>
                <Text style={styles.toolDescription}>
                  Track multiple international program applications with deadlines and status updates.
                </Text>
                
                <View style={styles.trackerTools}>
                  {internationalData.application_tracker_tools?.map((tool: any, index: number) => (
                    <View key={index} style={styles.trackerTool}>
                      <Text style={styles.trackerToolTitle}>{tool.tool_name}</Text>
                      <Text style={styles.trackerToolDescription}>{tool.description}</Text>
                      <View style={styles.trackerFeatures}>
                        {tool.features?.map((feature: string, featureIndex: number) => (
                          <View key={featureIndex} style={styles.trackerFeature}>
                            <CheckCircle size={12} color="#10B981" />
                            <Text style={styles.trackerFeatureText}>{feature}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Cost Estimator */}
              <View style={styles.toolCard}>
                <View style={styles.toolHeader}>
                  <Calculator size={24} color="#8B5CF6" />
                  <Text style={styles.toolTitle}>Currency Converter & Cost Estimator</Text>
                </View>
                <Text style={styles.toolDescription}>
                  Plan your budget for studying abroad with real-time currency conversion and cost estimates.
                </Text>
                
                <View style={styles.costEstimator}>
                  {Object.entries(internationalData.cost_estimator_data?.sample_costs || {}).map(([country, costs]: [string, any]) => (
                    <View key={country} style={styles.costCard}>
                      <Text style={styles.costCountry}>{country}</Text>
                      <View style={styles.costBreakdown}>
                        <Text style={styles.costItem}>Tuition: {costs.tuition}</Text>
                        <Text style={styles.costItem}>Accommodation: {costs.accommodation}</Text>
                        <Text style={styles.costItem}>Living: {costs.living_expenses}</Text>
                        <Text style={styles.costTotal}>Total: {costs.total_estimate}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Country-Specific Guides */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            onPress={() => toggleSectionExpansion('country_guides')}
          >
            <View style={styles.sectionHeaderContent}>
              <BookOpen size={24} color="#84CC16" />
              <Text style={styles.sectionTitle}>Country-Specific Guides</Text>
            </View>
            {expandedSections.has('country_guides') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('country_guides') && (
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Comprehensive guides to help you understand and prepare for life in different countries.
              </Text>
              
              {internationalData.country_specific_guides?.map((guide) => (
                <View key={guide.id} style={styles.countryGuideCard}>
                  <View style={styles.countryGuideHeader}>
                    <Flag size={24} color="#84CC16" />
                    <Text style={styles.countryGuideName}>{guide.country}</Text>
                  </View>

                  <Text style={styles.countryOverview}>{guide.overview}</Text>

                  <View style={styles.guideDetailsGrid}>
                    <View style={styles.guideDetailCard}>
                      <GraduationCap size={16} color="#3B82F6" />
                      <Text style={styles.guideDetailTitle}>Academic System</Text>
                      <Text style={styles.guideDetailText}>{guide.academic_system}</Text>
                    </View>

                    <View style={styles.guideDetailCard}>
                      <Heart size={16} color="#EF4444" />
                      <Text style={styles.guideDetailTitle}>Culture</Text>
                      <Text style={styles.guideDetailText}>{guide.cultural_highlights}</Text>
                    </View>

                    <View style={styles.guideDetailCard}>
                      <DollarSign size={16} color="#10B981" />
                      <Text style={styles.guideDetailTitle}>Cost of Living</Text>
                      <Text style={styles.guideDetailText}>{guide.cost_of_living}</Text>
                    </View>

                    <View style={styles.guideDetailCard}>
                      <Shield size={16} color="#F59E0B" />
                      <Text style={styles.guideDetailTitle}>Safety</Text>
                      <Text style={styles.guideDetailText}>{guide.safety}</Text>
                    </View>
                  </View>

                  <View style={styles.practicalTipsSection}>
                    <Text style={styles.practicalTipsTitle}>Practical Tips:</Text>
                    <Text style={styles.practicalTipsText}>{guide.practical_tips}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={24} color="#DC2626" />
            <Text style={styles.sectionTitle}>Emergency Contacts Abroad</Text>
          </View>
          
          {internationalData.emergency_contacts_abroad?.map((contact: any, index: number) => (
            <View key={index} style={styles.emergencyCard}>
              <Text style={styles.emergencyCountry}>{contact.country}</Text>
              
              <View style={styles.emergencySection}>
                <Text style={styles.emergencyTitle}>Ghana Embassy/High Commission</Text>
                <View style={styles.emergencyDetails}>
                  <Text style={styles.emergencyText}>{contact.embassy_contact?.name}</Text>
                  <Text style={styles.emergencyText}>{contact.embassy_contact?.address}</Text>
                  <TouchableOpacity onPress={() => Linking.openURL(`tel:${contact.embassy_contact?.phone}`)}>
                    <Text style={styles.emergencyPhone}>📞 {contact.embassy_contact?.phone}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => sendEmail(contact.embassy_contact?.email, 'Emergency Contact')}>
                    <Text style={styles.emergencyEmail}>✉️ {contact.embassy_contact?.email}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.emergencySection}>
                <Text style={styles.emergencyTitle}>Local Emergency Numbers</Text>
                <View style={styles.emergencyNumbers}>
                  <Text style={styles.emergencyNumber}>Police: {contact.local_emergency?.police}</Text>
                  <Text style={styles.emergencyNumber}>Medical: {contact.local_emergency?.medical}</Text>
                  <Text style={styles.emergencyNumber}>Fire: {contact.local_emergency?.fire}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => openExternalLink(university.website)}
          >
            <Globe size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>University Website</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => sendEmail('international@university.edu', 'International Opportunities Inquiry')}
          >
            <Mail size={20} color="#3B82F6" />
            <Text style={styles.secondaryButtonText}>Contact International Office</Text>
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
  videoFiltersContainer: {
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
  categoryFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    gap: 6,
  },
  activeCategoryFilter: {
    backgroundColor: '#3B82F6',
  },
  categoryFilterText: {
    fontSize: 12,
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
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
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
    fontSize: 12,
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
    marginBottom: 6,
  },
  videoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoStatText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  videoDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
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
    padding: 20,
  },
  sectionHeaderClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  programCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  programTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginRight: 12,
  },
  programBadges: {
    alignItems: 'flex-end',
    gap: 6,
  },
  scholarshipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  scholarshipBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
  },
  typeBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  programDetails: {
    marginBottom: 12,
    gap: 6,
  },
  programDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  programDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  programDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  requirementsSection: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  requirementsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 6,
  },
  requirementsText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    lineHeight: 18,
    marginBottom: 2,
  },
  culturalSection: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  culturalTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 6,
  },
  culturalText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 18,
  },
  programActions: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    gap: 4,
  },
  secondaryButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  internshipCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  internshipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  internshipTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginRight: 12,
  },
  internshipBadges: {
    alignItems: 'flex-end',
    gap: 6,
  },
  visaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  visaBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#15803D',
  },
  internshipDetails: {
    marginBottom: 12,
    gap: 6,
  },
  internshipDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  internshipDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  internshipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  skillsSection: {
    marginBottom: 12,
  },
  skillsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  skillsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: '#3B82F615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  benefitsSection: {
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  benefitsList: {
    gap: 6,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  internshipActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scholarshipCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  scholarshipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  scholarshipTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginRight: 12,
  },
  scholarshipBadges: {
    alignItems: 'flex-end',
    gap: 6,
  },
  providerBadge: {
    backgroundColor: '#F59E0B15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  providerBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  networkBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#7C3AED',
  },
  scholarshipProvider: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    marginBottom: 8,
  },
  scholarshipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  scholarshipDetails: {
    marginBottom: 12,
    gap: 6,
  },
  scholarshipDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scholarshipDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  eligibilitySection: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  eligibilityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 6,
  },
  eligibilityText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    lineHeight: 18,
  },
  tipsSection: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 6,
  },
  tipsText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 18,
  },
  scholarshipActions: {
    flexDirection: 'row',
    gap: 8,
  },
  conferenceCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  conferenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  conferenceTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginRight: 12,
  },
  conferenceBadges: {
    alignItems: 'flex-end',
    gap: 6,
  },
  fieldBadge: {
    backgroundColor: '#8B5CF615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fieldBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#7C3AED',
  },
  conferenceDetails: {
    marginBottom: 12,
    gap: 6,
  },
  conferenceDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  conferenceDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  conferenceDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  conferenceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  subsection: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  languageCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  languageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  languageName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  languageCost: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  languageProvider: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EC4899',
    marginBottom: 4,
  },
  languageType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  languageContact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  languageContactText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EC4899',
  },
  orientationCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  orientationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  orientationDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EC4899',
    marginBottom: 6,
  },
  orientationDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  orientationSchedule: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  adaptationSection: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  adaptationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 8,
  },
  adaptationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 22,
  },
  volunteerCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  volunteerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  volunteerTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginRight: 12,
  },
  volunteerBadge: {
    backgroundColor: '#EF444415',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  volunteerBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
  },
  volunteerDetails: {
    marginBottom: 12,
    gap: 6,
  },
  volunteerDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  volunteerDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  volunteerDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  safetySection: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  safetyTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#15803D',
    marginBottom: 6,
  },
  safetyText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#166534',
    lineHeight: 18,
  },
  volunteerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  visaCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  visaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  visaCountry: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  visaDetails: {
    marginBottom: 12,
  },
  visaType: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#06B6D4',
    marginBottom: 8,
  },
  visaInfo: {
    gap: 4,
  },
  visaInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  visaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#06B6D415',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  visaButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#0891B2',
  },
  healthCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  healthSection: {
    marginBottom: 16,
  },
  healthTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  healthText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  vaccinationsList: {
    gap: 6,
  },
  vaccinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vaccinationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tipsSection: {
    marginBottom: 16,
  },
  tipsList: {
    gap: 6,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  budgetingAdvice: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
  },
  budgetingTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 8,
  },
  budgetingText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    lineHeight: 18,
    marginBottom: 4,
  },
  experienceCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  alumniInfo: {
    flex: 1,
  },
  alumniName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  alumniProgram: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#14B8A6',
    marginBottom: 2,
  },
  alumniPosition: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  graduationBadge: {
    backgroundColor: '#14B8A615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  graduationYear: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#0F766E',
  },
  testimonialSection: {
    marginBottom: 16,
  },
  testimonialTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  testimonialText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  adviceSection: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  adviceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 6,
  },
  adviceText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  challengesSection: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  challengesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginBottom: 8,
  },
  challengesText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#991B1B',
    lineHeight: 18,
    marginBottom: 4,
  },
  challengesLabel: {
    fontFamily: 'Inter-SemiBold',
  },
  impactSection: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  impactTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#15803D',
    marginBottom: 6,
  },
  impactText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#166534',
    lineHeight: 18,
  },
  experienceActions: {
    flexDirection: 'row',
    gap: 6,
  },
  toolCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  toolTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  toolDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  finderFilters: {
    gap: 12,
  },
  filterRow: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterChip: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  trackerTools: {
    gap: 12,
  },
  trackerTool: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  trackerToolTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  trackerToolDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  trackerFeatures: {
    gap: 4,
  },
  trackerFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trackerFeatureText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  costEstimator: {
    gap: 12,
  },
  costCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  costCountry: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  costBreakdown: {
    gap: 4,
  },
  costItem: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  costTotal: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginTop: 4,
  },
  countryGuideCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  countryGuideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  countryGuideName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  countryOverview: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  guideDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  guideDetailCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  guideDetailTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 6,
    marginBottom: 4,
  },
  guideDetailText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
  },
  practicalTipsSection: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
  },
  practicalTipsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 6,
  },
  practicalTipsText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 18,
  },
  emergencyCard: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  emergencyCountry: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginBottom: 16,
  },
  emergencySection: {
    marginBottom: 16,
  },
  emergencyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#991B1B',
    marginBottom: 8,
  },
  emergencyDetails: {
    gap: 4,
  },
  emergencyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F1D1D',
    lineHeight: 18,
  },
  emergencyPhone: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginTop: 4,
  },
  emergencyEmail: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginTop: 2,
  },
  emergencyNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },
  emergencyNumber: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
  },
});