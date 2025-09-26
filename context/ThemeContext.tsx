import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { supabase } from '@/lib/supabase';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  inputBackground: string;
  inputBorder: string;
  tabBarBackground: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  success: string;
  warning: string;
  error: string;
  overlay: string;
}

const lightTheme: ThemeColors = {
  background: '#F8FAFC',
  cardBackground: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  primary: '#3B82F6',
  inputBackground: '#F9FAFB',
  inputBorder: '#D1D5DB',
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E5E7EB',
  tabBarActive: '#3B82F6',
  tabBarInactive: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

const darkTheme: ThemeColors = {
  background: '#0F172A',
  cardBackground: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  primary: '#60A5FA',
  inputBackground: '#334155',
  inputBorder: '#475569',
  tabBarBackground: '#1E293B',
  tabBarBorder: '#334155',
  tabBarActive: '#60A5FA',
  tabBarInactive: '#94A3B8',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

interface ThemeContextType {
  themeMode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [systemColorScheme, setSystemColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    loadThemePreference();
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  const loadThemePreference = async () => {
    try {
      // First try to get from user settings if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: settingsArray } = await supabase
          .from('user_settings')
          .select('theme')
          .eq('user_id', user.id)
          .limit(1);

        if (settingsArray && settingsArray.length > 0 && settingsArray[0]?.theme) {
          setThemeMode(settingsArray[0].theme as ThemeMode);
          return;
        }
      }

      // Fallback to AsyncStorage
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setThemeMode(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const setTheme = async (mode: ThemeMode) => {
    try {
      setThemeMode(mode);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('theme', mode);
      
      // Save to user settings if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            theme: mode,
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const getEffectiveTheme = (): 'light' | 'dark' => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  };

  const effectiveTheme = getEffectiveTheme();
  const colors = effectiveTheme === 'dark' ? darkTheme : lightTheme;
  const isDark = effectiveTheme === 'dark';

  const value: ThemeContextType = {
    themeMode,
    colors,
    isDark,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};