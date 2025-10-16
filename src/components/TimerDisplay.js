// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { COLORS } from '../constants/colors';

// const TimerDisplay = ({ seconds, mode }) => {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;

//   const displayMinutes = String(minutes).padStart(2, '0');
//   const displaySeconds = String(remainingSeconds).padStart(2, '0');

//   const color = mode === 'WORK' ? COLORS.work : COLORS.break;

//   return (
//     <View style={styles.container}>
//       <Text style={[styles.timerText, { color }]}>
//         {displayMinutes}:{displaySeconds}
//       </Text>
//       <Text style={[styles.modeText, { color }]}>
//         {mode === 'WORK' ? '🔥 Làm việc' : '☕ Nghỉ ngơi'}
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     marginVertical: 40,
//   },
//   timerText: {
//     fontSize: 80,
//     fontWeight: 'bold',
//     fontVariant: ['tabular-nums'],
//   },
//   modeText: {
//     fontSize: 28,
//     marginTop: 10,
//     fontWeight: '600',
//   },
// });

// export default TimerDisplay;
