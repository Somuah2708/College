import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert, Modal, Switch } from 'react-native';
import { X, Briefcase, Plus, Target, TrendingUp, Calendar, MapPin, Building, Users, Award, ExternalLink, Mail, Phone, Clock, Star, CreditCard as Edit3, Trash2, Save, ListFilter as Filter, Search, CircleCheck as CheckCircle, CircleAlert as AlertCircle, FileText, Globe, Heart, Lightbulb, DollarSign, BookOpen } from 'lucide-react-native';

interface CareerEvent {
  id: string;
  title: string;
  type: 'job_fair' | 'networking' | 'workshop' | 'interview' | 'application_deadline' | 'conference' | 'webinar';
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  website_url: string;
  contact_email: string;
  registration_required: boolean;
  registration_deadline: string;
  cost: string;
  capacity: string;
  skills_focus: string[];
  target_audience: string;
  benefits: string;
  preparation_tips: string;
  status: 'upcoming' | 'registered' | 'attended' | 'missed';
  reminder_set: boolean;
  notes: string;
  order_index: number;
}

interface CareerGoal {
  id: string;
  goal_title: string;
  goal_type: 'short_term' | 'medium_term' | 'long_term';
  description: string;
  target_date: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  progress_percentage: number;
  milestones: Milestone[];
  resources_needed: string[];
  skills_to_develop: string[];
  networking_targets: string[];
  action_steps: ActionStep[];
  success_metrics: string[];
  obstacles: string[];
  support_needed: string;
  created_at: string;
  updated_at: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  target_date: string;
  completed: boolean;
  completed_date?: string;
}

interface ActionStep {
  id: string;
  step_title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  completed_date?: string;
}

interface JobApplication {
  id: string;
  company_name: string;
  position_title: string;
  application_date: string;
  application_status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  job_description: string;
  salary_range: string;
  location: string;
  application_url: string;
  contact_person: string;
  contact_email: string;
  interview_dates: string[];
  follow_up_dates: string[];
  notes: string;
  skills_required: string[];
  company_research: string;
  application_materials: string[];
  next_steps: string;
  priority_level: 'low' | 'medium' | 'high';
}

interface CareerTrackerProps {
  onClose: () => void;
}

export default function CareerTracker({ onClose }: CareerTrackerProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'goals' | 'applications' | 'networking'>('dashboard');
  const [events, setEvents] = useState<CareerEvent[]>([]);
  const [goals, setGoals] = useState<CareerGoal[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddApplication, setShowAddApplication] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Form states
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'job_fair' as const,
    description: '',
    date: '',
    time: '09:00',
    location: '',
    organizer: '',
    website_url: '',
    contact_email: '',
    registration_required: false,
    registration_deadline: '',
    cost: 'Free',
    capacity: '',
    skills_focus: [] as string[],
    target_audience: '',
    benefits: '',
    preparation_tips: '',
    reminder_set: true,
    notes: ''
  });

  const [goalForm, setGoalForm] = useState({
    goal_title: '',
    goal_type: 'short_term' as const,
    description: '',
    target_date: '',
    priority: 'medium' as const,
    skills_to_develop: [] as string[],
    action_steps: [] as ActionStep[],
    success_metrics: [] as string[]
  });

  const [applicationForm, setApplicationForm] = useState({
    company_name: '',
    position_title: '',
    application_date: '',
    job_description: '',
    salary_range: '',
    location: '',
    application_url: '',
    contact_person: '',
    contact_email: '',
    skills_required: [] as string[],
    company_research: '',
    notes: '',
    priority_level: 'medium' as const
  });

  const addEvent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to add events');
        return;
      }

      const { error } = await supabase
        .from('career_events')
        .insert({
          user_id: user.id,
          title: eventForm.title,
          event_type: eventForm.type,
          description: eventForm.description,
          event_date: eventForm.date,
          event_time: eventForm.time,
          location: eventForm.location,
          organizer: eventForm.organizer,
          website_url: eventForm.website_url,
          contact_email: eventForm.contact_email,
          registration_required: eventForm.registration_required,
          registration_deadline: eventForm.registration_deadline || null,
          cost: eventForm.cost,
          capacity: eventForm.capacity,
          skills_focus: eventForm.skills_focus,
          target_audience: eventForm.target_audience,
          benefits: eventForm.benefits,
          preparation_tips: eventForm.preparation_tips,
          reminder_set: eventForm.reminder_set,
          notes: eventForm.notes
        });

      if (error) {
        throw error;
      }

      await fetchCareerData();
      resetEventForm();
      setShowAddEvent(false);
      Alert.alert('Success', 'Event added successfully!');
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert('Error', 'Failed to add event. Please try again.');
    }
  };

  const addGoal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to add goals');
        return;
      }

      const { error } = await supabase
        .from('career_goals')
        .insert({
          user_id: user.id,
          goal_title: goalForm.goal_title,
          goal_type: goalForm.goal_type,
          description: goalForm.description,
          target_date: goalForm.target_date,
          priority: goalForm.priority,
          skills_to_develop: goalForm.skills_to_develop,
          action_steps: goalForm.action_steps,
          success_metrics: goalForm.success_metrics
        });

      if (error) {
        throw error;
      }

      await fetchCareerData();
      resetGoalForm();
      setShowAddGoal(false);
      Alert.alert('Success', 'Goal added successfully!');
    } catch (error) {
      console.error('Error adding goal:', error);
      Alert.alert('Error', 'Failed to add goal. Please try again.');
    }
  };

  const addApplication = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to add applications');
        return;
      }

      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          company_name: applicationForm.company_name,
          position_title: applicationForm.position_title,
          application_date: applicationForm.application_date,
          job_description: applicationForm.job_description,
          salary_range: applicationForm.salary_range,
          location: applicationForm.location,
          application_url: applicationForm.application_url,
          contact_person: applicationForm.contact_person,
          contact_email: applicationForm.contact_email,
          skills_required: applicationForm.skills_required,
          company_research: applicationForm.company_research,
          notes: applicationForm.notes,
          priority_level: applicationForm.priority_level
        });

      if (error) {
        throw error;
      }

      await fetchCareerData();
      resetApplicationForm();
      setShowAddApplication(false);
      Alert.alert('Success', 'Application added successfully!');
    } catch (error) {
      console.error('Error adding application:', error);
      Alert.alert('Error', 'Failed to add application. Please try again.');
    }
  };

  const updateEventStatus = async (eventId: string, newStatus: CareerEvent['status']) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to update events');
        return;
      }

      const { error } = await supabase
        .from('career_events')
        .update({ status: newStatus })
        .eq('id', eventId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      await fetchCareerData();
    } catch (error) {
      console.error('Error updating event status:', error);
      Alert.alert('Error', 'Failed to update event status. Please try again.');
    }
  };

  const updateGoalProgress = async (goalId: string, newProgress: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to update goals');
        return;
      }

      const newStatus = newProgress >= 100 ? 'completed' : 'in_progress';

      const { error } = await supabase
        .from('career_goals')
        .update({ 
          progress_percentage: newProgress,
          status: newStatus
        })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      await fetchCareerData();
    } catch (error) {
      console.error('Error updating goal progress:', error);
      Alert.alert('Error', 'Failed to update goal progress. Please try again.');
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: JobApplication['application_status']) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to update applications');
        return;
      }

      const { error } = await supabase
        .from('job_applications')
        .update({ application_status: newStatus })
        .eq('id', applicationId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      await fetchCareerData();
    } catch (error) {
      console.error('Error updating application status:', error);
      Alert.alert('Error', 'Failed to update application status. Please try again.');
    }
  };

  const deleteEvent = async (eventId: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) {
                Alert.alert('Authentication Required', 'Please sign in to delete events');
                return;
              }

              const { error } = await supabase
                .from('career_events')
                .delete()
                .eq('id', eventId)
                .eq('user_id', user.id);

              if (error) {
                throw error;
              }

              await fetchCareerData();
              Alert.alert('Success', 'Event deleted successfully!');
            } catch (error) {
              console.error('Error deleting event:', error);
              Alert.alert('Error', 'Failed to delete event. Please try again.');
            }
          }
        }
      ]
    );
  };

  const deleteGoal = async (goalId: string) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) {
                Alert.alert('Authentication Required', 'Please sign in to delete goals');
                return;
              }

              const { error } = await supabase
                .from('career_goals')
                .delete()
                .eq('id', goalId)
                .eq('user_id', user.id);

              if (error) {
                throw error;
              }

              await fetchCareerData();
              Alert.alert('Success', 'Goal deleted successfully!');
            } catch (error) {
              console.error('Error deleting goal:', error);
              Alert.alert('Error', 'Failed to delete goal. Please try again.');
            }
          }
        }
      ]
    );
  };

  const deleteApplication = async (applicationId: string) => {
    Alert.alert(
      'Delete Application',
      'Are you sure you want to delete this application?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) {
                Alert.alert('Authentication Required', 'Please sign in to delete applications');
                return;
              }

              const { error } = await supabase
                .from('job_applications')
                .delete()
                .eq('id', applicationId)
                .eq('user_id', user.id);

              if (error) {
                throw error;
              }

              await fetchCareerData();
              Alert.alert('Success', 'Application deleted successfully!');
            } catch (error) {
              console.error('Error deleting application:', error);
              Alert.alert('Error', 'Failed to delete application. Please try again.');
            }
          }
        }
      ]
    );
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      type: 'job_fair',
      description: '',
      date: '',
      time: '09:00',
      location: '',
      organizer: '',
      website_url: '',
      contact_email: '',
      registration_required: false,
      registration_deadline: '',
      cost: 'Free',
      capacity: '',
      skills_focus: [],
      target_audience: '',
      benefits: '',
      preparation_tips: '',
      reminder_set: true,
      notes: ''
    });
  };

  const resetGoalForm = () => {
    setGoalForm({
      goal_title: '',
      goal_type: 'short_term',
      description: '',
      target_date: '',
      priority: 'medium',
      skills_to_develop: [],
      action_steps: [],
      success_metrics: []
    });
  };

  const resetApplicationForm = () => {
    setApplicationForm({
      company_name: '',
      position_title: '',
      application_date: '',
      job_description: '',
      salary_range: '',
      location: '',
      application_url: '',
      contact_person: '',
      contact_email: '',
      skills_required: [],
      company_research: '',
      notes: '',
      priority_level: 'medium'
    });
  };
  useEffect(() => {
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      // Fetch career events
      const { data: eventsData, error: eventsError } = await supabase
        .from('career_events')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true });

      if (eventsError) {
        console.error('Error fetching career events:', eventsError);
      } else {
        setEvents(eventsData || []);
      }

      // Fetch career goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('career_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('target_date', { ascending: true });

      if (goalsError) {
        console.error('Error fetching career goals:', goalsError);
      } else {
        setGoals(goalsData || []);
      }

      // Fetch job applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('application_date', { ascending: false });

      if (applicationsError) {
        console.error('Error fetching job applications:', applicationsError);
      } else {
        setApplications(applicationsData || []);
      }
    } catch (error) {
      console.error('Error fetching career data:', error);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'job_fair': return '#3B82F6';
      case 'networking': return '#10B981';
      case 'workshop': return '#8B5CF6';
      case 'interview': return '#F59E0B';
      case 'application_deadline': return '#EF4444';
      case 'conference': return '#06B6D4';
      case 'webinar': return '#EC4899';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#6B7280';
      case 'registered': return '#3B82F6';
      case 'attended': return '#10B981';
      case 'missed': return '#EF4444';
      case 'applied': return '#F59E0B';
      case 'interview': return '#8B5CF6';
      case 'offer': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'critical': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const renderDashboardTab = () => {
    const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).slice(0, 3);
    const activeGoals = goals.filter(goal => goal.status === 'in_progress').slice(0, 3);
    const recentApplications = applications.slice(0, 3);

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* Career Overview */}
        <View style={styles.overviewSection}>
          <Text style={styles.overviewTitle}>Career Dashboard</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Calendar size={24} color="#3B82F6" />
              <Text style={styles.statValue}>{events.length}</Text>
              <Text style={styles.statLabel}>Events Tracked</Text>
            </View>
            <View style={styles.statCard}>
              <Target size={24} color="#10B981" />
              <Text style={styles.statValue}>{goals.filter(g => g.status === 'in_progress').length}</Text>
              <Text style={styles.statLabel}>Active Goals</Text>
            </View>
            <View style={styles.statCard}>
              <Briefcase size={24} color="#8B5CF6" />
              <Text style={styles.statValue}>{applications.length}</Text>
              <Text style={styles.statLabel}>Applications</Text>
            </View>
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#F59E0B" />
              <Text style={styles.statValue}>
                {Math.round((applications.filter(a => a.application_status === 'interview').length / Math.max(applications.length, 1)) * 100)}%
              </Text>
              <Text style={styles.statLabel}>Interview Rate</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={() => setActiveTab('events')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {upcomingEvents.map((event) => (
            <View key={event.id} style={styles.eventPreview}>
              <View style={[styles.eventTypeIndicator, { backgroundColor: getEventTypeColor(event.type) }]} />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{new Date(event.date).toLocaleDateString()} at {event.time}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(event.status)}15` }]}>
                <Text style={[styles.statusText, { color: getStatusColor(event.status) }]}>
                  {event.status.replace('_', ' ')}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Active Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Goals</Text>
            <TouchableOpacity onPress={() => setActiveTab('goals')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {activeGoals.map((goal) => (
            <View key={goal.id} style={styles.goalPreview}>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>{goal.goal_title}</Text>
                <Text style={styles.goalDeadline}>Target: {new Date(goal.target_date).toLocaleDateString()}</Text>
                <View style={styles.goalProgress}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${goal.progress_percentage}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{goal.progress_percentage}%</Text>
                </View>
              </View>
              <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(goal.priority)}15` }]}>
                <Text style={[styles.priorityText, { color: getPriorityColor(goal.priority) }]}>
                  {goal.priority}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Applications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Applications</Text>
            <TouchableOpacity onPress={() => setActiveTab('applications')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentApplications.map((application) => (
            <View key={application.id} style={styles.applicationPreview}>
              <View style={styles.applicationInfo}>
                <Text style={styles.applicationPosition}>{application.position_title}</Text>
                <Text style={styles.applicationCompany}>{application.company_name}</Text>
                <Text style={styles.applicationDate}>Applied: {new Date(application.application_date).toLocaleDateString()}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(application.application_status)}15` }]}>
                <Text style={[styles.statusText, { color: getStatusColor(application.application_status) }]}>
                  {application.application_status.replace('_', ' ')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderEventsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Career Events</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddEvent(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {events.map((event) => (
        <View key={event.id} style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <View style={styles.eventTitleRow}>
              <View style={[styles.eventTypeIcon, { backgroundColor: `${getEventTypeColor(event.type)}15` }]}>
                <Calendar size={16} color={getEventTypeColor(event.type)} />
              </View>
              <Text style={styles.eventCardTitle}>{event.title}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(event.status)}15` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(event.status) }]}>
                {event.status.replace('_', ' ')}
              </Text>
            </View>
          </View>

          <Text style={styles.eventDescription}>{event.description}</Text>

          <View style={styles.eventDetails}>
            <View style={styles.eventDetailRow}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.eventDetailText}>{new Date(event.date).toLocaleDateString()} at {event.time}</Text>
            </View>
            <View style={styles.eventDetailRow}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.eventDetailText}>{event.location}</Text>
            </View>
            <View style={styles.eventDetailRow}>
              <Building size={16} color="#6B7280" />
              <Text style={styles.eventDetailText}>{event.organizer}</Text>
            </View>
            {event.cost && (
              <View style={styles.eventDetailRow}>
                <DollarSign size={16} color="#6B7280" />
                <Text style={styles.eventDetailText}>{event.cost}</Text>
              </View>
            )}
          </View>

          {event.skills_focus.length > 0 && (
            <View style={styles.skillsSection}>
              <Text style={styles.skillsTitle}>Skills Focus:</Text>
              <View style={styles.skillsTags}>
                {event.skills_focus.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillTagText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.eventActions}>
            <TouchableOpacity style={styles.primaryEventButton}>
              <ExternalLink size={16} color="#FFFFFF" />
              <Text style={styles.primaryEventButtonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.secondaryEventButton}
              onPress={() => updateEventStatus(event.id, event.status === 'attended' ? 'upcoming' : 'attended')}
            >
              <Edit3 size={16} color="#3B82F6" />
              <Text style={styles.secondaryEventButtonText}>
                {event.status === 'attended' ? 'Mark Upcoming' : 'Mark Attended'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteEventButton}
              onPress={() => deleteEvent(event.id)}
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderGoalsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Career Goals</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddGoal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {goals.map((goal) => (
        <View key={goal.id} style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.goalTitleRow}>
              <Text style={styles.goalCardTitle}>{goal.goal_title}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(goal.priority)}15` }]}>
                <Text style={[styles.priorityText, { color: getPriorityColor(goal.priority) }]}>
                  {goal.priority}
                </Text>
              </View>
            </View>
            <Text style={styles.goalDescription}>{goal.description}</Text>
          </View>

          <View style={styles.goalProgress}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressPercentage}>{goal.progress_percentage}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${goal.progress_percentage}%` }]} />
            </View>
          </View>

          <View style={styles.milestonesSection}>
            <Text style={styles.milestonesTitle}>Milestones</Text>
            {goal.milestones.map((milestone) => (
              <View key={milestone.id} style={styles.milestoneItem}>
                <CheckCircle 
                  size={16} 
                  color={milestone.completed ? '#10B981' : '#E5E7EB'} 
                  fill={milestone.completed ? '#10B981' : 'none'}
                />
                <Text style={[
                  styles.milestoneText,
                  milestone.completed && styles.completedMilestone
                ]}>
                  {milestone.title}
                </Text>
                <Text style={styles.milestoneDate}>
                  {new Date(milestone.target_date).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.goalActions}>
            <TouchableOpacity 
              style={styles.editGoalButton}
              onPress={() => updateGoalProgress(goal.id, Math.min(goal.progress_percentage + 25, 100))}
            >
              <Edit3 size={16} color="#3B82F6" />
              <Text style={styles.editGoalButtonText}>+25% Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.updateProgressButton}
              onPress={() => deleteGoal(goal.id)}
            >
              <TrendingUp size={16} color="#10B981" />
              <Text style={styles.updateProgressButtonText}>Delete Goal</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderApplicationsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Job Applications</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddApplication(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {applications.map((application) => (
        <View key={application.id} style={styles.applicationCard}>
          <View style={styles.applicationHeader}>
            <View style={styles.applicationTitleRow}>
              <Text style={styles.applicationPosition}>{application.position_title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(application.application_status)}15` }]}>
                <Text style={[styles.statusText, { color: getStatusColor(application.application_status) }]}>
                  {application.application_status.replace('_', ' ')}
                </Text>
              </View>
            </View>
            <Text style={styles.applicationCompany}>{application.company_name}</Text>
          </View>

          <View style={styles.applicationDetails}>
            <View style={styles.applicationDetailRow}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.applicationDetailText}>
                Applied: {new Date(application.application_date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.applicationDetailRow}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.applicationDetailText}>{application.location}</Text>
            </View>
            <View style={styles.applicationDetailRow}>
              <DollarSign size={16} color="#6B7280" />
              <Text style={styles.applicationDetailText}>{application.salary_range}</Text>
            </View>
          </View>

          {application.skills_required.length > 0 && (
            <View style={styles.skillsSection}>
              <Text style={styles.skillsTitle}>Required Skills:</Text>
              <View style={styles.skillsTags}>
                {application.skills_required.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillTagText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {application.next_steps && (
            <View style={styles.nextStepsSection}>
              <Text style={styles.nextStepsTitle}>Next Steps:</Text>
              <Text style={styles.nextStepsText}>{application.next_steps}</Text>
            </View>
          )}

          <View style={styles.applicationActions}>
            <TouchableOpacity style={styles.primaryApplicationButton}>
              <ExternalLink size={16} color="#FFFFFF" />
              <Text style={styles.primaryApplicationButtonText}>View Job</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.secondaryApplicationButton}
              onPress={() => {
                const statusOptions: JobApplication['application_status'][] = ['applied', 'screening', 'interview', 'offer', 'rejected'];
                const currentIndex = statusOptions.indexOf(application.application_status);
                const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
                updateApplicationStatus(application.id, nextStatus);
              }}
            >
              <Edit3 size={16} color="#3B82F6" />
              <Text style={styles.secondaryApplicationButtonText}>Update Status</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteApplicationButton}
              onPress={() => deleteApplication(application.id)}
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderNetworkingTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.networkingHeader}>
        <Text style={styles.networkingTitle}>Professional Networking</Text>
        <Text style={styles.networkingSubtitle}>Build and maintain your professional network</Text>
      </View>

      <View style={styles.networkingStats}>
        <View style={styles.networkingStatCard}>
          <Users size={24} color="#3B82F6" />
          <Text style={styles.networkingStatValue}>127</Text>
          <Text style={styles.networkingStatLabel}>LinkedIn Connections</Text>
        </View>
        <View style={styles.networkingStatCard}>
          <Calendar size={24} color="#10B981" />
          <Text style={styles.networkingStatValue}>8</Text>
          <Text style={styles.networkingStatLabel}>Events Attended</Text>
        </View>
        <View style={styles.networkingStatCard}>
          <Heart size={24} color="#EF4444" />
          <Text style={styles.networkingStatValue}>15</Text>
          <Text style={styles.networkingStatLabel}>Mentors & Contacts</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Networking Tips</Text>
        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <Lightbulb size={16} color="#F59E0B" />
            <Text style={styles.tipText}>Follow up within 24-48 hours after meeting someone new</Text>
          </View>
          <View style={styles.tipItem}>
            <Users size={16} color="#3B82F6" />
            <Text style={styles.tipText}>Attend at least 2 networking events per month</Text>
          </View>
          <View style={styles.tipItem}>
            <Target size={16} color="#10B981" />
            <Text style={styles.tipText}>Set specific networking goals for each event</Text>
          </View>
          <View style={styles.tipItem}>
            <Heart size={16} color="#EF4444" />
            <Text style={styles.tipText}>Focus on building genuine relationships, not just collecting contacts</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Networking Action Items</Text>
        <View style={styles.actionItemsList}>
          <View style={styles.actionItem}>
            <CheckCircle size={16} color="#E5E7EB" />
            <Text style={styles.actionItemText}>Update LinkedIn profile with recent projects</Text>
            <Text style={styles.actionItemDate}>Due: Tomorrow</Text>
          </View>
          <View style={styles.actionItem}>
            <CheckCircle size={16} color="#E5E7EB" />
            <Text style={styles.actionItemText}>Reach out to 3 alumni this week</Text>
            <Text style={styles.actionItemDate}>Due: Friday</Text>
          </View>
          <View style={styles.actionItem}>
            <CheckCircle size={16} color="#10B981" fill="#10B981" />
            <Text style={[styles.actionItemText, styles.completedActionItem]}>
              Attend Tech Meetup
            </Text>
            <Text style={styles.actionItemDate}>Completed</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { key: 'events', label: 'Events', icon: Calendar },
    { key: 'goals', label: 'Goals', icon: Target },
    { key: 'applications', label: 'Applications', icon: Briefcase },
    { key: 'networking', label: 'Networking', icon: Users },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Career Tracker</Text>
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

      {activeTab === 'dashboard' && renderDashboardTab()}
      {activeTab === 'events' && renderEventsTab()}
      {activeTab === 'goals' && renderGoalsTab()}
      {activeTab === 'applications' && renderApplicationsTab()}
      {activeTab === 'networking' && renderNetworkingTab()}
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
  tabContent: {
    flex: 1,
    padding: 24,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tabTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 10,
  },
  overviewSection: {
    marginBottom: 24,
  },
  overviewTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
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
  statValue: {
    fontSize: 24,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  eventPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  eventTypeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  goalPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  goalDeadline: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  goalProgress: {
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  applicationPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  applicationInfo: {
    flex: 1,
  },
  applicationPosition: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  applicationCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginBottom: 2,
  },
  applicationDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  filterSection: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  eventCard: {
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
  eventHeader: {
    marginBottom: 12,
  },
  eventTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventCardTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  eventDetails: {
    marginBottom: 16,
    gap: 8,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  skillsSection: {
    marginBottom: 16,
  },
  skillsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  skillsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: '#3B82F615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryEventButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  primaryEventButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  secondaryEventButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    gap: 4,
  },
  secondaryEventButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  goalCard: {
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
  goalHeader: {
    marginBottom: 16,
  },
  goalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  goalCardTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginRight: 12,
  },
  goalDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
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
  milestonesSection: {
    marginBottom: 16,
  },
  milestonesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  milestoneText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  completedMilestone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  milestoneDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  goalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editGoalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    gap: 4,
  },
  editGoalButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  updateProgressButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  updateProgressButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  applicationCard: {
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
  applicationHeader: {
    marginBottom: 16,
  },
  applicationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  applicationDetails: {
    marginBottom: 16,
    gap: 8,
  },
  applicationDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  applicationDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  nextStepsSection: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  nextStepsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0369A1',
    marginBottom: 6,
  },
  nextStepsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    lineHeight: 18,
  },
  applicationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryApplicationButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  primaryApplicationButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  secondaryApplicationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    gap: 4,
  },
  secondaryApplicationButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  deleteEventButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  deleteApplicationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
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
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dateInput: {
    flex: 2,
  },
  timeInput: {
    flex: 1,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedTypeButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  typeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  selectedTypeButtonText: {
    color: '#FFFFFF',
  },
  prioritySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedPriorityButton: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  priorityButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  selectedPriorityButtonText: {
    color: '#FFFFFF',
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
  networkingHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  networkingTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  networkingSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  networkingStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  networkingStatCard: {
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
  networkingStatValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  networkingStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  actionItemsList: {
    gap: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
  },
  actionItemText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  completedActionItem: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  actionItemDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});