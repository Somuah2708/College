import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Briefcase, Users, TrendingUp, Award, Building, MapPin, DollarSign, Phone, Mail, Globe, ExternalLink, Play, Clock, Search, ListFilter as Filter, ChevronDown, ChevronUp, Target, Star, Calendar, BookOpen, Lightbulb, Heart, Shield, Zap, ChartPie as PieChart, ChartBar as BarChart3, TrendingDown, Handshake, GraduationCap, Rocket, Network, Crown, Trophy, CircleCheck as CheckCircle } from 'lucide-react-native';

interface CareerVideo {
  id: string;
  title: string;
  youtube_url: string;
  thumbnail_url: string;
  duration: string;
  description: string;
  category: string;
  view_count: number;
  instructor: string;
}

interface NotableGraduate {
  id: string;
  name: string;
  graduation_year: number;
  degree_program: string;
  current_position: string;
  current_company: string;
  industry: string;
  location: string;
  achievements: string[];
  linkedin_profile: string;
  profile_photo_url: string;
  career_path: any[];
  advice_to_students: string;
  net_worth_estimate: string;
  awards_recognition: string[];
}

interface InternshipProgram {
  id: string;
  program_name: string;
  partner_company: string;
  duration: string;
  compensation: string;
  application_deadline: string;
  requirements: string[];
  benefits: string[];
  success_rate: string;
  placement_rate: string;
}

interface CareerEvent {
  id: string;
  event_name: string;
  event_type: string;
  date: string;
  time: string;
  location: string;
  participating_companies: string[];
  expected_attendees: number;
  registration_required: boolean;
  registration_url: string;
  description: string;
}

interface UniversityCareerAlumni {
  id: string;
  university_id: string;
  career_services_overview: string;
  career_office_contact: any;
  academic_career_integration: string;
  internship_programs_detailed: InternshipProgram[];
  job_placement_services: string;
  career_counseling_services: string;
  resume_interview_workshops: string;
  networking_events_calendar: CareerEvent[];
  employer_partnerships_detailed: any[];
  alumni_network_detailed: any;
  notable_graduates_profiles: NotableGraduate[];
  alumni_achievements_database: any[];
  career_outcomes_by_program: any;
  salary_statistics_detailed: any;
  employment_rates_by_year: any;
  industry_placement_breakdown: any;
  geographic_employment_distribution: any;
  entrepreneurship_support_programs: string;
  startup_incubators_accelerators: any[];
  research_commercialization_support: string;
  continuing_education_alumni: string;
  alumni_mentorship_programs: string;
  alumni_giving_impact: any;
  career_success_metrics: any;
  industry_advisory_boards: any[];
  career_fairs_recruitment_events: CareerEvent[];
  professional_development_workshops: any[];
  leadership_development_programs: any[];
  global_career_opportunities: string;
  career_videos: CareerVideo[];
  created_at: string;
}

interface University {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
}

export default function CareerAlumniScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [careerData, setCareerData] = useState<UniversityCareerAlumni | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCareerAlumniData();
  }, [id]);

  const fetchCareerAlumniData = async () => {
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

      // Fetch career and alumni data
      const { data: careerAlumniData, error: careerError } = await supabase
        .from('university_career_alumni')
        .select('*')
        .eq('university_id', id)
        .maybeSingle();

      if (careerError) {
        console.error('Error fetching career data:', careerError);
      }

      // If no data exists, generate comprehensive mock data
      if (!careerAlumniData) {
        const mockCareerData = generateMockCareerData(universityData);
        setCareerData(mockCareerData);
      } else {
        setCareerData(careerAlumniData);
      }
    } catch (err) {
      console.error('Error fetching career alumni data:', err);
      setError('Failed to load career and alumni information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateMockCareerData = (university: University): UniversityCareerAlumni => {
    // Generate comprehensive mock data for demonstration
    const mockNotableGraduates: NotableGraduate[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        graduation_year: 2018,
        degree_program: 'Computer Science',
        current_position: 'Senior Software Engineer',
        current_company: 'Google',
        industry: 'Technology',
        location: 'Mountain View, CA',
        achievements: [
          'Led development of Google Search algorithm improvements',
          'Published 15+ research papers in AI/ML',
          'Mentored 50+ junior engineers',
          'Founded tech diversity initiative'
        ],
        linkedin_profile: 'https://linkedin.com/in/sarah-chen-google',
        profile_photo_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
        career_path: [
          { year: 2018, position: 'Software Engineer Intern', company: 'Microsoft' },
          { year: 2019, position: 'Junior Software Engineer', company: 'Startup Inc' },
          { year: 2021, position: 'Software Engineer', company: 'Google' },
          { year: 2023, position: 'Senior Software Engineer', company: 'Google' }
        ],
        advice_to_students: 'Focus on building strong fundamentals, contribute to open source projects, and never stop learning. The tech industry evolves rapidly, so adaptability is key.',
        net_worth_estimate: '$2.5M+',
        awards_recognition: [
          'Google Excellence Award 2023',
          'Tech Diversity Champion 2022',
          'IEEE Young Professional Award 2021'
        ]
      },
      {
        id: '2',
        name: 'Dr. Michael Rodriguez',
        graduation_year: 2015,
        degree_program: 'Biomedical Engineering',
        current_position: 'Chief Medical Officer',
        current_company: 'MedTech Innovations',
        industry: 'Healthcare Technology',
        location: 'Boston, MA',
        achievements: [
          'Developed life-saving cardiac device',
          'Holds 12 medical device patents',
          'Raised $50M in Series B funding',
          'Published in Nature Medicine'
        ],
        linkedin_profile: 'https://linkedin.com/in/dr-michael-rodriguez',
        profile_photo_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
        career_path: [
          { year: 2015, position: 'Research Assistant', company: 'Johns Hopkins' },
          { year: 2017, position: 'Biomedical Engineer', company: 'Medtronic' },
          { year: 2020, position: 'Senior Engineer', company: 'Boston Scientific' },
          { year: 2022, position: 'Chief Medical Officer', company: 'MedTech Innovations' }
        ],
        advice_to_students: 'Combine technical expertise with real-world medical needs. Spend time in hospitals to understand the problems you\'re trying to solve.',
        net_worth_estimate: '$15M+',
        awards_recognition: [
          'FDA Innovation Award 2023',
          'Medical Device Excellence 2022',
          'Young Entrepreneur of the Year 2021'
        ]
      },
      {
        id: '3',
        name: 'Amanda Williams',
        graduation_year: 2016,
        degree_program: 'Business Administration',
        current_position: 'CEO & Founder',
        current_company: 'EcoSolutions Global',
        industry: 'Sustainable Technology',
        location: 'San Francisco, CA',
        achievements: [
          'Built $100M sustainable tech company',
          'Featured on Forbes 30 Under 30',
          'Reduced carbon footprint for 500+ companies',
          'Keynote speaker at 20+ conferences'
        ],
        linkedin_profile: 'https://linkedin.com/in/amanda-williams-ceo',
        profile_photo_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
        career_path: [
          { year: 2016, position: 'Business Analyst', company: 'McKinsey & Company' },
          { year: 2018, position: 'Strategy Consultant', company: 'Bain & Company' },
          { year: 2020, position: 'VP Strategy', company: 'CleanTech Ventures' },
          { year: 2021, position: 'CEO & Founder', company: 'EcoSolutions Global' }
        ],
        advice_to_students: 'Don\'t be afraid to take calculated risks. The biggest opportunities often come from solving problems others think are impossible.',
        net_worth_estimate: '$25M+',
        awards_recognition: [
          'Forbes 30 Under 30 2022',
          'Sustainability Leader Award 2023',
          'Young CEO of the Year 2022'
        ]
      }
    ];

    const mockInternshipPrograms: InternshipProgram[] = [
      {
        id: '1',
        program_name: 'Tech Industry Internship Program',
        partner_company: 'Google, Microsoft, Apple',
        duration: '12 weeks (Summer)',
        compensation: '$8,000 - $12,000/month',
        application_deadline: '2025-02-15',
        requirements: ['3.5+ GPA', 'CS/Engineering major', 'Programming portfolio'],
        benefits: ['Mentorship', 'Full-time offer potential', 'Housing stipend', 'Transportation'],
        success_rate: '85%',
        placement_rate: '92%'
      },
      {
        id: '2',
        program_name: 'Healthcare Innovation Internship',
        partner_company: 'Johns Hopkins, Mayo Clinic',
        duration: '16 weeks',
        compensation: '$6,000 - $9,000/month',
        application_deadline: '2025-03-01',
        requirements: ['3.0+ GPA', 'Healthcare/Bio major', 'Research experience'],
        benefits: ['Clinical exposure', 'Research opportunities', 'Professional networking'],
        success_rate: '78%',
        placement_rate: '88%'
      }
    ];

    const mockCareerEvents: CareerEvent[] = [
      {
        id: '1',
        event_name: 'Annual Tech Career Fair',
        event_type: 'career_fair',
        date: '2025-03-15',
        time: '10:00 AM - 4:00 PM',
        location: 'University Convention Center',
        participating_companies: ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta'],
        expected_attendees: 2500,
        registration_required: true,
        registration_url: 'https://university.edu/career-fair',
        description: 'Largest annual career fair with 100+ companies recruiting for internships and full-time positions'
      },
      {
        id: '2',
        event_name: 'Alumni Networking Night',
        event_type: 'networking',
        date: '2025-02-20',
        time: '6:00 PM - 9:00 PM',
        location: 'Alumni Center',
        participating_companies: ['Various Alumni Companies'],
        expected_attendees: 300,
        registration_required: true,
        registration_url: 'https://university.edu/alumni-networking',
        description: 'Connect with successful alumni across various industries for mentorship and career guidance'
      }
    ];

    const mockCareerVideos: CareerVideo[] = Array.from({ length: 25 }, (_, index) => {
      const categories = [
        'overview', 'career_services', 'job_placement', 'internships', 'alumni_network',
        'salary_trends', 'industry_insights', 'entrepreneurship', 'mentorship', 'networking',
        'resume_writing', 'interview_prep', 'career_planning', 'professional_development',
        'leadership', 'global_opportunities', 'startup_support', 'research_careers',
        'industry_partnerships', 'success_stories', 'career_fairs', 'workshops',
        'counseling_services', 'alumni_giving', 'continuing_education'
      ];
      
      const category = categories[index % categories.length];
      const instructors = [
        'Career Services Director', 'Alumni Relations Manager', 'Industry Partnership Coordinator',
        'Professional Development Specialist', 'Entrepreneurship Center Director'
      ];

      return {
        id: `video-${index + 1}`,
        title: `${category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} - Professional Guide`,
        youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index}`,
        thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
        duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        description: `Comprehensive guide to ${category.replace('_', ' ')} at ${university.name}`,
        category: category,
        view_count: Math.floor(Math.random() * 10000) + 1000,
        instructor: instructors[index % instructors.length]
      };
    });

    return {
      id: 'mock-career-data',
      university_id: university.id,
      career_services_overview: `${university.name} is committed to empowering students with comprehensive career support services that bridge academic learning with professional success. Our Career Services Center provides personalized guidance, industry connections, and practical resources to help students navigate their career journey from enrollment through alumni engagement.`,
      career_office_contact: {
        office_name: 'Career Services Center',
        director_name: 'Dr. Jennifer Martinez',
        email: 'careers@university.edu',
        phone: '+1 (555) 123-4567',
        emergency_phone: '+1 (555) 123-4568',
        office_hours: 'Monday-Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 2:00 PM',
        location: 'Student Services Building, 3rd Floor, Room 301',
        website: 'https://university.edu/career-services',
        online_portal: 'https://careers.university.edu',
        appointment_booking: 'https://university.edu/career-appointments'
      },
      academic_career_integration: 'Our career services are seamlessly integrated into the academic curriculum through mandatory career planning courses, industry guest lectures, and experiential learning opportunities. Students receive career guidance from their first semester through graduation and beyond.',
      internship_programs_detailed: mockInternshipPrograms,
      job_placement_services: 'Comprehensive job placement support including exclusive job postings, employer partnerships, on-campus recruiting, and personalized job search assistance. Our dedicated placement team works with 500+ employer partners globally.',
      career_counseling_services: 'Individual career counseling sessions, group workshops, career assessments, and personalized career development plans. Our licensed career counselors provide expert guidance on career exploration, job search strategies, and professional development.',
      resume_interview_workshops: 'Weekly resume writing workshops, mock interview sessions, LinkedIn optimization, and personal branding seminars. Students receive personalized feedback and industry-specific guidance for their target careers.',
      networking_events_calendar: mockCareerEvents,
      employer_partnerships_detailed: [
        {
          company_name: 'Google',
          partnership_type: 'Strategic Partner',
          relationship_duration: '8 years',
          annual_hires: 45,
          internship_slots: 25,
          research_collaborations: 3,
          guest_lectures: 12,
          scholarship_funding: '$500,000'
        },
        {
          company_name: 'Microsoft',
          partnership_type: 'Preferred Partner',
          relationship_duration: '6 years',
          annual_hires: 38,
          internship_slots: 20,
          research_collaborations: 2,
          guest_lectures: 8,
          scholarship_funding: '$350,000'
        }
      ],
      alumni_network_detailed: {
        total_alumni: 125000,
        active_network_members: 85000,
        global_chapters: 45,
        countries_represented: 78,
        ceo_executives: 2500,
        entrepreneurs: 1800,
        average_career_progression: '2.3 promotions in 5 years',
        alumni_hiring_rate: '35%',
        mentorship_participation: '68%'
      },
      notable_graduates_profiles: mockNotableGraduates,
      alumni_achievements_database: [
        {
          category: 'Technology Leaders',
          count: 450,
          notable_companies: ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta'],
          average_salary: '$185,000',
          leadership_positions: 180
        },
        {
          category: 'Healthcare Professionals',
          count: 320,
          notable_institutions: ['Johns Hopkins', 'Mayo Clinic', 'Cleveland Clinic'],
          average_salary: '$275,000',
          leadership_positions: 95
        },
        {
          category: 'Business Leaders',
          count: 280,
          notable_companies: ['Goldman Sachs', 'McKinsey', 'JP Morgan', 'Deloitte'],
          average_salary: '$195,000',
          leadership_positions: 120
        }
      ],
      career_outcomes_by_program: {
        'Computer Science': {
          employment_rate: '96%',
          average_starting_salary: '$95,000',
          top_employers: ['Google', 'Microsoft', 'Apple', 'Amazon'],
          graduate_school_rate: '25%',
          entrepreneurship_rate: '8%'
        },
        'Business Administration': {
          employment_rate: '92%',
          average_starting_salary: '$75,000',
          top_employers: ['Goldman Sachs', 'McKinsey', 'JP Morgan', 'Deloitte'],
          graduate_school_rate: '35%',
          entrepreneurship_rate: '12%'
        },
        'Engineering': {
          employment_rate: '94%',
          average_starting_salary: '$85,000',
          top_employers: ['Boeing', 'Tesla', 'SpaceX', 'General Electric'],
          graduate_school_rate: '30%',
          entrepreneurship_rate: '6%'
        }
      },
      salary_statistics_detailed: {
        overall_statistics: {
          median_starting_salary: '$78,000',
          median_mid_career_salary: '$135,000',
          salary_growth_rate: '8.5% annually',
          top_10_percent_salary: '$250,000+'
        },
        by_industry: {
          'Technology': { median: '$95,000', range: '$75,000 - $150,000' },
          'Finance': { median: '$85,000', range: '$65,000 - $120,000' },
          'Healthcare': { median: '$90,000', range: '$70,000 - $180,000' },
          'Consulting': { median: '$88,000', range: '$70,000 - $130,000' }
        },
        by_location: {
          'San Francisco Bay Area': { median: '$115,000', cost_of_living_adjustment: '+35%' },
          'New York City': { median: '$105,000', cost_of_living_adjustment: '+28%' },
          'Boston': { median: '$95,000', cost_of_living_adjustment: '+18%' },
          'Austin': { median: '$85,000', cost_of_living_adjustment: '+5%' }
        }
      },
      employment_rates_by_year: {
        '2024': { overall: '94%', within_6_months: '89%', within_12_months: '96%' },
        '2023': { overall: '93%', within_6_months: '87%', within_12_months: '95%' },
        '2022': { overall: '91%', within_6_months: '85%', within_12_months: '94%' },
        '2021': { overall: '88%', within_6_months: '82%', within_12_months: '92%' }
      },
      industry_placement_breakdown: {
        'Technology': '35%',
        'Finance': '18%',
        'Healthcare': '15%',
        'Consulting': '12%',
        'Education': '8%',
        'Government': '6%',
        'Non-profit': '4%',
        'Other': '2%'
      },
      geographic_employment_distribution: {
        'United States': '65%',
        'Canada': '12%',
        'United Kingdom': '8%',
        'Germany': '5%',
        'Australia': '4%',
        'Singapore': '3%',
        'Other': '3%'
      },
      entrepreneurship_support_programs: 'Comprehensive entrepreneurship ecosystem including startup incubators, venture capital connections, business plan competitions, and mentorship from successful alumni entrepreneurs. Our Innovation Hub has supported 150+ student startups with $25M+ in funding raised.',
      startup_incubators_accelerators: [
        {
          name: 'University Innovation Hub',
          focus_areas: ['Technology', 'Healthcare', 'Sustainability'],
          cohort_size: 20,
          program_duration: '6 months',
          funding_provided: 'Up to $50,000',
          success_rate: '75%',
          notable_graduates: ['TechStart Inc ($10M valuation)', 'HealthAI ($5M funding)']
        },
        {
          name: 'Social Impact Accelerator',
          focus_areas: ['Social Enterprise', 'Education', 'Environment'],
          cohort_size: 15,
          program_duration: '4 months',
          funding_provided: 'Up to $25,000',
          success_rate: '68%',
          notable_graduates: ['EduTech Solutions', 'GreenFuture Initiative']
        }
      ],
      research_commercialization_support: 'Technology transfer office supports faculty and student researchers in commercializing innovations through patent assistance, industry partnerships, and startup formation. We\'ve facilitated 45+ technology transfers and 20+ spin-off companies.',
      continuing_education_alumni: 'Lifelong learning opportunities including executive education programs, professional certificates, online courses, and alumni audit privileges. Over 15,000 alumni participate in continuing education annually.',
      alumni_mentorship_programs: 'Structured mentorship program connecting current students with successful alumni. 5,000+ active mentors provide career guidance, industry insights, and professional networking opportunities.',
      alumni_giving_impact: {
        total_giving: '$125M annually',
        scholarship_funding: '$45M',
        research_funding: '$35M',
        facility_improvements: '$25M',
        program_enhancement: '$20M',
        donor_participation_rate: '42%',
        average_gift_size: '$2,500'
      },
      career_success_metrics: {
        employment_rate_6_months: '94%',
        graduate_school_acceptance: '88%',
        average_starting_salary: '$78,000',
        salary_growth_5_years: '125%',
        alumni_satisfaction: '92%',
        employer_satisfaction: '96%'
      },
      industry_advisory_boards: [
        {
          industry: 'Technology',
          board_members: 12,
          companies_represented: ['Google', 'Microsoft', 'Apple', 'Amazon'],
          meeting_frequency: 'Quarterly',
          curriculum_influence: 'High',
          job_placement_support: 'Direct recruiting pipeline'
        },
        {
          industry: 'Healthcare',
          board_members: 8,
          companies_represented: ['Johns Hopkins', 'Mayo Clinic', 'Pfizer'],
          meeting_frequency: 'Bi-annually',
          curriculum_influence: 'Medium',
          job_placement_support: 'Internship placements'
        }
      ],
      career_fairs_recruitment_events: mockCareerEvents,
      professional_development_workshops: [
        {
          workshop_name: 'Leadership Excellence Program',
          duration: '8 weeks',
          frequency: 'Monthly',
          participants: 50,
          completion_rate: '92%',
          career_impact: 'Average 15% salary increase within 2 years'
        },
        {
          workshop_name: 'Digital Marketing Certification',
          duration: '6 weeks',
          frequency: 'Quarterly',
          participants: 75,
          completion_rate: '88%',
          career_impact: 'Industry certification with 85% job placement rate'
        }
      ],
      leadership_development_programs: [
        {
          program_name: 'Future Leaders Initiative',
          duration: '1 year',
          cohort_size: 30,
          selection_criteria: 'Academic excellence, leadership potential, community service',
          benefits: ['Executive mentorship', 'Leadership projects', 'Industry exposure'],
          alumni_success_rate: '95% in leadership roles within 5 years'
        }
      ],
      global_career_opportunities: 'International career placement support through global alumni network, international internship programs, and partnerships with multinational corporations. 25% of graduates work internationally within 5 years.',
      career_videos: mockCareerVideos,
      created_at: new Date().toISOString()
    };
  };

  const openYouTubeVideo = (url: string) => {
    Linking.openURL(url);
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

  const callPhone = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getIndustryColor = (industry: string) => {
    switch (industry.toLowerCase()) {
      case 'technology': return '#3B82F6';
      case 'healthcare': return '#10B981';
      case 'finance': return '#F59E0B';
      case 'consulting': return '#8B5CF6';
      case 'education': return '#06B6D4';
      case 'government': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const filteredVideos = careerData?.career_videos.filter(video => {
    const matchesSearch = searchQuery.trim() === '' ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedVideoCategory === 'all' || video.category === selectedVideoCategory;

    return matchesSearch && matchesCategory;
  }) || [];

  const videoCategories = Array.from(new Set(careerData?.career_videos.map(v => v.category) || []));

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading career and alumni information...</Text>
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

  if (!careerData) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.programName}>Career & Alumni</Text>
              <Text style={styles.universityName}>{university.name}</Text>
            </View>
          </View>

          <View style={styles.noDataContainer}>
            <Briefcase size={48} color="#9CA3AF" />
            <Text style={styles.noDataTitle}>Career & Alumni Information Not Available</Text>
            <Text style={styles.noDataText}>
              Detailed career and alumni information for {university.name} is not currently available in our database.
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
            <Text style={styles.programName}>Career & Alumni</Text>
            <Text style={styles.universityName}>{university.name}</Text>
          </View>
        </View>

        {/* Career Videos Section */}
        <View style={styles.videosSection}>
          <View style={styles.sectionHeader}>
            <Play size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>Career & Alumni Videos ({careerData.career_videos.length})</Text>
          </View>
          
          <View style={styles.videoSearchContainer}>
            <View style={styles.searchContainer}>
              <Search size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search videos..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilters}>
              <TouchableOpacity
                style={[styles.categoryFilter, selectedVideoCategory === 'all' && styles.activeCategoryFilter]}
                onPress={() => setSelectedVideoCategory('all')}
              >
                <Text style={[styles.categoryFilterText, selectedVideoCategory === 'all' && styles.activeCategoryFilterText]}>
                  All ({careerData.career_videos.length})
                </Text>
              </TouchableOpacity>
              {videoCategories.slice(0, 8).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryFilter, selectedVideoCategory === category && styles.activeCategoryFilter]}
                  onPress={() => setSelectedVideoCategory(category)}
                >
                  <Text style={[styles.categoryFilterText, selectedVideoCategory === category && styles.activeCategoryFilterText]}>
                    {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({careerData.career_videos.filter(v => v.category === category).length})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
            {filteredVideos.map((video) => (
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
                    <Play size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.durationBadge}>
                    <Clock size={10} color="#FFFFFF" />
                    <Text style={styles.durationText}>{video.duration}</Text>
                  </View>
                  <View style={styles.viewCountBadge}>
                    <Text style={styles.viewCountText}>{(video.view_count / 1000).toFixed(1)}K views</Text>
                  </View>
                </View>
                <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                <Text style={styles.videoInstructor}>by {video.instructor}</Text>
                <Text style={styles.videoDescription} numberOfLines={2}>{video.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 1. Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Briefcase size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Career Services Overview</Text>
          </View>
          <Text style={styles.sectionContent}>{careerData.career_services_overview}</Text>
          
          {/* Contact Information */}
          <View style={styles.contactContainer}>
            <Text style={styles.contactTitle}>Career Services Office</Text>
            <View style={styles.contactDetails}>
              <View style={styles.contactItem}>
                <Users size={16} color="#3B82F6" />
                <Text style={styles.contactText}>
                  {careerData.career_office_contact.office_name} - {careerData.career_office_contact.director_name}
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => sendEmail(careerData.career_office_contact.email, 'Career Services Inquiry')}
              >
                <Mail size={16} color="#10B981" />
                <Text style={styles.contactLink}>{careerData.career_office_contact.email}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => callPhone(careerData.career_office_contact.phone)}
              >
                <Phone size={16} color="#F59E0B" />
                <Text style={styles.contactLink}>{careerData.career_office_contact.phone}</Text>
              </TouchableOpacity>

              <View style={styles.contactItem}>
                <Clock size={16} color="#8B5CF6" />
                <Text style={styles.contactText}>{careerData.career_office_contact.office_hours}</Text>
              </View>

              <View style={styles.contactItem}>
                <MapPin size={16} color="#EF4444" />
                <Text style={styles.contactText}>{careerData.career_office_contact.location}</Text>
              </View>

              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => openExternalLink(careerData.career_office_contact.website)}
              >
                <Globe size={16} color="#06B6D4" />
                <Text style={styles.contactLink}>{careerData.career_office_contact.website}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 2. Career Success Metrics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Career Success Metrics</Text>
          </View>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Target size={24} color="#10B981" />
              <Text style={styles.metricValue}>{careerData.career_success_metrics.employment_rate_6_months}</Text>
              <Text style={styles.metricLabel}>Employment Rate (6 months)</Text>
            </View>
            
            <View style={styles.metricCard}>
              <DollarSign size={24} color="#F59E0B" />
              <Text style={styles.metricValue}>${(careerData.career_success_metrics.average_starting_salary / 1000).toFixed(0)}K</Text>
              <Text style={styles.metricLabel}>Average Starting Salary</Text>
            </View>
            
            <View style={styles.metricCard}>
              <GraduationCap size={24} color="#8B5CF6" />
              <Text style={styles.metricValue}>{careerData.career_success_metrics.graduate_school_acceptance}</Text>
              <Text style={styles.metricLabel}>Grad School Acceptance</Text>
            </View>
            
            <View style={styles.metricCard}>
              <Heart size={24} color="#EF4444" />
              <Text style={styles.metricValue}>{careerData.career_success_metrics.alumni_satisfaction}</Text>
              <Text style={styles.metricLabel}>Alumni Satisfaction</Text>
            </View>
          </View>
        </View>

        {/* 3. Employment Outcomes by Program */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => toggleSectionExpansion('employment_outcomes')}
          >
            <View style={styles.sectionHeader}>
              <BarChart3 size={24} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Employment Outcomes by Program</Text>
            </View>
            {expandedSections.has('employment_outcomes') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('employment_outcomes') && (
            <View style={styles.programOutcomes}>
              {Object.entries(careerData.career_outcomes_by_program).map(([program, outcomes]: [string, any]) => (
                <View key={program} style={styles.programOutcomeCard}>
                  <Text style={styles.programName}>{program}</Text>
                  <View style={styles.outcomeStats}>
                    <View style={styles.outcomeStat}>
                      <Text style={styles.outcomeLabel}>Employment Rate</Text>
                      <Text style={[styles.outcomeValue, { color: '#10B981' }]}>{outcomes.employment_rate}</Text>
                    </View>
                    <View style={styles.outcomeStat}>
                      <Text style={styles.outcomeLabel}>Starting Salary</Text>
                      <Text style={[styles.outcomeValue, { color: '#F59E0B' }]}>${(outcomes.average_starting_salary / 1000).toFixed(0)}K</Text>
                    </View>
                    <View style={styles.outcomeStat}>
                      <Text style={styles.outcomeLabel}>Grad School</Text>
                      <Text style={[styles.outcomeValue, { color: '#8B5CF6' }]}>{outcomes.graduate_school_rate}</Text>
                    </View>
                    <View style={styles.outcomeStat}>
                      <Text style={styles.outcomeLabel}>Entrepreneurship</Text>
                      <Text style={[styles.outcomeValue, { color: '#EC4899' }]}>{outcomes.entrepreneurship_rate}</Text>
                    </View>
                  </View>
                  <View style={styles.topEmployers}>
                    <Text style={styles.topEmployersTitle}>Top Employers:</Text>
                    <View style={styles.employerTags}>
                      {outcomes.top_employers.map((employer: string, index: number) => (
                        <View key={index} style={styles.employerTag}>
                          <Text style={styles.employerTagText}>{employer}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 4. Salary Statistics */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => toggleSectionExpansion('salary_statistics')}
          >
            <View style={styles.sectionHeader}>
              <DollarSign size={24} color="#10B981" />
              <Text style={styles.sectionTitle}>Salary Statistics & Trends</Text>
            </View>
            {expandedSections.has('salary_statistics') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('salary_statistics') && (
            <View style={styles.salaryStatistics}>
              {/* Overall Statistics */}
              <View style={styles.salaryOverview}>
                <Text style={styles.salaryOverviewTitle}>Overall Salary Statistics</Text>
                <View style={styles.salaryOverviewGrid}>
                  <View style={styles.salaryOverviewCard}>
                    <Text style={styles.salaryOverviewLabel}>Median Starting</Text>
                    <Text style={styles.salaryOverviewValue}>
                      ${(careerData.salary_statistics_detailed.overall_statistics.median_starting_salary / 1000).toFixed(0)}K
                    </Text>
                  </View>
                  <View style={styles.salaryOverviewCard}>
                    <Text style={styles.salaryOverviewLabel}>Mid-Career</Text>
                    <Text style={styles.salaryOverviewValue}>
                      ${(careerData.salary_statistics_detailed.overall_statistics.median_mid_career_salary / 1000).toFixed(0)}K
                    </Text>
                  </View>
                  <View style={styles.salaryOverviewCard}>
                    <Text style={styles.salaryOverviewLabel}>Growth Rate</Text>
                    <Text style={styles.salaryOverviewValue}>
                      {careerData.salary_statistics_detailed.overall_statistics.salary_growth_rate}
                    </Text>
                  </View>
                  <View style={styles.salaryOverviewCard}>
                    <Text style={styles.salaryOverviewLabel}>Top 10%</Text>
                    <Text style={styles.salaryOverviewValue}>
                      {careerData.salary_statistics_detailed.overall_statistics.top_10_percent_salary}
                    </Text>
                  </View>
                </View>
              </View>

              {/* By Industry */}
              <View style={styles.salaryByIndustry}>
                <Text style={styles.salaryByIndustryTitle}>Salary by Industry</Text>
                {Object.entries(careerData.salary_statistics_detailed.by_industry).map(([industry, data]: [string, any]) => (
                  <View key={industry} style={styles.industryCard}>
                    <View style={styles.industryHeader}>
                      <View style={[styles.industryDot, { backgroundColor: getIndustryColor(industry) }]} />
                      <Text style={styles.industryName}>{industry}</Text>
                    </View>
                    <View style={styles.industryStats}>
                      <Text style={styles.industryMedian}>${(data.median / 1000).toFixed(0)}K median</Text>
                      <Text style={styles.industryRange}>{data.range}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* By Location */}
              <View style={styles.salaryByLocation}>
                <Text style={styles.salaryByLocationTitle}>Salary by Location</Text>
                {Object.entries(careerData.salary_statistics_detailed.by_location).map(([location, data]: [string, any]) => (
                  <View key={location} style={styles.locationCard}>
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationName}>{location}</Text>
                      <Text style={styles.locationAdjustment}>{data.cost_of_living_adjustment}</Text>
                    </View>
                    <Text style={styles.locationSalary}>${(data.median / 1000).toFixed(0)}K</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* 5. Alumni Network */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => toggleSectionExpansion('alumni_network')}
          >
            <View style={styles.sectionHeader}>
              <Users size={24} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Alumni Network</Text>
            </View>
            {expandedSections.has('alumni_network') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('alumni_network') && (
            <View style={styles.alumniNetwork}>
              <View style={styles.networkStats}>
                <View style={styles.networkStatCard}>
                  <Network size={24} color="#3B82F6" />
                  <Text style={styles.networkStatValue}>{(careerData.alumni_network_detailed.total_alumni / 1000).toFixed(0)}K</Text>
                  <Text style={styles.networkStatLabel}>Total Alumni</Text>
                </View>
                <View style={styles.networkStatCard}>
                  <Globe size={24} color="#10B981" />
                  <Text style={styles.networkStatValue}>{careerData.alumni_network_detailed.countries_represented}</Text>
                  <Text style={styles.networkStatLabel}>Countries</Text>
                </View>
                <View style={styles.networkStatCard}>
                  <Crown size={24} color="#F59E0B" />
                  <Text style={styles.networkStatValue}>{(careerData.alumni_network_detailed.ceo_executives / 1000).toFixed(1)}K</Text>
                  <Text style={styles.networkStatLabel}>CEOs & Executives</Text>
                </View>
                <View style={styles.networkStatCard}>
                  <Rocket size={24} color="#EF4444" />
                  <Text style={styles.networkStatValue}>{(careerData.alumni_network_detailed.entrepreneurs / 1000).toFixed(1)}K</Text>
                  <Text style={styles.networkStatLabel}>Entrepreneurs</Text>
                </View>
              </View>

              <View style={styles.networkHighlights}>
                <View style={styles.networkHighlight}>
                  <Text style={styles.networkHighlightLabel}>Alumni Hiring Rate</Text>
                  <Text style={styles.networkHighlightValue}>{careerData.alumni_network_detailed.alumni_hiring_rate}</Text>
                </View>
                <View style={styles.networkHighlight}>
                  <Text style={styles.networkHighlightLabel}>Mentorship Participation</Text>
                  <Text style={styles.networkHighlightValue}>{careerData.alumni_network_detailed.mentorship_participation}</Text>
                </View>
                <View style={styles.networkHighlight}>
                  <Text style={styles.networkHighlightLabel}>Career Progression</Text>
                  <Text style={styles.networkHighlightValue}>{careerData.alumni_network_detailed.average_career_progression}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 6. Notable Graduates */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => toggleSectionExpansion('notable_graduates')}
          >
            <View style={styles.sectionHeader}>
              <Star size={24} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Notable Graduates</Text>
            </View>
            {expandedSections.has('notable_graduates') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('notable_graduates') && (
            <View style={styles.notableGraduates}>
              {careerData.notable_graduates_profiles.map((graduate) => (
                <View key={graduate.id} style={styles.graduateCard}>
                  <View style={styles.graduateHeader}>
                    <View style={styles.graduatePhotoContainer}>
                      <Image 
                        source={{ uri: graduate.profile_photo_url }} 
                        style={styles.graduatePhoto}
                        defaultSource={{ uri: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg' }}
                      />
                      <View style={[styles.industryBadge, { backgroundColor: `${getIndustryColor(graduate.industry)}15` }]}>
                        <Text style={[styles.industryBadgeText, { color: getIndustryColor(graduate.industry) }]}>
                          {graduate.industry}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.graduateInfo}>
                      <Text style={styles.graduateName}>{graduate.name}</Text>
                      <Text style={styles.graduatePosition}>{graduate.current_position}</Text>
                      <Text style={styles.graduateCompany}>{graduate.current_company}</Text>
                      <View style={styles.graduateMeta}>
                        <Text style={styles.graduateYear}>Class of {graduate.graduation_year}</Text>
                        <Text style={styles.graduateProgram}>{graduate.degree_program}</Text>
                        <Text style={styles.graduateLocation}>{graduate.location}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Career Path */}
                  <View style={styles.careerPath}>
                    <Text style={styles.careerPathTitle}>Career Progression</Text>
                    <View style={styles.careerPathTimeline}>
                      {graduate.career_path.map((step: any, index: number) => (
                        <View key={index} style={styles.careerPathStep}>
                          <View style={styles.careerPathDot} />
                          <View style={styles.careerPathContent}>
                            <Text style={styles.careerPathYear}>{step.year}</Text>
                            <Text style={styles.careerPathRole}>{step.position}</Text>
                            <Text style={styles.careerPathCompany}>{step.company}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Achievements */}
                  <View style={styles.achievements}>
                    <Text style={styles.achievementsTitle}>Key Achievements</Text>
                    <View style={styles.achievementsList}>
                      {graduate.achievements.map((achievement, index) => (
                        <View key={index} style={styles.achievementItem}>
                          <Trophy size={14} color="#F59E0B" />
                          <Text style={styles.achievementText}>{achievement}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Awards & Recognition */}
                  <View style={styles.awards}>
                    <Text style={styles.awardsTitle}>Awards & Recognition</Text>
                    <View style={styles.awardsList}>
                      {graduate.awards_recognition.map((award, index) => (
                        <View key={index} style={styles.awardTag}>
                          <Award size={12} color="#8B5CF6" />
                          <Text style={styles.awardText}>{award}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Advice */}
                  <View style={styles.adviceSection}>
                    <Text style={styles.adviceTitle}>Advice to Students</Text>
                    <Text style={styles.adviceText}>"{graduate.advice_to_students}"</Text>
                  </View>

                  {/* Actions */}
                  <View style={styles.graduateActions}>
                    <TouchableOpacity
                      style={styles.linkedinButton}
                      onPress={() => openExternalLink(graduate.linkedin_profile)}
                    >
                      <ExternalLink size={16} color="#0077B5" />
                      <Text style={styles.linkedinButtonText}>LinkedIn Profile</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.netWorthContainer}>
                      <DollarSign size={16} color="#10B981" />
                      <Text style={styles.netWorthText}>Est. Net Worth: {graduate.net_worth_estimate}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 7. Internship Programs */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => toggleSectionExpansion('internship_programs')}
          >
            <View style={styles.sectionHeader}>
              <Briefcase size={24} color="#06B6D4" />
              <Text style={styles.sectionTitle}>Internship Programs</Text>
            </View>
            {expandedSections.has('internship_programs') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('internship_programs') && (
            <View style={styles.internshipPrograms}>
              {careerData.internship_programs_detailed.map((program) => (
                <View key={program.id} style={styles.internshipCard}>
                  <View style={styles.internshipHeader}>
                    <Text style={styles.internshipName}>{program.program_name}</Text>
                    <View style={styles.internshipMeta}>
                      <View style={styles.successRateBadge}>
                        <Target size={12} color="#10B981" />
                        <Text style={styles.successRateText}>{program.success_rate} success</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.internshipPartner}>Partner: {program.partner_company}</Text>
                  
                  <View style={styles.internshipDetails}>
                    <View style={styles.internshipDetail}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.internshipDetailText}>Duration: {program.duration}</Text>
                    </View>
                    <View style={styles.internshipDetail}>
                      <DollarSign size={16} color="#6B7280" />
                      <Text style={styles.internshipDetailText}>Compensation: {program.compensation}</Text>
                    </View>
                    <View style={styles.internshipDetail}>
                      <Calendar size={16} color="#6B7280" />
                      <Text style={styles.internshipDetailText}>Deadline: {new Date(program.application_deadline).toLocaleDateString()}</Text>
                    </View>
                  </View>

                  <View style={styles.requirementsBenefits}>
                    <View style={styles.requirementsSection}>
                      <Text style={styles.requirementsTitle}>Requirements:</Text>
                      <View style={styles.requirementsList}>
                        {program.requirements.map((req, index) => (
                          <View key={index} style={styles.requirementItem}>
                            <CheckCircle size={12} color="#10B981" />
                            <Text style={styles.requirementText}>{req}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.benefitsSection}>
                      <Text style={styles.benefitsTitle}>Benefits:</Text>
                      <View style={styles.benefitsList}>
                        {program.benefits.map((benefit, index) => (
                          <View key={index} style={styles.benefitItem}>
                            <Star size={12} color="#F59E0B" />
                            <Text style={styles.benefitText}>{benefit}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>

                  <View style={styles.placementStats}>
                    <Text style={styles.placementStatsTitle}>Program Statistics</Text>
                    <View style={styles.placementStatsGrid}>
                      <View style={styles.placementStat}>
                        <Text style={styles.placementStatLabel}>Success Rate</Text>
                        <Text style={styles.placementStatValue}>{program.success_rate}</Text>
                      </View>
                      <View style={styles.placementStat}>
                        <Text style={styles.placementStatLabel}>Placement Rate</Text>
                        <Text style={styles.placementStatValue}>{program.placement_rate}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 8. Industry Partnerships */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => toggleSectionExpansion('industry_partnerships')}
          >
            <View style={styles.sectionHeader}>
              <Handshake size={24} color="#EC4899" />
              <Text style={styles.sectionTitle}>Industry Partnerships</Text>
            </View>
            {expandedSections.has('industry_partnerships') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('industry_partnerships') && (
            <View style={styles.industryPartnerships}>
              {careerData.employer_partnerships_detailed.map((partnership: any, index: number) => (
                <View key={index} style={styles.partnershipCard}>
                  <View style={styles.partnershipHeader}>
                    <Text style={styles.partnershipCompany}>{partnership.company_name}</Text>
                    <View style={styles.partnershipTypeBadge}>
                      <Text style={styles.partnershipTypeText}>{partnership.partnership_type}</Text>
                    </View>
                  </View>

                  <View style={styles.partnershipStats}>
                    <View style={styles.partnershipStat}>
                      <Text style={styles.partnershipStatLabel}>Annual Hires</Text>
                      <Text style={styles.partnershipStatValue}>{partnership.annual_hires}</Text>
                    </View>
                    <View style={styles.partnershipStat}>
                      <Text style={styles.partnershipStatLabel}>Internships</Text>
                      <Text style={styles.partnershipStatValue}>{partnership.internship_slots}</Text>
                    </View>
                    <View style={styles.partnershipStat}>
                      <Text style={styles.partnershipStatLabel}>Research Projects</Text>
                      <Text style={styles.partnershipStatValue}>{partnership.research_collaborations}</Text>
                    </View>
                    <View style={styles.partnershipStat}>
                      <Text style={styles.partnershipStatLabel}>Guest Lectures</Text>
                      <Text style={styles.partnershipStatValue}>{partnership.guest_lectures}</Text>
                    </View>
                  </View>

                  <View style={styles.scholarshipFunding}>
                    <DollarSign size={16} color="#10B981" />
                    <Text style={styles.scholarshipFundingText}>
                      Scholarship Funding: {partnership.scholarship_funding}
                    </Text>
                  </View>

                  <Text style={styles.partnershipDuration}>
                    Partnership Duration: {partnership.relationship_duration}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 9. Career Events & Networking */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => toggleSectionExpansion('career_events')}
          >
            <View style={styles.sectionHeader}>
              <Calendar size={24} color="#06B6D4" />
              <Text style={styles.sectionTitle}>Career Events & Networking</Text>
            </View>
            {expandedSections.has('career_events') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('career_events') && (
            <View style={styles.careerEvents}>
              {careerData.networking_events_calendar.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventName}>{event.event_name}</Text>
                    <View style={styles.eventTypeBadge}>
                      <Text style={styles.eventTypeText}>{event.event_type.replace('_', ' ')}</Text>
                    </View>
                  </View>

                  <Text style={styles.eventDescription}>{event.description}</Text>

                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetail}>
                      <Calendar size={16} color="#6B7280" />
                      <Text style={styles.eventDetailText}>{new Date(event.date).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.eventDetail}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.eventDetailText}>{event.time}</Text>
                    </View>
                    <View style={styles.eventDetail}>
                      <MapPin size={16} color="#6B7280" />
                      <Text style={styles.eventDetailText}>{event.location}</Text>
                    </View>
                    <View style={styles.eventDetail}>
                      <Users size={16} color="#6B7280" />
                      <Text style={styles.eventDetailText}>{event.expected_attendees} expected</Text>
                    </View>
                  </View>

                  <View style={styles.participatingCompanies}>
                    <Text style={styles.companiesTitle}>Participating Companies:</Text>
                    <View style={styles.companiesList}>
                      {event.participating_companies.slice(0, 5).map((company, index) => (
                        <View key={index} style={styles.companyTag}>
                          <Text style={styles.companyTagText}>{company}</Text>
                        </View>
                      ))}
                      {event.participating_companies.length > 5 && (
                        <Text style={styles.moreCompanies}>
                          +{event.participating_companies.length - 5} more
                        </Text>
                      )}
                    </View>
                  </View>

                  {event.registration_required && (
                    <TouchableOpacity
                      style={styles.registerButton}
                      onPress={() => openExternalLink(event.registration_url)}
                    >
                      <ExternalLink size={16} color="#FFFFFF" />
                      <Text style={styles.registerButtonText}>Register Now</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 10. Entrepreneurship Support */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => toggleSectionExpansion('entrepreneurship')}
          >
            <View style={styles.sectionHeader}>
              <Rocket size={24} color="#EF4444" />
              <Text style={styles.sectionTitle}>Entrepreneurship & Innovation</Text>
            </View>
            {expandedSections.has('entrepreneurship') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('entrepreneurship') && (
            <View style={styles.entrepreneurshipSection}>
              <Text style={styles.entrepreneurshipOverview}>
                {careerData.entrepreneurship_support_programs}
              </Text>

              <View style={styles.incubatorsSection}>
                <Text style={styles.incubatorsTitle}>Startup Incubators & Accelerators</Text>
                {careerData.startup_incubators_accelerators.map((incubator: any, index: number) => (
                  <View key={index} style={styles.incubatorCard}>
                    <Text style={styles.incubatorName}>{incubator.name}</Text>
                    <View style={styles.incubatorDetails}>
                      <View style={styles.incubatorDetail}>
                        <Target size={14} color="#6B7280" />
                        <Text style={styles.incubatorDetailText}>
                          Focus: {incubator.focus_areas.join(', ')}
                        </Text>
                      </View>
                      <View style={styles.incubatorDetail}>
                        <Users size={14} color="#6B7280" />
                        <Text style={styles.incubatorDetailText}>
                          Cohort Size: {incubator.cohort_size}
                        </Text>
                      </View>
                      <View style={styles.incubatorDetail}>
                        <Clock size={14} color="#6B7280" />
                        <Text style={styles.incubatorDetailText}>
                          Duration: {incubator.program_duration}
                        </Text>
                      </View>
                      <View style={styles.incubatorDetail}>
                        <DollarSign size={14} color="#6B7280" />
                        <Text style={styles.incubatorDetailText}>
                          Funding: {incubator.funding_provided}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.incubatorSuccess}>
                      <Text style={styles.incubatorSuccessTitle}>Success Rate: {incubator.success_rate}</Text>
                      <Text style={styles.incubatorGraduates}>
                        Notable Graduates: {incubator.notable_graduates.join(', ')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.researchCommercializationSection}>
                <Text style={styles.researchCommercializationTitle}>Research Commercialization</Text>
                <Text style={styles.researchCommercializationText}>
                  {careerData.research_commercialization_support}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* 11. Alumni Giving & Impact */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => toggleSectionExpansion('alumni_giving')}
          >
            <View style={styles.sectionHeader}>
              <Heart size={24} color="#EF4444" />
              <Text style={styles.sectionTitle}>Alumni Giving & Impact</Text>
            </View>
            {expandedSections.has('alumni_giving') ? (
              <ChevronUp size={24} color="#6B7280" />
            ) : (
              <ChevronDown size={24} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('alumni_giving') && (
            <View style={styles.alumniGiving}>
              <View style={styles.givingOverview}>
                <View style={styles.givingStatCard}>
                  <DollarSign size={24} color="#10B981" />
                  <Text style={styles.givingStatValue}>{careerData.alumni_giving_impact.total_giving}</Text>
                  <Text style={styles.givingStatLabel}>Annual Giving</Text>
                </View>
                <View style={styles.givingStatCard}>
                  <Users size={24} color="#3B82F6" />
                  <Text style={styles.givingStatValue}>{careerData.alumni_giving_impact.donor_participation_rate}</Text>
                  <Text style={styles.givingStatLabel}>Participation Rate</Text>
                </View>
              </View>

              <View style={styles.givingBreakdown}>
                <Text style={styles.givingBreakdownTitle}>Giving Impact Areas</Text>
                <View style={styles.givingCategories}>
                  <View style={styles.givingCategory}>
                    <Text style={styles.givingCategoryLabel}>Scholarships</Text>
                    <Text style={styles.givingCategoryValue}>{careerData.alumni_giving_impact.scholarship_funding}</Text>
                  </View>
                  <View style={styles.givingCategory}>
                    <Text style={styles.givingCategoryLabel}>Research</Text>
                    <Text style={styles.givingCategoryValue}>{careerData.alumni_giving_impact.research_funding}</Text>
                  </View>
                  <View style={styles.givingCategory}>
                    <Text style={styles.givingCategoryLabel}>Facilities</Text>
                    <Text style={styles.givingCategoryValue}>{careerData.alumni_giving_impact.facility_improvements}</Text>
                  </View>
                  <View style={styles.givingCategory}>
                    <Text style={styles.givingCategoryLabel}>Programs</Text>
                    <Text style={styles.givingCategoryValue}>{careerData.alumni_giving_impact.program_enhancement}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionButtons}>
          {careerData.career_office_contact.website && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => openExternalLink(careerData.career_office_contact.website)}
            >
              <Globe size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Career Services</Text>
            </TouchableOpacity>
          )}
          
          {careerData.career_office_contact.email && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => sendEmail(careerData.career_office_contact.email, 'Career Services Inquiry')}
            >
              <Mail size={20} color="#3B82F6" />
              <Text style={styles.secondaryButtonText}>Contact Career Office</Text>
            </TouchableOpacity>
          )}
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
  videosSection: {
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
  videoSearchContainer: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  categoryFilters: {
    flexDirection: 'row',
  },
  categoryFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeCategoryFilter: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryFilterText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeCategoryFilterText: {
    color: '#FFFFFF',
  },
  videosContainer: {
    marginTop: 8,
  },
  videoCard: {
    width: 220,
    marginRight: 16,
  },
  videoThumbnail: {
    position: 'relative',
    width: '100%',
    height: 124,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    padding: 6,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  durationText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  viewCountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  viewCountText: {
    fontSize: 9,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  videoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  videoInstructor: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
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
    marginBottom: 16,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactContainer: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 12,
  },
  contactDetails: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
  },
  contactLink: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#0369A1',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  programOutcomes: {
    gap: 16,
    marginTop: 16,
  },
  programOutcomeCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  programName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  outcomeStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  outcomeStat: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  outcomeLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  outcomeValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  topEmployers: {
    marginTop: 8,
  },
  topEmployersTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  employerTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  employerTag: {
    backgroundColor: '#3B82F615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  employerTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  salaryStatistics: {
    marginTop: 16,
    gap: 20,
  },
  salaryOverview: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  salaryOverviewTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  salaryOverviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  salaryOverviewCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  salaryOverviewLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  salaryOverviewValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  salaryByIndustry: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  salaryByIndustryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  industryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  industryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  industryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  industryName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  industryStats: {
    alignItems: 'flex-end',
  },
  industryMedian: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  industryRange: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  salaryByLocation: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  salaryByLocationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  locationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  locationAdjustment: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#F59E0B',
  },
  locationSalary: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  alumniNetwork: {
    marginTop: 16,
    gap: 16,
  },
  networkStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  networkStatCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  networkStatValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  networkStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  networkHighlights: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  networkHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  networkHighlightLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  networkHighlightValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  notableGraduates: {
    marginTop: 16,
    gap: 20,
  },
  graduateCard: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  graduateHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  graduatePhotoContainer: {
    position: 'relative',
    marginRight: 16,
  },
  graduatePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  industryBadge: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  industryBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  graduateInfo: {
    flex: 1,
  },
  graduateName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  graduatePosition: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginBottom: 2,
  },
  graduateCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginBottom: 8,
  },
  graduateMeta: {
    gap: 2,
  },
  graduateYear: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  graduateProgram: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  graduateLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  careerPath: {
    marginBottom: 16,
  },
  careerPathTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  careerPathTimeline: {
    gap: 8,
  },
  careerPathStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  careerPathDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginRight: 12,
  },
  careerPathContent: {
    flex: 1,
  },
  careerPathYear: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  careerPathRole: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  careerPathCompany: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  achievements: {
    marginBottom: 16,
  },
  achievementsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  achievementsList: {
    gap: 6,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  achievementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
    lineHeight: 18,
  },
  awards: {
    marginBottom: 16,
  },
  awardsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  awardsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  awardTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  awardText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  adviceSection: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    marginBottom: 16,
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
  graduateActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkedinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077B515',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  linkedinButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0077B5',
  },
  netWorthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  netWorthText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  internshipPrograms: {
    marginTop: 16,
    gap: 16,
  },
  internshipCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  internshipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  internshipName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  internshipMeta: {
    alignItems: 'flex-end',
  },
  successRateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  successRateText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  internshipPartner: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginBottom: 12,
  },
  internshipDetails: {
    gap: 8,
    marginBottom: 12,
  },
  internshipDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  internshipDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  requirementsBenefits: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  requirementsSection: {
    flex: 1,
  },
  requirementsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  requirementsList: {
    gap: 4,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  requirementText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
  },
  benefitsSection: {
    flex: 1,
  },
  benefitsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  benefitsList: {
    gap: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  benefitText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
  },
  placementStats: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },
  placementStatsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  placementStatsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  placementStat: {
    flex: 1,
    alignItems: 'center',
  },
  placementStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  placementStatValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#06B6D4',
  },
  industryPartnerships: {
    marginTop: 16,
    gap: 16,
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
    marginBottom: 12,
  },
  partnershipCompany: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  partnershipTypeBadge: {
    backgroundColor: '#EC489915',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  partnershipTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#EC4899',
  },
  partnershipStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  partnershipStat: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
  },
  partnershipStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  partnershipStatValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#EC4899',
  },
  scholarshipFunding: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98115',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    marginBottom: 8,
  },
  scholarshipFundingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  partnershipDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  careerEvents: {
    marginTop: 16,
    gap: 16,
  },
  eventCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  eventTypeBadge: {
    backgroundColor: '#06B6D415',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#06B6D4',
    textTransform: 'capitalize',
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetails: {
    gap: 6,
    marginBottom: 12,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  participatingCompanies: {
    marginBottom: 16,
  },
  companiesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  companiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  companyTag: {
    backgroundColor: '#3B82F615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  companyTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  moreCompanies: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    alignSelf: 'center',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#06B6D4',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  registerButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  entrepreneurshipSection: {
    marginTop: 16,
    gap: 20,
  },
  entrepreneurshipOverview: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  incubatorsSection: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  incubatorsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  incubatorCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  incubatorName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  incubatorDetails: {
    gap: 6,
    marginBottom: 12,
  },
  incubatorDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  incubatorDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  incubatorSuccess: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  incubatorSuccessTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#15803D',
    marginBottom: 4,
  },
  incubatorGraduates: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#166534',
  },
  researchCommercializationSection: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  researchCommercializationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  researchCommercializationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  alumniGiving: {
    marginTop: 16,
    gap: 16,
  },
  givingOverview: {
    flexDirection: 'row',
    gap: 12,
  },
  givingStatCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  givingStatValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  givingStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  givingBreakdown: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  givingBreakdownTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  givingCategories: {
    gap: 8,
  },
  givingCategory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  givingCategoryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  givingCategoryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
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