import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TeamInfoModalProps {
  visible: boolean;
  team: string;
  onClose: () => void;
}

const TEAM_INFO: Record<string, string> = {
  KoalaFit:
    'Ideal para quienes se inician en la actividad f\u00edsica. Requiere 3,000 pasos y 20 minutos de actividad diaria. Te permite acumular hasta 10 CoinFits cada d\u00eda.',
  JaguarFit:
    'Para quienes buscan un reto intermedio. Debes completar 6,000 pasos y 30 minutos de actividad por d\u00eda. Mantienes la posibilidad de ganar 10 CoinFits diarios.',
  Halc\u00f3nFit:
    'Pensado para los m\u00e1s activos. Exige 10,000 pasos y 45 minutos de actividad al d\u00eda, obteniendo hasta 10 CoinFits por jornada.',
};

export default function TeamInfoModal({ visible, team, onClose }: TeamInfoModalProps) {
  const description = TEAM_INFO[team] || '';
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{team}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>{description}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  text: {
    fontSize: 16,
    color: '#1e293b',
  },
});
