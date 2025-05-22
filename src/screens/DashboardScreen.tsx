import React, { useContext } from 'react';
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
} from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
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
  const { collaborator, refreshData, loading } = useContext(AuthContext);
  const { bottom } = useSafeAreaInsets();

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
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>COOSANJER</Text>
            <Text style={styles.brandSubtext}>Sistema de Bienestar</Text>
          </View>

          <View style={styles.headerButtonsContainer}>
            <TouchableOpacity
              style={styles.coinContainer}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="coins" size={18} color={COLORS.gold} />
              <Text style={styles.coinValue}>{collaborator.coin_fits}</Text>
              <Text style={styles.coinLabel}>CoinFits</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerRefreshButton}
              onPress={refreshData}
              disabled={loading}
              activeOpacity={0.7}
            >
              <FontAwesome5
                name="sync-alt"
                size={18}
                color={COLORS.white}
                style={loading ? styles.refreshIconLoading : null}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Perfil del usuario */}
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: collaborator.photo_url || 'https://via.placeholder.com/100',
            }}
            style={styles.avatar}
          />
          <View style={styles.profileText}>
            <Text style={styles.name}>{collaborator.nombre}</Text>
            <Text style={styles.email}>{collaborator.user.email}</Text>
            <Text style={styles.occupation}>{collaborator.ocupacion}</Text>
          </View>
        </View>
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
  topHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    position: 'relative',
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
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    marginRight: 14,
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
  coinContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 14,
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  coinValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: 3,
    lineHeight: 18,
  },
  coinLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    lineHeight: 13,
  },
  headerRefreshButton: {
    position: 'absolute',
    top: 70,
    right: 110,
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