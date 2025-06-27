import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  fetchNotifications,
  NotificationItem,
  markNotificationAsRead,
  deleteNotification,
} from '../services/api';
import { COLORS } from './styles/DashboardScreen.styles';


export default function NotificationsScreen() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();


  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNotifications();
        setItems(data);
      } catch (err) {
        console.error('Error loading notifications', err);
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
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={async () => {
            const toRemove = items.filter(i => i.read_at)
            try {
              await Promise.all(toRemove.map(n => deleteNotification(n.id)))
              setItems(prev => prev.filter(n => !n.read_at))
            } catch (err) {
              console.error('Error removing notifications', err)
            }
          }}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="trash" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        contentContainerStyle={styles.list}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              item.read_at ? null : styles.unreadItem,
            ]}
            onPress={async () => {
              Alert.alert(item.title, item.body)
              if (!item.read_at) {
                try {
                  await markNotificationAsRead(item.id)
                  setItems(prev =>
                    prev.map(n =>
                      n.id === item.id ? { ...n, read_at: new Date().toISOString() } : n,
                    ),
                  )
                } catch (err) {
                  console.error('Error marking notification as read', err)
                }
              }
            }}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>
              <FontAwesome5 name="bell" size={16} color={COLORS.white} />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.date}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginLeft: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 0,
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
  unreadItem: {
    backgroundColor: '#eaf6ff',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.darkGray },
  body: { fontSize: 13, color: COLORS.darkGray, marginTop: 4 },
  date: { fontSize: 11, color: COLORS.mediumGray, marginTop: 6 },
});
