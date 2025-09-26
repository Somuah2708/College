import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Share, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, Clock, TrendingUp, Share as ShareIcon, Bookmark } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import AutoScrollingImages from '@/components/AutoScrollingImages';

const { width } = Dimensions.get('window');

interface NewsImage {
  id: string;
  image_url: string;
  caption?: string;
  order_index: number;
}

interface NewsDetail {
  id: string;
  headline: string;
  summary: string;
  content: string;
  images: NewsImage[];
  category: string;
  source: string;
  trending_score: number;
  published_at: string;
  read_time: string;
}

export default function NewsDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [newsDetail, setNewsDetail] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    headline,
    summary,
    thumbnail,
    category,
    publishedAt,
    readTime,
    trending_score,
    source
  } = params;

  useEffect(() => {
    loadNewsDetail();
  }, []);

  const loadNewsDetail = async () => {
    try {
      setLoading(true);
      
      const { data: newsData, error: newsError } = await supabase
        .from('trending_news')
        .select(`
          *,
          trending_news_images(id, image_url, caption, order_index)
        `)
        .eq('id', params.id)
        .single();

      if (newsError) throw newsError;

      if (newsData) {
        const sortedImages = (newsData.trending_news_images || [])
          .sort((a: any, b: any) => a.order_index - b.order_index);

        const images = sortedImages.length > 0 
          ? sortedImages.map((img: any) => ({
              id: img.id,
              image_url: img.image_url,
              caption: img.caption,
              order_index: img.order_index
            }))
          : [{
              id: 'thumbnail',
              image_url: newsData.thumbnail_url || thumbnail as string,
              caption: 'Main image',
              order_index: 0
            }];

        setNewsDetail({
          id: newsData.id,
          headline: newsData.headline,
          summary: newsData.summary,
          content: generateFullContent(newsData.summary),
          images,
          category: newsData.category,
          source: newsData.source,
          trending_score: newsData.trending_score,
          published_at: newsData.published_at,
          read_time: newsData.read_time
        });
      }
    } catch (error) {
      console.error('Error loading news detail:', error);
      // Fallback with params data
      setNewsDetail({
        id: params.id as string,
        headline: headline as string,
        summary: summary as string,
        content: generateFullContent(summary as string),
        images: [{
          id: 'main',
          image_url: thumbnail as string,
          caption: 'Main image',
          order_index: 0
        }],
        category: category as string,
        source: source as string,
        trending_score: parseInt(trending_score as string) || 50,
        published_at: publishedAt as string,
        read_time: readTime as string
      });
    } finally {
      setLoading(false);
    }
  };

  const generateFullContent = (summaryText: string) => {
    return `${summaryText}

This groundbreaking development represents a significant milestone in the field. Industry experts have praised the initiative for its innovative approach and potential long-term impact.

The implementation involves collaboration between multiple stakeholders, ensuring comprehensive coverage and maximum effectiveness. Early indicators suggest positive reception from the target audience.

Key highlights include:
• Advanced technological integration
• Collaborative partnerships with leading institutions  
• Focus on sustainable and scalable solutions
• Commitment to excellence and innovation

Moving forward, the initiative is expected to set new standards and inspire similar developments across the industry. Continued monitoring and evaluation will ensure optimal outcomes and identify areas for further improvement.

The success of this project demonstrates the power of strategic planning, dedicated execution, and community engagement in achieving transformative results.`;
  };

  const shareNews = async () => {
    try {
      const content = newsDetail || {
        headline: headline as string,
        summary: summary as string
      };
      await Share.share({
        message: `${content.headline}\n\n${content.summary}\n\nRead more in the College App`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading article...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayData = newsDetail || {
    id: params.id as string,
    headline: headline as string,
    summary: summary as string,
    content: generateFullContent(summary as string),
    images: [{ id: 'main', image_url: thumbnail as string, caption: 'Main image', order_index: 0 }],
    category: category as string,
    source: source as string,
    trending_score: parseInt(trending_score as string) || 50,
    published_at: publishedAt as string,
    read_time: readTime as string
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>News Details</Text>
        <TouchableOpacity style={styles.shareButton} onPress={shareNews}>
          <ShareIcon size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          <AutoScrollingImages
            images={displayData.images}
            width={width}
            height={250}
            autoScrollInterval={3000}
            showIndicators={true}
          />
          <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.categoryText}>{displayData.category}</Text>
          </View>
        </View>

        <View style={[styles.articleContent, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.title, { color: colors.text }]}>{displayData.headline}</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            By {displayData.source} • {displayData.read_time} • {displayData.trending_score}% trending
          </Text>
          <Text style={[styles.summary, { color: colors.text }]}>{displayData.summary}</Text>
          <Text style={[styles.fullContent, { color: colors.text }]}>{displayData.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold' },
  shareButton: { padding: 8 },
  content: { flex: 1 },
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
  articleContent: {
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    lineHeight: 32,
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  summary: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  fullContent: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
});
