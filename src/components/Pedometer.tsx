import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert, AppState, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';

interface PedometerProps {
  steps: number;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
}

const PedometerComponent: React.FC<PedometerProps> = ({ steps, setSteps }) => {
  const [pedometerAvailable, setPedometerAvailable] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [goal] = useState(10000);
  const [strideLength] = useState(0.70); // metros
  const [dailySteps, setDailySteps] = useState(0);
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());
  
  const progressAnim = useState(new Animated.Value(0))[0];
  const subscriptionRef = useRef<any>(null);
  const appState = useRef(AppState.currentState);
  const lastStepsRef = useRef(0);
  const sessionStartSteps = useRef(0);

  // Verificar si es un nuevo día y resetear automáticamente
  useEffect(() => {
    const checkNewDay = () => {
      const today = new Date().toDateString();
      if (lastResetDate !== today) {
        handleDailyReset();
        setLastResetDate(today);
      }
    };

    // Verificar al iniciar
    checkNewDay();

    // Verificar cada minuto
    const interval = setInterval(checkNewDay, 60000);

    return () => clearInterval(interval);
  }, [lastResetDate]);

  // Verificar disponibilidad del podómetro
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const available = await Pedometer.isAvailableAsync();
        setPedometerAvailable(available);
      } catch (error) {
        console.error('Error al verificar podómetro:', error);
        setPedometerAvailable(false);
      }
    };

    checkAvailability();

    // Configurar listener para cambios en el estado de la app
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (isActive) {
          startPedometer();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        stopPedometer();
      }
      appState.current = nextAppState;
    });

    return () => {
      stopPedometer();
      subscription.remove();
    };
  }, [isActive]);

  const startPedometer = async () => {
    if (subscriptionRef.current || !pedometerAvailable) return;
    
    try {
      // Obtener pasos de referencia al iniciar
      if (Platform.OS === 'ios') {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        try {
          const pastSteps = await Pedometer.getStepCountAsync(start, end);
          sessionStartSteps.current = pastSteps.steps;
        } catch (error) {
          sessionStartSteps.current = 0;
        }
      } else {
        sessionStartSteps.current = 0;
      }
      
      subscriptionRef.current = Pedometer.watchStepCount(result => {
        setSteps(prevSteps => {
          let newSteps;
          if (Platform.OS === 'android') {
            newSteps = result.steps;
          } else {
            newSteps = Math.max(0, result.steps);
          }
          
          // Actualizar pasos diarios
          setDailySteps(sessionStartSteps.current + newSteps);
          return newSteps;
        });
      });
    } catch (error) {
      console.error('Error al iniciar podómetro:', error);
      Alert.alert('Error', 'No se pudo iniciar el podómetro');
    }
  };

  const stopPedometer = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
  };

  const handleStart = () => {
    setIsActive(true);
    startPedometer();
  };

  const handleStop = () => {
    setIsActive(false);
    stopPedometer();
  };

  const handleReset = () => {
    Alert.alert(
      'Reiniciar sesión',
      '¿Estás seguro de que quieres reiniciar el contador de pasos de esta sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          onPress: () => {
            stopPedometer();
            setSteps(0);
            sessionStartSteps.current = 0;
            if (isActive) {
              setTimeout(() => startPedometer(), 100);
            }
          }
        }
      ]
    );
  };

  const handleDailyReset = () => {
    stopPedometer();
    setSteps(0);
    setDailySteps(0);
    sessionStartSteps.current = 0;
    if (isActive) {
      setTimeout(() => startPedometer(), 100);
    }
  };

  // Calcular estadísticas
  const calculateDistance = (stepCount: number): number => {
    return (stepCount * strideLength) / 1000; // en km
  };

  const calculateStepsPerKm = (): number => {
    return Math.round(1000 / strideLength);
  };

  const sessionDistance = calculateDistance(steps);
  const dailyDistance = calculateDistance(dailySteps);
  const stepsPerKm = calculateStepsPerKm();

  // Animar la barra de progreso
  useEffect(() => {
    const progress = Math.min(dailySteps / goal, 1);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [dailySteps]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (pedometerAvailable === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Verificando podómetro...</Text>
      </View>
    );
  }

  if (pedometerAvailable === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Podómetro no disponible en este dispositivo</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Estado del podómetro */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: isActive ? '#22c55e' : '#ef4444' }]} />
        <Text style={styles.statusText}>
          {isActive ? 'Podómetro Activo' : 'Podómetro Detenido'}
        </Text>
      </View>

      {/* Estadísticas de la sesión actual */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Sesión Actual</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{steps.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Pasos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{sessionDistance.toFixed(2)}</Text>
            <Text style={styles.statLabel}>km</Text>
          </View>
        </View>
      </View>

      {/* Estadísticas diarias */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Total Diario</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{dailySteps.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Pasos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{dailyDistance.toFixed(2)}</Text>
            <Text style={styles.statLabel}>km</Text>
          </View>
        </View>
        
        <Text style={styles.goalText}>
          Meta diaria: {goal.toLocaleString()} pasos ({(goal * strideLength / 1000).toFixed(1)} km)
        </Text>
        
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        
        <Text style={styles.progressText}>
          {Math.round((dailySteps / goal) * 100)}% de la meta diaria
        </Text>
      </View>

      {/* Logro de 10km */}
      {dailyDistance >= 10 && (
        <View style={styles.achievementSection}>
          <Text style={styles.achievementText}>
            🎉 ¡Has caminado más de 10 km hoy!
          </Text>
        </View>
      )}

      {/* Controles */}
      <View style={styles.controls}>
        <View style={styles.mainControls}>
          {!isActive ? (
            <TouchableOpacity style={[styles.button, styles.startBtn]} onPress={handleStart}>
              <Text style={styles.buttonText}>Iniciar Podómetro</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.button, styles.stopBtn]} onPress={handleStop}>
              <Text style={styles.buttonText}>Detener Podómetro</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.secondaryControls}>
          <TouchableOpacity 
            style={[styles.button, styles.resetBtn]} 
            onPress={handleReset}
            disabled={!isActive && steps === 0}
          >
            <Text style={styles.buttonText}>Reiniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PedometerComponent;

const styles = StyleSheet.create({
  container: { 
    gap: 16,
    padding: 16 
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280'
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151'
  },
  statsSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center'
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d4ed8'
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4
  },
  goalText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8
  },
  progressBar: {
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ade80'
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center'
  },
  achievementSection: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    alignItems: 'center'
  },
  achievementText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'center',
    marginTop: 8
  },
  controls: {
    gap: 12
  },
  mainControls: {
    alignItems: 'center'
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 160
  },
  startBtn: {
    backgroundColor: '#22c55e'
  },
  stopBtn: {
    backgroundColor: '#ef4444'
  },
  resetBtn: {
    backgroundColor: '#9ca3af'
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 16
  }
});