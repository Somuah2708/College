import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Globe, MapPin, ExternalLink, Calendar, DollarSign, Clock, Building, Mail, Search, ListFilter as Filter, Briefcase, GraduationCap, Award, Users, Plane, BookOpen, Target, Heart, CircleCheck as CheckCircle } from 'lucide-react-native';

interface JobOpportunity {
  id: string;
  job_title: string;
  company_name: string;
  location_country: string;
  location_city: string;
  job_description: string;
  application_url: string;
  application_deadline: string;
  salary_range: string;
  experience_level: string;
  job_type: string;
  requirements: string;
  benefits: string;
  contact_email: string;
  company_website: string;
  is_remote: boolean;
  visa_sponsorship: boolean;
  order_index: number;
}

interface ExchangeProgram {
  id: string;
  program_name: string;
  host_university: string;
  host_country: string;
  host_city: string;
  program_description: string;
  duration: string;
  application_url: string;
  application_deadline: string;
  eligibility_requirements: string;
  financial_support: string;
  language_requirements: string;
  academic_requirements: string;
  application_process: string;
  contact_email: string;
  program_website: string;
  additional_resources: any[];
  program_type: string;
  scholarship_available: boolean;
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

export default function GlobalExposureScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [jobOpportunities, setJobOpportunities] = useState<JobOpportunity[]>([]);
  const [exchangePrograms, setExchangePrograms] = useState<ExchangeProgram[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobOpportunity[]>([]);
  const [filteredExchanges, setFilteredExchanges] = useState<ExchangeProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'jobs' | 'exchanges'>('jobs');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    fetchGlobalExposureData();
  }, [id]);

  useEffect(() => {
    filterData();
  }, [searchQuery, selectedFilter, jobOpportunities, exchangePrograms, activeTab]);

  const fetchGlobalExposureData = async () => {
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

      // Generate comprehensive mock job opportunities
      const mockJobs: JobOpportunity[] = generateJobsForProgram(mockProgram.name, 100);

      // Generate comprehensive mock exchange programs
      const mockExchanges: ExchangeProgram[] = generateExchangesForProgram(mockProgram.name, 50);

      setProgram(mockProgram);
      setJobOpportunities(mockJobs);
      setExchangePrograms(mockExchanges);
      setFilteredJobs(mockJobs);
      setFilteredExchanges(mockExchanges);
    } catch (err) {
      setError('Failed to load global exposure opportunities');
    } finally {
      setLoading(false);
    }
  };

  const generateJobsForProgram = (programName: string, count: number): JobOpportunity[] => {
    const name = programName.toLowerCase();
    
    let companies: string[] = [];
    let jobTitles: string[] = [];
    
    if (name.includes('computer science') || name.includes('software')) {
      companies = ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'Uber', 'Airbnb', 'Spotify'];
      jobTitles = ['Software Engineer', 'Senior Software Engineer', 'Data Scientist', 'Product Manager', 'Engineering Manager', 'Tech Lead', 'Principal Engineer', 'Research Scientist'];
    } else if (name.includes('business') || name.includes('management')) {
      companies = ['McKinsey & Company', 'Boston Consulting Group', 'Deloitte', 'PwC', 'Goldman Sachs', 'JP Morgan', 'Coca-Cola', 'Unilever', 'Procter & Gamble', 'Johnson & Johnson'];
      jobTitles = ['Business Analyst', 'Management Consultant', 'Financial Analyst', 'Product Manager', 'Operations Manager', 'Strategy Manager', 'Business Development Manager', 'Marketing Manager'];
    } else if (name.includes('engineering')) {
      companies = ['General Electric', 'Siemens', 'Boeing', 'Lockheed Martin', 'Caterpillar', 'Ford', 'Toyota', 'Shell', 'ExxonMobil', 'Chevron'];
      jobTitles = ['Design Engineer', 'Project Engineer', 'Senior Engineer', 'Engineering Manager', 'Chief Engineer', 'Technical Director', 'R&D Manager', 'Consultant Engineer'];
    } else if (name.includes('medicine') || name.includes('health')) {
      companies = ['Johns Hopkins Hospital', 'Mayo Clinic', 'Cleveland Clinic', 'WHO', 'CDC', 'Pfizer', 'Johnson & Johnson', 'Novartis', 'Roche', 'Merck'];
      jobTitles = ['Medical Doctor', 'Specialist Physician', 'Medical Researcher', 'Healthcare Administrator', 'Public Health Officer', 'Clinical Director', 'Medical Director', 'Health Policy Analyst'];
    } else if (name.includes('law')) {
      companies = ['Baker McKenzie', 'Clifford Chance', 'Linklaters', 'Freshfields', 'Allen & Overy', 'Supreme Court', 'Ministry of Justice', 'UN Legal Affairs', 'World Bank Legal'];
      jobTitles = ['Associate Lawyer', 'Senior Associate', 'Partner', 'Legal Counsel', 'Attorney General', 'Legal Advisor', 'Corporate Lawyer', 'Judge'];
    } else if (name.includes('psychology')) {
      companies = ['Mayo Clinic', 'Johns Hopkins', 'Harvard Medical School', 'APA', 'Mental Health America', 'NIMH', 'Psychology Today', 'BetterHelp', 'Headspace'];
      jobTitles = ['Clinical Psychologist', 'Research Psychologist', 'Counseling Psychologist', 'Organizational Psychologist', 'Psychology Professor', 'Therapy Director', 'Mental Health Coordinator'];
    } else {
      companies = [`Leading ${programName} Company`, `Global ${programName} Corporation`, `${programName} Innovations Inc`, `Premier ${programName} Group`, `${programName} Solutions Ltd`];
      jobTitles = [`${programName} Specialist`, `Senior ${programName} Professional`, `${programName} Manager`, `${programName} Director`, `${programName} Consultant`, `${programName} Expert`];
    }

    const countries = [
      { country: 'United States', cities: ['San Francisco', 'New York', 'Seattle', 'Austin'] },
      { country: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'] },
      { country: 'United Kingdom', cities: ['London', 'Manchester', 'Edinburgh', 'Cambridge'] },
      { country: 'Germany', cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'] },
      { country: 'Netherlands', cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'] },
      { country: 'Singapore', cities: ['Singapore'] },
      { country: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'] },
      { country: 'Japan', cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama'] }
    ];

    return Array.from({ length: count }, (_, index) => {
      const company = companies[index % companies.length];
      const jobTitle = jobTitles[index % jobTitles.length];
      const location = countries[index % countries.length];
      const city = location.cities[index % location.cities.length];
      const isRemote = Math.random() > 0.7;
      const visaSponsorship = Math.random() > 0.5;

      return {
        id: `job-${index + 1}`,
        job_title: jobTitle,
        company_name: company,
        location_country: location.country,
        location_city: city,
        job_description: `Join ${company} as a ${jobTitle} and work on innovative projects in ${programName.toLowerCase()}. You'll collaborate with world-class professionals and contribute to cutting-edge solutions.`,
        application_url: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/careers`,
        application_deadline: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        salary_range: `$${Math.floor(Math.random() * 100000) + 80000} - $${Math.floor(Math.random() * 150000) + 120000}`,
        experience_level: ['Entry Level', 'Mid Level', 'Senior Level'][Math.floor(Math.random() * 3)],
        job_type: ['Full-time', 'Contract', 'Internship'][Math.floor(Math.random() * 3)],
        requirements: `Bachelor's degree in ${programName} or related field, Strong foundational skills, Experience with industry tools`,
        benefits: 'Health insurance, Stock options, Flexible work arrangements, Professional development budget',
        contact_email: `careers@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        company_website: `https://${company.toLowerCase().replace(/\s+/g, '')}.com`,
        is_remote: isRemote,
        visa_sponsorship: visaSponsorship,
        order_index: index
      };
    });
  };

  const generateExchangesForProgram = (programName: string, count: number): ExchangeProgram[] => {
    const universities = [
      { name: 'University of Oxford', country: 'United Kingdom', city: 'Oxford' },
      { name: 'ETH Zurich', country: 'Switzerland', city: 'Zurich' },
      { name: 'University of Tokyo', country: 'Japan', city: 'Tokyo' },
      { name: 'National University of Singapore', country: 'Singapore', city: 'Singapore' },
      { name: 'University of Melbourne', country: 'Australia', city: 'Melbourne' },
      { name: 'Technical University of Munich', country: 'Germany', city: 'Munich' },
      { name: 'University of Toronto', country: 'Canada', city: 'Toronto' },
      { name: 'KTH Royal Institute of Technology', country: 'Sweden', city: 'Stockholm' },
      { name: 'Delft University of Technology', country: 'Netherlands', city: 'Delft' },
      { name: 'École Polytechnique Fédérale de Lausanne', country: 'Switzerland', city: 'Lausanne' }
    ];

    const programTypes = ['Semester Exchange', 'Summer Program', 'Research Exchange', 'Dual Degree', 'Internship Program'];
    
    return Array.from({ length: count }, (_, index) => {
      const university = universities[index % universities.length];
      const programType = programTypes[index % programTypes.length];
      const scholarshipAvailable = Math.random() > 0.6;

      return {
        id: `exchange-${index + 1}`,
        program_name: `${programType} in ${programName} at ${university.name}`,
        host_university: university.name,
        host_country: university.country,
        host_city: university.city,
        program_description: `Experience world-class education in ${programName.toLowerCase()} at ${university.name} through our ${programType}. Immerse yourself in a different academic culture while advancing your studies.`,
        duration: ['1 semester', '2 semesters', '6 weeks', '3 months', '1 year'][Math.floor(Math.random() * 5)],
        application_url: `https://${university.name.toLowerCase().replace(/\s+/g, '')}.edu/exchange`,
        application_deadline: new Date(Date.now() + Math.random() * 120 * 24 * 60 * 60 * 1000).toISOString(),
        eligibility_requirements: `Minimum GPA 3.5, Completed 2 years of ${programName} study, Good academic standing`,
        financial_support: scholarshipAvailable ? 'Partial scholarship available, Living allowance provided' : 'Self-funded, Financial aid may be available',
        language_requirements: university.country === 'Japan' ? 'Basic Japanese or English proficiency' : 
                              university.country === 'Germany' ? 'German B2 level or English proficiency' :
                              'English proficiency (IELTS 6.5+ or TOEFL 90+)',
        academic_requirements: `Strong performance in core ${programName.toLowerCase()} subjects, Letter of recommendation from faculty`,
        application_process: 'Online application, Academic transcripts, Personal statement, Faculty recommendation',
        contact_email: `exchange@${university.name.toLowerCase().replace(/\s+/g, '')}.edu`,
        program_website: `https://${university.name.toLowerCase().replace(/\s+/g, '')}.edu/international`,
        additional_resources: [
          { title: 'Program Handbook', url: `https://${university.name.toLowerCase().replace(/\s+/g, '')}.edu/handbook` },
          { title: 'Student Testimonials', url: `https://${university.name.toLowerCase().replace(/\s+/g, '')}.edu/testimonials` },
          { title: 'Housing Information', url: `https://${university.name.toLowerCase().replace(/\s+/g, '')}.edu/housing` }
        ],
        program_type: programType,
        scholarship_available: scholarshipAvailable,
        order_index: index
      };
    });
  };
  
  const filterData = () => {
    if (activeTab === 'jobs') {
      let filtered = jobOpportunities;

      // Apply search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter(job =>
          job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location_country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location_city.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply filter
      if (selectedFilter === 'remote') {
        filtered = filtered.filter(job => job.is_remote);
      } else if (selectedFilter === 'visa') {
        filtered = filtered.filter(job => job.visa_sponsorship);
      } else if (selectedFilter === 'entry') {
        filtered = filtered.filter(job => job.experience_level === 'Entry Level');
      }

      setFilteredJobs(filtered);
    } else {
      let filtered = exchangePrograms;

      // Apply search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter(exchange =>
          exchange.program_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exchange.host_university.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exchange.host_country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exchange.program_type.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply filter
      if (selectedFilter === 'scholarship') {
        filtered = filtered.filter(exchange => exchange.scholarship_available);
      } else if (selectedFilter === 'semester') {
        filtered = filtered.filter(exchange => exchange.program_type === 'Semester Exchange');
      } else if (selectedFilter === 'summer') {
        filtered = filtered.filter(exchange => exchange.program_type === 'Summer Program');
      }

      setFilteredExchanges(filtered);
    }
  };

  const openExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  const sendEmail = (email: string, subject: string) => {
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading global opportunities...</Text>
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

  const jobFilters = [
    { key: 'all', label: 'All Jobs', count: jobOpportunities.length },
    { key: 'remote', label: 'Remote', count: jobOpportunities.filter(j => j.is_remote).length },
    { key: 'visa', label: 'Visa Sponsorship', count: jobOpportunities.filter(j => j.visa_sponsorship).length },
    { key: 'entry', label: 'Entry Level', count: jobOpportunities.filter(j => j.experience_level === 'Entry Level').length }
  ];

  const exchangeFilters = [
    { key: 'all', label: 'All Programs', count: exchangePrograms.length },
    { key: 'scholarship', label: 'With Scholarship', count: exchangePrograms.filter(e => e.scholarship_available).length },
    { key: 'semester', label: 'Semester Exchange', count: exchangePrograms.filter(e => e.program_type === 'Semester Exchange').length },
    { key: 'summer', label: 'Summer Programs', count: exchangePrograms.filter(e => e.program_type === 'Summer Program').length }
  ];

  const currentFilters = activeTab === 'jobs' ? jobFilters : exchangeFilters;
  const currentData = activeTab === 'jobs' ? filteredJobs : filteredExchanges;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.programName}>Global Exposure</Text>
            <Text style={styles.universityName}>{program.name} - {program.universities?.name}</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'jobs' && styles.activeTab]}
            onPress={() => setActiveTab('jobs')}
          >
            <Briefcase size={20} color={activeTab === 'jobs' ? '#3B82F6' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'jobs' && styles.activeTabText]}>
              Job Opportunities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'exchanges' && styles.activeTab]}
            onPress={() => setActiveTab('exchanges')}
          >
            <Plane size={20} color={activeTab === 'exchanges' ? '#3B82F6' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'exchanges' && styles.activeTabText]}>
              Exchange Programs
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder={activeTab === 'jobs' ? 'Search jobs, companies, or locations...' : 'Search programs, universities, or countries...'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {currentFilters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[styles.filterButton, selectedFilter === filter.key && styles.filterButtonActive]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text style={[styles.filterText, selectedFilter === filter.key && styles.filterTextActive]}>
                  {filter.label} ({filter.count})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {currentData.length} {activeTab === 'jobs' ? 'job opportunities' : 'exchange programs'} found
          </Text>
        </View>

        {activeTab === 'jobs' ? (
          // Job Opportunities
          filteredJobs.map((job) => (
            <View key={job.id} style={styles.opportunityCard}>
              <View style={styles.cardHeader}>
                <View style={styles.opportunityInfo}>
                  <Text style={styles.jobTitle}>{job.job_title}</Text>
                  <Text style={styles.companyName}>{job.company_name}</Text>
                  <View style={styles.locationContainer}>
                    <MapPin size={16} color="#6B7280" />
                    <Text style={styles.locationText}>
                      {job.is_remote ? 'Remote' : `${job.location_city}, ${job.location_country}`}
                    </Text>
                  </View>
                </View>
                <View style={styles.badgesContainer}>
                  {job.is_remote && (
                    <View style={styles.remoteBadge}>
                      <Globe size={12} color="#10B981" />
                      <Text style={styles.remoteBadgeText}>Remote</Text>
                    </View>
                  )}
                  {job.visa_sponsorship && (
                    <View style={styles.visaBadge}>
                      <CheckCircle size={12} color="#3B82F6" />
                      <Text style={styles.visaBadgeText}>Visa</Text>
                    </View>
                  )}
                </View>
              </View>

              <Text style={styles.description} numberOfLines={3}>
                {job.job_description}
              </Text>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <DollarSign size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{job.salary_range}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Users size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{job.experience_level}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{job.job_type}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.requirementsSection}>
                <Text style={styles.requirementsTitle}>Requirements:</Text>
                <Text style={styles.requirementsText}>{job.requirements}</Text>
              </View>

              <View style={styles.benefitsSection}>
                <Text style={styles.benefitsTitle}>Benefits:</Text>
                <Text style={styles.benefitsText}>{job.benefits}</Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => openExternalLink(job.application_url)}
                >
                  <ExternalLink size={16} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Apply Now</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => openExternalLink(job.company_website)}
                >
                  <Building size={16} color="#3B82F6" />
                  <Text style={styles.secondaryButtonText}>Company</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => sendEmail(job.contact_email, `Application for ${job.job_title}`)}
                >
                  <Mail size={16} color="#3B82F6" />
                  <Text style={styles.secondaryButtonText}>Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          // Exchange Programs
          filteredExchanges.map((exchange) => (
            <View key={exchange.id} style={styles.opportunityCard}>
              <View style={styles.cardHeader}>
                <View style={styles.opportunityInfo}>
                  <Text style={styles.programTitle}>{exchange.program_name}</Text>
                  <Text style={styles.universityName}>{exchange.host_university}</Text>
                  <View style={styles.locationContainer}>
                    <MapPin size={16} color="#6B7280" />
                    <Text style={styles.locationText}>
                      {exchange.host_city}, {exchange.host_country}
                    </Text>
                  </View>
                </View>
                <View style={styles.badgesContainer}>
                  {exchange.scholarship_available && (
                    <View style={styles.scholarshipBadge}>
                      <Award size={12} color="#F59E0B" />
                      <Text style={styles.scholarshipBadgeText}>Scholarship</Text>
                    </View>
                  )}
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{exchange.program_type}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.description} numberOfLines={3}>
                {exchange.program_description}
              </Text>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.detailText}>Duration: {exchange.duration}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#6B7280" />
                  <Text style={styles.detailText}>
                    Deadline: {new Date(exchange.application_deadline).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <DollarSign size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{exchange.financial_support}</Text>
                </View>
              </View>

              <View style={styles.requirementsSection}>
                <Text style={styles.requirementsTitle}>Eligibility:</Text>
                <Text style={styles.requirementsText}>{exchange.eligibility_requirements}</Text>
              </View>

              <View style={styles.requirementsSection}>
                <Text style={styles.requirementsTitle}>Language Requirements:</Text>
                <Text style={styles.requirementsText}>{exchange.language_requirements}</Text>
              </View>

              <View style={styles.resourcesSection}>
                <Text style={styles.resourcesTitle}>Additional Resources:</Text>
                <View style={styles.resourcesList}>
                  {exchange.additional_resources.map((resource: any, index: number) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.resourceLink}
                      onPress={() => openExternalLink(resource.url)}
                    >
                      <BookOpen size={14} color="#3B82F6" />
                      <Text style={styles.resourceLinkText}>{resource.title}</Text>
                      <ExternalLink size={12} color="#9CA3AF" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => openExternalLink(exchange.application_url)}
                >
                  <ExternalLink size={16} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Apply Now</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => openExternalLink(exchange.program_website)}
                >
                  <Globe size={16} color="#3B82F6" />
                  <Text style={styles.secondaryButtonText}>Website</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => sendEmail(exchange.contact_email, `Inquiry about ${exchange.program_name}`)}
                >
                  <Mail size={16} color="#3B82F6" />
                  <Text style={styles.secondaryButtonText}>Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
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
  opportunityCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  opportunityInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  programTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  badgesContainer: {
    alignItems: 'flex-end',
    gap: 6,
  },
  remoteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  remoteBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  visaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  visaBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  scholarshipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  scholarshipBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  typeBadge: {
    backgroundColor: '#6B728015',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
  },
  requirementsSection: {
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  requirementsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  benefitsSection: {
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  benefitsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  resourcesSection: {
    marginBottom: 20,
  },
  resourcesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  resourcesList: {
    gap: 8,
  },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  resourceLinkText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
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
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
});