import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';

// Dark Theme matches Fastfood Nation
const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#10b981', // emerald-500
    background: '#0f172a', // slate-900
    card: '#1e293b', // slate-800
    text: '#ffffff',
    border: '#334155', // slate-700
  },
};

export default function App() {
  return (
    <NavigationContainer theme={AppTheme}>
      <StatusBar style="light" />
      <AppNavigator />
    </NavigationContainer>
  );
}
