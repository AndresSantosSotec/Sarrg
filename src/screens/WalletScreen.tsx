import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import Header from '@/components/Header';
// import BottomNavigation from '@/components/BottomNavigation';

export default function WalletScreen() {
  const activities = [
    { name: 'Carrera Rápida + 15 Minutos', points: 10.0 },
    { name: 'Natación Río Usumacinta', points: 10.0 },
    { name: 'Travesía Río Hondo + 2 Horas', points: 10.0 },
    { name: 'Ultra Maratón + 15 Horas', points: 10.0 },
  ];

  const challenges = [
    'Participar en talleres de salud/nutrición (+10)',
    'Registrar tu comida saludable (+5)',
    'Subir evidencia de actividad (foto, ubicación verificada) (+10)',
    'Invitar a un compañero a realizar la actividad juntos (+5)',
  ];

  return (
    <View style={styles.container}>
      {/* <Header title="MONEDERO" showBackButton onBackClick={() => navigation.goBack()} /> */}

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.balanceBox}>
          <Text style={styles.balanceText}>845 FitCoins</Text>
        </View>

        {/* Actividades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acumulado de FitCoins</Text>
          <View style={styles.card}>
            {activities.map((activity, index) => (
              <View key={index} style={styles.activityRow}>
                <Text style={styles.activityName}>{activity.name}</Text>
                <Text style={styles.activityPoints}>{activity.points.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Retos / Capacitaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Capacitaciones y/o competencias Equipo</Text>
          <View style={[styles.card, { padding: 16 }]}>
            {challenges.map((challenge, index) => (
              <Text key={index} style={styles.challengeItem}>
                • {challenge}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* <BottomNavigation /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  balanceBox: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 32,
    marginBottom: 24,
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 12,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    overflow: 'hidden',
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  activityName: {
    color: '#1f2937',
    fontSize: 14,
    flex: 1,
  },
  activityPoints: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  challengeItem: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 8,
  },
});
