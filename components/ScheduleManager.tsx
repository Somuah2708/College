import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert, Modal } from 'react-native';
import { X, Calendar, Plus, Clock, MapPin, Users, CreditCard as Edit3, Trash2, Save, ChevronLeft, ChevronRight, ListFilter as Filter } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

interface ScheduleEvent {
  id: string;
  user_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  event_date: string;
  location: string;
  event_type: 'class' | 'study' | 'exam' | 'meeting' | 'personal';
  color: string;
  recurring: boolean;
  recurring_pattern?: 'daily' | 'weekly' | 'monthly';
  reminders: number[]; // minutes before event
  created_at: string;
  updated_at: string;
}

interface ScheduleManagerProps {
  onClose: () => void;
}

export default function ScheduleManager({ onClose }: ScheduleManagerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for adding/editing events
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start_time: '09:00',
    end_time: '10:00',
    event_date: '',
    location: '',
    event_type: 'class' as const,
    recurring: false,
    recurring_pattern: 'weekly' as const,
    reminders: [15] // 15 minutes before
  });

  useEffect(() => {
    fetchEvents();
    setSelectedDate(formatDate(new Date()));
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please sign in to access your schedule');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('schedule_events')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class': return '#3B82F6';
      case 'study': return '#10B981';
      case 'exam': return '#EF4444';
      case 'meeting': return '#F59E0B';
      case 'personal': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const addEvent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Authentication Required', 'Please sign in to add events');
        return;
      }

      const { error } = await supabase
        .from('schedule_events')
        .insert({
          user_id: user.id,
          title: eventForm.title,
          description: eventForm.description,
          start_time: eventForm.start_time,
          end_time: eventForm.end_time,
          event_date: eventForm.event_date,
          location: eventForm.location,
          event_type: eventForm.event_type,
          color: getEventTypeColor(eventForm.event_type),
          recurring: eventForm.recurring,
          recurring_pattern: eventForm.recurring_pattern,
          reminders: eventForm.reminders
        });

      if (error) {
        throw error;
      }

      await fetchEvents(); // Refresh events list
      resetForm();
      setShowAddEvent(false);
      Alert.alert('Success', 'Event added successfully!');
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert('Error', 'Failed to add event. Please try again.');
    }
  };

  const updateEvent = async () => {
    if (!editingEvent) return;

    try {
      const { error } = await supabase
        .from('schedule_events')
        .update({
          title: eventForm.title,
          description: eventForm.description,
          start_time: eventForm.start_time,
          end_time: eventForm.end_time,
          event_date: eventForm.event_date,
          location: eventForm.location,
          event_type: eventForm.event_type,
          color: getEventTypeColor(eventForm.event_type),
          recurring: eventForm.recurring,
          recurring_pattern: eventForm.recurring_pattern,
          reminders: eventForm.reminders
        })
        .eq('id', editingEvent.id);

      if (error) {
        throw error;
      }

      await fetchEvents(); // Refresh events list
      setEditingEvent(null);
      resetForm();
      setShowAddEvent(false);
      Alert.alert('Success', 'Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Error', 'Failed to update event. Please try again.');
    }
  };

  const deleteEvent = (eventId: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setEvents(events.filter(event => event.id !== eventId));
          }
        }
      ]
    );
  };

  const editEvent = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      start_time: event.start_time,
      end_time: event.end_time,
      event_date: event.event_date,
      location: event.location,
      event_type: event.event_type,
      recurring: event.recurring,
      recurring_pattern: event.recurring_pattern || 'weekly',
      reminders: event.reminders
    });
    setShowAddEvent(true);
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      start_time: '09:00',
      end_time: '10:00',
      event_date: selectedDate,
      location: '',
      event_type: 'class',
      recurring: false,
      recurring_pattern: 'weekly',
      reminders: [15]
    });
    setEditingEvent(null);
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.event_date === date);
  };

  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(formatDate(date));
    }
    return weekDates;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const filteredEvents = filterType === 'all' 
    ? events 
    : events.filter(event => event.event_type === filterType);

  const eventTypes = [
    { key: 'all', label: 'All Events', count: events.length },
    { key: 'class', label: 'Classes', count: events.filter(e => e.event_type === 'class').length },
    { key: 'study', label: 'Study', count: events.filter(e => e.event_type === 'study').length },
    { key: 'exam', label: 'Exams', count: events.filter(e => e.event_type === 'exam').length },
    { key: 'meeting', label: 'Meetings', count: events.filter(e => e.event_type === 'meeting').length },
    { key: 'personal', label: 'Personal', count: events.filter(e => e.event_type === 'personal').length }
  ];

  const renderAddEventModal = () => (
    <Modal
      visible={showAddEvent}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowAddEvent(false);
        resetForm();
      }}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => {
              setShowAddEvent(false);
              resetForm();
            }}
          >
            <X size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Event Title</Text>
            <TextInput
              style={styles.input}
              value={eventForm.title}
              onChangeText={(text) => setEventForm({...eventForm, title: text})}
              placeholder="Enter event title"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={eventForm.description}
              onChangeText={(text) => setEventForm({...eventForm, description: text})}
              placeholder="Event description (optional)"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date</Text>
            <TextInput
              style={styles.input}
              value={eventForm.event_date}
              onChangeText={(text) => setEventForm({...eventForm, event_date: text})}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeInput}>
              <Text style={styles.inputLabel}>Start Time</Text>
              <TextInput
                style={styles.input}
                value={eventForm.start_time}
                onChangeText={(text) => setEventForm({...eventForm, start_time: text})}
                placeholder="HH:MM"
              />
            </View>
            <View style={styles.timeInput}>
              <Text style={styles.inputLabel}>End Time</Text>
              <TextInput
                style={styles.input}
                value={eventForm.end_time}
                onChangeText={(text) => setEventForm({...eventForm, end_time: text})}
                placeholder="HH:MM"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.input}
              value={eventForm.location}
              onChangeText={(text) => setEventForm({...eventForm, location: text})}
              placeholder="Event location"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Event Type</Text>
            <View style={styles.typeSelector}>
              {['class', 'study', 'exam', 'meeting', 'personal'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    eventForm.event_type === type && styles.selectedTypeButton,
                    { backgroundColor: eventForm.event_type === type ? getEventTypeColor(type) : '#F3F4F6' }
                  ]}
                  onPress={() => setEventForm({...eventForm, event_type: type as any})}
                >
                  <Text style={[
                    styles.typeButtonText,
                    { color: eventForm.event_type === type ? '#FFFFFF' : '#6B7280' }
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={editingEvent ? updateEvent : addEvent}
          >
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {editingEvent ? 'Update Event' : 'Add Event'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderWeekView = () => {
    const weekDates = getWeekDates();
    
    return (
      <View style={styles.weekContainer}>
        <View style={styles.weekHeader}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigateWeek('prev')}>
            <ChevronLeft size={20} color="#3B82F6" />
          </TouchableOpacity>
          <Text style={styles.weekTitle}>
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity style={styles.navButton} onPress={() => navigateWeek('next')}>
            <ChevronRight size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <View style={styles.daysHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <Text key={index} style={styles.dayHeaderText}>{day}</Text>
          ))}
        </View>

        <ScrollView style={styles.weekGrid} showsVerticalScrollIndicator={false}>
          {weekDates.map((date, index) => {
            const dayEvents = getEventsForDate(date).filter(event => 
              filterType === 'all' || event.type === filterType
            );
            const isToday = date === formatDate(new Date());
            const isSelected = date === selectedDate;

            return (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dayCell,
                  isToday && styles.todayCell,
                  isSelected && styles.selectedCell
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[
                  styles.dayNumber,
                  isToday && styles.todayText,
                  isSelected && styles.selectedText
                ]}>
                  {new Date(date).getDate()}
                </Text>
                <View style={styles.eventsContainer}>
                  {dayEvents.slice(0, 3).map((event) => (
                    <View
                      key={event.id}
                      style={[styles.eventDot, { backgroundColor: event.color }]}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <Text style={styles.moreEvents}>+{dayEvents.length - 3}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderDayEvents = () => {
    const dayEvents = getEventsForDate(selectedDate).filter(event => 
      filterType === 'all' || event.type === filterType
    );

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchEvents}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.dayEventsContainer}>
        <Text style={styles.dayEventsTitle}>
          {selectedDate ? formatDisplayDate(selectedDate) : 'Select a date'}
        </Text>
        
        {dayEvents.length === 0 ? (
          <View style={styles.noEventsContainer}>
            <Calendar size={48} color="#9CA3AF" />
            <Text style={styles.noEventsText}>No events scheduled</Text>
            <TouchableOpacity
              style={styles.addFirstEventButton}
              onPress={() => {
                setEventForm({...eventForm, event_date: selectedDate});
                setShowAddEvent(true);
              }}
            >
              <Plus size={16} color="#3B82F6" />
              <Text style={styles.addFirstEventText}>Add your first event</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
            {dayEvents
              .sort((a, b) => a.start_time.localeCompare(b.start_time))
              .map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <View style={[styles.eventColorBar, { backgroundColor: event.color }]} />
                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <View style={styles.eventActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => editEvent(event)}
                        >
                          <Edit3 size={16} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => deleteEvent(event.id)}
                        >
                          <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View style={styles.eventTime}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.eventTimeText}>
                        {event.start_time} - {event.end_time}
                      </Text>
                    </View>

                    {event.location && (
                      <View style={styles.eventLocation}>
                        <MapPin size={16} color="#6B7280" />
                        <Text style={styles.eventLocationText}>{event.location}</Text>
                      </View>
                    )}

                    {event.description && (
                      <Text style={styles.eventDescription}>{event.description}</Text>
                    )}

                    <View style={styles.eventMeta}>
                      <View style={[styles.eventTypeBadge, { backgroundColor: `${event.color}15` }]}>
                        <Text style={[styles.eventTypeText, { color: event.color }]}>
                          {event.event_type}
                        </Text>
                      </View>
                      {event.recurring && (
                        <View style={styles.recurringBadge}>
                          <Text style={styles.recurringText}>Recurring</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule Manager</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.viewModeSelector}>
          {['day', 'week', 'month'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.viewModeButton,
                viewMode === mode && styles.activeViewMode
              ]}
              onPress={() => setViewMode(mode as any)}
            >
              <Text style={[
                styles.viewModeText,
                viewMode === mode && styles.activeViewModeText
              ]}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEventForm({...eventForm, event_date: selectedDate || formatDate(new Date())});
            setShowAddEvent(true);
          }}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {eventTypes.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.filterButton,
                filterType === type.key && styles.activeFilterButton
              ]}
              onPress={() => setFilterType(type.key)}
            >
              <Text style={[
                styles.filterButtonText,
                filterType === type.key && styles.activeFilterButtonText
              ]}>
                {type.label} ({type.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.calendarSection}>
          {renderWeekView()}
        </View>
        <View style={styles.eventsSection}>
          {renderDayEvents()}
        </View>
      </View>

      {renderAddEventModal()}
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
  viewModeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeViewMode: {
    backgroundColor: '#3B82F6',
  },
  viewModeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeViewModeText: {
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 10,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  calendarSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  eventsSection: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  weekContainer: {
    padding: 16,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  weekTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeaderText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  weekGrid: {
    maxHeight: 300,
  },
  dayCell: {
    flex: 1,
    minHeight: 60,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 4,
    borderRadius: 8,
  },
  todayCell: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3B82F6',
  },
  selectedCell: {
    backgroundColor: '#3B82F615',
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  dayNumber: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  todayText: {
    color: '#3B82F6',
  },
  selectedText: {
    color: '#3B82F6',
  },
  eventsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  moreEvents: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  dayEventsContainer: {
    flex: 1,
    padding: 16,
  },
  dayEventsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
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
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 16,
  },
  addFirstEventButton: {
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
  addFirstEventText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  eventColorBar: {
    width: 4,
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  eventTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  eventTimeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  eventLocationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  recurringBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recurringText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
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
  timeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
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
  },
  selectedTypeButton: {
    // Style handled by backgroundColor in the component
  },
  typeButtonText: {
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
});