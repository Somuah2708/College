import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { X, Brain, Clock, Award, TrendingUp, BookOpen, Target, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  category: string;
  difficulty: string;
  explanation?: string;
  timeLimit?: number;
}

interface ProgramRecommendation {
  name: string;
  university: string;
  matchPercentage: number;
  reason: string;
  category: string;
  color: string;
}

interface AptitudeTestProps {
  onClose: () => void;
}

export default function AptitudeTest({ onClose }: AptitudeTestProps) {
  const [currentStep, setCurrentStep] = useState<'intro' | 'test' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [testStarted, setTestStarted] = useState(false);
  const [iqScore, setIqScore] = useState(0);
  const [recommendations, setRecommendations] = useState<ProgramRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testStarted && timeLeft > 0 && currentStep === 'test') {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testStarted, timeLeft, currentStep]);

  const fetchQuestions = async () => {
    try {
      setLoadingQuestions(true);
      setError(null);

      console.log('Fetching aptitude questions from Supabase...');
      
      const { data, error: fetchError } = await supabase
        .from('aptitude_questions')
        .select('*')
        .eq('active', true)
        .order('order_index', { ascending: true });

      if (fetchError) {
        console.error('Error fetching aptitude questions:', fetchError);
        throw fetchError;
      }

      if (!data || data.length === 0) {
        console.log('No questions found in database, generating sample questions...');
        generateSampleQuestions();
        return;
      }

      console.log(`Successfully fetched ${data.length} questions from Supabase`);
      setQuestions(data as Question[]);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions from database. Using sample questions instead.');
      generateSampleQuestions();
    } finally {
      setLoadingQuestions(false);
    }
  };

  const generateSampleQuestions = () => {
    const sampleQuestions: Question[] = [
      {
        id: 'sample-1',
        question: 'What comes next in the sequence: 2, 4, 8, 16, ?',
        options: ['24', '32', '30', '20'],
        correct_answer: 1,
        category: 'logical',
        difficulty: 'medium',
        explanation: 'Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32',
        timeLimit: 120
      },
      {
        id: 'sample-2',
        question: 'If all roses are flowers and some flowers are red, which statement is definitely true?',
        options: ['All roses are red', 'Some roses are red', 'All flowers are roses', 'Some roses might be red'],
        correct_answer: 3,
        category: 'logical',
        difficulty: 'medium',
        explanation: 'We cannot conclude that roses are red, but it\'s possible that some roses might be red.',
        timeLimit: 120
      },
      {
        id: 'sample-3',
        question: 'What is 15% of 200?',
        options: ['25', '30', '35', '40'],
        correct_answer: 1,
        category: 'mathematical',
        difficulty: 'easy',
        explanation: '15% of 200 = 0.15 × 200 = 30',
        timeLimit: 90
      },
      {
        id: 'sample-4',
        question: 'Which word is the odd one out?',
        options: ['Dog', 'Cat', 'Bird', 'Fish'],
        correct_answer: 2,
        category: 'verbal',
        difficulty: 'easy',
        explanation: 'Bird is the only one that can fly',
        timeLimit: 60
      },
      {
        id: 'sample-5',
        question: 'If you rotate a square 90 degrees clockwise, what shape do you get?',
        options: ['Rectangle', 'Triangle', 'Square', 'Circle'],
        correct_answer: 2,
        category: 'spatial',
        difficulty: 'easy',
        explanation: 'A square rotated 90 degrees is still a square',
        timeLimit: 90
      },
      {
        id: 'sample-6',
        question: 'Complete the analogy: Book is to Reading as Fork is to ?',
        options: ['Kitchen', 'Eating', 'Spoon', 'Food'],
        correct_answer: 1,
        category: 'verbal',
        difficulty: 'medium',
        explanation: 'A book is used for reading, just as a fork is used for eating',
        timeLimit: 120
      },
      {
        id: 'sample-7',
        question: 'What is the next number in the sequence: 1, 1, 2, 3, 5, 8, ?',
        options: ['11', '13', '15', '16'],
        correct_answer: 1,
        category: 'mathematical',
        difficulty: 'medium',
        explanation: 'This is the Fibonacci sequence: each number is the sum of the two preceding ones (5+8=13)',
        timeLimit: 150
      },
      {
        id: 'sample-8',
        question: 'Which shape completes the pattern?',
        options: ['Circle', 'Square', 'Triangle', 'Pentagon'],
        correct_answer: 0,
        category: 'spatial',
        difficulty: 'medium',
        explanation: 'The pattern alternates between curved and angular shapes',
        timeLimit: 120
      },
      {
        id: 'sample-9',
        question: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
        options: ['5 minutes', '20 minutes', '100 minutes', '500 minutes'],
        correct_answer: 0,
        category: 'logical',
        difficulty: 'hard',
        explanation: 'Each machine makes 1 widget in 5 minutes, so 100 machines make 100 widgets in 5 minutes',
        timeLimit: 180
      },
      {
        id: 'sample-10',
        question: 'Choose the word that best completes the sentence: "The scientist\'s hypothesis was _____ by the experimental results."',
        options: ['confirmed', 'denied', 'ignored', 'created'],
        correct_answer: 0,
        category: 'verbal',
        difficulty: 'medium',
        explanation: 'Experimental results typically confirm or refute a hypothesis',
        timeLimit: 90
      }
    ];

    setQuestions(sampleQuestions);
  };

  const startTest = () => {
    if (questions.length === 0) {
      Alert.alert('No Questions', 'Cannot start test: No questions available.');
      return;
    }
    setCurrentStep('test');
    setTestStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = async () => {
    setLoading(true);
    
    // Calculate IQ score
    const correctAnswers = answers.reduce((count, answer, index) => {
      return count + (answer === questions[index].correct_answer ? 1 : 0);
    }, 0);

    const percentage = (correctAnswers / questions.length) * 100;
    const calculatedIQ = Math.round(85 + (percentage / 100) * 45); // Scale to 85-130 range
    
    setIqScore(calculatedIQ);

    // Generate program recommendations based on IQ score and performance
    const programRecommendations: ProgramRecommendation[] = [];

    if (calculatedIQ >= 120) {
      programRecommendations.push(
        {
          name: 'Computer Science',
          university: 'Stanford University',
          matchPercentage: 95,
          reason: 'Your exceptional logical reasoning and mathematical skills make you ideal for advanced CS programs',
          category: 'Technology',
          color: '#3B82F6'
        },
        {
          name: 'Artificial Intelligence',
          university: 'MIT',
          matchPercentage: 92,
          reason: 'Strong analytical thinking and problem-solving abilities align perfectly with AI research',
          category: 'Technology',
          color: '#8B5CF6'
        },
        {
          name: 'Mathematics',
          university: 'Harvard University',
          matchPercentage: 88,
          reason: 'Outstanding mathematical reasoning suggests excellent fit for pure mathematics',
          category: 'STEM',
          color: '#10B981'
        }
      );
    } else if (calculatedIQ >= 110) {
      programRecommendations.push(
        {
          name: 'Engineering',
          university: 'UC Berkeley',
          matchPercentage: 87,
          reason: 'Good problem-solving skills and logical thinking suit engineering disciplines',
          category: 'Engineering',
          color: '#F59E0B'
        },
        {
          name: 'Business Administration',
          university: 'Wharton School',
          matchPercentage: 82,
          reason: 'Balanced analytical and verbal skills indicate strong business acumen potential',
          category: 'Business',
          color: '#EF4444'
        },
        {
          name: 'Data Science',
          university: 'Carnegie Mellon',
          matchPercentage: 85,
          reason: 'Mathematical aptitude and logical reasoning are key for data science success',
          category: 'Technology',
          color: '#06B6D4'
        }
      );
    } else if (calculatedIQ >= 100) {
      programRecommendations.push(
        {
          name: 'Psychology',
          university: 'UCLA',
          matchPercentage: 78,
          reason: 'Good verbal reasoning and analytical skills suit behavioral science studies',
          category: 'Social Sciences',
          color: '#8B5CF6'
        },
        {
          name: 'Communications',
          university: 'Northwestern University',
          matchPercentage: 75,
          reason: 'Strong verbal abilities and creative thinking align with communications programs',
          category: 'Liberal Arts',
          color: '#EC4899'
        },
        {
          name: 'Education',
          university: 'Teachers College Columbia',
          matchPercentage: 80,
          reason: 'Balanced cognitive abilities and communication skills suit education field',
          category: 'Education',
          color: '#84CC16'
        }
      );
    } else {
      programRecommendations.push(
        {
          name: 'Liberal Arts',
          university: 'Community College',
          matchPercentage: 70,
          reason: 'Broad-based education can help develop various cognitive skills',
          category: 'Liberal Arts',
          color: '#6B7280'
        },
        {
          name: 'Vocational Training',
          university: 'Technical Institute',
          matchPercentage: 75,
          reason: 'Hands-on learning approach may be more suitable for your learning style',
          category: 'Vocational',
          color: '#F97316'
        }
      );
    }

    setRecommendations(programRecommendations);
    setLoading(false);
    setCurrentStep('results');
  };

  const resetTest = () => {
    setCurrentStep('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setTimeLeft(1800);
    setTestStarted(false);
    setIqScore(0);
    setRecommendations([]);
    setError(null);
    // Optionally re-fetch questions on reset
    if (questions.length === 0) {
      fetchQuestions();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getIQCategory = (score: number) => {
    if (score >= 130) return { label: 'Very Superior', color: '#10B981' };
    if (score >= 120) return { label: 'Superior', color: '#3B82F6' };
    if (score >= 110) return { label: 'High Average', color: '#F59E0B' };
    if (score >= 90) return { label: 'Average', color: '#6B7280' };
    if (score >= 80) return { label: 'Low Average', color: '#EF4444' };
    return { label: 'Below Average', color: '#DC2626' };
  };

  const renderIntro = () => (
    <View style={styles.introContainer}>
      <View style={styles.introHeader}>
        <Brain size={48} color="#3B82F6" />
        <Text style={styles.introTitle}>Aptitude & IQ Assessment</Text>
        <Text style={styles.introSubtitle}>
          Discover your cognitive strengths and get personalized program recommendations
        </Text>
      </View>

      <View style={styles.testInfo}>
        <View style={styles.infoCard}>
          <Clock size={24} color="#F59E0B" />
          <Text style={styles.infoTitle}>Duration</Text>
          <Text style={styles.infoText}>30 minutes</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Target size={24} color="#10B981" />
          <Text style={styles.infoTitle}>Questions</Text>
          <Text style={styles.infoText}>{questions.length} questions</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Award size={24} color="#8B5CF6" />
          <Text style={styles.infoTitle}>Categories</Text>
          <Text style={styles.infoText}>Logic, Math, Verbal, Spatial</Text>
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>Instructions:</Text>
        <Text style={styles.instructionText}>• Answer all questions to the best of your ability</Text>
        <Text style={styles.instructionText}>• You have 30 minutes to complete the test</Text>
        <Text style={styles.instructionText}>• Each question has only one correct answer</Text>
        <Text style={styles.instructionText}>• Your results will include IQ score and program recommendations</Text>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={startTest}>
        <Brain size={20} color="#FFFFFF" />
        <Text style={styles.startButtonText}>Start Assessment</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTest = () => {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <View style={styles.testContainer}>
        <View style={styles.testHeader}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Question {currentQuestion + 1} of {questions.length}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
          
          <View style={styles.timerContainer}>
            <Clock size={16} color="#EF4444" />
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
        </View>

        <View style={styles.questionContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{question.category}</Text>
          </View>
          
          <Text style={styles.questionText}>{question.question}</Text>
          
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  answers[currentQuestion] === index && styles.selectedOption
                ]}
                onPress={() => selectAnswer(index)}
              >
                <Text style={[
                  styles.optionText,
                  answers[currentQuestion] === index && styles.selectedOptionText
                ]}>
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderResults = () => {
    const iqCategory = getIQCategory(iqScore);
    const correctAnswers = answers.reduce((count, answer, index) => {
      return count + (answer === questions[index].correct_answer ? 1 : 0);
    }, 0);

    return (
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}>
          <Award size={48} color="#3B82F6" />
          <Text style={styles.resultsTitle}>Assessment Complete!</Text>
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Your IQ Score</Text>
          <Text style={styles.scoreValue}>{iqScore}</Text>
          <Text style={[styles.scoreCategory, { color: iqCategory.color }]}>
            {iqCategory.label}
          </Text>
          <Text style={styles.scoreDetails}>
            You answered {correctAnswers} out of {questions.length} questions correctly
          </Text>
        </View>

        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Performance Breakdown</Text>
          {['logical', 'mathematical', 'verbal', 'spatial'].map(category => {
            const categoryQuestions = questions.filter(q => q.category === category);
            const categoryCorrect = categoryQuestions.reduce((count, q) => {
              const answerIndex = questions.findIndex(quest => quest.id === q.id);
              return count + (answers[answerIndex] === q.correct_answer ? 1 : 0);
            }, 0);
            const categoryPercentage = (categoryCorrect / categoryQuestions.length) * 100;

            return (
              <View key={category} style={styles.categoryBreakdown}>
                <Text style={styles.categoryName}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                <View style={styles.categoryProgressBar}>
                  <View style={[styles.categoryProgressFill, { width: `${categoryPercentage}%` }]} />
                </View>
                <Text style={styles.categoryScore}>{categoryCorrect}/{categoryQuestions.length}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.recommendationsSection}>
          <Text style={styles.recommendationsTitle}>Recommended Programs</Text>
          <Text style={styles.recommendationsSubtitle}>
            Based on your cognitive profile, here are programs that match your strengths:
          </Text>
          
          {recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <View style={styles.recommendationInfo}>
                  <Text style={styles.programName}>{rec.name}</Text>
                  <Text style={styles.universityName}>{rec.university}</Text>
                </View>
                <View style={styles.matchContainer}>
                  <Text style={styles.matchPercentage}>{rec.matchPercentage}%</Text>
                  <Text style={styles.matchLabel}>Match</Text>
                </View>
              </View>
              
              <View style={[styles.categoryBadge, { backgroundColor: `${rec.color}15` }]}>
                <Text style={[styles.categoryText, { color: rec.color }]}>{rec.category}</Text>
              </View>
              
              <Text style={styles.recommendationReason}>{rec.reason}</Text>
              
              <TouchableOpacity style={[styles.exploreButton, { backgroundColor: rec.color }]}>
                <BookOpen size={16} color="#FFFFFF" />
                <Text style={styles.exploreButtonText}>Explore Program</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.retakeButton} onPress={resetTest}>
            <TrendingUp size={20} color="#3B82F6" />
            <Text style={styles.retakeButtonText}>Retake Test</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {currentStep === 'intro' ? 'Aptitude Test' : 
           currentStep === 'test' ? 'Assessment in Progress' : 'Your Results'}
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {loadingQuestions ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading questions...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Unable to Load Questions</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchQuestions}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Calculating your results...</Text>
        </View>
      ) : (
        <>
          {currentStep === 'intro' && renderIntro()}
          {currentStep === 'test' && renderTest()}
          {currentStep === 'results' && renderResults()}
        </>
      )}
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
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
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
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  introContainer: {
    flex: 1,
    padding: 24,
  },
  introHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  introTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  testInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  infoCard: {
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
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  instructions: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  instructionsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  testContainer: {
    flex: 1,
    padding: 24,
  },
  testHeader: {
    marginBottom: 32,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#3B82F615',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    textTransform: 'capitalize',
  },
  questionText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    lineHeight: 28,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    backgroundColor: '#3B82F615',
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  selectedOptionText: {
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  resultsContainer: {
    flex: 1,
    padding: 24,
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resultsTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 16,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scoreLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginBottom: 8,
  },
  scoreCategory: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  scoreDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  breakdownSection: {
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
  breakdownTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoryBreakdown: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    width: 80,
    textTransform: 'capitalize',
  },
  categoryProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  categoryScore: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    width: 40,
    textAlign: 'right',
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  recommendationsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  recommendationCard: {
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
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationInfo: {
    flex: 1,
  },
  programName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  universityName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  matchContainer: {
    alignItems: 'center',
  },
  matchPercentage: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  matchLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  recommendationReason: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  exploreButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  actionButtons: {
    marginTop: 16,
  },
  retakeButton: {
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
  retakeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
});