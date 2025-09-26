import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  ExternalLink, 
  Film, 
  Star,
  Search,
  ListFilter as Filter,
  Calendar,
  Award,
  Users,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Monitor,
  DollarSign,
  Globe,
  Eye,
  Heart,
  Tv
} from 'lucide-react-native';

interface StreamingPlatform {
  id: string;
  platform_name: string;
  platform_url: string;
  availability_region: string;
  subscription_required: boolean;
  rental_price: string;
  purchase_price: string;
  platform_logo_url: string;
  last_verified: string;
  order_index: number;
}

interface EntertainmentContent {
  id: string;
  title: string;
  content_type: string;
  release_year: number;
  genre: string;
  description: string;
  imdb_rating: number;
  duration: string;
  trailer_url: string;
  poster_image_url: string;
  relevance_explanation: string;
  key_themes: string[];
  educational_value: string;
  order_index: number;
  streaming_platforms: StreamingPlatform[];
}

interface EntertainmentCategory {
  id: string;
  category_name: string;
  category_description: string;
  order_index: number;
  content: EntertainmentContent[];
}

interface ProgramDetails {
  id: string;
  name: string;
  universities?: {
    name: string;
    location: string;
  };
}

export default function InspirationalEntertainmentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [categories, setCategories] = useState<EntertainmentCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<EntertainmentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContentType, setSelectedContentType] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchEntertainmentData();
  }, [id]);

  useEffect(() => {
    filterContent();
  }, [searchQuery, selectedContentType, categories]);

  const fetchEntertainmentData = async () => {
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

      // Generate program-specific entertainment categories
      const programCategories: EntertainmentCategory[] = generateCategoriesForProgram(actualProgram.name);

      setProgram(actualProgram);
      setCategories(programCategories);
      setFilteredCategories(programCategories);
    } catch (err) {
      setError('Failed to load entertainment content');
    } finally {
      setLoading(false);
    }
  };

  const generateCategoriesForProgram = (programName: string): EntertainmentCategory[] => {
    const name = programName.toLowerCase();
    
    if (name.includes('computer science') || name.includes('software')) {
      return [
        {
          id: 'cat-1',
          category_name: 'Coding & Programming',
          category_description: `Movies and series that showcase the world of programming and software development relevant to ${programName}`,
          order_index: 0,
          content: [
            {
              id: 'content-1',
              title: 'The Social Network',
              content_type: 'movie',
              release_year: 2010,
              genre: 'Drama, Biography',
              description: 'The story of Facebook\'s founding and the legal battles that followed',
              imdb_rating: 7.7,
              duration: '2h 0m',
              trailer_url: 'https://youtube.com/watch?v=lB95KLmpLR4',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: `Shows the entrepreneurial side of ${programName.toLowerCase()} and how technical skills can change the world`,
              key_themes: ['Entrepreneurship', 'Programming', 'Social Media', 'Innovation'],
              educational_value: `Demonstrates how ${programName.toLowerCase()} skills can lead to world-changing innovations`,
              order_index: 0,
              streaming_platforms: [
                {
                  id: 'sp-1',
                  platform_name: 'Netflix',
                  platform_url: 'https://netflix.com/title/70132721',
                  availability_region: 'US, UK, Canada',
                  subscription_required: true,
                  rental_price: '',
                  purchase_price: '',
                  platform_logo_url: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg',
                  last_verified: '2024-12-01T00:00:00Z',
                  order_index: 0
                },
                {
                  id: 'sp-2',
                  platform_name: 'Amazon Prime Video',
                  platform_url: 'https://primevideo.com/detail/0GZGFX2XBHZ8ZYXJZQZQZQ',
                  availability_region: 'Global',
                  subscription_required: false,
                  rental_price: '$3.99',
                  purchase_price: '$12.99',
                  platform_logo_url: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg',
                  last_verified: '2024-12-01T00:00:00Z',
                  order_index: 1
                }
              ]
            },
            {
              id: 'content-2',
              title: 'Silicon Valley',
              content_type: 'series',
              release_year: 2014,
              genre: 'Comedy',
              description: 'A comedy series about programmers in Silicon Valley trying to build a tech startup',
              imdb_rating: 8.5,
              duration: '6 seasons, 53 episodes',
              trailer_url: 'https://youtube.com/watch?v=69V__a49xtw',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: 'Humorous but accurate portrayal of startup culture and programming challenges',
              key_themes: ['Startup Culture', 'Programming', 'Tech Industry', 'Innovation'],
              educational_value: 'Provides insight into tech startup environment and programming culture',
              order_index: 1,
              streaming_platforms: [
                {
                  id: 'sp-3',
                  platform_name: 'HBO Max',
                  platform_url: 'https://hbomax.com/series/silicon-valley',
                  availability_region: 'US, Canada',
                  subscription_required: true,
                  rental_price: '',
                  purchase_price: '',
                  platform_logo_url: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg',
                  last_verified: '2024-12-01T00:00:00Z',
                  order_index: 0
                }
              ]
            }
          ]
        },
        {
          id: 'cat-2',
          category_name: 'Artificial Intelligence & Machine Learning',
          category_description: `Films exploring AI, robotics, and the future of intelligent machines relevant to ${programName}`,
          order_index: 1,
          content: [
            {
              id: 'content-3',
              title: 'Ex Machina',
              content_type: 'movie',
              release_year: 2014,
              genre: 'Sci-Fi, Thriller',
              description: 'A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence',
              imdb_rating: 7.7,
              duration: '1h 48m',
              trailer_url: 'https://youtube.com/watch?v=XYGzRB4Pnq8',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: `Explores the Turing test and ethical implications of AI development relevant to ${programName.toLowerCase()}`,
              key_themes: ['Artificial Intelligence', 'Ethics', 'Turing Test', 'Machine Consciousness'],
              educational_value: 'Raises important questions about AI ethics and consciousness',
              order_index: 0,
              streaming_platforms: [
                {
                  id: 'sp-4',
                  platform_name: 'Amazon Prime Video',
                  platform_url: 'https://primevideo.com/detail/ex-machina',
                  availability_region: 'Global',
                  subscription_required: false,
                  rental_price: '$3.99',
                  purchase_price: '$9.99',
                  platform_logo_url: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg',
                  last_verified: '2024-12-01T00:00:00Z',
                  order_index: 0
                }
              ]
            },
            {
              id: 'content-4',
              title: 'Her',
              content_type: 'movie',
              release_year: 2013,
              genre: 'Romance, Sci-Fi',
              description: 'A man develops a relationship with an artificially intelligent virtual assistant',
              imdb_rating: 8.0,
              duration: '2h 6m',
              trailer_url: 'https://youtube.com/watch?v=WzV6mXIOVl4',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: 'Explores human-AI interaction and natural language processing',
              key_themes: ['AI Interaction', 'Natural Language Processing', 'Human-Computer Interface'],
              educational_value: 'Shows potential future of AI assistants and human-computer relationships',
              order_index: 1,
              streaming_platforms: [
                {
                  id: 'sp-5',
                  platform_name: 'Netflix',
                  platform_url: 'https://netflix.com/title/her',
                  availability_region: 'US, UK',
                  subscription_required: true,
                  rental_price: '',
                  purchase_price: '',
                  platform_logo_url: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg',
                  last_verified: '2024-12-01T00:00:00Z',
                  order_index: 0
                }
              ]
            }
          ]
        }
      ];
    } else if (name.includes('business') || name.includes('management')) {
      return [
        {
          id: 'cat-bus-1',
          category_name: 'Entrepreneurship & Business Innovation',
          category_description: `Films showcasing entrepreneurial journeys and business innovation relevant to ${programName}`,
          order_index: 0,
          content: [
            {
              id: 'content-bus-1',
              title: 'The Pursuit of Happyness',
              content_type: 'movie',
              release_year: 2006,
              genre: 'Biography, Drama',
              description: 'A struggling salesman takes custody of his son as he\'s poised to begin a life-changing professional career',
              imdb_rating: 8.0,
              duration: '1h 57m',
              trailer_url: 'https://youtube.com/watch?v=89Kq8SDyvfg',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: `Demonstrates perseverance, determination, and the entrepreneurial spirit essential in ${programName}`,
              key_themes: ['Entrepreneurship', 'Perseverance', 'Career Change', 'Success'],
              educational_value: `Shows how determination and hard work can lead to success in ${programName} careers`,
              order_index: 0,
              streaming_platforms: []
            },
            {
              id: 'content-bus-2',
              title: 'Suits',
              content_type: 'series',
              release_year: 2011,
              genre: 'Drama, Legal',
              description: 'A college dropout gets a job at a top law firm by pretending to be a Harvard graduate',
              imdb_rating: 8.5,
              duration: '9 seasons, 134 episodes',
              trailer_url: 'https://youtube.com/watch?v=85z53bAebsI',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: 'Showcases business acumen, negotiation skills, and professional relationships',
              key_themes: ['Business Strategy', 'Negotiation', 'Professional Ethics', 'Leadership'],
              educational_value: 'Demonstrates business thinking and professional conduct',
              order_index: 1,
              streaming_platforms: []
            }
          ]
        },
        {
          id: 'cat-bus-2',
          category_name: 'Corporate Culture & Leadership',
          category_description: `Content exploring corporate environments and leadership principles relevant to ${programName}`,
          order_index: 1,
          content: [
            {
              id: 'content-bus-3',
              title: 'The Devil Wears Prada',
              content_type: 'movie',
              release_year: 2006,
              genre: 'Comedy, Drama',
              description: 'A naive young woman comes to New York and scores a job as the assistant to one of the city\'s biggest magazine editors',
              imdb_rating: 6.9,
              duration: '1h 49m',
              trailer_url: 'https://youtube.com/watch?v=LkIVYd57URY',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: 'Explores workplace dynamics, professional growth, and corporate culture',
              key_themes: ['Corporate Culture', 'Professional Growth', 'Workplace Dynamics', 'Leadership'],
              educational_value: 'Shows the importance of adaptability and professionalism in business environments',
              order_index: 0,
              streaming_platforms: []
            }
          ]
        }
      ];
    } else if (name.includes('engineering')) {
      return [
        {
          id: 'cat-eng-1',
          category_name: 'Innovation & Problem Solving',
          category_description: `Films showcasing engineering innovation and problem-solving relevant to ${programName}`,
          order_index: 0,
          content: [
            {
              id: 'content-eng-1',
              title: 'Apollo 13',
              content_type: 'movie',
              release_year: 1995,
              genre: 'Drama, History',
              description: 'NASA must devise a strategy to return Apollo 13 to Earth safely after the spacecraft undergoes massive internal damage',
              imdb_rating: 7.6,
              duration: '2h 20m',
              trailer_url: 'https://youtube.com/watch?v=KtEIMC58sZo',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: `Demonstrates engineering problem-solving under pressure and innovative thinking crucial in ${programName}`,
              key_themes: ['Problem Solving', 'Innovation', 'Teamwork', 'Engineering Excellence'],
              educational_value: `Shows how engineering principles and creative thinking can solve critical problems`,
              order_index: 0,
              streaming_platforms: []
            },
            {
              id: 'content-eng-2',
              title: 'The Martian',
              content_type: 'movie',
              release_year: 2015,
              genre: 'Adventure, Drama, Sci-Fi',
              description: 'An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth',
              imdb_rating: 8.0,
              duration: '2h 24m',
              trailer_url: 'https://youtube.com/watch?v=ej3ioOneTy8',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: 'Showcases engineering resourcefulness, scientific method, and problem-solving',
              key_themes: ['Engineering', 'Problem Solving', 'Science', 'Survival'],
              educational_value: 'Demonstrates practical application of engineering and scientific principles',
              order_index: 1,
              streaming_platforms: []
            }
          ]
        }
      ];
    } else if (name.includes('medicine') || name.includes('health')) {
      return [
        {
          id: 'cat-med-1',
          category_name: 'Medical Practice & Ethics',
          category_description: `Content exploring medical practice, ethics, and healthcare relevant to ${programName}`,
          order_index: 0,
          content: [
            {
              id: 'content-med-1',
              title: 'Patch Adams',
              content_type: 'movie',
              release_year: 1998,
              genre: 'Biography, Comedy, Drama',
              description: 'The true story of a heroic man, Hunter "Patch" Adams, determined to become a medical doctor because he enjoys helping people',
              imdb_rating: 6.8,
              duration: '1h 55m',
              trailer_url: 'https://youtube.com/watch?v=ej3ioOneTy8',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: `Shows the human side of medicine and the importance of empathy in ${programName}`,
              key_themes: ['Medical Ethics', 'Patient Care', 'Empathy', 'Healthcare Innovation'],
              educational_value: `Demonstrates the importance of compassion and innovation in ${programName}`,
              order_index: 0,
              streaming_platforms: []
            },
            {
              id: 'content-med-2',
              title: 'Grey\'s Anatomy',
              content_type: 'series',
              release_year: 2005,
              genre: 'Drama, Romance',
              description: 'A drama centered on the personal and professional lives of five surgical interns and their supervisors',
              imdb_rating: 7.6,
              duration: '20+ seasons',
              trailer_url: 'https://youtube.com/watch?v=ej3ioOneTy8',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: 'Provides insight into medical training, hospital culture, and patient care',
              key_themes: ['Medical Training', 'Hospital Life', 'Patient Care', 'Medical Ethics'],
              educational_value: 'Shows the challenges and rewards of medical practice',
              order_index: 1,
              streaming_platforms: []
            }
          ]
        }
      ];
    } else if (name.includes('law')) {
      return [
        {
          id: 'cat-law-1',
          category_name: 'Legal Practice & Justice',
          category_description: `Films and series exploring legal practice, justice, and the law relevant to ${programName}`,
          order_index: 0,
          content: [
            {
              id: 'content-law-1',
              title: 'To Kill a Mockingbird',
              content_type: 'movie',
              release_year: 1962,
              genre: 'Crime, Drama',
              description: 'A lawyer\'s advice to his children as he defends the real mockingbird of Harper Lee\'s classic novel',
              imdb_rating: 8.2,
              duration: '2h 9m',
              trailer_url: 'https://youtube.com/watch?v=ej3ioOneTy8',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: `Explores themes of justice, moral courage, and legal ethics central to ${programName}`,
              key_themes: ['Justice', 'Legal Ethics', 'Moral Courage', 'Social Justice'],
              educational_value: `Demonstrates the importance of integrity and justice in ${programName}`,
              order_index: 0,
              streaming_platforms: []
            },
            {
              id: 'content-law-2',
              title: 'Better Call Saul',
              content_type: 'series',
              release_year: 2015,
              genre: 'Crime, Drama',
              description: 'The trials and tribulations of criminal lawyer Jimmy McGill in the time before he established his strip-mall law office',
              imdb_rating: 8.8,
              duration: '6 seasons, 63 episodes',
              trailer_url: 'https://youtube.com/watch?v=ej3ioOneTy8',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: 'Shows the complexities of legal practice and ethical decision-making',
              key_themes: ['Legal Practice', 'Ethics', 'Professional Development', 'Criminal Law'],
              educational_value: 'Explores the challenges and ethical dilemmas in legal practice',
              order_index: 1,
              streaming_platforms: []
            }
          ]
        }
      ];
    } else if (name.includes('psychology')) {
      return [
        {
          id: 'cat-psy-1',
          category_name: 'Human Psychology & Behavior',
          category_description: `Films exploring human psychology, mental health, and behavioral science relevant to ${programName}`,
          order_index: 0,
          content: [
            {
              id: 'content-psy-1',
              title: 'Good Will Hunting',
              content_type: 'movie',
              release_year: 1997,
              genre: 'Drama, Romance',
              description: 'Will Hunting, a janitor at M.I.T., has a gift for mathematics, but needs help from a psychologist to find direction in his life',
              imdb_rating: 8.3,
              duration: '2h 6m',
              trailer_url: 'https://youtube.com/watch?v=ej3ioOneTy8',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: `Explores therapeutic relationships and psychological healing relevant to ${programName}`,
              key_themes: ['Therapy', 'Mental Health', 'Personal Growth', 'Psychology'],
              educational_value: `Demonstrates the power of psychological intervention and therapeutic relationships`,
              order_index: 0,
              streaming_platforms: []
            },
            {
              id: 'content-psy-2',
              title: 'A Beautiful Mind',
              content_type: 'movie',
              release_year: 2001,
              genre: 'Biography, Drama',
              description: 'After John Nash, a brilliant but asocial mathematician, accepts secret work in cryptography, his life takes a turn for the nightmarish',
              imdb_rating: 8.2,
              duration: '2h 15m',
              trailer_url: 'https://youtube.com/watch?v=ej3ioOneTy8',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: 'Explores mental illness, treatment, and the human mind',
              key_themes: ['Mental Illness', 'Treatment', 'Genius', 'Psychology'],
              educational_value: 'Provides insight into schizophrenia and mental health treatment',
              order_index: 1,
              streaming_platforms: []
            }
          ]
        }
      ];
    } else {
      // Generic categories for other programs
      return [
        {
          id: 'cat-gen-1',
          category_name: `${programName} Inspiration`,
          category_description: `Inspiring content related to ${programName} and career success`,
          order_index: 0,
          content: [
            {
              id: 'content-gen-1',
              title: `The Story of ${programName}`,
              content_type: 'documentary',
              release_year: 2020,
              genre: 'Documentary',
              description: `A comprehensive look at the field of ${programName.toLowerCase()} and its impact on society`,
              imdb_rating: 7.5,
              duration: '1h 30m',
              trailer_url: 'https://youtube.com/watch?v=ej3ioOneTy8',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: `Provides comprehensive overview of ${programName} field and career opportunities`,
              key_themes: [programName, 'Career Development', 'Innovation', 'Professional Growth'],
              educational_value: `Offers insights into ${programName} applications and career paths`,
              order_index: 0,
              streaming_platforms: []
            }
          ]
        },
        {
          id: 'cat-gen-2',
          category_name: 'Professional Success Stories',
          category_description: `Stories of professional achievement and success in various fields including ${programName}`,
          order_index: 1,
          content: [
            {
              id: 'content-gen-2',
              title: 'The Pursuit of Excellence',
              content_type: 'documentary',
              release_year: 2019,
              genre: 'Documentary',
              description: 'Stories of individuals who achieved excellence in their chosen fields',
              imdb_rating: 7.8,
              duration: '1h 45m',
              trailer_url: 'https://youtube.com/watch?v=ej3ioOneTy8',
              poster_image_url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
              relevance_explanation: 'Shows how dedication and hard work lead to professional success',
              key_themes: ['Success', 'Excellence', 'Professional Growth', 'Achievement'],
              educational_value: 'Demonstrates principles of success applicable to any field',
              order_index: 0,
              streaming_platforms: []
            }
          ]
        }
      ];
    }
  };

  const filterContent = () => {
    let filtered = categories.map(category => ({
      ...category,
      content: category.content.filter(content => {
        const matchesSearch = searchQuery.trim() === '' || 
          content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.key_themes.some(theme => theme.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType = selectedContentType === 'all' || content.content_type === selectedContentType;

        return matchesSearch && matchesType;
      })
    })).filter(category => category.content.length > 0);

    setFilteredCategories(filtered);
  };

  const openTrailer = (url: string) => {
    Linking.openURL(url);
  };

  const openStreamingPlatform = (url: string) => {
    Linking.openURL(url);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'movie': return Film;
      case 'series': return Tv;
      case 'documentary': return BookOpen;
      default: return Monitor;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'movie': return '#3B82F6';
      case 'series': return '#10B981';
      case 'documentary': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading inspirational entertainment...</Text>
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

  const contentTypes = [
    { key: 'all', label: 'All Content', count: categories.reduce((sum, cat) => sum + cat.content.length, 0) },
    { key: 'movie', label: 'Movies', count: categories.reduce((sum, cat) => sum + cat.content.filter(c => c.content_type === 'movie').length, 0) },
    { key: 'series', label: 'Series', count: categories.reduce((sum, cat) => sum + cat.content.filter(c => c.content_type === 'series').length, 0) },
    { key: 'documentary', label: 'Documentaries', count: categories.reduce((sum, cat) => sum + cat.content.filter(c => c.content_type === 'documentary').length, 0) }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.programName}>Inspirational Entertainment</Text>
            <Text style={styles.universityName}>{program.name} - {program.universities?.name}</Text>
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies, series, or themes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {contentTypes.map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[styles.filterButton, selectedContentType === type.key && styles.filterButtonActive]}
                onPress={() => setSelectedContentType(type.key)}
              >
                <Text style={[styles.filterText, selectedContentType === type.key && styles.filterTextActive]}>
                  {type.label} ({type.count})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.introSection}>
          <Film size={24} color="#3B82F6" />
          <Text style={styles.introTitle}>Movies & Series for {program.name}</Text>
          <Text style={styles.introText}>
            Discover inspiring movies and series that showcase different aspects of {program.name}. 
            Each category features carefully curated content with educational value and entertainment.
          </Text>
        </View>

        {filteredCategories.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleCategoryExpansion(category.id)}
            >
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>{category.category_name}</Text>
                <Text style={styles.categoryDescription}>{category.category_description}</Text>
                <Text style={styles.categoryCount}>{category.content.length} titles</Text>
              </View>
              {expandedCategories.has(category.id) ? (
                <ChevronUp size={24} color="#6B7280" />
              ) : (
                <ChevronDown size={24} color="#6B7280" />
              )}
            </TouchableOpacity>

            {expandedCategories.has(category.id) && (
              <View style={styles.contentGrid}>
                {category.content.map((content) => (
                  <View key={content.id} style={styles.contentCard}>
                    <View style={styles.contentHeader}>
                      <Image 
                        source={{ uri: content.poster_image_url }} 
                        style={styles.posterImage}
                        defaultSource={{ uri: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg' }}
                      />
                      <View style={styles.contentInfo}>
                        <View style={styles.titleRow}>
                          <Text style={styles.contentTitle}>{content.title}</Text>
                          <View style={[styles.typeBadge, { backgroundColor: `${getContentTypeColor(content.content_type)}15` }]}>
                            {React.createElement(getContentTypeIcon(content.content_type), { 
                              size: 12, 
                              color: getContentTypeColor(content.content_type) 
                            })}
                            <Text style={[styles.typeText, { color: getContentTypeColor(content.content_type) }]}>
                              {content.content_type}
                            </Text>
                          </View>
                        </View>
                        
                        <View style={styles.metaInfo}>
                          <Text style={styles.releaseYear}>{content.release_year}</Text>
                          <Text style={styles.genre}>{content.genre}</Text>
                          <View style={styles.ratingContainer}>
                            <Star size={14} color="#F59E0B" />
                            <Text style={styles.rating}>{content.imdb_rating.toFixed(1)}</Text>
                          </View>
                        </View>

                        <Text style={styles.duration}>{content.duration}</Text>
                        <Text style={styles.description} numberOfLines={3}>{content.description}</Text>
                      </View>
                    </View>

                    <View style={styles.relevanceSection}>
                      <Text style={styles.relevanceTitle}>Why it's relevant:</Text>
                      <Text style={styles.relevanceText}>{content.relevance_explanation}</Text>
                    </View>

                    <View style={styles.themesSection}>
                      <Text style={styles.themesTitle}>Key Themes:</Text>
                      <View style={styles.themesContainer}>
                        {content.key_themes.map((theme, index) => (
                          <View key={index} style={styles.themeTag}>
                            <Text style={styles.themeText}>{theme}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View style={styles.educationalSection}>
                      <Text style={styles.educationalTitle}>Educational Value:</Text>
                      <Text style={styles.educationalText}>{content.educational_value}</Text>
                    </View>

                    <View style={styles.streamingSection}>
                      <Text style={styles.streamingTitle}>Where to Watch:</Text>
                      <View style={styles.platformsList}>
                        {content.streaming_platforms.map((platform) => (
                          <TouchableOpacity
                            key={platform.id}
                            style={styles.platformCard}
                            onPress={() => openStreamingPlatform(platform.platform_url)}
                          >
                            <View style={styles.platformInfo}>
                              <Text style={styles.platformName}>{platform.platform_name}</Text>
                              <Text style={styles.platformRegion}>{platform.availability_region}</Text>
                              {platform.subscription_required ? (
                                <Text style={styles.subscriptionText}>Subscription Required</Text>
                              ) : (
                                <View style={styles.pricingInfo}>
                                  {platform.rental_price && (
                                    <Text style={styles.priceText}>Rent: {platform.rental_price}</Text>
                                  )}
                                  {platform.purchase_price && (
                                    <Text style={styles.priceText}>Buy: {platform.purchase_price}</Text>
                                  )}
                                </View>
                              )}
                            </View>
                            <ExternalLink size={16} color="#9CA3AF" />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.trailerButton}
                        onPress={() => openTrailer(content.trailer_url)}
                      >
                        <Play size={16} color="#FFFFFF" />
                        <Text style={styles.trailerButtonText}>Watch Trailer</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
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
  categorySection: {
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
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  categoryDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 6,
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  contentGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  contentCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contentHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  posterImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  contentInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  contentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  typeText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  releaseYear: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  genre: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  duration: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 18,
  },
  relevanceSection: {
    marginBottom: 12,
  },
  relevanceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  relevanceText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 18,
  },
  themesSection: {
    marginBottom: 12,
  },
  themesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  themeTag: {
    backgroundColor: '#3B82F615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  themeText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  educationalSection: {
    marginBottom: 16,
  },
  educationalTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  educationalText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 18,
  },
  streamingSection: {
    marginBottom: 16,
  },
  streamingTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  platformsList: {
    gap: 8,
  },
  platformCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  platformRegion: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  subscriptionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  pricingInfo: {
    flexDirection: 'row',
    gap: 8,
  },
  priceText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  trailerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  trailerButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});