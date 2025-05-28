import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert, AppState, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import * as IntentLauncher from 'expo-intent-launcher';

interface PedometerProps {
  steps: number;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  onTimeUpdate?: (seconds: number) => void;     // ✨ Nueva prop
}

const PedometerComponent: React.FC<PedometerProps> = ({ steps, setSteps, onTimeUpdate }) => {
  const [pedometerAvailable, setPedometerAvailable] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [isFirstTime, setIsFirstTime] = useState(true); // Rastrear si es primera vez
  const [goal] = useState(10000);
  const [strideLength] = useState(0.70); // metros
  const [dailySteps, setDailySteps] = useState(0);
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());

  // Estados del temporizador
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [dailyTotalTime, setDailyTotalTime] = useState(0);

  const progressAnim = useState(new Animated.Value(0))[0];
  const subscriptionRef = useRef<any>(null);
  const appState = useRef(AppState.currentState);
  const lastStepsRef = useRef(0);
  const sessionStartSteps = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Función para solicitar permisos de actividad física
  const requestActivityPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        // Para Android, verificar si tenemos acceso a sensores
        const isAvailable = await Pedometer.isAvailableAsync();
        if (!isAvailable) {
          Alert.alert(
            'Permisos necesarios',
            'Esta aplicación necesita acceso a los sensores de actividad física para contar tus pasos.',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Ir a Configuración',
                onPress: () => {
                  // Abrir configuración de la aplicación
                  IntentLauncher.startActivityAsync(
                    IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
                    { data: 'package:' + 'com.yourapp.package' } // Reemplaza con tu package name
                  );
                }
              }
            ]
          );
          return false;
        }
        return true;
      } else if (Platform.OS === 'ios') {
        // Para iOS, intentar acceder y manejar la respuesta
        try {
          const end = new Date();
          const start = new Date();
          start.setDate(start.getDate() - 1);

          // Esto triggeará la solicitud de permisos automáticamente
          await Pedometer.getStepCountAsync(start, end);
          return true;
        } catch (error: any) {
          if (error.code === 'ERR_PEDOMETER_UNAUTHORIZED') {
            Alert.alert(
              'Permisos requeridos',
              'Para contar tus pasos, necesitamos acceso a tu información de actividad física. Ve a Configuración > Privacidad y Seguridad > Movimiento y Actividad física.',
              [
                { text: 'Más tarde', style: 'cancel' },
                {
                  text: 'Ir a Configuración',
                  onPress: () => {
                    // En iOS no podemos abrir configuración directamente
                    Alert.alert(
                      'Instrucciones',
                      'Ve a Configuración de iOS > Privacidad y Seguridad > Movimiento y Actividad física > [Tu App] y activa el permiso.'
                    );
                  }
                }
              ]
            );
            return false;
          }
          console.error('Error al solicitar permisos:', error);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      Alert.alert('Error', 'No se pudieron solicitar los permisos necesarios.');
      return false;
    }
  };

  // Función mejorada para verificar permisos
  const checkPermissions = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'ios') {
        // Intentar obtener datos históricos para verificar permisos
        const end = new Date();
        const start = new Date();
        start.setHours(start.getHours() - 1); // Solo última hora para test rápido

        try {
          await Pedometer.getStepCountAsync(start, end);
          setPermissionGranted(true);
          return true;
        } catch (error: any) {
          if (error.code === 'ERR_PEDOMETER_UNAUTHORIZED') {
            setPermissionGranted(false);
            return false;
          }
          // Otros errores podrían indicar que el permiso está OK pero hay otro problema
          setPermissionGranted(true);
          return true;
        }
      } else {
        // Para Android, verificar disponibilidad
        const available = await Pedometer.isAvailableAsync();
        setPermissionGranted(available);
        return available;
      }
    } catch (error) {
      console.error('Error verificando permisos:', error);
      setPermissionGranted(false);
      return false;
    }
  };

  // Formatear tiempo en HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  // Calcular velocidad promedio (pasos por minuto)
  const calculatePace = (): number => {
    if (totalSessionTime === 0) return 0;
    return Math.round((steps / totalSessionTime) * 60);
  };

  // Calcular velocidad de caminata (km/h)
  const calculateSpeed = (): number => {
    if (totalSessionTime === 0) return 0;
    const distanceKm = (steps * strideLength) / 1000;
    const timeHours = totalSessionTime / 3600;
    return Number((distanceKm / timeHours).toFixed(1));
  };

  // Iniciar temporizador
  const startTimer = () => {
    if (timerRef.current) return;

    setSessionStartTime(new Date());

    timerRef.current = setInterval(() => {
      setElapsedTime(prev => {
        const newElapsed = prev + 1;
        setTotalSessionTime(newElapsed);
        setDailyTotalTime(dailyTime => dailyTime + 1);
        return newElapsed;
      });
    }, 1000);
  };

  // Detener temporizador
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Resetear temporizador de sesión
  const resetSessionTimer = () => {
    setElapsedTime(0);
    setTotalSessionTime(0);
    setSessionStartTime(null);
  };

  // Verificar si es un nuevo día y resetear automáticamente
  useEffect(() => {
    const checkNewDay = () => {
      const today = new Date().toDateString();
      if (lastResetDate !== today) {
        handleDailyReset();
        setLastResetDate(today);
      }
    };
    checkNewDay();
    const interval = setInterval(checkNewDay, 60000);
    return () => clearInterval(interval);
  }, [lastResetDate]);

  // Actualizar el tiempo transcurrido cada segundo al padre 
  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(elapsedTime);
    }
  }, [elapsedTime]);

  // Verificar disponibilidad del podómetro y permisos
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const available = await Pedometer.isAvailableAsync();
        setPedometerAvailable(available);

        if (available) {
          await checkPermissions();
        }
      } catch (error) {
        console.error('Error al verificar podómetro:', error);
        setPedometerAvailable(false);
        setPermissionGranted(false);
      }
    };

    checkAvailability();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // Verificar permisos cuando la app vuelve al primer plano
        checkPermissions().then(hasPermission => {
          if (hasPermission && isActive) {
            startPedometer();
            startTimer();
          }
        });
      } else if (nextAppState.match(/inactive|background/)) {
        stopPedometer();
        stopTimer();
      }
      appState.current = nextAppState;
    });

    return () => {
      stopPedometer();
      stopTimer();
      subscription.remove();
    };
  }, [isActive]);

  // Limpiar temporizador al desmontar componente
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startPedometer = async () => {
    if (subscriptionRef.current || !pedometerAvailable) return;

    try {
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

  // Función mejorada para manejar el inicio (con solicitud de permisos)
  const handleStart = async () => {
    // Si es la primera vez o no tenemos permisos, solicitarlos
    if (isFirstTime || permissionGranted === false) {
      const granted = await requestActivityPermission();
      if (!granted) {
        return; // No continuar si no se otorgaron permisos
      }
      setPermissionGranted(true);
      setIsFirstTime(false);
    }

    // Verificar permisos una vez más antes de iniciar
    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permisos necesarios',
        'No se puede iniciar el podómetro sin los permisos necesarios.',
        [
          { text: 'OK' }
        ]
      );
      return;
    }

    setIsActive(true);
    startPedometer();
    startTimer();
  };

  const handleStop = () => {
    setIsActive(false);
    stopPedometer();
    stopTimer();
  };

  const handleReset = () => {
    Alert.alert(
      'Reiniciar sesión',
      '¿Estás seguro de que quieres reiniciar el contador de pasos y temporizador de esta sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          onPress: () => {
            stopPedometer();
            stopTimer();
            setSteps(0);
            resetSessionTimer();
            sessionStartSteps.current = 0;
            if (isActive) {
              setTimeout(() => {
                startPedometer();
                startTimer();
              }, 100);
            }
          }
        }
      ]
    );
  };

  const handleDailyReset = () => {
    stopPedometer();
    stopTimer();
    setSteps(0);
    setDailySteps(0);
    resetSessionTimer();
    setDailyTotalTime(0);
    sessionStartSteps.current = 0;
    if (isActive) {
      setTimeout(() => {
        startPedometer();
        startTimer();
      }, 100);
    }
  };

  const calculateDistance = (stepCount: number): number => {
    return (stepCount * strideLength) / 1000;
  };

  const calculateStepsPerKm = (): number => {
    return Math.round(1000 / strideLength);
  };

  const sessionDistance = calculateDistance(steps);
  const dailyDistance = calculateDistance(dailySteps);
  const stepsPerKm = calculateStepsPerKm();
  const currentPace = calculatePace();
  const currentSpeed = calculateSpeed();

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
      {/* Mostrar estado de permisos si no están otorgados */}
      {permissionGranted === false && (
        <View style={styles.permissionWarning}>
          <Text style={styles.permissionText}>
            ⚠️ Se necesitan permisos de actividad física para usar el podómetro.
          </Text>
          <Text style={styles.permissionSubtext}>
            Presiona "Iniciar Podómetro" para otorgar permisos.
          </Text>
        </View>
      )}

      {/* Estado del podómetro */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: isActive ? '#22c55e' : '#ef4444' }]} />
        <Text style={styles.statusText}>
          {isActive ? 'Podómetro Activo' : 'Podómetro Detenido'}
        </Text>
      </View>

      {/* Temporizador principal */}
      <View style={styles.timerSection}>
        <Text style={styles.timerTitle}>Tiempo de Sesión</Text>
        <Text style={styles.timerDisplay}>{formatTime(elapsedTime)}</Text>
        {sessionStartTime && (
          <Text style={styles.startTimeText}>
            Iniciado: {sessionStartTime.toLocaleTimeString()}
          </Text>
        )}
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

        {/* Estadísticas de rendimiento */}
        {totalSessionTime > 0 && (
          <View style={styles.performanceStats}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentPace}</Text>
                <Text style={styles.statLabel}>pasos/min</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentSpeed}</Text>
                <Text style={styles.statLabel}>km/h</Text>
              </View>
            </View>
          </View>
        )}
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

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatTime(dailyTotalTime)}</Text>
            <Text style={styles.statLabel}>Tiempo total</Text>
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
            <TouchableOpacity
              style={[styles.button, styles.startBtn]}
              onPress={handleStart}
            >
              <Text style={styles.buttonText}>
                {isFirstTime || permissionGranted === false ? 'Iniciar y Dar Permisos' : 'Iniciar Podómetro'}
              </Text>
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
            disabled={!isActive && steps === 0 && elapsedTime === 0}
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
  permissionWarning: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f59e0b',
    alignItems: 'center'
  },
  permissionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    textAlign: 'center'
  },
  permissionSubtext: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
    marginTop: 4
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
  timerSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center'
  },
  timerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8
  },
  timerDisplay: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1d4ed8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  startTimeText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4
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
  performanceStats: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginTop: 8
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