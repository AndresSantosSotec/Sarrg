// App.tsx
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </AuthProvider>
  );
}
