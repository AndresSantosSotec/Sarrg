import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles/DashboardScreen.styles';

const { width } = Dimensions.get('window');

// Colores más suaves basados en COOSANJER/MICOOPE
const COLORS = {
  primary: '#2c4f75',      // Azul marino más suave
  secondary: '#4a73a8',    // Azul secundario más claro
  accent: '#6ba3e5',       // Azul claro más suave
  green: '#4a7c59',        // Verde más suave
  lightGreen: '#66bb6a',   // Verde claro más suave
  gold: '#f9c74f',         // Dorado más suave
  white: '#ffffff',
  lightGray: '#f5f6f8',
  mediumGray: '#8897a8',
  darkGray: '#495057',
  shadow: '#000000',
  success: '#52c41a',
  warning: '#faad14',
  danger: '#ff7875',
};

// Función para calcular peso objetivo basado en IMC saludable (21.5)
const calculateTargetWeight = (altura: number) => {
  const alturaMetros = altura / 100;
  const imcObjetivo = 21.5; // IMC ideal en el rango normal (18.5-24.9)
  return Math.round(imcObjetivo * alturaMetros * alturaMetros);
};

// Función para convertir kg a libras
const kgToLbs = (kg: number) => {
  return Math.round(kg * 2.20462);
};

// Función para determinar el estado del IMC
const getIMCStatus = (imc: number) => {
  if (imc < 18.5) return { text: 'Bajo peso', color: COLORS.warning };
  if (imc < 25) return { text: 'Normal', color: COLORS.success };
  if (imc < 30) return { text: 'Sobrepeso', color: COLORS.warning };
  return { text: 'Obesidad', color: COLORS.danger };
};

export default function DashboardScreen() {
  const { collaborator, refreshData, loading, updatePhoto, changePassword } = useContext(AuthContext);
  const { bottom } = useSafeAreaInsets();

  // Estado para la foto
  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Estado para cambio de contraseña
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confPwd, setConfPwd] = useState('');
  const [changing, setChanging] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Picker de galería
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permiso denegado', 'Necesitamos acceso a la galería.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLocalPhotoUri(result.assets[0].uri);
    }
  };

  // Subir la foto usando el contexto
const uploadPhoto = async () => {
  if (!localPhotoUri) {
    return Alert.alert('Selecciona una imagen primero');
  }

  try {
    setUploading(true);
    await updatePhoto(localPhotoUri);   // tu llamada al context
    await refreshData();
    Alert.alert('¡Listo!', 'Foto de perfil actualizada.');
    setLocalPhotoUri(null);
  } catch (err: any) {
    console.error('Error en uploadPhoto:', err);
    // Trata de extraer un mensaje útil de la respuesta HTTP
    const msg =
      err.response?.data?.errors?.photo?.[0] ||  // validación de Laravel
      err.response?.data?.message ||             // mensaje general
      err.message;                               // mensaje JS
    Alert.alert('Error al subir foto', msg);
  } finally {
    setUploading(false);
  }
};

  // Cambiar contraseña
  const onChangePassword = async () => {
    if (newPwd !== confPwd) return Alert.alert('Error', 'Las contraseñas no coinciden');

    try {
      setChanging(true);
      await changePassword(curPwd, newPwd, confPwd);
      Alert.alert('Éxito', 'Contraseña actualizada');
      setCurPwd('');
      setNewPwd('');
      setConfPwd('');
      setShowPasswordForm(false);
    } catch (err: any) {
      const msg = err.response?.data?.errors?.current_password?.[0] || err.response?.data?.message;
      Alert.alert('Error', msg || 'No se pudo cambiar la contraseña');
    } finally {
      setChanging(false);
    }
  };

  if (!collaborator) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="error-outline" size={64} color={COLORS.danger} />
        <Text style={styles.errorText}>
          No estás registrado como colaborador.
        </Text>
        <Text style={styles.errorSubtext}>
          Por favor, contacta al administrador del sistema.
        </Text>
      </View>
    );
  }

  // Cálculos para peso objetivo y conversiones
  const pesoActualKg = parseFloat(collaborator.peso.toString());
  const pesoActualLbs = kgToLbs(pesoActualKg);
  const pesoObjetivoKg = calculateTargetWeight(parseFloat(collaborator.altura.toString()));
  const pesoObjetivoLbs = kgToLbs(pesoObjetivoKg);
  const imcStatus = getIMCStatus(parseFloat(collaborator.indice_masa_corporal.toString()));
  const diferenciaPeso = pesoActualKg - pesoObjetivoKg;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Actualizando datos...</Text>
        </View>
      )}
      {/* Header con disposición mejorada */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary, COLORS.accent]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Contenedor superior para marca y botones */}
        <View style={styles.topHeaderContainer}>
          {/* Sección izquierda - Marca */}
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>COOSANJER</Text>
            <Text style={styles.brandSubtext}>Sistema de Bienestar</Text>
          </View>

          {/* Contenedor para CoinFits y Reload */}
          <View style={styles.rightSection}>
            {/* Sección CoinFits */}
            <TouchableOpacity
              style={styles.coinContainer}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="coins" size={12} color={COLORS.gold} />
              <Text style={styles.coinValue}>{collaborator.coin_fits}</Text>
              <Text style={styles.coinLabel}>CF</Text>
            </TouchableOpacity>

            {/* Sección Reload */}
            <TouchableOpacity
              style={styles.headerRefreshButton}
              onPress={refreshData}
              disabled={loading}
              activeOpacity={0.7}
            >
              <FontAwesome5
                name="sync-alt"
                size={14}
                color={COLORS.white}
                style={loading ? styles.refreshIconLoading : null}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Perfil del usuario */}
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage} disabled={uploading}>
              <Image
                source={{
                  uri: localPhotoUri
                    ? localPhotoUri
                    : (
                      collaborator.photo_url
                        ? `${collaborator.photo_url}?t=${Date.now()}`
                        : 'https://via.placeholder.com/100'
                    ),
                }}
                style={styles.avatar}
              />
              {uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="small" color={COLORS.white} />
                </View>
              )}
            </TouchableOpacity>

            {localPhotoUri && (
              <TouchableOpacity
                style={styles.savePhotoBtn}
                onPress={uploadPhoto}
                disabled={uploading}
              >
                <Text style={styles.savePhotoText}>
                  {uploading ? 'Subiendo...' : 'Guardar foto'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.profileText}>
            <Text style={styles.name}>{collaborator.nombre}</Text>
            <Text style={styles.email}>{collaborator.user.email}</Text>
            <Text style={styles.occupation}>{collaborator.ocupacion}</Text>

            {/* Botón para mostrar formulario de contraseña */}
            <TouchableOpacity
              style={styles.changePasswordBtn}
              onPress={() => setShowPasswordForm(!showPasswordForm)}
            >
              <MaterialIcons name="lock" size={16} color={COLORS.white} />
              <Text style={styles.changePasswordText}>Cambiar contraseña</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Formulario de cambio de contraseña */}
        {showPasswordForm && (
          <View style={styles.passwordForm}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña actual"
              placeholderTextColor={COLORS.mediumGray}
              secureTextEntry
              value={curPwd}
              onChangeText={setCurPwd}
            />
            <TextInput
              style={styles.passwordInput}
              placeholder="Nueva contraseña"
              placeholderTextColor={COLORS.mediumGray}
              secureTextEntry
              value={newPwd}
              onChangeText={setNewPwd}
            />
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirmar nueva contraseña"
              placeholderTextColor={COLORS.mediumGray}
              secureTextEntry
              value={confPwd}
              onChangeText={setConfPwd}
            />

            <View style={styles.passwordButtonsContainer}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setShowPasswordForm(false);
                  setCurPwd('');
                  setNewPwd('');
                  setConfPwd('');
                }}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.savePasswordBtn}
                onPress={onChangePassword}
                disabled={changing || !curPwd || !newPwd || !confPwd}
              >
                <Text style={styles.savePasswordText}>
                  {changing ? 'Cambiando...' : 'Cambiar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: 100 + bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >

        {/* Status Summary Cards - Mejoradas */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.summaryCardPrimary]}>
            <MaterialIcons name="trending-up" size={28} color={COLORS.white} />
            <Text style={styles.summaryTitle}>Nivel Actual</Text>
            <Text style={styles.summaryValue}>{collaborator.nivel_asignado}</Text>
          </View>
          
          {/* Card de IMC mejorada con estado */}
          <View style={[styles.summaryCard, { backgroundColor: imcStatus.color }]}>
            <MaterialIcons name="favorite" size={28} color={COLORS.white} />
            <Text style={styles.summaryTitle}>IMC</Text>
            <Text style={styles.summaryValue}>{collaborator.indice_masa_corporal}</Text>
            <Text style={[styles.summarySubtext, { color: COLORS.white, fontSize: 10 }]}>
              {imcStatus.text}
            </Text>
          </View>

          {/* Nueva card de peso objetivo */}
          <View style={[styles.summaryCard, styles.summaryCardGold]}>
            <MaterialIcons name="track-changes" size={28} color={COLORS.white} />
            <Text style={styles.summaryTitle}>Peso Objetivo</Text>
            <Text style={styles.summaryValue}>{pesoObjetivoKg} kg</Text>
            <Text style={[styles.summarySubtext, { color: COLORS.white, fontSize: 10 }]}>
              {pesoObjetivoLbs} lbs
            </Text>
          </View>
        </View>

        {/* Personal Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={styles.cardIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="person-outline" size={22} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.cardTitle}>Información Personal</Text>
          </View>

          <InfoRow icon="work-outline" iconColor={COLORS.mediumGray} label="Área" value={collaborator.area || 'No especificada'} />
          <InfoRow icon="phone" iconColor={COLORS.mediumGray} label="Teléfono" value={collaborator.telefono || 'No registrado'} />
          <InfoRow icon="home" iconColor={COLORS.mediumGray} label="Dirección" value={collaborator.direccion || 'No registrada'} />
          <InfoRow
            icon="schedule"
            iconColor={COLORS.mediumGray}
            label="Última Actividad"
            value={new Date(collaborator.user.last_login).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          />
        </View>

        {/* Medical Information Card - Mejorada */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <LinearGradient
              colors={[COLORS.green, COLORS.lightGreen]}
              style={styles.cardIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="medical-services" size={22} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.cardTitle}>Información Médica</Text>
          </View>

          <InfoRow icon="straighten" iconColor={COLORS.mediumGray} label="Altura" value={`${collaborator.altura} cm`} />
          
          {/* Peso actual con conversión a libras */}
          <InfoRow 
            icon="monitor-weight" 
            iconColor={COLORS.mediumGray} 
            label="Peso Actual" 
            value={`${pesoActualKg} kg (${pesoActualLbs} lbs)`} 
          />
          
          {/* Peso objetivo */}
          <InfoRow 
            icon="track-changes" 
            iconColor={COLORS.gold} 
            label="Peso Objetivo" 
            value={`${pesoObjetivoKg} kg (${pesoObjetivoLbs} lbs)`}
            isHighlight 
          />

          {/* Diferencia de peso */}
          <InfoRow 
            icon={diferenciaPeso > 0 ? "arrow-downward" : diferenciaPeso < 0 ? "arrow-upward" : "check-circle"} 
            iconColor={diferenciaPeso > 0 ? COLORS.warning : diferenciaPeso < 0 ? COLORS.danger : COLORS.success} 
            label="Diferencia" 
            value={
              diferenciaPeso === 0 
                ? "¡En peso ideal!" 
                : diferenciaPeso > 0 
                  ? `${Math.abs(diferenciaPeso)} kg por perder (${kgToLbs(Math.abs(diferenciaPeso))} lbs)`
                  : `${Math.abs(diferenciaPeso)} kg por ganar (${kgToLbs(Math.abs(diferenciaPeso))} lbs)`
            }
          />
          
          {/* IMC con estado */}
          <InfoRow 
            icon="calculate" 
            iconColor={imcStatus.color} 
            label="IMC" 
            value={`${collaborator.indice_masa_corporal} kg/m² (${imcStatus.text})`} 
            isHighlight 
          />
          
          <InfoRow icon="bloodtype" iconColor={COLORS.danger} label="Tipo Sangre" value={collaborator.tipo_sangre || 'No especificado'} />
        </View>

        {/* Health Alerts Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <LinearGradient
              colors={[COLORS.warning, '#ff9800']}
              style={styles.cardIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="health-and-safety" size={22} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.cardTitle}>Información de Salud</Text>
          </View>

          <InfoRow
            icon="warning"
            iconColor={COLORS.warning}
            label="Alergias"
            value={collaborator.alergias || 'Ninguna registrada'}
          />
          <InfoRow
            icon="healing"
            iconColor={COLORS.danger}
            label="Padecimientos"
            value={collaborator.padecimientos || 'Ninguno registrado'}
          />
        </View>

        {/* Fitness Level Card */}
        <View style={[styles.infoCard, styles.levelCard]}>
          <View style={styles.cardHeader}>
            <LinearGradient
              colors={[COLORS.success, COLORS.lightGreen]}
              style={styles.cardIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="fitness-center" size={22} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.cardTitle}>Plan de Bienestar: {collaborator.nivel_asignado}</Text>
          </View>

          <View style={styles.levelDetails}>
            {collaborator.nivel_asignado === 'HalcónFit' && (
              <>
                <LevelDetail icon="directions-walk" text="10,000 pasos diarios" />
                <LevelDetail icon="timer" text="45 min de actividad" />
                <LevelDetail icon="stars" text="10 CoinFits por día" />
                <LevelDetail icon="emoji-events" text="Nivel avanzado" />
              </>
            )}
            {collaborator.nivel_asignado === 'JaguarFit' && (
              <>
                <LevelDetail icon="directions-walk" text="6,000 pasos diarios" />
                <LevelDetail icon="timer" text="30 min de actividad" />
                <LevelDetail icon="stars" text="5 CoinFits por día" />
                <LevelDetail icon="emoji-events" text="Nivel intermedio" />
              </>
            )}
            {collaborator.nivel_asignado === 'KoalaFit' && (
              <>
                <LevelDetail icon="directions-walk" text="3,000 pasos diarios" />
                <LevelDetail icon="timer" text="20 min de actividad" />
                <LevelDetail icon="stars" text="2 CoinFits por día" />
                <LevelDetail icon="emoji-events" text="Nivel básico" />
              </>
            )}
          </View>
        </View>

        {/* Footer with brand info */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            COOSANJER - Cooperativa de ahorro y Crédito
          </Text>
          <Text style={styles.footerSubtext}>
            Sistema de Bienestar Laboral
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Reusable InfoRow Component with enhanced styling
const InfoRow = ({
  icon,
  iconColor = COLORS.mediumGray,
  label,
  value,
  isHighlight = false
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'],
  iconColor?: string,
  label: string,
  value: string,
  isHighlight?: boolean
}) => (
  <View style={[styles.infoRow, isHighlight && styles.infoRowHighlight]}>
    <View style={styles.iconContainer}>
      <MaterialIcons name={icon} size={22} color={iconColor} />
    </View>
    <View style={styles.labelContainer}>
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <View style={styles.valueContainer}>
      <Text style={[styles.rowValue, isHighlight && styles.rowValueHighlight]}>{value}</Text>
    </View>
  </View>
);

// Reusable LevelDetail Component with icon
const LevelDetail = ({
  icon,
  text
}: {
  icon: React.ComponentProps<typeof MaterialIcons>['name'],
  text: string
}) => (
  <View style={styles.levelDetail}>
    <MaterialIcons name={icon} size={18} color={COLORS.success} />
    <Text style={styles.levelDetailText}>{text}</Text>
  </View>
);