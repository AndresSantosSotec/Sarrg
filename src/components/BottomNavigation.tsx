import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function BottomNavigation({ state, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.navbar, { paddingBottom: bottom, height: 64 + bottom }]}>
      {state.routes.map((route, index) => {
        const isActive = state.index === index;

        /* Ícono y texto según la ruta */
        const { icon, label } =
          route.name === 'Dashboard'
            ? { icon: '🏠', label: 'Inicio' }
            : route.name === 'Profile'
            ? { icon: '👤', label: 'Perfil' }
            : route.name === 'RegisterActivity'
            ? { icon: '🏃‍♂️', label: 'Actividad' }
            : route.name === 'Wallet'
            ? { icon: '⏰', label: 'Monedero' }
            : route.name === 'Store'
            ? { icon: '🛒', label: 'Tienda' }
            : { icon: '🚪', label: 'Salir' }; // ← Logout

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.navItem}
            onPress={() => navigation.navigate(route.name)}
          >
            {isActive && <View style={styles.activeIndicator} />}
            <Text style={[styles.icon, isActive && styles.activeText]}>{icon}</Text>
            <Text style={[styles.label, isActive && styles.activeText]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 48,
    height: 4,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  icon: {
    fontSize: 18,
    color: '#bfdbfe',
  },
  label: {
    fontSize: 12,
    color: '#bfdbfe',
    marginTop: 2,
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
