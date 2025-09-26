import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Image, View, Dimensions, StyleSheet } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface ImageData {
  id: string;
  image_url: string;
  caption?: string;
  order_index: number;
}

interface AutoScrollingImagesProps {
  images: ImageData[];
  width: number;
  height: number;
  autoScrollInterval?: number;
  showIndicators?: boolean;
  isVisible?: boolean; // New prop to control auto-scrolling
}

export default function AutoScrollingImages({
  images,
  width,
  height,
  autoScrollInterval = 2000,
  showIndicators = true,
  isVisible = true
}: AutoScrollingImagesProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || !isVisible) return;

    const startAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        if (!isUserScrolling) {
          setCurrentIndex((prevIndex) => {
            // Move only in one direction (right/forward)
            const nextIndex = (prevIndex + 1) % images.length;
            
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollTo({
                x: nextIndex * width,
                animated: true
              });
            }
            
            return nextIndex;
          });
        }
      }, autoScrollInterval);
    };

    startAutoScroll();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length, width, autoScrollInterval, isVisible, isUserScrolling]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const handleScrollBegin = () => {
    setIsUserScrolling(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleScrollEnd = () => {
    setIsUserScrolling(false);
    // Auto-scroll will resume via useEffect when isUserScrolling becomes false
  };

  if (images.length === 0) {
    return (
      <View style={[styles.container, { width, height }]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop' }}
          style={[styles.image, { width, height }]}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
        style={{ width, height }}
      >
        {images.map((image, index) => (
          <Image
            key={`${image.id}-${index}`}
            source={{ uri: image.image_url }}
            style={[styles.image, { width, height }]}
          />
        ))}
      </ScrollView>

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <View style={styles.indicators}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.activeIndicator
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  indicators: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
    width: 16,
  },
});