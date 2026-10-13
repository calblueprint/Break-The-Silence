import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export default StyleSheet.create({
  disabledStyle: {
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  buttonStyle: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
  },
  titleStyle: {
    paddingHorizontal: 24,
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  disabledTitleStyle: {
    paddingHorizontal: 24,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
