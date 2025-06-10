import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BmiScaleProps {
  bmi: number;
}

const ranges = [
  { label: 'Bajo', color: '#fbbf24', min: 0, max: 18.4 },
  { label: 'Normal', color: '#10b981', min: 18.5, max: 24.9 },
  { label: 'Sobrepeso', color: '#f59e0b', min: 25, max: 29.9 },
  { label: 'Obesidad', color: '#ef4444', min: 30, max: 40 },
];

export default function BmiScale({ bmi }: BmiScaleProps) {
  const max = ranges[ranges.length - 1].max;
  const percent = Math.min((bmi / max) * 100, 100);
  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {ranges.map((r, idx) => (
          <View key={idx} style={[styles.segment, { backgroundColor: r.color }]} />
        ))}
        <View style={[styles.indicator, { left: `${percent}%` }]} />
      </View>
      <View style={styles.labelsContainer}>
        {ranges.map((r, idx) => (
          <Text key={idx} style={styles.label}>{r.label}</Text>
        ))}
      </View>
      <View style={styles.valuesContainer}>
        {ranges.map((r, idx) => (
          <Text key={idx} style={styles.value}>{`${r.min}-${r.max}`}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  barContainer: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
  },
  indicator: {
    position: 'absolute',
    top: -6,
    width: 0,
    height: 24,
    borderLeftWidth: 2,
    borderLeftColor: '#374151',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 10,
    color: '#374151',
  },
  value: {
    fontSize: 10,
    color: '#6b7280',
  },
});
