import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'
import { fetchUserActivities } from '../services/api'
import { exerciseIconMap } from '../constants/exerciseIcons'


//funcion fetchUserActivities() {
//   return fetch('http://localhost:3000/api/v1/users/1/activities')
//     .then(response => response.json())
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
  const [activities, setActivities] = useState<Activity[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const isFocused = useIsFocused()

  const loadActivities = useCallback(
    async (p: number, append = false) => {
      try {
        const res = await fetchUserActivities<Activity>(p)
        setHasMore(res.current_page < res.last_page)
        setPage(res.current_page)
        setActivities(prev =>
          append ? [...prev, ...res.data] : res.data
        )
      } catch (error) {
        console.error('Error fetching activities', error)
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    []
  )

  useEffect(() => {
    if (isFocused) {
      setLoading(true)
      loadActivities(1)
    }
  }, [isFocused, loadActivities])

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!activities.length) {
    return (
      <View style={styles.centered}>
        <Text>No hay actividades registradas.</Text>
      </View>
    )
  }

  const renderItem = ({ item }: { item: Activity }) => {
    const icon = exerciseIconMap[item.exercise_type] ?? {
      icon: 'fitness-center',
      color: '#3b82f6',
    }
    return (
      <View style={styles.item}>
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={icon.icon as any}
            size={24}
            color={icon.color}
          />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.title}>{item.exercise_type}</Text>
          <Text style={styles.subtitle}>
            {item.duration} {item.duration_unit} - {item.intensity}
          </Text>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
      </View>
    )
  }

  const onRefresh = () => {
    setRefreshing(true)
    loadActivities(1)
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      setLoading(true)
      loadActivities(page + 1, true)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="history" size={24} color="white" />
          <Text style={styles.headerTitle}>Historial de Actividades</Text>
        </View>
      </View>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          loading && hasMore ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator />
            </View>
          ) : null
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
  list: { padding: 16, paddingBottom: 150 },
  item: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
  },
  itemContent: { marginLeft: 12, flex: 1 },
  title: { fontWeight: 'bold', marginBottom: 2, color: '#1f2937', fontSize: 16 },
  subtitle: { color: '#4b5563', marginBottom: 2 },
  date: { fontSize: 12, color: '#6b7280' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  footerLoading: { padding: 16 },
})
