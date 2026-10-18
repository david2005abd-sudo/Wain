import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from './lib/store';
import AppNavigator from './components/AppNavigator';

export default function App() {
  const [loaded, error] = useFonts({
    ...Ionicons.font,
    Arabic: require('./assets/fonts/Tajawal-Regular.ttf'),
    ArabicMedium: require('./assets/fonts/Tajawal-Medium.ttf'),
    ArabicBold: require('./assets/fonts/Tajawal-Bold.ttf'),
    ArabicExtra: require('./assets/fonts/Tajawal-ExtraBold.ttf'),
  });
  if (!loaded && !error) return <View style={{ flex: 1, backgroundColor: '#F7F9FA', justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color="#20B8CD" size="large" /></View>;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
