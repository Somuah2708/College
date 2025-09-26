import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationPreferences {
  push_notifications: boolean;
  email_notifications: boolean;
  scholarship_alerts: boolean;
  program_updates: boolean;
  university_news: boolean;
  career_opportunities: boolean;
  event_reminders: boolean;
  application_deadlines: boolean;
  interest_based_content: boolean;
}

export interface UserInterest {
  interest: string;
  priority: 'high' | 'medium' | 'low';
  categories: string[];
}

class NotificationService {
  private static instance: NotificationService;
  private notificationQueue: any[] = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize notification service
  async initialize() {
    try {
      // Request notification permissions (in a real app)
      await this.requestPermissions();
      
      // Set up notification listeners
      this.setupNotificationListeners();
      
      // Schedule interest-based notifications
      await this.scheduleInterestBasedNotifications();
    } catch (error) {
      console.error('Error initializing notification service:', error);
    }
  }

  // Request notification permissions
  private async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        console.log('Push notifications not supported on web');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Set up notification listeners
  private setupNotificationListeners() {
    if (Platform.OS === 'web') {
      return;
    }

    // Set up notification received listener
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Set up notification response listener (when user taps notification)
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      const data = response.notification.request.content.data;
      
      if (data?.actionUrl) {
        // Handle navigation based on notification data
        console.log('Opening action URL:', data.actionUrl);
      }
    });
  }

  // Create notification in database
  async createNotification(notification: {
    user_id: string;
    title: string;
    message: string;
    type: string;
    priority: string;
    action_url?: string;
    action_text?: string;
    related_interests?: string[];
    expires_at?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  // Send push notification
  async sendPushNotification(notification: {
    title: string;
    message: string;
    data?: any;
  }) {
    try {
      if (Platform.OS === 'web') {
        console.log('Push notifications not supported on web');
        return;
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('No notification permissions');
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.message,
          data: notification.data || {},
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  // Generate interest-based notifications for user
  async generateNotificationsForUser(userId: string) {
    try {
      // Get user interests
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('interests, field_of_study')
        .eq('user_id', userId)
        .maybeSingle();

      if (!profile) return;

      const interests = profile.interests || [];
      if (profile.field_of_study) {
        interests.push(profile.field_of_study);
      }

      // Generate notifications based on interests
      const notifications = await this.generateInterestBasedNotifications(interests);
      
      // Create notifications in database
      for (const notification of notifications) {
        await this.createNotification({
          user_id: userId,
          ...notification
        });
      }

      return notifications.length;
    } catch (error) {
      console.error('Error generating notifications for user:', error);
      return 0;
    }
  }

  // Generate notifications based on user interests
  async generateInterestBasedNotifications(userInterests: string[]): Promise<any[]> {
    const notifications = [];

    for (const interest of userInterests) {
      // Generate scholarship notifications
      if (await this.shouldNotifyAbout('scholarship_alerts')) {
        const scholarshipNotifications = await this.generateScholarshipNotifications(interest);
        notifications.push(...scholarshipNotifications);
      }

      // Generate program notifications
      if (await this.shouldNotifyAbout('program_updates')) {
        const programNotifications = await this.generateProgramNotifications(interest);
        notifications.push(...programNotifications);
      }

      // Generate career notifications
      if (await this.shouldNotifyAbout('career_opportunities')) {
        const careerNotifications = await this.generateCareerNotifications(interest);
        notifications.push(...careerNotifications);
      }
    }

    return notifications;
  }

  // Generate scholarship notifications based on interests
  private async generateScholarshipNotifications(interest: string): Promise<any[]> {
    try {
      // Query scholarships related to the user's interest
      const { data: scholarships } = await supabase
        .from('scholarships')
        .select(`
          *,
          scholarship_providers (provider_name)
        `)
        .eq('active', true)
        .gte('application_deadline', new Date().toISOString())
        .limit(3);

      if (!scholarships) return [];

      return scholarships
        .filter(scholarship => 
          scholarship.scholarship_name.toLowerCase().includes(interest.toLowerCase()) ||
          scholarship.scholarship_description.toLowerCase().includes(interest.toLowerCase()) ||
          scholarship.field_of_study_restrictions?.some((field: string) => 
            field.toLowerCase().includes(interest.toLowerCase())
          )
        )
        .map(scholarship => ({
          id: `scholarship-${scholarship.id}`,
          title: 'New Scholarship Alert!',
          message: `${scholarship.scholarship_name} (${scholarship.award_amount}) is now accepting applications. Deadline: ${new Date(scholarship.application_deadline).toLocaleDateString()}`,
          type: 'scholarship',
          priority: this.calculatePriority(scholarship.application_deadline, scholarship.award_amount),
          action_url: scholarship.application_url,
          action_text: 'Apply Now',
          related_interests: [interest],
          expires_at: scholarship.application_deadline,
          created_at: new Date().toISOString()
        }));
    } catch (error) {
      console.error('Error generating scholarship notifications:', error);
      return [];
    }
  }

  // Generate program notifications based on interests
  private async generateProgramNotifications(interest: string): Promise<any[]> {
    try {
      const { data: programs } = await supabase
        .from('academic_programs')
        .select(`
          *,
          universities (name, location)
        `)
        .limit(2);

      if (!programs) return [];

      return programs
        .filter(program => 
          program.name.toLowerCase().includes(interest.toLowerCase()) ||
          program.description?.toLowerCase().includes(interest.toLowerCase()) ||
          program.department?.toLowerCase().includes(interest.toLowerCase())
        )
        .map(program => ({
          id: `program-${program.id}`,
          title: 'Program Update',
          message: `New information available for ${program.name} at ${program.universities?.name}. Check out the latest updates and requirements.`,
          type: 'program',
          priority: 'medium',
          action_url: `/ups/program-detail?id=${program.id}`,
          action_text: 'View Program',
          related_interests: [interest],
          created_at: new Date().toISOString()
        }));
    } catch (error) {
      console.error('Error generating program notifications:', error);
      return [];
    }
  }

  // Generate career notifications based on interests
  private async generateCareerNotifications(interest: string): Promise<any[]> {
    // In a real app, this would query job opportunities or career events
    // For demo, generate sample career notifications
    const careerNotifications = [
      {
        id: `career-${interest}-${Date.now()}`,
        title: 'New Career Opportunity',
        message: `${interest} positions are in high demand! Check out the latest job openings and internship opportunities.`,
        type: 'career',
        priority: 'medium',
        action_url: '/ups/internship-hub',
        action_text: 'View Jobs',
        related_interests: [interest],
        created_at: new Date().toISOString()
      }
    ];

    return careerNotifications;
  }

  // Calculate notification priority based on deadline and amount
  private calculatePriority(deadline: string, amount: string): 'low' | 'medium' | 'high' | 'urgent' {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysUntil = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Extract amount value for priority calculation
    const amountValue = parseInt(amount.replace(/[^0-9]/g, '')) || 0;

    if (daysUntil <= 7) return 'urgent';
    if (daysUntil <= 14 && amountValue >= 10000) return 'high';
    if (daysUntil <= 30 || amountValue >= 5000) return 'medium';
    return 'low';
  }

  // Check if user should be notified about a specific type
  private async shouldNotifyAbout(notificationType: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: settings } = await supabase
        .from('user_settings')
        .select(notificationType)
        .eq('user_id', user.id)
        .maybeSingle();

      return settings?.[notificationType] ?? true;
    } catch (error) {
      console.error('Error checking notification preferences:', error);
      return true; // Default to true if error
    }
  }

  // Schedule notifications based on user interests
  async scheduleInterestBasedNotifications() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user interests
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('interests')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile?.interests || profile.interests.length === 0) return;

      // Generate notifications for each interest
      const notifications = await this.generateInterestBasedNotifications(profile.interests);
      
      // Store notifications (in a real app, you'd save to database)
      await this.storeNotifications(notifications);
      
      // Schedule push notifications (in a real app)
      await this.schedulePushNotifications(notifications);
    } catch (error) {
      console.error('Error scheduling interest-based notifications:', error);
    }
  }

  // Store notifications in database
  private async storeNotifications(notifications: any[]) {
    try {
      // In a real implementation, save to notifications table
      await AsyncStorage.setItem('pending_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error storing notifications:', error);
    }
  }

  // Schedule push notifications
  private async schedulePushNotifications(notifications: any[]) {
    try {
      for (const notification of notifications) {
        await this.sendPushNotification({
          title: notification.title,
          message: notification.message,
          data: {
            type: notification.type,
            actionUrl: notification.action_url
          }
        });
      }
    } catch (error) {
      console.error('Error scheduling push notifications:', error);
    }
  }

  // Schedule assignment deadline notifications
  async scheduleAssignmentNotifications(assignment: {
    id: string;
    title: string;
    dueDate: string;
    dueTime: string;
    reminders: Array<{ id: string; timeBeforeDue: number; message: string; enabled: boolean }>;
  }) {
    try {
      if (Platform.OS === 'web') {
        console.log('Assignment notifications not supported on web');
        return [];
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Notification permissions not granted');
      }

      const dueDatetime = new Date(`${assignment.dueDate}T${assignment.dueTime}`);
      const now = new Date();
      const scheduledNotifications: string[] = [];

      for (const reminder of assignment.reminders) {
        if (!reminder.enabled) continue;

        const notificationTime = new Date(dueDatetime.getTime() - (reminder.timeBeforeDue * 60 * 1000));
        
        // Only schedule if the notification time is in the future
        if (notificationTime > now) {
          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: `Assignment Reminder: ${assignment.title}`,
              body: reminder.message,
              data: { 
                assignmentId: assignment.id,
                type: 'assignment_reminder',
                dueDate: assignment.dueDate,
                dueTime: assignment.dueTime
              },
            },
            trigger: notificationTime,
          });
          
          scheduledNotifications.push(notificationId);
        }
      }

      return scheduledNotifications;
    } catch (error) {
      console.error('Error scheduling assignment notifications:', error);
      throw error;
    }
  }

  // Cancel assignment notifications
  async cancelAssignmentNotifications(notificationIds: string[]) {
    try {
      if (Platform.OS === 'web') {
        return;
      }

      for (const notificationId of notificationIds) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
    } catch (error) {
      console.error('Error canceling assignment notifications:', error);
    }
  }

  // Cancel all notifications for a specific assignment
  async cancelAllAssignmentNotifications(assignmentId: string) {
    try {
      if (Platform.OS === 'web') {
        return;
      }

      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const assignmentNotifications = scheduledNotifications.filter(
        notification => notification.content.data?.assignmentId === assignmentId
      );

      for (const notification of assignmentNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    } catch (error) {
      console.error('Error canceling all assignment notifications:', error);
    }
  }

  // Send immediate notification
  async sendImmediateNotification(notification: any) {
    try {
      // In a real app, send push notification immediately
      console.log('Sending immediate notification:', notification.title);
    } catch (error) {
      console.error('Error sending immediate notification:', error);
    }
  }

  // Get notification statistics
  async getNotificationStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // In a real implementation, query notifications table
      return {
        total: 15,
        unread: 3,
        scholarships: 5,
        programs: 4,
        career: 3,
        deadlines: 3
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return null;
    }
  }
}

export const notificationService = NotificationService.getInstance();