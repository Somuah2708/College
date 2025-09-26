import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, DollarSign, Calculator, TrendingUp, CreditCard, Phone, Mail, ExternalLink, MapPin, Clock, Globe, Play, Search, ChevronDown, ChevronUp, Building, Users, BookOpen, Utensils, Car, Smartphone, Heart, Shield, TriangleAlert as AlertTriangle, ChartPie as PieChart, ChartBar as BarChart3, Target, Calendar, Briefcase, Award, Info, CircleCheck as CheckCircle, Chrome as Home } from 'lucide-react-native';

interface TuitionVideo {
  id: string;
  title: string;
  youtube_url: string;
  thumbnail_url: string;
  duration: string;
  description: string;
  category: string;
  view_count: number;
  upload_date: string;
}

interface PaymentPlan {
  name: string;
  description: string;
  installments: number;
  interest_rate: number;
  setup_fee: number;
  eligibility: string;
  benefits: string[];
}

interface MealPlan {
  name: string;
  cost: number;
  description: string;
  meals_per_week: number;
  includes: string[];
  restrictions: string;
}

interface UniversityTuitionCosts {
  id: string;
  university_id: string;
  tuition_overview: string;
  fees_office_contact: any;
  local_student_detailed_fees: any;
  international_student_detailed_fees: any;
  program_specific_fees: any;
  additional_mandatory_fees: any;
  optional_fees_services: any;
  accommodation_detailed_costs: any;
  meal_plans_detailed: MealPlan[];
  living_expenses_breakdown: any;
  transportation_detailed_costs: any;
  textbooks_supplies_costs: any;
  technology_equipment_fees: any;
  health_insurance_details: any;
  payment_plans_detailed: PaymentPlan[];
  payment_methods_accepted: any[];
  late_payment_policies: string;
  refund_policies_detailed: string;
  withdrawal_procedures: string;
  financial_aid_integration: string;
  work_study_earnings: any;
  cost_comparison_tools: any;
  hidden_costs_warnings: any[];
  cost_calculator_data: any;
  cost_trends_history: any[];
  future_projections: any;
  financial_planning_resources: any[];
  budgeting_tools: any[];
  currency_conversion_rates: any;
  international_payment_support: string;
  tuition_videos: TuitionVideo[];
  emergency_financial_support: string;
  payment_assistance_programs: any[];
  cost_transparency_report: string;
  peer_institution_comparison: any[];
  financial_literacy_programs: any[];
  debt_management_resources: any[];
  created_at: string;
}

interface University {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
}

export default function TuitionCostsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [university, setUniversity] = useState<University | null>(null);
  const [tuitionData, setTuitionData] = useState<UniversityTuitionCosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Cost Calculator State
  const [calculatorData, setCalculatorData] = useState({
    studentType: 'local' as 'local' | 'international',
    program: 'general',
    accommodation: 'double_room',
    mealPlan: 'standard',
    currency: 'USD' as 'USD' | 'GHS' | 'EUR' | 'GBP'
  });

  useEffect(() => {
    fetchTuitionData();
  }, [id]);

  const fetchTuitionData = async () => {
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

      // Fetch tuition costs data
      const { data: tuitionCostsData, error: tuitionError } = await supabase
        .from('university_tuition_costs')
        .select('*')
        .eq('university_id', id);

      if (tuitionError) {
        console.error('Error fetching tuition data:', tuitionError);
        setTuitionData(null);
      } else if (tuitionData && tuitionData.length > 0) {
        setTuitionData(tuitionData[0]);
      } else {
        setTuitionData(null);
      }
    } catch (err) {
      console.error('Error fetching tuition data:', err);
      setError('Failed to load tuition information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateMockTuitionData = (university: University) => {
    const mockData: UniversityTuitionCosts = {
      id: 'mock-tuition-1',
      university_id: university.id,
      tuition_overview: `${university.name} is committed to providing accessible, high-quality education. We believe that financial constraints should not prevent talented students from pursuing their academic goals. Our comprehensive financial aid programs and flexible payment options ensure that education remains affordable for all qualified students.`,
      fees_office_contact: {
        office_name: 'Student Financial Services',
        email: 'fees@university.edu',
        phone: '+1 (555) 123-4567',
        office_hours: 'Monday-Friday: 8:00 AM - 5:00 PM',
        location: 'Student Services Building, Room 201',
        emergency_contact: '+1 (555) 123-4568',
        website: 'https://university.edu/financial-services',
        online_portal: 'https://portal.university.edu/fees'
      },
      local_student_detailed_fees: {
        base_tuition: 12500,
        registration_fee: 500,
        student_services_fee: 800,
        technology_fee: 400,
        library_fee: 200,
        health_services_fee: 300,
        activity_fee: 150,
        graduation_fee: 100,
        total_annual: 15050
      },
      international_student_detailed_fees: {
        base_tuition: 29000,
        international_student_fee: 2000,
        registration_fee: 500,
        student_services_fee: 800,
        technology_fee: 400,
        library_fee: 200,
        health_services_fee: 300,
        activity_fee: 150,
        visa_support_fee: 200,
        orientation_fee: 300,
        total_annual: 33850
      },
      program_specific_fees: {
        engineering: {
          lab_fees: 1200,
          equipment_usage: 800,
          field_trips: 400,
          software_licenses: 300,
          total_additional: 2700
        },
        medicine: {
          clinical_training: 3400,
          medical_equipment: 1200,
          hospital_placement: 1600,
          simulation_lab: 800,
          total_additional: 7000
        },
        computer_science: {
          software_licenses: 600,
          lab_access: 800,
          project_materials: 400,
          cloud_services: 200,
          total_additional: 2000
        },
        business: {
          case_studies: 300,
          simulation_software: 500,
          networking_events: 200,
          business_materials: 150,
          total_additional: 1150
        },
        arts: {
          studio_fees: 800,
          materials_supplies: 600,
          exhibition_costs: 300,
          equipment_rental: 400,
          total_additional: 2100
        }
      },
      additional_mandatory_fees: {
        student_union_fee: 150,
        sports_recreation_fee: 200,
        parking_permit: 300,
        id_card_fee: 25,
        transcript_fee: 15,
        late_registration_fee: 100
      },
      optional_fees_services: {
        premium_meal_plan: 1500,
        private_tutoring: 50,
        career_services_premium: 200,
        gym_membership: 300,
        language_courses: 400,
        music_lessons: 250
      },
      accommodation_detailed_costs: {
        on_campus: {
          single_room: 9500,
          double_room: 7200,
          suite_style: 8800,
          apartment_style: 10200
        },
        off_campus: {
          studio_apartment: 12000,
          shared_apartment: 8400,
          homestay: 9600,
          private_rental: 14400
        },
        utilities_included: {
          electricity: true,
          water: true,
          internet: true,
          heating: true,
          cable_tv: false
        }
      },
      meal_plans_detailed: [
        {
          name: 'Basic Plan',
          cost: 4000,
          description: 'Essential meal coverage for budget-conscious students',
          meals_per_week: 10,
          includes: ['Breakfast 5 days', 'Lunch 5 days', 'Limited weekend options'],
          restrictions: 'No dinner included, limited weekend dining'
        },
        {
          name: 'Standard Plan',
          cost: 5200,
          description: 'Comprehensive meal coverage for most students',
          meals_per_week: 15,
          includes: ['Breakfast daily', 'Lunch daily', 'Dinner 5 days', 'Weekend brunch'],
          restrictions: 'Limited late-night dining options'
        },
        {
          name: 'Premium Plan',
          cost: 6800,
          description: 'Unlimited dining with maximum flexibility',
          meals_per_week: 21,
          includes: ['All meals daily', 'Late-night dining', 'Guest meals', 'Premium locations'],
          restrictions: 'None - full access to all dining facilities'
        },
        {
          name: 'Commuter Plan',
          cost: 2400,
          description: 'Flexible plan for students living off-campus',
          meals_per_week: 5,
          includes: ['Lunch 5 days', 'Dining dollars', 'Flexible scheduling'],
          restrictions: 'No breakfast or dinner included'
        }
      ],
      living_expenses_breakdown: {
        monthly_estimates: {
          low_budget: {
            housing: 600,
            food: 300,
            transportation: 80,
            personal_care: 50,
            entertainment: 100,
            miscellaneous: 70,
            total: 1200
          },
          medium_budget: {
            housing: 900,
            food: 450,
            transportation: 120,
            personal_care: 80,
            entertainment: 200,
            miscellaneous: 150,
            total: 1900
          },
          high_budget: {
            housing: 1400,
            food: 650,
            transportation: 200,
            personal_care: 120,
            entertainment: 350,
            miscellaneous: 280,
            total: 3000
          }
        },
        annual_estimates: {
          textbooks: 1200,
          supplies: 400,
          clothing: 800,
          health_wellness: 600,
          technology: 500,
          travel_home: 800
        }
      },
      transportation_detailed_costs: {
        public_transport: {
          monthly_pass: 85,
          daily_pass: 4,
          single_ride: 2.5,
          student_discount: '20% off regular fares'
        },
        campus_shuttle: {
          cost: 0,
          description: 'Free shuttle service around campus and nearby areas',
          schedule: 'Every 15 minutes during peak hours'
        },
        parking: {
          student_permit: 300,
          visitor_daily: 8,
          motorcycle: 150,
          bicycle_registration: 25
        },
        ride_sharing: {
          average_cost: 12,
          campus_to_downtown: 15,
          campus_to_airport: 45
        }
      },
      textbooks_supplies_costs: {
        textbooks: {
          new_books: 1200,
          used_books: 800,
          digital_books: 600,
          rental_books: 400
        },
        supplies: {
          basic_supplies: 200,
          lab_materials: 300,
          art_supplies: 500,
          technology_accessories: 400
        },
        software: {
          microsoft_office: 0,
          adobe_creative: 240,
          specialized_software: 500,
          programming_tools: 200
        }
      },
      technology_equipment_fees: {
        laptop_requirements: {
          minimum_specs: 'Intel i5, 8GB RAM, 256GB SSD',
          recommended_cost: 1200,
          university_discount: '15% off select models'
        },
        software_licenses: {
          included: ['Microsoft Office', 'Antivirus', 'VPN Access'],
          optional: ['Adobe Creative Suite ($20/month)', 'MATLAB ($99/year)']
        },
        internet_access: {
          campus_wifi: 0,
          dorm_ethernet: 0,
          premium_bandwidth: 50
        }
      },
      health_insurance_details: {
        mandatory_coverage: {
          cost: 2400,
          coverage: 'Comprehensive medical, dental, vision',
          provider: 'University Health Plan',
          deductible: 500
        },
        optional_coverage: {
          extended_dental: 300,
          vision_premium: 150,
          mental_health_plus: 200
        },
        international_requirements: {
          minimum_coverage: 100000,
          emergency_evacuation: true,
          pre_existing_conditions: 'Covered after 12 months'
        }
      },
      payment_plans_detailed: [
        {
          name: 'Semester Payment Plan',
          description: 'Pay tuition in two installments per academic year',
          installments: 2,
          interest_rate: 0,
          setup_fee: 0,
          eligibility: 'All students in good standing',
          benefits: ['No interest charges', 'Automatic enrollment', 'Flexible due dates']
        },
        {
          name: 'Monthly Payment Plan',
          description: 'Spread payments over 10 months for better cash flow',
          installments: 10,
          interest_rate: 2.5,
          setup_fee: 50,
          eligibility: 'Credit check required for amounts over $5,000',
          benefits: ['Lower monthly payments', 'Budget-friendly', 'Online management']
        },
        {
          name: 'Extended Payment Plan',
          description: 'Long-term payment option for larger amounts',
          installments: 48,
          interest_rate: 4.5,
          setup_fee: 100,
          eligibility: 'Credit approval required, minimum income verification',
          benefits: ['Lowest monthly payments', 'Up to 4 years', 'Early payment discounts']
        }
      ],
      payment_methods_accepted: [
        { method: 'Credit/Debit Cards', fee: '2.5%', processing_time: 'Immediate' },
        { method: 'Bank Transfer', fee: 'Free', processing_time: '1-3 business days' },
        { method: 'Check', fee: 'Free', processing_time: '5-7 business days' },
        { method: 'Cash', fee: 'Free', processing_time: 'Immediate' },
        { method: 'International Wire', fee: '$25', processing_time: '3-5 business days' }
      ],
      late_payment_policies: 'Late payment fees of $100 are charged for payments received after the due date. Students with outstanding balances may be restricted from registering for future terms and accessing transcripts. Payment plans are available to avoid late fees.',
      refund_policies_detailed: 'Tuition refunds are calculated based on withdrawal date: 100% refund before classes start, 75% refund within first week, 50% refund within second week, 25% refund within third week, no refund after third week. Accommodation and meal plan refunds follow separate policies.',
      withdrawal_procedures: 'Students must complete official withdrawal forms through the Registrar\'s Office. Academic and financial implications will be explained during the withdrawal process. Refund calculations will be provided within 5 business days.',
      financial_aid_integration: 'Financial aid is automatically applied to student accounts before payment due dates. Work-study earnings are paid bi-weekly directly to students. Scholarship funds are disbursed at the beginning of each semester.',
      work_study_earnings: {
        average_hourly_rate: 12,
        maximum_hours_per_week: 20,
        typical_monthly_earnings: 800,
        popular_positions: ['Library Assistant', 'Lab Monitor', 'Tutor', 'Administrative Support']
      },
      cost_comparison_tools: {
        peer_institutions: [
          { name: 'State University A', tuition: 13200, total_cost: 28500 },
          { name: 'Private College B', tuition: 32000, total_cost: 48000 },
          { name: 'Community College C', tuition: 3500, total_cost: 18000 }
        ],
        national_average: {
          public_tuition: 11560,
          private_tuition: 38070,
          total_cost_public: 26820,
          total_cost_private: 53430
        }
      },
      hidden_costs_warnings: [
        {
          category: 'Academic',
          items: [
            { item: 'Lab breakage fees', cost: '$50-200', frequency: 'If applicable' },
            { item: 'Late library fees', cost: '$5/day', frequency: 'Per overdue item' },
            { item: 'Transcript fees', cost: '$10 each', frequency: 'Per request' },
            { item: 'Course repeat surcharge', cost: '25% additional', frequency: 'Per repeated course' }
          ]
        },
        {
          category: 'Living',
          items: [
            { item: 'Laundry costs', cost: '$3-5/load', frequency: 'Weekly' },
            { item: 'Room damage fees', cost: '$25-500', frequency: 'If applicable' },
            { item: 'Key replacement', cost: '$50', frequency: 'If lost' },
            { item: 'Cleaning fees', cost: '$75-150', frequency: 'End of semester' }
          ]
        },
        {
          category: 'International',
          items: [
            { item: 'Visa application fees', cost: '$160-350', frequency: 'Per application' },
            { item: 'SEVIS fee', cost: '$350', frequency: 'One-time' },
            { item: 'International orientation', cost: '$100', frequency: 'Mandatory' },
            { item: 'Currency conversion fees', cost: '2-4%', frequency: 'Per transaction' }
          ]
        }
      ],
      cost_calculator_data: {
        currency_rates: {
          USD: 1.0,
          GHS: 12.5,
          EUR: 0.85,
          GBP: 0.73
        },
        program_multipliers: {
          general: 1.0,
          engineering: 1.18,
          medicine: 1.47,
          computer_science: 1.13,
          business: 1.08,
          arts: 1.14
        }
      },
      cost_trends_history: [
        { year: 2020, local_tuition: 10000, international_tuition: 24000, total_cost_local: 22000, total_cost_international: 38000 },
        { year: 2021, local_tuition: 10500, international_tuition: 25200, total_cost_local: 23100, total_cost_international: 39900 },
        { year: 2022, local_tuition: 11000, international_tuition: 26400, total_cost_local: 24200, total_cost_international: 41800 },
        { year: 2023, local_tuition: 11600, international_tuition: 27720, total_cost_local: 25400, total_cost_international: 43900 },
        { year: 2024, local_tuition: 12200, international_tuition: 29000, total_cost_local: 26700, total_cost_international: 46100 },
        { year: 2025, local_tuition: 12500, international_tuition: 29000, total_cost_local: 27500, total_cost_international: 47500 }
      ],
      future_projections: {
        2026: { local_tuition: 13000, international_tuition: 30500, increase_rate: 4.0 },
        2027: { local_tuition: 13500, international_tuition: 32000, increase_rate: 3.8 },
        2028: { local_tuition: 14000, international_tuition: 33500, increase_rate: 3.7 }
      },
      financial_planning_resources: [
        {
          title: 'Budget Planner Tool',
          description: 'Interactive tool to plan your education budget',
          url: 'https://university.edu/budget-planner',
          type: 'tool'
        },
        {
          title: 'Financial Literacy Workshops',
          description: 'Monthly workshops on personal finance management',
          url: 'https://university.edu/financial-workshops',
          type: 'workshop'
        },
        {
          title: 'Scholarship Database',
          description: 'Comprehensive database of available scholarships',
          url: 'https://university.edu/scholarships',
          type: 'database'
        },
        {
          title: 'Emergency Aid Application',
          description: 'Apply for emergency financial assistance',
          url: 'https://university.edu/emergency-aid',
          type: 'application'
        }
      ],
      budgeting_tools: [
        {
          name: 'Monthly Budget Calculator',
          description: 'Calculate your monthly expenses and income',
          features: ['Income tracking', 'Expense categorization', 'Savings goals']
        },
        {
          name: 'Cost of Attendance Estimator',
          description: 'Estimate total cost based on your choices',
          features: ['Program-specific costs', 'Lifestyle adjustments', 'Financial aid integration']
        },
        {
          name: 'Payment Schedule Planner',
          description: 'Plan your payment schedule throughout the year',
          features: ['Due date reminders', 'Payment amount calculations', 'Late fee warnings']
        }
      ],
      currency_conversion_rates: {
        USD: 1.0,
        GHS: 12.5,
        EUR: 0.85,
        GBP: 0.73,
        CAD: 1.25,
        AUD: 1.35,
        last_updated: '2025-01-15T10:00:00Z'
      },
      international_payment_support: 'International students can pay in multiple currencies through our global payment portal. We accept wire transfers, international credit cards, and work with Flywire for secure international payments. Currency conversion is handled automatically with competitive exchange rates.',
      tuition_videos: Array.from({ length: 25 }, (_, index) => {
        const categories = [
          'overview', 'payment_plans', 'hidden_costs', 'international', 'accommodation',
          'financial_aid', 'budgeting', 'calculator_tutorial', 'payment_methods', 'refund_policies',
          'cost_trends', 'emergency_aid', 'work_study', 'meal_plans', 'transportation'
        ];
        const category = categories[index % categories.length];
        
        return {
          id: `tuition-video-${index + 1}`,
          title: `${category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${university.name}`,
          youtube_url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${index}`,
          thumbnail_url: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`,
          duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          description: `Comprehensive guide to ${category.replace('_', ' ')} at ${university.name}`,
          category: category,
          view_count: Math.floor(Math.random() * 10000) + 1000,
          upload_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        };
      }),
      emergency_financial_support: 'Emergency financial assistance is available for students facing unexpected financial hardship. Applications are reviewed within 48 hours. Support includes emergency grants up to $2,000, temporary payment deferrals, and connection to community resources.',
      payment_assistance_programs: [
        {
          name: 'Emergency Grant Program',
          description: 'Immediate financial assistance for crisis situations',
          max_amount: 2000,
          processing_time: '48 hours',
          eligibility: 'Demonstrated financial emergency'
        },
        {
          name: 'Payment Deferral Program',
          description: 'Temporary postponement of payment due dates',
          max_deferral: '60 days',
          fee: 25,
          eligibility: 'Good academic standing'
        },
        {
          name: 'Hardship Payment Plan',
          description: 'Extended payment terms for financial hardship',
          terms: 'Up to 24 months',
          interest_rate: 1.5,
          eligibility: 'Financial counseling required'
        }
      ],
      cost_transparency_report: 'Our annual cost transparency report shows how tuition dollars are allocated: 65% academic programs and faculty, 15% student services and support, 10% facilities and maintenance, 5% administration, 5% financial aid and scholarships.',
      peer_institution_comparison: [
        {
          institution: 'Harvard University',
          tuition: 54269,
          total_cost: 73800,
          ranking: 1,
          location: 'Cambridge, MA'
        },
        {
          institution: 'Stanford University',
          tuition: 56169,
          total_cost: 78218,
          ranking: 2,
          location: 'Stanford, CA'
        },
        {
          institution: 'MIT',
          tuition: 53790,
          total_cost: 73160,
          ranking: 3,
          location: 'Cambridge, MA'
        }
      ],
      financial_literacy_programs: [
        {
          title: 'Personal Finance 101',
          description: 'Basic financial literacy for college students',
          duration: '2 hours',
          frequency: 'Monthly',
          topics: ['Budgeting', 'Credit scores', 'Student loans', 'Saving strategies']
        },
        {
          title: 'Investment Basics Workshop',
          description: 'Introduction to investing and building wealth',
          duration: '3 hours',
          frequency: 'Quarterly',
          topics: ['Stock market basics', 'Retirement planning', 'Risk management']
        }
      ],
      debt_management_resources: [
        {
          title: 'Student Loan Counseling',
          description: 'Mandatory counseling for federal loan recipients',
          provider: 'Financial Aid Office',
          format: 'Online and in-person sessions'
        },
        {
          title: 'Debt Consolidation Guidance',
          description: 'Help with managing multiple loans and debts',
          provider: 'Financial Counseling Center',
          format: 'Individual counseling sessions'
        }
      ],
      created_at: new Date().toISOString()
    };

    setTuitionData(mockData);
  };

  const calculateTotalCost = () => {
    if (!tuitionData) return 0;

    let baseTuition = 0;
    let accommodationCost = 0;
    let mealPlanCost = 0;

    // Base tuition
    if (calculatorData.studentType === 'local') {
      baseTuition = tuitionData.local_student_detailed_fees?.total_annual || 15050;
    } else {
      baseTuition = tuitionData.international_student_detailed_fees?.total_annual || 33850;
    }

    // Program-specific fees
    const programFees = tuitionData.program_specific_fees?.[calculatorData.program]?.total_additional || 0;
    baseTuition += programFees;

    // Accommodation costs
    const accommodationCosts = tuitionData.accommodation_detailed_costs;
    if (accommodationCosts) {
      if (calculatorData.accommodation.includes('campus')) {
        accommodationCost = accommodationCosts.on_campus?.[calculatorData.accommodation] || 0;
      } else {
        accommodationCost = accommodationCosts.off_campus?.[calculatorData.accommodation] || 0;
      }
    }

    // Meal plan costs
    const selectedMealPlan = tuitionData.meal_plans_detailed?.find(plan => 
      plan.name.toLowerCase().includes(calculatorData.mealPlan)
    );
    mealPlanCost = selectedMealPlan?.cost || 0;

    const totalUSD = baseTuition + accommodationCost + mealPlanCost;
    
    // Convert to selected currency
    const conversionRate = tuitionData.currency_conversion_rates?.[calculatorData.currency] || 1;
    return totalUSD * conversionRate;
  };

  const formatCurrency = (amount: number, currency: string = calculatorData.currency) => {
    const symbols = { USD: '$', GHS: '₵', EUR: '€', GBP: '£' };
    const symbol = symbols[currency as keyof typeof symbols] || '$';
    return `${symbol}${amount.toLocaleString()}`;
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

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const filterVideos = () => {
    if (!tuitionData?.tuition_videos) return [];
    
    let filtered = tuitionData.tuition_videos;
    
    if (selectedVideoCategory !== 'all') {
      filtered = filtered.filter(video => video.category === selectedVideoCategory);
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading tuition and cost information...</Text>
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

  if (!tuitionData) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.programName}>Tuition & Costs</Text>
              <Text style={styles.universityName}>{university.name}</Text>
            </View>
          </View>

          <View style={styles.noDataContainer}>
            <DollarSign size={48} color="#9CA3AF" />
            <Text style={styles.noDataTitle}>Tuition Information Not Available</Text>
            <Text style={styles.noDataText}>
              Detailed tuition and cost information for {university.name} is not currently available in our database.
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

  const videoCategories = [
    { key: 'all', label: 'All Videos', count: tuitionData.tuition_videos.length },
    { key: 'overview', label: 'Overview', count: tuitionData.tuition_videos.filter(v => v.category === 'overview').length },
    { key: 'payment_plans', label: 'Payment Plans', count: tuitionData.tuition_videos.filter(v => v.category === 'payment_plans').length },
    { key: 'hidden_costs', label: 'Hidden Costs', count: tuitionData.tuition_videos.filter(v => v.category === 'hidden_costs').length },
    { key: 'international', label: 'International', count: tuitionData.tuition_videos.filter(v => v.category === 'international').length },
    { key: 'financial_aid', label: 'Financial Aid', count: tuitionData.tuition_videos.filter(v => v.category === 'financial_aid').length }
  ];

  const filteredVideos = filterVideos();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.programName}>Tuition & Costs</Text>
            <Text style={styles.universityName}>{university.name}</Text>
          </View>
        </View>

        {/* Overview Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Financial Overview</Text>
          </View>
          <Text style={styles.sectionContent}>{tuitionData.tuition_overview}</Text>
          
          {/* Contact Information */}
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>{tuitionData.fees_office_contact?.office_name || 'Student Financial Services'}</Text>
            <View style={styles.contactDetails}>
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => sendEmail(tuitionData.fees_office_contact?.email, 'Tuition Inquiry')}
              >
                <Mail size={16} color="#3B82F6" />
                <Text style={styles.contactText}>{tuitionData.fees_office_contact?.email}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => callPhone(tuitionData.fees_office_contact?.phone)}
              >
                <Phone size={16} color="#10B981" />
                <Text style={styles.contactText}>{tuitionData.fees_office_contact?.phone}</Text>
              </TouchableOpacity>
              
              <View style={styles.contactItem}>
                <Clock size={16} color="#F59E0B" />
                <Text style={styles.contactText}>{tuitionData.fees_office_contact?.office_hours}</Text>
              </View>
              
              <View style={styles.contactItem}>
                <MapPin size={16} color="#8B5CF6" />
                <Text style={styles.contactText}>{tuitionData.fees_office_contact?.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Interactive Cost Calculator */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calculator size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Cost Calculator</Text>
          </View>
          
          <View style={styles.calculatorContainer}>
            {/* Student Type Selection */}
            <View style={styles.calculatorGroup}>
              <Text style={styles.calculatorLabel}>Student Type</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.calculatorButton,
                    calculatorData.studentType === 'local' && styles.calculatorButtonActive
                  ]}
                  onPress={() => setCalculatorData({...calculatorData, studentType: 'local'})}
                >
                  <Text style={[
                    styles.calculatorButtonText,
                    calculatorData.studentType === 'local' && styles.calculatorButtonTextActive
                  ]}>
                    Local Student
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.calculatorButton,
                    calculatorData.studentType === 'international' && styles.calculatorButtonActive
                  ]}
                  onPress={() => setCalculatorData({...calculatorData, studentType: 'international'})}
                >
                  <Text style={[
                    styles.calculatorButtonText,
                    calculatorData.studentType === 'international' && styles.calculatorButtonTextActive
                  ]}>
                    International Student
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Program Selection */}
            <View style={styles.calculatorGroup}>
              <Text style={styles.calculatorLabel}>Program</Text>
              <View style={styles.programGrid}>
                {['general', 'engineering', 'medicine', 'computer_science', 'business', 'arts'].map((program) => (
                  <TouchableOpacity
                    key={program}
                    style={[
                      styles.programButton,
                      calculatorData.program === program && styles.programButtonActive
                    ]}
                    onPress={() => setCalculatorData({...calculatorData, program})}
                  >
                    <Text style={[
                      styles.programButtonText,
                      calculatorData.program === program && styles.programButtonTextActive
                    ]}>
                      {program.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Accommodation Selection */}
            <View style={styles.calculatorGroup}>
              <Text style={styles.calculatorLabel}>Accommodation</Text>
              <View style={styles.accommodationGrid}>
                {[
                  { key: 'single_room', label: 'Single Room', icon: Home },
                  { key: 'double_room', label: 'Double Room', icon: Users },
                  { key: 'suite_style', label: 'Suite Style', icon: Building },
                  { key: 'apartment_style', label: 'Apartment', icon: Home }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.accommodationButton,
                      calculatorData.accommodation === option.key && styles.accommodationButtonActive
                    ]}
                    onPress={() => setCalculatorData({...calculatorData, accommodation: option.key})}
                  >
                    <option.icon size={20} color={calculatorData.accommodation === option.key ? '#FFFFFF' : '#6B7280'} />
                    <Text style={[
                      styles.accommodationButtonText,
                      calculatorData.accommodation === option.key && styles.accommodationButtonTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Meal Plan Selection */}
            <View style={styles.calculatorGroup}>
              <Text style={styles.calculatorLabel}>Meal Plan</Text>
              <View style={styles.mealPlanGrid}>
                {tuitionData.meal_plans_detailed?.map((plan) => (
                  <TouchableOpacity
                    key={plan.name}
                    style={[
                      styles.mealPlanButton,
                      calculatorData.mealPlan === plan.name.toLowerCase().replace(' ', '_') && styles.mealPlanButtonActive
                    ]}
                    onPress={() => setCalculatorData({...calculatorData, mealPlan: plan.name.toLowerCase().replace(' ', '_')})}
                  >
                    <Utensils size={16} color={calculatorData.mealPlan === plan.name.toLowerCase().replace(' ', '_') ? '#FFFFFF' : '#6B7280'} />
                    <Text style={[
                      styles.mealPlanButtonText,
                      calculatorData.mealPlan === plan.name.toLowerCase().replace(' ', '_') && styles.mealPlanButtonTextActive
                    ]}>
                      {plan.name}
                    </Text>
                    <Text style={[
                      styles.mealPlanCost,
                      calculatorData.mealPlan === plan.name.toLowerCase().replace(' ', '_') && styles.mealPlanCostActive
                    ]}>
                      {formatCurrency(plan.cost)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Currency Selection */}
            <View style={styles.calculatorGroup}>
              <Text style={styles.calculatorLabel}>Currency</Text>
              <View style={styles.currencyGrid}>
                {['USD', 'GHS', 'EUR', 'GBP'].map((currency) => (
                  <TouchableOpacity
                    key={currency}
                    style={[
                      styles.currencyButton,
                      calculatorData.currency === currency && styles.currencyButtonActive
                    ]}
                    onPress={() => setCalculatorData({...calculatorData, currency: currency as any})}
                  >
                    <Globe size={16} color={calculatorData.currency === currency ? '#FFFFFF' : '#6B7280'} />
                    <Text style={[
                      styles.currencyButtonText,
                      calculatorData.currency === currency && styles.currencyButtonTextActive
                    ]}>
                      {currency}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Total Cost Display */}
            <View style={styles.totalCostContainer}>
              <Text style={styles.totalCostLabel}>Estimated Annual Total</Text>
              <Text style={styles.totalCostValue}>{formatCurrency(calculateTotalCost())}</Text>
              <Text style={styles.totalCostNote}>
                *Includes tuition, accommodation, and meal plan. Additional costs may apply.
              </Text>
            </View>
          </View>
        </View>

        {/* Tuition Breakdown */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('tuition_breakdown')}
          >
            <BookOpen size={24} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Detailed Tuition Breakdown</Text>
            {expandedSections.has('tuition_breakdown') ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('tuition_breakdown') && (
            <View style={styles.tuitionBreakdown}>
              <View style={styles.tuitionComparison}>
                {/* Local Students */}
                <View style={styles.tuitionColumn}>
                  <Text style={styles.tuitionColumnTitle}>Local Students</Text>
                  <View style={styles.feesList}>
                    {Object.entries(tuitionData.local_student_detailed_fees || {}).map(([fee, amount]) => (
                      <View key={fee} style={styles.feeItem}>
                        <Text style={styles.feeLabel}>{fee.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
                        <Text style={styles.feeAmount}>{formatCurrency(amount as number)}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* International Students */}
                <View style={styles.tuitionColumn}>
                  <Text style={styles.tuitionColumnTitle}>International Students</Text>
                  <View style={styles.feesList}>
                    {Object.entries(tuitionData.international_student_detailed_fees || {}).map(([fee, amount]) => (
                      <View key={fee} style={styles.feeItem}>
                        <Text style={styles.feeLabel}>{fee.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
                        <Text style={styles.feeAmount}>{formatCurrency(amount as number)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Program-Specific Fees */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('program_fees')}
          >
            <Briefcase size={24} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Program-Specific Fees</Text>
            {expandedSections.has('program_fees') ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('program_fees') && (
            <View style={styles.programFeesContainer}>
              {Object.entries(tuitionData.program_specific_fees || {}).map(([program, fees]: [string, any]) => (
                <View key={program} style={styles.programFeeCard}>
                  <Text style={styles.programFeeTitle}>
                    {program.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                  <View style={styles.programFeesList}>
                    {Object.entries(fees).filter(([key]) => key !== 'total_additional').map(([fee, amount]) => (
                      <View key={fee} style={styles.programFeeItem}>
                        <Text style={styles.programFeeLabel}>
                          {fee.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Text>
                        <Text style={styles.programFeeAmount}>{formatCurrency(amount as number)}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.programFeeTotalContainer}>
                    <Text style={styles.programFeeTotalLabel}>Additional Program Cost:</Text>
                    <Text style={styles.programFeeTotalAmount}>{formatCurrency(fees.total_additional)}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Living Expenses */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('living_expenses')}
          >
            <Home size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Living Expenses</Text>
            {expandedSections.has('living_expenses') ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('living_expenses') && (
            <View style={styles.livingExpensesContainer}>
              <Text style={styles.livingExpensesTitle}>Monthly Budget Estimates</Text>
              <View style={styles.budgetComparison}>
                {Object.entries(tuitionData.living_expenses_breakdown?.monthly_estimates || {}).map(([budget, costs]: [string, any]) => (
                  <View key={budget} style={styles.budgetColumn}>
                    <Text style={styles.budgetTitle}>
                      {budget.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                    <View style={styles.budgetItems}>
                      {Object.entries(costs).filter(([key]) => key !== 'total').map(([category, amount]) => (
                        <View key={category} style={styles.budgetItem}>
                          <Text style={styles.budgetCategory}>
                            {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Text>
                          <Text style={styles.budgetAmount}>{formatCurrency(amount as number)}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.budgetTotal}>
                      <Text style={styles.budgetTotalLabel}>Monthly Total:</Text>
                      <Text style={styles.budgetTotalAmount}>{formatCurrency(costs.total)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Payment Plans */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('payment_plans')}
          >
            <CreditCard size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>Payment Plans & Methods</Text>
            {expandedSections.has('payment_plans') ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('payment_plans') && (
            <View style={styles.paymentPlansContainer}>
              {tuitionData.payment_plans_detailed?.map((plan, index) => (
                <View key={index} style={styles.paymentPlanCard}>
                  <Text style={styles.paymentPlanName}>{plan.name}</Text>
                  <Text style={styles.paymentPlanDescription}>{plan.description}</Text>
                  
                  <View style={styles.paymentPlanDetails}>
                    <View style={styles.paymentPlanDetail}>
                      <Text style={styles.paymentPlanDetailLabel}>Installments:</Text>
                      <Text style={styles.paymentPlanDetailValue}>{plan.installments}</Text>
                    </View>
                    <View style={styles.paymentPlanDetail}>
                      <Text style={styles.paymentPlanDetailLabel}>Interest Rate:</Text>
                      <Text style={styles.paymentPlanDetailValue}>{plan.interest_rate}%</Text>
                    </View>
                    <View style={styles.paymentPlanDetail}>
                      <Text style={styles.paymentPlanDetailLabel}>Setup Fee:</Text>
                      <Text style={styles.paymentPlanDetailValue}>{formatCurrency(plan.setup_fee)}</Text>
                    </View>
                  </View>

                  <View style={styles.benefitsContainer}>
                    <Text style={styles.benefitsTitle}>Benefits:</Text>
                    {plan.benefits.map((benefit, benefitIndex) => (
                      <View key={benefitIndex} style={styles.benefitItem}>
                        <CheckCircle size={12} color="#10B981" />
                        <Text style={styles.benefitText}>{benefit}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}

              {/* Payment Methods */}
              <View style={styles.paymentMethodsContainer}>
                <Text style={styles.paymentMethodsTitle}>Accepted Payment Methods</Text>
                <View style={styles.paymentMethodsList}>
                  {tuitionData.payment_methods_accepted?.map((method, index) => (
                    <View key={index} style={styles.paymentMethodCard}>
                      <Text style={styles.paymentMethodName}>{method.method}</Text>
                      <Text style={styles.paymentMethodFee}>Fee: {method.fee}</Text>
                      <Text style={styles.paymentMethodTime}>Processing: {method.processing_time}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Hidden Costs Warning */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('hidden_costs')}
          >
            <AlertTriangle size={24} color="#DC2626" />
            <Text style={styles.sectionTitle}>Hidden Costs & Additional Fees</Text>
            {expandedSections.has('hidden_costs') ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('hidden_costs') && (
            <View style={styles.hiddenCostsContainer}>
              {tuitionData.hidden_costs_warnings?.map((category, index) => (
                <View key={index} style={styles.hiddenCostCategory}>
                  <Text style={styles.hiddenCostCategoryTitle}>{category.category}</Text>
                  <View style={styles.hiddenCostItems}>
                    {category.items.map((item: any, itemIndex: number) => (
                      <View key={itemIndex} style={styles.hiddenCostItem}>
                        <View style={styles.hiddenCostInfo}>
                          <Text style={styles.hiddenCostItemName}>{item.item}</Text>
                          <Text style={styles.hiddenCostFrequency}>{item.frequency}</Text>
                        </View>
                        <Text style={styles.hiddenCostAmount}>{item.cost}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Cost Trends */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('cost_trends')}
          >
            <TrendingUp size={24} color="#06B6D4" />
            <Text style={styles.sectionTitle}>Historical Cost Trends</Text>
            {expandedSections.has('cost_trends') ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('cost_trends') && (
            <View style={styles.costTrendsContainer}>
              <Text style={styles.trendsTitle}>6-Year Cost History</Text>
              <View style={styles.trendsChart}>
                {tuitionData.cost_trends_history?.map((year, index) => (
                  <View key={year.year} style={styles.trendItem}>
                    <Text style={styles.trendYear}>{year.year}</Text>
                    <View style={styles.trendBars}>
                      <View style={styles.trendBar}>
                        <Text style={styles.trendLabel}>Local</Text>
                        <Text style={styles.trendValue}>{formatCurrency(year.local_tuition)}</Text>
                      </View>
                      <View style={styles.trendBar}>
                        <Text style={styles.trendLabel}>International</Text>
                        <Text style={styles.trendValue}>{formatCurrency(year.international_tuition)}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Financial Planning Resources */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('financial_planning')}
          >
            <Target size={24} color="#EC4899" />
            <Text style={styles.sectionTitle}>Financial Planning Resources</Text>
            {expandedSections.has('financial_planning') ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSections.has('financial_planning') && (
            <View style={styles.financialPlanningContainer}>
              <View style={styles.resourcesList}>
                {tuitionData.financial_planning_resources?.map((resource, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.resourceCard}
                    onPress={() => openExternalLink(resource.url)}
                  >
                    <View style={styles.resourceIcon}>
                      <Target size={20} color="#EC4899" />
                    </View>
                    <View style={styles.resourceInfo}>
                      <Text style={styles.resourceTitle}>{resource.title}</Text>
                      <Text style={styles.resourceDescription}>{resource.description}</Text>
                      <Text style={styles.resourceType}>{resource.type.toUpperCase()}</Text>
                    </View>
                    <ExternalLink size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Emergency Financial Support */}
              <View style={styles.emergencySupport}>
                <View style={styles.emergencySupportHeader}>
                  <Heart size={20} color="#EF4444" />
                  <Text style={styles.emergencySupportTitle}>Emergency Financial Support</Text>
                </View>
                <Text style={styles.emergencySupportText}>{tuitionData.emergency_financial_support}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Tuition Videos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Play size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>Tuition & Cost Videos ({tuitionData.tuition_videos?.length || 0})</Text>
          </View>

          {/* Video Search and Filter */}
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

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.videoCategoryFilter}>
              {videoCategories.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.videoCategoryButton,
                    selectedVideoCategory === category.key && styles.videoCategoryButtonActive
                  ]}
                  onPress={() => setSelectedVideoCategory(category.key)}
                >
                  <Text style={[
                    styles.videoCategoryText,
                    selectedVideoCategory === category.key && styles.videoCategoryTextActive
                  ]}>
                    {category.label} ({category.count})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Videos Grid */}
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
                </View>
                <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                <Text style={styles.videoDescription} numberOfLines={2}>{video.description}</Text>
                <View style={styles.videoMeta}>
                  <Text style={styles.videoViews}>{video.view_count.toLocaleString()} views</Text>
                  <Text style={styles.videoDate}>{new Date(video.upload_date).toLocaleDateString()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionButtons}>
          {tuitionData.fees_office_contact?.online_portal && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => openExternalLink(tuitionData.fees_office_contact.online_portal)}
            >
              <Globe size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Payment Portal</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => sendEmail(tuitionData.fees_office_contact?.email, 'Tuition Cost Inquiry')}
          >
            <Mail size={20} color="#3B82F6" />
            <Text style={styles.secondaryButtonText}>Contact Office</Text>
          </TouchableOpacity>
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
    flex: 1,
  },
  sectionContent: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  contactCard: {
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
  calculatorContainer: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  calculatorGroup: {
    marginBottom: 20,
  },
  calculatorLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  calculatorButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  calculatorButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  calculatorButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  calculatorButtonTextActive: {
    color: '#FFFFFF',
  },
  programGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  programButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  programButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  programButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  programButtonTextActive: {
    color: '#FFFFFF',
  },
  accommodationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accommodationButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  accommodationButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  accommodationButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  accommodationButtonTextActive: {
    color: '#FFFFFF',
  },
  mealPlanGrid: {
    gap: 8,
  },
  mealPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  mealPlanButtonActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  mealPlanButtonText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  mealPlanButtonTextActive: {
    color: '#FFFFFF',
  },
  mealPlanCost: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  mealPlanCostActive: {
    color: '#FFFFFF',
  },
  currencyGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  currencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  currencyButtonActive: {
    backgroundColor: '#06B6D4',
    borderColor: '#06B6D4',
  },
  currencyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  currencyButtonTextActive: {
    color: '#FFFFFF',
  },
  totalCostContainer: {
    backgroundColor: '#10B98115',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  totalCostLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    marginBottom: 8,
  },
  totalCostValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 8,
  },
  totalCostNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  tuitionBreakdown: {
    marginTop: 16,
  },
  tuitionComparison: {
    flexDirection: 'row',
    gap: 16,
  },
  tuitionColumn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tuitionColumnTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  feesList: {
    gap: 8,
  },
  feeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  feeLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flex: 1,
  },
  feeAmount: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  programFeesContainer: {
    marginTop: 16,
    gap: 16,
  },
  programFeeCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  programFeeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  programFeesList: {
    gap: 6,
    marginBottom: 12,
  },
  programFeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programFeeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  programFeeAmount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  programFeeTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  programFeeTotalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  programFeeTotalAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  livingExpensesContainer: {
    marginTop: 16,
  },
  livingExpensesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  budgetComparison: {
    gap: 16,
  },
  budgetColumn: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  budgetTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  budgetItems: {
    gap: 6,
  },
  budgetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  budgetAmount: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  budgetTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
  },
  budgetTotalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  budgetTotalAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  paymentPlansContainer: {
    marginTop: 16,
    gap: 16,
  },
  paymentPlanCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentPlanName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  paymentPlanDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  paymentPlanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentPlanDetail: {
    alignItems: 'center',
  },
  paymentPlanDetailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  paymentPlanDetailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  benefitsContainer: {
    marginTop: 12,
  },
  benefitsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  paymentMethodsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  paymentMethodsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  paymentMethodsList: {
    gap: 8,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentMethodName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  paymentMethodFee: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
  },
  paymentMethodTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  hiddenCostsContainer: {
    marginTop: 16,
    gap: 16,
  },
  hiddenCostCategory: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  hiddenCostCategoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginBottom: 12,
  },
  hiddenCostItems: {
    gap: 8,
  },
  hiddenCostItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },
  hiddenCostInfo: {
    flex: 1,
  },
  hiddenCostItemName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  hiddenCostFrequency: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  hiddenCostAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#DC2626',
  },
  costTrendsContainer: {
    marginTop: 16,
  },
  trendsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  trendsChart: {
    gap: 8,
  },
  trendItem: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  trendYear: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  trendBars: {
    flexDirection: 'row',
    gap: 12,
  },
  trendBar: {
    flex: 1,
  },
  trendLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  trendValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  financialPlanningContainer: {
    marginTop: 16,
  },
  resourcesList: {
    gap: 12,
    marginBottom: 20,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EC489915',
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
  resourceType: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#EC4899',
  },
  emergencySupport: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  emergencySupportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencySupportTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    marginLeft: 8,
  },
  emergencySupportText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#991B1B',
    lineHeight: 20,
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
  videoCategoryFilter: {
    flexDirection: 'row',
  },
  videoCategoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  videoCategoryButtonActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  videoCategoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  videoCategoryTextActive: {
    color: '#FFFFFF',
  },
  videosContainer: {
    marginTop: 8,
  },
  videoCard: {
    width: 200,
    marginRight: 16,
  },
  videoThumbnail: {
    position: 'relative',
    width: '100%',
    height: 112,
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
  videoDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 6,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoViews: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  videoDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
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