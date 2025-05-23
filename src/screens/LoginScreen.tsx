// src/screens/LoginScreen.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Por favor completa los campos.');
    }
    try {
      await login(email, password);
      // Una vez que login() actualice el contexto, el navigator principal
      // detectará user != null y cambiará a la pantalla principal.
    } catch (err: any) {
      console.error('❌ Login error:', err.response ?? err);
      Alert.alert(
        'Error',
        err.response?.data?.message || 'No se pudo iniciar sesión'
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo + claim */}
      <View style={styles.logoContainer}>
        <Text style={styles.title}>
          coosanjer
          <Text style={styles.titleHighlight}>FIT</Text>
        </Text>
        <Text style={styles.subtitle}>
          Salud en movimiento, con el corazón cooperativo.
        </Text>
      </View>

      {/* Formulario */}
      <View style={styles.form}>
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Enlaces */}
      <View style={styles.linksContainer}>
        <Text
          style={styles.linkText}
          onPress={() => Alert.alert('Recordar', 'Función pendiente')}
        >
          Recordar
        </Text>
        <Text style={styles.linkText}> | </Text>
        <Text
          style={styles.linkText}
          onPress={() => Alert.alert('Recuperar', 'Función pendiente')}
        >
          Recuperar Contraseña
        </Text>
      </View>

      <Text style={styles.version}>versión 1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  titleHighlight: {
    color: '#22c55e',
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 14,
    borderRadius: 8,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    color: '#fff',
  },
  button: {
    backgroundColor: '#22c55e',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  linkText: {
    color: '#fff',
    opacity: 0.8,
    textDecorationLine: 'underline',
  },
  version: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginBottom: 8,
  },
});
