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
      // 1) Sube la foto al servidor y refresca internamente el contexto
      await updatePhoto(localPhotoUri);
      // 2) REFRESCA el contexto por si acaso (no hace daño si ya lo hizo updatePhoto)
      await refreshData();

      Alert.alert('¡Listo!', 'Foto de perfil actualizada.');
      setLocalPhotoUri(null);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la foto.');
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

        {/* Status Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.summaryCardPrimary]}>
            <MaterialIcons name="trending-up" size={28} color={COLORS.white} />
            <Text style={styles.summaryTitle}>Nivel Actual</Text>
            <Text style={styles.summaryValue}>{collaborator.nivel_asignado}</Text>
          </View>
          <View style={[styles.summaryCard, styles.summaryCardGreen]}>
            <MaterialIcons name="favorite" size={28} color={COLORS.white} />
            <Text style={styles.summaryTitle}>IMC</Text>
            <Text style={styles.summaryValue}>{collaborator.indice_masa_corporal}</Text>
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

        {/* Medical Information Card */}
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
          <InfoRow icon="monitor-weight" iconColor={COLORS.mediumGray} label="Peso" value={`${collaborator.peso} kg`} />
          <InfoRow icon="calculate" iconColor={COLORS.accent} label="IMC" value={`${collaborator.indice_masa_corporal} kg/m²`} isHighlight />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  coinInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Espacio entre elementos
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    minHeight: 80,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.white,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 6,
    lineHeight: 22,
  },
  errorSubtext: {
    color: COLORS.mediumGray,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  brandContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 1,
  },
  brandSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginTop: 2,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  // Estilos nuevos para el avatar y foto
  avatarContainer: {
    alignItems: 'center',
    marginRight: 14,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savePhotoBtn: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 8,
  },
  savePhotoText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  profileText: {
    flex: 1,
    paddingRight: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 3,
    lineHeight: 22,
  },
  email: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
    lineHeight: 16,
  },
  occupation: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    lineHeight: 16,
  },
  // Estilos nuevos para el botón de cambiar contraseña
  changePasswordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 8,
  },
  changePasswordText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  // Estilos para el formulario de contraseña
  passwordForm: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  passwordInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 14,
    color: COLORS.darkGray,
  },
  passwordButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 0.45,
  },
  cancelBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  savePasswordBtn: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 0.45,
  },
  savePasswordText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  coinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    minWidth: 70,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  coinIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  coinValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: 2,
    lineHeight: 18,
  },
  coinLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    lineHeight: 13,
  },
  headerRefreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  scrollContainer: {
    padding: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryCardPrimary: {
    backgroundColor: COLORS.primary,
  },
  summaryCardGreen: {
    backgroundColor: COLORS.green,
  },
  summaryTitle: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 3,
    lineHeight: 15,
  },
  summaryValue: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '700',
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    flex: 1,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  infoRowHighlight: {
    backgroundColor: '#f8f9ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
  },
  iconContainer: {
    width: 28,
    alignItems: 'center',
    marginRight: 10,
  },
  labelContainer: {
    flex: 1.2,
    marginRight: 10,
  },
  valueContainer: {
    flex: 1.3,
  },
  rowLabel: {
    fontSize: 13,
    color: COLORS.mediumGray,
    fontWeight: '500',
    lineHeight: 16,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.darkGray,
    textAlign: 'right',
    lineHeight: 16,
  },
  rowValueHighlight: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  levelCard: {
    backgroundColor: '#f0f8f0',
    borderWidth: 2,
    borderColor: COLORS.lightGreen,
  },
  levelDetails: {
    marginTop: 12,
  },
  levelDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  levelDetailText: {
    fontSize: 13,
    color: COLORS.darkGray,
    marginLeft: 10,
    fontWeight: '500',
    flex: 1,
    lineHeight: 16,
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerSubtext: {
    fontSize: 12,
    color: COLORS.mediumGray,
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 15,
  },
  refreshIconLoading: {
    transform: [{ rotate: '360deg' }],
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
});