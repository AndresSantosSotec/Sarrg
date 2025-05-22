import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert, AppState, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';

interface PedometerProps {
  steps: number;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
}

const PedometerComponent: React.FC<PedometerProps> = ({ steps, setSteps }) => {
  const [pedometerAvailable, setPedometerAvailable] = useState<boolean | null>(null);
  const [goal] = useState(10000);
  const progressAnim = useState(new Animated.Value(0))[0];
  const subscriptionRef = useRef<any>(null);
  const appState = useRef(AppState.currentState);
  const lastStepsRef = useRef(0);

  // Verificar disponibilidad y configurar el podómetro
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        setPedometerAvailable(isAvailable);
        
        if (isAvailable) {
          // En Android solo podemos comenzar desde cero
          if (Platform.OS === 'android') {
            lastStepsRef.current = 0;
            setSteps(0);
          } else {
            // Para iOS intentamos obtener el historial
            try {
              const end = new Date();
              const start = new Date();
              start.setHours(0, 0, 0, 0);
              const pastSteps = await Pedometer.getStepCountAsync(start, end);
              lastStepsRef.current = pastSteps.steps;
              setSteps(pastSteps.steps);
            } catch (error) {
              console.log('No se pudo obtener historial de pasos, comenzando desde cero');
              lastStepsRef.current = 0;
              setSteps(0);
            }
          }
          
          startPedometer();
        }
      } catch (error) {
        console.error('Error al verificar podómetro:', error);
        setPedometerAvailable(false);
      }
    };

    checkAvailability();

    // Configurar listener para cambios en el estado de la app
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App vuelve a primer plano, reiniciamos el podómetro
        startPedometer();
      } else if (nextAppState.match(/inactive|background/)) {
        // App va a segundo plano, detenemos el podómetro
        stopPedometer();
      }
      appState.current = nextAppState;
    });

    return () => {
      stopPedometer();
      subscription.remove();
    };
  }, []);

  const startPedometer = () => {
    if (subscriptionRef.current) return;
    
    // Comenzamos desde cero en cada inicio para Android
    if (Platform.OS === 'android') {
      lastStepsRef.current = 0;
      setSteps(0);
    }
    
    subscriptionRef.current = Pedometer.watchStepCount(result => {
      setSteps(prevSteps => {
        // Para Android, usamos directamente el valor del contador
        if (Platform.OS === 'android') {
          return result.steps;
        }
        // Para iOS, sumamos al historial
        return lastStepsRef.current + result.steps;
      });
    });
  };

  const stopPedometer = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
  };

  // Animar la barra de progreso
  useEffect(() => {
    const progress = Math.min(steps / goal, 1);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [steps]);

  const handleReset = () => {
    if (Platform.OS === 'android') {
      // En Android necesitamos detener y reiniciar el podómetro para resetear
      stopPedometer();
      lastStepsRef.current = 0;
      setSteps(0);
      startPedometer();
    } else {
      // En iOS simplemente reiniciamos el contador
      lastStepsRef.current = 0;
      setSteps(0);
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepCount}>{steps.toLocaleString()} pasos</Text>
        <Text style={styles.goalText}>Meta: {goal.toLocaleString()}</Text>
      </View>

      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.button, styles.resetBtn]} onPress={handleReset}>
          <Text style={styles.buttonText}>Reiniciar pasos</Text>
        </TouchableOpacity>
      </View>

      {pedometerAvailable === false && (
        <Text style={styles.errorText}>Podómetro no disponible en este dispositivo</Text>
      )}
    </View>
  );
};

export default PedometerComponent;

const styles = StyleSheet.create({
  container: { gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  stepCount: { fontSize: 18, fontWeight: 'bold', color: '#1d4ed8' },
  goalText: { fontSize: 14, color: '#6b7280' },
  progressBar: { height: 16, backgroundColor: '#e5e7eb', borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4ade80' },
  buttons: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 12 },
  button: { paddingVertical: 10, borderRadius: 8, alignItems: 'center', minWidth: 150 },
  resetBtn: { backgroundColor: '#9ca3af' },
  buttonText: { color: 'white', fontWeight: '600' },
  errorText: { marginTop: 8, color: '#ef4444', textAlign: 'center' },
});