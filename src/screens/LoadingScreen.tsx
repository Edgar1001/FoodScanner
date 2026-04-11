import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4ade80" />
      <Text style={styles.text}>Looking up product...</Text>
      <Text style={styles.subText}>Fetching nutritional information</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#f8fafc',
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600',
  },
  subText: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 8,
  },
});
