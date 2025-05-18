import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export default function LogoutScreen() {
  const navigation = useNavigation<Navigation>();

  React.useEffect(() => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel', onPress: () => navigation.goBack() },
      {
        text: 'Sí',
        style: 'destructive',
        onPress: () => navigation.replace('Login'),
      },
    ]);
  }, []);

  return null; // pantalla vacía, solo muestra la alerta
}
