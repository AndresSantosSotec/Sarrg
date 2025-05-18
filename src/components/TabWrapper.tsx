import React from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';

export default function TabWrapper({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    paddingBottom: 64, // deja espacio para la barra inferior
  },
});
