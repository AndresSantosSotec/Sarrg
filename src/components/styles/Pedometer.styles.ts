import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
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
  // --- Nuevas propiedades para evitar errores TS ---
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12
  },
  pauseBtn: {
    backgroundColor: '#fbbf24'  // Amarillo para "Pausa"
  },
  resumeBtn: {
    backgroundColor: '#3b82f6'  // Azul para "Reanudar"
  },
  // -----------------------------------------------
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
  },
    // Indicador de background activo
  backgroundIndicator: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  backgroundText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Sección de instrucciones
  instructionsSection: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    lineHeight: 20,
  },
  
  // Actualizar el texto de estado para mostrar background

});
