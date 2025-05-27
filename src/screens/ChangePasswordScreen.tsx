import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

export default function ChangePasswordScreen() {
  const { changePassword } = useContext(AuthContext);
  const [current, setCurrent] = useState('');
  const [next, setNext]       = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (next !== confirm) {
      return Alert.alert('Error', 'La nueva contraseña y su confirmación no coinciden.');
    }
    try {
      setLoading(true);
      await changePassword(current, next, confirm);
      Alert.alert('Éxito', 'Contraseña actualizada correctamente.');
      setCurrent(''); setNext(''); setConfirm('');
    } catch (err: any) {
      const msg = err.response?.data?.errors?.current_password?.[0]
                || err.response?.data?.message
                || 'Error desconocido';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Contraseña actual"
        secureTextEntry
        value={current}
        onChangeText={setCurrent}
        style={styles.input}
      />
      <TextInput
        placeholder="Nueva contraseña"
        secureTextEntry
        value={next}
        onChangeText={setNext}
        style={styles.input}
      />
      <TextInput
        placeholder="Confirma nueva contraseña"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
      />
      <Button
        title={loading ? 'Actualizando...' : 'Cambiar contraseña'}
        onPress={onSubmit}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center' },
  input: { 
    borderWidth:1, 
    borderColor:'#ccc', 
    borderRadius:5,
    padding:10, 
    marginBottom:12 
  },
});
