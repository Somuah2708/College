import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Play, Clock, ExternalLink, Heart, Brain, DollarSign, Users, Target, Search, ListFilter as Filter, ChevronDown, ChevronUp, BookOpen, Award, CircleCheck as CheckCircle, Star, Lightbulb, TrendingUp, Shield, Smile } from 'lucide-react-native';
import { Briefcase } from 'lucide-react-native';

interface LifeSkillVideo {
  id: string;
  video_title: string;
  youtube_url: string;
  thumbnail_url: string;
  video_description: string;
  duration: string;
  instructor_name: string;
  video_category: string;
  order_index: number;
}

interface LifeSkillResource {
  id: string;
  resource_title: string;
  resource_url: string;
  resource_type: string;
  resource_description: string;
  order_index: number;
}

interface LifeSkill {
  id: string;
  skill_name: string;
  skill_category: string;
  skill_description: string;
  detailed_content: string;
  learning_objectives: any[];
  skill_level: string;
  estimated_duration: string;
  order_index: number;
  videos: LifeSkillVideo[];
  resources: LifeSkillResource[];
}

interface ProgramDetails {
  id: string;
  name: string;
  universities?: {
    name: string;
    location: string;
  };
}

export default function LifeSkillsLabScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [lifeSkills, setLifeSkills] = useState<LifeSkill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<LifeSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchLifeSkillsData();
  }, [id]);

  useEffect(() => {
    filterSkills();
  }, [searchQuery, selectedCategory, lifeSkills]);

  const fetchLifeSkillsData = async () => {
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

      // Generate program-specific life skills
      const programLifeSkills: LifeSkill[] = generateLifeSkillsForProgram(actualProgram.name);

      setProgram(actualProgram);
      setLifeSkills(programLifeSkills);
      setFilteredSkills(programLifeSkills);
    } catch (err) {
      setError('Failed to load life skills information');
    } finally {
      setLoading(false);
    }
  };

  const generateLifeSkillsForProgram = (programName: string): LifeSkill[] => {
    const name = programName.toLowerCase();
    
    // Base life skills that apply to all programs
    const baseSkills: LifeSkill[] = [
        {
          id: 'skill-1',
          skill_name: 'Emotional Intelligence & Self-Awareness',
          skill_category: 'emotional_intelligence',
          skill_description: `Develop emotional intelligence to better understand and manage your emotions while building stronger relationships in your ${programName.toLowerCase()} career.`,
          detailed_content: `Emotional intelligence is crucial for success in ${programName.toLowerCase()} and professional life. This comprehensive course covers self-awareness, self-regulation, empathy, and social skills specifically relevant to ${programName.toLowerCase()} professionals.`,
          learning_objectives: [
            'Understand the four domains of emotional intelligence',
            'Develop self-awareness and emotional regulation techniques',
            'Improve empathy and social awareness skills',
            `Apply emotional intelligence in ${programName.toLowerCase()} workplace scenarios`,
            `Build stronger relationships with ${programName.toLowerCase()} colleagues and clients`
          ],
          skill_level: 'beginner',
          estimated_duration: '4-6 weeks',
          order_index: 0,
          videos: Array.from({ length: 15 }, (_, index) => ({
            id: `ei-video-${index + 1}`,
            video_title: `Emotional Intelligence for ${programName} Professionals - Part ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            video_description: `Learn essential emotional intelligence skills for ${programName.toLowerCase()} professionals - Part ${index + 1}`,
            duration: `${Math.floor(Math.random() * 20) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            instructor_name: 'Dr. Sarah Martinez',
            video_category: 'tutorial',
            order_index: index
          })),
          resources: [
            { id: 'ei-res-1', resource_title: 'Emotional Intelligence 2.0 Book', resource_url: 'https://amazon.com/emotional-intelligence-2-0', resource_type: 'book', resource_description: 'Comprehensive guide to developing emotional intelligence', order_index: 0 },
            { id: 'ei-res-2', resource_title: 'EQ Assessment Tool', resource_url: 'https://talentsmart.com/test', resource_type: 'assessment', resource_description: 'Professional emotional intelligence assessment', order_index: 1 },
            { id: 'ei-res-3', resource_title: 'Mindfulness App - Headspace', resource_url: 'https://headspace.com', resource_type: 'app', resource_description: 'Meditation and mindfulness training', order_index: 2 }
          ]
        },
        {
          id: 'skill-2',
          skill_name: `CV Writing & Resume Optimization for ${programName}`,
          skill_category: 'career_preparation',
          skill_description: `Master the art of creating compelling CVs and resumes specifically tailored for ${programName.toLowerCase()} positions.`,
          detailed_content: `A well-crafted CV is your first impression with potential ${programName.toLowerCase()} employers. This course covers modern CV writing techniques, ATS optimization, ${programName.toLowerCase()}-specific formatting, and how to effectively showcase your skills and achievements in the ${programName.toLowerCase()} field.`,
          learning_objectives: [
            `Understand modern CV formatting for ${programName.toLowerCase()} positions`,
            'Learn ATS (Applicant Tracking System) optimization techniques',
            'Master the art of quantifying achievements and impact',
            `Create ${programName.toLowerCase()}-specific CV variations`,
            `Develop compelling personal statements for ${programName.toLowerCase()} roles`,
            `Learn to effectively showcase ${programName.toLowerCase()} technical and soft skills`
          ],
          skill_level: 'beginner',
          estimated_duration: '2-3 weeks',
          order_index: 1,
          videos: Array.from({ length: 12 }, (_, index) => ({
            id: `cv-video-${index + 1}`,
            video_title: `${programName} CV Writing - Episode ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 100}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            video_description: `Master CV writing techniques for ${programName.toLowerCase()} careers - Episode ${index + 1}`,
            duration: `${Math.floor(Math.random() * 25) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            instructor_name: 'Career Coach Jennifer Lee',
            video_category: 'tutorial',
            order_index: index
          })),
          resources: [
            { id: 'cv-res-1', resource_title: `${programName} CV Templates`, resource_url: 'https://canva.com/resumes', resource_type: 'template', resource_description: `Professional CV templates for ${programName.toLowerCase()} careers`, order_index: 0 },
            { id: 'cv-res-2', resource_title: 'LinkedIn Profile Optimization', resource_url: 'https://linkedin.com/help', resource_type: 'guide', resource_description: 'Complete guide to LinkedIn profile optimization', order_index: 1 },
            { id: 'cv-res-3', resource_title: 'ATS Resume Checker', resource_url: 'https://jobscan.co', resource_type: 'tool', resource_description: 'Check if your resume is ATS-friendly', order_index: 2 }
          ]
        },
        {
          id: 'skill-3',
          skill_name: `Job Interview Mastery for ${programName}`,
          skill_category: 'career_preparation',
          skill_description: `Comprehensive interview preparation covering technical, behavioral, and ${programName.toLowerCase()}-specific interview techniques.`,
          detailed_content: `Job interviews in ${programName.toLowerCase()} can be challenging, but with proper preparation, you can excel. This course covers all types of interviews specific to ${programName.toLowerCase()} roles: technical assessments, behavioral interviews, and industry-specific questions.`,
          learning_objectives: [
            'Master the STAR method for behavioral questions',
            `Prepare for ${programName.toLowerCase()}-specific technical interviews`,
            `Research ${programName.toLowerCase()} companies and roles effectively`,
            'Develop compelling personal stories and examples',
            'Handle salary negotiations and job offers',
            'Build confidence and reduce interview anxiety'
          ],
          skill_level: 'intermediate',
          estimated_duration: '3-4 weeks',
          order_index: 2,
          videos: Array.from({ length: 18 }, (_, index) => ({
            id: `interview-video-${index + 1}`,
            video_title: `${programName} Interview Success - Session ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 200}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            video_description: `Master ${programName.toLowerCase()} interview techniques and strategies - Session ${index + 1}`,
            duration: `${Math.floor(Math.random() * 30) + 12}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            instructor_name: 'HR Expert Michael Thompson',
            video_category: 'tutorial',
            order_index: index
          })),
          resources: [
            { id: 'int-res-1', resource_title: `${programName} Interview Questions`, resource_url: 'https://glassdoor.com/interview', resource_type: 'database', resource_description: `Real interview questions from top ${programName.toLowerCase()} companies`, order_index: 0 },
            { id: 'int-res-2', resource_title: `${programName} Interview Prep`, resource_url: `https://google.com/search?q=${encodeURIComponent(programName + ' interview preparation')}`, resource_type: 'practice', resource_description: `${programName} interview practice resources`, order_index: 1 },
            { id: 'int-res-3', resource_title: 'Pramp Mock Interviews', resource_url: 'https://pramp.com', resource_type: 'practice', resource_description: 'Free peer-to-peer mock interviews', order_index: 2 }
          ]
        }
    ];

    // Program-specific skills based on program type
    let programSpecificSkills: LifeSkill[] = [];

    if (name.includes('engineering') || name.includes('computer') || name.includes('technology')) {
      programSpecificSkills = [
        {
          id: 'skill-tech-1',
          skill_name: 'Mental Health & Stress Management',
          skill_category: 'mental_health',
          skill_description: `Learn strategies for maintaining mental wellness, managing stress, and building resilience in ${programName} studies and career.`,
          detailed_content: `Mental health is fundamental to academic and professional success in ${programName}. This course provides practical tools for managing stress, anxiety, and academic pressure specific to ${programName} students. Learn mindfulness techniques, stress reduction strategies, and when to seek professional help.`,
          learning_objectives: [
            'Recognize signs of stress and mental health challenges',
            'Develop healthy coping mechanisms and stress management techniques',
            'Learn mindfulness and meditation practices',
            'Build resilience and emotional regulation skills',
            'Understand when and how to seek professional mental health support',
            `Create sustainable self-care routines for ${programName} studies`
          ],
          skill_level: 'beginner',
          estimated_duration: '4-5 weeks',
          order_index: 2,
          videos: Array.from({ length: 16 }, (_, index) => ({
            id: `mental-video-${index + 1}`,
            video_title: `Mental Wellness for ${programName} Students - Module ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 400}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            video_description: `Learn mental health strategies for ${programName} students - Module ${index + 1}`,
            duration: `${Math.floor(Math.random() * 28) + 12}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            instructor_name: 'Dr. Lisa Chen, Clinical Psychologist',
            video_category: 'tutorial',
            order_index: index
          })),
          resources: [
            { id: 'mh-res-1', resource_title: 'Headspace Meditation App', resource_url: 'https://headspace.com', resource_type: 'app', resource_description: 'Guided meditation and mindfulness exercises', order_index: 0 },
            { id: 'mh-res-2', resource_title: 'Crisis Text Line', resource_url: 'https://crisistextline.org', resource_type: 'support', resource_description: '24/7 mental health crisis support', order_index: 1 },
            { id: 'mh-res-3', resource_title: 'Mental Health First Aid', resource_url: 'https://mentalhealthfirstaid.org', resource_type: 'course', resource_description: 'Learn to help others in mental health crises', order_index: 2 }
          ]
        }
      ];
    } else if (name.includes('medicine') || name.includes('health')) {
      programSpecificSkills = [
        {
          id: 'skill-med-1',
          skill_name: 'Medical Ethics & Patient Communication',
          skill_category: 'medical_ethics',
          skill_description: 'Develop ethical reasoning and effective patient communication skills for healthcare practice.',
          detailed_content: 'Healthcare professionals face complex ethical decisions daily. This course covers medical ethics principles, patient rights, informed consent, confidentiality, and effective communication with patients and families.',
          learning_objectives: [
            'Understand medical ethics principles and frameworks',
            'Develop effective patient communication skills',
            'Navigate ethical dilemmas in healthcare',
            'Respect patient autonomy and cultural differences',
            'Maintain professional boundaries and confidentiality'
          ],
          skill_level: 'intermediate',
          estimated_duration: '5-6 weeks',
          order_index: 2,
          videos: Array.from({ length: 16 }, (_, index) => ({
            id: `med-ethics-video-${index + 1}`,
            video_title: `Medical Ethics & Communication - Session ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 500}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            video_description: `Learn medical ethics and patient communication - Session ${index + 1}`,
            duration: `${Math.floor(Math.random() * 35) + 20}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            instructor_name: 'Dr. Medical Ethics',
            video_category: 'lecture',
            order_index: index
          })),
          resources: [
            { id: 'med-res-1', resource_title: 'Medical Ethics Handbook', resource_url: 'https://ama-assn.org/delivering-care/ethics', resource_type: 'handbook', resource_description: 'AMA Code of Medical Ethics', order_index: 0 },
            { id: 'med-res-2', resource_title: 'Patient Communication Guide', resource_url: 'https://doctorpatientcommunication.org', resource_type: 'guide', resource_description: 'Effective patient communication techniques', order_index: 1 }
          ]
        }
      ];
    } else if (name.includes('law')) {
      programSpecificSkills = [
        {
          id: 'skill-law-1',
          skill_name: 'Legal Ethics & Professional Conduct',
          skill_category: 'legal_ethics',
          skill_description: 'Master legal ethics, professional responsibility, and ethical decision-making in legal practice.',
          detailed_content: 'Legal professionals must navigate complex ethical situations while maintaining professional integrity. This course covers legal ethics rules, professional conduct standards, client confidentiality, conflicts of interest, and ethical decision-making frameworks.',
          learning_objectives: [
            'Understand legal ethics rules and professional conduct standards',
            'Navigate conflicts of interest and client confidentiality',
            'Develop ethical decision-making frameworks',
            'Maintain professional integrity in legal practice',
            'Handle ethical dilemmas in various legal contexts'
          ],
          skill_level: 'intermediate',
          estimated_duration: '4-5 weeks',
          order_index: 2,
          videos: Array.from({ length: 14 }, (_, index) => ({
            id: `legal-ethics-video-${index + 1}`,
            video_title: `Legal Ethics & Professional Conduct - Part ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 600}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            video_description: `Learn legal ethics and professional conduct - Part ${index + 1}`,
            duration: `${Math.floor(Math.random() * 30) + 15}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            instructor_name: 'Prof. Legal Ethics',
            video_category: 'lecture',
            order_index: index
          })),
          resources: [
            { id: 'legal-res-1', resource_title: 'Model Rules of Professional Conduct', resource_url: 'https://americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct', resource_type: 'rules', resource_description: 'ABA Model Rules of Professional Conduct', order_index: 0 },
            { id: 'legal-res-2', resource_title: 'Legal Ethics: Law Stories', resource_url: 'https://amazon.com/Legal-Ethics-Stories-Law/dp/1599410435', resource_type: 'book', resource_description: 'Case studies in legal ethics', order_index: 1 }
          ]
        }
      ];
    } else {
      programSpecificSkills = [
        {
          id: 'skill-gen-1',
          skill_name: `Professional Development in ${programName}`,
          skill_category: 'professional_development',
          skill_description: `Develop professional skills and industry knowledge specific to ${programName} careers.`,
          detailed_content: `Professional development in ${programName} requires understanding industry trends, building relevant skills, and maintaining professional relationships. This course covers career advancement strategies, industry networking, and continuous learning approaches specific to ${programName}.`,
          learning_objectives: [
            `Understand ${programName} industry landscape and trends`,
            'Develop professional skills and competencies',
            `Build networks within ${programName} community`,
            'Create professional development plans',
            'Maintain continuous learning mindset'
          ],
          skill_level: 'intermediate',
          estimated_duration: '4-5 weeks',
          order_index: 2,
          videos: Array.from({ length: 10 }, (_, index) => ({
            id: `prof-dev-video-${index + 1}`,
            video_title: `${programName} Professional Development - Part ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 800}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            video_description: `Professional development strategies for ${programName} - Part ${index + 1}`,
            duration: `${Math.floor(Math.random() * 25) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            instructor_name: `${programName} Industry Expert`,
            video_category: 'tutorial',
            order_index: index
          })),
          resources: [
            { id: 'prof-res-1', resource_title: `${programName} Professional Association`, resource_url: `https://google.com/search?q=${encodeURIComponent(programName + ' professional association')}`, resource_type: 'organization', resource_description: `Professional organizations in ${programName}`, order_index: 0 },
            { id: 'prof-res-2', resource_title: `${programName} Industry News`, resource_url: `https://google.com/search?q=${encodeURIComponent(programName + ' industry news')}`, resource_type: 'news', resource_description: `Latest developments in ${programName}`, order_index: 1 }
          ]
        }
      ];
    }

    // Add universal life skills that apply to all programs
    const universalSkills: LifeSkill[] = [
      {
        id: 'skill-universal-1',
        skill_name: 'Financial Literacy & Money Management',
        skill_category: 'financial_literacy',
        skill_description: `Essential financial skills including budgeting, saving, investing, and managing student loans for ${programName} graduates.`,
        detailed_content: `Financial literacy is crucial for long-term success in ${programName} careers. This comprehensive course covers personal budgeting, debt management, investment basics, retirement planning, and building emergency funds. Learn to make informed financial decisions and build wealth over time in your ${programName} career.`,
        learning_objectives: [
          'Create and maintain effective personal budgets',
          'Understand different types of investments and their risks',
          'Learn strategies for paying off student loans efficiently',
          'Build emergency funds and savings plans',
          'Understand credit scores and credit management',
          `Plan for retirement and long-term financial goals in ${programName}`
        ],
        skill_level: 'beginner',
        estimated_duration: '5-6 weeks',
        order_index: 3,
        videos: Array.from({ length: 20 }, (_, index) => ({
          id: `finance-video-${index + 1}`,
          video_title: `Financial Literacy for ${programName} Graduates - Chapter ${index + 1}`,
          youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 300}`,
          thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
          video_description: `Master personal finance and money management for ${programName} careers - Chapter ${index + 1}`,
          duration: `${Math.floor(Math.random() * 35) + 15}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          instructor_name: 'Financial Advisor Robert Kim',
          video_category: 'tutorial',
          order_index: index
        })),
        resources: [
          { id: 'fin-res-1', resource_title: 'Mint Budgeting App', resource_url: 'https://mint.com', resource_type: 'app', resource_description: 'Free budgeting and expense tracking', order_index: 0 },
          { id: 'fin-res-2', resource_title: 'Khan Academy Personal Finance', resource_url: 'https://khanacademy.org/economics-finance-domain', resource_type: 'course', resource_description: 'Free comprehensive financial education', order_index: 1 },
          { id: 'fin-res-3', resource_title: 'YNAB (You Need A Budget)', resource_url: 'https://youneedabudget.com', resource_type: 'tool', resource_description: 'Advanced budgeting software and methodology', order_index: 2 }
        ]
      },
      {
        id: 'skill-universal-2',
        skill_name: 'Mental Health & Stress Management',
        skill_category: 'mental_health',
        skill_description: `Learn strategies for maintaining mental wellness, managing stress, and building resilience in ${programName} studies and career.`,
        detailed_content: `Mental health is fundamental to academic and professional success in ${programName}. This course provides practical tools for managing stress, anxiety, and academic pressure specific to ${programName} students. Learn mindfulness techniques, stress reduction strategies, and when to seek professional help.`,
        learning_objectives: [
          'Recognize signs of stress and mental health challenges',
          'Develop healthy coping mechanisms and stress management techniques',
          'Learn mindfulness and meditation practices',
          'Build resilience and emotional regulation skills',
          'Understand when and how to seek professional mental health support',
          `Create sustainable self-care routines for ${programName} studies`
        ],
        skill_level: 'beginner',
        estimated_duration: '4-5 weeks',
        order_index: 4,
        videos: Array.from({ length: 16 }, (_, index) => ({
          id: `mental-video-${index + 1}`,
          video_title: `Mental Wellness for ${programName} Students - Module ${index + 1}`,
          youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 400}`,
          thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
          video_description: `Learn mental health strategies for ${programName} students - Module ${index + 1}`,
          duration: `${Math.floor(Math.random() * 28) + 12}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          instructor_name: 'Dr. Lisa Chen, Clinical Psychologist',
          video_category: 'tutorial',
          order_index: index
        })),
        resources: [
          { id: 'mh-res-1', resource_title: 'Headspace Meditation App', resource_url: 'https://headspace.com', resource_type: 'app', resource_description: 'Guided meditation and mindfulness exercises', order_index: 0 },
          { id: 'mh-res-2', resource_title: 'Crisis Text Line', resource_url: 'https://crisistextline.org', resource_type: 'support', resource_description: '24/7 mental health crisis support', order_index: 1 },
          { id: 'mh-res-3', resource_title: 'Mental Health First Aid', resource_url: 'https://mentalhealthfirstaid.org', resource_type: 'course', resource_description: 'Learn to help others in mental health crises', order_index: 2 }
        ]
      }
    ];

    // Combine base skills, program-specific skills, and universal skills
    return [...baseSkills, ...programSpecificSkills, ...universalSkills];
  };

  const filterSkills = () => {
    let filtered = lifeSkills;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(skill =>
        skill.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.skill_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.skill_category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(skill => skill.skill_category === selectedCategory);
    }

    setFilteredSkills(filtered);
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emotional_intelligence': return Heart;
      case 'career_preparation': return Briefcase;
      case 'financial_literacy': return DollarSign;
      case 'mental_health': return Shield;
      case 'communication': return Users;
      case 'productivity': return TrendingUp;
      case 'leadership': return Star;
      case 'digital_wellness': return Brain;
      case 'cognitive_skills': return Lightbulb;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emotional_intelligence': return '#EF4444';
      case 'career_preparation': return '#3B82F6';
      case 'financial_literacy': return '#10B981';
      case 'mental_health': return '#8B5CF6';
      case 'communication': return '#F59E0B';
      case 'productivity': return '#06B6D4';
      case 'leadership': return '#EC4899';
      case 'digital_wellness': return '#84CC16';
      case 'cognitive_skills': return '#F97316';
      default: return '#6B7280';
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading life skills lab...</Text>
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
    { key: 'all', label: 'All Skills', count: lifeSkills.length },
    { key: 'emotional_intelligence', label: 'Emotional Intelligence', count: lifeSkills.filter(s => s.skill_category === 'emotional_intelligence').length },
    { key: 'career_preparation', label: 'Career Prep', count: lifeSkills.filter(s => s.skill_category === 'career_preparation').length },
    { key: 'financial_literacy', label: 'Financial Literacy', count: lifeSkills.filter(s => s.skill_category === 'financial_literacy').length },
    { key: 'mental_health', label: 'Mental Health', count: lifeSkills.filter(s => s.skill_category === 'mental_health').length },
    { key: 'communication', label: 'Communication', count: lifeSkills.filter(s => s.skill_category === 'communication').length },
    { key: 'productivity', label: 'Productivity', count: lifeSkills.filter(s => s.skill_category === 'productivity').length },
    { key: 'leadership', label: 'Leadership', count: lifeSkills.filter(s => s.skill_category === 'leadership').length }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.programName}>Life Skills Lab</Text>
            <Text style={styles.universityName}>{program.name} - {program.universities?.name}</Text>
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search life skills..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {categories.map((category) => (
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
        </View>

        <View style={styles.introSection}>
          <Brain size={24} color="#3B82F6" />
          <Text style={styles.introTitle}>Essential Life Skills for Success</Text>
          <Text style={styles.introText}>
            Develop critical life skills that complement your {program.name} education. These courses focus on personal development, 
            emotional intelligence, and practical skills for thriving in your career and personal life.
          </Text>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredSkills.length} life skills available
          </Text>
        </View>

        {filteredSkills.map((skill) => (
          <View key={skill.id} style={styles.skillCard}>
            <TouchableOpacity
              style={styles.skillHeader}
              onPress={() => toggleSkillExpansion(skill.id)}
            >
              <View style={styles.skillInfo}>
                <View style={styles.skillTitleRow}>
                  <View style={[styles.categoryIcon, { backgroundColor: `${getCategoryColor(skill.skill_category)}15` }]}>
                    {React.createElement(getCategoryIcon(skill.skill_category), { 
                      size: 20, 
                      color: getCategoryColor(skill.skill_category) 
                    })}
                  </View>
                  <View style={styles.skillTitleInfo}>
                    <Text style={styles.skillName}>{skill.skill_name}</Text>
                    <View style={styles.skillMeta}>
                      <View style={[styles.levelBadge, { backgroundColor: `${getSkillLevelColor(skill.skill_level)}15` }]}>
                        <Text style={[styles.levelText, { color: getSkillLevelColor(skill.skill_level) }]}>
                          {skill.skill_level}
                        </Text>
                      </View>
                      <Text style={styles.duration}>{skill.estimated_duration}</Text>
                    </View>
                  </View>
                </View>
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
                {/* Detailed Content */}
                <View style={styles.contentSection}>
                  <View style={styles.sectionHeader}>
                    <BookOpen size={20} color="#3B82F6" />
                    <Text style={styles.sectionTitle}>Course Overview</Text>
                  </View>
                  <Text style={styles.detailedContent}>{skill.detailed_content}</Text>
                </View>

                {/* Learning Objectives */}
                <View style={styles.objectivesSection}>
                  <View style={styles.sectionHeader}>
                    <Target size={20} color="#10B981" />
                    <Text style={styles.sectionTitle}>Learning Objectives</Text>
                  </View>
                  <View style={styles.objectivesList}>
                    {skill.learning_objectives.map((objective: string, index: number) => (
                      <View key={index} style={styles.objectiveItem}>
                        <CheckCircle size={16} color="#10B981" />
                        <Text style={styles.objectiveText}>{objective}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Video Training */}
                <View style={styles.videosSection}>
                  <View style={styles.sectionHeader}>
                    <Play size={20} color="#EF4444" />
                    <Text style={styles.sectionTitle}>Video Training ({skill.videos.length} videos)</Text>
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
                        <Text style={styles.videoTitle} numberOfLines={2}>{video.video_title}</Text>
                        <Text style={styles.instructorName}>by {video.instructor_name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Additional Resources */}
                <View style={styles.resourcesSection}>
                  <View style={styles.sectionHeader}>
                    <ExternalLink size={20} color="#8B5CF6" />
                    <Text style={styles.sectionTitle}>Additional Resources</Text>
                  </View>
                  <View style={styles.resourcesList}>
                    {skill.resources.map((resource) => (
                      <TouchableOpacity
                        key={resource.id}
                        style={styles.resourceCard}
                        onPress={() => openExternalLink(resource.resource_url)}
                      >
                        <View style={styles.resourceInfo}>
                          <Text style={styles.resourceTitle}>{resource.resource_title}</Text>
                          <Text style={styles.resourceDescription}>{resource.resource_description}</Text>
                          <Text style={styles.resourceType}>{resource.resource_type}</Text>
                        </View>
                        <ExternalLink size={16} color="#9CA3AF" />
                      </TouchableOpacity>
                    ))}
                  </View>
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
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  resultsHeader: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
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
  skillTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  skillTitleInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  skillMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  duration: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  skillDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginTop: 8,
  },
  skillContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contentSection: {
    marginBottom: 24,
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
    marginBottom: 24,
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
  videosSection: {
    marginBottom: 24,
  },
  videosContainer: {
    marginTop: 8,
  },
  videoCard: {
    width: 180,
    marginRight: 12,
  },
  videoThumbnail: {
    position: 'relative',
    width: '100%',
    height: 100,
    borderRadius: 8,
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
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  instructorName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  resourcesSection: {
    marginTop: 8,
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
  resourceType: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    textTransform: 'uppercase',
  },
});