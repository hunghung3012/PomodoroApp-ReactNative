// import React from 'react';
// import { TouchableOpacity, Text, StyleSheet } from 'react-native';
// import { COLORS } from '../constants/colors';

// const TimerControls = ({ status, onStart, onPause, onReset, mode }) => {
//   const color = mode === 'WORK' ? COLORS.work : COLORS.break;

//   return (
//     <>
//       {status === 'IDLE' || status === 'PAUSED' ? (
//         <TouchableOpacity
//           style={[styles.button, { backgroundColor: color }]}
//           onPress={onStart}
//         >
//           <Text style={styles.buttonText}>
//             {status === 'IDLE' ? '▶ Bắt đầu' : '▶ Tiếp tục'}
//           </Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity
//           style={[styles.button, styles.pauseButton]}
//           onPress={onPause}
//         >
//           <Text style={styles.buttonText}>⏸ Tạm dừng</Text>
//         </TouchableOpacity>
//       )}

//       {status !== 'IDLE' && (
//         <TouchableOpacity
//           style={[styles.button, styles.resetButton]}
//           onPress={onReset}
//         >
//           <Text style={styles.buttonText}>↻ Đặt lại</Text>
//         </TouchableOpacity>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     paddingVertical: 18,
//     paddingHorizontal: 50,
//     borderRadius: 30,
//     marginVertical: 10,
//     minWidth: 200,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 8,
//   },
//   pauseButton: {
//     backgroundColor: COLORS.warning,
//   },
//   resetButton: {
//     backgroundColor: COLORS.danger,
//   },
//   buttonText: {
//     color: COLORS.text,
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });

// export default TimerControls;
