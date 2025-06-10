import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

export default function BottomNavigation({ state, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();

  // Filtrar solo las rutas que queremos mostrar (sin Profile)
  const allowedRoutes = ['Dashboard', 'RegisterActivity', 'ReferenceActivity', 'Logout'];
  const filteredRoutes = state.routes.filter(route => allowedRoutes.includes(route.name));

  return (
    <View style={[styles.navbar, { paddingBottom: bottom, height: 64 + bottom }]}>
      {filteredRoutes.map((route, index) => {
        const isActive = state.index === index;

        /* Ícono y texto según la ruta */
        type TabInfo = { icon: any; label: any; iconType: 'fontawesome' | 'fontawesome5' };
        
        const tabInfoMap: Record<string, TabInfo> = {
          Dashboard: { icon: 'home', label: 'Inicio', iconType: 'fontawesome' },
          RegisterActivity: { icon: 'running', label: 'Actividad', iconType: 'fontawesome5' },
          ReferenceActivity: { icon: 'info-circle', label: 'Referencias', iconType: 'fontawesome5' },
          Logout: { icon: 'sign-out', label: 'Salir', iconType: 'fontawesome' },
        };

        const { icon, label, iconType }: TabInfo = tabInfoMap[route.name] || {
          icon: 'question-circle',
          label: 'Desconocido',
          iconType: 'fontawesome',
        };


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