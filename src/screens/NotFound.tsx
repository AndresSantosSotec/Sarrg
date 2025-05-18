import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function NotFoundScreen() {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.navigate('Dashboard'); // Asegurate que la ruta se llame así
  };

  return (
    <LinearGradient colors={['#1d4ed8', '#1e3a8a']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Página no encontrada</Text>
        <Text style={styles.description}>
          Lo sentimos, la página que estás buscando no existe.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>← Ir al Dashboard</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    color: '#c7d2fe',
  },
  description: {
    textAlign: 'center',
    color: '#bfdbfe',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
