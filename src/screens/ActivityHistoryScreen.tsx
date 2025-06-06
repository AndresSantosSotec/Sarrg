import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchUserActivities } from '../services/api';

interface Activity {
  id: number;
  exercise_type: string;
  duration: number;
  duration_unit: string;
  intensity: string;
  calories: number | null;
  created_at: string;
}

export default function ActivityHistoryScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUserActivities();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!activities.length) {
    return (
      <View style={styles.centered}>
        <Text>No hay actividades registradas.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Activity }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.exercise_type}</Text>
      <Text style={styles.subtitle}>
        {item.duration} {item.duration_unit} - {item.intensity}
      </Text>
      <Text style={styles.date}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  item: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: { fontWeight: 'bold', marginBottom: 4, color: '#1f2937' },
  subtitle: { color: '#4b5563', marginBottom: 4 },
  date: { fontSize: 12, color: '#6b7280' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
