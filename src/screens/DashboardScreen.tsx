import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function DashboardScreen() {
  const bars = Array.from({ length: 7 });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>¡Hola, Mario!</Text>
            <Text style={styles.subtitle}>Activa tu salud, gana bienestar.</Text>
          </View>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=120&auto=format&fit=crop',
            }}
            style={styles.avatar}
          />
        </View>

        {/* Métricas del usuario */}
        <View style={styles.metrics}>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>7 DÍAS</Text>
            <Text style={styles.metricLabel}>Racha Ejercicio</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>5000</Text>
            <Text style={styles.metricLabel}>KCalorias</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>42.03</Text>
            <Text style={styles.metricLabel}>Total Minutos</Text>
          </View>
        </View>

        {/* Nivel de usuario */}
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>NIVEL 1: Koalas</Text>
          <Text style={styles.emoji}>🐨</Text>
        </View>

        {/* Recompensas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECOMPENSAS</Text>
          <View style={styles.rewardBox}>
            <Text style={styles.rewardText}>845 FitCoins</Text>
          </View>
        </View>

        {/* Reto Diario */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RETO DIARIO | META PERSONAL</Text>
          <View style={styles.challengeBox}>
            <Text style={styles.challengeText}>🎯 15 MINUTOS</Text>
            <Text style={styles.activityStatus}>Sin actividad</Text>
          </View>
        </View>

        {/* Gráfico de actividades */}
        <View style={styles.section}>
          <Text style={styles.graphTitle}>
            Total Activities - Grouped Activities W/Emojis
          </Text>
          <View style={styles.graphContainer}>
            {bars.map((_, i) => (
              <View key={i} style={styles.barGroup}>
                <View
                  style={[styles.bar, { height: 20 + Math.random() * 60, backgroundColor: '#fb923c' }]}
                />
                <View
                  style={[styles.bar, { height: 10 + Math.random() * 30, backgroundColor: '#4ade80' }]}
                />
                <View
                  style={[styles.bar, { height: 5 + Math.random() * 20, backgroundColor: '#60a5fa' }]}
                />
                <Text style={styles.dayLabel}>{`D${i + 1}`}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#e5e7eb',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    color: '#2563eb',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricBox: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  metricValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  metricLabel: {
    color: '#fff',
    fontSize: 12,
  },
  levelContainer: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelText: {
    color: '#fff',
    fontWeight: '600',
  },
  emoji: {
    fontSize: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  rewardBox: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  rewardText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  challengeBox: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  challengeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityStatus: {
    color: '#d1d5db',
    fontSize: 12,
    marginTop: 8,
  },
  graphTitle: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 8,
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  barGroup: {
    alignItems: 'center',
  },
  bar: {
    width: 10,
    marginVertical: 1,
    borderRadius: 2,
  },
  dayLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#6b7280',
  },
});
