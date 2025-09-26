import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calculator, FileText, MapPin, DollarSign, Calendar, Target, BookOpen, Briefcase, Brain, TrendingUp, Users, Award, Clock, Star, Zap, Lightbulb } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AptitudeTest from '@/components/AptitudeTest';
import ScheduleManager from '@/components/ScheduleManager';
import AssignmentManager from '@/components/AssignmentManager';
import StudySection from '@/components/StudySection';
import GPACalculator from '@/components/GPACalculator';
import CareerTracker from '@/components/CareerTracker';
import NotesJournal from '@/components/NotesJournal';

const { width } = Dimensions.get('window');

export default function ToolsScreen() {
  const [aptitudeModalVisible, setAptitudeModalVisible] = React.useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = React.useState(false);
  const [assignmentModalVisible, setAssignmentModalVisible] = React.useState(false);
  const [studyModalVisible, setStudyModalVisible] = React.useState(false); // Keep this for StudySection
  const [gpaModalVisible, setGpaModalVisible] = React.useState(false); // Keep this for GPACalculator
  const [careerModalVisible, setCareerModalVisible] = React.useState(false);
  const [notesModalVisible, setNotesModalVisible] = React.useState(false);

  const featuredTools = [
    {
      title: 'Aptitude Test',
      subtitle: 'Discover Your Potential',
      description: 'Take our comprehensive IQ test to find programs that match your cognitive strengths',
      icon: Brain,
      color: '#3B82F6',
      gradient: ['#3B82F6', '#1D4ED8'],
      onPress: () => setAptitudeModalVisible(true),
      featured: true,
      stats: '15 min test',
      badge: 'Popular'
    },
    {
      title: 'Smart Schedule',
      subtitle: 'Master Your Time',
      description: 'Advanced scheduling system with smart reminders and calendar integration',
      icon: Calendar,
      color: '#10B981',
      gradient: ['#10B981', '#059669'],
      onPress: () => setScheduleModalVisible(true),
      featured: true,
      stats: 'AI-powered',
      badge: 'New'
    },
  ];

  const productivityTools = [
    {
      title: 'Assignment Tracker',
      description: 'Smart assignment management with push notifications and deadline alerts',
      icon: FileText,
      color: '#8B5CF6',
      onPress: () => setAssignmentModalVisible(true),
      stats: 'Smart alerts',
    },
    {
      title: 'Study Planner',
      description: 'Effective study strategies and progress tracking for academic success',
      icon: BookOpen,
      color: '#F59E0B',
      onPress: () => setStudyModalVisible(true),
      stats: 'Study methods',
    },
    {
      title: 'GPA Calculator',
      description: 'Precise GPA calculation and academic performance tracking',
      icon: Calculator,
      color: '#EF4444',
      onPress: () => setGpaModalVisible(true), // Keep this for GPACalculator
      stats: 'Real-time',
    },
  ];

  const careerTools = [
    {
      title: 'Career Tracker',
      description: 'Track opportunities, applications, and career development milestones',
      icon: Briefcase,
      color: '#06B6D4',
      onPress: () => setCareerModalVisible(true),
      stats: 'Goal tracking',
    },
    {
      title: 'Notes & Journal',
      description: 'Organize thoughts, take notes, and maintain a daily learning journal',
      icon: BookOpen,
      color: '#EC4899',
      onPress: () => setNotesModalVisible(true),
      stats: 'Cloud sync',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Student Tools</Text>
            <Text style={styles.subtitle}>Powerful tools to enhance your academic journey</Text>
          </View>
          <View style={styles.headerIcon}>
            <Lightbulb size={32} color="#3B82F6" />
          </View>
        </View>

        {/* Featured Tools */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Tools</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredContainer}>
            {featuredTools.map((tool, index) => (
              <TouchableOpacity key={index} style={styles.featuredCard} onPress={tool.onPress}>
                <LinearGradient
                  colors={tool.gradient}
                  style={styles.featuredGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {tool.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{tool.badge}</Text>
                    </View>
                  )}
                  <View style={styles.featuredIcon}>
                    <tool.icon size={32} color="#FFFFFF" />
                  </View>
                  <Text style={styles.featuredTitle}>{tool.title}</Text>
                  <Text style={styles.featuredSubtitle}>{tool.subtitle}</Text>
                  <Text style={styles.featuredDescription}>{tool.description}</Text>
                  <View style={styles.featuredStats}>
                    <Clock size={14} color="#FFFFFF" />
                    <Text style={styles.featuredStatsText}>{tool.stats}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Productivity Tools */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryTitleRow}>
              <View style={styles.categoryIcon}>
                <TrendingUp size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.categoryTitle}>Productivity & Organization</Text>
            </View>
            <Text style={styles.categorySubtitle}>Stay organized and boost your academic performance</Text>
          </View>
          
          <View style={styles.toolsGrid}>
            {productivityTools.map((tool, index) => (
              <TouchableOpacity key={index} style={styles.toolCard} onPress={tool.onPress}>
                <View style={styles.toolCardContent}>
                  <View style={[styles.toolIconContainer, { backgroundColor: `${tool.color}15` }]}>
                    <tool.icon size={28} color={tool.color} />
                  </View>
                  <View style={styles.toolInfo}>
                    <Text style={styles.toolTitle}>{tool.title}</Text>
                    <Text style={styles.toolDescription}>{tool.description}</Text>
                    <View style={styles.toolStats}>
                      <View style={styles.toolStatsIcon}>
                        <Zap size={12} color={tool.color} />
                      </View>
                      <Text style={[styles.toolStatsText, { color: tool.color }]}>{tool.stats}</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.toolAccent, { backgroundColor: tool.color }]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Career Tools */}
        <View style={styles.categorySection}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryTitleRow}>
              <View style={styles.categoryIcon}>
                <Briefcase size={20} color="#06B6D4" />
              </View>
              <Text style={styles.categoryTitle}>Career Development</Text>
            </View>
            <Text style={styles.categorySubtitle}>Plan and track your professional growth</Text>
          </View>
          
          <View style={styles.toolsGrid}>
            {careerTools.map((tool, index) => (
              <TouchableOpacity key={index} style={styles.toolCard} onPress={tool.onPress}>
                <View style={styles.toolCardContent}>
                  <View style={[styles.toolIconContainer, { backgroundColor: `${tool.color}15` }]}>
                    <tool.icon size={28} color={tool.color} />
                  </View>
                  <View style={styles.toolInfo}>
                    <Text style={styles.toolTitle}>{tool.title}</Text>
                    <Text style={styles.toolDescription}>{tool.description}</Text>
                    <View style={styles.toolStats}>
                      <View style={styles.toolStatsIcon}>
                        <Zap size={12} color={tool.color} />
                      </View>
                      <Text style={[styles.toolStatsText, { color: tool.color }]}>{tool.stats}</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.toolAccent, { backgroundColor: tool.color }]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Modals */}
      <Modal
        visible={aptitudeModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAptitudeModalVisible(false)}
      >
        <AptitudeTest onClose={() => setAptitudeModalVisible(false)} />
      </Modal>
      
      <Modal
        visible={scheduleModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <ScheduleManager onClose={() => setScheduleModalVisible(false)} />
      </Modal>
      
      <Modal
        visible={assignmentModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAssignmentModalVisible(false)}
      >
        <AssignmentManager onClose={() => setAssignmentModalVisible(false)} />
      </Modal>
      
      <Modal
        visible={studyModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setStudyModalVisible(false)}
      >
        <StudySection onClose={() => setStudyModalVisible(false)} />
      </Modal>
      
      <Modal
        visible={gpaModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setGpaModalVisible(false)}
      > 
        <GPACalculator onClose={() => setGpaModalVisible(false)} />
      </Modal>
      
      <Modal
        visible={careerModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCareerModalVisible(false)}
      >
        <CareerTracker onClose={() => setCareerModalVisible(false)} />
      </Modal>
      
      <Modal
        visible={notesModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setNotesModalVisible(false)}
      >
        <NotesJournal onClose={() => setNotesModalVisible(false)} />
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 32,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F615',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredSection: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  featuredContainer: {
    paddingHorizontal: 16,
  },
  featuredCard: {
    width: width * 0.8,
    marginHorizontal: 8,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  featuredGradient: {
    padding: 24,
    minHeight: 220,
    justifyContent: 'space-between',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  featuredIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featuredTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },
  featuredStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  featuredStatsText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  categorySection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  categoryHeader: {
    marginBottom: 20,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF615',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  categorySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginLeft: 52,
  },
  toolsGrid: {
    gap: 16,
  },
  toolCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  toolCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  toolIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  toolInfo: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  toolDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  toolStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolStatsIcon: {
    marginRight: 6,
  },
  toolStatsText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  toolAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  bottomSpacing: {
    height: 40,
  },
});