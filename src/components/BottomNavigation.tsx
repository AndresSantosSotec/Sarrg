import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

export default function BottomNavigation({ state, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();

  // Filtrar solo las rutas que queremos mostrar (sin Profile)
  const allowedRoutes = ['Dashboard', 'RegisterActivity', 'ActivityHistory', 'Logout'];
  const filteredRoutes = state.routes.filter(route => allowedRoutes.includes(route.name));

  return (
    <View style={[styles.navbar, { paddingBottom: bottom, height: 64 + bottom }]}>
      {filteredRoutes.map((route) => {
        const isActive = state.index === state.routes.indexOf(route);

        /* Ícono y texto según la ruta */
        type TabInfo = { icon: any; label: any; iconType: 'fontawesome' | 'fontawesome5' };
        const { icon, label, iconType }: TabInfo =
          route.name === 'Dashboard'
            ? { icon: 'home', label: 'Inicio', iconType: 'fontawesome' }
            : route.name === 'RegisterActivity'
            ? { icon: 'running', label: 'Actividad', iconType: 'fontawesome5' }
            : route.name === 'ActivityHistory'
            ? { icon: 'history', label: 'Historial', iconType: 'fontawesome' }
            : { icon: 'sign-out', label: 'Salir', iconType: 'fontawesome' };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.navItem}
            onPress={() => navigation.navigate(route.name)}
          >
            {isActive && <View style={styles.activeIndicator} />}
            {iconType === 'fontawesome' ? (
              <FontAwesome 
                name={icon} 
                size={20} 
                style={[styles.icon, isActive && styles.activeText]} 
              />
            ) : (
              <FontAwesome5 
                name={icon} 
                size={20} 
                style={[styles.icon, isActive && styles.activeText]} 
              />
            )}
            <Text style={[styles.label, isActive && styles.activeText]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Los estilos permanecen iguales
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
    paddingVertical: 8,
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
    color: '#bfdbfe',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#bfdbfe',
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
});