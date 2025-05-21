import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';

interface PedometerProps {
  steps: number;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
}

const PedometerComponent: React.FC<PedometerProps> = ({ steps, setSteps }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [pedometerAvailable, setPedometerAvailable] = useState<boolean | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [goal] = useState(10000);
  const progressAnim = useState(new Animated.Value(0))[0];

  // 1) Comprueba disponibilidad solo una vez
  useEffect(() => {
    Pedometer.isAvailableAsync()
      .then(available => setPedometerAvailable(available))
      .catch(() => setPedometerAvailable(false));
  }, []);

  // 2) Suscribe / desuscribe al conteo
  useEffect(() => {
    if (isRunning && pedometerAvailable) {
      const sub = Pedometer.watchStepCount(result => {
        setSteps(result.steps);
      });
      setSubscription(sub);
    } else if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
    // limpia al desmontar o al cambiar isRunning
    return () => {
      if (subscription) {
        subscription.remove();
        setSubscription(null);
      }
    };
  }, [isRunning, pedometerAvailable]);

  // 3) Anima la barra de progreso
  useEffect(() => {
    const progress = Math.min(steps / goal, 1);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [steps]);

  const handleReset = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
    setIsRunning(false);
    setSteps(0);
  };

  const toggleRunning = () => {
    if (pedometerAvailable === false) {
      Alert.alert('No disponible', 'Tu dispositivo no soporta podómetro.');
      return;
    }
    setIsRunning(r => !r);
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
        <TouchableOpacity
          style={[styles.button, isRunning ? styles.stopBtn : styles.startBtn]}
          onPress={toggleRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Detener' : 'Iniciar'} conteo
          </Text>
        </TouchableOpacity>

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
  goalText:  { fontSize: 14, color: '#6b7280' },
  progressBar:   { height: 16, backgroundColor: '#e5e7eb', borderRadius: 10, overflow: 'hidden' },
  progressFill:  { height: '100%', backgroundColor: '#4ade80' },
  buttons:       { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 12 },
  button:        { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  startBtn:      { backgroundColor: '#3b82f6' },
  stopBtn:       { backgroundColor: '#ef4444' },
  resetBtn:      { backgroundColor: '#9ca3af' },
  buttonText:    { color: 'white', fontWeight: '600' },
  errorText:     { marginTop: 8, color: '#ef4444', textAlign: 'center' },
});
