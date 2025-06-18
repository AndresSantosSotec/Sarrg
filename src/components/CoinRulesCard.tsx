import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles as dashStyles, COLORS } from '../screens/styles/DashboardScreen.styles';

const RULES = [
  { icon: 'directions-walk', text: 'Completa tu meta diaria para ganar 10 CoinFits.' },
  { icon: 'photo-camera', text: 'Sube evidencia (foto o ubicación) y recibe +2 CoinFits.' },
  { icon: 'arrow-upward', text: 'Supera tu meta personal y obtén +3 CoinFits.' },
  {
    icon: 'calendar-today',
    text: 'Cumple tus metas 5 días o más en la semana y recibe un bono de +10 CoinFits.'
  },
  { icon: 'block', text: 'Máximo 10 CoinFits por día.' }
];

export default function CoinRulesCard() {
  return (
    <View style={dashStyles.infoCard}>
      <View style={dashStyles.cardHeader}>
        <LinearGradient
          colors={[COLORS.success, COLORS.lightGreen]}
          style={dashStyles.cardIconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons name="attach-money" size={22} color={COLORS.white} />
        </LinearGradient>
        <Text style={dashStyles.cardTitle}>Reglas para obtener CoinFits</Text>
      </View>
      {RULES.map(rule => (
        <View key={rule.text} style={dashStyles.ruleRow}>
          <MaterialIcons name={rule.icon as any} size={20} color={COLORS.success} style={dashStyles.ruleIcon} />
          <Text style={[dashStyles.rowLabel, { flex: 1 }]}>{rule.text}</Text>
        </View>
      ))}
    </View>
  );
}
