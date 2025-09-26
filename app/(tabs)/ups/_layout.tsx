import { MaterialTopTabNavigationEventMap, MaterialTopTabNavigationOptions, createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { Stack } from 'expo-router';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function UPSLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="program-detail" />
      <Stack.Screen name="about-program" />
      <Stack.Screen name="course-journey" />
      <Stack.Screen name="graduate-skills" />
      <Stack.Screen name="tools-resources" />
      <Stack.Screen name="internship-hub" />
      <Stack.Screen name="alumni-stories" />
      <Stack.Screen name="schools-admission" />
      <Stack.Screen name="global-exposure" />
      <Stack.Screen name="after-school-toolkit" />
      <Stack.Screen name="life-skills-lab" />
      <Stack.Screen name="entrepreneurship" />
      <Stack.Screen name="inspirational-entertainment" />
      <Stack.Screen name="certification-boost" />
      <Stack.Screen name="innovation-sandbox" />
      <Stack.Screen name="university-detail" />
      <Stack.Screen name="university/accommodation-detail" />
    </Stack>
  );
}

export function UPSTabs() {
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarIndicatorStyle: {
          backgroundColor: '#3B82F6',
          height: 3,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: 'Inter-SemiBold',
          textTransform: 'none',
        },
        tabBarPressColor: '#3B82F615',
      }}>
      <MaterialTopTabs.Screen
        name="universities"
        options={{
          title: 'Universities',
        }}
      />
      <MaterialTopTabs.Screen
        name="programs"
        options={{
          title: 'Programs',
        }}
      />
      <MaterialTopTabs.Screen
        name="scholarships"
        options={{
          title: 'Scholarships',
        }}
      />
    </MaterialTopTabs>
  );
}