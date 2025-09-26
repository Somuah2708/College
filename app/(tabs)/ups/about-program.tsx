import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  ExternalLink, 
  BookOpen, 
  Target, 
  Lightbulb,
  History,
  Globe
} from 'lucide-react-native';

interface ProgramVideo {
  id: string;
  title: string;
  youtube_url: string;
  thumbnail_url: string;
  description: string;
  duration: string;
  order_index: number;
}

interface ProgramDetails {
  id: string;
  name: string;
  duration_years: number;
  department: string;
  purpose: string;
  core_philosophy: string;
  relevance_and_applications: string;
  history_and_evolution: string;
  wikipedia_links: any[];
  external_links: any[];
  universities?: {
    name: string;
    location: string;
  };
}

export default function AboutProgramScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [videos, setVideos] = useState<ProgramVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProgramData();
  }, [id]);

  const fetchProgramData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching program data for ID:', id);
      
      const { data: programData, error: programError } = await supabase
        .from('academic_programs')
        .select(`
          *,
          universities (
            name,
            location
          )
        `)
        .eq('id', id)
        .single();

      if (programError) {
        console.error('❌ Error fetching program:', programError);
        throw programError;
      }

      if (!programData) {
        console.error('❌ No program data found for ID:', id);
        throw new Error('Program not found');
      }

      console.log('✅ Program data fetched successfully:', programData);

      // Set program data from Supabase
      setProgram({
        id: programData.id,
        name: programData.name,
        duration_years: programData.duration_years,
        department: programData.department,
        purpose: programData.purpose || 'Program purpose information will be available soon.',
        core_philosophy: programData.core_philosophy || 'Core philosophy information will be available soon.',
        relevance_and_applications: programData.relevance_and_applications || 'Relevance and applications information will be available soon.',
        history_and_evolution: programData.history_and_evolution || 'History and evolution information will be available soon.',
        wikipedia_links: programData.wikipedia_links || [],
        external_links: programData.external_links || [],
        universities: programData.universities
      });

      // Fetch program videos from Supabase
      const { data: videosData, error: videosError } = await supabase
        .from('program_videos')
        .select('*')
        .eq('program_id', id)
        .order('order_index');

      if (videosError) {
        console.error('⚠️ Error fetching videos (continuing without videos):', videosError);
        // Continue without videos if there's an error
        setVideos([]);
      } else {
        console.log('✅ Videos data fetched:', videosData);
        const formattedVideos: ProgramVideo[] = (videosData || []).map(video => ({
          id: video.id,
          title: video.title,
          youtube_url: video.youtube_url,
          thumbnail_url: video.thumbnail_url || 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          description: video.description || '',
          duration: video.duration || '10:00',
          order_index: video.order_index || 0
        }));
        setVideos(formattedVideos);
        }
      
      console.log('✅ All program data loaded successfully');
    } catch (err) {
      console.error('❌ Error in fetchProgramData:', err);
      setError(`Failed to load program information: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const openYouTubeVideo = (url: string) => {
    Linking.openURL(url);
  };

  const openExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading program information...</Text>
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
          <TouchableOpacity style={styles.retryButton} onPress={fetchProgramData}>
            <Text style={styles.retryButtonText}>Retry</Text>
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
            <Text style={styles.programName}>{program.name}</Text>
            <Text style={styles.universityName}>{program.universities?.name || 'University not specified'}</Text>
          </View>
        </View>

        {/* Program Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Program Overview</Text>
          </View>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Duration</Text>
              <Text style={styles.overviewValue}>{program.duration_years ? `${program.duration_years} years` : 'Duration not specified'}</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewLabel}>Department</Text>
              <Text style={styles.overviewValue}>{program.department || 'Department not specified'}</Text>
            </View>
          </View>
        </View>

        {/* Purpose */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Purpose</Text>
          </View>
          <Text style={styles.sectionContent}>{program.purpose || 'Purpose information not available for this program'}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lightbulb size={24} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Core Philosophy</Text>
          </View>
          <Text style={styles.sectionContent}>{program.core_philosophy || 'Core philosophy information not available for this program'}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Play size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>Program Explanation Videos</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
            {videos.map((video) => (
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
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={24} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Relevance & Applications</Text>
          </View>
          <Text style={styles.sectionContent}>{program.relevance_and_applications || 'Relevance and applications information not available for this program.'}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <History size={24} color="#06B6D4" />
            <Text style={styles.sectionTitle}>History & Evolution</Text>
          </View>
          <Text style={styles.sectionContent}>{program.history_and_evolution || 'History and evolution information not available for this program.'}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ExternalLink size={24} color="#EC4899" />
            <Text style={styles.sectionTitle}>Wikipedia Resources</Text>
          </View>
          <View style={styles.linksContainer}>
            {program.wikipedia_links && program.wikipedia_links.length > 0 ? (
              program.wikipedia_links
                .filter(link => link && typeof link === 'object' && typeof link.title === 'string' && typeof link.url === 'string' && link.title.trim() && link.url.trim())
                .map((link, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.linkCard}
                    onPress={() => openExternalLink(link.url)}
                  >
                    <View style={styles.linkContent}>
                      <Text style={styles.linkTitle}>{link.title}</Text>
                      <ExternalLink size={16} color="#6B7280" />
                    </View>
                  </TouchableOpacity>
                ))
            ) : (
              <TouchableOpacity 
                style={styles.linkCard}
                onPress={() => openExternalLink(`https://en.wikipedia.org/wiki/${encodeURIComponent(program.name.replace(/\s+/g, '_'))}`)}
              >
                <View style={styles.linkContent}>
                  <Text style={styles.linkTitle}>Wikipedia: {program.name}</Text>
                  <ExternalLink size={16} color="#6B7280" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ExternalLink size={24} color="#14B8A6" />
            <Text style={styles.sectionTitle}>Additional Resources</Text>
          </View>
          <View style={styles.linksContainer}>
            {program.external_links && program.external_links.length > 0 ? (
              program.external_links
                .filter(link => link && typeof link === 'object' && typeof link.title === 'string' && typeof link.url === 'string' && link.title.trim() && link.url.trim())
                .map((link, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.linkCard}
                    onPress={() => openExternalLink(link.url)}
                  >
                    <View style={styles.linkContent}>
                      <Text style={styles.linkTitle}>{link.title}</Text>
                      <ExternalLink size={16} color="#6B7280" />
                    </View>
                  </TouchableOpacity>
                ))
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.linkCard}
                  onPress={() => openExternalLink(`https://www.coursera.org/search?query=${encodeURIComponent(program.name)}`)}
                >
                  <View style={styles.linkContent}>
                    <Text style={styles.linkTitle}>Coursera: {program.name} Courses</Text>
                    <ExternalLink size={16} color="#6B7280" />
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.linkCard}
                  onPress={() => openExternalLink(`https://www.edx.org/search?q=${encodeURIComponent(program.name)}`)}
                >
                  <View style={styles.linkContent}>
                    <Text style={styles.linkTitle}>edX: {program.name} Programs</Text>
                    <ExternalLink size={16} color="#6B7280" />
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.linkCard}
                  onPress={() => openExternalLink(`https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(program.name)}`)}
                >
                  <View style={styles.linkContent}>
                    <Text style={styles.linkTitle}>Khan Academy: {program.name} Resources</Text>
                    <ExternalLink size={16} color="#6B7280" />
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.linkCard}
                  onPress={() => openExternalLink(`https://scholar.google.com/scholar?q=${encodeURIComponent(program.name + ' academic research')}`)}
                >
                  <View style={styles.linkContent}>
                    <Text style={styles.linkTitle}>Google Scholar: {program.name} Research</Text>
                    <ExternalLink size={16} color="#6B7280" />
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.linkCard}
                  onPress={() => openExternalLink(`https://www.youtube.com/results?search_query=${encodeURIComponent(program.name + ' university program overview')}`)}
                >
                  <View style={styles.linkContent}>
                    <Text style={styles.linkTitle}>YouTube: {program.name} Program Videos</Text>
                    <ExternalLink size={16} color="#6B7280" />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
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
  retryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  retryButtonText: {
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
  overviewGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  overviewItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
  },
  overviewLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  videosContainer: {
    marginTop: 8,
  },
  videoCard: {
    width: 200,
    marginRight: 16,
  },
  videoThumbnail: {
    position: 'relative',
    width: '100%',
    height: 112,
    borderRadius: 12,
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
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginTop: 8,
    lineHeight: 18,
  },
  linksContainer: {
    gap: 12,
  },
  linkCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  linkTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    flex: 1,
  },
  linkContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
});