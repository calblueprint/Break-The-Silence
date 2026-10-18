import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  'result-row': {
    width: '100%',
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#F1F5F9',
    borderBottomColor: '#E3E2EA',
    borderBottomWidth: 1,
  },
  'result-text': {
    flex: 1,
    marginRight: 16,
  },
  title: {
    color: '#263547',
    fontSize: 16,
    fontWeight: '600',
  },
  'matched-content': {
    marginTop: 4,
    color: 'red',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  'red-text': {
    marginTop: 4,
    color: '#74849A',
    textDecorationLine: 'none',
    fontSize: 13,
  },
});
