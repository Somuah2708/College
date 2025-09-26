import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert, Modal, Switch, ActivityIndicator } from 'react-native';
import { X, Plus, Search, BookOpen, Calendar, Target, Star, CreditCard as Edit3, Trash2, Save, ListFilter as Filter, Clock, Brain, TrendingUp, Award, SquareCheck as CheckSquare, Play, Pause, RotateCcw, Archive, Tag, Flag, Users, Lightbulb, FileText, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';

interface StudySession {
  id: string;
  session_name: string;
  planned_duration: number; // minutes
  actual_duration?: number; // minutes
  completed: boolean;
  session_date: string;
  notes: string;
  study_method: string;
}

interface StudyGoal {
  id: string;
  goal_title: string;
  goal_description: string;
  target_date: string;
  completed: boolean;
  completed_date?: string;
}

interface StudyPlan {
  id: string;
  user_id: string;
  plan_name: string;
  description: string;
  subject: string;
  target_date: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  study_sessions: StudySession[];
  goals: StudyGoal[];
  progress_percentage: number;
  total_hours_planned: number;
  total_hours_completed: number;
  study_methods: string[];
  resources: any[];
  notes: string;
  reminder_settings: any;
  tags: string[];
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

interface StudySectionProps {
  onClose: () => void;
}

export default function StudySection({ onClose }: StudySectionProps) {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [editingPlan, setEditingPlan] = useState<StudyPlan | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [planForm, setPlanForm] = useState({
    plan_name: '',
    description: '',
    subject: '',
    target_date: '',
    priority: 'medium' as const,
    study_methods: [] as string[],
    goals: [] as StudyGoal[],
    study_sessions: [] as StudySession[],
    tags: [] as string[],
    notes: ''
  });

  const [newTag, setNewTag] = useState('');
  const [newGoal, setNewGoal] = useState({ title: '', description: '', target_date: '' });
  const [newSession, setNewSession] = useState({ name: '', duration: 60, date: '', method: 'reading' });

  useEffect(() => {
    fetchStudyPlans();
  }, []);

  useEffect(() => {
    filterPlans();
  }, [searchQuery, selectedStatus, selectedPriority, studyPlans]);

  const fetchStudyPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please sign in to access your study plans');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setStudyPlans(data || []);
    } catch (err) {
      console.error('Error fetching study plans:', err);
      setError('Failed to load study plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterPlans = () => {
    let filtered = studyPlans;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(plan =>
        plan.plan_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(plan => plan.status === selectedStatus);
    }

    // Apply priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(plan => plan.priority === selectedPriority);
    }

    setFilteredPlans(filtered);
  };

  const addStudyPlan = async () => {
    if (!planForm.plan_name.trim() || !planForm.target_date) {
      Alert.alert('Error', 'Please fill in plan name and target date');
      return;
    }

    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to create study plans');
        return;
      }

      const { error } = await supabase
        .from('study_plans')
        .insert({
          user_id: user.id,
          plan_name: planForm.plan_name,
          description: planForm.description,
          subject: planForm.subject,
          target_date: planForm.target_date,
          priority: planForm.priority,
          study_sessions: planForm.study_sessions,
          goals: planForm.goals,
          study_methods: planForm.study_methods,
          tags: planForm.tags,
          notes: planForm.notes,
          total_hours_planned: planForm.study_sessions.reduce((total, session) => total + session.planned_duration, 0)
        });

      if (error) {
        throw error;
      }

      await fetchStudyPlans();
      resetForm();
      setShowAddPlan(false);
      Alert.alert('Success', 'Study plan created successfully!');
    } catch (error) {
      console.error('Error adding study plan:', error);
      Alert.alert('Error', 'Failed to create study plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStudyPlan = async () => {
    if (!editingPlan) return;

    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to update study plans');
        return;
      }

      const { error } = await supabase
        .from('study_plans')
        .update({
          plan_name: planForm.plan_name,
          description: planForm.description,
          subject: planForm.subject,
          target_date: planForm.target_date,
          priority: planForm.priority,
          study_sessions: planForm.study_sessions,
          goals: planForm.goals,
          study_methods: planForm.study_methods,
          tags: planForm.tags,
          notes: planForm.notes,
          total_hours_planned: planForm.study_sessions.reduce((total, session) => total + session.planned_duration, 0)
        })
        .eq('id', editingPlan.id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      await fetchStudyPlans();
      setEditingPlan(null);
      resetForm();
      setShowAddPlan(false);
      Alert.alert('Success', 'Study plan updated successfully!');
    } catch (error) {
      console.error('Error updating study plan:', error);
      Alert.alert('Error', 'Failed to update study plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteStudyPlan = async (planId: string) => {
    Alert.alert(
      'Delete Study Plan',
      'Are you sure you want to delete this study plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) {
                Alert.alert('Authentication Required', 'Please sign in to delete study plans');
                return;
              }

              const { error } = await supabase
                .from('study_plans')
                .delete()
                .eq('id', planId)
                .eq('user_id', user.id);

              if (error) {
                throw error;
              }

              await fetchStudyPlans();
              Alert.alert('Success', 'Study plan deleted successfully!');
            } catch (error) {
              console.error('Error deleting study plan:', error);
              Alert.alert('Error', 'Failed to delete study plan. Please try again.');
            }
          }
        }
      ]
    );
  };

  const updatePlanStatus = async (planId: string, newStatus: StudyPlan['status']) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to update study plans');
        return;
      }

      const updateData: any = { status: newStatus };
      
      // If marking as completed, set progress to 100%
      if (newStatus === 'completed') {
        updateData.progress_percentage = 100;
      }

      const { error } = await supabase
        .from('study_plans')
        .update(updateData)
        .eq('id', planId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      await fetchStudyPlans();
    } catch (error) {
      console.error('Error updating plan status:', error);
      Alert.alert('Error', 'Failed to update plan status. Please try again.');
    }
  };

  const editPlan = (plan: StudyPlan) => {
    setEditingPlan(plan);
    setPlanForm({
      plan_name: plan.plan_name,
      description: plan.description,
      subject: plan.subject,
      target_date: plan.target_date,
      priority: plan.priority,
      study_methods: plan.study_methods,
      goals: plan.goals,
      study_sessions: plan.study_sessions,
      tags: plan.tags,
      notes: plan.notes
    });
    setShowAddPlan(true);
  };

  const resetForm = () => {
    setPlanForm({
      plan_name: '',
      description: '',
      subject: '',
      target_date: '',
      priority: 'medium',
      study_methods: [],
      goals: [],
      study_sessions: [],
      tags: [],
      notes: ''
    });
    setEditingPlan(null);
    setNewTag('');
    setNewGoal({ title: '', description: '', target_date: '' });
    setNewSession({ name: '', duration: 60, date: '', method: 'reading' });
  };

  const addTag = () => {
    if (newTag.trim() && !planForm.tags.includes(newTag.trim())) {
      setPlanForm({
        ...planForm,
        tags: [...planForm.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPlanForm({
      ...planForm,
      tags: planForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addGoal = () => {
    if (newGoal.title.trim()) {
      const goal: StudyGoal = {
        id: Date.now().toString(),
        goal_title: newGoal.title,
        goal_description: newGoal.description,
        target_date: newGoal.target_date,
        completed: false
      };
      setPlanForm({
        ...planForm,
        goals: [...planForm.goals, goal]
      });
      setNewGoal({ title: '', description: '', target_date: '' });
    }
  };

  const removeGoal = (goalId: string) => {
    setPlanForm({
      ...planForm,
      goals: planForm.goals.filter(goal => goal.id !== goalId)
    });
  };

  const addStudySession = () => {
    if (newSession.name.trim() && newSession.date) {
      const session: StudySession = {
        id: Date.now().toString(),
        session_name: newSession.name,
        planned_duration: newSession.duration,
        completed: false,
        session_date: newSession.date,
        notes: '',
        study_method: newSession.method
      };
      setPlanForm({
        ...planForm,
        study_sessions: [...planForm.study_sessions, session]
      });
      setNewSession({ name: '', duration: 60, date: '', method: 'reading' });
    }
  };

  const removeStudySession = (sessionId: string) => {
    setPlanForm({
      ...planForm,
      study_sessions: planForm.study_sessions.filter(session => session.id !== sessionId)
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'urgent': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'paused': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Play;
      case 'completed': return CheckCircle;
      case 'paused': return Pause;
      case 'cancelled': return X;
      default: return Clock;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return `${Math.abs(diffInDays)} days overdue`;
    if (diffInDays === 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    return `${diffInDays} days left`;
  };

  const calculateProgress = (plan: StudyPlan) => {
    if (plan.goals.length === 0) return 0;
    const completedGoals = plan.goals.filter(goal => goal.completed).length;
    return Math.round((completedGoals / plan.goals.length) * 100);
  };

  const renderAddPlanModal = () => (
    <Modal
      visible={showAddPlan}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowAddPlan(false);
        resetForm();
      }}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingPlan ? 'Edit Study Plan' : 'Create New Study Plan'}
          </Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => {
              setShowAddPlan(false);
              resetForm();
            }}
          >
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Plan Name</Text>
            <TextInput
              style={styles.input}
              value={planForm.plan_name}
              onChangeText={(text) => setPlanForm({...planForm, plan_name: text})}
              placeholder="Enter study plan name..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject</Text>
            <TextInput
              style={styles.input}
              value={planForm.subject}
              onChangeText={(text) => setPlanForm({...planForm, subject: text})}
              placeholder="e.g., Mathematics, Computer Science..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={planForm.description}
              onChangeText={(text) => setPlanForm({...planForm, description: text})}
              placeholder="Describe your study plan goals and approach..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateInput}>
              <Text style={styles.inputLabel}>Target Date</Text>
              <TextInput
                style={styles.input}
                value={planForm.target_date}
                onChangeText={(text) => setPlanForm({...planForm, target_date: text})}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.priorityInput}>
              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.prioritySelector}>
                {['low', 'medium', 'high', 'urgent'].map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      planForm.priority === priority && styles.selectedPriorityButton,
                      { backgroundColor: planForm.priority === priority ? getPriorityColor(priority) : '#F3F4F6' }
                    ]}
                    onPress={() => setPlanForm({...planForm, priority: priority as any})}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      { color: planForm.priority === priority ? '#FFFFFF' : '#6B7280' }
                    ]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Study Methods */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Study Methods</Text>
            <View style={styles.methodsSelector}>
              {['reading', 'note_taking', 'practice_problems', 'flashcards', 'group_study', 'online_courses', 'video_tutorials', 'research'].map((method) => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.methodButton,
                    planForm.study_methods.includes(method) && styles.selectedMethodButton
                  ]}
                  onPress={() => {
                    const newMethods = planForm.study_methods.includes(method)
                      ? planForm.study_methods.filter(m => m !== method)
                      : [...planForm.study_methods, method];
                    setPlanForm({...planForm, study_methods: newMethods});
                  }}
                >
                  <Text style={[
                    styles.methodButtonText,
                    planForm.study_methods.includes(method) && styles.selectedMethodButtonText
                  ]}>
                    {method.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Goals */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Study Goals</Text>
            <View style={styles.goalsList}>
              {planForm.goals.map((goal) => (
                <View key={goal.id} style={styles.goalItem}>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalTitle}>{goal.goal_title}</Text>
                    <Text style={styles.goalDescription}>{goal.goal_description}</Text>
                    <Text style={styles.goalDate}>Target: {new Date(goal.target_date).toLocaleDateString()}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeGoal(goal.id)}>
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            
            <View style={styles.addGoalContainer}>
              <Text style={styles.addGoalTitle}>Add New Goal</Text>
              <TextInput
                style={styles.input}
                value={newGoal.title}
                onChangeText={(text) => setNewGoal({...newGoal, title: text})}
                placeholder="Goal title..."
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                style={styles.input}
                value={newGoal.description}
                onChangeText={(text) => setNewGoal({...newGoal, description: text})}
                placeholder="Goal description..."
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                style={styles.input}
                value={newGoal.target_date}
                onChangeText={(text) => setNewGoal({...newGoal, target_date: text})}
                placeholder="Target date (YYYY-MM-DD)..."
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity style={styles.addGoalButton} onPress={addGoal}>
                <Plus size={16} color="#3B82F6" />
                <Text style={styles.addGoalButtonText}>Add Goal</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Study Sessions */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Study Sessions</Text>
            <View style={styles.sessionsList}>
              {planForm.study_sessions.map((session) => (
                <View key={session.id} style={styles.sessionItem}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionName}>{session.session_name}</Text>
                    <Text style={styles.sessionDetails}>
                      {session.planned_duration} min • {session.study_method} • {new Date(session.session_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeStudySession(session.id)}>
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            
            <View style={styles.addSessionContainer}>
              <Text style={styles.addSessionTitle}>Add Study Session</Text>
              <TextInput
                style={styles.input}
                value={newSession.name}
                onChangeText={(text) => setNewSession({...newSession, name: text})}
                placeholder="Session name..."
                placeholderTextColor="#9CA3AF"
              />
              <View style={styles.sessionRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 8 }]}
                  value={newSession.duration.toString()}
                  onChangeText={(text) => setNewSession({...newSession, duration: parseInt(text) || 0})}
                  placeholder="Duration (minutes)"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={newSession.date}
                  onChangeText={(text) => setNewSession({...newSession, date: text})}
                  placeholder="Date (YYYY-MM-DD)"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <TouchableOpacity style={styles.addSessionButton} onPress={addStudySession}>
                <Plus size={16} color="#10B981" />
                <Text style={styles.addSessionButtonText}>Add Session</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tags</Text>
            <View style={styles.tagsContainer}>
              {planForm.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <X size={14} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.addTagContainer}>
              <TextInput
                style={styles.tagInput}
                value={newTag}
                onChangeText={setNewTag}
                placeholder="Add a tag..."
                placeholderTextColor="#9CA3AF"
                onSubmitEditing={addTag}
              />
              <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
                <Plus size={16} color="#8B5CF6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={styles.textArea}
              value={planForm.notes}
              onChangeText={(text) => setPlanForm({...planForm, notes: text})}
              placeholder="Additional notes or reminders..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={editingPlan ? updateStudyPlan : addStudyPlan}
            disabled={loading}
          >
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderPlanCard = (plan: StudyPlan) => {
    const StatusIcon = getStatusIcon(plan.status);
    const progress = calculateProgress(plan);
    const daysLeft = formatDate(plan.target_date);
    const isOverdue = new Date(plan.target_date) < new Date() && plan.status !== 'completed';

    return (
      <View key={plan.id} style={[styles.planCard, { borderLeftColor: getPriorityColor(plan.priority) }]}>
        <View style={styles.planHeader}>
          <View style={styles.planInfo}>
            <Text style={styles.planName}>{plan.plan_name}</Text>
            <Text style={styles.planSubject}>{plan.subject}</Text>
          </View>
          <View style={styles.planMeta}>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(plan.status)}15` }]}>
              <StatusIcon size={12} color={getStatusColor(plan.status)} />
              <Text style={[styles.statusText, { color: getStatusColor(plan.status) }]}>
                {plan.status}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.planMenuButton}
              onPress={() => {
                Alert.alert(
                  'Plan Options',
                  'Choose an action',
                  [
                    { text: 'Edit', onPress: () => editPlan(plan) },
                    { text: 'Mark Completed', onPress: () => updatePlanStatus(plan.id, 'completed') },
                    { text: 'Pause', onPress: () => updatePlanStatus(plan.id, 'paused') },
                    { text: 'Delete', onPress: () => deleteStudyPlan(plan.id), style: 'destructive' },
                    { text: 'Cancel', style: 'cancel' }
                  ]
                );
              }}
            >
              <Edit3 size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.planDescription} numberOfLines={2}>
          {plan.description}
        </Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercentage}>{progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.planStats}>
          <View style={styles.statItem}>
            <Target size={16} color="#6B7280" />
            <Text style={styles.statText}>{plan.goals.length} goals</Text>
          </View>
          <View style={styles.statItem}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.statText}>{plan.study_sessions.length} sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Calendar size={16} color={isOverdue ? "#EF4444" : "#6B7280"} />
            <Text style={[styles.statText, isOverdue && styles.overdueText]}>{daysLeft}</Text>
          </View>
        </View>

        <View style={styles.planFooter}>
          <View style={styles.tagsContainer}>
            {plan.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.planTag}>
                <Text style={styles.planTagText}>#{tag}</Text>
              </View>
            ))}
            {plan.tags.length > 2 && (
              <Text style={styles.moreTags}>+{plan.tags.length - 2}</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  const statusOptions = [
    { key: 'all', label: 'All Plans', count: studyPlans.length },
    { key: 'active', label: 'Active', count: studyPlans.filter(p => p.status === 'active').length },
    { key: 'completed', label: 'Completed', count: studyPlans.filter(p => p.status === 'completed').length },
    { key: 'paused', label: 'Paused', count: studyPlans.filter(p => p.status === 'paused').length }
  ];

  const priorityOptions = [
    { key: 'all', label: 'All Priorities' },
    { key: 'urgent', label: 'Urgent' },
    { key: 'high', label: 'High' },
    { key: 'medium', label: 'Medium' },
    { key: 'low', label: 'Low' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Study Planner</Text>
          <Text style={styles.subtitle}>Organize your study schedule and track progress</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddPlan(true)}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <BookOpen size={20} color="#3B82F6" />
          <Text style={styles.statValue}>{studyPlans.length}</Text>
          <Text style={styles.statLabel}>Total Plans</Text>
        </View>
        <View style={styles.statCard}>
          <Play size={20} color="#10B981" />
          <Text style={styles.statValue}>{studyPlans.filter(p => p.status === 'active').length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <CheckCircle size={20} color="#F59E0B" />
          <Text style={styles.statValue}>{studyPlans.filter(p => p.status === 'completed').length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Clock size={20} color="#8B5CF6" />
          <Text style={styles.statValue}>
            {studyPlans.reduce((total, plan) => total + plan.total_hours_planned, 0)}h
          </Text>
          <Text style={styles.statLabel}>Planned Hours</Text>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search study plans..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {statusOptions.map((status) => (
            <TouchableOpacity
              key={status.key}
              style={[
                styles.filterButton,
                selectedStatus === status.key && styles.activeFilterButton
              ]}
              onPress={() => setSelectedStatus(status.key)}
            >
              <Text style={[
                styles.filterText,
                selectedStatus === status.key && styles.activeFilterText
              ]}>
                {status.label} ({status.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.plansContainer} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading study plans...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={48} color="#EF4444" />
            <Text style={styles.errorTitle}>Unable to Load Study Plans</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchStudyPlans}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && filteredPlans.length === 0 && (
          <View style={styles.emptyContainer}>
            <BookOpen size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No study plans found</Text>
            <Text style={styles.emptyText}>
              {searchQuery || selectedStatus !== 'all' || selectedPriority !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first study plan to get started'}
            </Text>
            <TouchableOpacity
              style={styles.createFirstButton}
              onPress={() => setShowAddPlan(true)}
            >
              <Plus size={16} color="#3B82F6" />
              <Text style={styles.createFirstText}>Create Study Plan</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && filteredPlans.length > 0 && (
          <View style={styles.plansGrid}>
            {filteredPlans.map((plan) => renderPlanCard(plan))}
          </View>
        )}
      </ScrollView>

      {renderAddPlanModal()}
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
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
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
  filtersContainer: {
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
  activeFilterButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  plansContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  createFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  createFirstText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginLeft: 6,
  },
  plansGrid: {
    gap: 16,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  planSubject: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  planMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  planMenuButton: {
    padding: 4,
  },
  planDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  planStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  overdueText: {
    color: '#EF4444',
    fontFamily: 'Inter-SemiBold',
  },
  planFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planTag: {
    backgroundColor: '#3B82F615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  planTagText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  moreTags: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
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
  closeButton: {
    padding: 4,
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    minHeight: 100,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  dateInput: {
    flex: 1,
  },
  priorityInput: {
    flex: 1,
  },
  prioritySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  priorityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedPriorityButton: {
    // Style handled by backgroundColor in component
  },
  priorityButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  methodsSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  methodButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedMethodButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  methodButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  selectedMethodButtonText: {
    color: '#FFFFFF',
  },
  goalsList: {
    gap: 12,
    marginBottom: 16,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  goalDate: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  addGoalContainer: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  addGoalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 12,
  },
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    gap: 6,
    marginTop: 8,
  },
  addGoalButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  sessionsList: {
    gap: 12,
    marginBottom: 16,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sessionDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  addSessionContainer: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  addSessionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#15803D',
    marginBottom: 12,
  },
  sessionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
    gap: 6,
    marginTop: 8,
  },
  addSessionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF615',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    marginRight: 6,
  },
  addTagContainer: {
    flexDirection: 'row',
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: '#8B5CF615',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});