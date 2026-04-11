import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import ScannerScreen from './src/screens/ScannerScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import NotFoundScreen from './src/screens/NotFoundScreen';
import { Product } from './src/types';
import { getProductByBarcode } from './src/services/openFoodFactsApi';

type AppState = 'scanning' | 'loading' | 'product' | 'not-found';

export default function App() {
  const [appState, setAppState] = useState<AppState>('scanning');
  const [product, setProduct] = useState<Product | null>(null);
  const [scannedBarcode, setScannedBarcode] = useState<string>('');

  const handleScan = async (barcode: string) => {
    setScannedBarcode(barcode);
    setAppState('loading');
    
    try {
      const productData = await getProductByBarcode(barcode);
      
      if (productData) {
        setProduct(productData);
        setAppState('product');
      } else {
        setAppState('not-found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setAppState('not-found');
    }
  };

  const handleScanAgain = () => {
    setProduct(null);
    setScannedBarcode('');
    setAppState('scanning');
  };

  const renderScreen = () => {
    switch (appState) {
      case 'scanning':
        return <ScannerScreen onScan={handleScan} />;
      case 'loading':
        return <LoadingScreen />;
      case 'product':
        return product ? (
          <ProductDetailsScreen product={product} onScanAgain={handleScanAgain} />
        ) : null;
      case 'not-found':
        return <NotFoundScreen barcode={scannedBarcode} onScanAgain={handleScanAgain} />;
      default:
        return <ScannerScreen onScan={handleScan} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
