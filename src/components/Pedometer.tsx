import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Animated } from 'react-native';

interface PedometerProps {
  steps: number;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
}

const Pedometer: React.FC<PedometerProps> = ({ steps, setSteps }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [goal] = useState(10000);
  const progressAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSteps(prev => {
          const newSteps = prev + Math.floor(Math.random() * 11 + 5);
          return newSteps;
        });
      }, 1500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, setSteps]);

  useEffect(() => {
    const progress = Math.min(steps / goal, 1);
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [steps]);

  const handleReset = () => {
    setSteps(0);
    setIsRunning(false);
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
          onPress={() => setIsRunning(prev => !prev)}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Detener' : 'Iniciar'} conteo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.resetBtn]} onPress={handleReset}>
          <Text style={styles.buttonText}>Reiniciar pasos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Pedometer;
const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  goalText: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBar: {
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ade80',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  startBtn: {
    backgroundColor: '#3b82f6',
  },
  stopBtn: {
    backgroundColor: '#ef4444',
  },
  resetBtn: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

