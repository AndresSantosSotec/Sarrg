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
import { styles } from './styles/RegisterActivityScreen.styles';

export default function RegisterActivityScreen() {
  const [exerciseType, setExerciseType] = useState('Caminata');
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

  const [searchTerm, setSearchTerm] = useState('');

  const exerciseOptions = [
    { label: 'Caminata', value: 'Caminata', icon: 'directions-walk', color: '#10b981' },
    { label: 'Trote Básico', value: 'Trote Básico', icon: 'directions-run', color: '#047857' },
    { label: 'Pausas Activas', value: 'Pausas Activas', icon: 'self-improvement', color: '#fbbf24' },
    { label: 'Fútbol', value: 'Fútbol', icon: 'sports-soccer', color: '#22c55e' },
    { label: 'Ciclismo', value: 'Ciclismo', icon: 'directions-bike', color: '#3b82f6' },
    { label: 'Natación', value: 'Natación', icon: 'pool', color: '#06b6d4' },
    { label: 'Yoga', value: 'Yoga', icon: 'self-improvement', color: '#8b5cf6' },
    { label: 'Entrenamiento de Fuerza', value: 'Entrenamiento de Fuerza', icon: 'fitness-center', color: '#ef4444' },
    { label: 'HIIT', value: 'HIIT', icon: 'flash-on', color: '#f59e0b' },
    { label: 'Pilates', value: 'Pilates', icon: 'accessibility-new', color: '#db2777' },
    { label: 'Aeróbicos', value: 'Aeróbicos', icon: 'airline-seat-recline-normal', color: '#8b5cf6' },
    { label: 'Danza', value: 'Danza', icon: 'music-note', color: '#ec4899' },
    { label: 'Zumba', value: 'Zumba', icon: 'music-note', color: '#f97316' },
    { label: 'Saltar la cuerda', value: 'Saltar la cuerda', icon: 'replay', color: '#f43f5e' },
    { label: 'Remo', value: 'Remo', icon: 'rowing', color: '#0284c7' },
    { label: 'Elíptica', value: 'Elíptica', icon: 'fitness-center', color: '#2563eb' },
    { label: 'Senderismo', value: 'Senderismo', icon: 'terrain', color: '#4ade80' },
    { label: 'Escalada', value: 'Escalada', icon: 'terrain', color: '#22c55e' },
    { label: 'Boxeo', value: 'Boxeo', icon: 'sports-mma', color: '#dc2626' },
    { label: 'Artes Marciales', value: 'Artes Marciales', icon: 'sports-karate', color: '#7c3aed' },
    { label: 'Tai Chi', value: 'Tai Chi', icon: 'self-improvement', color: '#4ade80' },
    { label: 'Estiramiento', value: 'Estiramiento', icon: 'accessibility-new', color: '#a3e635' },
    { label: 'CrossFit', value: 'CrossFit', icon: 'fitness-center', color: '#f97316' },
    { label: 'Spinning', value: 'Spinning', icon: 'directions-bike', color: '#6366f1' },
    { label: 'Kickboxing', value: 'Kickboxing', icon: 'sports-kabaddi', color: '#ef4444' },
    { label: 'Barre', value: 'Barre', icon: 'accessibility', color: '#ec4899' },
    { label: 'Peso Corporal', value: 'Peso Corporal', icon: 'fitness-center', color: '#f87171' },
    { label: 'Kettlebell', value: 'Kettlebell', icon: 'fitness-center', color: '#fbbf24' },
    { label: 'TRX', value: 'TRX', icon: 'fitness-center', color: '#8b5cf6' },
    { label: 'Bandas de Resistencia', value: 'Bandas de Resistencia', icon: 'fitness-center', color: '#10b981' },
    { label: 'Subir Escaleras', value: 'Subir Escaleras', icon: 'stairs', color: '#6b7280' },
    { label: 'Esquí', value: 'Esquí', icon: 'downhill-skiing', color: '#0284c7' },
    { label: 'Snowboard', value: 'Snowboard', icon: 'snowboarding', color: '#0ea5e9' },
    { label: 'Surf', value: 'Surf', icon: 'surfing', color: '#3b82f6' },
    { label: 'Patinaje', value: 'Patinaje', icon: 'roller-skate', color: '#f472b6' },
    { label: 'Equitación', value: 'Equitación', icon: 'emoji-nature', color: '#4ade80' },
    { label: 'Canotaje', value: 'Canotaje', icon: 'kayaking', color: '#06b6d4' },
    { label: 'Kayak', value: 'Kayak', icon: 'kayaking', color: '#0ea5e9' },
    { label: 'Patinaje en línea', value: 'Patinaje en línea', icon: 'roller-skate', color: '#f43f5e' },
    { label: 'Parkour', value: 'Parkour', icon: 'directions-run', color: '#f59e0b' },
    { label: 'Entrenamiento en Circuito', value: 'Entrenamiento en Circuito', icon: 'fitness-center', color: '#6366f1' },
  ];

  const caloriesPerMin: Record<string, number> = {
    'Caminata': 5,
    'Fútbol': 10,
    'Pausas Activas': 3,
    'Trote Básico': 8,
    'Ciclismo': 10,
    'Natación': 9,
    'Yoga': 4,
    'Entrenamiento de Fuerza': 7,
    'HIIT': 12,
    'Pilates': 3,
    'Baile Aeróbico': 6,
    'Zumba': 7,
    'Spinning': 10,
    'Remo': 9,
    'Escalada': 8,
    'Boxeo': 11,
    'Kickboxing': 11,
    'CrossFit': 12,
    'Correr en cinta': 9,
    'Escaladora': 8,
    'Saltar la cuerda': 13,
    'Step': 7,
    'Entrenamiento Funcional': 9,
    'Caminar Colina': 6,
    'Senderismo': 6,
    'Trail Running': 9,
    'Patinaje': 7,
    'Skateboard': 6,
    'Kayak': 5,
    'Stand Up Paddle': 5,
    'Surf': 6,
    'Snowboard': 4,
    'Esquí': 7,
    'Golf': 3,
    'Tenis': 7,
    'Squash': 8,
    'Ping Pong': 4,
    'Baloncesto': 8,
    'Voleibol': 6,
    'Natación con Aletas': 10,
    'Aquaeróbic': 6,
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
  // Convierte sessionTime (segundos) a minutos cada vez que cambia



  useEffect(() => {
    (async () => {
      const cam = await ImagePicker.requestCameraPermissionsAsync();
      const gal = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cam.status !== 'granted' || gal.status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a cámara y galería');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets.length) {
        setSelfieUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la galería');
    }
  };



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
      const isServicesEnabled = await Location.hasServicesEnabledAsync();
      console.log('Servicios de ubicación habilitados:', isServicesEnabled);
      if (!isServicesEnabled) {
        Alert.alert('Ubicación desactivada', 'Por favor activa los servicios de ubicación en tu dispositivo.');
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permiso de ubicación');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setDeviceLocation(`${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`);
      Alert.alert('✅ Ubicación registrada', 'La ubicación se ha guardado correctamente');
    } catch (error: any) {
      console.error('Error al obtener ubicación:', JSON.stringify(error, null, 2));
      Alert.alert('Error', 'No se pudo obtener la ubicación. Asegúrate de tener activado el GPS y haber dado los permisos.');
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
    setExerciseType('Caminata');
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
              <Text style={styles.inputLabel}>Objetivo a alcazar</Text>
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
            <PedometerComponent
              steps={steps}
              setSteps={setSteps}
            />
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
          {/* … dentro de tu render … */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="photo-camera" size={20} color="#3b82f6" />
              <Text style={styles.cardTitle}>Foto de la Actividad</Text>
            </View>

            {selfieUri ? (
              <View style={styles.photoWrapper}>
                <Image source={{ uri: selfieUri }} style={styles.photo} />
                <View style={styles.photoOverlay}>
                  {/* Botón para quitar */}
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => setSelfieUri(null)}
                  >
                    <MaterialIcons name="close" size={20} color="white" />
                  </TouchableOpacity>
                  {/* Botón para cambiar */}
                  <TouchableOpacity
                    style={styles.changeBtn}
                    onPress={openCamera}
                  >
                    <MaterialIcons name="edit" size={20} color="white" />
                    <Text style={styles.changeBtnText}>Cambiar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <MaterialIcons name="add-a-photo" size={48} color="#3b82f6" />
                <Text style={styles.photoPlaceholderText}>Foto opcional</Text>
              </View>
            )}

            <View style={styles.photoButtonsContainer}>
              <TouchableOpacity style={styles.photoBtn} onPress={openCamera}>
                <MaterialIcons name="camera-alt" size={20} color="white" />
                <Text style={styles.photoBtnText}>Tomar foto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
                <MaterialIcons name="photo-library" size={20} color="white" />
                <Text style={styles.photoBtnText}>Galería</Text>
              </TouchableOpacity>
            </View>
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

              {/* INPUT DE BÚSQUEDA */}
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar ejercicio..."
                value={searchTerm}
                onChangeText={setSearchTerm}
              />

              <ScrollView style={styles.modalScroll}>
                {exerciseOptions
                  .filter(opt =>
                    opt.label.toLowerCase().includes(searchTerm.trim().toLowerCase())
                  )
                  .map(exercise => (
                    <TouchableOpacity
                      key={exercise.value}
                      style={[
                        styles.modalOption,
                        exerciseType === exercise.value && styles.modalOptionSelected
                      ]}
                      onPress={() => {
                        setExerciseType(exercise.value);
                        setShowExerciseModal(false);
                        setSearchTerm('');  // limpia búsqueda al seleccionar
                      }}
                    >
                      <MaterialIcons
                        name={exercise.icon as keyof typeof MaterialIcons.glyphMap}
                        size={24}
                        color={exercise.color}
                      />
                      <Text
                        style={[
                          styles.modalOptionText,
                          exerciseType === exercise.value && styles.modalOptionTextSelected
                        ]}
                      >
                        {exercise.label}
                      </Text>
                      {exerciseType === exercise.value && (
                        <MaterialIcons name="check" size={20} color="#3b82f6" />
                      )}
                    </TouchableOpacity>
                  ))
                }
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
