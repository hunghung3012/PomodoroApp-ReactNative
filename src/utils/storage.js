import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SESSIONS: '@pomodoro_sessions',
  SETTINGS: '@pomodoro_settings',
};

// Lưu một phiên làm việc
export const saveSession = async (session) => {
  try {
    const existingSessions = await getSessions();
    const updatedSessions = [...existingSessions, session];
    await AsyncStorage.setItem(
      STORAGE_KEYS.SESSIONS,
      JSON.stringify(updatedSessions)
    );
    return true;
  } catch (error) {
    console.error('Error saving session:', error);
    return false;
  }
};

// Lấy tất cả phiên làm việc
export const getSessions = async () => {
  try {
    const sessions = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
};

// Lấy phiên làm việc theo ngày
export const getSessionsByDate = async (date) => {
  try {
    const allSessions = await getSessions();
    const targetDate = new Date(date).toDateString();
    return allSessions.filter(
      (session) => new Date(session.date).toDateString() === targetDate
    );
  } catch (error) {
    console.error('Error getting sessions by date:', error);
    return [];
  }
};

// Lấy thống kê
export const getStatistics = async (days = 7) => {
  try {
    const allSessions = await getSessions();
    const now = new Date();
    const stats = {};

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];

      const daySessions = allSessions.filter((session) => {
        const sessionDate = new Date(session.date).toISOString().split('T')[0];
        return sessionDate === dateKey;
      });

      stats[dateKey] = {
        work: daySessions.filter((s) => s.type === 'WORK').length,
        break: daySessions.filter((s) => s.type === 'BREAK').length,
        total: daySessions.length,
      };
    }

    return stats;
  } catch (error) {
    console.error('Error getting statistics:', error);
    return {};
  }
};

// Lưu cài đặt
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

// Lấy cài đặt
export const getSettings = async () => {
  try {
    const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
};

// Xóa tất cả dữ liệu
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.SESSIONS, STORAGE_KEYS.SETTINGS]);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};
