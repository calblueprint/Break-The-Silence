import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export default StyleSheet.create({
  disabledStyle: {
    borderRadius: 5,
    backgroundColor: 'gray',
  },
  buttonStyle: {
    borderRadius: 5,
    backgroundColor: colors.black,
  },
  titleStyle: {
    paddingHorizontal: 24,
    paddingVertical: 5,
    color: colors.white,
  },
  disabledTitleStyle: {
    paddingHorizontal: 24,
    paddingVertical: 5,
    color: colors.black,
  },
});
