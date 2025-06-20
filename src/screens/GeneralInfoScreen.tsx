import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { fetchGeneralInfo } from '../services/api'

interface InfoItem {
  id: number
  title: string
  content: string
  created_at: string
}

export default function GeneralInfoScreen() {
  const [items, setItems] = useState<InfoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchGeneralInfo<InfoItem>()
        setItems(data)
      } catch (err) {
        console.error('Error loading general info', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!items.length) {
    return (
      <View style={styles.center}>
        <Text>No hay información disponible</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={i => i.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content}>{item.content}</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  item: { marginBottom: 16 },
  title: { fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  content: { color: '#475569' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
})
