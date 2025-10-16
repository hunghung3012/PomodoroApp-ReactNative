// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { COLORS } from '../constants/colors';

// const ModeSelector = ({ currentMode, onModeChange, disabled }) => {
//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={[
//           styles.modeButton,
//           currentMode === 'WORK' && styles.activeWork,
//           disabled && styles.disabled,
//         ]}
//         onPress={() => onModeChange('WORK')}
//         disabled={disabled}
//       >
//         <Text
//           style={[
//             styles.modeText,
//             currentMode === 'WORK' && styles.activeText,
//           ]}
//         >
//           Làm việc
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[
//           styles.modeButton,
//           currentMode === 'BREAK' && styles.activeBreak,
//           disabled && styles.disabled,
//         ]}
//         onPress={() => onModeChange('BREAK')}
//         disabled={disabled}
//       >
//         <Text
//           style={[
//             styles.modeText,
//             currentMode === 'BREAK' && styles.activeText,
//           ]}
//         >
//           Nghỉ ngơi
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginVertical: 20,
//     gap: 15,
//   },
//   modeButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     backgroundColor: COLORS.cardBg,
//     borderWidth: 2,
//     borderColor: COLORS.textSecondary,
//   },
//   activeWork: {
//     backgroundColor: COLORS.work,
//     borderColor: COLORS.work,
//   },
//   activeBreak: {
//     backgroundColor: COLORS.break,
//     borderColor: COLORS.break,
//   },
//   disabled: {
//     opacity: 0.5,
//   },
//   modeText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.textSecondary,
//   },
//   activeText: {
//     color: COLORS.text,
//   },
// });

// export default ModeSelector;
