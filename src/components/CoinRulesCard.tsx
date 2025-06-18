import React from 'react';
import { View, Text } from 'react-native';
import { styles as dashStyles, COLORS } from '../screens/styles/DashboardScreen.styles';

export default function CoinRulesCard() {
  return (
    <View style={dashStyles.infoCard}>
      <Text style={dashStyles.cardTitle}>Reglas para obtener CoinFits</Text>
      <View style={{ marginTop: 8 }}>
        <Text style={dashStyles.rowLabel}>{'\u2022'} Completa tu meta diaria para ganar 10 CoinFits.</Text>
        <Text style={dashStyles.rowLabel}>{'\u2022'} Sube evidencia (foto o ubicaci\u00f3n) y recibe +2 CoinFits.</Text>
        <Text style={dashStyles.rowLabel}>{'\u2022'} Supera tu meta personal y obt\u00e9n +3 CoinFits.</Text>
        <Text style={dashStyles.rowLabel}>{'\u2022'} Cumple tus metas 5 d\u00edas o m\u00e1s en la semana y recibe un bono de +10 CoinFits.</Text>
        <Text style={dashStyles.rowLabel}>{'\u2022'} M\u00e1ximo 10 CoinFits por d\u00eda.</Text>
      </View>
    </View>
  );
}
