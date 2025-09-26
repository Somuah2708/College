import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, ExternalLink, Calendar, DollarSign, Clock, Building, Mail, Search, ListFilter as Filter, Globe, Navigation } from 'lucide-react-native';

interface Internship {
  id: string;
  organization_name: string;
  position_title: string;
  description: string;
  location_address: string;
  location_city: string;
  location_country: string;
  latitude: number;
  longitude: number;
  application_url: string;
  application_email: string;
  application_deadline: string;
  duration: string;
  compensation: string;
  requirements: string;
  google_maps_link: string;
  organization_website: string;
  is_remote: boolean;
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

export default function InternshipHubScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'remote' | 'onsite'>('all');

  useEffect(() => {
    fetchInternshipsData();
  }, [id]);

  useEffect(() => {
    filterInternships();
  }, [searchQuery, selectedFilter, internships]);

  const fetchInternshipsData = async () => {
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

      // Generate mock internships data (simulating up to 1000 opportunities)
      const mockInternships: Internship[] = generateInternshipsForProgram(actualProgram.name, 50);

      setProgram(actualProgram);
      setInternships(mockInternships);
      setFilteredInternships(mockInternships);
    } catch (err) {
      setError('Failed to load internship opportunities');
    } finally {
      setLoading(false);
    }
  };

  const generateInternshipsForProgram = (programName: string, count: number): Internship[] => {
    const name = programName.toLowerCase();
    
    let companies: string[] = [];
    let positions: string[] = [];
    
    if (name.includes('computer science') || name.includes('software')) {
      companies = ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'Uber', 'Airbnb', 'Spotify'];
      positions = ['Software Engineering Intern', 'Data Science Intern', 'Machine Learning Intern', 'Cybersecurity Intern', 'Full Stack Developer Intern', 'Mobile Development Intern'];
    } else if (name.includes('business') || name.includes('management')) {
      companies = ['McKinsey & Company', 'Boston Consulting Group', 'Deloitte', 'PwC', 'Goldman Sachs', 'JP Morgan', 'Coca-Cola', 'Unilever', 'Procter & Gamble', 'Johnson & Johnson'];
      positions = ['Business Analyst Intern', 'Marketing Intern', 'Finance Intern', 'Operations Intern', 'Strategy Intern', 'Consulting Intern'];
    } else if (name.includes('engineering')) {
      companies = ['General Electric', 'Siemens', 'Boeing', 'Lockheed Martin', 'Caterpillar', 'Ford', 'Toyota', 'Shell', 'ExxonMobil', 'Chevron'];
      positions = ['Engineering Intern', 'Design Engineer Intern', 'Project Engineering Intern', 'Research & Development Intern', 'Quality Engineering Intern', 'Manufacturing Intern'];
    } else if (name.includes('medicine') || name.includes('health')) {
      companies = ['Johns Hopkins Hospital', 'Mayo Clinic', 'Cleveland Clinic', 'WHO', 'CDC', 'Pfizer', 'Johnson & Johnson', 'Novartis', 'Roche', 'Merck'];
      positions = ['Medical Research Intern', 'Healthcare Administration Intern', 'Public Health Intern', 'Clinical Research Intern', 'Health Policy Intern', 'Medical Technology Intern'];
    } else if (name.includes('law')) {
      companies = ['Baker McKenzie', 'Clifford Chance', 'Linklaters', 'Freshfields', 'Allen & Overy', 'Supreme Court', 'Ministry of Justice', 'UN Legal Affairs', 'World Bank Legal'];
      positions = ['Legal Intern', 'Paralegal Intern', 'Corporate Law Intern', 'Public Interest Law Intern', 'Legal Research Intern', 'Judicial Intern'];
    } else if (name.includes('psychology')) {
      companies = ['Mayo Clinic', 'Johns Hopkins', 'Harvard Medical School', 'APA', 'Mental Health America', 'NIMH', 'Psychology Today', 'BetterHelp', 'Headspace'];
      positions = ['Psychology Research Intern', 'Clinical Psychology Intern', 'Counseling Intern', 'Organizational Psychology Intern', 'Mental Health Intern', 'Behavioral Research Intern'];
    } else {
      companies = [`Leading ${programName} Company`, `Global ${programName} Corporation`, `${programName} Innovations Inc`, `Premier ${programName} Group`, `${programName} Solutions Ltd`];
      positions = [`${programName} Intern`, `${programName} Research Intern`, `${programName} Assistant`, `${programName} Trainee`];
    }

    const cities = [
      { city: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194 },
      { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
      { city: 'Seattle', country: 'USA', lat: 47.6062, lng: -122.3321 },
      { city: 'Austin', country: 'USA', lat: 30.2672, lng: -97.7431 },
      { city: 'Boston', country: 'USA', lat: 42.3601, lng: -71.0589 },
      { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
      { city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
      { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 }
    ];

    return Array.from({ length: count }, (_, index) => {
      const company = companies[index % companies.length];
      const position = positions[index % positions.length];
      const location = cities[index % cities.length];
      const isRemote = Math.random() > 0.7;

      return {
        id: `internship-${index + 1}`,
        organization_name: company,
        position_title: position,
        description: `Join ${company} as a ${position} and work on cutting-edge projects in ${programName.toLowerCase()}. You'll collaborate with experienced professionals and contribute to innovative solutions in the field.`,
        location_address: `${Math.floor(Math.random() * 9999) + 1} Professional Street`,
        location_city: location.city,
        location_country: location.country,
        latitude: location.lat,
        longitude: location.lng,
        application_url: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/careers/internships`,
        application_email: `internships@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        application_deadline: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        duration: ['10 weeks', '12 weeks', '16 weeks', '3 months', '6 months'][Math.floor(Math.random() * 5)],
        compensation: [`$${Math.floor(Math.random() * 3000) + 2000}/month`, `$${Math.floor(Math.random() * 20) + 25}/hour`, 'Competitive salary'][Math.floor(Math.random() * 3)],
        requirements: `Currently pursuing ${programName} degree, Strong foundational skills in ${programName.toLowerCase()}, Previous internship experience preferred`,
        google_maps_link: `https://maps.google.com/?q=${location.lat},${location.lng}`,
        organization_website: `https://${company.toLowerCase().replace(/\s+/g, '')}.com`,
        is_remote: isRemote,
        order_index: index
      };
    });
  };

  const filterInternships = () => {
    let filtered = internships;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(internship =>
        internship.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.position_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.location_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.location_country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply remote/onsite filter
    if (selectedFilter === 'remote') {
      filtered = filtered.filter(internship => internship.is_remote);
    } else if (selectedFilter === 'onsite') {
      filtered = filtered.filter(internship => !internship.is_remote);
    }

    setFilteredInternships(filtered);
  };

  const openExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  const openGoogleMaps = (mapsLink: string) => {
    Linking.openURL(mapsLink);
  };

  const sendEmail = (email: string, subject: string) => {
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading internship opportunities...</Text>
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
            <Text style={styles.programName}>Internship Hub</Text>
            <Text style={styles.universityName}>{program.name} - {program.universities?.name}</Text>
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search companies, positions, or locations..."
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
                All ({internships.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'remote' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('remote')}
            >
              <Text style={[styles.filterText, selectedFilter === 'remote' && styles.filterTextActive]}>
                Remote ({internships.filter(i => i.is_remote).length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'onsite' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('onsite')}
            >
              <Text style={[styles.filterText, selectedFilter === 'onsite' && styles.filterTextActive]}>
                On-site ({internships.filter(i => !i.is_remote).length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredInternships.length} internship opportunities found
          </Text>
        </View>

        {filteredInternships.map((internship) => (
          <View key={internship.id} style={styles.internshipCard}>
            <View style={styles.cardHeader}>
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{internship.organization_name}</Text>
                <Text style={styles.positionTitle}>{internship.position_title}</Text>
              </View>
              <View style={styles.statusBadges}>
                {internship.is_remote && (
                  <View style={styles.remoteBadge}>
                    <Globe size={12} color="#10B981" />
                    <Text style={styles.remoteBadgeText}>Remote</Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.description} numberOfLines={3}>
              {internship.description}
            </Text>

            <View style={styles.internshipDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.detailText}>
                  {internship.is_remote ? 'Remote' : `${internship.location_city}, ${internship.location_country}`}
                </Text>
                {!internship.is_remote && (
                  <TouchableOpacity
                    style={styles.mapsButton}
                    onPress={() => openGoogleMaps(internship.google_maps_link)}
                  >
                    <Navigation size={14} color="#3B82F6" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.detailRow}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.detailText}>Duration: {internship.duration}</Text>
              </View>

              <View style={styles.detailRow}>
                <DollarSign size={16} color="#6B7280" />
                <Text style={styles.detailText}>Compensation: {internship.compensation}</Text>
              </View>

              <View style={styles.detailRow}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.detailText}>
                  Deadline: {new Date(internship.application_deadline).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.requirementsSection}>
              <Text style={styles.requirementsTitle}>Requirements:</Text>
              <Text style={styles.requirementsText}>{internship.requirements}</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => openExternalLink(internship.application_url)}
              >
                <ExternalLink size={16} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Apply Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => sendEmail(internship.application_email, `Internship Application - ${internship.position_title}`)}
              >
                <Mail size={16} color="#3B82F6" />
                <Text style={styles.secondaryButtonText}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => openExternalLink(internship.organization_website)}
              >
                <Building size={16} color="#3B82F6" />
                <Text style={styles.secondaryButtonText}>Website</Text>
              </TouchableOpacity>
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
  internshipCard: {
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
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  positionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  statusBadges: {
    alignItems: 'flex-end',
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
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  internshipDetails: {
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
  mapsButton: {
    padding: 4,
  },
  requirementsSection: {
    marginBottom: 20,
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