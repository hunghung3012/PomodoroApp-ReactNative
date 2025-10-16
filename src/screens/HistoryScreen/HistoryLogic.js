// HistoryLogic.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getSessions, getStatistics, clearAllData } from '../../utils/storage';

export const useHistoryLogic = () => {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({});
  const [viewMode, setViewMode] = useState('today'); // 'today' or 'week'
  const [todayStats, setTodayStats] = useState({
    workSessions: 0,
    breakSessions: 0,
    totalMinutes: 0,
    workMinutes: 0,
    breakMinutes: 0,
  });

  useEffect(() => {
    loadData();
  }, [viewMode]);

  const loadData = async () => {
    const allSessions = await getSessions();
    const statistics = await getStatistics(7);

    if (viewMode === 'today') {
      const today = new Date().toDateString();
      const todaySessions = allSessions.filter(
        (s) => new Date(s.date).toDateString() === today
      );
      setSessions(todaySessions);
      calculateTodayStats(todaySessions);
    } else {
      // Lấy sessions trong 7 ngày gần nhất
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekSessions = allSessions.filter(
        (s) => new Date(s.date) >= weekAgo
      );
      setSessions(weekSessions);
    }

    setStats(statistics);
  };

  const calculateTodayStats = (todaySessions) => {
    const workSessions = todaySessions.filter((s) => s.type === 'WORK');
    const breakSessions = todaySessions.filter((s) => s.type === 'BREAK');
    
    const workMinutes = Math.round(
      workSessions.reduce((sum, s) => sum + s.duration / 60, 0)
    );
    const breakMinutes = Math.round(
      breakSessions.reduce((sum, s) => sum + s.duration / 60, 0)
    );

    setTodayStats({
      workSessions: workSessions.length,
      breakSessions: breakSessions.length,
      totalMinutes: workMinutes + breakMinutes,
      workMinutes,
      breakMinutes,
    });
  };

  const handleClearAll = () => {
    Alert.alert(
      'Xóa tất cả dữ liệu?',
      'Bạn có chắc muốn xóa toàn bộ lịch sử? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            loadData();
          },
        },
      ]
    );
  };

  const handleModeChange = (mode) => {
    setViewMode(mode);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  // Tính toán dữ liệu cho biểu đồ tuần
  const getWeekChartData = () => {
    const chartData = [];
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      
      const daySessions = sessions.filter(
        (s) => new Date(s.date).toDateString() === dateString
      );
      
      const workCount = daySessions.filter((s) => s.type === 'WORK').length;
      const breakCount = daySessions.filter((s) => s.type === 'BREAK').length;
      
      chartData.push({
        day: days[date.getDay()],
        date: date.getDate(),
        work: workCount,
        break: breakCount,
        total: workCount + breakCount,
      });
    }
    
    return chartData;
  };

  // Tính toán dữ liệu cho biểu đồ hôm nay (theo giờ)
  const getTodayChartData = () => {
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      work: 0,
      break: 0,
    }));

    sessions.forEach((session) => {
      const hour = new Date(session.date).getHours();
      if (session.type === 'WORK') {
        hourlyData[hour].work += 1;
      } else {
        hourlyData[hour].break += 1;
      }
    });

    // Chỉ lấy các giờ có hoạt động
    return hourlyData.filter((data) => data.work > 0 || data.break > 0);
  };

  return {
    sessions,
    stats,
    viewMode,
    todayStats,
    handleModeChange,
    handleClearAll,
    formatDate,
    formatTime,
    formatDuration,
    getWeekChartData,
    getTodayChartData,
    loadData,
  };
};