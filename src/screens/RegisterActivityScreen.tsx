import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert, Image, TextInput, Platform,
  KeyboardAvoidingView, ActivityIndicator, Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import api from '../services/api';

import PedometerComponent from '../components/Pedometer';

export default function RegisterActivityScreen() {
  const [exerciseType, setExerciseType] = useState('Caminata + Trote Básico');
  const [duration, setDuration] = useState('0');
  const [durationUnit, setDurationUnit] = useState('minutos');
  const [intensity, setIntensity] = useState('Media');
  const [calories, setCalories] = useState('0');
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [deviceLocation, setDeviceLocation] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [steps, setSteps] = useState(0);

  // Estados para modales de selección
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showIntensityModal, setShowIntensityModal] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);

  const exerciseOptions = [
    { label: 'Caminata + Trote Básico', value: 'Caminata + Trote Básico', icon: 'directions-walk', color: '#10b981' },
    { label: 'Ciclismo', value: 'Ciclismo', icon: 'directions-bike', color: '#3b82f6' },
    { label: 'Natación', value: 'Natación', icon: 'pool', color: '#06b6d4' },
    { label: 'Yoga', value: 'Yoga', icon: 'self-improvement', color: '#8b5cf6' },
    { label: 'Entrenamiento Fuerza', value: 'Entrenamiento Fuerza', icon: 'fitness-center', color: '#ef4444' },
    { label: 'HIIT', value: 'HIIT', icon: 'flash-on', color: '#f59e0b' },
  ];

  const caloriesPerMin: Record<string, number> = {
    'Caminata + Trote Básico': 8,
    'Ciclismo': 10,
    'Natación': 9,
    'Yoga': 4,
    'Entrenamiento Fuerza': 7,
    'HIIT': 12,
  };

  const intensityOptions = [
    { label: 'Baja', value: 'Baja', color: '#10b981', description: 'Ritmo suave y relajado' },
    { label: 'Media', value: 'Media', color: '#f59e0b', description: 'Ritmo moderado' },
    { label: 'Alta', value: 'Alta', color: '#ef4444', description: 'Ritmo intenso' },
    { label: 'Muy alta', value: 'Muy alta', color: '#dc2626', description: 'Máximo esfuerzo' },
  ];

  const durationUnits = [
    { label: 'minutos', value: 'minutos' },
    { label: 'horas', value: 'horas' }
  ];

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permiso para usar la cámara');
      }
    })();
  }, []);

  useEffect(() => {
    const mins = durationUnit === 'horas' ? parseFloat(duration) * 60 : parseFloat(duration);
    const calculatedCalories = Math.round(mins * (caloriesPerMin[exerciseType] || 0));
    setCalories(String(calculatedCalories));
  }, [exerciseType, duration, durationUnit]);

  const validateForm = () => {
    if (!duration || isNaN(parseFloat(duration)) || parseFloat(duration) <= 0) {
      Alert.alert('Error', 'Por favor ingresa una duración válida mayor a 0');
      return false;
    }
    return true;
  };

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets.length) {
        setSelfieUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la cámara');
    }
  };

  const recordLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permiso de ubicación');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setDeviceLocation(`${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`);
      Alert.alert('✅ Ubicación registrada', 'La ubicación se ha guardado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const form = new FormData();
      form.append('exercise_type', exerciseType);
      form.append('duration', duration);
      form.append('duration_unit', durationUnit);
      form.append('intensity', intensity);
      form.append('calories', calories);
      form.append('notes', notes);
      form.append('steps', steps.toString());

      if (deviceLocation) {
        const [lat, lng] = deviceLocation.split(',').map(s => s.trim());
        form.append('location_lat', lat);
        form.append('location_lng', lng);
      }

      if (selfieUri) {
        const selfieInfo = await FileSystem.getInfoAsync(selfieUri);
        const selfieExt = selfieUri.split('.').pop();
        form.append('selfie', {
          uri: selfieUri,
          name: `selfie.${selfieExt}`,
          type: `image/${selfieExt}`,
        } as any);
      }

      const resp = await api.post('/app/activities', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('🎉 ¡Excelente!', 'Tu actividad se ha registrado correctamente', [
        { text: 'Continuar', onPress: resetForm }
      ]);

    } catch (err: any) {
      console.error('Error al guardar actividad:', err);
      Alert.alert(
        'Error',
        err.response?.data?.message || 'No se pudo guardar la actividad'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setExerciseType('Caminata + Trote Básico');
    setDuration('45');
    setDurationUnit('minutos');
    setIntensity('Media');
    setCalories('0');
    setSelfieUri(null);
    setDeviceLocation(null);
    setNotes('');
    setSteps(0);
  };

  const getExerciseIcon = (type: string) => {
    const exercise = exerciseOptions.find(ex => ex.value === type);
    return exercise ? { icon: exercise.icon, color: exercise.color } : { icon: 'fitness-center', color: '#3b82f6' };
  };

  const getIntensityColor = (level: string) => {
    const intensity = intensityOptions.find(int => int.value === level);
    return intensity ? intensity.color : '#3b82f6';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header mejorado */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <MaterialIcons name="fitness-center" size={24} color="white" />
            <Text style={styles.headerTitle}>Registrar Actividad</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Sección de Detalles de la Actividad (sin calorías) */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="assignment" size={20} color="#3b82f6" />
              <Text style={styles.cardTitle}>Detalles de la Actividad</Text>
            </View>

            {/* Selector de Ejercicio Mejorado */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipo de Ejercicio</Text>
              <TouchableOpacity
                style={styles.customSelector}
                onPress={() => setShowExerciseModal(true)}
                activeOpacity={0.7}
              >
                <View style={styles.selectorContent}>
                  <View style={styles.selectorLeft}>
                    <MaterialIcons
                      name={getExerciseIcon(exerciseType).icon as any}
                      size={24}
                      color={getExerciseIcon(exerciseType).color}
                    />
                    <Text style={styles.selectorText}>{exerciseType}</Text>
                  </View>
                  <MaterialIcons name="keyboard-arrow-down" size={24} color="#64748b" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Duración */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Duración</Text>
              <View style={styles.durationContainer}>
                <TextInput
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="45"
                  keyboardType="numeric"
                  style={[styles.textInput, styles.durationInput]}
                />
                <TouchableOpacity
                  style={styles.unitSelector}
                  onPress={() => setShowDurationModal(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.unitText}>{durationUnit}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Selector de Intensidad Mejorado */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Intensidad</Text>
              <TouchableOpacity
                style={styles.customSelector}
                onPress={() => setShowIntensityModal(true)}
                activeOpacity={0.7}
              >
                <View style={styles.selectorContent}>
                  <View style={styles.selectorLeft}>
                    <View style={[styles.intensityDot, { backgroundColor: getIntensityColor(intensity) }]} />
                    <Text style={styles.selectorText}>{intensity}</Text>
                  </View>
                  <MaterialIcons name="keyboard-arrow-down" size={24} color="#64748b" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Notas */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notas adicionales</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="¿Cómo te sentiste? ¿Alguna observación especial?"
                multiline
                numberOfLines={3}
                style={[styles.textInput, styles.notesInput]}
              />
            </View>
          </View>
          {/* 2. Sección de Ubicación */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="location-on" size={20} color="#3b82f6" />
              <Text style={styles.cardTitle}>Ubicación</Text>
            </View>

            <TouchableOpacity
              style={styles.locationButton}
              onPress={recordLocation}
              activeOpacity={0.8}
            >
              <MaterialIcons name="my-location" size={24} color="#3b82f6" />
              <Text style={styles.locationButtonText}>
                {deviceLocation ? 'Actualizar ubicación' : 'Registrar ubicación actual'}
              </Text>
            </TouchableOpacity>

            {deviceLocation && (
              <View style={styles.locationInfo}>
                <MaterialIcons name="place" size={16} color="#10b981" />
                <Text style={styles.locationText}>{deviceLocation}</Text>
              </View>
            )}
          </View>

          {/* 3. Podómetro */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="directions-walk" size={20} color="#3b82f6" />
              <Text style={styles.cardTitle}>Podómetro</Text>
            </View>
            <PedometerComponent steps={steps} setSteps={setSteps} />
          </View>

          {/* 2. Sección de Calorías (separada) */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="local-fire-department" size={20} color="#f59e0b" />
              <Text style={styles.cardTitle}>Calorías Estimadas</Text>
            </View>

            <View style={styles.caloriesContainer}>
              <View style={styles.caloriesIcon}>
                <MaterialIcons name="local-fire-department" size={32} color="#f59e0b" />
              </View>
              <View>
                <Text style={styles.caloriesLabel}>Calorías quemadas</Text>
                <Text style={styles.caloriesValue}>{calories} kcal</Text>
                <Text style={styles.caloriesSubtext}>Basado en duración e intensidad</Text>
              </View>
            </View>
          </View>

          {/* 5. Sección de Foto */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="photo-camera" size={20} color="#3b82f6" />
              <Text style={styles.cardTitle}>Foto de la Actividad</Text>
            </View>

            <TouchableOpacity style={styles.photoContainer} onPress={openCamera} activeOpacity={0.8}>
              {selfieUri ? (
                <View style={styles.photoWrapper}>
                  <Image source={{ uri: selfieUri }} style={styles.photo} />
                  <View style={styles.photoOverlay}>
                    <MaterialIcons name="edit" size={20} color="white" />
                    <Text style={styles.photoOverlayText}>Cambiar foto</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.photoPlaceholder}>
                  <MaterialIcons name="add-a-photo" size={48} color="#3b82f6" />
                  <Text style={styles.photoPlaceholderText}>Toca para tomar una foto</Text>
                  <Text style={styles.photoPlaceholderSubtext}>Opcional</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* 6. Botón Guardar */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <MaterialIcons name="save" size={24} color="white" />
                <Text style={styles.saveButtonText}>Guardar Actividad</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Modal de Ejercicios */}
        <Modal
          visible={showExerciseModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowExerciseModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Selecciona el Ejercicio</Text>
                <TouchableOpacity onPress={() => setShowExerciseModal(false)}>
                  <MaterialIcons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll}>
                {exerciseOptions.map((exercise) => (
                  <TouchableOpacity
                    key={exercise.value}
                    style={[
                      styles.modalOption,
                      exerciseType === exercise.value && styles.modalOptionSelected
                    ]}
                    onPress={() => {
                      setExerciseType(exercise.value);
                      setShowExerciseModal(false);
                    }}
                  >
                    <MaterialIcons name={exercise.icon as keyof typeof MaterialIcons.glyphMap} size={24} color={exercise.color} />
                    <Text style={[
                      styles.modalOptionText,
                      exerciseType === exercise.value && styles.modalOptionTextSelected
                    ]}>
                      {exercise.label}
                    </Text>
                    {exerciseType === exercise.value && (
                      <MaterialIcons name="check" size={20} color="#3b82f6" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal de Intensidad */}
        <Modal
          visible={showIntensityModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowIntensityModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Selecciona la Intensidad</Text>
                <TouchableOpacity onPress={() => setShowIntensityModal(false)}>
                  <MaterialIcons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll}>
                {intensityOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.modalOption,
                      intensity === option.value && styles.modalOptionSelected
                    ]}
                    onPress={() => {
                      setIntensity(option.value);
                      setShowIntensityModal(false);
                    }}
                  >
                    <View style={[styles.intensityDot, { backgroundColor: option.color }]} />
                    <View style={styles.intensityInfo}>
                      <Text style={[
                        styles.modalOptionText,
                        intensity === option.value && styles.modalOptionTextSelected
                      ]}>
                        {option.label}
                      </Text>
                      <Text style={styles.intensityDescription}>{option.description}</Text>
                    </View>
                    {intensity === option.value && (
                      <MaterialIcons name="check" size={20} color="#3b82f6" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Modal de Unidad de Duración */}
        <Modal
          visible={showDurationModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowDurationModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Unidad de Tiempo</Text>
                <TouchableOpacity onPress={() => setShowDurationModal(false)}>
                  <MaterialIcons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>
              {durationUnits.map((unit) => (
                <TouchableOpacity
                  key={unit.value}
                  style={[
                    styles.modalOption,
                    durationUnit === unit.value && styles.modalOptionSelected
                  ]}
                  onPress={() => {
                    setDurationUnit(unit.value);
                    setShowDurationModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    durationUnit === unit.value && styles.modalOptionTextSelected
                  ]}>
                    {unit.label}
                  </Text>
                  {durationUnit === unit.value && (
                    <MaterialIcons name="check" size={20} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  header: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8
      },
      android: {
        elevation: 4
      }
    })
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
  scroll: {
    padding: 16,
    paddingBottom: 150
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoWrapper: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoOverlayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  photoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#475569',
    marginTop: 12,
    textAlign: 'center',
  },
  photoPlaceholderSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  customSelector: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorText: {
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
    fontWeight: '500',
  },
  intensityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
    color: '#1e293b',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  durationInput: {
    flex: 2,
    textAlign: 'center',
  },
  unitSelector: {
    flex: 3,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unitText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  caloriesIcon: {
    marginRight: 12,
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '500',
  },
  caloriesValue: {
    fontSize: 20,
    color: '#92400e',
    fontWeight: '700',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  locationButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
    marginLeft: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#166534',
    marginLeft: 6,
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  saveButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalScroll: {
    paddingHorizontal: 24,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 4,
  },
  modalOptionSelected: {
    backgroundColor: '#eff6ff',
  },
  intensityInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  intensityDescription: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  caloriesSubtext: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
  },
  modalOptionTextSelected: {
    color: '#3b82f6',
    fontWeight: '700',
  },
});