import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, Clock, TrendingUp, Share as ShareIcon, Bookmark, TriangleAlert as AlertTriangle, ExternalLink, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function NewsDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    id,
    headline,
    summary,
    thumbnail,
    category,
    publishedAt,
    readTime,
    trending_score,
    source
  } = params;

  const getTrendingColor = (score: number) => {
    if (score >= 90) return '#EF4444'; // Hot trending
    if (score >= 80) return '#F59E0B'; // Trending
    return '#3B82F6'; // Popular
  };

  const getTrendingGradient = (score: number) => {
    if (score >= 90) return ['#EF4444', '#DC2626']; // Hot trending
    if (score >= 80) return ['#F59E0B', '#D97706']; // Trending
    return ['#3B82F6', '#2563EB']; // Popular
  };

  const getTrendingLabel = (score: number) => {
    if (score >= 90) return 'HOT';
    if (score >= 80) return 'TRENDING';
    return 'POPULAR';
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const shareNews = async () => {
    try {
      await Share.share({
        message: `${headline}\n\n${summary}\n\nRead more in the College app`,
        title: headline as string,
      });
    } catch (error) {
      console.error('Error sharing news:', error);
    }
  };

  // Generate full article content based on the summary
  const generateFullContent = () => {
    const baseContent = summary as string;
    
    // Add more detailed content based on category
    let additionalContent = '';
    
    if ((category as string) === 'Scholarships') {
      additionalContent = `
      
**Application Process:**
Students can apply through the official government portal starting February 1, 2025. The application process includes:

• Online application form with academic transcripts
• Personal statement (500 words maximum)
• Two letters of recommendation
• Proof of financial need documentation
• STEM program enrollment verification

**Eligibility Criteria:**
To qualify for this scholarship program, applicants must:

• Be enrolled in or accepted to a STEM program at an accredited university
• Maintain a minimum GPA of 3.5 or equivalent
• Demonstrate financial need through official documentation
• Be a citizen or permanent resident
• Commit to completing their degree program

**Program Benefits:**
The comprehensive scholarship package includes:

• Full tuition coverage for up to 4 years
• Monthly living allowance of $800
• Textbook and equipment stipend
• Mentorship program with industry professionals
• Guaranteed internship placement
• Career counseling and job placement assistance

**Timeline:**
• Application opens: February 1, 2025
• Application deadline: April 15, 2025
• Selection process: May 1-31, 2025
• Results announcement: June 15, 2025
• Program begins: September 2025

This initiative represents the largest investment in STEM education in the country's history and is expected to produce 10,000 new STEM graduates over the next five years.`;
    } else if ((category as string) === 'Admissions') {
      additionalContent = `
      
**Affected Universities:**
The deadline extension applies to the following institutions:

• University of Ghana - Extended to March 1, 2025
• Kwame Nkrumah University of Science and Technology - Extended to February 28, 2025
• University of Cape Coast - Extended to March 5, 2025
• Ashesi University - Extended to February 25, 2025
• Ghana Technology University College - Extended to March 3, 2025

**Technical Issues Resolved:**
The universities experienced significant technical challenges including:

• Server overload due to unprecedented application volume
• Payment gateway failures affecting application fee processing
• Document upload system malfunctions
• Email verification delays

All technical issues have been resolved, and the application systems are now operating at full capacity.

**What Students Should Do:**
• Complete applications as soon as possible
• Ensure all required documents are uploaded
• Verify payment processing for application fees
• Check email regularly for updates from universities
• Contact admissions offices for any technical support needed

**Additional Support:**
Universities have added extra staff to handle the increased volume and provide support to applicants. Extended customer service hours are now available from 8 AM to 8 PM, Monday through Saturday.`;
    } else {
      additionalContent = `
      
**Key Details:**
This development represents a significant shift in the educational landscape, with far-reaching implications for students, institutions, and the broader community.

**Impact Analysis:**
The announcement has already generated considerable interest from various stakeholders, including current students, prospective applicants, educational institutions, and industry partners.

**Next Steps:**
Further details will be released in the coming weeks, including specific implementation timelines, eligibility criteria, and application procedures.

**Expert Commentary:**
Education experts have praised this initiative as a forward-thinking approach that addresses current challenges while preparing for future opportunities in the evolving educational sector.

**Community Response:**
The response from the academic community has been overwhelmingly positive, with many expressing optimism about the potential benefits and opportunities this will create.`;
    }

    return baseContent + additionalContent;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={shareNews}>
              <ShareIcon size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Bookmark size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trending Badge */}
        <View style={styles.trendingSection}>
          <LinearGradient
            colors={getTrendingGradient(parseInt(trending_score as string))}
            style={styles.trendingBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Star size={16} color="#FFFFFF" />
            <Text style={styles.trendingText}>
              {getTrendingLabel(parseInt(trending_score as string))} NEWS
            </Text>
          </LinearGradient>
        </View>

        {/* Featured Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: thumbnail as string }} 
            style={styles.featuredImage}
            defaultSource={{ uri: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg' }}
          />
          <View style={styles.imageOverlay}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          </View>
        </View>

        {/* Article Content */}
        <View style={[styles.contentContainer, { backgroundColor: colors.cardBackground }]}>
          {/* Article Header */}
          <View style={styles.articleHeader}>
            <Text style={[styles.headline, { color: colors.text }]}>
              {headline}
            </Text>
            
            <View style={styles.articleMeta}>
              <View style={styles.metaRow}>
                <Text style={[styles.sourceText, { color: colors.primary }]}>
                  {source}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Clock size={16} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  {getTimeAgo(publishedAt as string)}
                </Text>
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  • {readTime}
                </Text>
              </View>
            </View>
          </View>

          {/* Article Body */}
          <View style={styles.articleBody}>
            <Text style={[styles.summary, { color: colors.textSecondary }]}>
              {summary}
            </Text>
            
            <Text style={[styles.fullContent, { color: colors.text }]}>
              {generateFullContent()}
            </Text>
          </View>

          {/* Article Footer */}
          <View style={[styles.articleFooter, { borderTopColor: colors.border }]}>
            <View style={styles.footerActions}>
              <TouchableOpacity 
                style={[styles.footerButton, { backgroundColor: colors.primary + '15' }]}
                onPress={shareNews}
              >
                <ShareIcon size={20} color={colors.primary} />
                <Text style={[styles.footerButtonText, { color: colors.primary }]}>
                  Share Article
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.footerButton, { backgroundColor: colors.success + '15' }]}
              >
                <Bookmark size={20} color={colors.success} />
                <Text style={[styles.footerButtonText, { color: colors.success }]}>
                  Save for Later
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sourceInfo}>
              <Text style={[styles.sourceLabel, { color: colors.textSecondary }]}>
                Source: 
              </Text>
              <Text style={[styles.sourceValue, { color: colors.primary }]}>
                {source}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  trendingSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  trendingText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  contentContainer: {
    margin: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  articleHeader: {
    padding: 24,
    paddingBottom: 16,
  },
  headline: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    lineHeight: 36,
    marginBottom: 16,
  },
  articleMeta: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sourceText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  articleBody: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  summary: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    lineHeight: 26,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  fullContent: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 26,
  },
  articleFooter: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  footerButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  sourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  sourceValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
});