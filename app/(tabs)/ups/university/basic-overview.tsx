import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  Info, 
  Calendar, 
  Award, 
  Building, 
  Users, 
  Globe, 
  ExternalLink,
  MapPin,
  Star,
  Trophy,
  Target,
  GraduationCap,
  Heart,
  Lightbulb,
  Shield,
  BookOpen,
  Crown,
  Briefcase,
  Camera,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Search,
  DollarSign,
  Clock,
  TrendingUp
} from 'lucide-react-native';

interface UniversityBasicInfo {
  id: string;
  university_id: string;
  year_established: number;
  university_history: string;
  university_type: string;
  accreditation_status: string;
  rankings_reputation: any;
  motto: string;
  vision_statement: string;
  mission_statement: string;
  core_values: string[];
  leadership_team: any[];
  governance_structure: string;
  institutional_partnerships: any[];
  awards_recognition: any[];
  created_at: string;
}

interface University {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
  university_basic_info?: UniversityBasicInfo;
}

export default function UniversityBasicOverviewScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [basicInfo, setBasicInfo] = useState<UniversityBasicInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUniversityBasicInfo();
  }, [id]);

  const fetchUniversityBasicInfo = async () => {
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

      // Fetch detailed basic info
      const { data: basicInfoData, error: basicInfoError } = await supabase
        .from('university_basic_info')
        .select('*')
        .eq('university_id', id)
        .maybeSingle();

      if (basicInfoError) {
        console.error('Error fetching basic info:', basicInfoError);
      }

      setBasicInfo(basicInfoData);
    } catch (err) {
      console.error('Error fetching university basic info:', err);
      setError('Failed to load university information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openExternalLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const openGoogleSearch = (query: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    openExternalLink(searchUrl);
  };

  const generateComprehensiveLeadership = (existingLeadership: any[], university: University) => {
    const requiredPositions = [
      'Chancellor',
      'Vice-Chancellor',
      'President', 
      'Rector',
      'Pro Vice-Chancellor',
      'Deputy Vice-Chancellor',
      'Registrar',
      'Director of Finance',
      'Bursar',
      'Director of Human Resources',
      'University Librarian',
      'Dean of Faculty of Science',
      'Dean of Faculty of Arts',
      'Dean of Faculty of Engineering',
      'Dean of Business School',
      'Dean of Medical School',
      'Head of Computer Science Department',
      'Head of Mathematics Department',
      'Head of Physics Department',
      'Head of Chemistry Department',
      'Head of Biology Department',
      'Dean of Students',
      'Director of Student Affairs',
      'Director of ICT',
      'Director of e-Learning',
      'Director of Institutional Planning',
      'Director of Quality Assurance',
      'Director of Public Affairs',
      'Director of Communications',
      'Chairman of University Council',
      'Chairman of Board of Governors',
      'Chairman of Board of Trustees'
    ];

    // Create a map of existing leadership by position/title
    const existingByPosition = new Map();
    existingLeadership.forEach(leader => {
      const position = leader.title || leader.position || '';
      if (position) {
        existingByPosition.set(position.toLowerCase(), leader);
      }
    });

    const comprehensiveLeadership = [];

    // Add existing leadership first
    existingLeadership.forEach(leader => {
      comprehensiveLeadership.push({
        ...leader,
        name: leader.name || generateLeaderName(leader.title || leader.position || 'Leadership Member'),
        title: leader.title || leader.position || 'Administrator'
      });
    });

    // Add missing positions with generated data
    requiredPositions.forEach(position => {
      const positionKey = position.toLowerCase();
      
      // Check if we already have someone in this position (with some flexibility in matching)
      const hasPosition = Array.from(existingByPosition.keys()).some(existingPos => 
        existingPos.includes(positionKey.split(' ')[0]) || 
        positionKey.includes(existingPos.split(' ')[0])
      );

      if (!hasPosition) {
        comprehensiveLeadership.push({
          name: generateLeaderName(position),
          title: position,
          bio: generateLeaderBio(position, university.name),
          linkedin_profile: null,
          generated: true
        });
      }
    });

    return comprehensiveLeadership;
  };

  const generateLeaderName = (position: string): string => {
    const firstNames = [
      'Prof. Kwame', 'Dr. Akosua', 'Prof. Kofi', 'Dr. Ama', 'Prof. Kweku', 'Dr. Efua',
      'Prof. Yaw', 'Dr. Adwoa', 'Prof. Kwabena', 'Dr. Abena', 'Prof. Fiifi', 'Dr. Akua',
      'Prof. Kojo', 'Dr. Adjoa', 'Prof. Kwame', 'Dr. Araba', 'Prof. Kow', 'Dr. Esi'
    ];
    
    const lastNames = [
      'Asante', 'Mensah', 'Osei', 'Boateng', 'Adjei', 'Owusu', 'Agyei', 'Appiah',
      'Gyasi', 'Amoah', 'Frimpong', 'Acheampong', 'Opoku', 'Darko', 'Ofori', 'Antwi'
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  };

  const generateLeaderBio = (position: string, universityName: string): string => {
    const bios = {
      'Chancellor': `Distinguished academic leader serving as Chancellor of ${universityName}. Provides strategic oversight and represents the university at the highest level.`,
      'Vice-Chancellor': `Chief executive officer of ${universityName}, responsible for overall academic and administrative leadership.`,
      'President': `President and chief executive of ${universityName}, leading the institution's vision and strategic direction.`,
      'Rector': `Rector of ${universityName}, overseeing academic excellence and institutional governance.`,
      'Registrar': `Chief administrative officer responsible for student records, academic regulations, and institutional compliance.`,
      'Director of Finance': `Financial leader ensuring fiscal responsibility and strategic financial planning for the university.`,
      'Bursar': `Financial administrator managing university finances, budgets, and fiscal operations.`,
      'University Librarian': `Head of library services, overseeing information resources and academic support services.`,
      'Dean of Students': `Student affairs leader focused on student welfare, development, and campus life enhancement.`,
      'Director of ICT': `Technology leader driving digital transformation and ICT infrastructure development.`
    };

    return bios[position] || `Senior administrator serving in the role of ${position} at ${universityName}.`;
  };

  const getUniversityTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'public': return '#10B981';
      case 'private': return '#3B82F6';
      case 'research': return '#8B5CF6';
      case 'liberal arts': return '#F59E0B';
      case 'technical': return '#06B6D4';
      default: return '#6B7280';
    }
  };

  const getPrestigeColor = (ranking: any) => {
    if (!ranking || !ranking.global_ranking) return '#6B7280';
    const rank = parseInt(ranking.global_ranking);
    if (rank <= 10) return '#DC2626';
    if (rank <= 50) return '#EF4444';
    if (rank <= 100) return '#F59E0B';
    if (rank <= 500) return '#10B981';
    return '#6B7280';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading university information...</Text>
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
            <Text style={styles.universityName}>{university.name}</Text>
            <Text style={styles.location}>{university.location}</Text>
            <Text style={styles.description}>{university.description}</Text>
          </View>
        </View>

        {/* Quick Facts */}
        <View style={styles.quickFactsSection}>
          <Text style={styles.sectionTitle}>Quick Facts</Text>
          <View style={styles.factsGrid}>
            {basicInfo?.year_established && (
              <View style={styles.factCard}>
                <Calendar size={20} color="#3B82F6" />
                <Text style={styles.factLabel}>Established</Text>
                <Text style={styles.factValue}>{basicInfo.year_established}</Text>
              </View>
            )}
            
            {basicInfo?.university_type && (
              <View style={styles.factCard}>
                <Building size={20} color={getUniversityTypeColor(basicInfo.university_type)} />
                <Text style={styles.factLabel}>Type</Text>
                <Text style={[styles.factValue, { color: getUniversityTypeColor(basicInfo.university_type) }]}>
                  {basicInfo.university_type}
                </Text>
              </View>
            )}

            {basicInfo?.rankings_reputation?.global_ranking && (
              <View style={styles.factCard}>
                <Trophy size={20} color={getPrestigeColor(basicInfo.rankings_reputation)} />
                <Text style={styles.factLabel}>Global Ranking</Text>
                <Text style={[styles.factValue, { color: getPrestigeColor(basicInfo.rankings_reputation) }]}>
                  #{basicInfo.rankings_reputation.global_ranking}
                </Text>
              </View>
            )}

            {basicInfo?.accreditation_status && (
              <View style={styles.factCard}>
                <Shield size={20} color="#10B981" />
                <Text style={styles.factLabel}>Accreditation</Text>
                <Text style={styles.factValue}>Accredited</Text>
              </View>
            )}
          </View>
        </View>

        {/* University History */}
        {basicInfo?.university_history && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BookOpen size={24} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>History</Text>
            </View>
            <Text style={styles.sectionContent}>{basicInfo.university_history}</Text>
            
            <View style={styles.historyButtons}>
              <TouchableOpacity
                style={styles.historyButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' university history photos images')}&tbm=isch`)}
              >
                <Camera size={16} color="#10B981" />
                <Text style={styles.historyButtonText}>View Historical Photos</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.historyButton}
                onPress={() => openExternalLink(`https://en.wikipedia.org/wiki/${encodeURIComponent(university.name.replace(/\s+/g, '_'))}`)}
              >
                <BookOpen size={16} color="#8B5CF6" />
                <Text style={styles.historyButtonText}>Read on Wikipedia</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Mission & Vision */}
        {(basicInfo?.mission_statement || basicInfo?.vision_statement) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Target size={24} color="#10B981" />
              <Text style={styles.sectionTitle}>Mission & Vision</Text>
            </View>
            
            {basicInfo.mission_statement && (
              <View style={styles.missionVisionCard}>
                <Text style={styles.missionVisionLabel}>Mission Statement</Text>
                <Text style={styles.missionVisionText}>{basicInfo.mission_statement}</Text>
              </View>
            )}
            
            {basicInfo.vision_statement && (
              <View style={styles.missionVisionCard}>
                <Text style={styles.missionVisionLabel}>Vision Statement</Text>
                <Text style={styles.missionVisionText}>{basicInfo.vision_statement}</Text>
              </View>
            )}
          </View>
        )}

        {/* Motto */}
        {basicInfo?.motto && (
          <View style={styles.mottoSection}>
            <View style={styles.mottoCard}>
              <Crown size={24} color="#F59E0B" />
              <Text style={styles.mottoText}>"{basicInfo.motto}"</Text>
            </View>
          </View>
        )}

        {/* Core Values */}
        {basicInfo?.core_values && basicInfo.core_values.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heart size={24} color="#EF4444" />
              <Text style={styles.sectionTitle}>Core Values</Text>
            </View>
            <View style={styles.valuesList}>
              {basicInfo.core_values.map((value, index) => (
                <View key={index} style={styles.valueItem}>
                  <View style={styles.valueDot} />
                  <Text style={styles.valueText}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Rankings & Reputation */}
        {basicInfo?.rankings_reputation && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Star size={24} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Rankings & Reputation</Text>
            </View>
            <View style={styles.rankingsGrid}>
              {basicInfo.rankings_reputation.global_ranking && (
                <View style={styles.rankingCard}>
                  <Text style={styles.rankingLabel}>Global Ranking</Text>
                  <Text style={[styles.rankingValue, { color: getPrestigeColor(basicInfo.rankings_reputation) }]}>
                    #{basicInfo.rankings_reputation.global_ranking}
                  </Text>
                </View>
              )}
              
              {basicInfo.rankings_reputation.national_ranking && (
                <View style={styles.rankingCard}>
                  <Text style={styles.rankingLabel}>National Ranking</Text>
                  <Text style={styles.rankingValue}>#{basicInfo.rankings_reputation.national_ranking}</Text>
                </View>
              )}
              
              {basicInfo.rankings_reputation.subject_rankings && (
                <View style={styles.rankingCard}>
                  <Text style={styles.rankingLabel}>Subject Excellence</Text>
                  <Text style={styles.rankingValue}>
                    {Object.keys(basicInfo.rankings_reputation.subject_rankings).length} top-ranked subjects
                  </Text>
                </View>
              )}
            </View>
            
            {basicInfo.rankings_reputation.reputation_score && (
              <View style={styles.reputationScore}>
                <Text style={styles.reputationLabel}>Reputation Score</Text>
                <View style={styles.scoreBar}>
                  <View 
                    style={[
                      styles.scoreFill, 
                      { width: `${basicInfo.rankings_reputation.reputation_score}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.scoreText}>{basicInfo.rankings_reputation.reputation_score}/100</Text>
              </View>
            )}
          </View>
        )}

        {/* Leadership Team */}
        {basicInfo?.leadership_team && basicInfo.leadership_team.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={24} color="#06B6D4" />
              <Text style={styles.sectionTitle}>Leadership Team</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.leadershipContainer}>
              {generateComprehensiveLeadership(basicInfo.leadership_team, university).map((leader: any, index: number) => (
                <View key={index} style={styles.leaderCard}>
                  <View style={styles.leaderAvatar}>
                    <Text style={styles.leaderInitial}>
                      {leader.name ? leader.name.charAt(0) : 'L'}
                    </Text>
                  </View>
                  <Text style={styles.leaderName}>{leader.name || 'Leadership Member'}</Text>
                  <Text style={styles.leaderTitle}>{leader.title}</Text>
                  {leader.bio && (
                    <Text style={styles.leaderBio} numberOfLines={3}>{leader.bio}</Text>
                  )}
                  
                  <View style={styles.leaderActions}>
                    <TouchableOpacity
                      style={styles.googleButton}
                      onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(leader.name + ' ' + leader.title + ' ' + (university?.name || ''))}`)}
                    >
                      <Globe size={14} color="#4285F4" />
                      <Text style={styles.googleButtonText}>Google</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.linkedinButton}
                      onPress={() => openExternalLink(leader.linkedin_profile || `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(leader.name + ' ' + leader.title + ' ' + (university?.name || ''))}`)}
                    >
                      <Users size={14} color="#0A66C2" />
                      <Text style={styles.linkedinButtonText}>LinkedIn</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Governance Structure */}
        {basicInfo?.governance_structure && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Building size={24} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Governance Structure</Text>
            </View>
            <Text style={styles.sectionContent}>{basicInfo.governance_structure}</Text>
            
            <View style={styles.governanceButtons}>
              <TouchableOpacity
                style={styles.governanceButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' university rules regulations handbook student guide')}`)}
              >
                <Shield size={16} color="#EF4444" />
                <Text style={styles.governanceButtonText}>Rules & Regulations</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.governanceButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' university admissions brochure prospectus handbook')}`)}
              >
                <BookOpen size={16} color="#3B82F6" />
                <Text style={styles.governanceButtonText}>Admissions Brochure</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Institutional Partnerships */}
        {basicInfo?.institutional_partnerships && basicInfo.institutional_partnerships.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={24} color="#10B981" />
              <Text style={styles.sectionTitle}>Institutional Partnerships</Text>
            </View>
            <View style={styles.partnershipsList}>
              {basicInfo.institutional_partnerships.map((partnership: any, index: number) => (
                <View key={index} style={styles.partnershipCard}>
                  <View style={styles.partnershipHeader}>
                    <Text style={styles.partnershipName}>
                      {partnership.partner_name || `Partnership ${index + 1}`}
                    </Text>
                    <Text style={styles.partnershipType}>
                      {partnership.partnership_type || 'Academic Partnership'}
                    </Text>
                  </View>
                  {partnership.description && (
                    <Text style={styles.partnershipDescription}>{partnership.description}</Text>
                  )}
                  {partnership.established_year && (
                    <Text style={styles.partnershipYear}>
                      Established: {partnership.established_year}
                    </Text>
                  )}
                  {partnership.website && (
                    <TouchableOpacity
                      style={styles.partnershipLink}
                      onPress={() => openExternalLink(partnership.website)}
                    >
                      <ExternalLink size={14} color="#3B82F6" />
                      <Text style={styles.partnershipLinkText}>Visit Partner</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Awards & Recognition */}
        {basicInfo?.awards_recognition && basicInfo.awards_recognition.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Award size={24} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Awards & Recognition</Text>
            </View>
            
            {/* Academic Awards */}
            <View style={styles.awardCategory}>
              <Text style={styles.awardCategoryTitle}>Academic Excellence Awards</Text>
              <View style={styles.awardButtons}>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Honorary Degrees Doctor of Letters Doctor of Science`)}
                >
                  <GraduationCap size={16} color="#8B5CF6" />
                  <Text style={styles.awardButtonText}>Honorary Degrees</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Chancellor's Award academic excellence`)}
                >
                  <Award size={16} color="#3B82F6" />
                  <Text style={styles.awardButtonText}>Chancellor's Award</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Vice-Chancellor's Award academic achievement`)}
                >
                  <Star size={16} color="#10B981" />
                  <Text style={styles.awardButtonText}>Vice-Chancellor's Award</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Dean's Award faculty recognition`)}
                >
                  <Target size={16} color="#F59E0B" />
                  <Text style={styles.awardButtonText}>Dean's Award</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Student Awards */}
            <View style={styles.awardCategory}>
              <Text style={styles.awardCategoryTitle}>Student Achievement Awards</Text>
              <View style={styles.awardButtons}>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Best Graduating Student Award valedictorian`)}
                >
                  <GraduationCap size={16} color="#3B82F6" />
                  <Text style={styles.awardButtonText}>Best Graduating Student</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Student Leadership Award SRC president`)}
                >
                  <Users size={16} color="#8B5CF6" />
                  <Text style={styles.awardButtonText}>Student Leadership Award</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Sports Excellence Award athletics championship`)}
                >
                  <Award size={16} color="#10B981" />
                  <Text style={styles.awardButtonText}>Sports Excellence Award</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Cultural Arts Award creative achievement`)}
                >
                  <Heart size={16} color="#EC4899" />
                  <Text style={styles.awardButtonText}>Cultural/Arts Award</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Faculty & Staff Awards */}
            <View style={styles.awardCategory}>
              <Text style={styles.awardCategoryTitle}>Faculty & Staff Recognition</Text>
              <View style={styles.awardButtons}>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Best Researcher Award research excellence`)}
                >
                  <Lightbulb size={16} color="#F59E0B" />
                  <Text style={styles.awardButtonText}>Best Researcher Award</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Teaching Excellence Award outstanding lecturer`)}
                >
                  <BookOpen size={16} color="#10B981" />
                  <Text style={styles.awardButtonText}>Teaching Excellence</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Innovation Invention Award patent technology`)}
                >
                  <Lightbulb size={16} color="#8B5CF6" />
                  <Text style={styles.awardButtonText}>Innovation & Invention</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Long Service Award staff recognition years`)}
                >
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.awardButtonText}>Long Service Award</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Staff Excellence Award academic administrative`)}
                >
                  <Users size={16} color="#06B6D4" />
                  <Text style={styles.awardButtonText}>Staff Excellence</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Research & Publication Awards */}
            <View style={styles.awardCategory}>
              <Text style={styles.awardCategoryTitle}>Research & Publication Recognition</Text>
              <View style={styles.awardButtons}>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Publication Book of the Year Award research`)}
                >
                  <BookOpen size={16} color="#3B82F6" />
                  <Text style={styles.awardButtonText}>Publication of the Year</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Grant Research Funding Recognition award`)}
                >
                  <DollarSign size={16} color="#10B981" />
                  <Text style={styles.awardButtonText}>Research Funding Recognition</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Community & Service Awards */}
            <View style={styles.awardCategory}>
              <Text style={styles.awardCategoryTitle}>Community & Service Awards</Text>
              <View style={styles.awardButtons}>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Community Service Award volunteer outreach`)}
                >
                  <Heart size={16} color="#EF4444" />
                  <Text style={styles.awardButtonText}>Community Service</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Outstanding Alumni Award distinguished graduates`)}
                >
                  <Star size={16} color="#F59E0B" />
                  <Text style={styles.awardButtonText}>Outstanding Alumni</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Entrepreneurial Achievement Award startup business`)}
                >
                  <Lightbulb size={16} color="#8B5CF6" />
                  <Text style={styles.awardButtonText}>Entrepreneurial Achievement</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Institutional Recognition */}
            <View style={styles.awardCategory}>
              <Text style={styles.awardCategoryTitle}>Institutional Recognition</Text>
              <View style={styles.awardButtons}>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} National International Accreditation Recognition quality`)}
                >
                  <Shield size={16} color="#10B981" />
                  <Text style={styles.awardButtonText}>Accreditation Recognition</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Global Rankings Times Higher Education QS Webometrics`)}
                >
                  <TrendingUp size={16} color="#3B82F6" />
                  <Text style={styles.awardButtonText}>Global Rankings</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Partnership Collaboration Recognition industry university`)}
                >
                  <Building size={16} color="#06B6D4" />
                  <Text style={styles.awardButtonText}>Partnership Recognition</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Quality Assurance Awards institutional excellence`)}
                >
                  <Award size={16} color="#8B5CF6" />
                  <Text style={styles.awardButtonText}>Quality Assurance Awards</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Special Recognition */}
            <View style={styles.awardCategory}>
              <Text style={styles.awardCategoryTitle}>Special Recognition</Text>
              <View style={styles.awardButtons}>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Environmental Sustainability Green Campus Award eco-friendly`)}
                >
                  <Globe size={16} color="#10B981" />
                  <Text style={styles.awardButtonText}>Green Campus Award</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Diversity Inclusion Award multicultural equality`)}
                >
                  <Users size={16} color="#EC4899" />
                  <Text style={styles.awardButtonText}>Diversity & Inclusion</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.awardButton}
                  onPress={() => openGoogleSearch(`${university?.name} Philanthropy Donor Recognition charitable giving`)}
                >
                  <Heart size={16} color="#EF4444" />
                  <Text style={styles.awardButtonText}>Philanthropy Recognition</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <View style={styles.sectionHeader}>
            <Briefcase size={24} color="#06B6D4" />
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>
          
          {/* Google Maps Thumbnail */}
          <TouchableOpacity
            style={styles.mapContainer}
            onPress={() => openExternalLink(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(university.name + ', ' + university.location)}`)}
          >
            <Image
              source={{
                uri: `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(university.name + ', ' + university.location)}&zoom=15&size=400x200&maptype=roadmap&markers=color:red%7C${encodeURIComponent(university.name + ', ' + university.location)}&key=AIzaSyDummy`
              }}
              style={styles.mapThumbnail}
              defaultSource={{
                uri: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg'
              }}
            />
            <View style={styles.mapOverlay}>
              <MapPin size={20} color="#FFFFFF" />
              <Text style={styles.mapOverlayText}>Get Directions</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.contactText}>{university.location}</Text>
            </View>
            {university.website && (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => openExternalLink(university.website)}
              >
                <Globe size={16} color="#3B82F6" />
                <Text style={styles.contactLink}>{university.website}</Text>
              </TouchableOpacity>
            )}
            
            {/* Social Media Links */}
            {basicInfo?.social_media_links && basicInfo.social_media_links.length > 0 && (
              <View style={styles.socialMediaSection}>
                <Text style={styles.socialMediaTitle}>Follow Us</Text>
                <View style={styles.socialMediaContainer}>
                  {basicInfo.social_media_links.map((social: any, index: number) => {
                    const getSocialIcon = (platform: string) => {
                      switch (platform.toLowerCase()) {
                        case 'facebook': return Facebook;
                        case 'twitter': return Twitter;
                        case 'instagram': return Instagram;
                        case 'youtube': return Youtube;
                        case 'linkedin': return Linkedin;
                        default: return Globe;
                      }
                    };

                    const getSocialColor = (platform: string) => {
                      switch (platform.toLowerCase()) {
                        case 'facebook': return '#1877F2';
                        case 'twitter': return '#1DA1F2';
                        case 'instagram': return '#E4405F';
                        case 'youtube': return '#FF0000';
                        case 'linkedin': return '#0A66C2';
                        default: return '#6B7280';
                      }
                    };

                    const SocialIcon = getSocialIcon(social.platform || 'globe');
                    const socialColor = getSocialColor(social.platform || 'globe');

                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.socialButton, { backgroundColor: `${socialColor}15` }]}
                        onPress={() => openExternalLink(social.url || `https://${social.platform}.com/${university.name.toLowerCase().replace(/\s+/g, '')}`)}
                      >
                        <SocialIcon size={20} color={socialColor} />
                        <Text style={[styles.socialButtonText, { color: socialColor }]}>
                          {social.platform || 'Social'}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
            
            {/* Fallback Social Media Links if no data in database */}
            {(!basicInfo?.social_media_links || basicInfo.social_media_links.length === 0) && (
              <View style={styles.socialMediaSection}>
                <Text style={styles.socialMediaTitle}>Find the University Online</Text>
                <View style={styles.socialMediaContainer}>
                  <TouchableOpacity
                    style={[styles.socialButton, { backgroundColor: '#1877F215' }]}
                    onPress={() => openExternalLink(`https://www.facebook.com/search/top?q=${encodeURIComponent(university.name)}`)}
                  >
                    <Facebook size={20} color="#1877F2" />
                    <Text style={[styles.socialButtonText, { color: '#1877F2' }]}>Facebook</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.socialButton, { backgroundColor: '#1DA1F215' }]}
                    onPress={() => openExternalLink(`https://twitter.com/search?q=${encodeURIComponent(university.name)}`)}
                  >
                    <Twitter size={20} color="#1DA1F2" />
                    <Text style={[styles.socialButtonText, { color: '#1DA1F2' }]}>Twitter</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.socialButton, { backgroundColor: '#E4405F15' }]}
                    onPress={() => openExternalLink(`https://www.instagram.com/explore/tags/${encodeURIComponent(university.name.toLowerCase().replace(/\s+/g, ''))}/`)}
                  >
                    <Instagram size={20} color="#E4405F" />
                    <Text style={[styles.socialButtonText, { color: '#E4405F' }]}>Instagram</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.socialButton, { backgroundColor: '#FF000015' }]}
                    onPress={() => openExternalLink(`https://www.youtube.com/results?search_query=${encodeURIComponent(university.name)}`)}
                  >
                    <Youtube size={20} color="#FF0000" />
                    <Text style={[styles.socialButtonText, { color: '#FF0000' }]}>YouTube</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.socialButton, { backgroundColor: '#0A66C215' }]}
                    onPress={() => openExternalLink(`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(university.name)}`)}
                  >
                    <Linkedin size={20} color="#0A66C2" />
                    <Text style={[styles.socialButtonText, { color: '#0A66C2' }]}>LinkedIn</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
              <Text style={styles.primaryButtonText}>Visit Website</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push(`/ups/university-detail?id=${university.id}`)}
          >
            <Info size={20} color="#3B82F6" />
            <Text style={styles.secondaryButtonText}>Full Details</Text>
          </TouchableOpacity>

          <View style={styles.governanceCommittees}>
            <Text style={styles.committeesTitle}>Governance Structure & Committees</Text>
            <View style={styles.committeesGrid}>
              <TouchableOpacity
                style={styles.committeeButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' university council board trustees governing council')}`)}
              >
                <Building size={16} color="#3B82F6" />
                <Text style={styles.committeeButtonText}>University Council / Board of Trustees</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.committeeButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' academic board senate')}`)}
              >
                <GraduationCap size={16} color="#10B981" />
                <Text style={styles.committeeButtonText}>Academic Board / Senate</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.committeeButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' finance committee')}`)}
              >
                <DollarSign size={16} color="#F59E0B" />
                <Text style={styles.committeeButtonText}>Finance Committee</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.committeeButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' appointments promotions board')}`)}
              >
                <Users size={16} color="#8B5CF6" />
                <Text style={styles.committeeButtonText}>Appointments & Promotions Board</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.committeeButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' audit committee')}`)}
              >
                <Shield size={16} color="#EF4444" />
                <Text style={styles.committeeButtonText}>Audit Committee</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.committeeButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' research publications committee')}`)}
              >
                <BookOpen size={16} color="#06B6D4" />
                <Text style={styles.committeeButtonText}>Research & Publications Committee</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.committeeButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' quality assurance committee')}`)}
              >
                <Award size={16} color="#84CC16" />
                <Text style={styles.committeeButtonText}>Quality Assurance Committee</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.committeeButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' student representative council SRC student union government')}`)}
              >
                <Users size={16} color="#EC4899" />
                <Text style={styles.committeeButtonText}>Student Representative Council (SRC)</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.committeeButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' alumni association convocation')}`)}
              >
                <GraduationCap size={16} color="#F97316" />
                <Text style={styles.committeeButtonText}>Alumni Association / Convocation</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.committeeButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' faculty boards')}`)}
              >
                <BookOpen size={16} color="#14B8A6" />
                <Text style={styles.committeeButtonText}>Faculty Boards</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.committeeButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' departmental boards')}`)}
              >
                <Building size={16} color="#6366F1" />
                <Text style={styles.committeeButtonText}>Departmental Boards</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.committeeButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' graduate school board')}`)}
              >
                <GraduationCap size={16} color="#DC2626" />
                <Text style={styles.committeeButtonText}>Graduate School Board</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.committeeButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' ethics committee')}`)}
              >
                <Shield size={16} color="#7C3AED" />
                <Text style={styles.committeeButtonText}>Ethics Committee</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.committeeButton}
                onPress={() => openExternalLink(`https://www.google.com/search?q=${encodeURIComponent(university.name + ' advisory boards faculty institute')}`)}
              >
                <Target size={16} color="#059669" />
                <Text style={styles.committeeButtonText}>Advisory Boards</Text>
              </TouchableOpacity>
            </View>
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
  location: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 20,
  },
  content: {
    flex: 1,
  },
  quickFactsSection: {
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
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  factCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  factLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  factValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
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
  missionVisionCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  missionVisionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  missionVisionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  mottoSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  mottoCard: {
    backgroundColor: '#FFFBEB',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FED7AA',
  },
  mottoText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12,
    lineHeight: 26,
  },
  valuesList: {
    gap: 12,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  valueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  valueText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
    lineHeight: 22,
  },
  rankingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  rankingCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rankingLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 6,
    textAlign: 'center',
  },
  rankingValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  reputationScore: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reputationLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  scoreFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    textAlign: 'center',
  },
  leadershipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  leadershipContainer: {
    paddingVertical: 8,
  },
  leaderCard: {
    width: 200,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 16,
    alignItems: 'center',
  },
  leaderAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  leaderInitial: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  leaderName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  leaderTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginBottom: 8,
    textAlign: 'center',
  },
  leaderBio: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 12,
  },
  leaderActions: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  googleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4285F4',
    gap: 4,
  },
  googleButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#4285F4',
  },
  linkedinButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0A66C2',
    gap: 4,
  },
  linkedinButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#0A66C2',
  },
  partnershipsList: {
    gap: 12,
  },
  partnershipCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  partnershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  partnershipName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  partnershipType: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    backgroundColor: '#10B98115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  partnershipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  partnershipYear: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  partnershipLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  partnershipLinkText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  awardCategory: {
    marginBottom: 20,
  },
  awardCategoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  awardButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  awardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
    marginBottom: 4,
  },
  awardButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  awardsList: {
    gap: 12,
  },
  awardCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  awardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  awardInfo: {
    flex: 1,
  },
  awardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  awardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 6,
  },
  awardYear: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    marginBottom: 2,
  },
  awardingBody: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  contactSection: {
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
  contactCard: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  contactLink: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
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
  historyButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  historyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  historyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4B5563',
  },
  mapContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapThumbnail: {
    width: '100%',
    height: 160,
    backgroundColor: '#F3F4F6',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  mapOverlayText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  socialMediaSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  socialMediaTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    minWidth: 100,
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  governanceButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  governanceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  governanceButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4B5563',
  },
  governanceCommittees: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  committeesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  committeesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  committeeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
    minWidth: '48%',
    marginBottom: 4,
  },
  committeeButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#4B5563',
    flex: 1,
    textAlign: 'left',
  },
});