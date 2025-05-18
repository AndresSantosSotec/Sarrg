import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Si ya creaste estos componentes en mobile, descomentalos:
// import Header from '@/components/Header';
// import BottomNavigation from '@/components/BottomNavigation';

export default function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header personalizado, si tenés uno */}
      {/* <Header title="Perfil de Usuario" showBackButton onBackClick={() => navigation.goBack()} /> */}

      <ScrollView contentContainerStyle={styles.content}>
        {/* Datos Generales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos Generales</Text>
          <View style={styles.card}>
            {renderRow('Nombre Completo', 'Mario García')}
            {renderRow('Sexo', 'Masculino')}
            {renderRow('Teléfono', '555-1234-5678')}
            {renderRow('Dirección', 'Calle Principal #123')}
            {renderRow('Ocupación', 'Desarrollador')}
            {renderRow('Peso', '75 kg')}
            {renderRow('Altura', '178 cm')}
          </View>
        </View>

        {/* Datos Médicos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos Médicos</Text>
          <View style={styles.card}>
            {renderRow('Tipo de Sangre', 'O+')}
            {renderRow('Alergias', 'Ninguna')}
            {renderRow('Padecimientos', 'Ninguno')}
            {renderRow('Índice Masa Corporal', '23.6')}
          </View>
        </View>

        {/* Fecha de actualización */}
        <Text style={styles.footerText}>Fecha Actualización Datos: 15/05/2023</Text>

        {/* Evolución */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evolución o Progreso</Text>
          <View style={styles.card}>
            <Text style={styles.infoText}>Información de progreso no disponible</Text>
          </View>
        </View>
      </ScrollView>

      {/* <BottomNavigation /> */}
    </View>
  );
}

function renderRow(label: string, value: string) {
  return (
    <View style={styles.row} key={label}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingBottom: 16,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#4b5563',
  },
  value: {
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 20,
  },
  infoText: {
    textAlign: 'center',
    color: '#6b7280',
    paddingVertical: 16,
  },
});

