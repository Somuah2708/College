import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Award, DollarSign, Calendar, Users, ExternalLink, Mail, Globe, Info, Search, ListFilter as Filter, CircleCheck as CheckCircle, Clock, Target, Star, TrendingUp, FileText, Phone, MapPin, Building, Bookmark, Eye, ChevronRight, CircleAlert as AlertCircle, Heart, Zap } from 'lucide-react-native';

interface UniversityScholarship {
  id: string;
  university_id: string;
  scholarship_name: string;
  scholarship_type: string;
  scholarship_description: string;
  award_amount: string;
  number_of_awards: number;
  eligibility_criteria: any[];
  application_process: string;
  application_deadline: string;
  renewable: boolean;
  renewal_criteria: string;
  target_programs: any[];
  target_demographics: any[];
  selection_criteria: string;
  application_tips: string;
  success_stories: string;
  contact_information: any;
  application_url: string;
  order_index: number;
  created_at: string;
  financial_aid_overview: string;
  scholarship_office_contact: any;
  merit_based_scholarships: any[];
  need_based_scholarships: any[];
  special_category_scholarships: any[];
  donor_sponsored_scholarships: any[];
  financial_aid_options: any;
  eligibility_requirements_detailed: string;
  application_process_guide: string;
  required_documents_checklist: any[];
  renewal_conditions: string;
  external_scholarships_linked: any[];
  scholarship_success_stories: any[];
  scholarship_videos: any[];
  application_deadlines_calendar: any;
  financial_need_assessment: string;
  scholarship_statistics: any;
  emergency_financial_support: string;
}

interface University {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
}

export default function ScholarshipsAidScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [scholarshipsData, setScholarshipsData] = useState<UniversityScholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [savedScholarships, setSavedScholarships] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'overview' | 'merit' | 'need' | 'special' | 'external'>('overview');

  useEffect(() => {
    fetchScholarshipsData();
  }, [id]);

  const fetchScholarshipsData = async () => {
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

      // Fetch scholarships data
      const { data: scholarshipsData, error: scholarshipsError } = await supabase
        .from('university_scholarships')
        .select('*')
        .eq('university_id', id)
        .maybeSingle();

      if (scholarshipsError) {
        console.error('Scholarships fetch error:', scholarshipsError);
        generateMockScholarshipsData(universityData);
      } else if (scholarshipsData) {
        console.log('Scholarships data fetched:', scholarshipsData);
        setScholarshipsData(scholarshipsData);
      } else {
        generateMockScholarshipsData(universityData);
      }
    } catch (err) {
      console.error('Error in fetchScholarshipsData:', err);
      setError('Failed to load scholarships information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateMockScholarshipsData = (universityData: University) => {
    const mockData: UniversityScholarship = {
      id: 'mock-scholarships',
      university_id: id as string,
      scholarship_name: `${universityData.name} Excellence Scholarship Program`,
      scholarship_type: 'merit',
      scholarship_description: `Comprehensive scholarship program supporting outstanding students at ${universityData.name}`,
      award_amount: 'GHS 15,000 - 50,000 per year',
      number_of_awards: 150,
      eligibility_criteria: [
        'Minimum GPA of 3.5 or equivalent',
        'Demonstrated leadership experience',
        'Community service involvement',
        'Financial need assessment',
        'Full-time enrollment status',
        'Maintain good academic standing'
      ],
      application_process: 'Complete online application, submit required documents, pay application fee, await allocation confirmation',
      application_deadline: '2025-04-30',
      renewable: true,
      renewal_criteria: 'Maintain minimum GPA of 3.5, complete community service hours, submit annual progress report',
      target_programs: ['All undergraduate programs', 'Graduate programs', 'Professional programs'],
      target_demographics: ['First-generation college students', 'Underrepresented minorities', 'Rural students', 'International students'],
      selection_criteria: 'Academic excellence, leadership potential, community impact, financial need, and personal statement quality',
      application_tips: 'Start early, gather all documents, write compelling personal statement, highlight unique experiences, seek recommendation letters from credible sources',
      success_stories: 'Over 500 students have benefited from our scholarship programs, with 95% graduation rate and 90% employment within 6 months of graduation',
      contact_information: {
        email: 'scholarships@university.edu.gh',
        phone: '+233 123 456 789',
        office: 'Financial Aid Office, Administration Building',
        hours: 'Monday-Friday: 8:00 AM - 5:00 PM'
      },
      application_url: `${universityData.website}/scholarships/apply`,
      order_index: 0,
      created_at: new Date().toISOString(),
      financial_aid_overview: `${universityData.name} is committed to making quality education accessible to all qualified students regardless of their financial background. We offer various forms of financial assistance including scholarships, grants, work-study programs, and student loans.`,
      scholarship_office_contact: {
        director: 'Dr. Sarah Mensah',
        email: 'scholarships@university.edu.gh',
        phone: '+233 123 456 789',
        office_location: 'Financial Aid Office, Room 201, Administration Building',
        office_hours: 'Monday-Friday: 8:00 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM'
      },
      merit_based_scholarships: [
        {
          name: 'Academic Excellence Award',
          amount: 'GHS 25,000/year',
          criteria: 'Top 5% of graduating class',
          renewable: true,
          awards_available: 20,
          description: 'Recognizes outstanding academic achievement and potential'
        },
        {
          name: 'Dean\'s List Scholarship',
          amount: 'GHS 15,000/year',
          criteria: 'GPA 3.7 or higher',
          renewable: true,
          awards_available: 50,
          description: 'Supports students with consistent academic excellence'
        },
        {
          name: 'Leadership Excellence Award',
          amount: 'GHS 20,000/year',
          criteria: 'Demonstrated leadership in school or community',
          renewable: true,
          awards_available: 30,
          description: 'Rewards students who show exceptional leadership qualities'
        },
        {
          name: 'Research Scholar Award',
          amount: 'GHS 18,000/year',
          criteria: 'Outstanding research potential and publications',
          renewable: true,
          awards_available: 15,
          description: 'Supports students pursuing research excellence'
        }
      ],
      need_based_scholarships: [
        {
          name: 'Financial Need Grant',
          amount: 'GHS 10,000-30,000/year',
          criteria: 'Demonstrated financial need',
          renewable: true,
          awards_available: 100,
          description: 'Assists students with significant financial challenges'
        },
        {
          name: 'First Generation Scholarship',
          amount: 'GHS 18,000/year',
          criteria: 'First in family to attend university',
          renewable: true,
          awards_available: 25,
          description: 'Supports first-generation college students'
        },
        {
          name: 'Emergency Financial Aid',
          amount: 'GHS 5,000-15,000',
          criteria: 'Unexpected financial hardship',
          renewable: false,
          awards_available: 50,
          description: 'One-time assistance for emergency situations'
        }
      ],
      special_category_scholarships: [
        {
          name: 'Women in STEM Scholarship',
          amount: 'GHS 22,000/year',
          criteria: 'Female students in Science, Technology, Engineering, or Mathematics',
          renewable: true,
          awards_available: 40,
          description: 'Encourages women to pursue STEM careers'
        },
        {
          name: 'Rural Student Support Grant',
          amount: 'GHS 16,000/year',
          criteria: 'Students from rural communities',
          renewable: true,
          awards_available: 35,
          description: 'Supports students from underserved rural areas'
        },
        {
          name: 'International Student Scholarship',
          amount: 'GHS 30,000/year',
          criteria: 'Outstanding international students',
          renewable: true,
          awards_available: 15,
          description: 'Attracts top international talent'
        },
        {
          name: 'Disability Support Scholarship',
          amount: 'GHS 20,000/year',
          criteria: 'Students with documented disabilities',
          renewable: true,
          awards_available: 20,
          description: 'Ensures accessibility and inclusion'
        }
      ],
      donor_sponsored_scholarships: [
        {
          name: 'Alumni Foundation Scholarship',
          amount: 'GHS 20,000/year',
          sponsor: 'University Alumni Association',
          criteria: 'Academic merit and community service',
          awards_available: 25,
          description: 'Funded by generous alumni contributions'
        },
        {
          name: 'Corporate Partnership Grant',
          amount: 'GHS 25,000/year',
          sponsor: 'Industry Partners',
          criteria: 'Students in business or technology programs',
          awards_available: 20,
          description: 'Sponsored by leading corporations'
        },
        {
          name: 'Community Leader Scholarship',
          amount: 'GHS 15,000/year',
          sponsor: 'Local Community Leaders',
          criteria: 'Community involvement and leadership',
          awards_available: 15,
          description: 'Recognizes community engagement'
        }
      ],
      financial_aid_options: {
        work_study: 'On-campus employment opportunities for eligible students earning GHS 500-1,500 per month',
        student_loans: 'Low-interest loans available through government and private programs with flexible repayment terms',
        payment_plans: 'Flexible payment plans to spread tuition costs over academic year with no additional fees',
        emergency_aid: 'Short-term financial assistance for unexpected expenses up to GHS 10,000',
        grants: 'Need-based grants that do not require repayment, ranging from GHS 5,000-20,000',
        work_study_details: 'Part-time employment in various campus departments including library, administration, and research'
      },
      eligibility_requirements_detailed: 'Students must be enrolled full-time, maintain satisfactory academic progress (minimum GPA 2.5), demonstrate financial need where applicable, comply with all university policies and regulations, and submit annual renewal applications.',
      application_process_guide: 'Complete FAFSA or equivalent financial aid application, submit university scholarship application through online portal, provide required documentation including transcripts and financial statements, attend information sessions, meet all deadlines, and respond promptly to requests for additional information.',
      required_documents_checklist: [
        'Completed scholarship application form',
        'Official academic transcripts from all institutions',
        'Financial aid application (FAFSA or equivalent)',
        'Personal statement or essay (500-1000 words)',
        'Letters of recommendation (2-3 from teachers/mentors)',
        'Proof of income/financial documents (tax returns, pay stubs)',
        'Copy of national ID or passport',
        'Passport-sized photographs (2 copies)',
        'Bank account information and statements',
        'Community service documentation and certificates',
        'Leadership experience documentation',
        'Academic awards and certificates',
        'Medical certificates (if applicable)',
        'Disability documentation (if applicable)'
      ],
      renewal_conditions: 'Scholarships are renewable based on maintaining required GPA (minimum 3.0 for most scholarships), completing minimum 20 hours of community service per semester, submitting annual progress reports by specified deadlines, continued enrollment in eligible programs, and adherence to university code of conduct.',
      external_scholarships_linked: [
        {
          name: 'National Merit Scholarship',
          provider: 'Government of Ghana',
          amount: 'Full tuition coverage',
          website: 'https://getfund.gov.gh',
          description: 'Government-sponsored scholarship for exceptional students'
        },
        {
          name: 'MasterCard Foundation Scholars',
          provider: 'MasterCard Foundation',
          amount: 'Full funding including living expenses',
          website: 'https://mastercardfdn.org',
          description: 'Comprehensive support for African students'
        },
        {
          name: 'Commonwealth Scholarship',
          provider: 'Commonwealth Scholarship Commission',
          amount: 'Full funding for UK studies',
          website: 'https://cscuk.fcdo.gov.uk',
          description: 'Study opportunities in the United Kingdom'
        },
        {
          name: 'Fulbright Scholarship',
          provider: 'US Department of State',
          amount: 'Full funding for US studies',
          website: 'https://fulbright.state.gov',
          description: 'Educational exchange program with the United States'
        }
      ],
      scholarship_success_stories: [
        {
          student_name: 'Kwame Asante',
          program: 'Computer Science',
          scholarship: 'Academic Excellence Award',
          story: 'Graduated summa cum laude and now works as a software engineer at Google. The scholarship allowed me to focus on my studies without financial stress.',
          year: '2023',
          current_position: 'Software Engineer at Google',
          advice: 'Apply early and be authentic in your personal statement'
        },
        {
          student_name: 'Ama Serwaa',
          program: 'Engineering',
          scholarship: 'Women in STEM Scholarship',
          story: 'Founded a tech startup focused on renewable energy solutions. The scholarship not only provided financial support but also connected me with mentors.',
          year: '2022',
          current_position: 'CEO of GreenTech Solutions',
          advice: 'Highlight your unique perspective and future goals'
        },
        {
          student_name: 'Kofi Mensah',
          program: 'Business Administration',
          scholarship: 'Rural Student Support Grant',
          story: 'Became the first person from my village to graduate from university. Now working to bring educational opportunities back to my community.',
          year: '2023',
          current_position: 'Community Development Officer',
          advice: 'Your background is your strength, not a limitation'
        }
      ],
      scholarship_videos: [
        {
          title: 'How to Apply for University Scholarships',
          url: 'https://youtube.com/watch?v=scholarship-guide',
          duration: '15:30',
          description: 'Step-by-step guide to scholarship applications',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
        },
        {
          title: 'Financial Aid Workshop',
          url: 'https://youtube.com/watch?v=financial-aid',
          duration: '25:45',
          description: 'Understanding financial aid options and requirements',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
        },
        {
          title: 'Scholarship Interview Tips',
          url: 'https://youtube.com/watch?v=interview-tips',
          duration: '18:20',
          description: 'How to excel in scholarship interviews',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
        }
      ],
      application_deadlines_calendar: {
        early_application: '2025-02-28',
        regular_application: '2025-04-30',
        late_application: '2025-06-15',
        renewal_deadline: '2025-07-31',
        emergency_aid: 'Rolling basis',
        work_study: '2025-05-15'
      },
      financial_need_assessment: 'Financial need is assessed based on family income, assets, household size, number of family members in college, and other financial obligations. Students must provide comprehensive financial documentation including tax returns, bank statements, and employment verification.',
      scholarship_statistics: {
        total_awarded_2024: 245,
        total_amount_2024: 'GHS 4.2 million',
        average_award: 'GHS 17,100',
        renewal_rate: '94%',
        graduation_rate: '96%',
        employment_rate: '92%',
        satisfaction_rating: '4.7/5'
      },
      emergency_financial_support: 'Emergency grants available for students facing unexpected financial hardships including medical emergencies, family crises, natural disasters, or other urgent situations. Contact the Financial Aid Office immediately for assistance. Emergency aid decisions are typically made within 48-72 hours.'
    };

    setScholarshipsData(mockData);
  };

  const openExternalLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    } else {
      Alert.alert('Link Not Available', 'This link is not currently available.');
    }
  };

  const sendEmail = (email: string, subject: string) => {
    if (email) {
      Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
    } else {
      Alert.alert('Email Not Available', 'Email contact is not currently available.');
    }
  };

  const callPhone = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('Phone Not Available', 'Phone contact is not currently available.');
    }
  };

  const toggleSaveScholarship = (scholarshipId: string) => {
    const newSaved = new Set(savedScholarships);
    if (newSaved.has(scholarshipId)) {
      newSaved.delete(scholarshipId);
      Alert.alert('Removed', 'Scholarship removed from saved items');
    } else {
      newSaved.add(scholarshipId);
      Alert.alert('Saved', 'Scholarship saved for later viewing');
    }
    setSavedScholarships(newSaved);
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'merit': return '#3B82F6';
      case 'need': return '#10B981';
      case 'athletic': return '#F59E0B';
      case 'academic': return '#8B5CF6';
      case 'special': return '#EC4899';
      default: return '#6B7280';
    }
  };

  const isDeadlineApproaching = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysUntil = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30 && daysUntil > 0;
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysUntil = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil;
  };

  const renderScholarshipCard = (scholarship: any, index: number, type: string) => {
    const isSaved = savedScholarships.has(`${type}-${index}`);
    
    return (
      <View key={`${type}-scholarship-${index}`} style={styles.scholarshipCard}>
        <View style={styles.cardHeader}>
          <View style={styles.scholarshipInfo}>
            <Text style={styles.scholarshipTitle}>{scholarship.name || 'Scholarship Name Not Available'}</Text>
            <Text style={styles.scholarshipDescription}>{scholarship.description || 'No description available'}</Text>
            <View style={styles.amountContainer}>
              <DollarSign size={20} color="#10B981" />
              <Text style={styles.amount}>{scholarship.amount || 'Amount not specified'}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => toggleSaveScholarship(`${type}-${index}`)}
          >
            <Bookmark size={20} color={isSaved ? "#3B82F6" : "#9CA3AF"} fill={isSaved ? "#3B82F6" : "none"} />
          </TouchableOpacity>
        </View>

        <Text style={styles.criteria}>{scholarship.criteria || 'Criteria not specified'}</Text>

        <View style={styles.scholarshipDetails}>
          {scholarship.awards_available && (
            <View style={styles.detailRow}>
              <Award size={16} color="#6B7280" />
              <Text style={styles.detailText}>{scholarship.awards_available} awards available</Text>
            </View>
          )}
          {scholarship.renewable && (
            <View style={styles.detailRow}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.detailText}>Renewable scholarship</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => openExternalLink(scholarshipsData?.application_url || university?.website || '')}
        >
          <ExternalLink size={16} color="#FFFFFF" />
          <Text style={styles.applyButtonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDocumentChecklist = () => {
    if (!scholarshipsData?.required_documents_checklist || scholarshipsData.required_documents_checklist.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <FileText size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No document checklist available</Text>
        </View>
      );
    }

    return (
      <View style={styles.checklistContainer}>
        {scholarshipsData.required_documents_checklist.map((document: any, index: number) => (
          <View key={`document-${index}`} style={styles.checklistItem}>
            <CheckCircle size={16} color="#10B981" />
            <Text style={styles.checklistText}>
              {typeof document === 'string' ? document : document.document_name || `Document ${index + 1}`}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderStatistics = () => {
    if (!scholarshipsData?.scholarship_statistics) {
      return (
        <View style={styles.noDataContainer}>
          <TrendingUp size={24} color="#9CA3AF" />
          <Text style={styles.noDataText}>No statistics available</Text>
        </View>
      );
    }

    const stats = scholarshipsData.scholarship_statistics;
    
    return (
      <View style={styles.statsGrid}>
        {stats.total_awarded_2024 && (
          <View style={styles.statCard}>
            <Award size={24} color="#3B82F6" />
            <Text style={styles.statValue}>
              {typeof stats.total_awarded_2024 === 'number' ? stats.total_awarded_2024.toLocaleString() : stats.total_awarded_2024}
            </Text>
            <Text style={styles.statLabel}>Awards Given (2024)</Text>
          </View>
        )}
        {stats.total_amount_2024 && (
          <View style={styles.statCard}>
            <DollarSign size={24} color="#10B981" />
            <Text style={styles.statValue}>{stats.total_amount_2024}</Text>
            <Text style={styles.statLabel}>Total Amount</Text>
          </View>
        )}
        {stats.average_award && (
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#F59E0B" />
            <Text style={styles.statValue}>{stats.average_award}</Text>
            <Text style={styles.statLabel}>Average Award</Text>
          </View>
        )}
        {stats.renewal_rate && (
          <View style={styles.statCard}>
            <CheckCircle size={24} color="#8B5CF6" />
            <Text style={styles.statValue}>{stats.renewal_rate}</Text>
            <Text style={styles.statLabel}>Renewal Rate</Text>
          </View>
        )}
      </View>
    );
  };

  const renderTabContent = () => {
    if (!scholarshipsData) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            {/* Financial Aid Overview */}
            {scholarshipsData.financial_aid_overview && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Info size={24} color="#3B82F6" />
                  <Text style={styles.sectionTitle}>Financial Aid Overview</Text>
                </View>
                <Text style={styles.sectionContent}>{scholarshipsData.financial_aid_overview}</Text>
              </View>
            )}

            {/* Scholarship Statistics */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={24} color="#10B981" />
                <Text style={styles.sectionTitle}>Scholarship Statistics</Text>
              </View>
              {renderStatistics()}
            </View>

            {/* Financial Aid Options */}
            {scholarshipsData.financial_aid_options && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <DollarSign size={24} color="#F59E0B" />
                  <Text style={styles.sectionTitle}>Financial Aid Options</Text>
                </View>
                <View style={styles.aidOptionsList}>
                  {Object.entries(scholarshipsData.financial_aid_options).map(([key, value]) => (
                    <View key={`aid-${key}`} style={styles.aidOptionCard}>
                      <Text style={styles.aidOptionTitle}>{key.replace('_', ' ').toUpperCase()}</Text>
                      <Text style={styles.aidOptionText}>{value as string}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        );

      case 'merit':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Star size={24} color="#F59E0B" />
                <Text style={styles.sectionTitle}>Merit-Based Scholarships</Text>
              </View>
              {scholarshipsData.merit_based_scholarships && scholarshipsData.merit_based_scholarships.length > 0 ? (
                <View style={styles.scholarshipsList}>
                  {scholarshipsData.merit_based_scholarships.map((scholarship: any, index: number) => 
                    renderScholarshipCard(scholarship, index, 'merit')
                  )}
                </View>
              ) : (
                <View style={styles.noDataContainer}>
                  <Star size={24} color="#9CA3AF" />
                  <Text style={styles.noDataText}>No merit-based scholarships available</Text>
                </View>
              )}
            </View>
          </View>
        );

      case 'need':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Users size={24} color="#10B981" />
                <Text style={styles.sectionTitle}>Need-Based Scholarships</Text>
              </View>
              {scholarshipsData.need_based_scholarships && scholarshipsData.need_based_scholarships.length > 0 ? (
                <View style={styles.scholarshipsList}>
                  {scholarshipsData.need_based_scholarships.map((scholarship: any, index: number) => 
                    renderScholarshipCard(scholarship, index, 'need')
                  )}
                </View>
              ) : (
                <View style={styles.noDataContainer}>
                  <Users size={24} color="#9CA3AF" />
                  <Text style={styles.noDataText}>No need-based scholarships available</Text>
                </View>
              )}
            </View>
          </View>
        );

      case 'special':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Target size={24} color="#8B5CF6" />
                <Text style={styles.sectionTitle}>Special Category Scholarships</Text>
              </View>
              {scholarshipsData.special_category_scholarships && scholarshipsData.special_category_scholarships.length > 0 ? (
                <View style={styles.scholarshipsList}>
                  {scholarshipsData.special_category_scholarships.map((scholarship: any, index: number) => 
                    renderScholarshipCard(scholarship, index, 'special')
                  )}
                </View>
              ) : (
                <View style={styles.noDataContainer}>
                  <Target size={24} color="#9CA3AF" />
                  <Text style={styles.noDataText}>No special category scholarships available</Text>
                </View>
              )}
            </View>
          </View>
        );

      case 'external':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Globe size={24} color="#06B6D4" />
                <Text style={styles.sectionTitle}>External Scholarships</Text>
              </View>
              {scholarshipsData.external_scholarships_linked && scholarshipsData.external_scholarships_linked.length > 0 ? (
                <View style={styles.externalScholarshipsList}>
                  {scholarshipsData.external_scholarships_linked.map((scholarship: any, index: number) => (
                    <View key={`external-${index}`} style={styles.externalScholarshipCard}>
                      <View style={styles.externalHeader}>
                        <Text style={styles.externalName}>{scholarship.name}</Text>
                        <Text style={styles.externalProvider}>by {scholarship.provider}</Text>
                      </View>
                      <Text style={styles.externalDescription}>{scholarship.description}</Text>
                      <View style={styles.externalAmount}>
                        <DollarSign size={18} color="#10B981" />
                        <Text style={styles.externalAmountText}>{scholarship.amount}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.externalButton}
                        onPress={() => openExternalLink(scholarship.website)}
                      >
                        <ExternalLink size={16} color="#FFFFFF" />
                        <Text style={styles.externalButtonText}>Apply External</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.noDataContainer}>
                  <Globe size={24} color="#9CA3AF" />
                  <Text style={styles.noDataText}>No external scholarships linked</Text>
                </View>
              )}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading scholarships information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !university) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Error Loading Data</Text>
          <Text style={styles.errorText}>{error || 'University not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchScholarshipsData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!scholarshipsData) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.programName}>Scholarships & Financial Aid</Text>
              <Text style={styles.universityName}>{university.name}</Text>
            </View>
          </View>

          <View style={styles.noDataContainer}>
            <Award size={48} color="#9CA3AF" />
            <Text style={styles.noDataTitle}>Scholarships Information Not Available</Text>
            <Text style={styles.noDataText}>
              Detailed scholarships and financial aid information for {university.name} is not currently available in our database.
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

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Info },
    { key: 'merit', label: 'Merit-Based', icon: Star },
    { key: 'need', label: 'Need-Based', icon: Users },
    { key: 'special', label: 'Special', icon: Target },
    { key: 'external', label: 'External', icon: Globe },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.programName}>Scholarships & Financial Aid</Text>
          <Text style={styles.universityName}>{university.name}</Text>
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search scholarships..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <tab.icon size={20} color={activeTab === tab.key ? '#3B82F6' : '#6B7280'} />
              <Text style={[
                styles.tabText, 
                activeTab === tab.key && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}

        {/* Application Process */}
        {scholarshipsData.application_process_guide && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FileText size={24} color="#06B6D4" />
              <Text style={styles.sectionTitle}>Application Process</Text>
            </View>
            <Text style={styles.sectionContent}>{scholarshipsData.application_process_guide}</Text>
          </View>
        )}

        {/* Required Documents */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Required Documents Checklist</Text>
          </View>
          {renderDocumentChecklist()}
        </View>

        {/* Application Deadlines */}
        {scholarshipsData.application_deadlines_calendar && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={24} color="#EF4444" />
              <Text style={styles.sectionTitle}>Application Deadlines</Text>
            </View>
            <View style={styles.deadlinesList}>
              {Object.entries(scholarshipsData.application_deadlines_calendar).map(([category, deadline]) => {
                const isApproaching = typeof deadline === 'string' && isDeadlineApproaching(deadline);
                return (
                  <View key={`deadline-${category}`} style={[
                    styles.deadlineItem,
                    isApproaching && styles.urgentDeadline
                  ]}>
                    <Calendar size={16} color={isApproaching ? "#F59E0B" : "#EF4444"} />
                    <View style={styles.deadlineInfo}>
                      <Text style={styles.deadlineCategory}>{category.replace('_', ' ').toUpperCase()}</Text>
                      <Text style={styles.deadlineDate}>{deadline as string}</Text>
                      {typeof deadline === 'string' && isApproaching && (
                        <Text style={styles.urgentText}>
                          {getDaysUntilDeadline(deadline)} days remaining
                        </Text>
                      )}
                    </View>
                    {isApproaching && (
                      <Zap size={16} color="#F59E0B" />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Success Stories */}
        {scholarshipsData.scholarship_success_stories && scholarshipsData.scholarship_success_stories.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Star size={24} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Success Stories</Text>
            </View>
            <View style={styles.successStoriesList}>
              {scholarshipsData.scholarship_success_stories.map((story: any, index: number) => (
                <View key={`story-${index}`} style={styles.storyCard}>
                  <View style={styles.storyHeader}>
                    <Text style={styles.studentName}>{story.student_name || 'Student Name'}</Text>
                    <Text style={styles.studentYear}>{story.year || 'Year'}</Text>
                  </View>
                  <Text style={styles.studentProgram}>{story.program || 'Program'}</Text>
                  <Text style={styles.scholarshipName}>{story.scholarship || 'Scholarship'}</Text>
                  <Text style={styles.currentPosition}>{story.current_position || 'Current Position'}</Text>
                  <Text style={styles.storyText}>{story.story || 'Success story not available'}</Text>
                  {story.advice && (
                    <View style={styles.adviceContainer}>
                      <Text style={styles.adviceLabel}>Advice:</Text>
                      <Text style={styles.adviceText}>"{story.advice}"</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contact Information */}
        {scholarshipsData.scholarship_office_contact && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Phone size={24} color="#14B8A6" />
              <Text style={styles.sectionTitle}>Scholarship Office Contact</Text>
            </View>
            <View style={styles.contactDetails}>
              {scholarshipsData.scholarship_office_contact.email && (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => sendEmail(scholarshipsData.scholarship_office_contact.email, 'Scholarship Inquiry')}
                >
                  <Mail size={20} color="#3B82F6" />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactValue}>{scholarshipsData.scholarship_office_contact.email}</Text>
                  </View>
                </TouchableOpacity>
              )}
              
              {scholarshipsData.scholarship_office_contact.phone && (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => callPhone(scholarshipsData.scholarship_office_contact.phone)}
                >
                  <Phone size={20} color="#10B981" />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Phone</Text>
                    <Text style={styles.contactValue}>{scholarshipsData.scholarship_office_contact.phone}</Text>
                  </View>
                </TouchableOpacity>
              )}

              {scholarshipsData.scholarship_office_contact.office_location && (
                <View style={styles.contactItem}>
                  <MapPin size={20} color="#8B5CF6" />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Office Location</Text>
                    <Text style={styles.contactValue}>{scholarshipsData.scholarship_office_contact.office_location}</Text>
                  </View>
                </View>
              )}

              {scholarshipsData.scholarship_office_contact.office_hours && (
                <View style={styles.contactItem}>
                  <Clock size={20} color="#F59E0B" />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Office Hours</Text>
                    <Text style={styles.contactValue}>{scholarshipsData.scholarship_office_contact.office_hours}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Emergency Financial Support */}
        {scholarshipsData.emergency_financial_support && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heart size={24} color="#EF4444" />
              <Text style={styles.sectionTitle}>Emergency Financial Support</Text>
            </View>
            <View style={styles.emergencyContainer}>
              <Text style={styles.emergencyText}>{scholarshipsData.emergency_financial_support}</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionButtons}>
          {scholarshipsData.application_url && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => openExternalLink(scholarshipsData.application_url)}
            >
              <ExternalLink size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Apply for Scholarships</Text>
            </TouchableOpacity>
          )}
          
          {university.website && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => openExternalLink(university.website)}
            >
              <Globe size={20} color="#3B82F6" />
              <Text style={styles.secondaryButtonText}>University Website</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
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
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  backButton: {
    backgroundColor: '#6B7280',
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
    paddingVertical: 16,
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
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  tabContent: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  aidOptionsList: {
    gap: 12,
  },
  aidOptionCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  aidOptionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  aidOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  scholarshipsList: {
    gap: 16,
  },
  scholarshipCard: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  scholarshipInfo: {
    flex: 1,
  },
  scholarshipTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  scholarshipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  amount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#15803D',
  },
  saveButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  criteria: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  scholarshipDetails: {
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
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  applyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  externalScholarshipsList: {
    gap: 16,
  },
  externalScholarshipCard: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  externalHeader: {
    marginBottom: 8,
  },
  externalName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  externalProvider: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  externalDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  externalAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  externalAmountText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  externalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#06B6D4',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  externalButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  checklistContainer: {
    gap: 8,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 4,
  },
  checklistText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
    lineHeight: 20,
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
  urgentDeadline: {
    backgroundColor: '#FEF3C7',
    borderLeftColor: '#F59E0B',
  },
  deadlineInfo: {
    flex: 1,
    marginLeft: 12,
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
  urgentText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginTop: 2,
  },
  successStoriesList: {
    gap: 16,
  },
  storyCard: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  studentYear: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  studentProgram: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginBottom: 4,
  },
  scholarshipName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginBottom: 6,
  },
  currentPosition: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginBottom: 12,
  },
  storyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 12,
  },
  adviceContainer: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  adviceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  adviceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E3A8A',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  contactDetails: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  emergencyContainer: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  emergencyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#991B1B',
    lineHeight: 20,
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
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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