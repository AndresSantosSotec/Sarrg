// src/navigation/AppNavigator.tsx
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../contexts/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import MainTabs from './MainTabsNavigator';
import NotificationsScreen from '../screens/NotificationsScreen';
import GeneralInfoScreen from '../screens/GeneralInfoScreen';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Notifications: undefined;
  GeneralInfo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  // Mientras validamos el token, podrías mostrar un SplashScreen o null
  if (loading) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="GeneralInfo" component={GeneralInfoScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
