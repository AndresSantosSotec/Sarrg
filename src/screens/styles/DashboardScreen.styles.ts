import { StyleSheet, Platform } from 'react-native';

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

export const styles = StyleSheet.create({
  // === CONTENEDORES PRINCIPALES ===
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    padding: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  // === HEADER STYLES ===
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
  topHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    minHeight: 80,
  },

  // === BRAND SECTION ===
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

  // === PROFILE SECTION ===
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
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

  // === BUTTONS ===
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
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  // === PASSWORD FORM ===
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

  // === COIN SECTION ===
  coinInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    minWidth: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    gap: 8,
  },
  coinIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinTextWrapper: {
    alignItems: 'center',
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

  // === SUMMARY CARDS (UPDATED FOR FLEXIBILITY) ===
  // Contenedor para 2 tarjetas grandes
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  // Contenedor para 3 tarjetas pequeñas
  summaryContainerThree: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  // Tarjeta base para 2 tarjetas
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
  // Tarjeta pequeña para 3 tarjetas
  summaryCardThree: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 3,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  // Variantes de color
  summaryCardPrimary: {
    backgroundColor: COLORS.primary,
  },
  summaryCardSecondary: {
    backgroundColor: COLORS.secondary,
  },
  summaryCardGreen: {
    backgroundColor: COLORS.green,
  },
  summaryCardGold: {
    backgroundColor: COLORS.gold,
  },
  // Texto de las tarjetas
  summaryTitle: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 3,
    lineHeight: 15,
    textAlign: 'center',
  },
  summaryTitleSmall: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'center',
  },
  summaryValueSmall: {
    fontSize: 15,
    color: COLORS.white,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  summarySubtext: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },

  // === INFO CARDS ===
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
  teamLink: {
    color: COLORS.success,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // === INFO ROWS ===
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

  // === RULES LIST ===
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ruleIcon: {
    marginRight: 8,
    marginTop: 2,
  },

  // === LEVEL CARD ===
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

  // === FOOTER ===
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

  // === ERROR STATES ===
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

  // === LOADING STATES ===
  refreshIconLoading: {
    transform: [{ rotate: '360deg' }],
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

// Exportar colores para uso en otros componentes
export { COLORS };