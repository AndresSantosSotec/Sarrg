import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TeamInfoModalProps {
  visible: boolean;
  team: string;
  onClose: () => void;
}

const TEAM_INFO: Record<string, { desc: string; items: string[] }> = {
  KoalaFit: {
    desc: "Ideal para quienes se inician en la actividad física y quieren adquirir hábitos saludables.",
    items: ["3,000 pasos diarios", "20 minutos de actividad", "Hasta 10 CoinFits por día"],
  },
  JaguarFit: {
    desc: "Para quienes tienen experiencia moderada y buscan un reto intermedio dentro del plan de bienestar.",
    items: ["6,000 pasos diarios", "30 minutos de actividad", "10 CoinFits por día"],
  },
  HalcónFit: {
    desc: "Pensado para personas activas que quieren desafiar su condición física al máximo.",
    items: ["10,000 pasos diarios", "45 minutos de actividad", "10 CoinFits por día"],
  },
};

export default function TeamInfoModal({ visible, team, onClose }: TeamInfoModalProps) {
  const info = TEAM_INFO[team];

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

          {info && (
            <>
              <Text style={styles.description}>{info.desc}</Text>
              {info.items.map(item => (
                <View key={item} style={styles.itemRow}>
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#10b981"
                    style={styles.itemIcon}
                  />
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              ))}
            </>
          )}
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
  description: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 12,
    lineHeight: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  itemText: {
    fontSize: 15,
    color: '#1e293b',
    flex: 1,
    lineHeight: 20,
  },
});
