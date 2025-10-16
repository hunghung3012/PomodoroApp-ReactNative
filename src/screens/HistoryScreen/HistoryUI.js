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
          <Text style={styles.statIcon}>💻</Text>
        </View>
        <Text style={styles.statValue}>{todayStats.workSessions}</Text>
        <Text style={styles.statLabel}>Phiên làm việc</Text>
      </View>

      <View style={styles.statCard}>
        <View style={styles.statIconContainer}>
          <Text style={styles.statIcon}>🛏️</Text>
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
              const workHeight = (data.work / maxValue) * 120;
              const breakHeight = (data.break / maxValue) * 120;

              return (
                <View key={index} style={styles.hourBar}>
                  <View style={styles.barStack}>
                    {data.work > 0 && (
                      <View
                        style={[
                          styles.barSegment,
                          styles.barWork,
                          { height: Math.max(workHeight, 20) },
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
                          { height: Math.max(breakHeight, 20) },
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
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4A90E2' }]} />
            <Text style={styles.legendText}>Làm việc</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#27AE60' }]} />
            <Text style={styles.legendText}>Nghỉ ngơi</Text>
          </View>
        </View>
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
            const workHeight = (data.work / maxValue) * 100;
            const breakHeight = (data.break / maxValue) * 100;

            return (
              <View key={index} style={styles.dayBar}>
                <View style={styles.barWrapper}>
                  <View style={styles.weekBarStack}>
                    {data.work > 0 && (
                      <View
                        style={[
                          styles.weekBar,
                          styles.weekBarWork,
                          { height: Math.max(workHeight, 4) },
                        ]}
                      >
                        <Text style={styles.weekBarValue}>{data.work}</Text>
                      </View>
                    )}
                    {data.break > 0 && (
                      <View
                        style={[
                          styles.weekBar,
                          styles.weekBarBreak,
                          { height: Math.max(breakHeight, 4) },
                        ]}
                      >
                        <Text style={styles.weekBarValue}>{data.break}</Text>
                      </View>
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
            <Text style={styles.legendText}>Làm việc</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#27AE60' }]} />
            <Text style={styles.legendText}>Nghỉ ngơi</Text>
          </View>
        </View>
      </View>
    );
  };

  const formatSessionTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const renderSessionsTable = () => {
    if (sessions.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔭</Text>
          <Text style={styles.emptyText}>Chưa có phiên nào</Text>
          <Text style={styles.emptySubtext}>
            Bắt đầu timer để ghi nhận hoạt động
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>
          Lịch sử ({sessions.length} phiên)
        </Text>
        
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colType]}>Phiên</Text>
          <Text style={[styles.tableHeaderText, styles.colTime]}>Bắt đầu</Text>
          <Text style={[styles.tableHeaderText, styles.colTime]}>Kết thúc</Text>
          <Text style={[styles.tableHeaderText, styles.colDuration]}>Thời gian</Text>
        </View>

        {/* Table Rows */}
        <ScrollView style={styles.tableBody}>
          {sessions
            .slice()
            .reverse()
            .map((session, index) => {
              const startTime = new Date(session.date);
              const endTime = new Date(startTime.getTime() + session.duration * 1000);
              
              return (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 && styles.tableRowEven,
                  ]}
                >
                  <View style={styles.colType}>
                    <Text style={styles.sessionIcon}>
                      {session.type === 'WORK' ? '💻' : '🛏️'}
                    </Text>
                    <Text style={styles.tableCell}>
                      {session.type === 'WORK' ? 'Làm việc' : 'Nghỉ ngơi'}
                    </Text>
                  </View>
                  <Text style={[styles.tableCell, styles.colTime]}>
                    {formatSessionTime(startTime)}
                  </Text>
                  <Text style={[styles.tableCell, styles.colTime]}>
                    {formatSessionTime(endTime)}
                  </Text>
                  <Text style={[styles.tableCell, styles.colDuration, styles.durationText]}>
                    {formatDuration(session.duration)}
                  </Text>
                </View>
              );
            })}
        </ScrollView>
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

        {/* Table - Only show for Today */}
        {viewMode === 'today' && renderSessionsTable()}
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
    height: 200,
    gap: 12,
    paddingBottom: 16,
  },
  hourBar: {
    alignItems: 'center',
    gap: 8,
  },
  barStack: {
    gap: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    marginTop: 8,
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
  weekBarStack: {
    gap: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  weekBarWork: {
    backgroundColor: '#4A90E2',
  },
  weekBarBreak: {
    backgroundColor: '#27AE60',
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
  // Table Styles
  tableContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f6f8fa',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#e1e8ed',
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2c3e50',
  },
  tableBody: {
    maxHeight: 400,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  tableRowEven: {
    backgroundColor: '#fafbfc',
  },
  tableCell: {
    fontSize: 13,
    color: '#2c3e50',
  },
  colType: {
    flex: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colTime: {
    flex: 2,
  },
  colDuration: {
    flex: 1.5,
    textAlign: 'right',
  },
  sessionIcon: {
    fontSize: 16,
  },
  durationText: {
    fontWeight: '700',
    color: '#4A90E2',
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