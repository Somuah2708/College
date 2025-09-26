import { MaterialTopTabNavigationEventMap, MaterialTopTabNavigationOptions, createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function UPSTabsLayout() {
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