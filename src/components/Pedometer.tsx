import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Alert, AppState, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import * as IntentLauncher from 'expo-intent-launcher';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles/Pedometer.styles';

// Definir la tarea de background
const BACKGROUND_PEDOMETER_TASK = 'background-pedometer-task';

// Registrar la tarea de background con lógica mejorada
TaskManager.defineTask(BACKGROUND_PEDOMETER_TASK, async ({ data, error }) => {
  if (error) {
    console.log('Background task error:', error);
    return;
  }
  try {
    // Actualizar timestamp en AsyncStorage para tracking continuo
    const now = Date.now();
    await AsyncStorage.setItem('lastBackgroundUpdate', now.toString());

    // Mantener el servicio activo
    console.log('Background pedometer task running at:', new Date(now).toLocaleTimeString());
  } catch (error) {
    console.log('Error in background task:', error);
  }
});

interface PedometerProps {
  steps: number;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  onTimeUpdate?: (seconds: number) => void;
}

const PedometerComponent: React.FC<PedometerProps> = ({ steps, setSteps, onTimeUpdate }) => {
  const [pedometerAvailable, setPedometerAvailable] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [goal] = useState(10000);
  const [strideLength] = useState(0.70);
  const [dailySteps, setDailySteps] = useState(0);
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());
  // Estados del temporizador mejorados
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [dailyTotalTime, setDailyTotalTime] = useState(0);
  // Referencias para manejo de tiempo persistente
  const realStartTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef(0);
  const lastSaveTimeRef = useRef(0);
  const progressAnim = useState(new Animated.Value(0))[0];
  const subscriptionRef = useRef<any>(null);
  const appState = useRef(AppState.currentState);
  const lastStepsRef = useRef(0);
  const sessionStartSteps = useRef(0);
  const uiTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Storage keys
  const STORAGE_KEYS = {
    SESSION_START_TIME: 'pedometer_session_start_time',
    ACCUMULATED_TIME: 'pedometer_accumulated_time',
    IS_ACTIVE: 'pedometer_is_active',
    LAST_PAUSE_TIME: 'pedometer_last_pause_time',
    STEPS_COUNT: 'pedometer_steps_count',
    DAILY_STEPS: 'pedometer_daily_steps',
  };

  // Guardar estado en AsyncStorage
  const saveState = async () => {
    try {
      if (realStartTimeRef.current) {
        await AsyncStorage.setItem(STORAGE_KEYS.SESSION_START_TIME, realStartTimeRef.current.toString());
      }
      await AsyncStorage.setItem(STORAGE_KEYS.ACCUMULATED_TIME, accumulatedTimeRef.current.toString());
      await AsyncStorage.setItem(STORAGE_KEYS.IS_ACTIVE, isActive.toString());
      await AsyncStorage.setItem(STORAGE_KEYS.STEPS_COUNT, steps.toString());
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_STEPS, dailySteps.toString());
    } catch (error) {
      console.log('Error saving state:', error);
    }
  };

  // Restaurar estado desde AsyncStorage
  const restoreState = async () => {
    try {
      const savedStartTime = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_START_TIME);
      const savedAccumulatedTime = await AsyncStorage.getItem(STORAGE_KEYS.ACCUMULATED_TIME);
      const savedIsActive = await AsyncStorage.getItem(STORAGE_KEYS.IS_ACTIVE);
      const savedSteps = await AsyncStorage.getItem(STORAGE_KEYS.STEPS_COUNT);
      const savedDailySteps = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_STEPS);

      // 1) SESSION_START_TIME
      if (savedStartTime != null && !isNaN(Number(savedStartTime))) {
        const startNum = Number(savedStartTime);
        realStartTimeRef.current = startNum;
        setSessionStartTime(new Date(startNum));
      }

      // 2) ACCUMULATED_TIME
      if (savedAccumulatedTime != null && !isNaN(Number(savedAccumulatedTime))) {
        accumulatedTimeRef.current = Number(savedAccumulatedTime);
      }

      // 3) IS_ACTIVE
      if (savedIsActive === 'true') {
        setIsActive(true);
        // Recalcular tiempo y reiniciar UI timer
        calculateElapsedTime();
        startUITimer();
        await startPedometer();
        await setupBackgroundFetch();
      }

      // 4) STEPS_COUNT
      if (savedSteps != null && !isNaN(Number(savedSteps))) {
        setSteps(Number(savedSteps));
      }

      // 5) DAILY_STEPS
      if (savedDailySteps != null && !isNaN(Number(savedDailySteps))) {
        setDailySteps(Number(savedDailySteps));
      }
    } catch (error) {
      console.log('Error restoring state:', error);
    }
  };



  // Calcular tiempo transcurrido basado en timestamps reales
  const calculateElapsedTime = () => {
    if (!realStartTimeRef.current || !isActive) return 0;

    const now = Date.now();
    const rawElapsed = Math.floor((now - realStartTimeRef.current) / 1000);
    const totalElapsed = accumulatedTimeRef.current + rawElapsed;

    setElapsedTime(totalElapsed);
    setTotalSessionTime(totalElapsed);

    // Solo actualizar dailyTotalTime si es mayor al actual
    if (totalElapsed > dailyTotalTime) {
      setDailyTotalTime(totalElapsed);
    }

    return totalElapsed;
  };

  // Timer de UI que se actualiza solo cuando la app está activa
  const startUITimer = () => {
    if (uiTimerRef.current) {
      clearInterval(uiTimerRef.current);
    }

    uiTimerRef.current = setInterval(() => {
      if (isActive && realStartTimeRef.current) {
        calculateElapsedTime();
      }
    }, 1000);
  };

  const stopUITimer = () => {
    if (uiTimerRef.current) {
      clearInterval(uiTimerRef.current);
      uiTimerRef.current = null;
    }
  };

  // Configurar background fetch con configuración más robusta
  const setupBackgroundFetch = async () => {
    try {
      const status = await BackgroundFetch.getStatusAsync();
      console.log('Background fetch status:', status);

      if (status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
        status === BackgroundFetch.BackgroundFetchStatus.Denied) {
        Alert.alert(
          'Background App Refresh',
          'Para un mejor funcionamiento, habilita "Background App Refresh" en la configuración de tu dispositivo.'
        );
        return false;
      }

      await BackgroundFetch.registerTaskAsync(BACKGROUND_PEDOMETER_TASK, {
        minimumInterval: Platform.OS === 'android' ? 900 : 15,
        stopOnTerminate: false,
        startOnBoot: false,
      });


      console.log('Background fetch registered successfully');
      return true;
    } catch (error) {
      console.log('Error setting up background fetch:', error);
      return false;
    }
  };

  // Función para solicitar permisos de actividad física
  const requestActivityPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
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
                  IntentLauncher.startActivityAsync(
                    IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
                    { data: 'package:' + 'com.yourapp.package' }
                  );
                }
              }
            ]
          );
          return false;
        }
        return true;
      } else if (Platform.OS === 'ios') {
        try {
          const end = new Date();
          const start = new Date();
          start.setDate(start.getDate() - 1);

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
          return false;
        }
      }
      return true;
    } catch (error) {
      Alert.alert('Error', 'No se pudieron solicitar los permisos necesarios.');
      return false;
    }
  };

  // Función para verificar permisos
  const checkPermissions = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'ios') {
        const end = new Date();
        const start = new Date();
        start.setHours(start.getHours() - 1);

        try {
          await Pedometer.getStepCountAsync(start, end);
          setPermissionGranted(true);
          return true;
        } catch (error: any) {
          if (error.code === 'ERR_PEDOMETER_UNAUTHORIZED') {
            setPermissionGranted(false);
            return false;
          }
          setPermissionGranted(true);
          return true;
        }
      } else {
        const available = await Pedometer.isAvailableAsync();
        setPermissionGranted(available);
        return available;
      }
    } catch (error) {
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

  // useEffect para actualizar el tiempo transcurrido
  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(elapsedTime);
    }
  }, [elapsedTime, onTimeUpdate]);

  // useEffect para guardar estado con menor frecuencia
  useEffect(() => {
    if (isActive) {
      const now = Date.now();
      if (now - lastSaveTimeRef.current >= 5000) {
        saveState();
        lastSaveTimeRef.current = now;
      }
    }
  }, [isActive, steps, dailySteps, elapsedTime]);


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

  // useEffect principal - MEJORADO
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Verificar disponibilidad del podómetro
        const available = await Pedometer.isAvailableAsync();
        setPedometerAvailable(available);

        if (available) {
          // Verificar permisos automáticamente
          await checkPermissions();
          // Restaurar estado previo DESPUÉS de verificar permisos
          await restoreState();
          await setupBackgroundFetch();
        }
      } catch (error) {
        console.log('Error initializing component:', error);
        setPedometerAvailable(false);
        setPermissionGranted(false);
      }
    };

    initializeComponent();

    // Manejo mejorado del AppState
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('App state changed:', appState.current, '->', nextAppState);

      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App vuelve al primer plano
        console.log('App returned to foreground');

        if (isActive && realStartTimeRef.current) {
          // Recalcular tiempo transcurrido
          calculateElapsedTime();
          // Reiniciar timer de UI
          startUITimer();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        // App va al fondo
        console.log('App going to background');

        if (isActive) {
          // Solo detener el timer de UI, NO el tracking de tiempo
          stopUITimer();
          // Guardar estado actual
          saveState();
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);



  // Limpiar recursos al desmontar componente
  useEffect(() => {
    return () => {
      stopUITimer();

      // 1) Quitar listener del podómetro
      if (subscriptionRef.current && typeof subscriptionRef.current.remove === 'function') {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }

      // 2) Desregistrar background task solo si está registrada
      (async () => {
        try {
          const tasks = await TaskManager.getRegisteredTasksAsync();
          const isRegistered = tasks.some(t => t.taskName === BACKGROUND_PEDOMETER_TASK);
          if (isRegistered) {
            await BackgroundFetch.unregisterTaskAsync(BACKGROUND_PEDOMETER_TASK);
          }
        } catch (error) {
          console.log('Error al desregistrar background task en cleanup:', error);
        }
      })();
    };
  }, []);


  // Iniciar podómetro persistente
  const startPedometer = async () => {
    // Si aún no sabemos si el podómetro está disponible, consultarlo ahora
    if (pedometerAvailable === null) {
      try {
        const available = await Pedometer.isAvailableAsync();
        setPedometerAvailable(available);
        if (!available) {
          Alert.alert('Error', 'El podómetro no está disponible en este dispositivo');
          return;
        }
      } catch (error) {
        console.log('Error comprobando disponibilidad del podómetro:', error);
        Alert.alert('Error', 'No se pudo verificar el podómetro');
        return;
      }
    } else if (!pedometerAvailable) {
      Alert.alert('Error', 'El podómetro no está disponible en este dispositivo');
      return;
    }

    // ** NUEVO: si el permiso está rechazado, no intentamos subscribirnos **
    if (permissionGranted === false) {
      Alert.alert(
        'Permiso denegado',
        'Activa Movimiento y Actividad en Configuración para usar el podómetro.'
      );
      return;
    }

    try {
      // En iOS obtenemos pasos pasados para arrancar el conteo
      if (Platform.OS === 'ios') {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        try {
          const pastSteps = await Pedometer.getStepCountAsync(start, end);
          sessionStartSteps.current = pastSteps.steps;
        } catch {
          sessionStartSteps.current = 0;
        }
      } else {
        sessionStartSteps.current = 0;
      }

      // Intentar suscribirse al podómetro dentro de try/catch
      try {
        subscriptionRef.current = Pedometer.watchStepCount(result => {
          setSteps(prevSteps => {
            const newSteps = Platform.OS === 'android'
              ? result.steps
              : Math.max(0, result.steps);
            setDailySteps(sessionStartSteps.current + newSteps);
            return newSteps;
          });
        });
        console.log('Pedometer started successfully');
      } catch (error) {
        console.log('Error iniciando podómetro:', error);
        Alert.alert('Error', 'No se pudo iniciar el podómetro');
      }
    } catch (error) {
      console.log('Error starting pedometer:', error);
      Alert.alert('Error', 'No se pudo iniciar el podómetro');
    }
  };



  const stopPedometer = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
  };

  // Función handleStart – VERSIÓN MEJORADA
  const handleStart = async () => {
    try {
      // 1) Verificar o solicitar permisos (igual que antes)...
      if (permissionGranted === null) {
        const hasPermission = await checkPermissions();
        if (!hasPermission) {
          const granted = await requestActivityPermission();
          if (!granted) return;
          setPermissionGranted(true);
        } else {
          setPermissionGranted(true);
        }
      } else if (permissionGranted === false) {
        const granted = await requestActivityPermission();
        if (!granted) return;
        setPermissionGranted(true);
      }

      // 2) Preparar timestamps
      const now = Date.now();
      realStartTimeRef.current = now;
      setSessionStartTime(new Date(now));
      accumulatedTimeRef.current = 0;

      // 3) Resetear contador de UI y marcar activo
      setElapsedTime(0);
      setTotalSessionTime(0);
      setIsActive(true);

      // 4) Iniciar el temporizador de pantalla YA
      startUITimer();

      // 5) Luego arrancar sensores y background (sin await que bloquee la UI)
      startPedometer();
      setupBackgroundFetch();

      console.log('Pedometer session started at:', new Date(now).toLocaleTimeString());
    } catch (error) {
      console.log('Error starting pedometer session:', error);
      Alert.alert('Error', 'No se pudo iniciar el podómetro');
      setIsActive(false);
    }
  };

  const handleStop = async () => {
    console.log('Stopping pedometer session');

    // 1) Calcula el tiempo final
    if (realStartTimeRef.current) {
      calculateElapsedTime();
    }

    // 2) Detén watcher y temporizador de UI
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    stopUITimer();

    // 3) Marca inactivo y limpia timestamps
    setIsActive(false);
    realStartTimeRef.current = null;
    setSessionStartTime(null);

    // 4) Limpia el storage de la sesión
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.SESSION_START_TIME,
      STORAGE_KEYS.IS_ACTIVE,
      STORAGE_KEYS.LAST_PAUSE_TIME
    ]);

    // 5) Desregistra la tarea de background
    try {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_PEDOMETER_TASK);
    } catch (error) {
      console.log('Error unregistering background task:', error);
    }
  };


  const handleReset = () => {
    Alert.alert(
      'Reiniciar sesión',
      '¿Estás seguro de que quieres reiniciar el contador de pasos y temporizador de esta sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          onPress: async () => {
            const wasActive = isActive;

            // Detener todo primero
            stopPedometer();
            stopUITimer();

            // Resetear estados
            setSteps(0);
            setElapsedTime(0);
            setTotalSessionTime(0);
            sessionStartSteps.current = 0;
            accumulatedTimeRef.current = 0;

            // Limpiar storage
            await AsyncStorage.multiRemove([
              STORAGE_KEYS.SESSION_START_TIME,
              STORAGE_KEYS.ACCUMULATED_TIME,
              STORAGE_KEYS.STEPS_COUNT
            ]);

            // Si estaba activo, reiniciar inmediatamente con nueva configuración
            if (wasActive) {
              const now = Date.now();
              realStartTimeRef.current = now;
              setSessionStartTime(new Date(now));
              accumulatedTimeRef.current = 0;

              await startPedometer();

              // Inicializar tiempo desde 0 y empezar timer
              setElapsedTime(0);
              setTotalSessionTime(0);
              startUITimer();
            } else {
              // Si no estaba activo, limpiar timestamps
              realStartTimeRef.current = null;
              setSessionStartTime(null);
            }
          }
        }
      ]
    );
  };

  const handleDailyReset = async () => {
    stopPedometer();
    stopUITimer();
    setSteps(0);
    setDailySteps(0);
    setElapsedTime(0);
    setTotalSessionTime(0);
    setDailyTotalTime(0);
    sessionStartSteps.current = 0;
    realStartTimeRef.current = null;
    accumulatedTimeRef.current = 0;
    setSessionStartTime(null);

    // Limpiar todo el storage
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));

    if (isActive) {
      setTimeout(async () => {
        const now = Date.now();
        realStartTimeRef.current = now;
        setSessionStartTime(new Date(now));
        accumulatedTimeRef.current = 0;

        await startPedometer();
        // CORREGIR: Inicializar tiempo y luego iniciar timer
        calculateElapsedTime();
        startUITimer();
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
                {permissionGranted === false ? 'Dar Permisos e Iniciar' : 'Iniciar Podómetro'}
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

      {/* Instrucciones mejoradas para background */}
      {isActive && (
        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>💡 Para mejor funcionamiento:</Text>
          <Text style={styles.instructionsText}>
            • Mantén la app en segundo plano (no la cierres completamente)
          </Text>
          <Text style={styles.instructionsText}>
            • Habilita "Background App Refresh" en Configuración
          </Text>
          <Text style={styles.instructionsText}>
            • El podómetro seguirá contando incluso con la pantalla apagada
          </Text>
        </View>
      )}
    </View>
  );
};

export default PedometerComponent;