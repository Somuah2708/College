import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  ExternalLink, 
  Target, 
  ChevronDown,
  ChevronUp,
  BookOpen,
  Globe
} from 'lucide-react-native';

interface SkillVideo {
  id: string;
  title: string;
  youtube_url: string;
  thumbnail_url: string;
  description: string;
  duration: string;
  order_index: number;
}

interface SkillResource {
  id: string;
  resource_title: string;
  resource_url: string;
  resource_type: string;
  order_index: number;
}

interface ProgramSkill {
  id: string;
  skill_name: string;
  skill_description: string;
  order_index: number;
  resources: SkillResource[];
  videos: SkillVideo[];
}

interface ProgramDetails {
  id: string;
  name: string;
  universities?: {
    name: string;
    location: string;
  };
}

export default function GraduateSkillsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [skills, setSkills] = useState<ProgramSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSkillsData();
  }, [id]);

  const fetchSkillsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching graduate skills for program ID:', id);
      
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

      console.log('Program details loaded:', programData);
      setProgram(programData);

      // Generate program-specific skills based on the actual program
      const programSpecificSkills = generateSkillsForProgram(programData);
      setSkills(programSpecificSkills);
    } catch (err) {
      console.error('Error fetching graduate skills:', err);
      setError('Failed to load graduate skills information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateSkillsForProgram = (programData: any): ProgramSkill[] => {
    const programName = programData.name.toLowerCase();
    const department = (programData.department || '').toLowerCase();
    
    // Base skills that apply to most programs
    const baseSkills: ProgramSkill[] = [
      {
        id: 'skill-base-1',
        skill_name: 'Critical Thinking & Problem Solving',
        skill_description: `Develop analytical thinking skills to break down complex problems in ${programData.name} and develop effective solutions.`,
        order_index: 0,
        resources: [
          { id: 'res-1', resource_title: 'Critical Thinking Web', resource_url: 'https://philosophy.hku.hk/think', resource_type: 'course', resource_description: 'Free online critical thinking course', order_index: 0 },
          { id: 'res-2', resource_title: 'Coursera Critical Thinking', resource_url: 'https://coursera.org/learn/critical-thinking', resource_type: 'course', resource_description: 'University-level critical thinking course', order_index: 1 },
          { id: 'res-3', resource_title: 'Khan Academy Logic', resource_url: 'https://khanacademy.org/computing/computer-science', resource_type: 'course', resource_description: 'Logic and reasoning fundamentals', order_index: 2 }
        ],
        videos: Array.from({ length: 10 }, (_, index) => ({
          id: `critical-video-${index + 1}`,
          title: `Critical Thinking in ${programData.name} - Part ${index + 1}`,
          youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index}`,
          thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
          description: `Develop critical thinking skills for ${programData.name} - Part ${index + 1}`,
          duration: `${Math.floor(Math.random() * 20) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          order_index: index
        }))
      },
      {
        id: 'skill-base-2',
        skill_name: 'Research & Information Literacy',
        skill_description: `Master research methodologies and information evaluation skills essential for success in ${programData.name}.`,
        order_index: 1,
        resources: [
          { id: 'res-4', resource_title: 'Google Scholar', resource_url: 'https://scholar.google.com', resource_type: 'database', resource_description: 'Academic research database', order_index: 0 },
          { id: 'res-5', resource_title: 'Research Methods Guide', resource_url: 'https://libguides.com/research-methods', resource_type: 'guide', resource_description: 'Comprehensive research methodology guide', order_index: 1 },
          { id: 'res-6', resource_title: 'Citation Management', resource_url: 'https://zotero.org', resource_type: 'tool', resource_description: 'Reference management software', order_index: 2 }
        ],
        videos: Array.from({ length: 8 }, (_, index) => ({
          id: `research-video-${index + 1}`,
          title: `Research Skills for ${programData.name} Students - Episode ${index + 1}`,
          youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 100}`,
          thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
          description: `Learn research methodologies for ${programData.name} - Episode ${index + 1}`,
          duration: `${Math.floor(Math.random() * 25) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          order_index: index
        }))
      }
    ];

    // Program-specific skills based on the program name and department
    let programSpecificSkills: ProgramSkill[] = [];

    if (programName.includes('computer science') || programName.includes('software') || department.includes('computer')) {
      programSpecificSkills = [
        {
          id: 'skill-cs-1',
          skill_name: 'Programming & Software Development',
          skill_description: 'Proficiency in multiple programming languages, software design patterns, and development methodologies.',
          order_index: 2,
          resources: [
            { id: 'res-cs-1', resource_title: 'Mozilla Developer Network', resource_url: 'https://developer.mozilla.org', resource_type: 'documentation', resource_description: 'Web development documentation', order_index: 0 },
            { id: 'res-cs-2', resource_title: 'GitHub Learning Lab', resource_url: 'https://lab.github.com', resource_type: 'tutorial', resource_description: 'Git and GitHub tutorials', order_index: 1 },
            { id: 'res-cs-3', resource_title: 'LeetCode', resource_url: 'https://leetcode.com', resource_type: 'practice', resource_description: 'Coding practice platform', order_index: 2 }
          ],
          videos: Array.from({ length: 15 }, (_, index) => ({
            id: `cs-video-${index + 1}`,
            title: `Programming Fundamentals - Part ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 200}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            description: `Learn programming concepts - Part ${index + 1}`,
            duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            order_index: index
          }))
        },
        {
          id: 'skill-cs-2',
          skill_name: 'Data Structures & Algorithms',
          skill_description: 'Understanding of fundamental data structures and algorithmic problem-solving techniques.',
          order_index: 3,
          resources: [
            { id: 'res-cs-4', resource_title: 'GeeksforGeeks', resource_url: 'https://geeksforgeeks.org', resource_type: 'tutorial', resource_description: 'Programming tutorials and practice', order_index: 0 },
            { id: 'res-cs-5', resource_title: 'Algorithm Visualizer', resource_url: 'https://algorithm-visualizer.org', resource_type: 'tool', resource_description: 'Visual algorithm learning', order_index: 1 }
          ],
          videos: Array.from({ length: 12 }, (_, index) => ({
            id: `algo-video-${index + 1}`,
            title: `Data Structures & Algorithms - Episode ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 300}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            description: `Master algorithms and data structures - Episode ${index + 1}`,
            duration: `${Math.floor(Math.random() * 25) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            order_index: index
          }))
        }
      ];
    } else if (programName.includes('business') || programName.includes('management') || department.includes('business')) {
      programSpecificSkills = [
        {
          id: 'skill-bus-1',
          skill_name: 'Strategic Planning & Analysis',
          skill_description: 'Develop strategic thinking skills for business planning, market analysis, and competitive positioning.',
          order_index: 2,
          resources: [
            { id: 'res-bus-1', resource_title: 'Harvard Business Review', resource_url: 'https://hbr.org', resource_type: 'publication', resource_description: 'Business strategy insights', order_index: 0 },
            { id: 'res-bus-2', resource_title: 'McKinsey Insights', resource_url: 'https://mckinsey.com/insights', resource_type: 'publication', resource_description: 'Management consulting insights', order_index: 1 },
            { id: 'res-bus-3', resource_title: 'Business Model Canvas', resource_url: 'https://strategyzer.com', resource_type: 'tool', resource_description: 'Business model design tool', order_index: 2 }
          ],
          videos: Array.from({ length: 12 }, (_, index) => ({
            id: `bus-video-${index + 1}`,
            title: `Business Strategy & Planning - Module ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 400}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            description: `Learn business strategy fundamentals - Module ${index + 1}`,
            duration: `${Math.floor(Math.random() * 30) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            order_index: index
          }))
        },
        {
          id: 'skill-bus-2',
          skill_name: 'Financial Analysis & Management',
          skill_description: 'Master financial analysis, budgeting, and investment decision-making skills.',
          order_index: 3,
          resources: [
            { id: 'res-bus-4', resource_title: 'Investopedia', resource_url: 'https://investopedia.com', resource_type: 'education', resource_description: 'Financial education resource', order_index: 0 },
            { id: 'res-bus-5', resource_title: 'Excel Financial Modeling', resource_url: 'https://microsoft.com/excel', resource_type: 'tool', resource_description: 'Financial modeling software', order_index: 1 }
          ],
          videos: Array.from({ length: 10 }, (_, index) => ({
            id: `fin-video-${index + 1}`,
            title: `Financial Analysis for Business - Session ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 500}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            description: `Learn financial analysis techniques - Session ${index + 1}`,
            duration: `${Math.floor(Math.random() * 28) + 12}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            order_index: index
          }))
        }
      ];
    } else if (programName.includes('engineering') || department.includes('engineering')) {
      programSpecificSkills = [
        {
          id: 'skill-eng-1',
          skill_name: 'Technical Design & Analysis',
          skill_description: 'Develop engineering design skills, technical analysis, and system optimization capabilities.',
          order_index: 2,
          resources: [
            { id: 'res-eng-1', resource_title: 'AutoCAD Learning', resource_url: 'https://autodesk.com/education', resource_type: 'software', resource_description: 'Engineering design software', order_index: 0 },
            { id: 'res-eng-2', resource_title: 'Engineering Toolbox', resource_url: 'https://engineeringtoolbox.com', resource_type: 'reference', resource_description: 'Engineering calculations and references', order_index: 1 },
            { id: 'res-eng-3', resource_title: 'MATLAB Training', resource_url: 'https://mathworks.com/learn', resource_type: 'software', resource_description: 'Technical computing platform', order_index: 2 }
          ],
          videos: Array.from({ length: 14 }, (_, index) => ({
            id: `eng-video-${index + 1}`,
            title: `Engineering Design Principles - Chapter ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 600}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            description: `Learn engineering design and analysis - Chapter ${index + 1}`,
            duration: `${Math.floor(Math.random() * 25) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            order_index: index
          }))
        },
        {
          id: 'skill-eng-2',
          skill_name: 'Project Management & Teamwork',
          skill_description: 'Learn to manage engineering projects, coordinate teams, and deliver solutions on time and within budget.',
          order_index: 3,
          resources: [
            { id: 'res-eng-4', resource_title: 'Project Management Institute', resource_url: 'https://pmi.org', resource_type: 'certification', resource_description: 'Professional project management resources', order_index: 0 },
            { id: 'res-eng-5', resource_title: 'Gantt Chart Tools', resource_url: 'https://gantt.com', resource_type: 'tool', resource_description: 'Project planning and scheduling', order_index: 1 }
          ],
          videos: Array.from({ length: 8 }, (_, index) => ({
            id: `pm-video-${index + 1}`,
            title: `Engineering Project Management - Module ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 700}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            description: `Master project management for engineers - Module ${index + 1}`,
            duration: `${Math.floor(Math.random() * 22) + 12}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            order_index: index
          }))
        }
      ];
    } else if (programName.includes('medicine') || programName.includes('health') || department.includes('medicine')) {
      programSpecificSkills = [
        {
          id: 'skill-med-1',
          skill_name: 'Clinical Reasoning & Diagnosis',
          skill_description: 'Develop clinical thinking skills for patient assessment, diagnosis, and treatment planning.',
          order_index: 2,
          resources: [
            { id: 'res-med-1', resource_title: 'PubMed Database', resource_url: 'https://pubmed.ncbi.nlm.nih.gov', resource_type: 'database', resource_description: 'Medical research database', order_index: 0 },
            { id: 'res-med-2', resource_title: 'Medical Education Resources', resource_url: 'https://mededportal.org', resource_type: 'education', resource_description: 'Medical education materials', order_index: 1 },
            { id: 'res-med-3', resource_title: 'Clinical Skills Video Series', resource_url: 'https://clinicalskillsvideo.com', resource_type: 'video', resource_description: 'Clinical procedures and techniques', order_index: 2 }
          ],
          videos: Array.from({ length: 16 }, (_, index) => ({
            id: `med-video-${index + 1}`,
            title: `Clinical Skills Development - Session ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 800}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            description: `Develop clinical reasoning skills - Session ${index + 1}`,
            duration: `${Math.floor(Math.random() * 35) + 15}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            order_index: index
          }))
        }
      ];
    } else if (programName.includes('law') || department.includes('law')) {
      programSpecificSkills = [
        {
          id: 'skill-law-1',
          skill_name: 'Legal Research & Writing',
          skill_description: 'Master legal research methodologies, case analysis, and legal writing techniques.',
          order_index: 2,
          resources: [
            { id: 'res-law-1', resource_title: 'Legal Research Guide', resource_url: 'https://law.georgetown.edu/library', resource_type: 'guide', resource_description: 'Comprehensive legal research guide', order_index: 0 },
            { id: 'res-law-2', resource_title: 'Case Law Database', resource_url: 'https://caselaw.findlaw.com', resource_type: 'database', resource_description: 'Legal case database', order_index: 1 },
            { id: 'res-law-3', resource_title: 'Legal Writing Resources', resource_url: 'https://legalwriting.net', resource_type: 'guide', resource_description: 'Legal writing techniques', order_index: 2 }
          ],
          videos: Array.from({ length: 12 }, (_, index) => ({
            id: `law-video-${index + 1}`,
            title: `Legal Research & Writing - Module ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 900}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            description: `Master legal research and writing - Module ${index + 1}`,
            duration: `${Math.floor(Math.random() * 30) + 12}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            order_index: index
          }))
        }
      ];
    } else if (programName.includes('psychology') || department.includes('psychology')) {
      programSpecificSkills = [
        {
          id: 'skill-psy-1',
          skill_name: 'Psychological Assessment & Analysis',
          skill_description: 'Develop skills in psychological testing, behavioral analysis, and research methodologies.',
          order_index: 2,
          resources: [
            { id: 'res-psy-1', resource_title: 'APA Style Guide', resource_url: 'https://apastyle.apa.org', resource_type: 'guide', resource_description: 'Academic writing standards', order_index: 0 },
            { id: 'res-psy-2', resource_title: 'PsycINFO Database', resource_url: 'https://psycnet.apa.org', resource_type: 'database', resource_description: 'Psychology research database', order_index: 1 },
            { id: 'res-psy-3', resource_title: 'SPSS Training', resource_url: 'https://ibm.com/spss', resource_type: 'software', resource_description: 'Statistical analysis software', order_index: 2 }
          ],
          videos: Array.from({ length: 10 }, (_, index) => ({
            id: `psy-video-${index + 1}`,
            title: `Psychology Research Methods - Part ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 1000}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            description: `Learn psychology research methods - Part ${index + 1}`,
            duration: `${Math.floor(Math.random() * 25) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            order_index: index
          }))
        }
      ];
    } else {
      // Generic skills for other programs
      programSpecificSkills = [
        {
          id: 'skill-gen-1',
          skill_name: `${programData.name} Fundamentals`,
          skill_description: `Core knowledge and practical skills essential for success in ${programData.name}.`,
          order_index: 2,
          resources: [
            { id: 'res-gen-1', resource_title: `${programData.name} Online Courses`, resource_url: `https://coursera.org/search?query=${encodeURIComponent(programData.name)}`, resource_type: 'course', resource_description: `Online courses in ${programData.name}`, order_index: 0 },
            { id: 'res-gen-2', resource_title: `${programData.name} Textbooks`, resource_url: `https://amazon.com/s?k=${encodeURIComponent(programData.name + ' textbook')}`, resource_type: 'book', resource_description: `Academic textbooks for ${programData.name}`, order_index: 1 },
            { id: 'res-gen-3', resource_title: `${programData.name} Professional Association`, resource_url: `https://google.com/search?q=${encodeURIComponent(programData.name + ' professional association')}`, resource_type: 'organization', resource_description: `Professional organizations in ${programData.name}`, order_index: 2 }
          ],
          videos: Array.from({ length: 10 }, (_, index) => ({
            id: `gen-video-${index + 1}`,
            title: `${programData.name} Essentials - Part ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 1100}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            description: `Learn ${programData.name} fundamentals - Part ${index + 1}`,
            duration: `${Math.floor(Math.random() * 20) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            order_index: index
          }))
        },
        {
          id: 'skill-gen-2',
          skill_name: `Professional Practice in ${programData.name}`,
          skill_description: `Understand professional standards, ethics, and best practices in the ${programData.name} field.`,
          order_index: 3,
          resources: [
            { id: 'res-gen-4', resource_title: `${programData.name} Career Guide`, resource_url: `https://indeed.com/career-advice/${encodeURIComponent(programData.name.toLowerCase().replace(/\s+/g, '-'))}`, resource_type: 'guide', resource_description: `Career guidance for ${programData.name}`, order_index: 0 },
            { id: 'res-gen-5', resource_title: `${programData.name} Industry News`, resource_url: `https://google.com/search?q=${encodeURIComponent(programData.name + ' industry news')}`, resource_type: 'news', resource_description: `Latest industry developments`, order_index: 1 }
          ],
          videos: Array.from({ length: 8 }, (_, index) => ({
            id: `prof-video-${index + 1}`,
            title: `Professional ${programData.name} Practice - Episode ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 1200}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            description: `Learn professional practices in ${programData.name} - Episode ${index + 1}`,
            duration: `${Math.floor(Math.random() * 25) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            order_index: index
          }))
        }
      ];
    }

    // Combine base skills with program-specific skills
    return [...baseSkills, ...programSpecificSkills];
  };


  const openYouTubeVideo = (url: string) => {
    Linking.openURL(url);
  };

  const openExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  const toggleSkillExpansion = (skillId: string) => {
    const newExpanded = new Set(expandedSkills);
    if (newExpanded.has(skillId)) {
      newExpanded.delete(skillId);
    } else {
      newExpanded.add(skillId);
    }
    setExpandedSkills(newExpanded);
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'documentation': return BookOpen;
      case 'course': return Target;
      case 'tutorial': return Play;
      default: return Globe;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'documentation': return '#3B82F6';
      case 'course': return '#10B981';
      case 'tutorial': return '#8B5CF6';
      case 'practice': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading graduate skills...</Text>
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
            <Text style={styles.programName}>Graduate Skills</Text>
            <Text style={styles.universityName}>{program.name} - {program.universities?.name}</Text>
          </View>
        </View>

        <View style={styles.introSection}>
          <Target size={24} color="#3B82F6" />
          <Text style={styles.introTitle}>Critical Skills You'll Develop</Text>
          <Text style={styles.introText}>
            These are the essential skills and competencies you'll master throughout your {program.name} program, 
            preparing you for success in your chosen career path.
          </Text>
        </View>

        {skills.map((skill) => (
          <View key={skill.id} style={styles.skillCard}>
            <TouchableOpacity
              style={styles.skillHeader}
              onPress={() => toggleSkillExpansion(skill.id)}
            >
              <View style={styles.skillInfo}>
                <Text style={styles.skillName}>{skill.skill_name}</Text>
                <Text style={styles.skillDescription}>{skill.skill_description}</Text>
              </View>
              {expandedSkills.has(skill.id) ? (
                <ChevronUp size={24} color="#6B7280" />
              ) : (
                <ChevronDown size={24} color="#6B7280" />
              )}
            </TouchableOpacity>

            {expandedSkills.has(skill.id) && (
              <View style={styles.skillContent}>
                {/* Resources Section */}
                <View style={styles.resourcesSection}>
                  <View style={styles.sectionHeader}>
                    <ExternalLink size={20} color="#10B981" />
                    <Text style={styles.sectionTitle}>Learning Resources</Text>
                  </View>
                  <View style={styles.resourcesList}>
                    {skill.resources.map((resource) => {
                      const IconComponent = getResourceTypeIcon(resource.resource_type);
                      const iconColor = getResourceTypeColor(resource.resource_type);
                      
                      return (
                        <TouchableOpacity
                          key={resource.id}
                          style={styles.resourceCard}
                          onPress={() => openExternalLink(resource.resource_url)}
                        >
                          <View style={[styles.resourceIcon, { backgroundColor: `${iconColor}15` }]}>
                            <IconComponent size={16} color={iconColor} />
                          </View>
                          <View style={styles.resourceInfo}>
                            <Text style={styles.resourceTitle}>{resource.resource_title}</Text>
                            <Text style={styles.resourceType}>{resource.resource_type}</Text>
                          </View>
                          <ExternalLink size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Videos Section */}
                <View style={styles.videosSection}>
                  <View style={styles.sectionHeader}>
                    <Play size={20} color="#EF4444" />
                    <Text style={styles.sectionTitle}>Video Tutorials</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
                    {skill.videos.map((video) => (
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
                        </View>
                        <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
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
  skillCard: {
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
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  skillDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  skillContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resourcesSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
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
  },
  resourceType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  videosSection: {
    marginTop: 8,
  },
  videosContainer: {
    marginTop: 8,
  },
  videoCard: {
    width: 160,
    marginRight: 12,
  },
  videoThumbnail: {
    position: 'relative',
    width: '100%',
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
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
    bottom: 6,
    right: 6,
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
  videoTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginTop: 6,
    lineHeight: 16,
  },
});