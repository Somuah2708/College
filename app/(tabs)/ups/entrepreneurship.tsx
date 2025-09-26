import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  ExternalLink, 
  Lightbulb, 
  Users, 
  Award, 
  Building, 
  Target,
  Search,
  ListFilter as Filter,
  ChevronDown,
  ChevronUp,
  BookOpen,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  CircleCheck as CheckCircle,
  Star,
  TrendingUp,
  Briefcase,
  Wrench,
  Globe
} from 'lucide-react-native';

interface EntrepreneurshipVideo {
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

interface EntrepreneurshipResource {
  id: string;
  resource_name: string;
  resource_type: string;
  organization_name: string;
  resource_description: string;
  detailed_content: string;
  benefits_offered: any[];
  requirements_checklist: any[];
  application_process: string;
  application_deadline: string;
  application_url: string;
  contact_email: string;
  contact_phone: string;
  program_duration: string;
  funding_amount: string;
  success_stories: string;
  additional_resources: any[];
  tips_and_advice: string;
  common_mistakes: string;
  resource_category: string;
  order_index: number;
  videos: EntrepreneurshipVideo[];
}

interface ProgramDetails {
  id: string;
  name: string;
  universities?: {
    name: string;
    location: string;
  };
}

export default function EntrepreneurshipScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [program, setProgram] = useState<ProgramDetails | null>(null);
  const [resources, setResources] = useState<EntrepreneurshipResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<EntrepreneurshipResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchEntrepreneurshipData();
  }, [id]);

  useEffect(() => {
    filterResources();
  }, [searchQuery, selectedCategory, resources]);

  const fetchEntrepreneurshipData = async () => {
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

      const mockResources: EntrepreneurshipResource[] = [
        {
          id: 'ent-1',
          resource_name: 'Stanford Entrepreneurship Club',
          resource_type: 'club',
          organization_name: 'Stanford Student Organizations',
          resource_description: 'Premier student-run entrepreneurship club fostering innovation and startup culture among computer science students.',
          detailed_content: 'The Stanford Entrepreneurship Club is a vibrant community of aspiring entrepreneurs, innovators, and business leaders. We organize weekly workshops, pitch competitions, networking events with successful alumni, and mentorship programs. Members get access to exclusive startup resources, funding opportunities, and connections with Silicon Valley investors and entrepreneurs.',
          benefits_offered: [
            'Weekly workshops with industry experts',
            'Access to Stanford\'s startup ecosystem',
            'Mentorship from successful alumni entrepreneurs',
            'Networking events with VCs and angel investors',
            'Pitch competition opportunities',
            'Access to co-working spaces on campus',
            'Startup resource library and databases',
            'Legal and business consultation services'
          ],
          requirements_checklist: [
            { task: 'Complete membership application', priority: 'high', estimated_time: '30 minutes' },
            { task: 'Attend orientation session', priority: 'high', estimated_time: '2 hours' },
            { task: 'Submit business idea pitch (optional)', priority: 'medium', estimated_time: '1 week' },
            { task: 'Pay annual membership fee', priority: 'high', estimated_time: '5 minutes' },
            { task: 'Join club Slack workspace', priority: 'medium', estimated_time: '10 minutes' }
          ],
          application_process: 'Submit online application through Stanford student portal, attend information session, and complete orientation program.',
          application_deadline: '2025-09-15T23:59:59Z',
          application_url: 'https://stanford.edu/entrepreneurship-club/apply',
          contact_email: 'entrepreneurship@stanford.edu',
          contact_phone: '+1 (650) 723-2300',
          program_duration: 'Academic year membership',
          funding_amount: 'Access to $50,000+ in startup grants',
          success_stories: 'Club alumni have founded companies like Instagram, Snapchat, and WhatsApp, raising over $2 billion in total funding.',
          additional_resources: [
            { title: 'Stanford d.school', url: 'https://dschool.stanford.edu' },
            { title: 'Stanford Technology Ventures Program', url: 'https://stvp.stanford.edu' },
            { title: 'StartX Accelerator', url: 'https://startx.com' }
          ],
          tips_and_advice: 'Start with a clear problem you\'re passionate about solving. Network actively and don\'t be afraid to pivot your idea based on feedback. Focus on building an MVP quickly.',
          common_mistakes: 'Spending too much time on perfect business plans instead of talking to customers, trying to do everything alone, and not validating market demand early.',
          resource_category: 'student_organizations',
          order_index: 0,
          videos: Array.from({ length: 15 }, (_, index) => ({
            id: `club-video-${index + 1}`,
            video_title: `Entrepreneurship Club Success - Episode ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            video_description: `Learn how to maximize your entrepreneurship club experience - Episode ${index + 1}`,
            duration: `${Math.floor(Math.random() * 20) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            instructor_name: 'Startup Mentor Sarah Chen',
            video_category: 'tutorial',
            order_index: index
          }))
        },
        {
          id: 'ent-2',
          resource_name: 'TechStars University Accelerator',
          resource_type: 'incubator',
          organization_name: 'TechStars',
          resource_description: 'Intensive 3-month accelerator program for student-led tech startups with $120,000 funding and mentorship.',
          detailed_content: 'TechStars University is a premier startup accelerator specifically designed for student entrepreneurs. The program provides intensive mentorship, funding, and access to a global network of successful entrepreneurs and investors. Participants work full-time on their startups while receiving guidance from experienced mentors and industry experts.',
          benefits_offered: [
            '$120,000 seed funding for 6% equity',
            '3 months of intensive mentorship',
            'Access to TechStars global network',
            'Demo Day presentation to 500+ investors',
            'Office space and technical resources',
            'Legal and accounting support',
            'Product development guidance',
            'Go-to-market strategy development',
            'Lifetime access to TechStars alumni network'
          ],
          requirements_checklist: [
            { task: 'Develop minimum viable product (MVP)', priority: 'high', estimated_time: '2-3 months' },
            { task: 'Form founding team (2-4 members)', priority: 'high', estimated_time: '1 month' },
            { task: 'Complete comprehensive application', priority: 'high', estimated_time: '2 weeks' },
            { task: 'Prepare 10-minute pitch presentation', priority: 'high', estimated_time: '1 week' },
            { task: 'Demonstrate market traction', priority: 'medium', estimated_time: 'Ongoing' },
            { task: 'Submit financial projections', priority: 'medium', estimated_time: '3 days' }
          ],
          application_process: 'Submit online application with business plan, team information, and product demo. Selected teams participate in interview rounds and final pitch presentation.',
          application_deadline: '2025-02-28T23:59:59Z',
          application_url: 'https://techstars.com/university/apply',
          contact_email: 'university@techstars.com',
          contact_phone: '+1 (303) 555-0199',
          program_duration: '3 months intensive program',
          funding_amount: '$120,000 seed funding',
          success_stories: 'TechStars alumni companies have raised over $13 billion in follow-on funding, with notable successes including SendGrid, ClassPass, and DigitalOcean.',
          additional_resources: [
            { title: 'TechStars Mentor Network', url: 'https://techstars.com/mentors' },
            { title: 'Startup Toolkit', url: 'https://techstars.com/toolkit' },
            { title: 'Alumni Success Stories', url: 'https://techstars.com/portfolio' }
          ],
          tips_and_advice: 'Focus on building a strong team first. Investors invest in people, not just ideas. Be prepared to work 80+ hours per week and be coachable.',
          common_mistakes: 'Applying too early without a working product, not having a technical co-founder, and underestimating the time commitment required.',
          resource_category: 'acceleration_programs',
          order_index: 0,
          videos: Array.from({ length: 12 }, (_, index) => ({
            id: `incubator-video-${index + 1}`,
            video_title: `Startup Accelerator Success - Part ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 100}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            video_description: `Master startup accelerator applications and success strategies - Part ${index + 1}`,
            duration: `${Math.floor(Math.random() * 25) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            instructor_name: 'TechStars Managing Director Mike Johnson',
            video_category: 'case_study',
            order_index: index
          }))
        },
        {
          id: 'ent-3',
          resource_name: 'Stanford Business Plan Competition',
          resource_type: 'competition',
          organization_name: 'Stanford Graduate School of Business',
          resource_description: 'Annual business plan competition with $275,000 in total prizes for innovative tech startups.',
          detailed_content: 'The Stanford Business Plan Competition is one of the most prestigious student startup competitions globally. Teams compete across multiple tracks including technology, social impact, and life sciences. The competition provides extensive mentorship, workshops, and networking opportunities throughout the process.',
          benefits_offered: [
            '$275,000 total prize pool across categories',
            'Mentorship from successful entrepreneurs',
            'Workshops on business planning and pitching',
            'Networking with VCs and angel investors',
            'Media exposure and publicity',
            'Access to Stanford\'s entrepreneur network',
            'Legal and business development support',
            'Potential follow-on funding opportunities'
          ],
          requirements_checklist: [
            { task: 'Develop comprehensive business plan', priority: 'high', estimated_time: '1 month' },
            { task: 'Create compelling pitch deck', priority: 'high', estimated_time: '2 weeks' },
            { task: 'Submit initial application', priority: 'high', estimated_time: '1 week' },
            { task: 'Prepare 5-minute elevator pitch', priority: 'high', estimated_time: '3 days' },
            { task: 'Conduct market research and validation', priority: 'medium', estimated_time: '2 weeks' },
            { task: 'Build functional prototype or MVP', priority: 'medium', estimated_time: '1 month' }
          ],
          application_process: 'Submit business plan and executive summary, participate in semi-final presentations, advance to final pitch competition.',
          application_deadline: '2025-01-31T23:59:59Z',
          application_url: 'https://gsb.stanford.edu/business-plan-competition',
          contact_email: 'bizplan@stanford.edu',
          contact_phone: '+1 (650) 723-2146',
          program_duration: '6-month competition cycle',
          funding_amount: 'Up to $50,000 grand prize',
          success_stories: 'Past winners include companies that have raised over $500 million in venture funding, with several achieving unicorn status.',
          additional_resources: [
            { title: 'Business Plan Template', url: 'https://gsb.stanford.edu/business-plan-template' },
            { title: 'Pitch Deck Examples', url: 'https://gsb.stanford.edu/pitch-examples' },
            { title: 'Judging Criteria Guide', url: 'https://gsb.stanford.edu/judging-criteria' }
          ],
          tips_and_advice: 'Focus on solving a real problem with a large market. Practice your pitch extensively and be prepared for tough questions from judges.',
          common_mistakes: 'Overcomplicating the business model, not having clear financial projections, and failing to demonstrate market validation.',
          resource_category: 'competitions',
          order_index: 0,
          videos: Array.from({ length: 18 }, (_, index) => ({
            id: `competition-video-${index + 1}`,
            video_title: `Business Plan Competition Mastery - Session ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 200}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            video_description: `Learn how to win business plan competitions - Session ${index + 1}`,
            duration: `${Math.floor(Math.random() * 30) + 12}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            instructor_name: 'Competition Judge Dr. Lisa Wang',
            video_category: 'workshop',
            order_index: index
          }))
        },
        {
          id: 'ent-4',
          resource_name: 'CS Innovation Lab',
          resource_type: 'innovation_lab',
          organization_name: 'Stanford Computer Science Department',
          resource_description: 'State-of-the-art innovation lab with prototyping equipment, VR/AR tools, and AI development resources.',
          detailed_content: 'The CS Innovation Lab is a cutting-edge facility designed to support student entrepreneurs in developing technology-based solutions. The lab features 3D printers, electronics prototyping equipment, VR/AR development stations, high-performance computing resources, and collaborative workspaces.',
          benefits_offered: [
            'Access to 3D printing and prototyping equipment',
            'VR/AR development stations and headsets',
            'High-performance computing clusters',
            'Electronics and hardware prototyping tools',
            'Collaborative workspace and meeting rooms',
            'Technical mentorship from faculty and industry experts',
            'Access to software licenses and development tools',
            'Funding for prototype development materials'
          ],
          requirements_checklist: [
            { task: 'Complete lab safety training', priority: 'high', estimated_time: '2 hours' },
            { task: 'Submit project proposal', priority: 'high', estimated_time: '1 week' },
            { task: 'Get faculty sponsor approval', priority: 'high', estimated_time: '3 days' },
            { task: 'Reserve equipment and workspace', priority: 'medium', estimated_time: '30 minutes' },
            { task: 'Attend weekly progress meetings', priority: 'medium', estimated_time: 'Ongoing' }
          ],
          application_process: 'Submit project proposal, get faculty sponsorship, complete safety training, and reserve lab time through online booking system.',
          application_deadline: '2025-08-30T23:59:59Z',
          application_url: 'https://cs.stanford.edu/innovation-lab/apply',
          contact_email: 'innovation-lab@cs.stanford.edu',
          contact_phone: '+1 (650) 723-4671',
          program_duration: 'Semester-based access',
          funding_amount: 'Up to $5,000 for materials',
          success_stories: 'Lab projects have led to 15+ successful startups, including companies that have raised over $100 million in venture funding.',
          additional_resources: [
            { title: 'Lab Equipment Catalog', url: 'https://cs.stanford.edu/innovation-lab/equipment' },
            { title: 'Project Showcase', url: 'https://cs.stanford.edu/innovation-lab/showcase' },
            { title: 'Booking System', url: 'https://cs.stanford.edu/innovation-lab/booking' }
          ],
          tips_and_advice: 'Start with a clear project timeline and milestones. Collaborate with other students to share knowledge and resources. Document your progress for future reference.',
          common_mistakes: 'Not planning equipment usage in advance, working alone instead of collaborating, and not seeking help from lab mentors early enough.',
          resource_category: 'facilities',
          order_index: 0,
          videos: Array.from({ length: 14 }, (_, index) => ({
            id: `lab-video-${index + 1}`,
            video_title: `Innovation Lab Mastery - Tutorial ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 300}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            video_description: `Learn to maximize innovation lab resources and tools - Tutorial ${index + 1}`,
            duration: `${Math.floor(Math.random() * 22) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            instructor_name: 'Lab Director Prof. David Kim',
            video_category: 'tutorial',
            order_index: index
          }))
        },
        {
          id: 'ent-5',
          resource_name: 'Business Plan Development Workshop Series',
          resource_type: 'training',
          organization_name: 'Stanford Entrepreneurship Center',
          resource_description: '8-week intensive workshop series covering all aspects of business plan development and startup strategy.',
          detailed_content: 'This comprehensive workshop series guides students through every aspect of creating a winning business plan. From market research and competitive analysis to financial modeling and pitch preparation, students learn from successful entrepreneurs and industry experts.',
          benefits_offered: [
            '8 weeks of intensive business planning training',
            'One-on-one mentorship with successful entrepreneurs',
            'Access to market research databases and tools',
            'Financial modeling templates and software',
            'Pitch coaching and presentation skills training',
            'Networking with fellow student entrepreneurs',
            'Certificate of completion for resume',
            'Ongoing support after workshop completion'
          ],
          requirements_checklist: [
            { task: 'Register for workshop series', priority: 'high', estimated_time: '15 minutes' },
            { task: 'Prepare initial business idea presentation', priority: 'high', estimated_time: '1 week' },
            { task: 'Attend all 8 weekly sessions', priority: 'high', estimated_time: '24 hours total' },
            { task: 'Complete weekly assignments', priority: 'medium', estimated_time: '3-5 hours/week' },
            { task: 'Present final business plan', priority: 'high', estimated_time: '2 weeks preparation' }
          ],
          application_process: 'Register online, submit initial business idea, attend orientation session, and commit to full 8-week program.',
          application_deadline: '2025-01-15T23:59:59Z',
          application_url: 'https://stanford.edu/entrepreneurship/workshops',
          contact_email: 'workshops@stanford.edu',
          contact_phone: '+1 (650) 723-3341',
          program_duration: '8 weeks (2 hours/week)',
          funding_amount: 'Free for Stanford students',
          success_stories: 'Workshop graduates have launched 50+ companies with a combined valuation of over $2 billion.',
          additional_resources: [
            { title: 'Business Model Canvas Tool', url: 'https://strategyzer.com/canvas' },
            { title: 'Market Research Database', url: 'https://stanford.edu/market-research' },
            { title: 'Financial Planning Templates', url: 'https://stanford.edu/financial-templates' }
          ],
          tips_and_advice: 'Come prepared with a specific business idea. Be open to feedback and willing to pivot. Network with other participants as they could become future co-founders or partners.',
          common_mistakes: 'Not doing enough customer research, creating overly complex business models, and not being realistic about financial projections.',
          resource_category: 'education_training',
          order_index: 0,
          videos: Array.from({ length: 16 }, (_, index) => ({
            id: `training-video-${index + 1}`,
            video_title: `Business Plan Development - Module ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 400}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            video_description: `Master business plan development and strategy - Module ${index + 1}`,
            duration: `${Math.floor(Math.random() * 35) + 15}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            instructor_name: 'Business Strategy Expert Prof. Maria Rodriguez',
            video_category: 'workshop',
            order_index: index
          }))
        },
        {
          id: 'ent-6',
          resource_name: 'Silicon Valley Startup Challenge',
          resource_type: 'competition',
          organization_name: 'Silicon Valley Innovation Foundation',
          resource_description: 'Regional startup competition with $500,000 in total prizes and direct access to top-tier venture capitalists.',
          detailed_content: 'The Silicon Valley Startup Challenge is the premier regional competition for student entrepreneurs. Teams compete in multiple categories including AI/ML, fintech, healthtech, and social impact. Winners receive substantial funding, mentorship, and introductions to leading venture capital firms.',
          benefits_offered: [
            '$500,000 total prize pool',
            'Direct access to tier-1 venture capitalists',
            'Mentorship from unicorn startup founders',
            'Media coverage and PR opportunities',
            'Office space in Silicon Valley for 6 months',
            'Legal and accounting services worth $50,000',
            'Access to enterprise software and tools',
            'Introductions to potential customers and partners'
          ],
          requirements_checklist: [
            { task: 'Develop working prototype or beta product', priority: 'high', estimated_time: '2-3 months' },
            { task: 'Demonstrate initial customer traction', priority: 'high', estimated_time: '1 month' },
            { task: 'Prepare comprehensive pitch deck', priority: 'high', estimated_time: '2 weeks' },
            { task: 'Submit detailed application', priority: 'high', estimated_time: '1 week' },
            { task: 'Create demo video', priority: 'medium', estimated_time: '3 days' },
            { task: 'Gather customer testimonials', priority: 'medium', estimated_time: '1 week' }
          ],
          application_process: 'Submit online application with business plan, demo video, and team information. Semi-finalists present to judges, finalists pitch at Demo Day.',
          application_deadline: '2025-03-01T23:59:59Z',
          application_url: 'https://svstartupchallenge.com/apply',
          contact_email: 'competition@svstartupchallenge.com',
          contact_phone: '+1 (415) 555-0177',
          program_duration: '4-month competition cycle',
          funding_amount: 'Up to $100,000 grand prize',
          success_stories: 'Competition winners have gone on to raise over $1.5 billion in venture funding, with 3 companies achieving unicorn status.',
          additional_resources: [
            { title: 'Pitch Deck Templates', url: 'https://svstartupchallenge.com/templates' },
            { title: 'Judge Profiles', url: 'https://svstartupchallenge.com/judges' },
            { title: 'Past Winner Showcase', url: 'https://svstartupchallenge.com/winners' }
          ],
          tips_and_advice: 'Focus on demonstrating real customer demand and traction. Practice your pitch extensively and be prepared for detailed questions about your business model.',
          common_mistakes: 'Focusing too much on technology and not enough on market opportunity, not having clear revenue projections, and underestimating competition.',
          resource_category: 'competitions',
          order_index: 1,
          videos: Array.from({ length: 20 }, (_, index) => ({
            id: `challenge-video-${index + 1}`,
            video_title: `Startup Competition Strategy - Episode ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 500}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            video_description: `Win startup competitions with proven strategies - Episode ${index + 1}`,
            duration: `${Math.floor(Math.random() * 28) + 12}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            instructor_name: 'VC Partner and Judge Alex Thompson',
            video_category: 'strategy',
            order_index: index
          }))
        },
        {
          id: 'ent-7',
          resource_name: 'Y Combinator Startup School',
          resource_type: 'training',
          organization_name: 'Y Combinator',
          resource_description: 'Free 10-week online course covering startup fundamentals, with access to YC\'s startup community and resources.',
          detailed_content: 'Y Combinator Startup School is a free online program that teaches the fundamentals of starting a company. The course covers everything from idea validation to fundraising, with weekly assignments and access to a global community of entrepreneurs.',
          benefits_offered: [
            'Free access to YC\'s startup curriculum',
            'Weekly lectures from successful founders',
            'Access to global startup community',
            'Startup idea validation framework',
            'Fundraising and investor relations guidance',
            'Product development methodologies',
            'Growth hacking and marketing strategies',
            'Certificate of completion'
          ],
          requirements_checklist: [
            { task: 'Register for Startup School', priority: 'high', estimated_time: '10 minutes' },
            { task: 'Complete weekly assignments', priority: 'high', estimated_time: '2-3 hours/week' },
            { task: 'Participate in community discussions', priority: 'medium', estimated_time: '1 hour/week' },
            { task: 'Submit final startup idea', priority: 'medium', estimated_time: '1 week' },
            { task: 'Watch all lecture videos', priority: 'high', estimated_time: '20 hours total' }
          ],
          application_process: 'Free registration online, no application required. Simply sign up and start learning immediately.',
          application_deadline: '2025-06-01T23:59:59Z',
          application_url: 'https://startupschool.org',
          contact_email: 'startupschool@ycombinator.com',
          contact_phone: 'Online support only',
          program_duration: '10 weeks self-paced',
          funding_amount: 'Free program',
          success_stories: 'Over 100,000 students have completed Startup School, with many going on to launch successful companies and raise venture funding.',
          additional_resources: [
            { title: 'YC Startup Library', url: 'https://ycombinator.com/library' },
            { title: 'Founder Stories', url: 'https://ycombinator.com/blog' },
            { title: 'Startup Tools', url: 'https://ycombinator.com/deals' }
          ],
          tips_and_advice: 'Take the assignments seriously and engage with the community. The real value comes from applying the concepts to your own startup idea.',
          common_mistakes: 'Just watching videos without doing assignments, not engaging with the community, and not applying learnings to a real project.',
          resource_category: 'education_training',
          order_index: 1,
          videos: Array.from({ length: 22 }, (_, index) => ({
            id: `yc-video-${index + 1}`,
            video_title: `Y Combinator Startup Fundamentals - Lecture ${index + 1}`,
            youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index + 600}`,
            thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
            video_description: `Learn startup fundamentals from YC partners - Lecture ${index + 1}`,
            duration: `${Math.floor(Math.random() * 40) + 20}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            instructor_name: 'YC Partner Sam Altman',
            video_category: 'lecture',
            order_index: index
          }))
        }
      ];

      setProgram(mockProgram);
      setResources(mockResources);
      setFilteredResources(mockResources);
    } catch (err) {
      setError('Failed to load entrepreneurship resources');
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(resource =>
        resource.resource_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.resource_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.resource_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.resource_type === selectedCategory);
    }

    setFilteredResources(filtered);
  };

  const openYouTubeVideo = (url: string) => {
    Linking.openURL(url);
  };

  const openExternalLink = (url: string) => {
    Linking.openURL(url);
  };

  const sendEmail = (email: string, subject: string) => {
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}`);
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

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'club': return Users;
      case 'incubator': return Building;
      case 'competition': return Award;
      case 'training': return BookOpen;
      case 'innovation_lab': return Wrench;
      default: return Lightbulb;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'club': return '#3B82F6';
      case 'incubator': return '#10B981';
      case 'competition': return '#F59E0B';
      case 'training': return '#8B5CF6';
      case 'innovation_lab': return '#EF4444';
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
          <Text style={styles.loadingText}>Loading entrepreneurship resources...</Text>
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
    { key: 'club', label: 'Clubs', count: resources.filter(r => r.resource_type === 'club').length },
    { key: 'incubator', label: 'Incubators', count: resources.filter(r => r.resource_type === 'incubator').length },
    { key: 'competition', label: 'Competitions', count: resources.filter(r => r.resource_type === 'competition').length },
    { key: 'training', label: 'Training', count: resources.filter(r => r.resource_type === 'training').length },
    { key: 'innovation_lab', label: 'Innovation Labs', count: resources.filter(r => r.resource_type === 'innovation_lab').length }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.programName}>Entrepreneurship Support</Text>
            <Text style={styles.universityName}>{program.name} - {program.universities?.name}</Text>
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search entrepreneurship resources..."
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
          <Lightbulb size={24} color="#3B82F6" />
          <Text style={styles.introTitle}>Startup & Business Support Ecosystem</Text>
          <Text style={styles.introText}>
            Comprehensive entrepreneurship support for {program.name} students, including clubs, incubators, 
            funding competitions, and innovation labs to help you launch successful startups and side hustles.
          </Text>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredResources.length} entrepreneurship resources available
          </Text>
        </View>

        {filteredResources.map((resource) => (
          <View key={resource.id} style={styles.resourceCard}>
            <TouchableOpacity
              style={styles.resourceHeader}
              onPress={() => toggleResourceExpansion(resource.id)}
            >
              <View style={styles.resourceInfo}>
                <View style={styles.resourceTitleRow}>
                  <View style={[styles.typeIcon, { backgroundColor: `${getResourceTypeColor(resource.resource_type)}15` }]}>
                    {React.createElement(getResourceTypeIcon(resource.resource_type), { 
                      size: 20, 
                      color: getResourceTypeColor(resource.resource_type) 
                    })}
                  </View>
                  <View style={styles.resourceTitleInfo}>
                    <Text style={styles.resourceName}>{resource.resource_name}</Text>
                    <Text style={styles.organizationName}>{resource.organization_name}</Text>
                  </View>
                </View>
                <Text style={styles.resourceDescription}>{resource.resource_description}</Text>
                {resource.funding_amount && (
                  <View style={styles.fundingContainer}>
                    <DollarSign size={16} color="#10B981" />
                    <Text style={styles.fundingText}>{resource.funding_amount}</Text>
                  </View>
                )}
              </View>
              {expandedResources.has(resource.id) ? (
                <ChevronUp size={24} color="#6B7280" />
              ) : (
                <ChevronDown size={24} color="#6B7280" />
              )}
            </TouchableOpacity>

            {expandedResources.has(resource.id) && (
              <View style={styles.resourceContent}>
                {/* Detailed Overview */}
                <View style={styles.contentSection}>
                  <View style={styles.sectionHeader}>
                    <BookOpen size={20} color="#3B82F6" />
                    <Text style={styles.sectionTitle}>Program Overview</Text>
                  </View>
                  <Text style={styles.detailedContent}>{resource.detailed_content}</Text>
                </View>

                {/* Benefits Offered */}
                <View style={styles.benefitsSection}>
                  <View style={styles.sectionHeader}>
                    <Star size={20} color="#10B981" />
                    <Text style={styles.sectionTitle}>Benefits & Opportunities</Text>
                  </View>
                  <View style={styles.benefitsList}>
                    {resource.benefits_offered.map((benefit: string, index: number) => (
                      <View key={index} style={styles.benefitItem}>
                        <CheckCircle size={16} color="#10B981" />
                        <Text style={styles.benefitText}>{benefit}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Requirements Checklist */}
                <View style={styles.checklistSection}>
                  <View style={styles.sectionHeader}>
                    <Target size={20} color="#F59E0B" />
                    <Text style={styles.sectionTitle}>Requirements Checklist</Text>
                  </View>
                  <View style={styles.checklistItems}>
                    {resource.requirements_checklist.map((item: any, index: number) => (
                      <View key={index} style={styles.checklistItem}>
                        <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(item.priority) }]} />
                        <View style={styles.checklistContent}>
                          <Text style={styles.checklistTask}>{item.task}</Text>
                          <View style={styles.checklistMeta}>
                            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
                              {item.priority} priority
                            </Text>
                            <Text style={styles.timeEstimate}>Est. {item.estimated_time}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Training Videos */}
                <View style={styles.videosSection}>
                  <View style={styles.sectionHeader}>
                    <Play size={20} color="#EF4444" />
                    <Text style={styles.sectionTitle}>Training Videos ({resource.videos.length} videos)</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videosContainer}>
                    {resource.videos.map((video) => (
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

                {/* Application Information */}
                <View style={styles.applicationSection}>
                  <View style={styles.sectionHeader}>
                    <Calendar size={20} color="#8B5CF6" />
                    <Text style={styles.sectionTitle}>Application Information</Text>
                  </View>
                  <Text style={styles.applicationProcess}>{resource.application_process}</Text>
                  {resource.application_deadline && (
                    <View style={styles.deadlineContainer}>
                      <Calendar size={16} color="#EF4444" />
                      <Text style={styles.deadlineText}>
                        Deadline: {new Date(resource.application_deadline).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Success Stories */}
                {resource.success_stories && (
                  <View style={styles.successSection}>
                    <View style={styles.sectionHeader}>
                      <TrendingUp size={20} color="#06B6D4" />
                      <Text style={styles.sectionTitle}>Success Stories</Text>
                    </View>
                    <Text style={styles.successText}>{resource.success_stories}</Text>
                  </View>
                )}

                {/* Tips and Common Mistakes */}
                <View style={styles.adviceSection}>
                  <View style={styles.tipsContainer}>
                    <Text style={styles.adviceTitle}>💡 Expert Tips</Text>
                    <Text style={styles.adviceText}>{resource.tips_and_advice}</Text>
                  </View>
                  <View style={styles.mistakesContainer}>
                    <Text style={styles.adviceTitle}>⚠️ Common Mistakes</Text>
                    <Text style={styles.adviceText}>{resource.common_mistakes}</Text>
                  </View>
                </View>

                {/* Additional Resources */}
                <View style={styles.additionalResourcesSection}>
                  <View style={styles.sectionHeader}>
                    <ExternalLink size={20} color="#EC4899" />
                    <Text style={styles.sectionTitle}>Additional Resources</Text>
                  </View>
                  <View style={styles.additionalResourcesList}>
                    {resource.additional_resources.map((additionalResource: any, index: number) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.additionalResourceCard}
                        onPress={() => openExternalLink(additionalResource.url)}
                      >
                        <Globe size={16} color="#3B82F6" />
                        <Text style={styles.additionalResourceTitle}>{additionalResource.title}</Text>
                        <ExternalLink size={14} color="#9CA3AF" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Contact and Action Buttons */}
                <View style={styles.actionSection}>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactTitle}>Contact Information</Text>
                    <Text style={styles.contactText}>Email: {resource.contact_email}</Text>
                    {resource.contact_phone !== 'Online support only' && (
                      <Text style={styles.contactText}>Phone: {resource.contact_phone}</Text>
                    )}
                  </View>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => openExternalLink(resource.application_url)}
                    >
                      <ExternalLink size={16} color="#FFFFFF" />
                      <Text style={styles.primaryButtonText}>Apply Now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={() => sendEmail(resource.contact_email, `Inquiry about ${resource.resource_name}`)}
                    >
                      <Mail size={16} color="#3B82F6" />
                      <Text style={styles.secondaryButtonText}>Contact</Text>
                    </TouchableOpacity>
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
  resourceInfo: {
    flex: 1,
  },
  resourceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceTitleInfo: {
    flex: 1,
  },
  resourceName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  organizationName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  resourceDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginTop: 8,
  },
  fundingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  fundingText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  resourceContent: {
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
  benefitsSection: {
    marginBottom: 24,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
    lineHeight: 20,
  },
  checklistSection: {
    marginBottom: 24,
  },
  checklistItems: {
    gap: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priorityIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
    minHeight: 40,
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
  checklistMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textTransform: 'capitalize',
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
  applicationSection: {
    marginBottom: 24,
  },
  applicationProcess: {
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
  successSection: {
    marginBottom: 24,
  },
  successText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  adviceSection: {
    marginBottom: 24,
    gap: 16,
  },
  tipsContainer: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  mistakesContainer: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
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
    lineHeight: 20,
  },
  additionalResourcesSection: {
    marginBottom: 24,
  },
  additionalResourcesList: {
    gap: 8,
  },
  additionalResourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  additionalResourceTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  actionSection: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactInfo: {
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
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