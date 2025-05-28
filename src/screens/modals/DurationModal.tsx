import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles/RegisterActivityScreen.styles';

interface DurationUnit {
  label: string;
  value: string;
}

interface DurationModalProps {
  visible: boolean;
  units: DurationUnit[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export default function DurationModal({
  visible,
  units,
  selected,
  onSelect,
  onClose
}: DurationModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Unidad de Tiempo</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          {units.map(unit => (
            <TouchableOpacity
              key={unit.value}
              style={[
                styles.modalOption,
                selected === unit.value && styles.modalOptionSelected
              ]}
              onPress={() => onSelect(unit.value)}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  selected === unit.value && styles.modalOptionTextSelected
                ]}
              >
                {unit.label}
              </Text>
              {selected === unit.value && (
                <MaterialIcons name="check" size={20} color="#3b82f6" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}
