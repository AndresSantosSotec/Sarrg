import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles/ReferenceScreen.styles'; 
export default function ReferenceActivityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="info" size={24} color="#3b82f6" />
            <Text style={styles.cardTitle}>Fuentes y Enfoque del Programa</Text>
          </View>

          <Text style={styles.text}>
            CoosanjerFit es una aplicación que apoya el bienestar físico de los asociados mediante el registro de actividad física y la asignación de recompensas virtuales. No utiliza datos médicos clínicos ni realiza diagnósticos.
          </Text>

          <Text style={styles.text}>
            El sistema de la cooperativa almacena y administra la información ingresada por el usuario como peso, altura y metas personalizadas. Estas metas son configuradas exclusivamente por el líder del programa de Bienestar de la empresa.
          </Text>

          <Text style={styles.text}>
            Una vez completadas las metas asignadas, los usuarios reciben monedas virtuales (Fitcoins), las cuales pueden canjear por premios o beneficios internos. El sistema no depende de los datos de Apple HealthKit, sino de los registros configurados internamente.
          </Text>

          <Text style={styles.text}>
            CoosanjerFit no proporciona diagnósticos médicos, ni debe usarse como herramienta de evaluación clínica. Su propósito es promover hábitos saludables y registrar avances físicos dentro de un entorno cooperativo supervisado.
          </Text>

          <View style={styles.cardHeader}>
            <MaterialIcons name="library-books" size={24} color="#3b82f6" />
            <Text style={styles.cardTitle}>Fuentes Referenciadas</Text>
          </View>

          <Text style={styles.source}>• Organización Mundial de la Salud (OMS){'\n'}https://www.who.int</Text>
          <Text style={styles.source}>• Centros para el Control y la Prevención de Enfermedades (CDC){'\n'}https://www.cdc.gov</Text>
          <Text style={styles.source}>• Estudios clave revisados por pares en actividad física y salud ocupacional</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
