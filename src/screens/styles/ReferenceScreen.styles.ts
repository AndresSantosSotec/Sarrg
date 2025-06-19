import { StyleSheet, Platform } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scroll: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 8,
  },
  text: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 12,
  },
  source: {
    fontSize: 14,
    color: '#1d4ed8',
    marginBottom: 8,
  },
});
export default styles;