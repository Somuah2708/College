import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  Calendar, 
  Award, 
  Users, 
  CircleAlert as AlertCircle, 
  CircleCheck as CheckCircle, 
  ExternalLink,
  Globe,
  Info,
  GraduationCap,
  Target,
  Clock,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp
} from 'lucide-react-native';

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
  general_entry_criteria: string;
  program_specific_cutoffs: any;
  required_subjects_grades: any[];
  portfolio_requirements: string;
  interview_requirements: string;
  application_deadlines: any;
  application_procedures: string;
  entrance_examinations: any[];
  language_proficiency_requirements: string;
  international_student_requirements: string;
  transfer_student_requirements: string;
  mature_student_requirements: string;
  application_fees: string;
  document_requirements: any[];
  application_tips: string;
  common_mistakes: string;
  selection_process: string;
  notification_timeline: string;
  created_at: string;
}

interface University {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
}

export default function AdmissionRequirementsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [admissionData, setAdmissionData] = useState<AdmissionRequirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmissionRequirements();
  }, [id]);

  const fetchAdmissionRequirements = async () => {
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
        console.error('University fetch error:', universityError);
        throw universityError;
      }

      if (!universityData) {
        throw new Error('University not found');
      }

      setUniversity(universityData);

      // Fetch admission requirements data
      const { data: admissionData, error: admissionError } = await supabase
        .from('university_admission_requirements')
        .select('*')
        .eq('university_id', id)
        .maybeSingle();

      if (admissionError) {
        console.error('Admission requirements fetch error:', admissionError);
        // Don't throw error here, just log it and set data to null
        setAdmissionData(null);
      } else {
        console.log('Admission data fetched:', admissionData);
        setAdmissionData(admissionData);
      }
    } catch (err) {
      console.error('Error in fetchAdmissionRequirements:', err);
      setError('Failed to load admission requirements. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const getGradeColor = (grade: string) => {
    if (grade.includes('A1') || grade.includes('A')) return '#10B981';
    if (grade.includes('B2') || grade.includes('B3') || grade.includes('B')) return '#F59E0B';
    if (grade.includes('C4') || grade.includes('C5') || grade.includes('C6') || grade.includes('C')) return '#EF4444';
    return '#6B7280';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading admission requirements...</Text>
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

  if (!admissionData) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.programName}>Admission Requirements</Text>
              <Text style={styles.universityName}>{university.name}</Text>
            </View>
          </View>

          <View style={styles.noDataContainer}>
            <GraduationCap size={48} color="#9CA3AF" />
            <Text style={styles.noDataTitle}>Admission Requirements Not Available</Text>
            <Text style={styles.noDataText}>
              Detailed admission requirements for {university.name} are not currently available in our database.
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
            <Text style={styles.programName}>Admission Requirements</Text>
            <Text style={styles.universityName}>{university.name}</Text>
          </View>
        </View>

        {/* General Entry Criteria */}
        {admissionData.general_entry_criteria && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BookOpen size={24} color="#3B82F6" />
              <Text style={styles.sectionTitle}>General Entry Criteria</Text>
            </View>
            <Text style={styles.sectionContent}>{admissionData.general_entry_criteria}</Text>
          </View>
        )}

        {/* Program-Specific Cut-offs */}
        {admissionData.program_specific_cutoffs && Object.keys(admissionData.program_specific_cutoffs).length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Target size={24} color="#10B981" />
              <Text style={styles.sectionTitle}>Program-Specific Cut-offs</Text>
            </View>
            <View style={styles.cutoffsList}>
              {Object.entries(admissionData.program_specific_cutoffs).map(([program, cutoff]) => (
                <View key={program} style={styles.cutoffItem}>
                  <Text style={styles.programName}>{program}</Text>
                  <Text style={styles.cutoffValue}>{cutoff as string}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Required Subjects & Grades */}
        {admissionData.required_subjects_grades && admissionData.required_subjects_grades.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Award size={24} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Required Subjects & Grades</Text>
            </View>
            <View style={styles.subjectsList}>
              {admissionData.required_subjects_grades.map((subject: any, index: number) => (
                <View key={index} style={styles.subjectCard}>
                  <Text style={styles.subjectName}>{subject.subject || `Subject ${index + 1}`}</Text>
                  <Text style={[styles.subjectGrade, { color: getGradeColor(subject.grade || 'C6') }]}>
                    {subject.grade || 'Grade not specified'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Application Deadlines */}
        {admissionData.application_deadlines && Object.keys(admissionData.application_deadlines).length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={24} color="#EF4444" />
              <Text style={styles.sectionTitle}>Application Deadlines</Text>
            </View>
            <View style={styles.deadlinesList}>
              {Object.entries(admissionData.application_deadlines).map(([category, deadline]) => (
                <View key={category} style={styles.deadlineItem}>
                  <View style={styles.deadlineIcon}>
                    <Calendar size={16} color="#EF4444" />
                  </View>
                  <View style={styles.deadlineInfo}>
                    <Text style={styles.deadlineCategory}>{category.replace('_', ' ').toUpperCase()}</Text>
                    <Text style={styles.deadlineDate}>{deadline as string}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Entrance Examinations */}
        {admissionData.entrance_examinations && admissionData.entrance_examinations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText size={24} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Entrance Examinations</Text>
            </View>
            <View style={styles.examsList}>
              {admissionData.entrance_examinations.map((exam: any, index: number) => (
                <View key={index} style={styles.examCard}>
                  <Text style={styles.examName}>{exam.exam_name || `Examination ${index + 1}`}</Text>
                  <Text style={styles.examDescription}>{exam.description || 'No description available'}</Text>
                  
                  <View style={styles.examDetails}>
                    {exam.exam_date && (
                      <View style={styles.examDetail}>
                        <Calendar size={14} color="#6B7280" />
                        <Text style={styles.examDetailText}>Exam Date: {new Date(exam.exam_date).toLocaleDateString()}</Text>
                      </View>
                    )}
                    {exam.registration_deadline && (
                      <View style={styles.examDetail}>
                        <Clock size={14} color="#6B7280" />
                        <Text style={styles.examDetailText}>Registration Deadline: {new Date(exam.registration_deadline).toLocaleDateString()}</Text>
                      </View>
                    )}
                    {exam.exam_fee && (
                      <View style={styles.examDetail}>
                        <Users size={14} color="#6B7280" />
                        <Text style={styles.examDetailText}>Fee: {exam.exam_fee}</Text>
                      </View>
                    )}
                  </View>

                  {exam.exam_website && (
                    <TouchableOpacity
                      style={styles.examWebsiteButton}
                      onPress={() => openExternalLink(exam.exam_website)}
                    >
                      <ExternalLink size={16} color="#8B5CF6" />
                      <Text style={styles.examWebsiteText}>Visit Exam Website</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Application Procedures */}
        {admissionData.application_procedures && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText size={24} color="#06B6D4" />
              <Text style={styles.sectionTitle}>Application Procedures</Text>
            </View>
            <Text style={styles.sectionContent}>{admissionData.application_procedures}</Text>
          </View>
        )}

        {/* Document Requirements */}
        {admissionData.document_requirements && admissionData.document_requirements.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText size={24} color="#EC4899" />
              <Text style={styles.sectionTitle}>Required Documents</Text>
            </View>
            <View style={styles.documentsList}>
              {admissionData.document_requirements.map((document: any, index: number) => (
                <View key={index} style={styles.documentItem}>
                  <CheckCircle size={16} color="#10B981" />
                  <Text style={styles.documentText}>
                    {typeof document === 'string' ? document : document.document_name || `Document ${index + 1}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Language Requirements */}
        {admissionData.language_proficiency_requirements && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={24} color="#14B8A6" />
              <Text style={styles.sectionTitle}>Language Proficiency Requirements</Text>
            </View>
            <Text style={styles.sectionContent}>{admissionData.language_proficiency_requirements}</Text>
          </View>
        )}

        {/* International Student Requirements */}
        {admissionData.international_student_requirements && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={24} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>International Student Requirements</Text>
            </View>
            <Text style={styles.sectionContent}>{admissionData.international_student_requirements}</Text>
          </View>
        )}

        {/* Application Tips */}
        {admissionData.application_tips && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Target size={24} color="#10B981" />
              <Text style={styles.sectionTitle}>Application Tips</Text>
            </View>
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsText}>{admissionData.application_tips}</Text>
            </View>
          </View>
        )}

        {/* Common Mistakes */}
        {admissionData.common_mistakes && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertCircle size={24} color="#EF4444" />
              <Text style={styles.sectionTitle}>Common Mistakes to Avoid</Text>
            </View>
            <View style={styles.mistakesContainer}>
              <Text style={styles.mistakesText}>{admissionData.common_mistakes}</Text>
            </View>
          </View>
        )}

        {/* Selection Process */}
        {admissionData.selection_process && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={24} color="#F97316" />
              <Text style={styles.sectionTitle}>Selection Process</Text>
            </View>
            <Text style={styles.sectionContent}>{admissionData.selection_process}</Text>
          </View>
        )}

        {/* Notification Timeline */}
        {admissionData.notification_timeline && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={24} color="#6366F1" />
              <Text style={styles.sectionTitle}>Notification Timeline</Text>
            </View>
            <Text style={styles.sectionContent}>{admissionData.notification_timeline}</Text>
          </View>
        )}

        {/* Application Fees */}
        {admissionData.application_fees && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={24} color="#10B981" />
              <Text style={styles.sectionTitle}>Application Fees</Text>
            </View>
            <View style={styles.feesContainer}>
              <Text style={styles.feesText}>{admissionData.application_fees}</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionButtons}>
          {university.website && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => openExternalLink(university.website)}
            >
              <Globe size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>University Website</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push(`/ups/university-detail?id=${university.id}`)}
          >
            <Info size={20} color="#3B82F6" />
            <Text style={styles.secondaryButtonText}>University Overview</Text>
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
  cutoffsList: {
    gap: 8,
  },
  cutoffItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  programName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    flex: 1,
  },
  cutoffValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  subjectsList: {
    gap: 8,
  },
  subjectCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subjectName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    flex: 1,
  },
  subjectGrade: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  deadlinesList: {
    gap: 12,
  },
  deadlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  deadlineIcon: {
    marginRight: 12,
  },
  deadlineInfo: {
    flex: 1,
  },
  deadlineCategory: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginBottom: 2,
  },
  deadlineDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#991B1B',
  },
  examsList: {
    gap: 16,
  },
  examCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  examName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  examDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  examDetails: {
    gap: 6,
    marginBottom: 12,
  },
  examDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  examDetailText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  examWebsiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF615',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  examWebsiteText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
  },
  documentsList: {
    gap: 8,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  documentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
  },
  tipsContainer: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#166534',
    lineHeight: 22,
  },
  mistakesContainer: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  mistakesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#991B1B',
    lineHeight: 22,
  },
  feesContainer: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  feesText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#15803D',
    textAlign: 'center',
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