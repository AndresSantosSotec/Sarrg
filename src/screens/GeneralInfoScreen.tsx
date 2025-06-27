import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { Video } from 'expo-av';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { fetchGeneralInfo, GeneralInfoItem } from '../services/api';
import { COLORS } from './styles/DashboardScreen.styles';

export default function GeneralInfoScreen() {
  const [items, setItems] = useState<GeneralInfoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GeneralInfoItem | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchGeneralInfo();
        setItems(data);
      } catch (err) {
        console.error('Error loading general info', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={navigation.goBack}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="arrow-left" size={16} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Información General</Text>
      </View>
      <FlatList
        data={items}
        contentContainerStyle={styles.list}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => setSelectedItem(item)}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>
              <FontAwesome5 name="lightbulb" size={16} color={COLORS.white} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body} numberOfLines={2}>{item.content}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {selectedItem && (
        <Modal
          visible
          animationType="slide"
          transparent
          onRequestClose={() => setSelectedItem(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                <TouchableOpacity onPress={() => setSelectedItem(null)}>
                  <FontAwesome5 name="times" size={20} color={COLORS.darkGray} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll}>
                {selectedItem.image_url && (
                  <Image
                    source={{ uri: selectedItem.image_url }}
                    style={styles.modalImage}
                  />
                )}
                {selectedItem.video_url && (
                  <Video
                    source={{ uri: selectedItem.video_url }}
                    style={styles.modalVideo}
                    useNativeControls
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.modalBody}>{selectedItem.content}</Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 },
      android: { elevation: 3 },
    }),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 40,
  },
  list: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.darkGray },
  body: { fontSize: 13, color: COLORS.darkGray, marginTop: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    maxHeight: '90%',
    width: '100%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkGray,
    flex: 1,
    marginRight: 12,
  },
  modalScroll: { padding: 20 },
  modalImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16, resizeMode: 'cover' },
  modalVideo: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  modalBody: { fontSize: 15, color: COLORS.darkGray, marginBottom: 20 },
});
