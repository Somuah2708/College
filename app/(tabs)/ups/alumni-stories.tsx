import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  ExternalLink, 
  GraduationCap, 
  MapPin, 
  Building, 
  Star,
  Search,
  ListFilter as Filter,
  Calendar,
  Award,
  Users,
  Briefcase,
  Heart
} from 'lucide-react-native';

interface AlumniStory {
  id: string;
  alumni_name: string;
  graduation_year: number;
  current_position: string;
  current_company: string;
  story_title: string;
  story_summary: string;
  full_story: string;
  youtube_video_url: string;
  video_thumbnail_url: string;
  video_duration: string;
  linkedin_profile: string;
  achievements: any[];
  career_path: any[];
  advice_to_students: string;
  location: string;
  industry: string;
  story_category: string;
  featured: boolean;
  order_index: number;
}

interface ProgramDetails {
  id: string;
  name: string;
  universities?: {
    name: string;
    location: string;
  };
}

export default function AlumniStoriesScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [stories, setStories] = useState<AlumniStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<AlumniStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchAlumniStories();
  }, [id]);

  useEffect(() => {
    filterStories();
  }, [searchQuery, selectedCategory, stories]);

  const fetchAlumniStories = async () => {
    try {
      setLoading(true);
      
      // Fetch actual program details from Supabase
      const { data: programData, error: programError } = await supabase
        .from('academic_programs')
        .select(`
          id,
          name,
          department,
          level,
          universities (
            name,
            location
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

      const actualProgram: ProgramDetails = {
        id: programData.id,
        name: programData.name,
        universities: programData.universities
      };

      // Generate comprehensive mock alumni stories (simulating up to 500 stories)
      const mockStories: AlumniStory[] = Array.from({ length: 50 }, (_, index) => {
        const names = [
          'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 'Jessica Williams',
          'Robert Taylor', 'Maria Garcia', 'James Wilson', 'Lisa Anderson', 'Kevin Brown',
          'Amanda Davis', 'Christopher Lee', 'Rachel Martinez', 'Daniel Thompson', 'Nicole White',
          'Matthew Harris', 'Ashley Clark', 'Ryan Lewis', 'Stephanie Walker', 'Brandon Hall'
        ];
        
        const categories = ['career_success', 'entrepreneurship', 'research', 'social_impact'];
        const locations = ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA'];

        const name = names[index % names.length];
        const category = categories[index % categories.length];
        const location = locations[index % locations.length];
        const graduationYear = 2015 + (index % 10);

        // Generate program-specific career paths and achievements
        const programSpecificPositions = generatePositionsForProgram(actualProgram.name);
        const programSpecificCompanies = generateCompaniesForProgram(actualProgram.name);
        const programSpecificAchievements = generateAchievementsForProgram(actualProgram.name);
        const programSpecificIndustry = getIndustryForProgram(actualProgram.name);

        const company = programSpecificCompanies[index % programSpecificCompanies.length];
        const position = programSpecificPositions[index % programSpecificPositions.length];

        return {
          id: `story-${index + 1}`,
          alumni_name: name,
          graduation_year: graduationYear,
          current_position: position,
          current_company: company,
          story_title: `From ${actualProgram.name} Student to ${position}: My Journey`,
          story_summary: `${name} shares their inspiring journey from ${actualProgram.name.toLowerCase()} student to ${position}, highlighting key challenges, breakthrough moments, and valuable lessons learned along the way.`,
          full_story: `After graduating in ${graduationYear} with a degree in ${actualProgram.name}, I started my career in the field. Through dedication, continuous learning, and taking on challenging projects, I've grown into my current role. The foundation I built during my ${actualProgram.name.toLowerCase()} program was crucial to my success.`,
          youtube_video_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index}`,
          video_thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
          video_duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          linkedin_profile: `https://linkedin.com/in/${name.toLowerCase().replace(' ', '-')}`,
          achievements: programSpecificAchievements,
          career_path: [
            { year: graduationYear, role: `Junior ${actualProgram.name} Professional`, company: 'Entry Level Company' },
            { year: graduationYear + 2, role: `${actualProgram.name} Specialist`, company: 'Mid-size Company' },
            { year: graduationYear + 5, role: position, company: company }
          ],
          advice_to_students: `Focus on building strong fundamentals in ${actualProgram.name.toLowerCase()}, never stop learning, and don't be afraid to take on challenging projects that push you out of your comfort zone.`,
          location: location,
          industry: programSpecificIndustry,
          story_category: category,
          featured: index < 5,
          order_index: index
        };
      });

      setProgram(actualProgram);
      setStories(mockStories);
      setFilteredStories(mockStories);
    } catch (err) {
      setError('Failed to load alumni stories');
    } finally {
      setLoading(false);
    }
  };

  const generatePositionsForProgram = (programName: string): string[] => {
    const name = programName.toLowerCase();
    
    if (name.includes('computer science') || name.includes('software')) {
      return ['Software Engineer', 'Senior Software Engineer', 'Tech Lead', 'Engineering Manager', 'CTO', 'Data Scientist', 'AI Engineer', 'DevOps Engineer'];
    } else if (name.includes('business') || name.includes('management')) {
      return ['Business Analyst', 'Project Manager', 'Operations Manager', 'CEO', 'Strategy Consultant', 'Marketing Director', 'Financial Analyst', 'Product Manager'];
    } else if (name.includes('engineering')) {
      return ['Design Engineer', 'Project Engineer', 'Senior Engineer', 'Engineering Manager', 'Chief Engineer', 'Technical Director', 'R&D Manager', 'Consultant Engineer'];
    } else if (name.includes('medicine') || name.includes('health')) {
      return ['Medical Doctor', 'Specialist Physician', 'Surgeon', 'Medical Director', 'Public Health Officer', 'Medical Researcher', 'Healthcare Administrator', 'Clinical Director'];
    } else if (name.includes('law')) {
      return ['Associate Lawyer', 'Senior Associate', 'Partner', 'Judge', 'Legal Counsel', 'Attorney General', 'Legal Advisor', 'Corporate Lawyer'];
    } else if (name.includes('psychology')) {
      return ['Clinical Psychologist', 'Research Psychologist', 'Counseling Psychologist', 'Organizational Psychologist', 'Psychology Professor', 'Therapy Director', 'Mental Health Coordinator'];
    } else if (name.includes('education')) {
      return ['Teacher', 'Principal', 'Education Director', 'Curriculum Specialist', 'Education Consultant', 'Academic Dean', 'Education Minister', 'Training Manager'];
    } else {
      return [`${programName} Specialist`, `Senior ${programName} Professional`, `${programName} Manager`, `${programName} Director`, `${programName} Consultant`, `${programName} Expert`];
    }
  };

  const generateCompaniesForProgram = (programName: string): string[] => {
    const name = programName.toLowerCase();
    
    if (name.includes('computer science') || name.includes('software')) {
      return ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'Uber', 'Airbnb', 'Spotify'];
    } else if (name.includes('business') || name.includes('management')) {
      return ['McKinsey & Company', 'Boston Consulting Group', 'Deloitte', 'PwC', 'Goldman Sachs', 'JP Morgan', 'Coca-Cola', 'Unilever', 'Procter & Gamble', 'Johnson & Johnson'];
    } else if (name.includes('engineering')) {
      return ['General Electric', 'Siemens', 'Boeing', 'Lockheed Martin', 'Caterpillar', 'Ford', 'Toyota', 'Shell', 'ExxonMobil', 'Chevron'];
    } else if (name.includes('medicine') || name.includes('health')) {
      return ['Johns Hopkins Hospital', 'Mayo Clinic', 'Cleveland Clinic', 'WHO', 'CDC', 'Pfizer', 'Johnson & Johnson', 'Novartis', 'Roche', 'Merck'];
    } else if (name.includes('law')) {
      return ['Baker McKenzie', 'Clifford Chance', 'Linklaters', 'Freshfields', 'Allen & Overy', 'Supreme Court', 'Ministry of Justice', 'UN Legal Affairs', 'World Bank Legal'];
    } else if (name.includes('psychology')) {
      return ['Mayo Clinic', 'Johns Hopkins', 'Harvard Medical School', 'APA', 'Mental Health America', 'NIMH', 'Psychology Today', 'BetterHelp', 'Headspace'];
    } else {
      return [`Leading ${programName} Company`, `Global ${programName} Corporation`, `${programName} Innovations Inc`, `Premier ${programName} Group`, `${programName} Solutions Ltd`];
    }
  };

  const generateAchievementsForProgram = (programName: string): string[] => {
    const name = programName.toLowerCase();
    
    if (name.includes('computer science') || name.includes('software')) {
      return ['Led team of 15+ engineers', 'Launched 3 major product features', 'Increased system performance by 40%'];
    } else if (name.includes('business') || name.includes('management')) {
      return ['Increased company revenue by 25%', 'Led successful merger and acquisition', 'Managed $50M+ budget portfolio'];
    } else if (name.includes('engineering')) {
      return ['Designed award-winning infrastructure project', 'Reduced manufacturing costs by 30%', 'Led team of 20+ engineers'];
    } else if (name.includes('medicine') || name.includes('health')) {
      return ['Published 15+ peer-reviewed papers', 'Pioneered new treatment protocol', 'Saved 1000+ lives through medical practice'];
    } else if (name.includes('law')) {
      return ['Won 85% of court cases', 'Drafted landmark legislation', 'Represented high-profile clients successfully'];
    } else if (name.includes('psychology')) {
      return ['Developed innovative therapy techniques', 'Published groundbreaking research', 'Helped 500+ patients overcome challenges'];
    } else {
      return [`Achieved excellence in ${programName.toLowerCase()}`, `Led innovative ${programName.toLowerCase()} projects`, `Made significant impact in ${programName.toLowerCase()} field`];
    }
  };

  const getIndustryForProgram = (programName: string): string => {
    const name = programName.toLowerCase();
    
    if (name.includes('computer science') || name.includes('software')) return 'Technology';
    if (name.includes('business') || name.includes('management')) return 'Business & Finance';
    if (name.includes('engineering')) return 'Engineering & Manufacturing';
    if (name.includes('medicine') || name.includes('health')) return 'Healthcare';
    if (name.includes('law')) return 'Legal Services';
    if (name.includes('psychology')) return 'Mental Health & Psychology';
    if (name.includes('education')) return 'Education';
    return 'Professional Services';
  };

  const filterStories = () => {
    let filtered = stories;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(story =>
        story.alumni_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.current_company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.current_position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.story_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.industry.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(story => story.story_category === selectedCategory);
    }

    setFilteredStories(filtered);
  };

  const openYouTubeVideo = (url: string) => {
    Linking.openURL(url);
  };

  const openLinkedInProfile = (url: string) => {
    Linking.openURL(url);
  };

  const getCategoryIcon = (category: string) => {
    const safeCategory = category || '';
    switch (safeCategory) {
      case 'career_success': return Briefcase;
      case 'entrepreneurship': return Star;
      case 'research': return Award;
      case 'social_impact': return Heart;
      default: return Users;
    }
  };

  const getCategoryColor = (category: string) => {
    const safeCategory = category || '';
    switch (safeCategory) {
      case 'career_success': return '#3B82F6';
      case 'entrepreneurship': return '#10B981';
      case 'research': return '#8B5CF6';
      case 'social_impact': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading alumni stories...</Text>
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

  const categories = [
    { key: 'all', label: 'All Stories', count: stories.length },
    { key: 'career_success', label: 'Career Success', count: stories.filter(s => s.story_category === 'career_success').length },
    { key: 'entrepreneurship', label: 'Entrepreneurship', count: stories.filter(s => s.story_category === 'entrepreneurship').length },
    { key: 'research', label: 'Research', count: stories.filter(s => s.story_category === 'research').length },
    { key: 'social_impact', label: 'Social Impact', count: stories.filter(s => s.story_category === 'social_impact').length }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.programName}>Alumni Stories</Text>
            <Text style={styles.universityName}>{program.name} - {program.universities?.name}</Text>
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search alumni, companies, or positions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[styles.filterButton, selectedCategory === category.key && styles.filterButtonActive]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Text style={[styles.filterText, selectedCategory === category.key && styles.filterTextActive]}>
                  {category.label} ({category.count})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredStories.length} alumni stories found
          </Text>
        </View>

        {/* Featured Stories */}
        {selectedCategory === 'all' && (
          <View style={styles.featuredSection}>
            <Text style={styles.featuredTitle}>Featured Stories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredContainer}>
              {stories.filter(story => story.featured).map((story) => (
                <View key={story.id} style={styles.featuredCard}>
                  <TouchableOpacity
                    style={styles.featuredVideo}
                    onPress={() => openYouTubeVideo(story.youtube_video_url)}
                  >
                    <Image 
                      source={{ uri: story.video_thumbnail_url }} 
                      style={styles.featuredThumbnail}
                      defaultSource={{ uri: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' }}
                    />
                    <View style={styles.playOverlay}>
                      <Play size={24} color="#FFFFFF" />
                    </View>
                    <View style={styles.durationBadge}>
                      <Clock size={12} color="#FFFFFF" />
                      <Text style={styles.durationText}>{story.video_duration}</Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.featuredName}>{story.alumni_name}</Text>
                  <Text style={styles.featuredPosition}>{story.current_position}</Text>
                  <Text style={styles.featuredCompany}>{story.current_company}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* All Stories */}
        {filteredStories.map((story) => (
          <View key={story.id} style={styles.storyCard}>
            <View style={styles.storyHeader}>
              <View style={styles.alumniInfo}>
                <Text style={styles.alumniName}>{story.alumni_name}</Text>
                <Text style={styles.graduationYear}>Class of {story.graduation_year}</Text>
                <Text style={styles.currentRole}>{story.current_position}</Text>
                <Text style={styles.currentCompany}>{story.current_company}</Text>
              </View>
              <View style={styles.storyMeta}>
                <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(story.story_category)}15` }]}>
                  {React.createElement(getCategoryIcon(story.story_category), { 
                    size: 14, 
                    color: getCategoryColor(story.story_category) 
                  })}
                  <Text style={[styles.categoryText, { color: getCategoryColor(story.story_category) }]}>
                    {(story.story_category || '').replace('_', ' ')}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.storyTitle}>{story.story_title}</Text>
            <Text style={styles.storySummary}>{story.story_summary}</Text>

            <View style={styles.storyDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.detailText}>{story.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Building size={16} color="#6B7280" />
                <Text style={styles.detailText}>{story.industry}</Text>
              </View>
            </View>

            {/* Video Section */}
            <TouchableOpacity
              style={styles.videoSection}
              onPress={() => openYouTubeVideo(story.youtube_video_url)}
            >
              <View style={styles.videoThumbnail}>
                <Image 
                  source={{ uri: story.video_thumbnail_url }} 
                  style={styles.thumbnailImage}
                  defaultSource={{ uri: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' }}
                />
                <View style={styles.playButton}>
                  <Play size={20} color="#FFFFFF" />
                </View>
                <View style={styles.videoDuration}>
                  <Clock size={12} color="#FFFFFF" />
                  <Text style={styles.videoDurationText}>{story.video_duration}</Text>
                </View>
              </View>
              <Text style={styles.watchVideoText}>Watch {story.alumni_name}'s Story</Text>
            </TouchableOpacity>

            {/* Achievements */}
            {story.achievements.length > 0 && (
              <View style={styles.achievementsSection}>
                <Text style={styles.achievementsTitle}>Key Achievements</Text>
                {story.achievements.map((achievement, index) => (
                  <View key={index} style={styles.achievementItem}>
                    <Award size={14} color="#10B981" />
                    <Text style={styles.achievementText}>{achievement}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Advice */}
            {story.advice_to_students && (
              <View style={styles.adviceSection}>
                <Text style={styles.adviceTitle}>Advice to Students</Text>
                <Text style={styles.adviceText}>"{story.advice_to_students}"</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => openYouTubeVideo(story.youtube_video_url)}
              >
                <Play size={16} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Watch Story</Text>
              </TouchableOpacity>
              
              {story.linkedin_profile && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => openLinkedInProfile(story.linkedin_profile)}
                >
                  <ExternalLink size={16} color="#3B82F6" />
                  <Text style={styles.secondaryButtonText}>LinkedIn</Text>
                </TouchableOpacity>
              )}
            </View>
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
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  filterContainer: {
    flexDirection: 'row',
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
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  resultsCount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  featuredSection: {
    paddingVertical: 20,
  },
  featuredTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  featuredContainer: {
    paddingLeft: 24,
  },
  featuredCard: {
    width: 200,
    marginRight: 16,
  },
  featuredVideo: {
    position: 'relative',
    width: '100%',
    height: 112,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  featuredThumbnail: {
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
  featuredName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  featuredPosition: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginBottom: 2,
  },
  featuredCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  storyCard: {
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
  storyHeader: {
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
  graduationYear: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 6,
  },
  currentRole: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginBottom: 2,
  },
  currentCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  storyMeta: {
    alignItems: 'flex-end',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  storyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  storySummary: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  storyDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  videoSection: {
    marginBottom: 16,
  },
  videoThumbnail: {
    position: 'relative',
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 12,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  videoDurationText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  watchVideoText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    textAlign: 'center',
  },
  achievementsSection: {
    marginBottom: 16,
  },
  achievementsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  achievementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
  },
  adviceSection: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    marginBottom: 20,
  },
  adviceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
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
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    gap: 4,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
});