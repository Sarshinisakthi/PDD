import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore, initAuthListener } from './store/authStore';
import { ActivityIndicator, View } from 'react-native';
import { Activity, Bell, FileText, User as UserIcon } from 'lucide-react-native';

// Import Screens (Stubs below, full implementation will go in their own files)
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import AlertsScreen from './screens/AlertsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator screenOptions={{ 
    headerShown: false,
    tabBarActiveTintColor: '#3b82f6',
    tabBarStyle: { backgroundColor: '#1B2238', borderTopWidth: 0 }
  }}>
    <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: ({color}) => <Activity color={color} size={24} /> }} />
    <Tab.Screen name="Alerts" component={AlertsScreen} options={{ tabBarIcon: ({color}) => <Bell color={color} size={24} /> }} />
  </Tab.Navigator>
);

export default function AppNavigator() {
  const { user, loading } = useAuthStore();

  useEffect(() => {
    initAuthListener();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B1020' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
