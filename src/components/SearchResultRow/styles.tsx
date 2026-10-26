import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export default StyleSheet.create({
  'result-row': {
    width: '100%',
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: colors.inputBackground,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  'result-text': {
    flex: 1,
    marginRight: 16,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  'matched-content': {
    marginTop: 4,
    color: colors.error,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  'red-text': {
    marginTop: 4,
    color: colors.textMuted,
    textDecorationLine: 'none',
    fontSize: 13,
  },
});
