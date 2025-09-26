import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  BookOpen, 
  Calendar,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react-native';

interface CourseVideo {
  id: string;
  title: string;
  youtube_url: string;
  thumbnail_url: string;
  description: string;
  duration: string;
  order_index: number;
}

interface Course {
  id: string;
  course_code: string;
  course_name: string;
  semester: number;
  year: number;
  credits: number;
  description: string;
  prerequisites: string;
  videos: CourseVideo[];
}

interface ProgramDetails {
  id: string;
  name: string;
  universities?: {
    name: string;
    location: string;
  };
}

export default function CourseJourneyScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch program details
      const { data: programData, error: programError } = await supabase
        .from('academic_programs')
        .select(`
          id,
          name,
          description,
          department,
          level,
          duration_years,
          universities (
            name,
            location,
            website
          )
        `)
        .eq('id', id)
        .single();

      if (programError) {
        console.error('Error fetching program details:', programError);
        throw programError;
      }

      if (!programData) {
        throw new Error('Program not found');
      }

      console.log('Program details loaded:', programData);
      setProgram(programData);

      // Fetch courses for this program
      const { data: coursesData, error: coursesError } = await supabase
        .from('program_courses')
        .select('*')
        .eq('program_id', id)
        .order('year')
        .order('semester')
        .order('course_code');

      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        throw coursesError;
      }

      console.log(`Found ${coursesData?.length || 0} courses for program`);

      // Fetch videos for each course
      const coursesWithVideos: Course[] = [];
      
      for (const course of coursesData || []) {
        const { data: videosData, error: videosError } = await supabase
          .from('course_videos')
          .select('*')
          .eq('course_id', course.id)
          .order('order_index');

        if (videosError) {
          console.error('Error fetching videos for course:', course.id, videosError);
          // Continue without videos for this course
        }

        coursesWithVideos.push({
          id: course.id,
          course_code: course.course_code,
          course_name: course.course_name,
          semester: course.semester,
          year: course.year,
          credits: course.credits || 3,
          description: course.description || '',
          prerequisites: course.prerequisites || '',
          videos: (videosData || []).map(video => ({
            id: video.id,
            title: video.title,
            youtube_url: video.youtube_url,
            thumbnail_url: video.thumbnail_url || 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            description: video.description || '',
            duration: video.duration || '10:00',
            order_index: video.order_index || 0
          }))
        });
      }

      console.log(`Processed ${coursesWithVideos.length} courses with videos`);
      setCourses(coursesWithVideos);
    } catch (err) {
      console.error('Error fetching course data:', err);
      setError('Failed to load course information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openYouTubeVideo = (url: string) => {
    Linking.openURL(url);
  };

  const toggleCourseExpansion = (courseId: string) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  const groupCoursesBySemester = () => {
    const grouped: { [key: string]: Course[] } = {};
    courses.forEach(course => {
      const key = `Year ${course.year} - Semester ${course.semester}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(course);
    });
    return grouped;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading course journey...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !program) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Program not found'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const groupedCourses = groupCoursesBySemester();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.programName}>Course Journey</Text>
            <Text style={styles.universityName}>{program.name} - {program.universities?.name}</Text>
          </View>
        </View>

        {Object.entries(groupedCourses).map(([semesterKey, semesterCourses]) => (
          <View key={semesterKey} style={styles.semesterSection}>
            <View style={styles.semesterHeader}>
              <Calendar size={24} color="#3B82F6" />
              <Text style={styles.semesterTitle}>{semesterKey}</Text>
            </View>
            
            {semesterCourses.map((course) => (
              <View key={course.id} style={styles.courseCard}>
                <TouchableOpacity
                  style={styles.courseHeader}
                  onPress={() => toggleCourseExpansion(course.id)}
                >
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseCode}>{course.course_code}</Text>
                    <Text style={styles.courseName}>{course.course_name}</Text>
                    <View style={styles.courseDetails}>
                      <View style={styles.creditsBadge}>
                        <Award size={14} color="#10B981" />
                        <Text style={styles.creditsText}>{course.credits} credits</Text>
                      </View>
                      {course.prerequisites && (
                        <Text style={styles.prerequisites}>Prerequisites: {course.prerequisites.trim()}</Text>
                      )}
                    </View>
                  </View>
                  {expandedCourses.has(course.id) ? (
                    <ChevronUp size={24} color="#6B7280" />
                  ) : (
                    <ChevronDown size={24} color="#6B7280" />
                  )}
                </TouchableOpacity>

                {expandedCourses.has(course.id) && (
                  <View style={styles.courseContent}>
                    <View style={styles.descriptionSection}>
                      <View style={styles.descriptionHeader}>
                        <BookOpen size={20} color="#8B5CF6" />
                        <Text style={styles.descriptionTitle}>Course Description</Text>
                      </View>
                      <Text style={styles.courseDescription}>{course.description}</Text>
                    </View>

                    <View style={styles.videosSection}>
                      <View style={styles.videosHeader}>
                        <Play size={20} color="#EF4444" />
                        <Text style={styles.videosTitle}>Course Videos</Text>
                      </View>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
                        {course.videos.map((video) => (
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
                  </View>
                )}
              </View>
            ))}
          </View>
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
  semesterSection: {
    margin: 16,
  },
  semesterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  semesterTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 12,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  courseName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  courseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  creditsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  creditsText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  prerequisites: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  courseContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  descriptionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  courseDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  videosSection: {
    marginTop: 8,
  },
  videosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  videosTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  videosContainer: {
    marginTop: 8,
  },
  videoCard: {
    width: 160,
    marginRight: 12,
  },
  videoThumbnail: {
    position: 'relative',
    width: '100%',
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  durationText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  videoTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginTop: 8,
    lineHeight: 16,
  },
});