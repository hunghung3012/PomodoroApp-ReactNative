// HistoryScreen.js
import React from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { useHistoryLogic } from './HistoryLogic';
import { HistoryUI } from './HistoryUI';

export default function HistoryScreen({ navigation }) {
  const history = useHistoryLogic();

  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f8fa" />
      <HistoryUI {...history} navigation={navigation} />
    </View>
  );
}