import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ExternalLink, Award, Clock, DollarSign, BookOpen, Target, TrendingUp, Search, ListFilter as Filter, ChevronDown, ChevronUp, Star, Users, FileText, Play, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Lightbulb, Building, Globe, Calendar, Brain, Shield, Code, Database, Smartphone, Palette } from 'lucide-react-native';

interface StudyMaterial {
  id: string;
  material_title: string;
  material_type: string;
  material_url: string;
  material_description: string;
  is_free: boolean;
  cost: string;
  provider: string;
  difficulty_level: string;
  estimated_hours: string;
  order_index: number;
}

interface PracticeTest {
  id: string;
  test_title: string;
  test_url: string;
  test_description: string;
  test_type: string;
  question_count: number;
  time_limit: string;
  is_free: boolean;
  cost: string;
  provider: string;
  difficulty_level: string;
  order_index: number;
}

interface Certification {
  id: string;
  certification_name: string;
  certification_provider: string;
  certification_category: string;
  certification_description: string;
  detailed_content: string;
  certification_level: string;
  estimated_duration: string;
  cost_range: string;
  prerequisites: string;
  learning_objectives: string[];
  skills_gained: string[];
  career_benefits: string;
  industry_recognition: string;
  certification_url: string;
  provider_website: string;
  application_process: string;
  exam_format: string;
  passing_criteria: string;
  renewal_requirements: string;
  success_tips: string;
  common_challenges: string;
  job_market_demand: string;
  salary_impact: string;
  related_certifications: any[];
  testimonials: any[];
  order_index: number;
  study_materials: StudyMaterial[];
  practice_tests: PracticeTest[];
}

interface ProgramDetails {
  id: string;
  name: string;
  universities?: {
    name: string;
    location: string;
  };
}

export default function CertificationBoostScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [filteredCertifications, setFilteredCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [expandedCertifications, setExpandedCertifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCertificationsData();
  }, [id]);

  useEffect(() => {
    filterCertifications();
  }, [searchQuery, selectedCategory, selectedLevel, certifications]);

  const fetchCertificationsData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration - replace with actual Supabase calls
      const mockProgram: ProgramDetails = {
        id: id as string,
        name: 'Computer Science',
        universities: {
          name: 'Stanford University',
          location: 'Stanford, CA'
        }
      };

      // Generate comprehensive mock certifications (300+ programs)
      const certificationCategories = [
        'Programming Languages',
        'Cloud Computing',
        'Data Science & Analytics',
        'Cybersecurity',
        'Web Development',
        'Mobile Development',
        'DevOps & Infrastructure',
        'Artificial Intelligence',
        'Database Management',
        'Software Architecture',
        'Project Management',
        'Quality Assurance',
        'UI/UX Design',
        'Blockchain Technology',
        'Game Development'
      ];

      const providers = [
        'AWS', 'Microsoft', 'Google', 'Oracle', 'IBM', 'Cisco', 'CompTIA', 'Salesforce',
        'Adobe', 'VMware', 'Red Hat', 'NVIDIA', 'Meta', 'Apple', 'Coursera', 'edX',
        'Udacity', 'Pluralsight', 'LinkedIn Learning', 'Udemy', 'FreeCodeCamp'
      ];

      const levels = ['beginner', 'intermediate', 'advanced', 'expert'];

      const mockCertifications: Certification[] = Array.from({ length: 300 }, (_, index) => {
        const category = certificationCategories[index % certificationCategories.length];
        const provider = providers[index % providers.length];
        const level = levels[index % levels.length];
        
        const certificationNames = {
          'Programming Languages': [
            'Python Developer Certification', 'Java Professional Certification', 'JavaScript Expert Certification',
            'C++ Programming Certification', 'Go Developer Certification', 'Rust Programming Certification'
          ],
          'Cloud Computing': [
            'AWS Solutions Architect', 'Azure Cloud Engineer', 'Google Cloud Professional',
            'Cloud Security Specialist', 'Multi-Cloud Architect', 'Serverless Computing Expert'
          ],
          'Data Science & Analytics': [
            'Data Scientist Certification', 'Machine Learning Engineer', 'Big Data Analytics',
            'Business Intelligence Analyst', 'Data Visualization Expert', 'Statistical Analysis Certification'
          ],
          'Cybersecurity': [
            'Certified Ethical Hacker', 'Security+ Certification', 'CISSP Certification',
            'Penetration Testing Expert', 'Incident Response Specialist', 'Cloud Security Architect'
          ],
          'Web Development': [
            'Full Stack Web Developer', 'Frontend Developer Certification', 'Backend Developer Expert',
            'React Developer Certification', 'Node.js Professional', 'Progressive Web Apps Expert'
          ]
        };

        const categoryNames = certificationNames[category as keyof typeof certificationNames] || [
          `${category} Professional`, `${category} Expert`, `${category} Specialist`
        ];
        
        const certName = categoryNames[index % categoryNames.length];

        return {
          id: `cert-${index + 1}`,
          certification_name: certName,
          certification_provider: provider,
          certification_category: category,
          certification_description: `Professional certification in ${category.toLowerCase()} designed to validate expertise and advance career opportunities in the field.`,
          detailed_content: `This comprehensive certification program covers advanced concepts in ${category.toLowerCase()}, providing hands-on experience with industry-standard tools and methodologies. Participants will gain practical skills through real-world projects and case studies.`,
          certification_level: level,
          estimated_duration: ['2-4 weeks', '1-3 months', '3-6 months', '6-12 months'][index % 4],
          cost_range: ['Free', '$99-$299', '$300-$599', '$600-$1,200', '$1,200-$3,000'][index % 5],
          prerequisites: level === 'beginner' ? 'Basic computer literacy' : `${level === 'intermediate' ? 'Basic' : 'Advanced'} knowledge in ${category.toLowerCase()}`,
          learning_objectives: [
            `Master core concepts in ${category.toLowerCase()}`,
            'Apply theoretical knowledge to practical scenarios',
            'Develop industry-standard best practices',
            'Build portfolio-worthy projects',
            'Prepare for certification examination'
          ],
          skills_gained: [
            `${category} fundamentals`,
            'Problem-solving techniques',
            'Industry best practices',
            'Project management',
            'Technical communication'
          ],
          career_benefits: `Enhances career prospects in ${category.toLowerCase()}, increases earning potential by 15-30%, and provides industry recognition.`,
          industry_recognition: `Widely recognized by top tech companies and ${category.toLowerCase()} professionals worldwide.`,
          certification_url: `https://${provider.toLowerCase().replace(' ', '')}.com/certification/${certName.toLowerCase().replace(/\s+/g, '-')}`,
          provider_website: `https://${provider.toLowerCase().replace(' ', '')}.com`,
          application_process: 'Online registration, complete coursework, pass final examination',
          exam_format: ['Multiple choice', 'Hands-on lab', 'Project-based', 'Mixed format'][index % 4],
          passing_criteria: ['70% minimum score', '75% minimum score', '80% minimum score'][index % 3],
          renewal_requirements: level === 'expert' ? 'Renewal every 3 years with continuing education' : 'Renewal every 2 years',
          success_tips: `Focus on hands-on practice, join study groups, and utilize official ${provider} resources for best results.`,
          common_challenges: 'Time management, complex technical concepts, and practical application of theoretical knowledge.',
          job_market_demand: ['High demand', 'Very high demand', 'Extremely high demand'][index % 3],
          salary_impact: ['10-20% increase', '15-25% increase', '20-35% increase'][index % 3],
          related_certifications: [
            `Advanced ${category} Certification`,
            `${category} Architecture Certification`,
            `${category} Security Certification`
          ],
          testimonials: [
            {
              name: `Professional ${index + 1}`,
              role: `${category} Engineer`,
              company: `Tech Company ${index + 1}`,
              testimonial: `This certification significantly boosted my career in ${category.toLowerCase()}. The practical skills I gained were immediately applicable in my work.`
            }
          ],
          order_index: index,
          study_materials: Array.from({ length: 5 }, (_, matIndex) => ({
            id: `mat-${index}-${matIndex}`,
            material_title: `${certName} Study Guide ${matIndex + 1}`,
            material_type: ['book', 'video_course', 'online_tutorial', 'practice_lab', 'documentation'][matIndex % 5],
            material_url: `https://${provider.toLowerCase().replace(' ', '')}.com/study-materials/${matIndex + 1}`,
            material_description: `Comprehensive study material covering key concepts in ${certName.toLowerCase()}`,
            is_free: matIndex < 2,
            cost: matIndex < 2 ? '' : `$${Math.floor(Math.random() * 200) + 50}`,
            provider: provider,
            difficulty_level: level,
            estimated_hours: `${Math.floor(Math.random() * 40) + 10} hours`,
            order_index: matIndex,
            created_at: new Date().toISOString()
          })),
          practice_tests: Array.from({ length: 3 }, (_, testIndex) => ({
            id: `test-${index}-${testIndex}`,
            test_title: `${certName} Practice Test ${testIndex + 1}`,
            test_url: `https://${provider.toLowerCase().replace(' ', '')}.com/practice-tests/${testIndex + 1}`,
            test_description: `Comprehensive practice test simulating the actual ${certName} certification exam`,
            test_type: ['practice_exam', 'mock_test', 'quiz_bank'][testIndex % 3],
            question_count: Math.floor(Math.random() * 100) + 50,
            time_limit: `${Math.floor(Math.random() * 120) + 60} minutes`,
            is_free: testIndex === 0,
            cost: testIndex === 0 ? '' : `$${Math.floor(Math.random() * 100) + 25}`,
            provider: provider,
            difficulty_level: level,
            order_index: testIndex,
            created_at: new Date().toISOString()
          }))
        };
      });

      setProgram(mockProgram);
      setCertifications(mockCertifications);
      setFilteredCertifications(mockCertifications);
    } catch (err) {
      setError('Failed to load certification programs');
    } finally {
      setLoading(false);
    }
  };

  const filterCertifications = () => {
    let filtered = certifications;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(cert =>
        cert.certification_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.certification_provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.certification_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.certification_description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(cert => cert.certification_category === selectedCategory);
    }

    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(cert => cert.certification_level === selectedLevel);
    }

    setFilteredCertifications(filtered);
  };

  const openExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  const toggleCertificationExpansion = (certId: string) => {
    const newExpanded = new Set(expandedCertifications);
    if (newExpanded.has(certId)) {
      newExpanded.delete(certId);
    } else {
      newExpanded.add(certId);
    }
    setExpandedCertifications(newExpanded);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Programming Languages': return Code;
      case 'Cloud Computing': return Globe;
      case 'Data Science & Analytics': return TrendingUp;
      case 'Cybersecurity': return Shield;
      case 'Web Development': return Globe;
      case 'Mobile Development': return Smartphone;
      case 'DevOps & Infrastructure': return Building;
      case 'Artificial Intelligence': return Brain;
      case 'Database Management': return Database;
      case 'UI/UX Design': return Palette;
      default: return Award;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Programming Languages': return '#3B82F6';
      case 'Cloud Computing': return '#10B981';
      case 'Data Science & Analytics': return '#8B5CF6';
      case 'Cybersecurity': return '#EF4444';
      case 'Web Development': return '#F59E0B';
      case 'Mobile Development': return '#06B6D4';
      case 'DevOps & Infrastructure': return '#84CC16';
      case 'Artificial Intelligence': return '#EC4899';
      case 'Database Management': return '#F97316';
      case 'UI/UX Design': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      case 'expert': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getMaterialTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return BookOpen;
      case 'video_course': return Play;
      case 'online_tutorial': return Globe;
      case 'practice_lab': return Code;
      case 'documentation': return FileText;
      default: return BookOpen;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading certification programs...</Text>
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
    { key: 'all', label: 'All Categories', count: certifications.length },
    ...Array.from(new Set(certifications.map(c => c.certification_category))).map(cat => ({
      key: cat,
      label: cat,
      count: certifications.filter(c => c.certification_category === cat).length
    }))
  ];

  const levels = [
    { key: 'all', label: 'All Levels', count: certifications.length },
    { key: 'beginner', label: 'Beginner', count: certifications.filter(c => c.certification_level === 'beginner').length },
    { key: 'intermediate', label: 'Intermediate', count: certifications.filter(c => c.certification_level === 'intermediate').length },
    { key: 'advanced', label: 'Advanced', count: certifications.filter(c => c.certification_level === 'advanced').length },
    { key: 'expert', label: 'Expert', count: certifications.filter(c => c.certification_level === 'expert').length }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.programName}>Certification Boost</Text>
            <Text style={styles.universityName}>{program.name} - {program.universities?.name}</Text>
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search certifications, providers, or categories..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {categories.slice(0, 6).map((category) => (
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

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.levelFilterContainer}>
            {levels.map((level) => (
              <TouchableOpacity
                key={level.key}
                style={[styles.levelButton, selectedLevel === level.key && styles.levelButtonActive]}
                onPress={() => setSelectedLevel(level.key)}
              >
                <Text style={[styles.levelText, selectedLevel === level.key && styles.levelTextActive]}>
                  {level.label} ({level.count})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.introSection}>
          <Award size={24} color="#3B82F6" />
          <Text style={styles.introTitle}>Professional Certifications for {program.name}</Text>
          <Text style={styles.introText}>
            Boost your career with industry-recognized certifications. Over 300 certification programs 
            carefully curated to complement your {program.name} education and enhance your professional credentials.
          </Text>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredCertifications.length} certification programs available
          </Text>
        </View>

        {filteredCertifications.map((certification) => (
          <View key={certification.id} style={styles.certificationCard}>
            <TouchableOpacity
              style={styles.certificationHeader}
              onPress={() => toggleCertificationExpansion(certification.id)}
            >
              <View style={styles.certificationInfo}>
                <View style={styles.titleRow}>
                  <View style={[styles.categoryIcon, { backgroundColor: `${getCategoryColor(certification.certification_category)}15` }]}>
                    {React.createElement(getCategoryIcon(certification.certification_category), { 
                      size: 20, 
                      color: getCategoryColor(certification.certification_category) 
                    })}
                  </View>
                  <View style={styles.titleInfo}>
                    <Text style={styles.certificationName}>{certification.certification_name}</Text>
                    <Text style={styles.provider}>by {certification.certification_provider}</Text>
                  </View>
                </View>
                
                <View style={styles.certificationMeta}>
                  <View style={[styles.levelBadge, { backgroundColor: `${getLevelColor(certification.certification_level)}15` }]}>
                    <Text style={[styles.levelText, { color: getLevelColor(certification.certification_level) }]}>
                      {certification.certification_level}
                    </Text>
                  </View>
                  <View style={styles.durationContainer}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.duration}>{certification.estimated_duration}</Text>
                  </View>
                  <View style={styles.costContainer}>
                    <DollarSign size={14} color="#6B7280" />
                    <Text style={styles.cost}>{certification.cost_range}</Text>
                  </View>
                </View>

                <Text style={styles.description}>{certification.certification_description}</Text>
              </View>
              {expandedCertifications.has(certification.id) ? (
                <ChevronUp size={24} color="#6B7280" />
              ) : (
                <ChevronDown size={24} color="#6B7280" />
              )}
            </TouchableOpacity>

            {expandedCertifications.has(certification.id) && (
              <View style={styles.certificationContent}>
                {/* Detailed Content */}
                <View style={styles.contentSection}>
                  <View style={styles.sectionHeader}>
                    <BookOpen size={20} color="#3B82F6" />
                    <Text style={styles.sectionTitle}>Program Overview</Text>
                  </View>
                  <Text style={styles.detailedContent}>{certification.detailed_content}</Text>
                </View>

                {/* Learning Objectives */}
                <View style={styles.objectivesSection}>
                  <View style={styles.sectionHeader}>
                    <Target size={20} color="#10B981" />
                    <Text style={styles.sectionTitle}>Learning Objectives</Text>
                  </View>
                  <View style={styles.objectivesList}>
                    {certification.learning_objectives.map((objective, index) => (
                      <View key={index} style={styles.objectiveItem}>
                        <CheckCircle size={16} color="#10B981" />
                        <Text style={styles.objectiveText}>{objective}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Skills Gained */}
                <View style={styles.skillsSection}>
                  <View style={styles.sectionHeader}>
                    <Star size={20} color="#F59E0B" />
                    <Text style={styles.sectionTitle}>Skills You'll Gain</Text>
                  </View>
                  <View style={styles.skillsContainer}>
                    {certification.skills_gained.map((skill, index) => (
                      <View key={index} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Career Benefits */}
                <View style={styles.benefitsSection}>
                  <View style={styles.sectionHeader}>
                    <TrendingUp size={20} color="#8B5CF6" />
                    <Text style={styles.sectionTitle}>Career Benefits</Text>
                  </View>
                  <Text style={styles.benefitsText}>{certification.career_benefits}</Text>
                  <View style={styles.impactStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Market Demand:</Text>
                      <Text style={styles.statValue}>{certification.job_market_demand}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Salary Impact:</Text>
                      <Text style={styles.statValue}>{certification.salary_impact}</Text>
                    </View>
                  </View>
                </View>

                {/* Exam Information */}
                <View style={styles.examSection}>
                  <View style={styles.sectionHeader}>
                    <FileText size={20} color="#EC4899" />
                    <Text style={styles.sectionTitle}>Exam Information</Text>
                  </View>
                  <View style={styles.examDetails}>
                    <View style={styles.examDetailItem}>
                      <Text style={styles.examLabel}>Format:</Text>
                      <Text style={styles.examValue}>{certification.exam_format}</Text>
                    </View>
                    <View style={styles.examDetailItem}>
                      <Text style={styles.examLabel}>Passing Criteria:</Text>
                      <Text style={styles.examValue}>{certification.passing_criteria}</Text>
                    </View>
                    <View style={styles.examDetailItem}>
                      <Text style={styles.examLabel}>Prerequisites:</Text>
                      <Text style={styles.examValue}>{certification.prerequisites}</Text>
                    </View>
                  </View>
                </View>

                {/* Study Materials */}
                <View style={styles.materialsSection}>
                  <View style={styles.sectionHeader}>
                    <BookOpen size={20} color="#06B6D4" />
                    <Text style={styles.sectionTitle}>Study Materials</Text>
                  </View>
                  <View style={styles.materialsList}>
                    {certification.study_materials.map((material) => {
                      const IconComponent = getMaterialTypeIcon(material.material_type);
                      
                      return (
                        <TouchableOpacity
                          key={material.id}
                          style={styles.materialCard}
                          onPress={() => openExternalLink(material.material_url)}
                        >
                          <View style={styles.materialIcon}>
                            <IconComponent size={16} color="#3B82F6" />
                          </View>
                          <View style={styles.materialInfo}>
                            <Text style={styles.materialTitle}>{material.material_title}</Text>
                            <Text style={styles.materialDescription}>{material.material_description}</Text>
                            <View style={styles.materialMeta}>
                              <Text style={styles.materialType}>{material.material_type.replace('_', ' ')}</Text>
                              <Text style={styles.materialHours}>{material.estimated_hours}</Text>
                              {material.is_free ? (
                                <Text style={styles.freeText}>Free</Text>
                              ) : (
                                <Text style={styles.paidText}>{material.cost}</Text>
                              )}
                            </View>
                          </View>
                          <ExternalLink size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Practice Tests */}
                <View style={styles.testsSection}>
                  <View style={styles.sectionHeader}>
                    <FileText size={20} color="#14B8A6" />
                    <Text style={styles.sectionTitle}>Practice Tests</Text>
                  </View>
                  <View style={styles.testsList}>
                    {certification.practice_tests.map((test) => (
                      <TouchableOpacity
                        key={test.id}
                        style={styles.testCard}
                        onPress={() => openExternalLink(test.test_url)}
                      >
                        <View style={styles.testInfo}>
                          <Text style={styles.testTitle}>{test.test_title}</Text>
                          <Text style={styles.testDescription}>{test.test_description}</Text>
                          <View style={styles.testMeta}>
                            <Text style={styles.testDetail}>{test.question_count} questions</Text>
                            <Text style={styles.testDetail}>{test.time_limit}</Text>
                            {test.is_free ? (
                              <Text style={styles.freeText}>Free</Text>
                            ) : (
                              <Text style={styles.paidText}>{test.cost}</Text>
                            )}
                          </View>
                        </View>
                        <ExternalLink size={16} color="#9CA3AF" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Success Tips */}
                <View style={styles.tipsSection}>
                  <View style={styles.sectionHeader}>
                    <Lightbulb size={20} color="#F59E0B" />
                    <Text style={styles.sectionTitle}>Success Tips</Text>
                  </View>
                  <Text style={styles.tipsText}>{certification.success_tips}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => openExternalLink(certification.certification_url)}
                  >
                    <Award size={16} color="#FFFFFF" />
                    <Text style={styles.primaryButtonText}>Start Certification</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => openExternalLink(certification.provider_website)}
                  >
                    <Building size={16} color="#3B82F6" />
                    <Text style={styles.secondaryButtonText}>Provider</Text>
                  </TouchableOpacity>
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
    marginBottom: 12,
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
  levelFilterContainer: {
    flexDirection: 'row',
  },
  levelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 6,
  },
  levelButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  levelText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  levelTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  introSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  introTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  resultsHeader: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  certificationCard: {
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
  certificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  certificationInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleInfo: {
    flex: 1,
  },
  certificationName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  provider: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  certificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duration: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cost: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  certificationContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contentSection: {
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
  detailedContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 22,
  },
  objectivesSection: {
    marginBottom: 20,
  },
  objectivesList: {
    gap: 8,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  objectiveText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
    lineHeight: 20,
  },
  skillsSection: {
    marginBottom: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#F59E0B15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
  },
  benefitsSection: {
    marginBottom: 20,
  },
  benefitsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  impactStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  examSection: {
    marginBottom: 20,
  },
  examDetails: {
    gap: 8,
  },
  examDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  examLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  examValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  materialsSection: {
    marginBottom: 20,
  },
  materialsList: {
    gap: 8,
  },
  materialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  materialIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F615',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  materialDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 6,
  },
  materialMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  materialType: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    textTransform: 'capitalize',
  },
  materialHours: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  freeText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  paidText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  testsSection: {
    marginBottom: 20,
  },
  testsList: {
    gap: 8,
  },
  testCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  testInfo: {
    flex: 1,
  },
  testTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  testDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 6,
  },
  testMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  testDetail: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  tipsSection: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
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