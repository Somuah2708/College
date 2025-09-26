import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Search, GraduationCap, MapPin, Star, FileText, CircleAlert as AlertCircle, BookOpen, Award, Users, Calendar, ChevronDown, ChevronUp, ListFilter as Filter } from 'lucide-react-native';
import { ExternalLink } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface EntranceExam {
  id: string;
  exam_name: string;
  exam_description: string;
  exam_date: string;
  registration_deadline: string;
  exam_fee: string;
  exam_website: string;
}

interface AdmissionRequirement {
  id: string;
  wassce_subjects: any[];
  minimum_grades: any;
  cut_off_point: string;
  additional_requirements: string;
  application_deadline: string;
  information_source: string;
  publication_year: number;
  last_updated: string;
  source_url: string;
  entrance_exams: EntranceExam[];
}

interface ProgramUniversity {
  id: string;
  university_id: string;
  program_availability: string;
  special_requirements: string;
  application_process: string;
  contact_info: any;
  universities: {
    id: string;
    name: string;
    location: string;
    website: string;
    description: string;
  };
  admission_requirements: AdmissionRequirement;
}

interface ProgramDetails {
  id: string;
  name: string;
  level: string;
}

export default function SchoolsAdmissionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [programUniversities, setProgramUniversities] = useState<ProgramUniversity[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<ProgramUniversity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUniversities, setExpandedUniversities] = useState<Set<string>>(new Set());
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'public' | 'private'>('all');

  useEffect(() => {
    fetchSchoolsData();
  }, [id]);

  useEffect(() => {
    filterUniversities();
  }, [searchQuery, selectedFilter, programUniversities]);

  const fetchSchoolsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching schools data for program ID:', id);
      
      // Fetch program details first
      const { data: programData, error: programError } = await supabase
        .from('academic_programs')
        .select('id, name, level')
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

      // Fetch universities offering this program with admission requirements
      const { data: programUniversitiesData, error: universitiesError } = await supabase
        .from('program_universities')
        .select(`
          id,
          university_id,
          program_availability,
          special_requirements,
          application_process,
          contact_info,
          universities (
            id,
            name,
            location,
            website,
            description
          )
        `)
        .eq('program_id', id);

      if (universitiesError) {
        console.error('Error fetching program universities:', universitiesError);
        throw universitiesError;
      }

      console.log(`Found ${programUniversitiesData?.length || 0} universities offering this program`);

      // For each program-university combination, fetch admission requirements
      const universitiesWithRequirements = await Promise.all(
        (programUniversitiesData || []).map(async (programUni) => {
          try {
            const { data: admissionData, error: admissionError } = await supabase
              .from('admission_requirements')
              .select(`
                id,
                wassce_subjects,
                minimum_grades,
                cut_off_point,
                additional_requirements,
                application_deadline,
                information_source,
                publication_year,
                last_updated,
                source_url
              `)
              .eq('program_university_id', programUni.id)
              .maybeSingle();

            if (admissionError) {
              console.error('Error fetching admission requirements for university:', programUni.universities?.name, admissionError);
            }

            // Fetch entrance examinations if admission requirements exist
            let entranceExams: any[] = [];
            if (admissionData) {
              const { data: examsData, error: examsError } = await supabase
                .from('entrance_examinations')
                .select('*')
                .eq('admission_requirement_id', admissionData.id);

              if (examsError) {
                console.error('Error fetching entrance exams:', examsError);
              } else {
                entranceExams = examsData || [];
              }
            }

            return {
              ...programUni,
              admission_requirements: admissionData ? {
                ...admissionData,
                entrance_exams: entranceExams
              } : null
            };
          } catch (error) {
            console.error('Error processing university data:', error);
            return {
              ...programUni,
              admission_requirements: null
            };
          }
        })
      );

      console.log('Universities with admission requirements processed:', universitiesWithRequirements.length);
      
      // Filter out universities without basic data
      const validUniversities = universitiesWithRequirements.filter(uni => uni.universities);
      
      if (validUniversities.length === 0) {
        console.log('No universities found offering this program');
        setProgramUniversities([]);
        return;
      }

      // Process the data to match the expected interface
      const processedUniversities: ProgramUniversity[] = universitiesWithRequirements.map(uni => ({
        id: uni.id,
        university_id: uni.university_id,
        program_availability: uni.program_availability || 'Available',
        special_requirements: uni.special_requirements || '',
        application_process: uni.application_process || 'Contact university for application process',
        contact_info: uni.contact_info || {
          email: 'admissions@university.edu',
          phone: 'Contact university',
          office: 'Admissions Office'
        },
        universities: {
          id: uni.universities?.id || '',
          name: uni.universities?.name || 'University Name',
          location: uni.universities?.location || 'Location not specified',
          website: uni.universities?.website || '',
          description: uni.universities?.description || ''
        },
        admission_requirements: uni.admission_requirements || {
          id: '',
          wassce_subjects: [],
          minimum_grades: {},
          cut_off_point: 'Not specified',
          additional_requirements: 'Contact university for admission requirements',
          application_deadline: '',
          information_source: 'University admissions office',
          publication_year: new Date().getFullYear(),
          last_updated: new Date().toISOString(),
          source_url: '',
          entrance_exams: []
        }
      }));

      setProgramUniversities(processedUniversities);
      setFilteredUniversities(processedUniversities);
      
      console.log('✅ Schools and admission data loaded successfully');
    } catch (err) {
      console.error('❌ Error in fetchSchoolsData:', err);
      setError(`Failed to load schools and admission requirements: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filterUniversities = () => {
    let filtered = programUniversities;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(uni =>
        uni.universities.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.universities.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply university type filter (simplified - in real app, you'd have a university type field)
    if (selectedFilter === 'public') {
      filtered = filtered.filter(uni => 
        uni.universities.name.includes('University of') || 
        uni.universities.name.includes('Kwame Nkrumah')
      );
    } else if (selectedFilter === 'private') {
      filtered = filtered.filter(uni => 
        uni.universities.name.includes('Ashesi') || 
        uni.universities.name.includes('Technology University College')
      );
    }

    setFilteredUniversities(filtered);
  };

  const toggleUniversityExpansion = (universityId: string) => {
    const newExpanded = new Set(expandedUniversities);
    if (newExpanded.has(universityId)) {
      newExpanded.delete(universityId);
    } else {
      newExpanded.add(universityId);
    }
    setExpandedUniversities(newExpanded);
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A1')) return '#10B981';
    if (grade.includes('B2') || grade.includes('B3')) return '#F59E0B';
    return '#6B7280';
  };

  const openExternalLink = (url: string) => {
    // In a real app, use Linking.openURL(url)
    console.log('Opening:', url);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading schools and admission requirements...</Text>
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
            <Text style={styles.programName}>Schools & Admission</Text>
            <Text style={styles.universityName}>{program.name} - {program.level} Programs</Text>
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search universities..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
                All ({programUniversities.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'public' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('public')}
            >
              <Text style={[styles.filterText, selectedFilter === 'public' && styles.filterTextActive]}>
                Public
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'private' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('private')}
            >
              <Text style={[styles.filterText, selectedFilter === 'private' && styles.filterTextActive]}>
                Private
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredUniversities.length} universities offering {program.name}
          </Text>
        </View>

        {filteredUniversities.map((programUni) => (
          <View key={programUni.id} style={styles.universityCard}>
            <TouchableOpacity
              style={styles.universityHeader}
              onPress={() => toggleUniversityExpansion(programUni.id)}
            >
              <View style={styles.universityInfo}>
                <Text style={styles.universityName}>{programUni.universities.name}</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.location}>{programUni.universities.location}</Text>
                </View>
                <View style={styles.cutOffContainer}>
                  <Star size={16} color="#F59E0B" />
                  <Text style={styles.cutOffText}>
                    Cut-off: {programUni.admission_requirements.cut_off_point}
                  </Text>
                </View>
              </View>
              {expandedUniversities.has(programUni.id) ? (
                <ChevronUp size={24} color="#6B7280" />
              ) : (
                <ChevronDown size={24} color="#6B7280" />
              )}
            </TouchableOpacity>

            {expandedUniversities.has(programUni.id) && (
              <View style={styles.universityDetails}>
                {/* WASSCE Requirements */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <BookOpen size={20} color="#3B82F6" />
                    <Text style={styles.sectionTitle}>WASSCE Requirements</Text>
                  </View>
                  <View style={styles.subjectsContainer}>
                    {(programUni.admission_requirements.wassce_subjects || []).map((subject: any, index: number) => (
                      <View key={index} style={styles.subjectCard}>
                        <Text style={styles.subjectName}>{subject.subject}</Text>
                        <Text style={[styles.subjectGrade, { color: getGradeColor(subject.grade) }]}>
                          {subject.grade}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Cut-off and Grades */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Award size={20} color="#10B981" />
                    <Text style={styles.sectionTitle}>Grade Requirements</Text>
                  </View>
                  <View style={styles.gradesInfo}>
                    <View style={styles.gradeItem}>
                      <Text style={styles.gradeLabel}>Aggregate:</Text>
                      <Text style={styles.gradeValue}>{programUni.admission_requirements.minimum_grades?.aggregate || 'Not specified'}</Text>
                    </View>
                    <View style={styles.gradeItem}>
                      <Text style={styles.gradeLabel}>Core Subjects:</Text>
                      <Text style={styles.gradeValue}>{programUni.admission_requirements.minimum_grades?.core_subjects || 'Not specified'}</Text>
                    </View>
                    <View style={styles.gradeItem}>
                      <Text style={styles.gradeLabel}>Electives:</Text>
                      <Text style={styles.gradeValue}>{programUni.admission_requirements.minimum_grades?.electives || 'Not specified'}</Text>
                    </View>
                  </View>
                </View>

                {/* Entrance Examinations */}
                {(programUni.admission_requirements.entrance_exams || []).length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <FileText size={20} color="#8B5CF6" />
                      <Text style={styles.sectionTitle}>Entrance Examinations</Text>
                    </View>
                    {(programUni.admission_requirements.entrance_exams || []).map((exam) => (
                      <View key={exam.id} style={styles.examCard}>
                        <Text style={styles.examName}>{exam.exam_name}</Text>
                        <Text style={styles.examDescription}>{exam.exam_description}</Text>
                        <View style={styles.examDetails}>
                          <View style={styles.examDetailItem}>
                            <Calendar size={14} color="#6B7280" />
                            <Text style={styles.examDetailText}>Exam: {exam.exam_date ? new Date(exam.exam_date).toLocaleDateString() : 'Date TBA'}</Text>
                          </View>
                          <View style={styles.examDetailItem}>
                            <AlertCircle size={14} color="#6B7280" />
                            <Text style={styles.examDetailText}>Deadline: {exam.registration_deadline ? new Date(exam.registration_deadline).toLocaleDateString() : 'TBA'}</Text>
                          </View>
                          <View style={styles.examDetailItem}>
                            <Users size={14} color="#6B7280" />
                            <Text style={styles.examDetailText}>Fee: {exam.exam_fee || 'Contact for details'}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Additional Requirements */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <AlertCircle size={20} color="#F59E0B" />
                    <Text style={styles.sectionTitle}>Additional Requirements</Text>
                  </View>
                  <Text style={styles.additionalText}>{programUni.admission_requirements.additional_requirements}</Text>
                  <Text style={styles.specialText}>{programUni.special_requirements}</Text>
                </View>

                {/* Application Information */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <GraduationCap size={20} color="#06B6D4" />
                    <Text style={styles.sectionTitle}>Application Process</Text>
                  </View>
                  <Text style={styles.processText}>{programUni.application_process}</Text>
                  <View style={styles.deadlineContainer}>
                    <Calendar size={16} color="#EF4444" />
                    <Text style={styles.deadlineText}>
                      Deadline: {programUni.admission_requirements.application_deadline ? new Date(programUni.admission_requirements.application_deadline).toLocaleDateString() : 'Contact university'}
                    </Text>
                  </View>
                </View>

                {/* Contact Information */}
                <View style={styles.contactSection}>
                  <Text style={styles.contactTitle}>Contact Information</Text>
                  <Text style={styles.contactText}>Email: {programUni.contact_info?.email || 'Contact university'}</Text>
                  <Text style={styles.contactText}>Phone: {programUni.contact_info?.phone || 'Contact university'}</Text>
                  <Text style={styles.contactText}>Office: {programUni.contact_info?.office || 'Admissions Office'}</Text>
                </View>

                {/* Source Information */}
                <View style={styles.sourceSection}>
                  <Text style={styles.sourceTitle}>Information Source</Text>
                  <Text style={styles.sourceText}>
                    Source: {programUni.admission_requirements.information_source}
                  </Text>
                  <Text style={styles.sourceText}>
                    Publication Year: {programUni.admission_requirements.publication_year}
                  </Text>
                  <Text style={styles.sourceText}>
                    Last Updated: {programUni.admission_requirements.last_updated ? new Date(programUni.admission_requirements.last_updated).toLocaleDateString() : 'Unknown'}
                  </Text>
                  {programUni.admission_requirements.source_url && (
                    <TouchableOpacity
                      style={styles.sourceLink}
                      onPress={() => openExternalLink(programUni.admission_requirements.source_url)}
                    >
                      <ExternalLink size={14} color="#3B82F6" />
                      <Text style={styles.sourceLinkText}>View Official Source</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
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
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  universityCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  universityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  universityInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  cutOffContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cutOffText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  universityDetails: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectCard: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: '45%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    flex: 1,
  },
  subjectGrade: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  gradesInfo: {
    gap: 8,
  },
  gradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  gradeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  gradeValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  examCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  examName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  examDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  examDetails: {
    gap: 4,
  },
  examDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  examDetailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  additionalText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  specialText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    lineHeight: 20,
  },
  processText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deadlineText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  contactSection: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  contactTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    marginBottom: 4,
  },
  sourceSection: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 16,
  },
  sourceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#475569',
    marginBottom: 8,
  },
  sourceText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  sourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  sourceLinkText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
});