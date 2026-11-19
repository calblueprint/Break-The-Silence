import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';
import { montserratBold } from '@/styles/typography';

export default StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6.714,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.safeExit,
    shadowColor: colors.safeExitShadow,
    shadowOffset: { width: 0, height: 2.686 },
    shadowOpacity: 0.16,
    shadowRadius: 5.37,
    elevation: 6,
  },
  buttonText: {
    ...montserratBold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.white,
  },
});
