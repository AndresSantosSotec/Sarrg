import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import api from '../services/api';

interface Activity {
  id: number;
  exercise_type: string;
  duration: number;
  created_at: string;
}

export default function ActivityHistoryScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await api.get<{ activities: Activity[] }>('/app/activities');
        setActivities(data.activities || data);
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const renderItem = ({ item }: { item: Activity }) => (
    <View style={styles.row}>
      <Text style={styles.type}>{item.exercise_type}</Text>
      <Text style={styles.duration}>{item.duration}</Text>
      <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  type: {
    flex: 1,
    fontWeight: '600',
    color: '#1f2937',
  },
  duration: {
    width: 80,
    textAlign: 'right',
    color: '#2563eb',
  },
  date: {
    width: 100,
    textAlign: 'right',
    color: '#6b7280',
  },
});
