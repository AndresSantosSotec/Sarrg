import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert, Image, TextInput, Platform,
  KeyboardAvoidingView, ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import api from '../services/api';

import PedometerComponent from '../components/Pedometer';

export default function RegisterActivityScreen() {
  const [exerciseType, setExerciseType] = useState('Caminata + Trote Básico');
  const [duration, setDuration] = useState('45');
  const [durationUnit, setDurationUnit] = useState('minutos');
  const [intensity, setIntensity] = useState('Media');
  const [calories, setCalories] = useState('0');
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [deviceUri, setDeviceUri] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [deviceLocation, setDeviceLocation] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [steps, setSteps] = useState(0);

  const caloriesPerMin: Record<string, number> = {
    'Caminata + Trote Básico': 8,
    Ciclismo: 10,
    Natación: 9,
    Yoga: 4,
    'Entrenamiento Fuerza': 7,
    HIIT: 12,
  };

  const intensityOptions = ['Baja', 'Media', 'Alta', 'Muy alta'];
  const durationUnits = ['minutos', 'horas'];

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
    setCalories(String(Math.round(mins * (caloriesPerMin[exerciseType] || 0))));
  }, [exerciseType, duration, durationUnit]);

  const validateForm = () => {
    if (!duration || isNaN(parseFloat(duration))) {
      Alert.alert('Error', 'Por favor ingresa una duración válida');
      return false;
    }
    if (!selfieUri) {
      Alert.alert('Atención', '¿Deseas continuar sin tomar una selfie?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: () => handleSave(true) }
      ]);
      return false;
    }
    return true;
  };

  const openCamera = async (forSelfie: boolean) => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.canceled && result.assets.length) {
        const uri = result.assets[0].uri;
        forSelfie ? setSelfieUri(uri) : setDeviceUri(uri);
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir la cámara');
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });
      if (res.assets && res.assets.length > 0) {
        setFiles(f => [...f, res.assets[0].uri]);
        Alert.alert('Archivo agregado', 'El archivo se ha añadido correctamente');
      }
    } catch {
      Alert.alert('Error', 'No se pudo acceder a archivos');
    }
  };

  const recordLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permiso de ubicación');
      return;
    }
    try {
      const loc = await Location.getCurrentPositionAsync({});
      setDeviceLocation(`${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`);
      Alert.alert('Ubicación registrada', 'La ubicación se ha guardado correctamente');
    } catch {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    }
  };

  const handleSave = async (forceSave = false) => {
    if (!forceSave && !validateForm()) return;

    setIsSaving(true);

    try {
      // 1. Construir FormData
      const form = new FormData();
      form.append('exercise_type', exerciseType);
      form.append('duration', duration);
      form.append('duration_unit', durationUnit);
      form.append('intensity', intensity);
      form.append('calories', calories);
      form.append('notes', notes);

      if (deviceLocation) {
        const [lat, lng] = deviceLocation.split(',').map(s => s.trim());
        form.append('location_lat', lat);
        form.append('location_lng', lng);
      }

      // 2. Adjuntar la selfie si existe
      if (selfieUri) {
        const selfieInfo = await FileSystem.getInfoAsync(selfieUri);
        const selfieExt = selfieUri.split('.').pop();
        form.append('selfie', {
          uri: selfieUri,
          name: `selfie.${selfieExt}`,
          type: `image/${selfieExt}`,
        } as any);
      }

      // 3. Adjuntar la foto de dispositivo si existe
      if (deviceUri) {
        const devExt = deviceUri.split('.').pop();
        form.append('device_image', {
          uri: deviceUri,
          name: `device.${devExt}`,
          type: `image/${devExt}`,
        } as any);
      }

      // 4. Adjuntar otros archivos
      files.forEach((uri, idx) => {
        const ext = uri.split('.').pop();
        form.append('attachments[]', {
          uri,
          name: `file_${idx}.${ext}`,
          type: `image/${ext}` || `application/pdf`,
        } as any);
      });

      // 5. Llamada a la API
      const resp = await api.post('/app/activities', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 6. Éxito
      Alert.alert('¡Listo!', 'Actividad registrada correctamente.');
      console.log('Actividad:', resp.data.activity);

      // Limpiar el formulario después del éxito
      resetForm();

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
    setDeviceUri(null);
    setFiles([]);
    setDeviceLocation(null);
    setNotes('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>REGISTRAR ACTIVIDAD</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Fotos y Dispositivo */}
          <Section title="Fotos & Dispositivo" icon="camera">
            <View style={styles.row}>
              <Box
                onPress={() => openCamera(true)}
                uri={selfieUri}
                label="SELFIE"
                icon="face"
              />
              <View style={styles.deviceBox}>
                <Box
                  onPress={() => openCamera(false)}
                  uri={deviceUri}
                  label="DISPOSITIVO"
                  icon="fitness-center"
                />
                <View style={styles.deviceActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={pickDocument}
                  >
                    <MaterialIcons name="attach-file" size={24} color="#3b82f6" />
                    <Text style={styles.actionText}>Archivo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={recordLocation}
                  >
                    <FontAwesome name="map-marker" size={24} color="#3b82f6" />
                    <Text style={styles.actionText}>Ubicación</Text>
                  </TouchableOpacity>
                </View>
                {deviceLocation && (
                  <View style={styles.locationContainer}>
                    <Ionicons name="location-sharp" size={16} color="#3b82f6" />
                    <Text style={styles.locationText}>{deviceLocation}</Text>
                  </View>
                )}
              </View>
            </View>
          </Section>

          {/* Detalles */}
          <Section title="Detalles de la Actividad" icon="list">
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipo de Ejercicio</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={exerciseType}
                  onValueChange={setExerciseType}
                  mode="dropdown"
                  dropdownIconColor="#3b82f6"
                >
                  <Picker.Item label="Caminata + Trote Básico" value="Caminata + Trote Básico" />
                  <Picker.Item label="Ciclismo" value="Ciclismo" />
                  <Picker.Item label="Natación" value="Natación" />
                  <Picker.Item label="Yoga" value="Yoga" />
                  <Picker.Item label="Entrenamiento Fuerza" value="Entrenamiento Fuerza" />
                  <Picker.Item label="HIIT" value="HIIT" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Duración</Text>
              <View style={styles.durationContainer}>
                <TextInput
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="Ej: 45"
                  keyboardType="numeric"
                  style={[styles.textInput, { flex: 2 }]}
                />
                <View style={[styles.pickerContainer, { flex: 3, marginLeft: 10 }]}>
                  <Picker
                    selectedValue={durationUnit}
                    onValueChange={setDurationUnit}
                    mode="dropdown"
                    dropdownIconColor="#3b82f6"
                  >
                    {durationUnits.map(unit => (
                      <Picker.Item key={unit} label={unit} value={unit} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Intensidad</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={intensity}
                  onValueChange={setIntensity}
                  mode="dropdown"
                  dropdownIconColor="#3b82f6"
                >
                  {intensityOptions.map(level => (
                    <Picker.Item key={level} label={level} value={level} />
                  ))}
                </Picker>
              </View>
            </View>

            <ReadOnly label="Calorías estimadas" value={`${calories} kcal`} />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notas adicionales</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Agrega cualquier observación sobre tu actividad"
                multiline
                numberOfLines={3}
                style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
              />
            </View>
          </Section>

          <Section title="Podómetro" icon="directions-walk">
            <PedometerComponent steps={steps} setSteps={setSteps} />
          </Section>

          {/* Botón Guardar en una tarjeta */}
          <Section title="" icon="">
            <TouchableOpacity
              style={[styles.btnPrimary, isSaving && styles.btnDisabled]}
              onPress={() => handleSave(false)}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialIcons name="save" size={20} color="white" />
                  <Text style={styles.btnPrimaryText}>Guardar Actividad</Text>
                </>
              )}
            </TouchableOpacity>
          </Section>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Componentes auxiliares
function Box({ onPress, uri, label, icon }: {
  onPress: () => void;
  uri: string | null;
  label: string;
  icon: any;
}) {
  return (
    <TouchableOpacity style={styles.box} onPress={onPress}>
      {uri ? (
        <Image source={{ uri }} style={styles.boxImage} />
      ) : (
        <View style={styles.boxPlaceholderContainer}>
          <MaterialIcons name={icon} size={32} color="white" />
          <Text style={styles.boxPlaceholder}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function Section({ title, children, icon }: {
  title: string;
  children: React.ReactNode;
  icon?: any;
}) {
  return (
    <View style={styles.section}>
      {title ? (
        <View style={styles.sectionHeader}>
          {icon && <MaterialIcons name={icon} size={20} color="#3b82f6" style={styles.sectionIcon} />}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      ) : null}
      {children}
    </View>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.readOnly}>
        <Text style={styles.readOnlyText}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  header: {
    height: 60,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4
      },
      android: {
        elevation: 4
      }
    })
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1
  },
  scroll: {
    padding: 16,
    paddingBottom: 100
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  box: {
    width: '48%',
    height: 140,
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#dbeafe',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3
      },
      android: {
        elevation: 2
      }
    })
  },
  boxPlaceholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxPlaceholder: {
    color: '#3b82f6',
    fontWeight: '600',
    marginTop: 8,
  },
  boxImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12
  },
  deviceBox: {
    width: '48%'
  },
  deviceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  actionText: {
    marginLeft: 6,
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 6,
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#0ea5e9',
    flexShrink: 1,
  },
  inputGroup: {
    marginBottom: 16
  },
  inputLabel: {
    marginBottom: 8,
    fontWeight: '500',
    color: '#334155',
    fontSize: 14
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 15,
    color: '#1e293b',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden'
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readOnly: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  readOnlyText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 15,
  },
  btnPrimary: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnDisabled: {
    backgroundColor: '#93c5fd',
  },
  btnPrimaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});