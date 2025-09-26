import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ExternalLink, Lightbulb, MapPin, Calendar, DollarSign, Clock, Users, Award, Search, ListFilter as Filter, ChevronDown, ChevronUp, Target, BookOpen, Star, Trophy, Zap, Brain, Code, Globe, Building, Mail, Phone, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Heart, Briefcase, Wrench, Rocket, Cpu, Database, Shield, Smartphone, Monitor, Palette } from 'lucide-react-native';

interface InnovationResource {
  id: string;
  resource_title: string;
  resource_url: string;
  resource_type: string;
  resource_description: string;
  is_free: boolean;
  access_requirements: string;
  order_index: number;
}

interface InnovationMentor {
  id: string;
  mentor_name: string;
  mentor_title: string;
  mentor_organization: string;
  mentor_expertise: string[];
  mentor_bio: string;
  linkedin_profile: string;
  availability_schedule: string;
  mentorship_style: string;
  contact_method: string;
  order_index: number;
}

interface InnovationOpportunity {
  id: string;
  opportunity_name: string;
  opportunity_type: string;
  organization_name: string;
  opportunity_description: string;
  detailed_content: string;
  eligibility_requirements: string[];
  application_process: string;
  application_deadline: string;
  application_url: string;
  contact_email: string;
  contact_phone: string;
  program_duration: string;
  location_type: string;
  location_address: string;
  location_city: string;
  location_country: string;
  cost_information: string;
  benefits_offered: string[];
  skills_developed: string[];
  networking_opportunities: string;
  mentorship_available: boolean;
  certification_provided: boolean;
  prize_information: string;
  past_winners: any[];
  success_stories: string;
  application_tips: string;
  common_mistakes: string;
  preparation_resources: any[];
  difficulty_level: string;
  time_commitment: string;
  team_requirements: string;
  technology_focus: string[];
  industry_partnerships: any[];
  alumni_involvement: string;
  innovation_category: string;
  impact_metrics: string;
  sustainability_focus: boolean;
  diversity_initiatives: string;
  accessibility_features: string;
  virtual_components: string;
  follow_up_opportunities: string;
  order_index: number;
  resources: InnovationResource[];
  mentors: InnovationMentor[];
}

interface ProgramDetails {
  id: string;
  name: string;
  universities?: {
    name: string;
    location: string;
  };
}

export default function InnovationSandboxScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [opportunities, setOpportunities] = useState<InnovationOpportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<InnovationOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedOpportunities, setExpandedOpportunities] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchInnovationData();
  }, [id]);

  useEffect(() => {
    filterOpportunities();
  }, [searchQuery, selectedType, selectedCategory, opportunities]);

  const fetchInnovationData = async () => {
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

      // Generate comprehensive mock innovation opportunities
      const opportunityTypes = ['competition', 'workshop', 'camp', 'lab', 'volunteer', 'hackathon', 'incubator', 'accelerator'];
      const categories = ['artificial_intelligence', 'cybersecurity', 'web_development', 'mobile_development', 'data_science', 'blockchain', 'iot', 'robotics', 'game_development', 'fintech'];
      
      const organizations = [
        'Google AI', 'Microsoft Research', 'Meta AI Research', 'OpenAI', 'DeepMind', 'NVIDIA Research',
        'IBM Research', 'Amazon Web Services', 'Apple Developer Academy', 'Intel Labs',
        'MIT Innovation Lab', 'Stanford AI Lab', 'Berkeley SkyDeck', 'Y Combinator', 'Techstars',
        'National Science Foundation', 'IEEE Computer Society', 'ACM', 'GitHub', 'GitLab',
        'Coursera', 'edX', 'Udacity', 'Pluralsight', 'Khan Academy', 'FreeCodeCamp'
      ];

      const mockOpportunities: InnovationOpportunity[] = Array.from({ length: 100 }, (_, index) => {
        const type = opportunityTypes[index % opportunityTypes.length];
        const category = categories[index % categories.length];
        const organization = organizations[index % organizations.length];
        
        const opportunityNames = {
          competition: [
            'Global AI Challenge', 'Cybersecurity Innovation Contest', 'Web Development Championship',
            'Mobile App Innovation Award', 'Data Science Olympics', 'Blockchain Hackathon',
            'IoT Innovation Challenge', 'Robotics Competition', 'Game Development Contest'
          ],
          workshop: [
            'Advanced AI Workshop', 'Cybersecurity Bootcamp', 'Full Stack Development Workshop',
            'Mobile Development Intensive', 'Data Science Masterclass', 'Blockchain Development Workshop',
            'IoT Programming Workshop', 'Robotics Engineering Workshop', 'Game Design Workshop'
          ],
          camp: [
            'AI Summer Camp', 'Cybersecurity Training Camp', 'Coding Bootcamp',
            'Mobile Development Camp', 'Data Science Immersion', 'Blockchain Developer Camp',
            'IoT Innovation Camp', 'Robotics Summer Program', 'Game Development Intensive'
          ],
          lab: [
            'National AI Research Lab', 'Cybersecurity Research Center', 'Web Innovation Lab',
            'Mobile Technology Lab', 'Data Science Research Lab', 'Blockchain Innovation Lab',
            'IoT Research Center', 'Robotics Engineering Lab', 'Game Development Studio'
          ],
          volunteer: [
            'AI for Good Initiative', 'Cybersecurity Awareness Program', 'Code for Community',
            'Mobile Apps for Social Good', 'Data Science for Nonprofits', 'Blockchain for Transparency',
            'IoT for Sustainability', 'Robotics for Accessibility', 'Games for Education'
          ],
          hackathon: [
            'AI Innovation Hackathon', 'Cybersecurity Challenge', 'Web3 Hackathon',
            'Mobile Innovation Challenge', 'Data for Good Hackathon', 'Blockchain Builders',
            'IoT Solutions Hackathon', 'Robotics Innovation Challenge', 'Game Jam'
          ]
        };

        const typeNames = opportunityNames[type as keyof typeof opportunityNames] || [`${category} ${type}`];
        const opportunityName = typeNames[index % typeNames.length];

        return {
          id: `innovation-${index + 1}`,
          opportunity_name: opportunityName,
          opportunity_type: type,
          organization_name: organization,
          opportunity_description: `Join ${organization} for an innovative ${type} focused on ${category.replace('_', ' ')} that will enhance your skills and expand your network in the tech industry.`,
          detailed_content: `This comprehensive ${type} program is designed to push the boundaries of ${category.replace('_', ' ')} innovation. Participants will work on cutting-edge projects, collaborate with industry experts, and develop solutions to real-world challenges. The program combines theoretical knowledge with hands-on experience, providing a unique opportunity to contribute to the advancement of technology while building valuable professional connections.`,
          eligibility_requirements: [
            'Currently enrolled in Computer Science or related program',
            'Minimum GPA of 3.0',
            'Basic programming experience required',
            'Portfolio of previous projects preferred',
            'Strong problem-solving skills'
          ],
          application_process: `Submit online application through ${organization} portal, including resume, portfolio, and personal statement. Selected candidates will be invited for technical interview and final selection.`,
          application_deadline: new Date(Date.now() + Math.random() * 120 * 24 * 60 * 60 * 1000).toISOString(),
          application_url: `https://${organization.toLowerCase().replace(/\s+/g, '')}.com/innovation/${type}`,
          contact_email: `innovation@${organization.toLowerCase().replace(/\s+/g, '')}.com`,
          contact_phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          program_duration: ['2 weeks', '1 month', '3 months', '6 months', '1 year'][index % 5],
          location_type: ['online', 'onsite', 'hybrid'][index % 3],
          location_address: `${Math.floor(Math.random() * 9999) + 1} Innovation Drive`,
          location_city: ['San Francisco', 'New York', 'Seattle', 'Austin', 'Boston'][index % 5],
          location_country: 'United States',
          cost_information: index % 3 === 0 ? 'Free for selected participants' : `$${Math.floor(Math.random() * 2000) + 500}`,
          benefits_offered: [
            'Mentorship from industry experts',
            'Access to cutting-edge technology',
            'Networking opportunities',
            'Certificate of completion',
            'Potential job opportunities',
            'Project showcase platform'
          ],
          skills_developed: [
            `Advanced ${category.replace('_', ' ')} skills`,
            'Project management',
            'Team collaboration',
            'Innovation methodologies',
            'Technical presentation skills',
            'Industry best practices'
          ],
          networking_opportunities: `Connect with ${organization} engineers, researchers, and fellow participants. Access to exclusive industry events and professional development sessions.`,
          mentorship_available: Math.random() > 0.3,
          certification_provided: Math.random() > 0.4,
          prize_information: type === 'competition' ? `$${Math.floor(Math.random() * 50000) + 10000} in prizes, internship opportunities, and technology grants` : '',
          past_winners: type === 'competition' ? [
            { name: 'Team Alpha', project: 'AI-powered healthcare solution', year: 2023 },
            { name: 'Innovation Squad', project: 'Sustainable tech platform', year: 2022 }
          ] : [],
          success_stories: `Previous participants have gone on to work at top tech companies, start successful startups, and publish research in leading conferences. Many have credited this ${type} as a turning point in their careers.`,
          application_tips: `Focus on demonstrating your passion for ${category.replace('_', ' ')}, showcase relevant projects, and clearly articulate how this opportunity aligns with your career goals. Strong technical skills and innovative thinking are highly valued.`,
          common_mistakes: 'Generic applications, lack of technical depth in portfolio, missing deadlines, and not researching the organization thoroughly.',
          preparation_resources: [
            { title: `${category.replace('_', ' ')} Fundamentals`, url: `https://learn.${organization.toLowerCase().replace(/\s+/g, '')}.com/fundamentals` },
            { title: 'Innovation Methodologies', url: `https://innovation.${organization.toLowerCase().replace(/\s+/g, '')}.com/methods` },
            { title: 'Technical Interview Prep', url: `https://careers.${organization.toLowerCase().replace(/\s+/g, '')}.com/prep` }
          ],
          difficulty_level: ['beginner', 'intermediate', 'advanced'][index % 3],
          time_commitment: ['10-15 hours/week', '20-25 hours/week', '30-40 hours/week', 'Full-time'][index % 4],
          team_requirements: index % 2 === 0 ? 'Individual participation' : 'Teams of 3-5 members',
          technology_focus: [
            category.replace('_', ' '),
            'Cloud computing',
            'Open source development',
            'Agile methodologies',
            'DevOps practices'
          ],
          industry_partnerships: [
            { name: organization, role: 'Primary sponsor and mentor provider' },
            { name: 'Tech Industry Partners', role: 'Mentorship and job placement support' },
            { name: 'Academic Institutions', role: 'Research collaboration and validation' }
          ],
          alumni_involvement: `${organization} alumni serve as mentors, judges, and guest speakers throughout the program, providing valuable industry insights and career guidance.`,
          innovation_category: category,
          impact_metrics: `Over 500 participants annually, 85% job placement rate, 40+ startups launched, 200+ patents filed by alumni.`,
          sustainability_focus: Math.random() > 0.6,
          diversity_initiatives: 'Committed to 50% diversity in participant selection, with special programs for underrepresented groups in tech.',
          accessibility_features: 'Full accessibility support including screen readers, closed captions, and flexible participation options for participants with disabilities.',
          virtual_components: 'Hybrid format with virtual workshops, online mentorship sessions, and digital collaboration tools for remote participation.',
          follow_up_opportunities: `Graduates gain access to ${organization} alumni network, ongoing mentorship programs, and priority consideration for internships and full-time positions.`,
          order_index: index,
          resources: Array.from({ length: 5 }, (_, resIndex) => ({
            id: `res-${index}-${resIndex}`,
            resource_title: `${opportunityName} Resource ${resIndex + 1}`,
            resource_url: `https://${organization.toLowerCase().replace(/\s+/g, '')}.com/resources/${resIndex + 1}`,
            resource_type: ['guide', 'tutorial', 'template', 'tool', 'dataset'][resIndex % 5],
            resource_description: `Essential resource for ${opportunityName.toLowerCase()} participants`,
            is_free: resIndex < 3,
            access_requirements: resIndex < 3 ? 'Free access' : 'Program enrollment required',
            order_index: resIndex
          })),
          mentors: Array.from({ length: 3 }, (_, mentorIndex) => ({
            id: `mentor-${index}-${mentorIndex}`,
            mentor_name: `Dr. ${['Sarah', 'Michael', 'Emily', 'David', 'Jessica'][mentorIndex % 5]} ${['Johnson', 'Chen', 'Rodriguez', 'Kim', 'Williams'][mentorIndex % 5]}`,
            mentor_title: ['Senior Engineer', 'Research Scientist', 'Product Manager', 'Tech Lead', 'Principal Architect'][mentorIndex % 5],
            mentor_organization: organization,
            mentor_expertise: [
              category.replace('_', ' '),
              'Innovation management',
              'Technical leadership',
              'Product development',
              'Research methodology'
            ],
            mentor_bio: `Experienced ${category.replace('_', ' ')} professional with 10+ years at ${organization}, leading innovative projects and mentoring the next generation of tech talent.`,
            linkedin_profile: `https://linkedin.com/in/mentor-${index}-${mentorIndex}`,
            availability_schedule: 'Weekly 1-hour sessions, flexible scheduling',
            mentorship_style: 'Hands-on guidance with focus on practical application and career development',
            contact_method: 'Video calls, email, and in-person meetings',
            order_index: mentorIndex
          }))
        };
      });

      setProgram(mockProgram);
      setOpportunities(mockOpportunities);
      setFilteredOpportunities(mockOpportunities);
    } catch (err) {
      setError('Failed to load innovation opportunities');
    } finally {
      setLoading(false);
    }
  };

  const filterOpportunities = () => {
    let filtered = opportunities;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(opp =>
        opp.opportunity_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.opportunity_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.innovation_category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(opp => opp.opportunity_type === selectedType);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(opp => opp.innovation_category === selectedCategory);
    }

    setFilteredOpportunities(filtered);
  };

  const openExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  const sendEmail = (email: string, subject: string) => {
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
  };

  const toggleOpportunityExpansion = (opportunityId: string) => {
    const newExpanded = new Set(expandedOpportunities);
    if (newExpanded.has(opportunityId)) {
      newExpanded.delete(opportunityId);
    } else {
      newExpanded.add(opportunityId);
    }
    setExpandedOpportunities(newExpanded);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'competition': return Trophy;
      case 'workshop': return Wrench;
      case 'camp': return Users;
      case 'lab': return Brain;
      case 'volunteer': return Heart;
      case 'hackathon': return Code;
      case 'incubator': return Rocket;
      case 'accelerator': return Zap;
      default: return Lightbulb;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'competition': return '#F59E0B';
      case 'workshop': return '#3B82F6';
      case 'camp': return '#10B981';
      case 'lab': return '#8B5CF6';
      case 'volunteer': return '#EF4444';
      case 'hackathon': return '#06B6D4';
      case 'incubator': return '#EC4899';
      case 'accelerator': return '#84CC16';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'artificial_intelligence': return Brain;
      case 'cybersecurity': return Shield;
      case 'web_development': return Globe;
      case 'mobile_development': return Smartphone;
      case 'data_science': return Database;
      case 'blockchain': return Award;
      case 'iot': return Cpu;
      case 'robotics': return Wrench;
      case 'game_development': return Monitor;
      case 'fintech': return DollarSign;
      default: return Code;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'artificial_intelligence': return '#8B5CF6';
      case 'cybersecurity': return '#EF4444';
      case 'web_development': return '#10B981';
      case 'mobile_development': return '#06B6D4';
      case 'data_science': return '#3B82F6';
      case 'blockchain': return '#F59E0B';
      case 'iot': return '#84CC16';
      case 'robotics': return '#6B7280';
      case 'game_development': return '#EC4899';
      case 'fintech': return '#14B8A6';
      default: return '#6B7280';
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return BookOpen;
      case 'tutorial': return Monitor;
      case 'template': return Palette;
      case 'tool': return Wrench;
      case 'dataset': return Database;
      default: return BookOpen;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading innovation opportunities...</Text>
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

  const types = [
    { key: 'all', label: 'All Types', count: opportunities.length },
    ...Array.from(new Set(opportunities.map(o => o.opportunity_type))).map(type => ({
      key: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      count: opportunities.filter(o => o.opportunity_type === type).length
    }))
  ];

  const categories = [
    { key: 'all', label: 'All Categories', count: opportunities.length },
    ...Array.from(new Set(opportunities.map(o => o.innovation_category))).map(cat => ({
      key: cat,
      label: cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count: opportunities.filter(o => o.innovation_category === cat).length
    }))
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.programName}>Innovation Sandbox</Text>
            <Text style={styles.universityName}>{program.name} - {program.universities?.name}</Text>
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search opportunities, organizations, or categories..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {types.slice(0, 6).map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[styles.filterButton, selectedType === type.key && styles.filterButtonActive]}
                onPress={() => setSelectedType(type.key)}
              >
                <Text style={[styles.filterText, selectedType === type.key && styles.filterTextActive]}>
                  {type.label} ({type.count})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilterContainer}>
            {categories.slice(0, 6).map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[styles.categoryButton, selectedCategory === category.key && styles.categoryButtonActive]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Text style={[styles.categoryText, selectedCategory === category.key && styles.categoryTextActive]}>
                  {category.label} ({category.count})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.introSection}>
          <Lightbulb size={24} color="#3B82F6" />
          <Text style={styles.introTitle}>Innovation Opportunities for {program.name}</Text>
          <Text style={styles.introText}>
            Discover experimental spaces, competitions, workshops, and volunteer programs that enhance your knowledge 
            and provide hands-on experience in cutting-edge technology areas.
          </Text>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredOpportunities.length} innovation opportunities available
          </Text>
        </View>

        {filteredOpportunities.map((opportunity) => (
          <View key={opportunity.id} style={styles.opportunityCard}>
            <TouchableOpacity
              style={styles.opportunityHeader}
              onPress={() => toggleOpportunityExpansion(opportunity.id)}
            >
              <View style={styles.opportunityInfo}>
                <View style={styles.titleRow}>
                  <View style={[styles.typeIcon, { backgroundColor: `${getTypeColor(opportunity.opportunity_type)}15` }]}>
                    {React.createElement(getTypeIcon(opportunity.opportunity_type), { 
                      size: 20, 
                      color: getTypeColor(opportunity.opportunity_type) 
                    })}
                  </View>
                  <View style={styles.titleInfo}>
                    <Text style={styles.opportunityName}>{opportunity.opportunity_name}</Text>
                    <Text style={styles.organization}>by {opportunity.organization_name}</Text>
                  </View>
                </View>
                
                <View style={styles.opportunityMeta}>
                  <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(opportunity.innovation_category)}15` }]}>
                    {React.createElement(getCategoryIcon(opportunity.innovation_category), { 
                      size: 14, 
                      color: getCategoryColor(opportunity.innovation_category) 
                    })}
                    <Text style={[styles.categoryBadgeText, { color: getCategoryColor(opportunity.innovation_category) }]}>
                      {opportunity.innovation_category.replace('_', ' ')}
                    </Text>
                  </View>
                  <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(opportunity.difficulty_level)}15` }]}>
                    <Text style={[styles.difficultyText, { color: getDifficultyColor(opportunity.difficulty_level) }]}>
                      {opportunity.difficulty_level}
                    </Text>
                  </View>
                </View>

                <Text style={styles.description}>{opportunity.opportunity_description}</Text>
              </View>
              {expandedOpportunities.has(opportunity.id) ? (
                <ChevronUp size={24} color="#6B7280" />
              ) : (
                <ChevronDown size={24} color="#6B7280" />
              )}
            </TouchableOpacity>

            {expandedOpportunities.has(opportunity.id) && (
              <View style={styles.opportunityContent}>
                {/* Detailed Content */}
                <View style={styles.contentSection}>
                  <View style={styles.sectionHeader}>
                    <BookOpen size={20} color="#3B82F6" />
                    <Text style={styles.sectionTitle}>Program Overview</Text>
                  </View>
                  <Text style={styles.detailedContent}>{opportunity.detailed_content}</Text>
                </View>

                {/* Key Information */}
                <View style={styles.infoSection}>
                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.infoLabel}>Duration:</Text>
                      <Text style={styles.infoValue}>{opportunity.program_duration}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Users size={16} color="#6B7280" />
                      <Text style={styles.infoLabel}>Team:</Text>
                      <Text style={styles.infoValue}>{opportunity.team_requirements}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <MapPin size={16} color="#6B7280" />
                      <Text style={styles.infoLabel}>Location:</Text>
                      <Text style={styles.infoValue}>{opportunity.location_type}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <DollarSign size={16} color="#6B7280" />
                      <Text style={styles.infoLabel}>Cost:</Text>
                      <Text style={styles.infoValue}>{opportunity.cost_information}</Text>
                    </View>
                  </View>
                </View>

                {/* Eligibility Requirements */}
                <View style={styles.requirementsSection}>
                  <View style={styles.sectionHeader}>
                    <CheckCircle size={20} color="#10B981" />
                    <Text style={styles.sectionTitle}>Eligibility Requirements</Text>
                  </View>
                  <View style={styles.requirementsList}>
                    {opportunity.eligibility_requirements.map((requirement, index) => (
                      <View key={index} style={styles.requirementItem}>
                        <CheckCircle size={16} color="#10B981" />
                        <Text style={styles.requirementText}>{requirement}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Benefits & Skills */}
                <View style={styles.benefitsSection}>
                  <View style={styles.sectionHeader}>
                    <Award size={20} color="#F59E0B" />
                    <Text style={styles.sectionTitle}>Benefits & Skills Developed</Text>
                  </View>
                  <View style={styles.benefitsGrid}>
                    <View style={styles.benefitsColumn}>
                      <Text style={styles.benefitsSubtitle}>Benefits Offered:</Text>
                      {opportunity.benefits_offered.map((benefit, index) => (
                        <View key={index} style={styles.benefitItem}>
                          <Star size={14} color="#F59E0B" />
                          <Text style={styles.benefitText}>{benefit}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.benefitsColumn}>
                      <Text style={styles.benefitsSubtitle}>Skills Developed:</Text>
                      {opportunity.skills_developed.map((skill, index) => (
                        <View key={index} style={styles.skillItem}>
                          <Target size={14} color="#3B82F6" />
                          <Text style={styles.skillText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Prize Information (for competitions) */}
                {opportunity.opportunity_type === 'competition' && opportunity.prize_information && (
                  <View style={styles.prizeSection}>
                    <View style={styles.sectionHeader}>
                      <Trophy size={20} color="#F59E0B" />
                      <Text style={styles.sectionTitle}>Prizes & Awards</Text>
                    </View>
                    <Text style={styles.prizeText}>{opportunity.prize_information}</Text>
                    {opportunity.past_winners.length > 0 && (
                      <View style={styles.winnersSection}>
                        <Text style={styles.winnersTitle}>Past Winners:</Text>
                        {opportunity.past_winners.map((winner: any, index: number) => (
                          <View key={index} style={styles.winnerItem}>
                            <Award size={14} color="#F59E0B" />
                            <Text style={styles.winnerText}>
                              {winner.name} - {winner.project} ({winner.year})
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* Mentorship (if available) */}
                {opportunity.mentorship_available && (
                  <View style={styles.mentorshipSection}>
                    <View style={styles.sectionHeader}>
                      <Users size={20} color="#8B5CF6" />
                      <Text style={styles.sectionTitle}>Mentorship Program</Text>
                    </View>
                    <Text style={styles.mentorshipText}>{opportunity.networking_opportunities}</Text>
                    <View style={styles.mentorsList}>
                      {opportunity.mentors.map((mentor) => (
                        <View key={mentor.id} style={styles.mentorCard}>
                          <View style={styles.mentorInfo}>
                            <Text style={styles.mentorName}>{mentor.mentor_name}</Text>
                            <Text style={styles.mentorTitle}>{mentor.mentor_title}</Text>
                            <Text style={styles.mentorOrg}>{mentor.mentor_organization}</Text>
                            <Text style={styles.mentorBio} numberOfLines={2}>{mentor.mentor_bio}</Text>
                          </View>
                          {mentor.linkedin_profile && (
                            <TouchableOpacity
                              style={styles.linkedinButton}
                              onPress={() => openExternalLink(mentor.linkedin_profile)}
                            >
                              <ExternalLink size={16} color="#3B82F6" />
                            </TouchableOpacity>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Resources */}
                <View style={styles.resourcesSection}>
                  <View style={styles.sectionHeader}>
                    <BookOpen size={20} color="#06B6D4" />
                    <Text style={styles.sectionTitle}>Preparation Resources</Text>
                  </View>
                  <View style={styles.resourcesList}>
                    {opportunity.resources.map((resource) => {
                      const IconComponent = getResourceTypeIcon(resource.resource_type);
                      
                      return (
                        <TouchableOpacity
                          key={resource.id}
                          style={styles.resourceCard}
                          onPress={() => openExternalLink(resource.resource_url)}
                        >
                          <View style={styles.resourceIcon}>
                            <IconComponent size={16} color="#06B6D4" />
                          </View>
                          <View style={styles.resourceInfo}>
                            <Text style={styles.resourceTitle}>{resource.resource_title}</Text>
                            <Text style={styles.resourceDescription}>{resource.resource_description}</Text>
                            <View style={styles.resourceMeta}>
                              <Text style={styles.resourceType}>{resource.resource_type}</Text>
                              {resource.is_free ? (
                                <Text style={styles.freeText}>Free</Text>
                              ) : (
                                <Text style={styles.accessText}>{resource.access_requirements}</Text>
                              )}
                            </View>
                          </View>
                          <ExternalLink size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Application Tips */}
                <View style={styles.tipsSection}>
                  <View style={styles.sectionHeader}>
                    <Lightbulb size={20} color="#F59E0B" />
                    <Text style={styles.sectionTitle}>Application Tips</Text>
                  </View>
                  <Text style={styles.tipsText}>{opportunity.application_tips}</Text>
                  
                  <View style={styles.mistakesSection}>
                    <View style={styles.mistakesHeader}>
                      <AlertCircle size={16} color="#EF4444" />
                      <Text style={styles.mistakesTitle}>Common Mistakes to Avoid:</Text>
                    </View>
                    <Text style={styles.mistakesText}>{opportunity.common_mistakes}</Text>
                  </View>
                </View>

                {/* Application Information */}
                <View style={styles.applicationSection}>
                  <View style={styles.sectionHeader}>
                    <Calendar size={20} color="#EF4444" />
                    <Text style={styles.sectionTitle}>Application Information</Text>
                  </View>
                  <Text style={styles.processText}>{opportunity.application_process}</Text>
                  <View style={styles.deadlineContainer}>
                    <Calendar size={16} color="#EF4444" />
                    <Text style={styles.deadlineText}>
                      Deadline: {new Date(opportunity.application_deadline).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {/* Contact Information */}
                <View style={styles.contactSection}>
                  <Text style={styles.contactTitle}>Contact Information</Text>
                  <View style={styles.contactDetails}>
                    <View style={styles.contactItem}>
                      <Mail size={16} color="#6B7280" />
                      <Text style={styles.contactText}>{opportunity.contact_email}</Text>
                    </View>
                    {opportunity.contact_phone && (
                      <View style={styles.contactItem}>
                        <Phone size={16} color="#6B7280" />
                        <Text style={styles.contactText}>{opportunity.contact_phone}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => openExternalLink(opportunity.application_url)}
                  >
                    <ExternalLink size={16} color="#FFFFFF" />
                    <Text style={styles.primaryButtonText}>Apply Now</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => sendEmail(opportunity.contact_email, `Inquiry about ${opportunity.opportunity_name}`)}
                  >
                    <Mail size={16} color="#3B82F6" />
                    <Text style={styles.secondaryButtonText}>Contact</Text>
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
  categoryFilterContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryTextActive: {
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
  opportunityCard: {
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
  opportunityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  opportunityInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIcon: {
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
  opportunityName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  organization: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  opportunityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  opportunityContent: {
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
  infoSection: {
    marginBottom: 20,
  },
  infoGrid: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    minWidth: 60,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  requirementsSection: {
    marginBottom: 20,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  requirementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
    lineHeight: 20,
  },
  benefitsSection: {
    marginBottom: 20,
  },
  benefitsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  benefitsColumn: {
    flex: 1,
  },
  benefitsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
    lineHeight: 18,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 6,
  },
  skillText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
    lineHeight: 18,
  },
  prizeSection: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  prizeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    lineHeight: 20,
    marginBottom: 12,
  },
  winnersSection: {
    marginTop: 8,
  },
  winnersTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 8,
  },
  winnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  winnerText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    flex: 1,
  },
  mentorshipSection: {
    marginBottom: 20,
  },
  mentorshipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  mentorsList: {
    gap: 12,
  },
  mentorCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  mentorTitle: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginBottom: 2,
  },
  mentorOrg: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  mentorBio: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 16,
  },
  linkedinButton: {
    padding: 8,
  },
  resourcesSection: {
    marginBottom: 20,
  },
  resourcesList: {
    gap: 8,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resourceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#06B6D415',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 4,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resourceType: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    textTransform: 'capitalize',
  },
  freeText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  accessText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  tipsSection: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0369A1',
    lineHeight: 20,
    marginBottom: 12,
  },
  mistakesSection: {
    marginTop: 8,
  },
  mistakesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  mistakesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
  },
  mistakesText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
    lineHeight: 18,
  },
  applicationSection: {
    marginBottom: 20,
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
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  deadlineText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  contactSection: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  contactDetails: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
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