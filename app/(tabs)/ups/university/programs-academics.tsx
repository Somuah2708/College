import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Play, Clock, BookOpen, GraduationCap, Award, Building, Users, Globe, ExternalLink, Search, ListFilter as Filter, Star, Calendar, Target, Lightbulb, Briefcase, Monitor, ChevronDown, ChevronUp, MapPin, Trophy, Shield, FileText, Zap, CircleAlert as AlertCircle, ChevronRight } from 'lucide-react-native';

interface UniversityProgramsAcademics {
  faculties_colleges: any[];
  departments: any[];
  undergraduate_programs: any[];
  postgraduate_programs: any[];
  doctoral_programs: any[];
  specializations: any[];
  unique_courses: any[];
  language_of_instruction: string[];
  academic_calendar: string;
  credit_system: string;
  grading_system: string;
  academic_standards: string;
  research_areas: any[];
  faculty_student_ratio: string;
  class_sizes: string;
  teaching_methodology: string;
  online_learning_options: string;
  continuing_education: string;
  created_at: string;
}

interface University {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
  university_programs_academics?: UniversityProgramsAcademics;
}

interface AcademicVideo {
  id: string;
  title: string;
  youtube_url: string;
  thumbnail_url: string;
  description: string;
  duration: string;
  category: string;
  order_index: number;
}

export default function UniversityProgramsAcademicsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [academicsInfo, setAcademicsInfo] = useState<UniversityProgramsAcademics | null>(null);
  const [videos, setVideos] = useState<AcademicVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDegreeLevel, setSelectedDegreeLevel] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchUniversityProgramsData();
  }, [id]);

  const fetchUniversityProgramsData = async () => {
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

      // Fetch programs & academics info
      const { data: academicsData, error: academicsError } = await supabase
        .from('university_programs_academics')
        .select('*')
        .eq('university_id', id)
        .maybeSingle();

      if (academicsError) {
        console.error('Error fetching academics info:', academicsError);
      }

      // Generate mock data if no real data exists
      const mockAcademicsData: UniversityProgramsAcademics = academicsData || {
        id: 'mock-academics',
        university_id: id as string,
        faculties_colleges: [
          {
            name: 'College of Engineering',
            description: 'Leading engineering education with cutting-edge research facilities',
            departments: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'],
            established: 1965,
            dean: 'Dr. Sarah Johnson'
          },
          {
            name: 'School of Business',
            description: 'Innovative business education preparing future leaders',
            departments: ['Business Administration', 'Finance', 'Marketing', 'Management'],
            established: 1972,
            dean: 'Prof. Michael Chen'
          },
          {
            name: 'College of Arts & Sciences',
            description: 'Comprehensive liberal arts education fostering critical thinking',
            departments: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Psychology'],
            established: 1958,
            dean: 'Dr. Emily Rodriguez'
          },
          {
            name: 'School of Medicine',
            description: 'World-class medical education and research',
            departments: ['Internal Medicine', 'Surgery', 'Pediatrics', 'Psychiatry'],
            established: 1980,
            dean: 'Dr. Robert Kim'
          }
        ],
        departments: [
          'Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration',
          'Mathematics', 'Physics', 'Medicine', 'Law', 'Psychology', 'Biology'
        ],
        undergraduate_programs: [
          {
            name: 'Computer Science',
            degree_type: 'BSc',
            duration: '4 years',
            mode: 'full-time',
            description: 'Comprehensive computer science education with focus on software development and AI',
            ranking: 5,
            accreditation: 'ABET'
          },
          {
            name: 'Business Administration',
            degree_type: 'BBA',
            duration: '4 years',
            mode: 'full-time',
            description: 'Strategic business education with emphasis on leadership and innovation',
            ranking: 12,
            accreditation: 'AACSB'
          },
          {
            name: 'Electrical Engineering',
            degree_type: 'BEng',
            duration: '4 years',
            mode: 'full-time',
            description: 'Advanced electrical engineering with specializations in power systems and electronics',
            ranking: 8,
            accreditation: 'ABET'
          }
        ],
        postgraduate_programs: [
          {
            name: 'Master of Computer Science',
            degree_type: 'MSc',
            duration: '2 years',
            mode: 'full-time',
            description: 'Advanced computer science with research opportunities',
            ranking: 3,
            thesis_required: true
          },
          {
            name: 'MBA',
            degree_type: 'MBA',
            duration: '2 years',
            mode: 'full-time',
            description: 'Executive MBA program for working professionals',
            ranking: 15,
            thesis_required: false
          }
        ],
        doctoral_programs: [
          {
            name: 'PhD in Computer Science',
            degree_type: 'PhD',
            duration: '4-6 years',
            mode: 'full-time',
            description: 'Research-focused doctoral program in computer science',
            research_areas: ['AI/ML', 'Cybersecurity', 'Data Science', 'Software Engineering']
          }
        ],
        specializations: [
          'Artificial Intelligence', 'Cybersecurity', 'Data Science', 'Software Engineering',
          'International Business', 'Digital Marketing', 'Renewable Energy', 'Biomedical Engineering'
        ],
        unique_courses: [
          'Quantum Computing Fundamentals', 'Entrepreneurship in Tech', 'Sustainable Engineering',
          'Digital Ethics', 'Innovation Management'
        ],
        language_of_instruction: ['English', 'French'],
        academic_calendar: 'Semester system (Fall: September-December, Spring: January-May, Summer: June-August)',
        credit_system: 'Credit Hour System (120 credits for Bachelor\'s)',
        grading_system: 'GPA Scale 4.0 (A=4.0, B=3.0, C=2.0, D=1.0, F=0.0)',
        academic_standards: 'Minimum 2.0 GPA required for graduation, Dean\'s List for 3.5+ GPA',
        research_areas: [
          'Artificial Intelligence & Machine Learning',
          'Renewable Energy Systems',
          'Biomedical Engineering',
          'Sustainable Development',
          'Digital Innovation'
        ],
        faculty_student_ratio: '1:12',
        class_sizes: 'Average 25 students per class, seminars 15 students',
        teaching_methodology: 'Blended learning with hands-on projects, case studies, and research',
        online_learning_options: 'Hybrid courses available, full online programs for select degrees',
        continuing_education: 'Professional development courses, executive education, lifelong learning programs',
        created_at: new Date().toISOString()
      };

      setAcademicsInfo(mockAcademicsData);

      // Generate mock academic videos
      const mockVideos: AcademicVideo[] = Array.from({ length: 25 }, (_, index) => {
        const categories = [
          'Academic Structure', 'Degree Programs', 'Faculty Overview', 'Research Centers',
          'Student Life', 'Campus Tour', 'Program Highlights', 'International Programs'
        ];
        
        const videoTitles = [
          'Academic Excellence at Our University',
          'Exploring Our Engineering Programs',
          'Business School Overview',
          'Research Opportunities for Students',
          'Campus Life and Student Experience',
          'International Exchange Programs',
          'Faculty Research Highlights',
          'Innovation Labs and Facilities',
          'Graduate Program Overview',
          'Undergraduate Admissions Guide'
        ];

        return {
          id: `video-${index + 1}`,
          title: `${videoTitles[index % videoTitles.length]} - Part ${index + 1}`,
          youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index}`,
          thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
          description: `Learn about ${categories[index % categories.length].toLowerCase()} at ${universityData.name}`,
          duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          category: categories[index % categories.length],
          order_index: index
        };
      });

      setVideos(mockVideos);
    } catch (err) {
      console.error('Error fetching university programs data:', err);
      setError('Failed to load university programs information. Please try again.');
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

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getDegreeTypeColor = (degreeType: string) => {
    switch (degreeType.toLowerCase()) {
      case 'bsc':
      case 'ba':
      case 'beng':
      case 'bba':
        return '#3B82F6';
      case 'msc':
      case 'ma':
      case 'meng':
      case 'mba':
        return '#10B981';
      case 'phd':
      case 'dphil':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'full-time': return '#10B981';
      case 'part-time': return '#F59E0B';
      case 'online': return '#8B5CF6';
      case 'blended': return '#06B6D4';
      default: return '#6B7280';
    }
  };

  const filterPrograms = (programs: any[]) => {
    return programs.filter(program => {
      const matchesSearch = searchQuery.trim() === '' ||
        program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDegreeLevel = selectedDegreeLevel === 'all' ||
        (selectedDegreeLevel === 'undergraduate' && ['BSc', 'BA', 'BEng', 'BBA'].includes(program.degree_type)) ||
        (selectedDegreeLevel === 'postgraduate' && ['MSc', 'MA', 'MEng', 'MBA'].includes(program.degree_type)) ||
        (selectedDegreeLevel === 'doctoral' && ['PhD', 'DPhil'].includes(program.degree_type));

      const matchesMode = selectedMode === 'all' || program.mode === selectedMode;

      return matchesSearch && matchesDegreeLevel && matchesMode;
    });
  };

  const getVideosByCategory = (category: string) => {
    return videos.filter(video => video.category === category);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading programs & academics...</Text>
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

  const allPrograms = [
    ...(academicsInfo?.undergraduate_programs || []),
    ...(academicsInfo?.postgraduate_programs || []),
    ...(academicsInfo?.doctoral_programs || [])
  ];

  const filteredPrograms = filterPrograms(allPrograms);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.universityName}>Programs & Academics</Text>
            <Text style={styles.subtitle}>{university.name}</Text>
          </View>
        </View>

        {/* Academic Structure Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Building size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Academic Structure Overview</Text>
          </View>
          
          {/* Academic Structure Videos */}
          <View style={styles.videosSection}>
            <Text style={styles.videosTitle}>Academic Structure Videos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
              {getVideosByCategory('Academic Structure').map((video) => (
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
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.facultiesGrid}>
            {academicsInfo?.faculties_colleges.map((faculty: any, index: number) => (
              <View key={index} style={styles.facultyCard}>
                <View style={styles.facultyHeader}>
                  <Text style={styles.facultyName}>{faculty.name}</Text>
                  <Text style={styles.facultyEstablished}>Est. {faculty.established}</Text>
                </View>
                <Text style={styles.facultyDescription}>{faculty.description}</Text>
                <Text style={styles.facultyDean}>Dean: {faculty.dean}</Text>
                <View style={styles.departmentsList}>
                  {faculty.departments.map((dept: string, deptIndex: number) => (
                    <View key={deptIndex} style={styles.departmentTag}>
                      <Text style={styles.departmentText}>{dept}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Degree Levels Offered */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <GraduationCap size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Degree Levels Offered</Text>
          </View>

          {/* Degree Levels Videos */}
          <View style={styles.videosSection}>
            <Text style={styles.videosTitle}>Degree Programs Videos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
              {getVideosByCategory('Degree Programs').map((video) => (
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
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.degreeLevelsGrid}>
            <View style={styles.degreeLevelCard}>
              <GraduationCap size={32} color="#3B82F6" />
              <Text style={styles.degreeLevelTitle}>Undergraduate</Text>
              <Text style={styles.degreeLevelCount}>
                {academicsInfo?.undergraduate_programs.length || 0} programs
              </Text>
              <Text style={styles.degreeLevelDescription}>
                Bachelor's degrees (BSc, BA, BEng, BBA)
              </Text>
            </View>
            
            <View style={styles.degreeLevelCard}>
              <Award size={32} color="#10B981" />
              <Text style={styles.degreeLevelTitle}>Postgraduate</Text>
              <Text style={styles.degreeLevelCount}>
                {academicsInfo?.postgraduate_programs.length || 0} programs
              </Text>
              <Text style={styles.degreeLevelDescription}>
                Master's degrees (MSc, MA, MEng, MBA)
              </Text>
            </View>
            
            <View style={styles.degreeLevelCard}>
              <Trophy size={32} color="#8B5CF6" />
              <Text style={styles.degreeLevelTitle}>Doctoral</Text>
              <Text style={styles.degreeLevelCount}>
                {academicsInfo?.doctoral_programs.length || 0} programs
              </Text>
              <Text style={styles.degreeLevelDescription}>
                PhD and research degrees
              </Text>
            </View>
          </View>
        </View>

        {/* Program Listings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={24} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Program Listings</Text>
          </View>

          {/* Search and Filters */}
          <View style={styles.searchFiltersContainer}>
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

            <View style={styles.filtersRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[styles.filterButton, selectedDegreeLevel === 'all' && styles.activeFilterButton]}
                  onPress={() => setSelectedDegreeLevel('all')}
                >
                  <Text style={[styles.filterText, selectedDegreeLevel === 'all' && styles.activeFilterText]}>
                    All Levels
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, selectedDegreeLevel === 'undergraduate' && styles.activeFilterButton]}
                  onPress={() => setSelectedDegreeLevel('undergraduate')}
                >
                  <Text style={[styles.filterText, selectedDegreeLevel === 'undergraduate' && styles.activeFilterText]}>
                    Undergraduate
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, selectedDegreeLevel === 'postgraduate' && styles.activeFilterButton]}
                  onPress={() => setSelectedDegreeLevel('postgraduate')}
                >
                  <Text style={[styles.filterText, selectedDegreeLevel === 'postgraduate' && styles.activeFilterText]}>
                    Postgraduate
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, selectedDegreeLevel === 'doctoral' && styles.activeFilterButton]}
                  onPress={() => setSelectedDegreeLevel('doctoral')}
                >
                  <Text style={[styles.filterText, selectedDegreeLevel === 'doctoral' && styles.activeFilterText]}>
                    Doctoral
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            <View style={styles.filtersRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[styles.filterButton, selectedMode === 'all' && styles.activeFilterButton]}
                  onPress={() => setSelectedMode('all')}
                >
                  <Text style={[styles.filterText, selectedMode === 'all' && styles.activeFilterText]}>
                    All Modes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, selectedMode === 'full-time' && styles.activeFilterButton]}
                  onPress={() => setSelectedMode('full-time')}
                >
                  <Text style={[styles.filterText, selectedMode === 'full-time' && styles.activeFilterText]}>
                    Full-time
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, selectedMode === 'part-time' && styles.activeFilterButton]}
                  onPress={() => setSelectedMode('part-time')}
                >
                  <Text style={[styles.filterText, selectedMode === 'part-time' && styles.activeFilterText]}>
                    Part-time
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, selectedMode === 'online' && styles.activeFilterButton]}
                  onPress={() => setSelectedMode('online')}
                >
                  <Text style={[styles.filterText, selectedMode === 'online' && styles.activeFilterText]}>
                    Online
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>

          <Text style={styles.resultsCount}>
            {filteredPrograms.length} programs found
          </Text>

          <View style={styles.programsList}>
            {filteredPrograms.map((program: any, index: number) => (
              <View key={index} style={styles.programCard}>
                <View style={styles.programHeader}>
                  <View style={styles.programInfo}>
                    <Text style={styles.programName}>{program.name}</Text>
                    <Text style={styles.programDescription}>{program.description}</Text>
                  </View>
                  <View style={styles.programBadges}>
                    <View style={[styles.degreeTypeBadge, { backgroundColor: `${getDegreeTypeColor(program.degree_type)}15` }]}>
                      <Text style={[styles.degreeTypeText, { color: getDegreeTypeColor(program.degree_type) }]}>
                        {program.degree_type}
                      </Text>
                    </View>
                    {program.ranking && (
                      <View style={styles.rankingBadge}>
                        <Star size={12} color="#F59E0B" />
                        <Text style={styles.rankingText}>#{program.ranking}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.programDetails}>
                  <View style={styles.programDetailItem}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.programDetailText}>{program.duration}</Text>
                  </View>
                  <View style={styles.programDetailItem}>
                    <Monitor size={16} color={getModeColor(program.mode)} />
                    <Text style={[styles.programDetailText, { color: getModeColor(program.mode) }]}>
                      {program.mode}
                    </Text>
                  </View>
                  {program.accreditation && (
                    <View style={styles.programDetailItem}>
                      <Shield size={16} color="#10B981" />
                      <Text style={styles.accreditationText}>{program.accreditation}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Flagship & Notable Programs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Trophy size={24} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Flagship & Notable Programs</Text>
          </View>

          {/* Program Highlights Videos */}
          <View style={styles.videosSection}>
            <Text style={styles.videosTitle}>Program Highlights Videos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
              {getVideosByCategory('Program Highlights').map((video) => (
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
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.flagshipPrograms}>
            {allPrograms.filter(p => p.ranking && p.ranking <= 10).map((program: any, index: number) => (
              <View key={index} style={styles.flagshipCard}>
                <View style={styles.flagshipHeader}>
                  <Trophy size={20} color="#F59E0B" />
                  <Text style={styles.flagshipTitle}>{program.name}</Text>
                  <View style={styles.flagshipRanking}>
                    <Star size={14} color="#F59E0B" />
                    <Text style={styles.flagshipRankingText}>#{program.ranking} globally</Text>
                  </View>
                </View>
                <Text style={styles.flagshipDescription}>{program.description}</Text>
                {program.accreditation && (
                  <View style={styles.accreditationContainer}>
                    <Shield size={14} color="#10B981" />
                    <Text style={styles.accreditationLabel}>Accredited by {program.accreditation}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Special Academic Opportunities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={24} color="#06B6D4" />
            <Text style={styles.sectionTitle}>Special Academic Opportunities</Text>
          </View>

          {/* International Programs Videos */}
          <View style={styles.videosSection}>
            <Text style={styles.videosTitle}>International Programs Videos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
              {getVideosByCategory('International Programs').map((video) => (
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
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.opportunitiesGrid}>
            <View style={styles.opportunityCard}>
              <Globe size={24} color="#06B6D4" />
              <Text style={styles.opportunityTitle}>Exchange Programs</Text>
              <Text style={styles.opportunityDescription}>
                Study abroad opportunities with 50+ partner universities worldwide
              </Text>
            </View>
            
            <View style={styles.opportunityCard}>
              <Briefcase size={24} color="#10B981" />
              <Text style={styles.opportunityTitle}>Industry Partnerships</Text>
              <Text style={styles.opportunityDescription}>
                Internships and co-op programs with leading companies
              </Text>
            </View>
            
            <View style={styles.opportunityCard}>
              <Award size={24} color="#8B5CF6" />
              <Text style={styles.opportunityTitle}>Dual Degrees</Text>
              <Text style={styles.opportunityDescription}>
                Joint programs with international partner institutions
              </Text>
            </View>
            
            <View style={styles.opportunityCard}>
              <Lightbulb size={24} color="#F59E0B" />
              <Text style={styles.opportunityTitle}>Research Centers</Text>
              <Text style={styles.opportunityDescription}>
                {academicsInfo?.research_areas.length || 0} specialized research institutes
              </Text>
            </View>
          </View>
        </View>

        {/* Academic Calendar */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={24} color="#EC4899" />
            <Text style={styles.sectionTitle}>Academic Calendar</Text>
          </View>

          {/* Campus Tour Videos */}
          <View style={styles.videosSection}>
            <Text style={styles.videosTitle}>Campus Tour Videos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
              {getVideosByCategory('Campus Tour').map((video) => (
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
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.calendarCard}>
            <Text style={styles.calendarTitle}>Academic Year Structure</Text>
            <Text style={styles.calendarText}>{academicsInfo?.academic_calendar}</Text>
            
            <View style={styles.calendarDetails}>
              <View style={styles.calendarItem}>
                <Text style={styles.calendarLabel}>Credit System:</Text>
                <Text style={styles.calendarValue}>{academicsInfo?.credit_system}</Text>
              </View>
              <View style={styles.calendarItem}>
                <Text style={styles.calendarLabel}>Grading System:</Text>
                <Text style={styles.calendarValue}>{academicsInfo?.grading_system}</Text>
              </View>
              <View style={styles.calendarItem}>
                <Text style={styles.calendarLabel}>Academic Standards:</Text>
                <Text style={styles.calendarValue}>{academicsInfo?.academic_standards}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Accreditation & Recognition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Accreditation & Recognition</Text>
          </View>

          {/* Faculty Overview Videos */}
          <View style={styles.videosSection}>
            <Text style={styles.videosTitle}>Faculty Overview Videos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
              {getVideosByCategory('Faculty Overview').map((video) => (
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
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.accreditationGrid}>
            {allPrograms.filter(p => p.accreditation).map((program: any, index: number) => (
              <View key={index} style={styles.accreditationCard}>
                <Shield size={20} color="#10B981" />
                <Text style={styles.accreditationProgram}>{program.name}</Text>
                <Text style={styles.accreditationBody}>{program.accreditation}</Text>
                <Text style={styles.accreditationStatus}>Fully Accredited</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Learning Resources */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Zap size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>Learning Resources</Text>
          </View>

          {/* Research Centers Videos */}
          <View style={styles.videosSection}>
            <Text style={styles.videosTitle}>Research Centers & Facilities Videos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
              {getVideosByCategory('Research Centers').map((video) => (
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
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.resourcesGrid}>
            <View style={styles.resourceCard}>
              <BookOpen size={24} color="#3B82F6" />
              <Text style={styles.resourceTitle}>Libraries & Digital Resources</Text>
              <Text style={styles.resourceDescription}>
                State-of-the-art libraries with extensive digital collections
              </Text>
            </View>
            
            <View style={styles.resourceCard}>
              <Lightbulb size={24} color="#8B5CF6" />
              <Text style={styles.resourceTitle}>Research Labs</Text>
              <Text style={styles.resourceDescription}>
                Advanced laboratories for hands-on learning and research
              </Text>
            </View>
            
            <View style={styles.resourceCard}>
              <Zap size={24} color="#F59E0B" />
              <Text style={styles.resourceTitle}>Innovation Hubs</Text>
              <Text style={styles.resourceDescription}>
                Collaborative spaces for entrepreneurship and innovation
              </Text>
            </View>
            
            <View style={styles.resourceCard}>
              <Monitor size={24} color="#10B981" />
              <Text style={styles.resourceTitle}>Online Learning</Text>
              <Text style={styles.resourceDescription}>
                {academicsInfo?.online_learning_options}
              </Text>
            </View>
          </View>
        </View>

        {/* Teaching Excellence */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={24} color="#14B8A6" />
            <Text style={styles.sectionTitle}>Teaching Excellence</Text>
          </View>

          {/* Student Life Videos */}
          <View style={styles.videosSection}>
            <Text style={styles.videosTitle}>Student Experience Videos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
              {getVideosByCategory('Student Life').map((video) => (
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
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.teachingStats}>
            <View style={styles.statCard}>
              <Users size={20} color="#14B8A6" />
              <Text style={styles.statLabel}>Faculty-Student Ratio</Text>
              <Text style={styles.statValue}>{academicsInfo?.faculty_student_ratio}</Text>
            </View>
            
            <View style={styles.statCard}>
              <Target size={20} color="#8B5CF6" />
              <Text style={styles.statLabel}>Average Class Size</Text>
              <Text style={styles.statValue}>{academicsInfo?.class_sizes}</Text>
            </View>
          </View>

          <View style={styles.methodologyCard}>
            <Text style={styles.methodologyTitle}>Teaching Methodology</Text>
            <Text style={styles.methodologyText}>{academicsInfo?.teaching_methodology}</Text>
          </View>
        </View>

        {/* Research Areas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lightbulb size={24} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Research Areas</Text>
          </View>

          <View style={styles.researchGrid}>
            {academicsInfo?.research_areas.map((area: string, index: number) => (
              <View key={index} style={styles.researchCard}>
                <Lightbulb size={20} color="#8B5CF6" />
                <Text style={styles.researchArea}>{area}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Unique Courses & Specializations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Star size={24} color="#F97316" />
            <Text style={styles.sectionTitle}>Unique Courses & Specializations</Text>
          </View>

          <View style={styles.uniqueCoursesContainer}>
            <Text style={styles.subsectionTitle}>Unique Courses</Text>
            <View style={styles.coursesList}>
              {academicsInfo?.unique_courses.map((course: string, index: number) => (
                <View key={index} style={styles.courseTag}>
                  <Text style={styles.courseText}>{course}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.specializationsContainer}>
            <Text style={styles.subsectionTitle}>Specializations</Text>
            <View style={styles.specializationsList}>
              {academicsInfo?.specializations.map((spec: string, index: number) => (
                <View key={index} style={styles.specializationCard}>
                  <Target size={16} color="#F97316" />
                  <Text style={styles.specializationText}>{spec}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Language & International */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={24} color="#06B6D4" />
            <Text style={styles.sectionTitle}>Language & International</Text>
          </View>

          <View style={styles.languageCard}>
            <Text style={styles.languageTitle}>Languages of Instruction</Text>
            <View style={styles.languagesList}>
              {academicsInfo?.language_of_instruction.map((language: string, index: number) => (
                <View key={index} style={styles.languageTag}>
                  <Globe size={14} color="#06B6D4" />
                  <Text style={styles.languageText}>{language}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Continuing Education */}
        {academicsInfo?.continuing_education && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BookOpen size={24} color="#84CC16" />
              <Text style={styles.sectionTitle}>Continuing Education</Text>
            </View>
            <Text style={styles.sectionContent}>{academicsInfo.continuing_education}</Text>
          </View>
        )}
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
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  backIcon: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  subtitle: {
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
    marginHorizontal: 16,
    marginBottom: 16,
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
  videosSection: {
    marginBottom: 20,
  },
  videosTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  videosContainer: {
    marginBottom: 8,
  },
  videoCard: {
    width: 180,
    marginRight: 12,
  },
  videoThumbnail: {
    position: 'relative',
    width: '100%',
    height: 100,
    borderRadius: 8,
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
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  durationText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  videoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    lineHeight: 18,
  },
  facultiesGrid: {
    gap: 16,
  },
  facultyCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  facultyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  facultyName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  facultyEstablished: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  facultyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  facultyDean: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginBottom: 12,
  },
  departmentsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  departmentTag: {
    backgroundColor: '#3B82F615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  departmentText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  degreeLevelsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  degreeLevelCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  degreeLevelTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  degreeLevelCount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginBottom: 6,
  },
  degreeLevelDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  searchFiltersContainer: {
  undergraduateFocusCard: {
    backgroundColor: '#F8FAFC',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  undergraduateFocusTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  undergraduateFocusCount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginBottom: 12,
    textAlign: 'center',
  },
  undergraduateFocusDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  degreeTypesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  degreeTypeTag: {
    backgroundColor: '#3B82F615',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  degreeTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
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
  filtersRow: {
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  programsList: {
    gap: 12,
  },
  programCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  programInfo: {
    flex: 1,
  },
  programName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  programDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  programBadges: {
    alignItems: 'flex-end',
    gap: 6,
  },
  degreeTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  degreeTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  rankingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  rankingText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
  },
  programDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  programDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  programDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  accreditationText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  flagshipPrograms: {
    gap: 12,
  },
  flagshipCard: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FED7AA',
  },
  flagshipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  flagshipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    flex: 1,
    marginLeft: 8,
  },
  flagshipRanking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flagshipRankingText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#D97706',
  },
  flagshipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#78350F',
    lineHeight: 20,
    marginBottom: 8,
  },
  accreditationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accreditationLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  opportunitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  opportunityCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  opportunityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 6,
    textAlign: 'center',
  },
  opportunityDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  calendarCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  calendarTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  calendarText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  calendarDetails: {
    gap: 8,
  },
  calendarItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  calendarValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  accreditationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  accreditationCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  accreditationProgram: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  accreditationBody: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    marginBottom: 4,
  },
  accreditationStatus: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#16A34A',
  },
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  resourceCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resourceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 6,
    textAlign: 'center',
  },
  resourceDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  teachingStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  methodologyCard: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  methodologyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 8,
  },
  methodologyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    lineHeight: 20,
  },
  researchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  researchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  researchArea: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  uniqueCoursesContainer: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  coursesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  courseTag: {
    backgroundColor: '#F97316',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  courseText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  specializationsContainer: {
    marginTop: 8,
  },
  specializationsList: {
    gap: 8,
  },
  specializationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  specializationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  languageCard: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  languageTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 12,
  },
  languagesList: {
    flexDirection: 'row',
    gap: 8,
  },
  languageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  languageText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
  },
});