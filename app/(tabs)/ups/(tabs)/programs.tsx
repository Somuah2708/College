import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Clock, Briefcase, TrendingUp, ListFilter as Filter, GraduationCap, Building, Award, ChevronRight, MapPin, Calendar, Mail, Globe, BookOpen } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface AcademicProgram {
  id: string;
  university_id: string;
  name: string;
  slug: string;
  level: string;
  duration_years: number | null;
  department: string | null;
  degree_awarded: string | null;
  description: string;
  program_code: string;
  admission_requirements: any;
  application_deadline: string | null;
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
  history_and_evolution: string;
  core_philosophy: string;
  purpose: string;
  relevance_and_applications: string;
  wikipedia_links: any[];
  external_links: any[];
  created_at: string;
  updated_at: string;
  universities?: {
    id: string;
    name: string;
    location: string;
    website: string;
    description: string;
  };
}

export default function ProgramsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [programs, setPrograms] = useState<AcademicProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<AcademicProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    filterPrograms();
  }, [searchQuery, selectedLevel, selectedDepartment, programs]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching programs from academic_programs table...');
      
      const { data, error: fetchError } = await supabase
        .from('academic_programs')
        .select(`
          *,
          universities (
            id,
            name,
            location,
            website,
            description
          )
        `)
        .order('name');

      if (fetchError) {
        console.error('❌ Supabase fetch error:', fetchError);
        console.error('Error details:', {
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint,
          code: fetchError.code
        });
        throw fetchError;
      }

      console.log(`✅ Successfully fetched ${data?.length || 0} programs from Supabase`);
      console.log('📊 Programs data:', data);
      
      setPrograms(data || []);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError(`Failed to load programs: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filterPrograms = () => {
    let filtered = programs;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(program =>
        program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (program.universities?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (program.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (program.degree_awarded || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(program => program.level === selectedLevel);
    }

    // Apply department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(program => program.department === selectedDepartment);
    }

    setFilteredPrograms(filtered);
  };

  const getCategoryColor = (department: string | null) => {
    if (!department) return '#6B7280';
    
    const dept = department.toLowerCase();
    if (dept.includes('technology') || dept.includes('computer') || dept.includes('engineering')) {
      return '#3B82F6';
    }
    if (dept.includes('business')) {
      return '#10B981';
    }
    if (dept.includes('science')) {
      return '#8B5CF6';
    }
    if (dept.includes('arts') || dept.includes('humanities')) {
      return '#F59E0B';
    }
    if (dept.includes('medicine') || dept.includes('health')) {
      return '#EF4444';
    }
    if (dept.includes('law') || dept.includes('legal')) {
      return '#EC4899';
    }
    if (dept.includes('education')) {
      return '#84CC16';
    }
    return '#6B7280';
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'bachelor':
      case 'undergraduate':
        return '#3B82F6';
      case 'master':
      case 'masters':
      case 'postgraduate':
        return '#10B981';
      case 'phd':
      case 'doctorate':
      case 'doctoral':
        return '#8B5CF6';
      case 'diploma':
      case 'certificate':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysUntil = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return 'Deadline passed';
    if (daysUntil === 0) return 'Due today';
    if (daysUntil === 1) return 'Due tomorrow';
    if (daysUntil <= 30) return `${daysUntil} days left`;
    
    return deadlineDate.toLocaleDateString();
  };

  const renderProgramCard = (program: AcademicProgram) => {
    const categoryColor = getCategoryColor(program.department);
    const levelColor = getLevelColor(program.level);
    const deadlineInfo = formatDeadline(program.application_deadline);
    const isDeadlineUrgent = program.application_deadline && 
      Math.ceil((new Date(program.application_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 30;
    
    return (
      <TouchableOpacity 
        key={program.id} 
        style={styles.programCard}
        onPress={() => router.push(`/ups/program-detail?id=${program.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.programInfo}>
            <Text style={styles.programTitle}>{program.name}</Text>
            
            {program.degree_awarded && (
              <Text style={styles.degree}>{program.degree_awarded}</Text>
            )}
          </View>
          
          <View style={styles.badgesContainer}>
            {program.level && (
              <View style={[styles.levelBadge, { backgroundColor: `${levelColor}15` }]}>
                <Text style={[styles.levelText, { color: levelColor }]}>
                  {program.level}
                </Text>
              </View>
            )}
            
            {program.department && (
              <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}15` }]}>
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {program.department}
                </Text>
              </View>
            )}
          </View>
        </View>

        {program.description && (
          <Text style={styles.programDescription} numberOfLines={3}>
            {program.description}
          </Text>
        )}

        <View style={styles.programDetails}>
          {program.duration_years && (
            <View style={styles.detailItem}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.detailText}>{program.duration_years} years</Text>
            </View>
          )}
          {program.universities && (
            <View style={styles.detailItem}>
              <Text style={styles.detailText}>{program.universities.name}</Text>
            </View>
          )}
        </View>

        {program.employment_statistics && (
          <View style={styles.statsContainer}>
            <Briefcase size={14} color="#10B981" />
            <Text style={styles.statsText}>{program.employment_statistics}</Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.viewDetailsText}>View Program Details</Text>
          <ChevronRight size={16} color="#3B82F6" />
        </View>
      </TouchableOpacity>
    );
  };

  // Get unique values for filters
  const uniqueLevels = Array.from(new Set(programs.map(p => p.level).filter(Boolean)));
  const uniqueDepartments = Array.from(new Set(programs.map(p => p.department).filter(Boolean)));

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading programs from database...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <GraduationCap size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Database Connection Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPrograms}>
            <Text style={styles.retryButtonText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Academic Programs</Text>
          <Text style={styles.subtitle}>Explore programs from our university partners</Text>
          
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search programs, universities, or departments..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity 
                style={[styles.filterButton, selectedLevel === 'all' && styles.activeFilterButton]}
                onPress={() => setSelectedLevel('all')}
              >
                <Text style={[styles.filterText, selectedLevel === 'all' && styles.activeFilterText]}>
                  All Levels
                </Text>
              </TouchableOpacity>
              
              {uniqueLevels.map((level) => (
                <TouchableOpacity 
                  key={level}
                  style={[styles.filterButton, selectedLevel === level && styles.activeFilterButton]}
                  onPress={() => setSelectedLevel(level)}
                >
                  <Text style={[styles.filterText, selectedLevel === level && styles.activeFilterText]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.departmentFilterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity 
                style={[styles.departmentButton, selectedDepartment === 'all' && styles.activeDepartmentButton]}
                onPress={() => setSelectedDepartment('all')}
              >
                <Text style={[styles.departmentText, selectedDepartment === 'all' && styles.activeDepartmentText]}>
                  All Departments
                </Text>
              </TouchableOpacity>
              
              {uniqueDepartments.slice(0, 5).map((department) => (
                <TouchableOpacity 
                  key={department}
                  style={[styles.departmentButton, selectedDepartment === department && styles.activeDepartmentButton]}
                  onPress={() => setSelectedDepartment(department)}
                >
                  <Text style={[styles.departmentText, selectedDepartment === department && styles.activeDepartmentText]}>
                    {department}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} found
            </Text>
            {programs.length > 0 && (
              <Text style={styles.totalCount}>
                of {programs.length} total
              </Text>
            )}
          </View>
        </View>

        {filteredPrograms.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <GraduationCap size={64} color="#9CA3AF" />
            <Text style={styles.noResultsTitle}>
              {programs.length === 0 ? 'No programs in database' : 'No programs found'}
            </Text>
            <Text style={styles.noResultsText}>
              {searchQuery || selectedLevel !== 'all' || selectedDepartment !== 'all'
                ? 'Try adjusting your search criteria or filters.' 
                : programs.length === 0 
                  ? 'The academic_programs table appears to be empty. Please add some programs to your Supabase database.'
                  : 'No programs match your current filters.'}
            </Text>
            {programs.length === 0 && (
              <View style={styles.databaseInfoContainer}>
                <Text style={styles.databaseInfoText}>
                  To add programs, go to your Supabase dashboard and insert data into the academic_programs table.
                </Text>
              </View>
            )}
            {(searchQuery || selectedLevel !== 'all' || selectedDepartment !== 'all') && (
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedLevel('all');
                  setSelectedDepartment('all');
                }}
              >
                <Text style={styles.clearFiltersText}>Clear All Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.programsList}>
            {filteredPrograms.map((program) => renderProgramCard(program))}
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 20,
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
    marginBottom: 12,
  },
  filterButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  departmentFilterContainer: {
    marginBottom: 16,
  },
  departmentButton: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeDepartmentButton: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  departmentText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeDepartmentText: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  totalCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  programsList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  programCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  programInfo: {
    flex: 1,
    marginRight: 12,
  },
  programTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 24,
    flexShrink: 1,
    textAlign: 'left',
  },
  universityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  university: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  degree: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  programCode: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  badgesContainer: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  programDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  programDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  urgentDeadline: {
    backgroundColor: '#FEF2F2',
  },
  deadlineText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
  },
  urgentDeadlineText: {
    color: '#DC2626',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  statsText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#15803D',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  viewDetailsText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  noResultsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  noResultsTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    lineHeight: 30,
    flexWrap: 'wrap',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  clearFiltersButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  databaseInfoContainer: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  databaseInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0369A1',
    textAlign: 'center',
    lineHeight: 20,
  },
});