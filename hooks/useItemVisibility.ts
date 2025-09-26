import { useState, useRef } from 'react';
import { View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export const useItemVisibility = () => {
  const [visibleIndex, setVisibleIndex] = useState<number | null>(0);
  const refs = useRef<{ [key: number]: View | null }>({});

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const containerWidth = event.nativeEvent.layoutMeasurement.width;
    const threshold = 0.8; // 80% visibility threshold
    
    let foundVisible = false;
    
    Object.keys(refs.current).forEach((indexStr) => {
      const index = parseInt(indexStr);
      const view = refs.current[index];
      
      if (view) {
        // Measure the view to get its position
        view.measureInWindow((x, y, width, height) => {
          if (width > 0) {
            // Calculate visibility based on scroll position
            // Assuming each item is approximately 300px wide (280px + margins)
            const itemWidth = 300;
            const itemLeft = index * itemWidth;
            const itemRight = itemLeft + itemWidth;
            
            // Calculate what portion of the item is visible
            const visibleLeft = Math.max(itemLeft, scrollX);
            const visibleRight = Math.min(itemRight, scrollX + containerWidth);
            const visibleWidth = Math.max(0, visibleRight - visibleLeft);
            const visibilityRatio = visibleWidth / itemWidth;
            
            if (visibilityRatio >= threshold && !foundVisible) {
              setVisibleIndex(index);
              foundVisible = true;
            }
          }
        });
      }
    });
    
    // Simple fallback based on scroll position if measurement fails
    if (!foundVisible) {
      const itemWidth = 300; // Approximate item width including margins
      const currentIndex = Math.round(scrollX / itemWidth);
      setVisibleIndex(currentIndex);
    }
  };

  return {
    visibleIndex,
    refs,
    handleScroll
  };
};