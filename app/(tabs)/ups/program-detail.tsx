import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Lightbulb, 
  Users, 
  Award, 
  Briefcase, 
  GraduationCap,
  Phone,
  Mail,
  Globe,
  School,
  Target,
  Building,
  ChevronRight,
  Play,
  Route,
  Wrench,
  Brain,
  DollarSign,
  Film
} from 'lucide-react-native';

interface ProgramDetail {
  id: string;
  name: string;
  university_id: string;
  level: string;
  duration_years: number;
  department: string;
  degree_awarded: string;
  description: string;
  program_code: string;
  admission_requirements: any;
  application_deadline: string;
  tuition_fees: string;
  financial_aid_options: string;
  curriculum_overview: string;
  course_list_json: any[];
  faculty_details: any[];
  career_prospects: any;
  employment_statistics: string;
  research_opportunities: string;
  accreditation_info: string;
  contact_email: string;
  contact_phone: string;
  program_website_url: string;
  universities?: {
    name: string;
    location: string;
  };
}

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProgramDetails();
  }, [id]);

  const fetchProgramDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('academic_programs')
        .select(`
          *,
          universities (
            name,
            location,
            website,
            description
          )
        `)
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching program details:', fetchError);
        throw fetchError;
      }

      if (!data) {
        throw new Error('Program not found');
      }
      
      console.log('Program details loaded:', data);
      setProgram(data);
    } catch (err) {
      console.error('Error fetching program details:', err);
      setError('Failed to load program details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    {
      title: 'Program Overview',
      icon: BookOpen,
      content: program?.description || 'No description available',
      color: '#3B82F6',
      route: 'about-program'
    },
    {
      title: 'Course Journey',
      icon: Route,
      content: 'Explore semester-by-semester course progression and learning materials',
      color: '#10B981',
      route: 'course-journey'
    },
    {
      title: 'Schools & Admission',
      icon: School,
      content: 'Comprehensive admission requirements, cut-off points, and entrance examinations for all universities offering this program',
      color: '#8B5CF6',
      route: 'schools-admission'
    },
    {
      title: 'Global Exposure',
      icon: Users,
      content: 'Job opportunities and exchange programs within and outside the country with application guidance',
      color: '#F59E0B',
      route: 'global-exposure'
    },
    {
      title: 'Entrepreneurship',
      icon: Lightbulb,
      content: 'Support for starting a business or side hustle including clubs, funding competitions, incubators, and training programs',
      color: '#8B5CF6',
      route: 'entrepreneurship'
    },
    {
      title: 'Alumni Stories',
      icon: Users,
      content: 'Inspiring stories from graduates sharing their career journeys, achievements, and advice for current students',
      color: '#10B981',
      route: 'alumni-stories'
    },
    {
      title: 'Inspirational Entertainment',
      icon: Film,
      content: 'Curated movies and series that showcase different aspects of the program with educational value and legal streaming access',
      color: '#EF4444',
      route: 'inspirational-entertainment'
    }
  ];

  const leftColumnSections = [
    {
      title: 'Graduate Skills',
      icon: Target,
      content: 'Essential skills and competencies you\'ll develop throughout the program',
      color: '#F97316',
      route: 'graduate-skills'
    },
    {
      title: 'Tools & Resources',
      icon: Wrench,
      content: 'Comprehensive list of books, software, equipment, and resources needed for the program',
      color: '#EC4899',
      route: 'tools-resources'
    },
    {
      title: 'Internship Hub',
      icon: Briefcase,
      content: 'Discover internship opportunities and organizations for hands-on experience',
      color: '#6366F1',
      route: 'internship-hub'
    },
    {
      title: 'After School Toolkit',
      icon: GraduationCap,
      content: 'Practical resources and checklists to prepare for life after university including CV writing, interview prep, and financial planning',
      color: '#14B8A6',
      route: 'after-school-toolkit'
    },
    {
      title: 'Life Skills Lab',
      icon: Brain,
      content: 'Personal development courses, mental health support, emotional intelligence workshops, and financial literacy training',
      color: '#8B5CF6',
      route: 'life-skills-lab'
    },
    {
      title: 'Certification Boost',
      icon: Award,
      content: 'Comprehensive list of 300+ professional certifications related to the program with study materials and practice tests',
      color: '#3B82F6',
      route: 'certification-boost'
    },
    {
      title: 'Innovation Sandbox',
      icon: Lightbulb,
      content: 'Experimental spaces, competitions, workshops, camps, and volunteer programs that enhance your knowledge through hands-on innovation',
      color: '#F59E0B',
      route: 'innovation-sandbox'
    }
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading program details...</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.programName}>{program.name}</Text>
            <Text style={styles.degreeInfo}>{program.degree_awarded}</Text>
          </View>
        </View>

        <View style={styles.basicInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Duration:</Text>
            <Text style={styles.infoValue}>{program.duration_years} years</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Department:</Text>
            <Text style={styles.infoValue}>{program.department}</Text>
          </View>
        </View>

        <View style={styles.sectionsContainer}>
          <View style={styles.column}>
            {sections.map((section, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.sectionCard}
                onPress={() => {
                  if (section.route) {
                    router.push(`/ups/${section.route}?id=${program.id}`);
                  }
                }}
              >
                <View style={[styles.sectionIcon, { backgroundColor: `${section.color}15` }]}>
                  <section.icon size={20} color={section.color} />
                </View>
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionText} numberOfLines={3}>
                    {section.content}
                  </Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.column}>
            {leftColumnSections.map((section, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.sectionCard}
                onPress={() => {
                  if (section.route) {
                    router.push(`/ups/${section.route}?id=${program.id}`);
                  }
                }}
              >
                <View style={[styles.sectionIcon, { backgroundColor: `${section.color}15` }]}>
                  <section.icon size={20} color={section.color} />
                </View>
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionText} numberOfLines={3}>
                    {section.content}
                  </Text>
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Globe size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Visit Website</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Mail size={20} color="#3B82F6" />
            <Text style={styles.secondaryButtonText}>Contact Program</Text>
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
    marginBottom: 24,
    marginHorizontal: 24,
    marginTop: 16,
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
  programName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    lineHeight: 30,
    flexWrap: 'wrap',
  },
  universityName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginTop: 4,
  },
  degreeInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  content: {
    flex: 1,
  },
  basicInfo: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  sectionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  column: {
    flex: 1,
  },
  sectionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
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