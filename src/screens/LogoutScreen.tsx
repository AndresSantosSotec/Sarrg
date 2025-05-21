// src/screens/LogoutScreen.tsx
import React, { useContext, useEffect, useState } from 'react';
import { Alert, ActivityIndicator, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { AuthContext } from '../contexts/AuthContext';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function LogoutScreen() {
  const navigation = useNavigation<Navigation>();
  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que quieres salir?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'Sí',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
              // No navegar manualmente: AppNavigator detectará user=null
            } catch (e) {
              console.error('Error al hacer logout:', e);
              Alert.alert('Error', 'No fue posible cerrar sesión');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  }, [logout, navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
