import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles/RegisterActivityScreen.styles';

interface ExerciseModalProps {
  visible: boolean;
  searchTerm: string;
  onSearchChange: (t: string) => void;
  options: { label: string; value: string; icon: string; color: string }[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export default function ExerciseModal({
  visible,
  searchTerm,
  onSearchChange,
  options,
  selected,
  onSelect,
  onClose
}: ExerciseModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecciona el Ejercicio</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar ejercicio..."
            value={searchTerm}
            onChangeText={onSearchChange}
          />
          <ScrollView style={styles.modalScroll}>
            {options
              .filter(o => o.label.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(o => (
                <TouchableOpacity
                  key={o.value}
                  style={[
                    styles.modalOption,
                    selected === o.value && styles.modalOptionSelected
                  ]}
                  onPress={() => onSelect(o.value)}
                >
                  <MaterialIcons name={o.icon as any} size={24} color={o.color} />
                  <Text
                    style={[
                      styles.modalOptionText,
                      selected === o.value && styles.modalOptionTextSelected
                    ]}
                  >
                    {o.label}
                  </Text>
                  {selected === o.value && (
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
