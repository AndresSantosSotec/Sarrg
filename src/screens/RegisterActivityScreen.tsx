import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import Header from '@/components/Header';
// import BottomNavigation from '@/components/BottomNavigation';
import Pedometer from '../components/Pedometer';

export default function RegisterActivityScreen() {
  const [exerciseType] = useState('Caminata + Trote Básico');
  const [duration] = useState('45 minutos');
  const [intensity] = useState('Media');
  const [calories] = useState('7850');
  const [steps, setSteps] = useState(0);

  const handleSaveActivity = () => {
    Alert.alert('Actividad guardada', 'Has registrado una nueva actividad física');
  };

  return (
    <View style={styles.container}>
      {/* <Header title="REGISTRAR ACTIVIDAD" showBackButton onBackClick={() => navigation.goBack()} /> */}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* SELFIE y DISPOSITIVO */}
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.boxIcon}>📷</Text>
            <Text style={styles.boxText}>SELFIE</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxIcon}>📷</Text>
            <Text style={styles.boxText}>DISPOSITIVO</Text>
          </View>
        </View>

        {/* Detalles */}
        {renderCard('🏃 TIPO EJERCICIO', exerciseType)}
        {renderCard('⏱️ DURACIÓN', duration)}
        {renderCard('💪 INTENSIDAD', intensity)}
        {renderCard('🔥 KCALORIAS QUEMADAS', calories)}

        {/* Podómetro */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👣 PODÓMETRO</Text>
          <Pedometer steps={steps} setSteps={setSteps} />
        </View>

        {/* Otras actividades */}
        <View style={styles.section}>
          <Text style={styles.subTitle}>OTRAS ACTIVIDADES</Text>
          <View style={styles.otherActivity}>
            <View style={styles.otherActivityText}>
              <Text style={{ color: 'white' }}>Taller de Comida Saludable</Text>
            </View>
            <View style={styles.otherActivityBtn}>
              <Text style={{ color: 'white', fontSize: 18 }}>📷</Text>
              <Text style={styles.otherActivityLabel}>Evidencia</Text>
            </View>
          </View>
        </View>

        {/* Botón Guardar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveActivity}>
            <Text style={styles.saveButtonText}>Guardar Actividad</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* <BottomNavigation /> */}
    </View>
  );
}

function renderCard(title: string, value: string) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.cardBody}>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  box: {
    width: '48%',
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxIcon: {
    fontSize: 28,
    marginBottom: 8,
    color: 'white',
  },
  boxText: {
    color: 'white',
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    backgroundColor: '#2563eb',
    color: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontWeight: '600',
    fontSize: 14,
  },
  cardBody: {
    backgroundColor: '#f0f9ff',
    padding: 16,
  },
  cardValue: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: 8,
    padding: 12,
    color: '#1d4ed8',
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  subTitle: {
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 8,
  },
  otherActivity: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  otherActivityText: {
    backgroundColor: '#2563eb',
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  otherActivityBtn: {
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
    padding: 12,
    width: 70,
  },
  otherActivityLabel: {
    color: 'white',
    fontSize: 10,
    marginTop: 4,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
