import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const bars = Array.from({ length: 7 });
  const metrics: { value: string; label: string; icon: React.ComponentProps<typeof FontAwesome>['name'] }[] = [
    { value: '7 DÍAS', label: 'Racha Ejercicio', icon: 'fire' },
    { value: '5000', label: 'KCalorias', icon: 'bolt' },
    { value: '42.03', label: 'Total Minutos', icon: 'clock-o' }
  ];

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
          {metrics.map((metric, index) => (
            <View key={index} style={styles.metricBox}>
              <FontAwesome name={metric.icon} size={20} color="#fff" style={styles.metricIcon} />
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </View>
          ))}
        </View>

        {/* Nivel de usuario */}
        <View style={styles.levelContainer}>
          <View style={styles.levelInfo}>
            <FontAwesome5 name="medal" size={20} color="#fbbf24" />
            <Text style={styles.levelText}>NIVEL 1: Koalas</Text>
          </View>
          <Text style={styles.emoji}>🐨</Text>
        </View>

        {/* Recompensas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="gift" size={16} color="#3b82f6" />
            <Text style={styles.sectionTitle}>RECOMPENSAS</Text>
          </View>
          <View style={styles.rewardBox}>
            <FontAwesome5 name="coins" size={24} color="#fbbf24" />
            <Text style={styles.rewardText}>845 FitCoins</Text>
          </View>
        </View>

        {/* Reto Diario */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="trophy" size={16} color="#3b82f6" />
            <Text style={styles.sectionTitle}>RETO DIARIO | META PERSONAL</Text>
          </View>
          <View style={styles.challengeBox}>
            <View style={styles.challengeHeader}>
              <FontAwesome name="bullseye" size={20} color="#fff" />
              <Text style={styles.challengeText}>15 MINUTOS</Text>
            </View>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '30%' }]} />
              </View>
              <Text style={styles.progressText}>30% completado</Text>
            </View>
            <Text style={styles.activityStatus}>
              <FontAwesome name="exclamation-circle" size={12} color="#d1d5db" /> Sin actividad
            </Text>
          </View>
        </View>

        {/* Gráfico de actividades */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="bar-chart" size={16} color="#3b82f6" />
            <Text style={styles.sectionTitle}>ACTIVIDADES SEMANALES</Text>
          </View>
          <View style={styles.graphContainer}>
            {bars.map((_, i) => (
              <View key={i} style={styles.barGroup}>
                <View
                  style={[styles.bar, { 
                    height: 20 + Math.random() * 60, 
                    backgroundColor: '#fb923c',
                    flexDirection: 'column-reverse'
                  }]}
                >
                  <FontAwesome name="male" size={10} color="#fff" />
                </View>
                <View
                  style={[styles.bar, { 
                    height: 10 + Math.random() * 30, 
                    backgroundColor: '#4ade80',
                    flexDirection: 'column-reverse'
                  }]}
                >
                  <FontAwesome name="bicycle" size={10} color="#fff" />
                </View>
                <View
                  style={[styles.bar, { 
                    height: 5 + Math.random() * 20, 
                    backgroundColor: '#60a5fa',
                    flexDirection: 'column-reverse'
                  }]}
                >
                  <FontAwesome5 name="swimmer" size={10} color="#fff" />
                </View>
                <Text style={styles.dayLabel}>{['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}</Text>
              </View>
            ))}
          </View>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#fb923c' }]} />
              <Text style={styles.legendText}>Correr</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4ade80' }]} />
              <Text style={styles.legendText}>Ciclismo</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#60a5fa' }]} />
              <Text style={styles.legendText}>Natación</Text>
            </View>
          </View>
        </View>

        {/* Botón de acción rápida */}
        <TouchableOpacity style={styles.addButton}>
          <FontAwesome name="plus" size={24} color="#fff" />
        </TouchableOpacity>
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
    paddingBottom: 80,
  },
  header: {
    backgroundColor: '#e5e7eb',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
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
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricBox: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  metricIcon: {
    marginBottom: 4,
  },
  metricValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  metricLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  levelContainer: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  emoji: {
    fontSize: 28,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  rewardBox: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  rewardText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  challengeBox: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  challengeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1e40af',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 4,
  },
  progressText: {
    color: '#d1d5db',
    fontSize: 10,
    textAlign: 'center',
  },
  activityStatus: {
    color: '#d1d5db',
    fontSize: 12,
    textAlign: 'center',
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  barGroup: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 120,
  },
  bar: {
    width: 16,
    marginVertical: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    fontSize: 12,
    marginTop: 8,
    color: '#6b7280',
    fontWeight: '500',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});