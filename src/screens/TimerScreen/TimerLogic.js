// TimerLogic.js - Independent dual timer version with notifications & sound
import { useState, useEffect, useRef } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { TIMER_MODES, DEFAULT_TIMES, TIMER_STATUS } from '../../config/timer';
import { saveSession, getSessions } from '../../utils/storage';

// Cấu hình thông báo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useTimerLogic = () => {
  const [mode, setMode] = useState(TIMER_MODES.WORK);
  
  // Trạng thái riêng cho từng timer
  const [workStatus, setWorkStatus] = useState(TIMER_STATUS.IDLE);
  const [breakStatus, setBreakStatus] = useState(TIMER_STATUS.IDLE);
  
  // Thời gian còn lại riêng cho từng timer
  const [workTimeLeft, setWorkTimeLeft] = useState(DEFAULT_TIMES.WORK);
  const [breakTimeLeft, setBreakTimeLeft] = useState(DEFAULT_TIMES.BREAK);
  
  // Cấu hình thời gian
  const [workMin, setWorkMin] = useState(25);
  const [workSec, setWorkSec] = useState(0);
  const [breakMin, setBreakMin] = useState(5);
  const [breakSec, setBreakSec] = useState(0);
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [workSessions, setWorkSessions] = useState(0);
  const [breakSessions, setBreakSessions] = useState(0);
  
  const workIntervalRef = useRef(null);
  const breakIntervalRef = useRef(null);
  const soundObject = useRef(null);

  useEffect(() => {
    registerForPushNotifications();
    loadTodaySessions();
    loadSound();
    
    return () => {
      if (workIntervalRef.current) clearInterval(workIntervalRef.current);
      if (breakIntervalRef.current) clearInterval(breakIntervalRef.current);
      if (soundObject.current) {
        soundObject.current.unloadAsync();
      }
      deactivateKeepAwake();
    };
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Không có quyền thông báo!');
        return;
      }
    } catch (error) {
      console.error('Lỗi đăng ký thông báo:', error);
    }
  };

  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/ringtone.mp3')
      );
      soundObject.current = sound;
    } catch (error) {
      console.error('Lỗi load âm thanh:', error);
    }
  };

  const playSound = async () => {
    try {
      if (soundObject.current && soundEnabled) {
        await soundObject.current.replayAsync();
      }
    } catch (error) {
      console.error('Lỗi phát âm thanh:', error);
    }
  };

  const sendNotification = async (title, body) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          sound: soundEnabled,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Hiển thị ngay lập tức
      });
    } catch (error) {
      console.error('Lỗi gửi thông báo:', error);
    }
  };

  const loadTodaySessions = async () => {
    const sessions = await getSessions();
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(
      (s) => new Date(s.date).toDateString() === today
    );
    setWorkSessions(todaySessions.filter((s) => s.type === 'WORK').length);
    setBreakSessions(todaySessions.filter((s) => s.type === 'BREAK').length);
  };

  // Timer cho WORK
  useEffect(() => {
    if (workStatus === TIMER_STATUS.RUNNING) {
      workIntervalRef.current = setInterval(() => {
        setWorkTimeLeft((prev) => {
          if (prev <= 1) {
            handleWorkComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (workIntervalRef.current) {
      clearInterval(workIntervalRef.current);
    }
    return () => workIntervalRef.current && clearInterval(workIntervalRef.current);
  }, [workStatus]);

  // Timer cho BREAK
  useEffect(() => {
    if (breakStatus === TIMER_STATUS.RUNNING) {
      breakIntervalRef.current = setInterval(() => {
        setBreakTimeLeft((prev) => {
          if (prev <= 1) {
            handleBreakComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (breakIntervalRef.current) {
      clearInterval(breakIntervalRef.current);
    }
    return () => breakIntervalRef.current && clearInterval(breakIntervalRef.current);
  }, [breakStatus]);

  const handleWorkComplete = async () => {
    setWorkStatus(TIMER_STATUS.IDLE);
    
    // Rung và phát âm thanh
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await playSound();
    
    // Gửi thông báo
    await sendNotification(
      '🎉 Hoàn thành phiên làm việc!',
      'Bạn đã hoàn thành thời gian làm việc. Hãy nghỉ ngơi!'
    );
    
    await saveSession({
      type: TIMER_MODES.WORK,
      duration: workMin * 60 + workSec,
      date: new Date().toISOString(),
      completed: true,
    });
    
    setWorkTimeLeft(workMin * 60 + workSec);
    await loadTodaySessions();
    
    // Kiểm tra xem có timer nào đang chạy không
    if (breakStatus !== TIMER_STATUS.RUNNING) {
      deactivateKeepAwake();
    }
  };

  const handleBreakComplete = async () => {
    setBreakStatus(TIMER_STATUS.IDLE);
    
    // Rung và phát âm thanh
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await playSound();
    
    // Gửi thông báo
    await sendNotification(
      '✅ Hết giờ nghỉ!',
      'Đã nghỉ đủ rồi, tiếp tục làm việc thôi!'
    );
    
    await saveSession({
      type: TIMER_MODES.BREAK,
      duration: breakMin * 60 + breakSec,
      date: new Date().toISOString(),
      completed: true,
    });
    
    setBreakTimeLeft(breakMin * 60 + breakSec);
    await loadTodaySessions();
    
    // Kiểm tra xem có timer nào đang chạy không
    if (workStatus !== TIMER_STATUS.RUNNING) {
      deactivateKeepAwake();
    }
  };

  const handleStart = async () => {
    if (mode === TIMER_MODES.WORK) {
      // Nếu đang ở WORK và bấm start
      if (breakStatus === TIMER_STATUS.RUNNING) {
        // Nếu Break đang chạy -> dừng Break, reset về ban đầu
        setBreakStatus(TIMER_STATUS.IDLE);
        setBreakTimeLeft(breakMin * 60 + breakSec);
      }
      setWorkStatus(TIMER_STATUS.RUNNING);
    } else {
      // Nếu đang ở BREAK và bấm start
      if (workStatus === TIMER_STATUS.RUNNING) {
        // Nếu Work đang chạy -> dừng Work, reset về ban đầu
        setWorkStatus(TIMER_STATUS.IDLE);
        setWorkTimeLeft(workMin * 60 + workSec);
      }
      setBreakStatus(TIMER_STATUS.RUNNING);
    }
    
    await activateKeepAwakeAsync();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePause = async () => {
    if (mode === TIMER_MODES.WORK) {
      setWorkStatus(TIMER_STATUS.PAUSED);
    } else {
      setBreakStatus(TIMER_STATUS.PAUSED);
    }
    
    // Chỉ tắt keep awake nếu cả 2 timer đều không chạy
    if (
      (mode === TIMER_MODES.WORK && breakStatus !== TIMER_STATUS.RUNNING) ||
      (mode === TIMER_MODES.BREAK && workStatus !== TIMER_STATUS.RUNNING)
    ) {
      deactivateKeepAwake();
    }
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleReset = async () => {
    if (mode === TIMER_MODES.WORK) {
      setWorkStatus(TIMER_STATUS.IDLE);
      setWorkTimeLeft(workMin * 60 + workSec);
    } else {
      setBreakStatus(TIMER_STATUS.IDLE);
      setBreakTimeLeft(breakMin * 60 + breakSec);
    }
    
    // Chỉ tắt keep awake nếu cả 2 timer đều không chạy
    if (
      (mode === TIMER_MODES.WORK && breakStatus !== TIMER_STATUS.RUNNING) ||
      (mode === TIMER_MODES.BREAK && workStatus !== TIMER_STATUS.RUNNING)
    ) {
      deactivateKeepAwake();
    }
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handleModeChange = async (newMode) => {
    setMode(newMode);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Không reset timer, chỉ chuyển tab để xem
  };

  const saveTimeSettings = async () => {
    // Cập nhật thời gian mới cho cả 2 timer nếu đang IDLE
    if (workStatus === TIMER_STATUS.IDLE) {
      setWorkTimeLeft(workMin * 60 + workSec);
    }
    if (breakStatus === TIMER_STATUS.IDLE) {
      setBreakTimeLeft(breakMin * 60 + breakSec);
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Trả về trạng thái và thời gian của timer hiện tại đang xem
  const currentStatus = mode === TIMER_MODES.WORK ? workStatus : breakStatus;
  const currentTimeLeft = mode === TIMER_MODES.WORK ? workTimeLeft : breakTimeLeft;

  return {
    mode,
    status: currentStatus,
    timeLeft: currentTimeLeft,
    workMin, workSec, breakMin, breakSec,
    soundEnabled, workSessions, breakSessions,
    setWorkMin, setWorkSec, setBreakMin, setBreakSec, setSoundEnabled,
    handleStart, handlePause, handleReset, handleModeChange, saveTimeSettings,
  };
};