// HistoryUI.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export const HistoryUI = ({
  sessions,
  viewMode,
  todayStats,
  handleModeChange,
  handleClearAll,
  formatTime,
  formatDuration,
  getWeekChartData,
  getTodayChartData,
  navigation,
}) => {
  const renderTodayStats = () => (
    <View style={styles.statsGrid}>
      <View style={styles.statCard}>
        <View style={styles.statIconContainer}>
          <Text style={styles.statIcon}></Text>
        </View>
        <Text style={styles.statValue}>{todayStats.workSessions}</Text>
        <Text style={styles.statLabel}>Phiên làm việc</Text>
      </View>

      <View style={styles.statCard}>
        <View style={styles.statIconContainer}>
          <Text style={styles.statIcon}>☕</Text>
        </View>
        <Text style={styles.statValue}>{todayStats.breakSessions}</Text>
        <Text style={styles.statLabel}>Phiên nghỉ</Text>
      </View>

      <View style={[styles.statCard, styles.statCardWide]}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{todayStats.workMinutes}</Text>
            <Text style={styles.statLabel}>Phút làm việc</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{todayStats.breakMinutes}</Text>
            <Text style={styles.statLabel}>Phút nghỉ</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTodayChart = () => {
    const chartData = getTodayChartData();
    if (chartData.length === 0) {
      return (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyChartText}>Chưa có hoạt động nào hôm nay</Text>
        </View>
      );
    }

    const maxValue = Math.max(...chartData.map((d) => d.work + d.break));

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Hoạt động trong ngày</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chartContent}>
            {chartData.map((data, index) => {
              const totalHeight = ((data.work + data.break) / maxValue) * 120;
              const workHeight = (data.work / (data.work + data.break)) * totalHeight;
              const breakHeight = totalHeight - workHeight;

              return (
                <View key={index} style={styles.hourBar}>
                  <View style={styles.barStack}>
                    {data.work > 0 && (
                      <View
                        style={[
                          styles.barSegment,
                          styles.barWork,
                          { height: workHeight },
                        ]}
                      >
                        <Text style={styles.barValue}>{data.work}</Text>
                      </View>
                    )}
                    {data.break > 0 && (
                      <View
                        style={[
                          styles.barSegment,
                          styles.barBreak,
                          { height: breakHeight },
                        ]}
                      >
                        <Text style={styles.barValue}>{data.break}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.hourLabel}>{data.hour}h</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderWeekChart = () => {
    const chartData = getWeekChartData();
    const maxValue = Math.max(...chartData.map((d) => d.total), 1);

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Thống kê 7 ngày</Text>
        <View style={styles.weekChartContent}>
          {chartData.map((data, index) => {
            const barHeight = (data.total / maxValue) * 100;

            return (
              <View key={index} style={styles.dayBar}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.weekBar,
                      {
                        height: Math.max(barHeight, 4),
                        backgroundColor:
                          data.total > 0 ? '#4A90E2' : '#E8F4FF',
                      },
                    ]}
                  >
                    {data.total > 0 && (
                      <Text style={styles.weekBarValue}>{data.total}</Text>
                    )}
                  </View>
                </View>
                <Text style={styles.dayLabel}>{data.day}</Text>
                <Text style={styles.dateLabel}>{data.date}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4A90E2' }]} />
            <Text style={styles.legendText}>Tổng phiên</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSessionsList = () => {
    if (sessions.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Chưa có phiên nào</Text>
          <Text style={styles.emptySubtext}>
            Bắt đầu timer để ghi nhận hoạt động
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.sessionsList}>
        <Text style={styles.sessionsTitle}>
          Lịch sử ({sessions.length} phiên)
        </Text>
        {sessions
          .slice()
          .reverse()
          .map((session, index) => (
            <View
              key={index}
              style={[
                styles.sessionCard,
                session.type === 'WORK'
                  ? styles.sessionWork
                  : styles.sessionBreak,
              ]}
            >
              <View style={styles.sessionHeader}>
                <View style={styles.sessionTypeContainer}>
                  <Text style={styles.sessionIcon}>
                    {session.type === 'WORK' ? '🔥' : '☕'}
                  </Text>
                  <Text style={styles.sessionType}>
                    {session.type === 'WORK' ? 'Làm việc' : 'Nghỉ ngơi'}
                  </Text>
                </View>
                <Text style={styles.sessionDuration}>
                  {formatDuration(session.duration)}
                </Text>
              </View>
              <Text style={styles.sessionTime}>{formatTime(session.date)}</Text>
            </View>
          ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử</Text>
        <TouchableOpacity onPress={handleClearAll} style={styles.deleteButton}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            viewMode === 'today' && styles.modeButtonActive,
          ]}
          onPress={() => handleModeChange('today')}
        >
          <Text
            style={[
              styles.modeButtonText,
              viewMode === 'today' && styles.modeButtonTextActive,
            ]}
          >
            Hôm nay
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            viewMode === 'week' && styles.modeButtonActive,
          ]}
          onPress={() => handleModeChange('week')}
        >
          <Text
            style={[
              styles.modeButtonText,
              viewMode === 'week' && styles.modeButtonTextActive,
            ]}
          >
            Tuần này
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        {viewMode === 'today' && renderTodayStats()}

        {/* Chart */}
        {viewMode === 'today' ? renderTodayChart() : renderWeekChart()}

        {/* Sessions List */}
        {renderSessionsList()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#2c3e50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  deleteButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 20,
  },
  modeSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  modeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: (width - 56) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardWide: {
    width: width - 40,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E8F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e1e8ed',
    marginHorizontal: 16,
  },
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  emptyChart: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChartText: {
    color: '#95a5a6',
    fontSize: 14,
  },
  chartContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
    gap: 12,
  },
  hourBar: {
    alignItems: 'center',
    gap: 8,
  },
  barStack: {
    gap: 4,
    alignItems: 'center',
  },
  barSegment: {
    width: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 20,
  },
  barWork: {
    backgroundColor: '#4A90E2',
  },
  barBreak: {
    backgroundColor: '#27AE60',
  },
  barValue: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  hourLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  weekChartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: 16,
  },
  dayBar: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  weekBar: {
    width: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 4,
  },
  weekBarValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
  },
  dateLabel: {
    fontSize: 10,
    color: '#95a5a6',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  sessionsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sessionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sessionWork: {
    borderLeftColor: '#4A90E2',
  },
  sessionBreak: {
    borderLeftColor: '#27AE60',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionIcon: {
    fontSize: 18,
  },
  sessionType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
  },
  sessionDuration: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A90E2',
  },
  sessionTime: {
    fontSize: 13,
    color: '#95a5a6',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#95a5a6',
  },
});