import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert, Modal, Switch, Dimensions } from 'react-native';
import { X, Calculator, Plus, Trash2, Save, TrendingUp, Award, Target, BookOpen, Calendar, ChartBar as BarChart3, ChartPie as PieChart, CreditCard as Edit3, Download, Upload, RefreshCw, Star, Clock, Brain, Zap, CircleCheck as CheckCircle, CircleAlert as AlertCircle, FileText, Settings, ListFilter as Filter, Search, RotateCcw, Copy, Share, Eye, EyeOff, Lightbulb, TrendingDown } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface Course {
  id: string;
  courseName: string;
  courseCode: string;
  credits: number;
  grade: string;
  gradePoints: number;
  semester: string;
  year: string;
  category: 'core' | 'elective' | 'major' | 'minor';
  instructor?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  studyHours?: number;
  attendance?: number;
  assignments?: Assignment[];
  exams?: Exam[];
  notes?: string;
  isRetake?: boolean;
  originalGrade?: string;
  completionDate?: string;
  syllabus?: string;
  textbooks?: string[];
  prerequisites?: string[];
  learningOutcomes?: string[];
}

interface Assignment {
  id: string;
  title: string;
  type: 'homework' | 'project' | 'quiz' | 'presentation' | 'lab';
  dueDate: string;
  maxPoints: number;
  earnedPoints: number;
  weight: number; // percentage of final grade
  completed: boolean;
  submissionDate?: string;
  feedback?: string;
}

interface Exam {
  id: string;
  title: string;
  type: 'midterm' | 'final' | 'quiz' | 'practical';
  date: string;
  maxPoints: number;
  earnedPoints: number;
  weight: number; // percentage of final grade
  duration: string;
  topics: string[];
  studyTime?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GPAGoal {
  id: string;
  title: string;
  targetGPA: number;
  targetDate: string;
  currentGPA: number;
  progress: number;
  strategy: string;
  milestones: GoalMilestone[];
  achieved: boolean;
  achievedDate?: string;
}

interface GoalMilestone {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  completed: boolean;
  completedDate?: string;
}

interface Semester {
  id: string;
  name: string;
  year: string;
  courses: Course[];
  gpa: number;
  totalCredits: number;
  targetGPA?: number;
  rank?: number;
  totalStudents?: number;
  deansList?: boolean;
  probation?: boolean;
  notes?: string;
  achievements?: string[];
}

interface GPACalculatorProps {
  onClose: () => void;
}

export default function GPACalculator({ onClose }: GPACalculatorProps) {
  const [activeTab, setActiveTab] = useState<'calculator' | 'courses' | 'semesters' | 'analytics' | 'goals' | 'tracker'>('calculator');
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [gpaGoals, setGpaGoals] = useState<GPAGoal[]>([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [showCourseDetails, setShowCourseDetails] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingGoal, setEditingGoal] = useState<GPAGoal | null>(null);
  const [targetGPA, setTargetGPA] = useState<number>(3.7);
  const [gpaGoal, setGpaGoal] = useState<number>(3.7);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'grade' | 'credits' | 'date'>('name');
  const [showPrivateData, setShowPrivateData] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<string>('all');

  // Form state for adding/editing courses
  const [courseForm, setCourseForm] = useState({
    courseName: '',
    courseCode: '',
    credits: 3,
    grade: 'A',
    semester: 'Fall 2024',
    year: '2024',
    category: 'core' as const,
    instructor: '',
    difficulty: 'medium' as const,
    studyHours: 0,
    attendance: 100,
    notes: '',
    isRetake: false,
    syllabus: '',
    textbooks: [] as string[],
    prerequisites: [] as string[],
    learningOutcomes: [] as string[]
  });

  // Form state for GPA goals
  const [goalForm, setGoalForm] = useState({
    title: '',
    targetGPA: 3.5,
    targetDate: '',
    strategy: '',
    milestones: [] as GoalMilestone[]
  });

  // GPA Scale (4.0 system)
  const gradeScale: { [key: string]: number } = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0, 'I': 0.0, 'W': 0.0
  };

  // Academic programs for course organization
  const academicPrograms = [
    'Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Chemistry',
    'Biology', 'Business Administration', 'Economics', 'Psychology', 'English',
    'History', 'Political Science', 'Art', 'Music', 'Philosophy', 'Other'
  ];

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedCourses = await AsyncStorage.getItem('gpa_courses');
      const savedGoals = await AsyncStorage.getItem('gpa_goals');
      
      if (savedCourses) {
        const parsedCourses = JSON.parse(savedCourses);
        setCourses(parsedCourses);
        organizeSemesters(parsedCourses);
      } else {
        // Initialize with sample data if no saved data
        initializeSampleData();
      }
      
      if (savedGoals) {
        setGpaGoals(JSON.parse(savedGoals));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      initializeSampleData();
    }
  };

  const initializeSampleData = () => {
    const sampleCourses: Course[] = [
      {
        id: '1',
        courseName: 'Introduction to Computer Science',
        courseCode: 'CS 101',
        credits: 3,
        grade: 'A',
        gradePoints: 4.0,
        semester: 'Fall 2024',
        year: '2024',
        category: 'core',
        instructor: 'Dr. Smith',
        difficulty: 'medium',
        studyHours: 45,
        attendance: 95,
        assignments: [
          {
            id: 'a1',
            title: 'Programming Assignment 1',
            type: 'homework',
            dueDate: '2024-09-15',
            maxPoints: 100,
            earnedPoints: 95,
            weight: 20,
            completed: true,
            submissionDate: '2024-09-14'
          }
        ],
        exams: [
          {
            id: 'e1',
            title: 'Midterm Exam',
            type: 'midterm',
            date: '2024-10-15',
            maxPoints: 100,
            earnedPoints: 88,
            weight: 30,
            duration: '2 hours',
            topics: ['Variables', 'Functions', 'Loops'],
            difficulty: 'medium'
          }
        ],
        notes: 'Great introduction to programming concepts',
        completionDate: '2024-12-15',
        textbooks: ['Introduction to Programming by John Doe'],
        learningOutcomes: ['Understand basic programming', 'Write simple algorithms']
      }
    ];
    setCourses(sampleCourses);
    organizeSemesters(sampleCourses);
    
    const sampleGoals: GPAGoal[] = [
      {
        id: '1',
        title: 'Maintain Dean\'s List',
        targetGPA: 3.7,
        targetDate: '2025-05-15',
        currentGPA: calculateOverallGPA(),
        progress: 75,
        strategy: 'Focus on core courses and maintain consistent study schedule',
        milestones: [
          {
            id: 'm1',
            title: 'Achieve 3.5 GPA this semester',
            targetValue: 3.5,
            currentValue: 3.6,
            completed: true,
            completedDate: '2024-12-15'
          }
        ],
        achieved: false
      }
    ];
    setGpaGoals(sampleGoals);
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('gpa_courses', JSON.stringify(courses));
      await AsyncStorage.setItem('gpa_goals', JSON.stringify(gpaGoals));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    saveData();
  }, [courses, gpaGoals]);

  const organizeSemesters = (courseList: Course[]) => {
    const semesterMap: { [key: string]: Course[] } = {};
    
    courseList.forEach(course => {
      const semesterKey = `${course.semester} ${course.year}`;
      if (!semesterMap[semesterKey]) {
        semesterMap[semesterKey] = [];
      }
      semesterMap[semesterKey].push(course);
    });

    const organizedSemesters: Semester[] = Object.entries(semesterMap).map(([semesterName, semesterCourses]) => {
      const totalCredits = semesterCourses.reduce((sum, course) => sum + course.credits, 0);
      const totalGradePoints = semesterCourses.reduce((sum, course) => sum + (course.gradePoints * course.credits), 0);
      const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

      return {
        id: semesterName.replace(/\s+/g, '-').toLowerCase(),
        name: semesterName,
        year: semesterCourses[0].year,
        courses: semesterCourses,
        gpa: Math.round(gpa * 100) / 100,
        totalCredits
      };
    });

    setSemesters(organizedSemesters.sort((a, b) => a.name.localeCompare(b.name)));
  };

  const calculateOverallGPA = () => {
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalGradePoints = courses.reduce((sum, course) => sum + (course.gradePoints * course.credits), 0);
    return totalCredits > 0 ? Math.round((totalGradePoints / totalCredits) * 100) / 100 : 0;
  };

  const addCourse = () => {
    const gradePoints = gradeScale[courseForm.grade as keyof typeof gradeScale] || 0;
    
    const newCourse: Course = {
      id: Date.now().toString(),
      courseName: courseForm.courseName,
      courseCode: courseForm.courseCode,
      credits: courseForm.credits,
      grade: courseForm.grade,
      gradePoints,
      semester: courseForm.semester,
      year: courseForm.year,
      category: courseForm.category
    };

    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    organizeSemesters(updatedCourses);
    resetForm();
    setShowAddCourse(false);
    Alert.alert('Success', 'Course added successfully!');
  };

  const updateCourse = () => {
    if (!editingCourse) return;

    if (!courseForm.courseName.trim() || !courseForm.courseCode.trim()) {
      Alert.alert('Error', 'Please fill in course name and code');
      return;
    }

    const gradePoints = gradeScale[courseForm.grade as keyof typeof gradeScale] || 0;
    
    const updatedCourses = courses.map(course => 
      course.id === editingCourse.id 
        ? {
            ...course,
            courseName: courseForm.courseName,
            courseCode: courseForm.courseCode,
            credits: courseForm.credits,
            grade: courseForm.grade,
            gradePoints,
            semester: courseForm.semester,
            year: courseForm.year,
            category: courseForm.category,
            instructor: courseForm.instructor,
            difficulty: courseForm.difficulty,
            studyHours: courseForm.studyHours,
            attendance: courseForm.attendance,
            notes: courseForm.notes,
            isRetake: courseForm.isRetake,
            textbooks: courseForm.textbooks,
            prerequisites: courseForm.prerequisites,
            learningOutcomes: courseForm.learningOutcomes
          }
        : course
    );

    setCourses(updatedCourses);
    organizeSemesters(updatedCourses);
    setEditingCourse(null);
    resetForm();
    setShowAddCourse(false);
    Alert.alert('Success', 'Course updated successfully!');
  };

  const deleteCourse = (courseId: string) => {
    Alert.alert(
      'Delete Course',
      'Are you sure you want to delete this course?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedCourses = courses.filter(course => course.id !== courseId);
            setCourses(updatedCourses);
            organizeSemesters(updatedCourses);
          }
        }
      ]
    );
  };

  const editCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      courseName: course.courseName,
      courseCode: course.courseCode,
      credits: course.credits,
      grade: course.grade,
      semester: course.semester,
      year: course.year,
      category: course.category,
      instructor: course.instructor || '',
      difficulty: course.difficulty,
      studyHours: course.studyHours || 0,
      attendance: course.attendance || 100,
      notes: course.notes || '',
      isRetake: course.isRetake || false,
      syllabus: course.syllabus || '',
      textbooks: course.textbooks || [],
      prerequisites: course.prerequisites || [],
      learningOutcomes: course.learningOutcomes || []
    });
    setShowAddCourse(true);
  };

  const resetForm = () => {
    setCourseForm({
      courseName: '',
      courseCode: '',
      credits: 3,
      grade: 'A',
      semester: 'Fall 2024',
      year: '2024',
      category: 'core',
      instructor: '',
      difficulty: 'medium',
      studyHours: 0,
      attendance: 100,
      notes: '',
      isRetake: false,
      syllabus: '',
      textbooks: [],
      prerequisites: [],
      learningOutcomes: []
    });
    setEditingCourse(null);
  };

  const getGradeColor = (gpa: number) => {
    if (gpa >= 3.7) return '#10B981';
    if (gpa >= 3.0) return '#F59E0B';
    if (gpa >= 2.0) return '#EF4444';
    return '#DC2626';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return '#3B82F6';
      case 'major': return '#10B981';
      case 'elective': return '#8B5CF6';
      case 'minor': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const calculateRequiredGPA = (targetGPA: number, remainingCredits: number) => {
    const currentCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const currentGradePoints = courses.reduce((sum, course) => sum + (course.gradePoints * course.credits), 0);
    const totalCredits = currentCredits + remainingCredits;
    const requiredGradePoints = (targetGPA * totalCredits) - currentGradePoints;
    return remainingCredits > 0 ? requiredGradePoints / remainingCredits : 0;
  };

  const getSemesterData = () => {
    return semesters;
  };

  const getTotalCredits = () => {
    return courses.reduce((sum, course) => sum + course.credits, 0);
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return '#10B981';
    if (gpa >= 3.0) return '#F59E0B';
    if (gpa >= 2.0) return '#EF4444';
    return '#DC2626';
  };

  const getAcademicStanding = (gpa: number) => {
    if (gpa >= 3.7) return 'Dean\'s List';
    if (gpa >= 3.5) return 'Honor Roll';
    if (gpa >= 3.0) return 'Good Standing';
    if (gpa >= 2.0) return 'Satisfactory';
    return 'Academic Warning';
  };

  const exportSemesterData = (semester: Semester) => {
    // Implementation for exporting semester data
    Alert.alert('Export', `Exporting data for ${semester.name}`);
  };

  const renderAddCourseModal = () => (
    <Modal
      visible={showAddCourse}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowAddCourse(false);
        resetForm();
      }}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => {
              setShowAddCourse(false);
              resetForm();
            }}
          >
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Course Name</Text>
            <TextInput
              style={styles.input}
              value={courseForm.courseName}
              onChangeText={(text) => setCourseForm({...courseForm, courseName: text})}
              placeholder="e.g., Introduction to Computer Science"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Course Code</Text>
            <TextInput
              style={styles.input}
              value={courseForm.courseCode}
              onChangeText={(text) => setCourseForm({...courseForm, courseCode: text})}
              placeholder="e.g., CS 101"
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Credits</Text>
              <TextInput
                style={styles.input}
                value={courseForm.credits.toString()}
                onChangeText={(text) => setCourseForm({...courseForm, credits: parseInt(text) || 0})}
                placeholder="3"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Grade</Text>
              <View style={styles.gradeSelector}>
                {Object.keys(gradeScale).map((grade) => (
                  <TouchableOpacity
                    key={grade}
                    style={[
                      styles.gradeButton,
                      courseForm.grade === grade && styles.selectedGradeButton
                    ]}
                    onPress={() => setCourseForm({...courseForm, grade})}
                  >
                    <Text style={[
                      styles.gradeButtonText,
                      courseForm.grade === grade && styles.selectedGradeButtonText
                    ]}>
                      {grade}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Semester</Text>
              <TextInput
                style={styles.input}
                value={courseForm.semester}
                onChangeText={(text) => setCourseForm({...courseForm, semester: text})}
                placeholder="Fall 2024"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Year</Text>
              <TextInput
                style={styles.input}
                value={courseForm.year}
                onChangeText={(text) => setCourseForm({...courseForm, year: text})}
                placeholder="2024"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categorySelector}>
              {['core', 'major', 'elective', 'minor'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    courseForm.category === category && styles.selectedCategoryButton,
                    { backgroundColor: courseForm.category === category ? getCategoryColor(category) : '#F3F4F6' }
                  ]}
                  onPress={() => setCourseForm({...courseForm, category: category as any})}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    { color: courseForm.category === category ? '#FFFFFF' : '#6B7280' }
                  ]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={editingCourse ? updateCourse : addCourse}
          >
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {editingCourse ? 'Update Course' : 'Add Course'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderCalculatorTab = () => {
    const overallGPA = calculateOverallGPA();
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* GPA Overview */}
        <View style={styles.gpaOverview}>
          <View style={styles.gpaCard}>
            <Text style={styles.gpaLabel}>Current GPA</Text>
            <Text style={[styles.gpaValue, { color: getGradeColor(overallGPA) }]}>
              {overallGPA.toFixed(2)}
            </Text>
            <Text style={styles.creditsText}>{totalCredits} total credits</Text>
          </View>
          
          <View style={styles.gpaStats}>
            <View style={styles.statItem}>
              <Target size={20} color="#3B82F6" />
              <Text style={styles.statLabel}>Goal</Text>
              <Text style={styles.statValue}>{targetGPA.toFixed(2)}</Text>
            </View>
            <View style={styles.statItem}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.statLabel}>Progress</Text>
              <Text style={styles.statValue}>
                {overallGPA >= targetGPA ? '✓' : `${(targetGPA - overallGPA).toFixed(2)} to go`}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowAddCourse(true)}
          >
            <Plus size={20} color="#3B82F6" />
            <Text style={styles.actionButtonText}>Add Course</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Download size={20} color="#10B981" />
            <Text style={styles.actionButtonText}>Export Data</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Courses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Courses</Text>
          {courses.slice(-5).map((course) => (
            <View key={course.id} style={styles.courseItem}>
              <View style={styles.courseInfo}>
                <Text style={styles.courseName}>{course.courseName}</Text>
                <Text style={styles.courseCode}>{course.courseCode}</Text>
                <Text style={styles.courseDetails}>
                  {course.credits} credits • {course.semester}
                </Text>
              </View>
              <View style={styles.courseGrade}>
                <Text style={[styles.gradeText, { color: getGradeColor(course.gradePoints) }]}>
                  {course.grade}
                </Text>
                <Text style={styles.gradePoints}>{course.gradePoints.toFixed(1)}</Text>
              </View>
              <View style={styles.courseActions}>
                <TouchableOpacity onPress={() => editCourse(course)}>
                  <Edit3 size={16} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteCourse(course.id)}>
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* GPA Predictor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GPA Predictor</Text>
          <View style={styles.predictorCard}>
            <Text style={styles.predictorTitle}>What GPA do you need?</Text>
            <View style={styles.predictorInputs}>
              <View style={styles.predictorInput}>
                <Text style={styles.predictorLabel}>Target GPA</Text>
                <TextInput
                  style={styles.predictorTextInput}
                  value={targetGPA.toString()}
                  onChangeText={(text) => setTargetGPA(parseFloat(text) || 0)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.predictorInput}>
                <Text style={styles.predictorLabel}>Remaining Credits</Text>
                <TextInput
                  style={styles.predictorTextInput}
                  placeholder="12"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.predictorResult}>
              <Text style={styles.predictorResultText}>
                You need an average of {calculateRequiredGPA(targetGPA, 12).toFixed(2)} GPA 
                in your remaining courses to reach {targetGPA.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderSemestersTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.semesterHeader}>
        <Text style={styles.semesterTitle}>Academic Progress by Semester</Text>
        <Text style={styles.semesterSubtitle}>Track your GPA and performance across semesters</Text>
      </View>

      {getSemesterData().length === 0 ? (
        <View style={styles.noSemestersContainer}>
          <Calendar size={48} color="#9CA3AF" />
          <Text style={styles.noSemestersTitle}>No Semester Data</Text>
          <Text style={styles.noSemestersText}>
            Add courses with semester information to see your academic progress
          </Text>
          <TouchableOpacity
            style={styles.addFirstCourseButton}
            onPress={() => setActiveTab('calculator')}
          >
            <Plus size={16} color="#3B82F6" />
            <Text style={styles.addFirstCourseText}>Add Your First Course</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Overall Academic Summary */}
          <View style={styles.academicSummary}>
            <Text style={styles.summaryTitle}>Academic Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{calculateOverallGPA().toFixed(2)}</Text>
                <Text style={styles.summaryLabel}>Cumulative GPA</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{getTotalCredits()}</Text>
                <Text style={styles.summaryLabel}>Total Credits</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{getSemesterData().length}</Text>
                <Text style={styles.summaryLabel}>Semesters</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{courses.length}</Text>
                <Text style={styles.summaryLabel}>Total Courses</Text>
              </View>
            </View>
          </View>

          {/* GPA Trend Chart */}
          <View style={styles.trendSection}>
            <Text style={styles.trendTitle}>GPA Trend</Text>
            <View style={styles.trendChart}>
              {getSemesterData().map((semester, index) => (
                <View key={semester.id} style={styles.trendPoint}>
                  <View style={styles.trendBar}>
                    <View 
                      style={[
                        styles.trendBarFill, 
                        { 
                          height: `${(semester.gpa / 4.0) * 100}%`,
                          backgroundColor: getGPAColor(semester.gpa)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.trendLabel}>{semester.name}</Text>
                  <Text style={styles.trendValue}>{semester.gpa.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Semester Details */}
          <View style={styles.semestersContainer}>
            {getSemesterData().map((semester) => (
              <View key={semester.id} style={styles.semesterCard}>
                <View style={styles.semesterCardHeader}>
                  <View style={styles.semesterInfo}>
                    <Text style={styles.semesterName}>{semester.name}</Text>
                    <Text style={styles.semesterPeriod}>{semester.year}</Text>
                  </View>
                  <View style={styles.semesterStats}>
                    <View style={[styles.gpaIndicator, { backgroundColor: `${getGPAColor(semester.gpa)}15` }]}>
                      <Text style={[styles.gpaValue, { color: getGPAColor(semester.gpa) }]}>
                        {semester.gpa.toFixed(2)}
                      </Text>
                      <Text style={styles.gpaLabel}>GPA</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.semesterMetrics}>
                  <View style={styles.metricItem}>
                    <BookOpen size={16} color="#6B7280" />
                    <Text style={styles.metricText}>{semester.courses.length} courses</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Award size={16} color="#6B7280" />
                    <Text style={styles.metricText}>{semester.totalCredits} credits</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <TrendingUp size={16} color="#6B7280" />
                    <Text style={styles.metricText}>{getAcademicStanding(semester.gpa)}</Text>
                  </View>
                </View>

                {/* Performance Indicators */}
                <View style={styles.performanceIndicators}>
                  {semester.gpa >= 3.7 && (
                    <View style={styles.achievementBadge}>
                      <Star size={12} color="#F59E0B" />
                      <Text style={styles.achievementText}>Dean's List</Text>
                    </View>
                  )}
                  {semester.gpa >= 3.5 && semester.gpa < 3.7 && (
                    <View style={[styles.achievementBadge, { backgroundColor: '#10B98115' }]}>
                      <CheckCircle size={12} color="#10B981" />
                      <Text style={[styles.achievementText, { color: '#10B981' }]}>Honor Roll</Text>
                    </View>
                  )}
                  {semester.gpa < 2.0 && (
                    <View style={[styles.achievementBadge, { backgroundColor: '#EF444415' }]}>
                      <AlertCircle size={12} color="#EF4444" />
                      <Text style={[styles.achievementText, { color: '#EF4444' }]}>Academic Warning</Text>
                    </View>
                  )}
                </View>

                {/* Course List for Semester */}
                <View style={styles.semesterCourses}>
                  <Text style={styles.semesterCoursesTitle}>Courses ({semester.courses.length})</Text>
                  {semester.courses.map((course) => (
                    <TouchableOpacity
                      key={course.id}
                      style={styles.semesterCourseItem}
                      onPress={() => {
                        setSelectedCourse(course);
                        setShowCourseDetails(true);
                      }}
                    >
                      <View style={styles.courseItemInfo}>
                        <Text style={styles.courseItemCode}>{course.courseCode}</Text>
                        <Text style={styles.courseItemName}>{course.courseName}</Text>
                        <Text style={styles.courseItemInstructor}>{course.instructor}</Text>
                      </View>
                      <View style={styles.courseItemStats}>
                        <View style={[styles.gradeChip, { backgroundColor: `${getGradeColor(course.gradePoints)}15` }]}>
                          <Text style={[styles.gradeChipText, { color: getGradeColor(course.gradePoints) }]}>
                            {course.grade}
                          </Text>
                        </View>
                        <Text style={styles.creditsText}>{course.credits} cr</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Semester Actions */}
                <View style={styles.semesterActions}>
                  <TouchableOpacity
                    style={styles.semesterActionButton}
                    onPress={() => {
                      setActiveTab('analytics');
                      // Could filter analytics by semester
                    }}
                  >
                    <TrendingUp size={16} color="#3B82F6" />
                    <Text style={styles.semesterActionText}>View Analytics</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.semesterActionButton}
                    onPress={() => exportSemesterData(semester)}
                  >
                    <FileText size={16} color="#10B981" />
                    <Text style={styles.semesterActionText}>Export Data</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );

  const renderAnalyticsTab = () => {
    const overallGPA = calculateOverallGPA();
    const categoryBreakdown = courses.reduce((acc, course) => {
      if (!acc[course.category]) {
        acc[course.category] = { credits: 0, gradePoints: 0, count: 0 };
      }
      acc[course.category].credits += course.credits;
      acc[course.category].gradePoints += course.gradePoints * course.credits;
      acc[course.category].count += 1;
      return acc;
    }, {} as any);

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        <View style={styles.analyticsOverview}>
          <View style={styles.analyticsCard}>
            <BarChart3 size={24} color="#3B82F6" />
            <Text style={styles.analyticsTitle}>GPA Trends</Text>
            <Text style={styles.analyticsValue}>{overallGPA.toFixed(2)}</Text>
            <Text style={styles.analyticsSubtext}>Overall GPA</Text>
          </View>
          
          <View style={styles.analyticsCard}>
            <PieChart size={24} color="#10B981" />
            <Text style={styles.analyticsTitle}>Total Credits</Text>
            <Text style={styles.analyticsValue}>{courses.reduce((sum, c) => sum + c.credits, 0)}</Text>
            <Text style={styles.analyticsSubtext}>Credits Completed</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance by Category</Text>
          {Object.entries(categoryBreakdown).map(([category, data]: [string, any]) => {
            const categoryGPA = data.credits > 0 ? data.gradePoints / data.credits : 0;
            return (
              <View key={category} style={styles.categoryAnalytics}>
                <View style={styles.categoryHeader}>
                  <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(category) }]} />
                  <Text style={styles.categoryName}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                </View>
                <View style={styles.categoryStats}>
                  <Text style={styles.categoryGPA}>{categoryGPA.toFixed(2)}</Text>
                  <Text style={styles.categoryDetails}>{data.count} courses • {data.credits} credits</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grade Distribution</Text>
          <View style={styles.gradeDistribution}>
            {Object.entries(
              courses.reduce((acc, course) => {
                acc[course.grade] = (acc[course.grade] || 0) + 1;
                return acc;
              }, {} as any)
            ).map(([grade, count]: [string, any]) => (
              <View key={grade} style={styles.gradeDistributionItem}>
                <Text style={styles.gradeDistributionGrade}>{grade}</Text>
                <View style={styles.gradeDistributionBar}>
                  <View 
                    style={[
                      styles.gradeDistributionFill, 
                      { 
                        width: `${(count / courses.length) * 100}%`,
                        backgroundColor: getGradeColor(gradeScale[grade as keyof typeof gradeScale])
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.gradeDistributionCount}>{count}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderCoursesTab = () => {
    const filteredCourses = courses.filter(course => {
      const matchesSearch = course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (course.instructor && course.instructor.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
      const matchesProgram = selectedProgram === 'all' || course.courseName.toLowerCase().includes(selectedProgram.toLowerCase());
      return matchesSearch && matchesCategory && matchesProgram;
    });

    const sortedCourses = [...filteredCourses].sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.courseName.localeCompare(b.courseName);
        case 'grade': return b.gradePoints - a.gradePoints;
        case 'credits': return b.credits - a.credits;
        case 'date': return new Date(b.year + '-' + b.semester).getTime() - new Date(a.year + '-' + a.semester).getTime();
        default: return 0;
      }
    });

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* Search and Filter Controls */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search courses..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.filterRow}>
            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Category:</Text>
              <View style={styles.filterButtons}>
                {['all', 'core', 'major', 'elective', 'minor'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterButton,
                      filterCategory === category && styles.activeFilterButton
                    ]}
                    onPress={() => setFilterCategory(category)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filterCategory === category && styles.activeFilterButtonText
                    ]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Courses List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Courses ({sortedCourses.length})</Text>
            <TouchableOpacity
              style={styles.addCourseButton}
              onPress={() => {
                setActiveTab('calculator');
                setShowAddCourse(true);
              }}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {sortedCourses.length === 0 ? (
            <View style={styles.emptyState}>
              <BookOpen size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>No courses found</Text>
              <Text style={styles.emptyStateText}>
                {courses.length === 0 
                  ? "Add your first course to get started"
                  : "Try adjusting your search or filters"
                }
              </Text>
              {courses.length === 0 && (
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={() => setShowAddCourse(true)}
                >
                  <Text style={styles.emptyStateButtonText}>Add Course</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.coursesList}>
              {sortedCourses.map((course) => (
                <View key={course.id} style={styles.courseCard}>
                  <View style={styles.courseCardHeader}>
                    <View style={styles.courseCardInfo}>
                      <Text style={styles.courseCardCode}>{course.courseCode}</Text>
                      <Text style={styles.courseCardName}>{course.courseName}</Text>
                      <Text style={styles.courseCardDetails}>
                        {course.instructor && `${course.instructor} • `}
                        {course.semester} {course.year}
                      </Text>
                    </View>
                    <View style={styles.courseCardGrade}>
                      <Text style={[styles.courseCardGradeText, { color: getGradeColor(course.gradePoints) }]}>
                        {course.grade}
                      </Text>
                      <Text style={styles.courseCardGradePoints}>{course.gradePoints.toFixed(1)}</Text>
                    </View>
                  </View>

                  <View style={styles.courseCardMetrics}>
                    <View style={styles.courseMetric}>
                      <Edit3 size={16} color="#6B7280" />
                      <Text style={styles.courseMetricText}>{course.credits} credits</Text>
                    </View>
                    <View style={[styles.courseCategoryBadge, { backgroundColor: getCategoryColor(course.category) }]}>
                      <Text style={styles.courseCategoryText}>{course.category}</Text>
                    </View>
                    {course.studyHours && course.studyHours > 0 && (
                      <View style={styles.courseMetric}>
                        <Clock size={16} color="#6B7280" />
                        <Text style={styles.courseMetricText}>{course.studyHours}h study</Text>
                      </View>
                    )}
                    {course.attendance && (
                      <View style={styles.courseMetric}>
                        <CheckCircle size={16} color="#6B7280" />
                        <Text style={styles.courseMetricText}>{course.attendance}% attendance</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.courseCardActions}>
                    <TouchableOpacity
                      style={styles.courseActionButton}
                      onPress={() => {
                        setSelectedCourse(course);
                        setShowCourseDetail(true);
                      }}
                    >
                      <Eye size={16} color="#3B82F6" />
                      <Text style={styles.courseActionText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.courseActionButton}
                      onPress={() => editCourse(course)}
                    >
                      <Edit3 size={16} color="#10B981" />
                      <Text style={styles.courseActionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.courseActionButton}
                      onPress={() => deleteCourse(course.id)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                      <Text style={styles.courseActionText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderGoalsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.goalsHeader}>
        <Text style={styles.goalsTitle}>Academic Goals</Text>
        <Text style={styles.goalsSubtitle}>Set and track your GPA targets</Text>
      </View>

      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Award size={24} color="#3B82F6" />
          <Text style={styles.goalTitle}>Current GPA Goal</Text>
        </View>
        <View style={styles.goalContent}>
          <Text style={styles.goalValue}>{gpaGoal.toFixed(2)}</Text>
          <View style={styles.goalProgress}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min((calculateOverallGPA() / targetGPA) * 100, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {calculateOverallGPA() >= targetGPA ? 'Goal Achieved!' : `${(targetGPA - calculateOverallGPA()).toFixed(2)} points to go`}
            </Text>
          </View>
        </View>
        <View style={styles.goalActions}>
          <TextInput
            style={styles.goalInput}
            value={targetGPA.toString()}
            onChangeText={(text) => setTargetGPA(parseFloat(text) || 0)}
            keyboardType="numeric"
            placeholder="3.5"
          />
          <TouchableOpacity style={styles.updateGoalButton}>
            <Text style={styles.updateGoalText}>Update Goal</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Semester Goals</Text>
        {semesters.map((semester) => (
          <View key={semester.id} style={styles.semesterGoalCard}>
            <Text style={styles.semesterGoalName}>{semester.name}</Text>
            <View style={styles.semesterGoalStats}>
              <Text style={styles.semesterGoalGPA}>
                Current: {semester.gpa.toFixed(2)}
              </Text>
              <Text style={styles.semesterGoalTarget}>
                Target: {targetGPA.toFixed(2)}
              </Text>
            </View>
            <View style={styles.semesterGoalProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${Math.min((semester.gpa / targetGPA) * 100, 100)}%`,
                      backgroundColor: semester.gpa >= targetGPA ? '#10B981' : '#F59E0B'
                    }
                  ]} 
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const tabs = [
    { key: 'calculator', label: 'Calculator', icon: Calculator },
    { key: 'courses', label: 'Courses', icon: BookOpen },
    { key: 'semesters', label: 'Semesters', icon: Calendar },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'goals', label: 'Goals', icon: Target },
    { key: 'tracker', label: 'Tracker', icon: CheckCircle },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GPA Calculator</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <tab.icon size={20} color={activeTab === tab.key ? '#3B82F6' : '#6B7280'} />
              <Text style={[
                styles.tabText, 
                activeTab === tab.key && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {activeTab === 'calculator' && renderCalculatorTab()}
      {activeTab === 'courses' && renderCoursesTab()}
      {activeTab === 'semesters' && renderSemestersTab()}
      {activeTab === 'analytics' && renderAnalyticsTab()}
      {activeTab === 'goals' && renderGoalsTab()}

      {renderAddCourseModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  semesterHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  semesterTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  semesterSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  noSemestersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noSemestersTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  noSemestersText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  addFirstCourseButton: {
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
  addFirstCourseText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  academicSummary: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  trendSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  trendTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  trendChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
  },
  trendPoint: {
    alignItems: 'center',
    flex: 1,
  },
  trendBar: {
    width: 20,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
    justifyContent: 'flex-end',
  },
  trendBarFill: {
    width: '100%',
    borderRadius: 10,
    minHeight: 4,
  },
  trendLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 2,
  },
  trendValue: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  semestersContainer: {
    gap: 16,
  },
  semesterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  semesterCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  semesterInfo: {
    flex: 1,
  },
  semesterName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  semesterPeriod: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  semesterStats: {
    alignItems: 'flex-end',
  },
  gpaIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  gpaValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  gpaLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  semesterMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  performanceIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  achievementText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  semesterCourses: {
    marginBottom: 16,
  },
  semesterCoursesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  semesterCourseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  courseItemInfo: {
    flex: 1,
  },
  courseItemCode: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginBottom: 2,
  },
  courseItemName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  courseItemInstructor: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  courseItemStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  gradeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gradeChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  creditsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  semesterActions: {
    flexDirection: 'row',
    gap: 12,
  },
  semesterActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  semesterActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4B5563',
  },
  tabContent: {
    flex: 1,
    padding: 24,
  },
  gpaOverview: {
    marginBottom: 24,
  },
  gpaCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gpaLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 8,
  },
  gpaValue: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  creditsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  gpaStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginBottom: 2,
  },
  courseDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  courseGrade: {
    alignItems: 'center',
    marginRight: 16,
  },
  gradeText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  gradePoints: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  courseActions: {
    flexDirection: 'row',
    gap: 12,
  },
  predictorCard: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  predictorTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 12,
  },
  predictorInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  predictorInput: {
    flex: 1,
  },
  predictorLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 6,
  },
  predictorTextInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  predictorResult: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },
  predictorResultText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#0369A1',
    textAlign: 'center',
  },
  semesterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  semesterName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  semesterStats: {
    alignItems: 'flex-end',
  },
  semesterGPA: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  semesterCredits: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  semesterCourses: {
    gap: 8,
  },
  semesterCourseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  courseDetails: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  courseSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  courseGradeInfo: {
    alignItems: 'center',
  },
  courseGradeText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  courseCreditsText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  analyticsOverview: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  analyticsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  analyticsValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  analyticsSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  categoryAnalytics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  categoryGPA: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  categoryDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  gradeDistribution: {
    gap: 8,
  },
  gradeDistributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gradeDistributionGrade: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    width: 30,
  },
  gradeDistributionBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  gradeDistributionFill: {
    height: '100%',
    borderRadius: 4,
  },
  gradeDistributionCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    width: 30,
    textAlign: 'right',
  },
  goalsHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  goalsTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  goalsSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 12,
  },
  goalContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  goalValue: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginBottom: 12,
  },
  goalProgress: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  goalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  goalInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  updateGoalButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  updateGoalText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  semesterGoalCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  semesterGoalName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  semesterGoalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  semesterGoalGPA: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  semesterGoalTarget: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  semesterGoalProgress: {
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  halfInput: {
    flex: 1,
  },
  gradeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  gradeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedGradeButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  gradeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  selectedGradeButtonText: {
    color: '#FFFFFF',
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectedCategoryButton: {
    // Style handled by backgroundColor in the component
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  searchFilterContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginLeft: 8,
  },
  filterRow: {
    gap: 12,
  },
  filterContainer: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addCourseButton: {
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 8,
  },
  coursesList: {
    gap: 12,
  },
  courseCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  courseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseCardInfo: {
    flex: 1,
  },
  courseCardCode: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  courseCardName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  courseCardDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  courseCardGrade: {
    alignItems: 'center',
  },
  courseCardGradeText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  courseCardGradePoints: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  courseCardMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  courseMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courseMetricText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  courseCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  courseCategoryText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  courseCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  courseActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },
  courseActionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});