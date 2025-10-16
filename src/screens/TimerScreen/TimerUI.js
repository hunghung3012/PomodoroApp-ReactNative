import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch } from 'react-native';
import { TIMER_MODES, TIMER_STATUS } from '../../config/timer';
import { styles } from './TimerStyles';

export const TimerUI = ({
  mode, status, timeLeft, workMin, workSec, breakMin, breakSec,
  soundEnabled, workSessions, breakSessions,
  setWorkMin, setWorkSec, setBreakMin, setBreakSec, setSoundEnabled,
  handleModeChange, handleStart, handlePause, handleReset, saveTimeSettings,
  navigation,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Pomodoro</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        {Object.values(TIMER_MODES).map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.tabButton, mode === m && styles.activeTab]}
            onPress={() => handleModeChange(m)}
          >
            <Text style={[styles.tabText, mode === m && styles.activeTabText]}>
              {m === 'WORK' ? 'Làm việc' : 'Nghỉ'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer */}
      <View style={styles.timerBox}>
        <Text style={styles.timerText}>{displayTime}</Text>
        <Text style={styles.statusText}>
          {status === TIMER_STATUS.RUNNING ? 'Đang chạy' :
           status === TIMER_STATUS.PAUSED ? 'Tạm dừng' : 'Sẵn sàng'}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {status === TIMER_STATUS.RUNNING ? (
          <TouchableOpacity
            style={[styles.button, styles.pauseButton]}
            onPress={handlePause}
          >
            <Text style={styles.buttonText}>Tạm dừng</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStart}
          >
            <Text style={styles.buttonText}>
              {status === TIMER_STATUS.IDLE ? 'Bắt đầu' : 'Tiếp tục'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={handleReset}
        >
          <Text style={[styles.buttonText, { color: '#333' }]}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Sound toggle */}
      <View style={styles.settingBox}>
        <View style={styles.row}>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            thumbColor={soundEnabled ? '#4CAF50' : '#ccc'}
            trackColor={{ false: '#ddd', true: '#C8E6C9' }}
          />
          <Text style={styles.settingLabel}>Dùng âm báo tùy chọn</Text>
        </View>
      </View>

      {/* Time configuration */}
      <View style={styles.settingBox}>
        <Text style={styles.settingLabel}>Cấu hình thời gian</Text>

        {/* Work time */}
        <View style={styles.timeRow}>
          <Text style={styles.smallLabel}>Work:</Text>
          <TextInput
            style={styles.timeInput}
            keyboardType="numeric"
            value={String(workMin)}
            onChangeText={(t) => setWorkMin(Math.max(0, parseInt(t) || 0))}
          />
          <Text style={styles.unit}>phút</Text>
          <Text style={styles.separator}>:</Text>
          <TextInput
            style={styles.timeInput}
            keyboardType="numeric"
            value={String(workSec)}
            onChangeText={(t) => setWorkSec(Math.max(0, Math.min(59, parseInt(t) || 0)))}
          />
          <Text style={styles.unit}>giây</Text>
        </View>

        {/* Break time */}
        <View style={styles.timeRow}>
          <Text style={styles.smallLabel}>Break:</Text>
          <TextInput
            style={styles.timeInput}
            keyboardType="numeric"
            value={String(breakMin)}
            onChangeText={(t) => setBreakMin(Math.max(0, parseInt(t) || 0))}
          />
          <Text style={styles.unit}>phút</Text>
          <Text style={styles.separator}>:</Text>
          <TextInput
            style={styles.timeInput}
            keyboardType="numeric"
            value={String(breakSec)}
            onChangeText={(t) => setBreakSec(Math.max(0, Math.min(59, parseInt(t) || 0)))}
          />
          <Text style={styles.unit}>giây</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={saveTimeSettings}
        >
          <Text style={styles.buttonText}>Lưu thời gian</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>🔥 Work: {workSessions}</Text>
        <Text style={styles.summaryText}>☕ Break: {breakSessions}</Text>
      </View>

      {/* History */}
      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.buttonText}>Xem lịch sử</Text>
      </TouchableOpacity>
    </View>
  );
};