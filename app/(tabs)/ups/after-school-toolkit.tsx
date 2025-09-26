import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Play, Clock, ExternalLink, SquareCheck as CheckSquare, Square, FileText, Users, DollarSign, Briefcase, GraduationCap, Search, ChevronDown, ChevronUp, BookOpen, Target, TriangleAlert as AlertTriangle, Star, Heart, Award, Building, Phone, Mail, Globe, Calendar, Lightbulb } from 'lucide-react-native';

interface YouTubeVideo {
  title: string;
  url: string;
  thumbnail_url: string;
  duration: string;
  channel: string;
  description: string;
}

interface ExternalResource {
  title: string;
  url: string;
  type: string;
  description: string;
}

interface ChecklistItem {
  task: string;
  description: string;
  priority: string;
  estimated_time: string;
}

interface AfterSchoolResource {
  id: string;
  resource_title: string;
  resource_category: string;
  resource_description: string;
  detailed_content: string;
  checklist_items: ChecklistItem[];
  youtube_videos: YouTubeVideo[];
  external_resources: ExternalResource[];
  tips_and_advice: string;
  common_mistakes: string;
  success_stories: string;
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

export default function AfterSchoolToolkitScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [resources, setResources] = useState<AfterSchoolResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<AfterSchoolResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAfterSchoolData();
  }, [id]);

  useEffect(() => {
    filterResources();
  }, [searchQuery, selectedCategory, resources]);

  const fetchAfterSchoolData = async () => {
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

      const mockResources: AfterSchoolResource[] = [
        {
          id: 'resource-1',
          resource_title: 'CV Writing & Resume Building',
          resource_category: 'cv_writing',
          resource_description: 'Master the art of creating compelling CVs and resumes that get you noticed by employers',
          detailed_content: 'A well-crafted CV is your first impression with potential employers. This comprehensive guide covers everything from formatting and structure to highlighting your technical skills and projects. Learn how to tailor your CV for different roles, showcase your computer science expertise, and avoid common mistakes that could cost you interviews.',
          checklist_items: [
            { task: 'Choose appropriate CV template', description: 'Select a clean, professional template suitable for tech roles', priority: 'high', estimated_time: '30 minutes' },
            { task: 'Write compelling personal statement', description: 'Craft a 2-3 line summary highlighting your key strengths', priority: 'high', estimated_time: '1 hour' },
            { task: 'List technical skills and programming languages', description: 'Organize skills by proficiency level and relevance', priority: 'high', estimated_time: '45 minutes' },
            { task: 'Detail project experiences', description: 'Include personal, academic, and professional projects', priority: 'high', estimated_time: '2 hours' },
            { task: 'Add education and certifications', description: 'Include GPA if above 3.5, relevant coursework, and certifications', priority: 'medium', estimated_time: '30 minutes' },
            { task: 'Include work experience and internships', description: 'Focus on achievements and quantifiable results', priority: 'high', estimated_time: '1.5 hours' },
            { task: 'Proofread and format consistently', description: 'Check for typos, consistent formatting, and proper spacing', priority: 'high', estimated_time: '45 minutes' },
            { task: 'Get feedback from mentors', description: 'Have experienced professionals review your CV', priority: 'medium', estimated_time: '1 hour' },
            { task: 'Create multiple versions for different roles', description: 'Tailor CV for specific job types (frontend, backend, data science)', priority: 'medium', estimated_time: '2 hours' },
            { task: 'Upload to professional platforms', description: 'Update LinkedIn, GitHub, and portfolio websites', priority: 'medium', estimated_time: '1 hour' }
          ],
          youtube_videos: [
            { title: 'How to Write a Software Engineer Resume', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '15:30', channel: 'TechCareer Pro', description: 'Complete guide to writing resumes for software engineering roles' },
            { title: 'CV Mistakes That Cost You Interviews', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '12:45', channel: 'Career Coach', description: 'Common CV mistakes and how to avoid them' },
            { title: 'Tech Resume Templates and Examples', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '18:20', channel: 'Resume Expert', description: 'Professional templates and real examples for tech roles' },
            { title: 'ATS-Friendly Resume Writing', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '14:15', channel: 'Job Search Pro', description: 'How to write resumes that pass Applicant Tracking Systems' },
            { title: 'Portfolio Integration with Resume', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '16:40', channel: 'Developer Career', description: 'Linking your portfolio effectively with your resume' }
          ],
          external_resources: [
            { title: 'Resume.io - Professional Templates', url: 'https://resume.io', type: 'tool', description: 'Professional resume builder with tech-specific templates' },
            { title: 'Harvard Career Services Resume Guide', url: 'https://ocs.fas.harvard.edu/files/ocs/files/hes-resume-cover-letter-guide.pdf', type: 'guide', description: 'Comprehensive resume writing guide from Harvard' },
            { title: 'Google Resume Tips', url: 'https://careers.google.com/how-we-hire/interview-tips/', type: 'article', description: 'Resume tips from Google recruiters' },
            { title: 'GitHub Resume Builder', url: 'https://resume.github.io', type: 'tool', description: 'Generate resume from your GitHub profile' },
            { title: 'Tech Resume Examples', url: 'https://www.indeed.com/career-advice/resumes-cover-letters/software-engineer-resume-examples', type: 'examples', description: 'Real software engineer resume examples' }
          ],
          tips_and_advice: 'Keep your CV to 1-2 pages maximum. Use action verbs and quantify your achievements wherever possible. Tailor your CV for each application, highlighting the most relevant skills and experiences. Include links to your GitHub, portfolio, and LinkedIn profiles.',
          common_mistakes: 'Using generic templates, including irrelevant information, poor formatting, typos and grammatical errors, not quantifying achievements, missing contact information, using unprofessional email addresses.',
          success_stories: 'Many graduates have landed roles at top tech companies by following these CV guidelines. One alumnus received 15 interview calls after restructuring their CV using these principles.',
          order_index: 0
        },
        {
          id: 'resource-2',
          resource_title: 'Job Interview Preparation',
          resource_category: 'interview_prep',
          resource_description: 'Comprehensive preparation for technical and behavioral interviews in the tech industry',
          detailed_content: 'Job interviews in the tech industry require preparation across multiple dimensions: technical coding challenges, system design questions, behavioral interviews, and company culture fit. This resource provides a structured approach to preparing for each type of interview, with practice problems, mock interview techniques, and strategies for handling difficult questions.',
          checklist_items: [
            { task: 'Research the company thoroughly', description: 'Study company history, products, culture, and recent news', priority: 'high', estimated_time: '2 hours' },
            { task: 'Practice coding problems daily', description: 'Solve LeetCode problems, focus on data structures and algorithms', priority: 'high', estimated_time: '2 hours daily' },
            { task: 'Prepare STAR method responses', description: 'Structure behavioral answers using Situation, Task, Action, Result', priority: 'high', estimated_time: '3 hours' },
            { task: 'Study system design fundamentals', description: 'Learn scalability, databases, caching, and distributed systems', priority: 'high', estimated_time: '4 hours' },
            { task: 'Prepare thoughtful questions to ask', description: 'Show genuine interest in the role and company', priority: 'medium', estimated_time: '1 hour' },
            { task: 'Practice mock interviews', description: 'Conduct practice sessions with peers or mentors', priority: 'high', estimated_time: '3 hours' },
            { task: 'Prepare your portfolio presentation', description: 'Be ready to walk through your best projects', priority: 'medium', estimated_time: '2 hours' },
            { task: 'Plan your interview day logistics', description: 'Know the location, timing, and what to bring', priority: 'medium', estimated_time: '30 minutes' },
            { task: 'Prepare salary negotiation strategy', description: 'Research market rates and practice negotiation', priority: 'medium', estimated_time: '2 hours' },
            { task: 'Follow up plan', description: 'Prepare thank you emails and follow-up strategy', priority: 'low', estimated_time: '30 minutes' }
          ],
          youtube_videos: [
            { title: 'Google Coding Interview - Complete Guide', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '45:20', channel: 'Tech Interview Pro', description: 'Step-by-step guide to Google-style coding interviews' },
            { title: 'System Design Interview Preparation', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '38:15', channel: 'System Design Interview', description: 'How to approach system design questions' },
            { title: 'Behavioral Interview Questions and Answers', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '25:30', channel: 'Career Success', description: 'Master behavioral interviews with STAR method' },
            { title: 'Mock Technical Interview - Facebook', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '52:10', channel: 'Interview Simulator', description: 'Real mock interview with Facebook engineer' },
            { title: 'Salary Negotiation for Software Engineers', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '22:45', channel: 'Negotiate Pro', description: 'How to negotiate your first tech job offer' }
          ],
          external_resources: [
            { title: 'LeetCode Interview Preparation', url: 'https://leetcode.com/explore/interview/', type: 'practice', description: 'Comprehensive coding interview practice platform' },
            { title: 'Pramp - Free Mock Interviews', url: 'https://pramp.com', type: 'tool', description: 'Practice interviews with peers for free' },
            { title: 'Glassdoor Interview Questions', url: 'https://glassdoor.com/Interview/', type: 'resource', description: 'Real interview questions from companies' },
            { title: 'Cracking the Coding Interview', url: 'https://amazon.com/dp/0984782850', type: 'book', description: 'Essential book for technical interview preparation' },
            { title: 'InterviewBit', url: 'https://interviewbit.com', type: 'platform', description: 'Structured interview preparation with coding challenges' }
          ],
          tips_and_advice: 'Start preparing at least 2-3 months before your job search. Practice coding problems daily, not just before interviews. Focus on explaining your thought process clearly during technical interviews. Research the company\'s tech stack and recent projects.',
          common_mistakes: 'Not practicing out loud, focusing only on coding without explaining logic, not asking clarifying questions, being unprepared for behavioral questions, not researching the company, arriving late or unprepared.',
          success_stories: 'Alumni who followed this preparation guide have successfully landed roles at FAANG companies. One graduate received offers from 5 major tech companies after 3 months of structured preparation.',
          order_index: 0
        },
        {
          id: 'resource-3',
          resource_title: 'National Service Preparation',
          resource_category: 'national_service',
          resource_description: 'Complete guide to preparing for and excelling during your national service year',
          detailed_content: 'National service is a crucial transition period between university and professional life. This guide helps you prepare mentally, professionally, and practically for your service year. Learn how to make the most of this opportunity, build professional networks, and set yourself up for career success after service.',
          checklist_items: [
            { task: 'Complete national service registration', description: 'Submit all required documents and forms on time', priority: 'high', estimated_time: '2 hours' },
            { task: 'Prepare professional wardrobe', description: 'Acquire appropriate clothing for your service placement', priority: 'medium', estimated_time: '4 hours' },
            { task: 'Research your assigned organization', description: 'Learn about the organization\'s mission, structure, and culture', priority: 'high', estimated_time: '3 hours' },
            { task: 'Set professional goals for service year', description: 'Define what you want to achieve during your service', priority: 'medium', estimated_time: '1 hour' },
            { task: 'Prepare introduction and elevator pitch', description: 'Practice introducing yourself professionally', priority: 'medium', estimated_time: '2 hours' },
            { task: 'Plan accommodation and transportation', description: 'Arrange housing and daily commute to service location', priority: 'high', estimated_time: '4 hours' },
            { task: 'Build professional network strategy', description: 'Plan how to connect with colleagues and industry professionals', priority: 'medium', estimated_time: '1 hour' },
            { task: 'Prepare for orientation week', description: 'Gather required documents and prepare mentally', priority: 'high', estimated_time: '2 hours' },
            { task: 'Set up professional social media', description: 'Update LinkedIn and clean up other social media profiles', priority: 'medium', estimated_time: '2 hours' },
            { task: 'Plan skill development activities', description: 'Identify skills to develop during service year', priority: 'low', estimated_time: '1 hour' }
          ],
          youtube_videos: [
            { title: 'National Service Success Guide', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '28:15', channel: 'Career Guidance Ghana', description: 'Complete guide to excelling during national service' },
            { title: 'Professional Networking During Service', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '20:30', channel: 'Professional Development', description: 'How to build networks during your service year' },
            { title: 'Making the Most of Your Service Year', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '22:45', channel: 'Youth Development', description: 'Strategies for personal and professional growth' },
            { title: 'From Service to Career Success', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '35:20', channel: 'Career Transition', description: 'How to leverage service experience for career advancement' }
          ],
          external_resources: [
            { title: 'National Service Scheme Official Portal', url: 'https://nss.gov.gh', type: 'official', description: 'Official information and registration portal' },
            { title: 'Service Personnel Handbook', url: 'https://nss.gov.gh/handbook', type: 'guide', description: 'Complete handbook for service personnel' },
            { title: 'Professional Development During Service', url: 'https://career-development.org/service', type: 'article', description: 'Tips for professional growth during service' },
            { title: 'Networking Guide for Young Professionals', url: 'https://networking-guide.com', type: 'guide', description: 'How to build professional networks early in career' }
          ],
          tips_and_advice: 'Approach your service year with a positive attitude and willingness to learn. Take initiative in your assigned tasks and volunteer for additional responsibilities. Build genuine relationships with colleagues and supervisors. Document your achievements and experiences for future job applications.',
          common_mistakes: 'Having a negative attitude, not taking the opportunity seriously, failing to network, not documenting achievements, missing opportunities for skill development, not maintaining professionalism.',
          success_stories: 'Many alumni have secured permanent positions at their service organizations or received strong recommendations that led to excellent job opportunities. Service year networking has been crucial for career advancement.',
          order_index: 1
        },
        {
          id: 'resource-4',
          resource_title: 'Financial Planning & Management',
          resource_category: 'financial_planning',
          resource_description: 'Essential financial literacy for new graduates entering the workforce',
          detailed_content: 'Financial planning is crucial for long-term success and security. This comprehensive guide covers budgeting, saving, investing, debt management, and building wealth as a young professional. Learn how to manage your first salary, plan for major expenses, and build a solid financial foundation for your future.',
          checklist_items: [
            { task: 'Create a monthly budget', description: 'Track income and expenses, allocate funds for different categories', priority: 'high', estimated_time: '3 hours' },
            { task: 'Open a savings account', description: 'Choose a high-yield savings account for emergency fund', priority: 'high', estimated_time: '1 hour' },
            { task: 'Build emergency fund', description: 'Save 3-6 months of living expenses', priority: 'high', estimated_time: 'Ongoing' },
            { task: 'Understand your employment benefits', description: 'Learn about health insurance, retirement plans, and other benefits', priority: 'high', estimated_time: '2 hours' },
            { task: 'Set up automatic savings', description: 'Automate transfers to savings and investment accounts', priority: 'medium', estimated_time: '1 hour' },
            { task: 'Learn about investment options', description: 'Research stocks, bonds, mutual funds, and retirement accounts', priority: 'medium', estimated_time: '4 hours' },
            { task: 'Plan for major expenses', description: 'Budget for car, housing, further education, etc.', priority: 'medium', estimated_time: '2 hours' },
            { task: 'Understand taxes and deductions', description: 'Learn about income tax, allowable deductions, and filing requirements', priority: 'high', estimated_time: '3 hours' },
            { task: 'Consider insurance needs', description: 'Evaluate health, life, and disability insurance options', priority: 'medium', estimated_time: '2 hours' },
            { task: 'Set long-term financial goals', description: 'Plan for homeownership, retirement, and other major goals', priority: 'low', estimated_time: '2 hours' }
          ],
          youtube_videos: [
            { title: 'Financial Planning for New Graduates', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '32:15', channel: 'Financial Literacy Pro', description: 'Complete financial planning guide for recent graduates' },
            { title: 'Budgeting Your First Salary', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '18:45', channel: 'Money Management', description: 'How to budget and manage your first professional salary' },
            { title: 'Investment Basics for Beginners', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '25:30', channel: 'Investment Academy', description: 'Introduction to investing for young professionals' },
            { title: 'Emergency Fund Strategy', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '15:20', channel: 'Financial Security', description: 'How to build and maintain an emergency fund' },
            { title: 'Tax Planning for Young Professionals', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '27:40', channel: 'Tax Expert', description: 'Understanding taxes and maximizing deductions' }
          ],
          external_resources: [
            { title: 'Mint - Personal Finance App', url: 'https://mint.com', type: 'tool', description: 'Free budgeting and expense tracking application' },
            { title: 'Ghana Stock Exchange Guide', url: 'https://gse.com.gh/investors-guide', type: 'guide', description: 'Introduction to investing in Ghana Stock Exchange' },
            { title: 'Bank of Ghana Financial Literacy', url: 'https://bog.gov.gh/financial-literacy', type: 'resource', description: 'Official financial education resources' },
            { title: 'Personal Finance for Dummies', url: 'https://amazon.com/dp/1119517893', type: 'book', description: 'Comprehensive personal finance guide' },
            { title: 'YNAB - Budgeting Software', url: 'https://youneedabudget.com', type: 'tool', description: 'Advanced budgeting and financial planning tool' }
          ],
          tips_and_advice: 'Start saving and investing early, even small amounts compound over time. Live below your means and avoid lifestyle inflation. Automate your savings to make it effortless. Educate yourself continuously about personal finance and investment options.',
          common_mistakes: 'Not budgeting, lifestyle inflation, not saving for emergencies, avoiding investment due to fear, not understanding employment benefits, poor debt management, not planning for taxes.',
          success_stories: 'Graduates who started financial planning early have achieved financial independence faster. One alumnus built a 6-figure investment portfolio within 5 years of graduation through disciplined saving and investing.',
          order_index: 2
        },
        {
          id: 'resource-5',
          resource_title: 'Professional Networking & LinkedIn',
          resource_category: 'networking',
          resource_description: 'Build and leverage professional networks for career advancement',
          detailed_content: 'Professional networking is one of the most powerful tools for career advancement. This guide teaches you how to build authentic professional relationships, leverage LinkedIn effectively, attend networking events, and maintain long-term professional connections that can open doors throughout your career.',
          checklist_items: [
            { task: 'Optimize LinkedIn profile', description: 'Professional photo, compelling headline, detailed experience section', priority: 'high', estimated_time: '3 hours' },
            { task: 'Connect with classmates and professors', description: 'Build your initial network with people you already know', priority: 'high', estimated_time: '2 hours' },
            { task: 'Join professional groups and communities', description: 'Find relevant LinkedIn groups and professional associations', priority: 'medium', estimated_time: '1 hour' },
            { task: 'Attend industry events and meetups', description: 'Find local tech meetups, conferences, and networking events', priority: 'medium', estimated_time: 'Ongoing' },
            { task: 'Prepare elevator pitch', description: 'Craft a 30-second introduction about yourself', priority: 'high', estimated_time: '2 hours' },
            { task: 'Follow industry leaders and companies', description: 'Stay updated with industry trends and opportunities', priority: 'medium', estimated_time: '1 hour' },
            { task: 'Share valuable content regularly', description: 'Post insights, articles, and professional updates', priority: 'low', estimated_time: '30 min weekly' },
            { task: 'Reach out to alumni in your field', description: 'Connect with graduates working in your target companies', priority: 'medium', estimated_time: '2 hours' },
            { task: 'Practice networking conversations', description: 'Learn how to start and maintain professional conversations', priority: 'medium', estimated_time: '2 hours' },
            { task: 'Follow up with new connections', description: 'Send personalized messages to maintain relationships', priority: 'high', estimated_time: '1 hour weekly' }
          ],
          youtube_videos: [
            { title: 'LinkedIn Profile Optimization 2024', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '24:30', channel: 'LinkedIn Expert', description: 'Complete guide to optimizing your LinkedIn profile' },
            { title: 'Networking for Introverts', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '19:45', channel: 'Career Coach', description: 'Networking strategies for introverted professionals' },
            { title: 'How to Network at Tech Events', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '16:20', channel: 'Tech Career', description: 'Effective networking at technology conferences and meetups' },
            { title: 'Building Professional Relationships', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '21:15', channel: 'Professional Growth', description: 'How to build and maintain professional relationships' }
          ],
          external_resources: [
            { title: 'LinkedIn Learning - Networking Courses', url: 'https://linkedin.com/learning/topics/networking', type: 'course', description: 'Professional networking courses on LinkedIn Learning' },
            { title: 'Meetup - Find Local Tech Events', url: 'https://meetup.com', type: 'platform', description: 'Find and join local technology meetups and events' },
            { title: 'Ghana Tech Community', url: 'https://ghanatechcommunity.com', type: 'community', description: 'Local tech community for networking and events' },
            { title: 'Never Eat Alone - Keith Ferrazzi', url: 'https://amazon.com/dp/0385512058', type: 'book', description: 'Classic book on professional networking strategies' }
          ],
          tips_and_advice: 'Focus on building genuine relationships rather than just collecting contacts. Always follow up within 24-48 hours after meeting someone new. Offer value to your network before asking for favors. Be consistent in your networking efforts.',
          common_mistakes: 'Being too transactional, not following up, only networking when job searching, not maintaining existing relationships, being unprepared at networking events, not having a clear value proposition.',
          success_stories: 'Many alumni have found their dream jobs through networking connections. One graduate landed a role at a top tech company through a LinkedIn connection made during a local meetup.',
          order_index: 3
        },
        {
          id: 'resource-6',
          resource_title: 'Career Transition & Job Search Strategy',
          resource_category: 'career_transition',
          resource_description: 'Strategic approach to transitioning from university to professional career',
          detailed_content: 'The transition from university to professional life requires strategic planning and execution. This guide provides a comprehensive roadmap for job searching, career planning, and making successful transitions. Learn how to identify career paths, target the right opportunities, and position yourself competitively in the job market.',
          checklist_items: [
            { task: 'Define career goals and target roles', description: 'Identify specific positions and companies you want to target', priority: 'high', estimated_time: '4 hours' },
            { task: 'Research target companies and industries', description: 'Study company cultures, requirements, and growth opportunities', priority: 'high', estimated_time: '6 hours' },
            { task: 'Build and update professional portfolio', description: 'Showcase your best projects and technical skills', priority: 'high', estimated_time: '8 hours' },
            { task: 'Optimize job search platforms', description: 'Update profiles on LinkedIn, Indeed, Glassdoor, and niche job boards', priority: 'high', estimated_time: '3 hours' },
            { task: 'Develop job search schedule', description: 'Allocate daily time for applications, networking, and skill development', priority: 'medium', estimated_time: '1 hour' },
            { task: 'Prepare for different interview formats', description: 'Practice phone, video, and in-person interview scenarios', priority: 'high', estimated_time: '4 hours' },
            { task: 'Build references list', description: 'Contact professors, supervisors, and mentors for references', priority: 'medium', estimated_time: '2 hours' },
            { task: 'Track applications and follow-ups', description: 'Maintain spreadsheet of applications and response timelines', priority: 'medium', estimated_time: '1 hour setup' },
            { task: 'Prepare for salary negotiations', description: 'Research market rates and practice negotiation scenarios', priority: 'medium', estimated_time: '3 hours' },
            { task: 'Plan for potential relocation', description: 'Consider logistics if job requires moving to new city/country', priority: 'low', estimated_time: '2 hours' }
          ],
          youtube_videos: [
            { title: 'Job Search Strategy for Tech Graduates', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '35:45', channel: 'Tech Career Guide', description: 'Comprehensive job search strategy for technology graduates' },
            { title: 'From Student to Professional', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '28:20', channel: 'Career Transition', description: 'Navigate the transition from university to professional life' },
            { title: 'Building Your Professional Brand', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '22:15', channel: 'Personal Branding', description: 'How to build and maintain your professional brand' },
            { title: 'Remote Work Job Search Tips', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '19:30', channel: 'Remote Career', description: 'Strategies for finding and securing remote work opportunities' }
          ],
          external_resources: [
            { title: 'AngelList - Startup Jobs', url: 'https://angel.co/jobs', type: 'platform', description: 'Job opportunities at startups and growing companies' },
            { title: 'Stack Overflow Jobs', url: 'https://stackoverflow.com/jobs', type: 'platform', description: 'Developer-focused job board with technical roles' },
            { title: 'What Color Is Your Parachute?', url: 'https://amazon.com/dp/1984856715', type: 'book', description: 'Classic career planning and job search guide' },
            { title: 'Glassdoor Company Reviews', url: 'https://glassdoor.com', type: 'platform', description: 'Company reviews, salaries, and interview insights' },
            { title: 'HackerRank Jobs', url: 'https://hackerrank.com/jobs', type: 'platform', description: 'Technical job board with coding challenges' }
          ],
          tips_and_advice: 'Start your job search 3-6 months before graduation. Quality over quantity - focus on applications that align with your goals. Customize each application for the specific role and company. Follow up professionally but don\'t be pushy.',
          common_mistakes: 'Applying to every job without targeting, not customizing applications, poor follow-up, not preparing adequately for interviews, not negotiating offers, burning bridges with rejections.',
          success_stories: 'Graduates who followed strategic job search approaches have secured positions 40% faster than those who applied randomly. Strategic networking has led to 60% of successful job placements.',
          order_index: 4
        },
        {
          id: 'resource-7',
          resource_title: 'Entrepreneurship & Startup Preparation',
          resource_category: 'entrepreneurship',
          resource_description: 'Guide for graduates interested in starting their own tech ventures',
          detailed_content: 'Entrepreneurship offers an alternative path for ambitious graduates. This comprehensive guide covers idea validation, business planning, funding strategies, team building, and the practical steps to launch a successful tech startup. Learn from successful entrepreneurs and avoid common pitfalls.',
          checklist_items: [
            { task: 'Validate your business idea', description: 'Conduct market research and customer interviews', priority: 'high', estimated_time: '20 hours' },
            { task: 'Create a business plan', description: 'Develop comprehensive business model and strategy', priority: 'high', estimated_time: '15 hours' },
            { task: 'Build minimum viable product (MVP)', description: 'Create a basic version of your product for testing', priority: 'high', estimated_time: '40 hours' },
            { task: 'Register your business', description: 'Complete legal registration and obtain necessary licenses', priority: 'high', estimated_time: '4 hours' },
            { task: 'Set up business banking', description: 'Open business bank accounts and set up financial systems', priority: 'medium', estimated_time: '2 hours' },
            { task: 'Build founding team', description: 'Recruit co-founders and early team members', priority: 'medium', estimated_time: '10 hours' },
            { task: 'Develop go-to-market strategy', description: 'Plan how to reach and acquire customers', priority: 'high', estimated_time: '8 hours' },
            { task: 'Prepare investor pitch', description: 'Create compelling pitch deck for potential investors', priority: 'medium', estimated_time: '12 hours' },
            { task: 'Network with other entrepreneurs', description: 'Join startup communities and entrepreneur groups', priority: 'medium', estimated_time: 'Ongoing' },
            { task: 'Plan for legal and IP protection', description: 'Understand intellectual property and legal requirements', priority: 'medium', estimated_time: '6 hours' }
          ],
          youtube_videos: [
            { title: 'How to Start a Tech Startup', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '42:30', channel: 'Startup School', description: 'Complete guide to starting a technology startup' },
            { title: 'Validating Your Business Idea', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '26:15', channel: 'Entrepreneur Guide', description: 'How to validate your business idea before investing time and money' },
            { title: 'Fundraising for Startups', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '38:45', channel: 'Venture Capital', description: 'Understanding startup funding and investor relations' },
            { title: 'Building Your MVP', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', duration: '31:20', channel: 'Product Development', description: 'How to build and launch your minimum viable product' }
          ],
          external_resources: [
            { title: 'Y Combinator Startup School', url: 'https://startupschool.org', type: 'course', description: 'Free online course for aspiring entrepreneurs' },
            { title: 'Ghana Startup Ecosystem', url: 'https://ghanastartups.com', type: 'community', description: 'Local startup community and resources' },
            { title: 'Lean Startup Methodology', url: 'https://leanstartup.co', type: 'methodology', description: 'Framework for building successful startups' },
            { title: 'Registrar General\'s Department', url: 'https://rgd.gov.gh', type: 'official', description: 'Official business registration in Ghana' },
            { title: 'The Lean Startup - Eric Ries', url: 'https://amazon.com/dp/0307887898', type: 'book', description: 'Essential book on lean startup methodology' }
          ],
          tips_and_advice: 'Start small and validate your idea before quitting your job. Focus on solving real problems for real customers. Build a strong team with complementary skills. Be prepared for failure and learn from setbacks.',
          common_mistakes: 'Not validating the idea, building features customers don\'t want, poor team dynamics, running out of money too quickly, not understanding the market, ignoring legal requirements.',
          success_stories: 'Several alumni have built successful startups, with some achieving million-dollar valuations. Local success stories include fintech and edtech startups that started during or shortly after university.',
          order_index: 5
        }
      ];

      setProgram(mockProgram);
      setResources(mockResources);
      setFilteredResources(mockResources);
    } catch (err) {
      setError('Failed to load after school toolkit resources');
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(resource =>
        resource.resource_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.resource_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.resource_category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.resource_category === selectedCategory);
    }

    setFilteredResources(filtered);
  };

  const openYouTubeVideo = (url: string) => {
    Linking.openURL(url);
  };

  const openExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  const toggleResourceExpansion = (resourceId: string) => {
    const newExpanded = new Set(expandedResources);
    if (newExpanded.has(resourceId)) {
      newExpanded.delete(resourceId);
    } else {
      newExpanded.add(resourceId);
    }
    setExpandedResources(newExpanded);
  };

  const toggleChecklistItem = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cv_writing': return FileText;
      case 'interview_prep': return Users;
      case 'national_service': return GraduationCap;
      case 'financial_planning': return DollarSign;
      case 'networking': return Building;
      case 'career_transition': return Briefcase;
      case 'entrepreneurship': return Star;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cv_writing': return '#3B82F6';
      case 'interview_prep': return '#10B981';
      case 'national_service': return '#8B5CF6';
      case 'financial_planning': return '#F59E0B';
      case 'networking': return '#06B6D4';
      case 'career_transition': return '#EF4444';
      case 'entrepreneurship': return '#EC4899';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading after school toolkit...</Text>
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
    { key: 'all', label: 'All Resources', count: resources.length },
    { key: 'cv_writing', label: 'CV Writing', count: resources.filter(r => r.resource_category === 'cv_writing').length },
    { key: 'interview_prep', label: 'Interview Prep', count: resources.filter(r => r.resource_category === 'interview_prep').length },
    { key: 'national_service', label: 'National Service', count: resources.filter(r => r.resource_category === 'national_service').length },
    { key: 'financial_planning', label: 'Financial Planning', count: resources.filter(r => r.resource_category === 'financial_planning').length },
    { key: 'networking', label: 'Networking', count: resources.filter(r => r.resource_category === 'networking').length },
    { key: 'career_transition', label: 'Career Transition', count: resources.filter(r => r.resource_category === 'career_transition').length },
    { key: 'entrepreneurship', label: 'Entrepreneurship', count: resources.filter(r => r.resource_category === 'entrepreneurship').length }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.programName}>After School Toolkit</Text>
            <Text style={styles.universityName}>{program.name} - {program.universities?.name}</Text>
          </View>
        </View>

        <View style={styles.introSection}>
          <GraduationCap size={24} color="#3B82F6" />
          <Text style={styles.introTitle}>Prepare for Life After University</Text>
          <Text style={styles.introText}>
            Comprehensive resources and checklists to help you transition successfully from university to professional life. 
            Master essential skills like CV writing, interview preparation, and financial planning.
          </Text>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search resources..."
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

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredResources.length} resources available
          </Text>
        </View>

        {filteredResources.map((resource) => {
          const IconComponent = getCategoryIcon(resource.resource_category);
          const iconColor = getCategoryColor(resource.resource_category);

          return (
            <View key={resource.id} style={styles.resourceCard}>
              <TouchableOpacity
                style={styles.resourceHeader}
                onPress={() => toggleResourceExpansion(resource.id)}
              >
                <View style={[styles.resourceIcon, { backgroundColor: `${iconColor}15` }]}>
                  <IconComponent size={24} color={iconColor} />
                </View>
                <View style={styles.resourceInfo}>
                  <Text style={styles.resourceTitle}>{resource.resource_title}</Text>
                  <Text style={styles.resourceDescription}>{resource.resource_description}</Text>
                </View>
                {expandedResources.has(resource.id) ? (
                  <ChevronUp size={24} color="#6B7280" />
                ) : (
                  <ChevronDown size={24} color="#6B7280" />
                )}
              </TouchableOpacity>

              {expandedResources.has(resource.id) && (
                <View style={styles.resourceContent}>
                  {/* Detailed Content */}
                  <View style={styles.detailedSection}>
                    <View style={styles.sectionHeader}>
                      <BookOpen size={20} color="#3B82F6" />
                      <Text style={styles.sectionTitle}>Overview</Text>
                    </View>
                    <Text style={styles.detailedContent}>{resource.detailed_content}</Text>
                  </View>

                  {/* Checklist */}
                  <View style={styles.checklistSection}>
                    <View style={styles.sectionHeader}>
                      <CheckSquare size={20} color="#10B981" />
                      <Text style={styles.sectionTitle}>Action Checklist</Text>
                    </View>
                    <View style={styles.checklistItems}>
                      {resource.checklist_items.map((item, index) => {
                        const itemId = `${resource.id}-${index}`;
                        const isChecked = checkedItems.has(itemId);
                        
                        return (
                          <TouchableOpacity
                            key={index}
                            style={styles.checklistItem}
                            onPress={() => toggleChecklistItem(itemId)}
                          >
                            <View style={styles.checklistLeft}>
                              {isChecked ? (
                                <CheckSquare size={20} color="#10B981" />
                              ) : (
                                <Square size={20} color="#9CA3AF" />
                              )}
                              <View style={styles.checklistContent}>
                                <Text style={[styles.checklistTask, isChecked && styles.checkedTask]}>
                                  {item.task}
                                </Text>
                                <Text style={styles.checklistDescription}>{item.description}</Text>
                                <View style={styles.checklistMeta}>
                                  <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(item.priority)}15` }]}>
                                    <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
                                      {item.priority}
                                    </Text>
                                  </View>
                                  <Text style={styles.timeEstimate}>{item.estimated_time}</Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* YouTube Videos */}
                  <View style={styles.videosSection}>
                    <View style={styles.sectionHeader}>
                      <Play size={20} color="#EF4444" />
                      <Text style={styles.sectionTitle}>Video Tutorials</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
                      {resource.youtube_videos.map((video, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.videoCard}
                          onPress={() => openYouTubeVideo(video.url)}
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
                          <Text style={styles.videoChannel}>{video.channel}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* External Resources */}
                  <View style={styles.externalSection}>
                    <View style={styles.sectionHeader}>
                      <ExternalLink size={20} color="#8B5CF6" />
                      <Text style={styles.sectionTitle}>Additional Resources</Text>
                    </View>
                    <View style={styles.externalList}>
                      {resource.external_resources.map((extResource, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.externalCard}
                          onPress={() => openExternalLink(extResource.url)}
                        >
                          <View style={styles.externalInfo}>
                            <Text style={styles.externalTitle}>{extResource.title}</Text>
                            <Text style={styles.externalDescription}>{extResource.description}</Text>
                            <Text style={styles.externalType}>{extResource.type}</Text>
                          </View>
                          <ExternalLink size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Tips and Advice */}
                  <View style={styles.tipsSection}>
                    <View style={styles.sectionHeader}>
                      <Lightbulb size={20} color="#F59E0B" />
                      <Text style={styles.sectionTitle}>Tips & Advice</Text>
                    </View>
                    <Text style={styles.tipsText}>{resource.tips_and_advice}</Text>
                  </View>

                  {/* Common Mistakes */}
                  <View style={styles.mistakesSection}>
                    <View style={styles.sectionHeader}>
                      <AlertTriangle size={20} color="#EF4444" />
                      <Text style={styles.sectionTitle}>Common Mistakes to Avoid</Text>
                    </View>
                    <Text style={styles.mistakesText}>{resource.common_mistakes}</Text>
                  </View>

                  {/* Success Stories */}
                  <View style={styles.successSection}>
                    <View style={styles.sectionHeader}>
                      <Award size={20} color="#10B981" />
                      <Text style={styles.sectionTitle}>Success Stories</Text>
                    </View>
                    <Text style={styles.successText}>{resource.success_stories}</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
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
  searchSection: {
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
  resultsHeader: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  resourceCard: {
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
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  resourceDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  resourceContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  detailedSection: {
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
  checklistSection: {
    marginBottom: 24,
  },
  checklistItems: {
    gap: 12,
  },
  checklistItem: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checklistLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checklistContent: {
    flex: 1,
  },
  checklistTask: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  checkedTask: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  checklistDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  checklistMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
  timeEstimate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    lineHeight: 16,
  },
  videoChannel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  externalSection: {
    marginBottom: 24,
  },
  externalList: {
    gap: 8,
  },
  externalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  externalInfo: {
    flex: 1,
  },
  externalTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginBottom: 2,
  },
  externalDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 4,
  },
  externalType: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    textTransform: 'uppercase',
  },
  tipsSection: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    marginBottom: 16,
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 20,
  },
  mistakesSection: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    marginBottom: 16,
  },
  mistakesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#991B1B',
    lineHeight: 20,
  },
  successSection: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  successText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#065F46',
    lineHeight: 20,
  },
});