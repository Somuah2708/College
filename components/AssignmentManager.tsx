import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert, Modal, Switch } from 'react-native';
import { X, FileText, Plus, Calendar, Clock, CircleAlert as AlertCircle, CircleCheck as CheckCircle, CreditCard as Edit3, Trash2, Save, Bell, Target, BookOpen, Flag, ListFilter as Filter } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { notificationService } from '@/lib/notificationService';

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  estimatedHours: number;
  actualHours?: number;
  reminders: ReminderSetting[];
  attachments: string[];
  notes: string;
  notification_ids: string[];
  createdAt: string;
  completedAt?: string;
}

interface ReminderSetting {
  id: string;
  timeBeforeDue: number; // minutes
  message: string;
  enabled: boolean;
}

interface AssignmentManagerProps {
  onClose: () => void;
}

export default function AssignmentManager({ onClose }: AssignmentManagerProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'subject'>('dueDate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    dueTime: '23:59',
    priority: 'medium' as const,
    estimatedHours: 2,
    notes: '',
    reminders: [
      { id: '1', timeBeforeDue: 1440, message: '1 day reminder', enabled: true }, // 1 day
      { id: '2', timeBeforeDue: 360, message: '6 hours reminder', enabled: true }, // 6 hours
      { id: '3', timeBeforeDue: 60, message: '1 hour reminder', enabled: true }, // 1 hour
      { id: '4', timeBeforeDue: 15, message: '15 minutes reminder', enabled: false } // 15 minutes
    ] as ReminderSetting[]
  });

  useEffect(() => {
    fetchAssignments();
    initializeNotificationService();
  }, []);

  const initializeNotificationService = async () => {
    try {
      await notificationService.initialize();
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please sign in to access your assignments');
        return;
      }

      // For now, use sample data since we don't have assignments table yet
      // In a real implementation, you would fetch from Supabase
      const sampleAssignments: Assignment[] = [
        {
          id: '1',
          title: 'Data Structures Assignment',
          description: 'Implement binary search tree with insertion, deletion, and traversal methods',
          subject: 'Computer Science',
          dueDate: '2025-01-20',
          dueTime: '23:59',
          priority: 'high',
          status: 'in_progress',
          estimatedHours: 8,
          actualHours: 5,
          reminders: [
            { id: '1', timeBeforeDue: 1440, message: '1 day reminder', enabled: true },
            { id: '2', timeBeforeDue: 360, message: '6 hours reminder', enabled: true }
          ],
          attachments: [],
          notes: 'Focus on balancing the tree efficiently',
          notification_ids: [],
          createdAt: '2025-01-10T10:00:00Z'
        },
        {
          id: '2',
          title: 'Calculus Problem Set',
          description: 'Complete problems 1-25 from Chapter 7: Integration Techniques',
          subject: 'Mathematics',
          dueDate: '2025-01-18',
          dueTime: '15:00',
          priority: 'medium',
          status: 'pending',
          estimatedHours: 4,
          reminders: [
            { id: '1', timeBeforeDue: 720, message: '12 hours reminder', enabled: true },
            { id: '2', timeBeforeDue: 120, message: '2 hours reminder', enabled: true }
          ],
          attachments: [],
          notes: 'Review integration by parts before starting',
          notification_ids: [],
          createdAt: '2025-01-12T14:30:00Z'
        }
      ];
      
      setAssignments(sampleAssignments);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignments. Please try again.');
    } finally {
      setLoading(false);
    }
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
      case 'pending': return '#6B7280';
      case 'in_progress': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'overdue': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'in_progress': return Target;
      case 'completed': return CheckCircle;
      case 'overdue': return AlertCircle;
      default: return Clock;
    }
  };

  const addAssignment = () => {
    if (!assignmentForm.title.trim() || !assignmentForm.dueDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    addAssignmentWithNotifications();
  };

  const addAssignmentWithNotifications = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to add assignments');
        return;
      }

      // Schedule notifications first
      let notificationIds: string[] = [];
      try {
        notificationIds = await notificationService.scheduleAssignmentNotifications({
          id: Date.now().toString(),
          title: assignmentForm.title,
          dueDate: assignmentForm.dueDate,
          dueTime: assignmentForm.dueTime,
          reminders: assignmentForm.reminders
        });
      } catch (notificationError) {
        console.error('Error scheduling notifications:', notificationError);
        // Continue with assignment creation even if notifications fail
      }

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title: assignmentForm.title,
      description: assignmentForm.description,
      subject: assignmentForm.subject,
      dueDate: assignmentForm.dueDate,
      dueTime: assignmentForm.dueTime,
      priority: assignmentForm.priority,
      status: 'pending',
      estimatedHours: assignmentForm.estimatedHours,
      reminders: assignmentForm.reminders,
      attachments: [],
      notes: assignmentForm.notes,
      notification_ids: notificationIds,
      createdAt: new Date().toISOString()
    };

    setAssignments([...assignments, newAssignment]);
    resetForm();
    setShowAddAssignment(false);
    
    const notificationMessage = notificationIds.length > 0 
      ? `Assignment added with ${notificationIds.length} notifications scheduled!`
      : 'Assignment added successfully!';
    Alert.alert('Success', notificationMessage);
    } catch (error) {
      console.error('Error adding assignment:', error);
      Alert.alert('Error', 'Failed to add assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateAssignment = () => {
    if (!editingAssignment) return;

    updateAssignmentWithNotifications();
  };

  const updateAssignmentWithNotifications = async () => {
    if (!editingAssignment) return;

    try {
      setLoading(true);

      // Cancel existing notifications
      if (editingAssignment.notification_ids.length > 0) {
        await notificationService.cancelAssignmentNotifications(editingAssignment.notification_ids);
      }

      // Schedule new notifications
      let notificationIds: string[] = [];
      try {
        notificationIds = await notificationService.scheduleAssignmentNotifications({
          id: editingAssignment.id,
          title: assignmentForm.title,
          dueDate: assignmentForm.dueDate,
          dueTime: assignmentForm.dueTime,
          reminders: assignmentForm.reminders
        });
      } catch (notificationError) {
        console.error('Error rescheduling notifications:', notificationError);
      }

    const updatedAssignments = assignments.map(assignment => 
      assignment.id === editingAssignment.id 
        ? {
            ...editingAssignment,
            title: assignmentForm.title,
            description: assignmentForm.description,
            subject: assignmentForm.subject,
            dueDate: assignmentForm.dueDate,
            dueTime: assignmentForm.dueTime,
            priority: assignmentForm.priority,
            estimatedHours: assignmentForm.estimatedHours,
            reminders: assignmentForm.reminders,
            notes: assignmentForm.notes,
            notification_ids: notificationIds
          }
        : assignment
    );

    setAssignments(updatedAssignments);
    setEditingAssignment(null);
    resetForm();
    setShowAddAssignment(false);
    
    const notificationMessage = notificationIds.length > 0 
      ? `Assignment updated with ${notificationIds.length} notifications rescheduled!`
      : 'Assignment updated successfully!';
    Alert.alert('Success', notificationMessage);
    } catch (error) {
      console.error('Error updating assignment:', error);
      Alert.alert('Error', 'Failed to update assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = (assignmentId: string) => {
    Alert.alert(
      'Delete Assignment',
      'Are you sure you want to delete this assignment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteAssignmentWithNotifications(assignmentId)
        }
      ]
    );
  };

  const deleteAssignmentWithNotifications = async (assignmentId: string) => {
    try {
      const assignmentToDelete = assignments.find(a => a.id === assignmentId);
      
      // Cancel all notifications for this assignment
      if (assignmentToDelete?.notification_ids.length) {
        await notificationService.cancelAssignmentNotifications(assignmentToDelete.notification_ids);
      }

      setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
      Alert.alert('Success', 'Assignment and its notifications deleted successfully!');
    } catch (error) {
      console.error('Error deleting assignment:', error);
      Alert.alert('Error', 'Failed to delete assignment. Please try again.');
    }
  };

  const toggleAssignmentStatus = (assignmentId: string) => {
    toggleAssignmentStatusWithNotifications(assignmentId);
  };

  const toggleAssignmentStatusWithNotifications = async (assignmentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to update assignments');
        return;
      }

      const assignment = assignments.find(a => a.id === assignmentId);
      if (!assignment) return;

      const newStatus = assignment.status === 'completed' ? 'pending' : 'completed';
      
      // If marking as completed, cancel notifications
      if (newStatus === 'completed' && assignment.notification_ids.length > 0) {
        await notificationService.cancelAssignmentNotifications(assignment.notification_ids);
      }
      
      // If marking as pending and was completed, reschedule notifications
      let notificationIds = assignment.notification_ids;
      if (newStatus === 'pending' && assignment.status === 'completed') {
        try {
          notificationIds = await notificationService.scheduleAssignmentNotifications({
            id: assignment.id,
            title: assignment.title,
            dueDate: assignment.dueDate,
            dueTime: assignment.dueTime,
            reminders: assignment.reminders
          });
        } catch (notificationError) {
          console.error('Error rescheduling notifications:', notificationError);
        }
      }

      // Update assignment status in Supabase
      const { error: updateError } = await supabase
        .from('assignments')
        .update({
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
          notification_ids: notificationIds
        })
        .eq('id', assignmentId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating assignment status:', updateError);
        throw updateError;
      }

      // Refresh assignments list
      await fetchAssignments();
    } catch (error) {
      console.error('Error toggling assignment status:', error);
      Alert.alert('Error', 'Failed to update assignment status. Please try again.');
    }
  };

  const editAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setAssignmentForm({
      title: assignment.title,
      description: assignment.description,
      subject: assignment.subject,
      dueDate: assignment.dueDate,
      dueTime: assignment.dueTime,
      priority: assignment.priority,
      estimatedHours: assignment.estimatedHours,
      notes: assignment.notes,
      reminders: assignment.reminders
    });
    setShowAddAssignment(true);
  };

  const resetForm = () => {
    setAssignmentForm({
      title: '',
      description: '',
      subject: '',
      dueDate: '',
      dueTime: '23:59',
      priority: 'medium',
      estimatedHours: 2,
      notes: '',
      reminders: [
        { id: '1', timeBeforeDue: 1440, message: '1 day reminder', enabled: true },
        { id: '2', timeBeforeDue: 360, message: '6 hours reminder', enabled: true },
        { id: '3', timeBeforeDue: 60, message: '1 hour reminder', enabled: true },
        { id: '4', timeBeforeDue: 15, message: '15 minutes reminder', enabled: false }
      ]
    });
    setEditingAssignment(null);
  };

  const updateReminderSetting = (reminderId: string, enabled: boolean) => {
    const updatedReminders = assignmentForm.reminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, enabled } : reminder
    );
    setAssignmentForm({ ...assignmentForm, reminders: updatedReminders });
  };

  const isOverdue = (assignment: Assignment) => {
    const now = new Date();
    const dueDateTime = new Date(`${assignment.dueDate}T${assignment.dueTime}`);
    return now > dueDateTime && assignment.status !== 'completed';
  };

  const getDaysUntilDue = (assignment: Assignment) => {
    const now = new Date();
    const dueDateTime = new Date(`${assignment.dueDate}T${assignment.dueTime}`);
    const diffTime = dueDateTime.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getFilteredAndSortedAssignments = () => {
    let filtered = assignments;

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(assignment => {
        if (filterStatus === 'overdue') {
          return isOverdue(assignment);
        }
        return assignment.status === filterStatus;
      });
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(assignment => assignment.priority === filterPriority);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(`${a.dueDate}T${a.dueTime}`).getTime() - new Date(`${b.dueDate}T${b.dueTime}`).getTime();
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'subject':
          return a.subject.localeCompare(b.subject);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const renderAddAssignmentModal = () => (
    <Modal
      visible={showAddAssignment}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowAddAssignment(false);
        resetForm();
      }}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}
          </Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => {
              setShowAddAssignment(false);
              resetForm();
            }}
          >
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Assignment Title</Text>
            <TextInput
              style={styles.input}
              value={assignmentForm.title}
              onChangeText={(text) => setAssignmentForm({...assignmentForm, title: text})}
              placeholder="Enter assignment title"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject</Text>
            <TextInput
              style={styles.input}
              value={assignmentForm.subject}
              onChangeText={(text) => setAssignmentForm({...assignmentForm, subject: text})}
              placeholder="e.g., Computer Science, Mathematics"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={assignmentForm.description}
              onChangeText={(text) => setAssignmentForm({...assignmentForm, description: text})}
              placeholder="Assignment description and requirements"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.dateTimeRow}>
            <View style={styles.dateInput}>
              <Text style={styles.inputLabel}>Due Date</Text>
              <TextInput
                style={styles.input}
                value={assignmentForm.dueDate}
                onChangeText={(text) => setAssignmentForm({...assignmentForm, dueDate: text})}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={styles.timeInput}>
              <Text style={styles.inputLabel}>Due Time</Text>
              <TextInput
                style={styles.input}
                value={assignmentForm.dueTime}
                onChangeText={(text) => setAssignmentForm({...assignmentForm, dueTime: text})}
                placeholder="HH:MM"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Priority Level</Text>
            <View style={styles.prioritySelector}>
              {['low', 'medium', 'high', 'urgent'].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    assignmentForm.priority === priority && styles.selectedPriorityButton,
                    { backgroundColor: assignmentForm.priority === priority ? getPriorityColor(priority) : '#F3F4F6' }
                  ]}
                  onPress={() => setAssignmentForm({...assignmentForm, priority: priority as any})}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    { color: assignmentForm.priority === priority ? '#FFFFFF' : '#6B7280' }
                  ]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Estimated Hours</Text>
            <TextInput
              style={styles.input}
              value={assignmentForm.estimatedHours.toString()}
              onChangeText={(text) => setAssignmentForm({...assignmentForm, estimatedHours: parseInt(text) || 0})}
              placeholder="How many hours will this take?"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Smart Reminders</Text>
            <Text style={styles.inputSubLabel}>Set up push notifications to remind you about this assignment</Text>
            <View style={styles.remindersContainer}>
              {assignmentForm.reminders.map((reminder) => (
                <View key={reminder.id} style={styles.reminderItem}>
                  <View style={styles.reminderInfo}>
                    <Bell size={16} color="#3B82F6" />
                    <Text style={styles.reminderText}>{reminder.message}</Text>
                  </View>
                  <Switch
                    value={reminder.enabled}
                    onValueChange={(enabled) => updateReminderSetting(reminder.id, enabled)}
                    trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                    thumbColor={reminder.enabled ? '#FFFFFF' : '#F3F4F6'}
                  />
                </View>
              ))}
              <View style={styles.reminderNote}>
                <AlertCircle size={14} color="#6B7280" />
                <Text style={styles.reminderNoteText}>
                  Push notifications work on mobile devices. Web notifications are not supported.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={styles.textArea}
              value={assignmentForm.notes}
              onChangeText={(text) => setAssignmentForm({...assignmentForm, notes: text})}
              placeholder="Additional notes or reminders"
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={editingAssignment ? updateAssignment : addAssignment}
            disabled={loading}
          >
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {editingAssignment ? 'Update Assignment' : 'Add Assignment'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const statusOptions = [
    { key: 'all', label: 'All', count: assignments.length },
    { key: 'pending', label: 'Pending', count: assignments.filter(a => a.status === 'pending').length },
    { key: 'in_progress', label: 'In Progress', count: assignments.filter(a => a.status === 'in_progress').length },
    { key: 'completed', label: 'Completed', count: assignments.filter(a => a.status === 'completed').length },
    { key: 'overdue', label: 'Overdue', count: assignments.filter(a => isOverdue(a)).length }
  ];

  const priorityOptions = [
    { key: 'all', label: 'All Priorities' },
    { key: 'urgent', label: 'Urgent' },
    { key: 'high', label: 'High' },
    { key: 'medium', label: 'Medium' },
    { key: 'low', label: 'Low' }
  ];

  const filteredAssignments = getFilteredAndSortedAssignments();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Assignment Manager</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status.key}
                style={[
                  styles.filterButton,
                  filterStatus === status.key && styles.activeFilterButton
                ]}
                onPress={() => setFilterStatus(status.key)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterStatus === status.key && styles.activeFilterButtonText
                ]}>
                  {status.label} ({status.count})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setAssignmentForm({...assignmentForm, dueDate: new Date().toISOString().split('T')[0]});
            setShowAddAssignment(true);
          }}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortButtons}>
          {[
            { key: 'dueDate', label: 'Due Date' },
            { key: 'priority', label: 'Priority' },
            { key: 'subject', label: 'Subject' }
          ].map((sort) => (
            <TouchableOpacity
              key={sort.key}
              style={[
                styles.sortButton,
                sortBy === sort.key && styles.activeSortButton
              ]}
              onPress={() => setSortBy(sort.key as any)}
            >
              <Text style={[
                styles.sortButtonText,
                sortBy === sort.key && styles.activeSortButtonText
              ]}>
                {sort.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.assignmentsList} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading assignments...</Text>
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchAssignments}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {filteredAssignments.length === 0 ? (
          <View style={styles.noAssignmentsContainer}>
            <FileText size={48} color="#9CA3AF" />
            <Text style={styles.noAssignmentsText}>No assignments found</Text>
            <TouchableOpacity
              style={styles.addFirstAssignmentButton}
              onPress={() => setShowAddAssignment(true)}
            >
              <Plus size={16} color="#3B82F6" />
              <Text style={styles.addFirstAssignmentText}>Add your first assignment</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredAssignments.map((assignment) => {
            const StatusIcon = getStatusIcon(assignment.status);
            const daysUntilDue = getDaysUntilDue(assignment);
            const overdue = isOverdue(assignment);

            return (
              <View key={assignment.id} style={styles.assignmentCard}>
                <View style={styles.assignmentHeader}>
                  <View style={styles.assignmentInfo}>
                    <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                    <Text style={styles.assignmentSubject}>{assignment.subject}</Text>
                  </View>
                  
                  <View style={styles.assignmentMeta}>
                    <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(assignment.priority)}15` }]}>
                      <Flag size={12} color={getPriorityColor(assignment.priority)} />
                      <Text style={[styles.priorityText, { color: getPriorityColor(assignment.priority) }]}>
                        {assignment.priority}
                      </Text>
                    </View>
                    
                    <TouchableOpacity
                      style={[styles.statusBadge, { backgroundColor: `${getStatusColor(assignment.status)}15` }]}
                      onPress={() => toggleAssignmentStatus(assignment.id)}
                    >
                      <StatusIcon size={12} color={getStatusColor(assignment.status)} />
                      <Text style={[styles.statusText, { color: getStatusColor(assignment.status) }]}>
                        {assignment.status.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.assignmentDescription} numberOfLines={2}>
                  {assignment.description}
                </Text>

                <View style={styles.assignmentDetails}>
                  <View style={styles.detailRow}>
                    <Calendar size={16} color="#6B7280" />
                    <Text style={[
                      styles.detailText,
                      overdue && styles.overdueText
                    ]}>
                      Due: {new Date(`${assignment.dueDate}T${assignment.dueTime}`).toLocaleDateString()} at {assignment.dueTime}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.detailText}>
                      Estimated: {assignment.estimatedHours}h
                      {assignment.actualHours && ` | Actual: ${assignment.actualHours}h`}
                    </Text>
                  </View>

                  {!overdue && assignment.status !== 'completed' && (
                    <View style={styles.detailRow}>
                      <Target size={16} color="#6B7280" />
                      <Text style={styles.detailText}>
                        {daysUntilDue === 0 ? 'Due today' : 
                         daysUntilDue === 1 ? 'Due tomorrow' : 
                         daysUntilDue > 0 ? `${daysUntilDue} days left` : 
                         `${Math.abs(daysUntilDue)} days overdue`}
                      </Text>
                    </View>
                  )}

                  {overdue && (
                    <View style={styles.overdueWarning}>
                      <AlertCircle size={16} color="#EF4444" />
                      <Text style={styles.overdueText}>
                        {Math.abs(daysUntilDue)} days overdue
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.remindersInfo}>
                  <Bell size={14} color="#3B82F6" />
                  <Text style={styles.remindersText}>
                    {assignment.reminders.filter(r => r.enabled).length} active reminders
                    {assignment.notification_ids.length > 0 && ` (${assignment.notification_ids.length} scheduled)`}
                  </Text>
                </View>

                {assignment.notes && (
                  <View style={styles.notesSection}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{assignment.notes}</Text>
                  </View>
                )}

                <View style={styles.assignmentActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => editAssignment(assignment)}
                  >
                    <Edit3 size={16} color="#3B82F6" />
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteAssignment(assignment.id)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusToggleButton,
                      { backgroundColor: assignment.status === 'completed' ? '#10B981' : '#3B82F6' }
                    ]}
                    onPress={() => toggleAssignmentStatus(assignment.id)}
                  >
                    <CheckCircle size={16} color="#FFFFFF" />
                    <Text style={styles.statusToggleText}>
                      {assignment.status === 'completed' ? 'Completed' : 'Mark Done'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {renderAddAssignmentModal()}
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
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersContainer: {
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 10,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sortLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginRight: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  activeSortButton: {
    backgroundColor: '#10B981',
  },
  sortButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeSortButtonText: {
    color: '#FFFFFF',
  },
  assignmentsList: {
    flex: 1,
    padding: 16,
  },
  noAssignmentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noAssignmentsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 16,
  },
  addFirstAssignmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    gap: 8,
  },
  addFirstAssignmentText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  assignmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  assignmentSubject: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  assignmentMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
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
  assignmentDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  assignmentDetails: {
    marginBottom: 12,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  overdueText: {
    color: '#EF4444',
    fontFamily: 'Inter-SemiBold',
  },
  overdueWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  remindersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  remindersText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#3B82F6',
  },
  notesSection: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 18,
  },
  assignmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
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
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    gap: 4,
  },
  deleteButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  statusToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  statusToggleText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
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
  inputSubLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
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
  prioritySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectedPriorityButton: {
    // Style handled by backgroundColor in the component
  },
  priorityButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  remindersContainer: {
    gap: 12,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reminderText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  reminderNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  reminderNoteText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#0369A1',
    flex: 1,
    lineHeight: 16,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
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
});