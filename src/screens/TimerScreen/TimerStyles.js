import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: { 
    width: '90%', 
    maxWidth: 420, 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 20, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowRadius: 8, 
    elevation: 4 
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#2E7D32', 
    marginBottom: 15,
    textAlign: 'center'
  },
  tabs: { 
    flexDirection: 'row', 
    marginBottom: 15 
  },
  tabButton: { 
    flex: 1, 
    paddingVertical: 8, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    backgroundColor: '#f9f9f9', 
    marginHorizontal: 4 
  },
  activeTab: { 
    backgroundColor: '#E8F5E9', 
    borderColor: '#4CAF50' 
  },
  tabText: { 
    textAlign: 'center', 
    color: '#555', 
    fontWeight: '600' 
  },
  activeTabText: { 
    color: '#2E7D32' 
  },
  timerBox: { 
    backgroundColor: '#f5f5f5', 
    borderRadius: 12, 
    paddingVertical: 25, 
    alignItems: 'center', 
    marginBottom: 20 
  },
  timerText: { 
    fontSize: 56, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  statusText: { 
    fontSize: 16, 
    color: '#777', 
    marginTop: 6 
  },
  controls: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 25 
  },
  button: { 
    flex: 1, 
    marginHorizontal: 5, 
    paddingVertical: 10, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  startButton: { 
    backgroundColor: '#2E7D32' 
  },
  pauseButton: { 
    backgroundColor: '#F9A825' 
  },
  resetButton: { 
    backgroundColor: '#E0E0E0' 
  },
  saveButton: { 
    backgroundColor: '#4CAF50', 
    marginTop: 10 
  },
  historyButton: { 
    backgroundColor: '#1976D2', 
    marginTop: 20 
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 15 
  },
  settingBox: { 
    backgroundColor: '#fafafa', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10 
  },
  settingLabel: { 
    fontSize: 16, 
    color: '#333', 
    fontWeight: '600' 
  },
  timeRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8, 
    gap: 6 
  },
  smallLabel: { 
    width: 55, 
    fontWeight: '600', 
    color: '#333' 
  },
  timeInput: { 
    width: 50, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    textAlign: 'center', 
    paddingVertical: 5, 
    fontSize: 16, 
    color: '#333',
    backgroundColor: '#fff'
  },
  unit: { 
    color: '#555', 
    fontSize: 14 
  },
  separator: { 
    fontSize: 20, 
    color: '#777', 
    fontWeight: 'bold' 
  },
  summaryBox: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 5,
    paddingVertical: 10
  },
  summaryText: { 
    fontWeight: '600', 
    color: '#555',
    fontSize: 15
  },
});