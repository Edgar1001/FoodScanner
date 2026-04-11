import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface NotFoundScreenProps {
  barcode: string;
  onScanAgain: () => void;
}

export default function NotFoundScreen({ barcode, onScanAgain }: NotFoundScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔍</Text>
      </View>
      <Text style={styles.title}>Product Not Found</Text>
      <Text style={styles.barcode}>Barcode: {barcode}</Text>
      <Text style={styles.description}>
        This product is not in the Open Food Facts database yet.
        You can help by adding it at openfoodfacts.org
      </Text>
      <TouchableOpacity style={styles.button} onPress={onScanAgain}>
        <Text style={styles.buttonText}>Scan Another Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  barcode: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  description: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
});
