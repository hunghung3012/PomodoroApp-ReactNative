import React from 'react';
import { ScrollView, StatusBar, Platform } from 'react-native';
import { useTimerLogic } from './TimerLogic';
import { TimerUI } from './TimerUI';

export default function TimerScreen({ navigation }) {
  const timer = useTimerLogic();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f6f8fa' }}
      contentContainerStyle={{
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
        paddingBottom: 40,
        alignItems: 'center',
      }}
    >
      <StatusBar barStyle="dark-content" />
      <TimerUI {...timer} navigation={navigation} />
    </ScrollView>
  );
}
