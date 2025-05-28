import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles/RegisterActivityScreen.styles';

interface IntensityOption {
  label: string;
  value: string;
  color: string;
  description: string;
}

interface IntensityModalProps {
  visible: boolean;
  options: IntensityOption[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export default function IntensityModal({
  visible,
  options,
  selected,
  onSelect,
  onClose
}: IntensityModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecciona la Intensidad</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            {options.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.modalOption,
                  selected === opt.value && styles.modalOptionSelected
                ]}
                onPress={() => onSelect(opt.value)}
              >
                <View style={[styles.intensityDot, { backgroundColor: opt.color }]} />
                <View style={styles.intensityInfo}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      selected === opt.value && styles.modalOptionTextSelected
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <Text style={styles.intensityDescription}>{opt.description}</Text>
                </View>
                {selected === opt.value && (
                  <MaterialIcons name="check" size={20} color="#3b82f6" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
